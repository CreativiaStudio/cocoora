import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { sendGenericSMS } from "@/lib/twilio";

export const dynamic = "force-dynamic";

type DbAppointmentStatus =
  | "richiesto"
  | "confermato"
  | "completato"
  | "annullato"
  | "no_show";

type DbPaymentMethod =
  | "contanti"
  | "pos"
  | "stripe"
  | "klarna"
  | "paypal"
  | "bonifico"
  | "assegno"
  | "altro";

type DbInstallmentType = "acconto" | "rata" | "saldo" | "conguaglio";

const VALID_PAYMENT_METHODS = new Set<DbPaymentMethod>([
  "contanti",
  "pos",
  "stripe",
  "klarna",
  "paypal",
  "bonifico",
  "assegno",
  "altro",
]);

const VALID_INSTALLMENT_TYPES = new Set<DbInstallmentType>([
  "acconto",
  "rata",
  "saldo",
  "conguaglio",
]);

function deriveLiveStatus(dbStatus: string, notes?: string | null): string {
  if (
    dbStatus === "completato" ||
    dbStatus === "annullato" ||
    dbStatus === "no_show"
  ) {
    return dbStatus;
  }
  const n = notes || "";
  if (n.includes("[InizioVisita:") && !n.includes("[FineVisita:")) {
    return "in_visita";
  }
  if (n.includes("[Arrivo:") && !n.includes("[InizioVisita:")) {
    return "in_attesa";
  }
  return dbStatus;
}

function stripFlowTags(
  notes: string,
  tags: Array<
    "Arrivo" | "InizioVisita" | "FineVisita" | "Attesa" | "Durata" | "Reminder1h" | "Incasso"
  >
): string {
  let out = notes || "";
  for (const tag of tags) {
    const re = new RegExp(`\\s*\\[${tag}:[^\\]]*\\]`, "g");
    out = out.replace(re, "");
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

function getRomeHHMM(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    const [
      { data: rawAppointments, error: appErr },
      { data: rooms },
      { data: doctors },
      { data: patients },
      { data: documents },
      { data: installments },
      { data: plans },
    ] = await Promise.all([
      supabase
        .from("appointments")
        .select(
          `
          id,
          patient_id,
          doctor_id,
          room_id,
          treatment_plan_id,
          starts_at,
          ends_at,
          status,
          notes,
          is_first_visit,
          patient_profiles ( id, patient_code, first_name, last_name, phone, email, fiscal_code, birth_date, gender, notes ),
          doctors ( id, slug, full_name, title, specialty_slug ),
          clinic_rooms ( id, name, slug )
        `
        )
        .order("starts_at", { ascending: true }),
      supabase.from("clinic_rooms").select("*").order("slug"),
      supabase
        .from("doctors")
        .select("*")
        .eq("is_active", true)
        .order("full_name"),
      supabase.from("patient_profiles").select("*").order("last_name"),
      supabase
        .from("clinical_documents")
        .select("*, patient_profiles(id, patient_code, first_name, last_name)")
        .order("report_date", { ascending: false })
        .limit(20),
      supabase
        .from("treatment_installments")
        .select("*, patient_profiles(id, patient_code, first_name, last_name)")
        .order("due_date", { ascending: true }),
      supabase
        .from("patient_treatment_plans")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (appErr) throw appErr;

    const appointments = (rawAppointments || []).map((a) => ({
      ...a,
      db_status: a.status,
      status: deriveLiveStatus(a.status, a.notes),
    }));

    return NextResponse.json({
      appointments,
      rooms: rooms || [],
      doctors: doctors || [],
      patients: patients || [],
      documents: documents || [],
      installments: installments || [],
      plans: plans || [],
    });
  } catch (err: any) {
    console.error("Errore recupero reception desk:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getServiceSupabase();
    const body = await request.json();
    const { action } = body;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. AVANZAMENTO STATO CLINICO LIVE (con mapping su enum Postgres valido)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "update_status") {
      const { appointmentId, status, reason } = body;
      if (!appointmentId || !status) {
        return NextResponse.json(
          { error: "Parametri appointmentId e status obbligatori" },
          { status: 400 }
        );
      }

      const now = new Date();
      const nowIso = now.toISOString();

      const { data: currentApp } = await supabase
        .from("appointments")
        .select("id, status, notes, patient_id, doctor_id, room_id")
        .eq("id", appointmentId)
        .maybeSingle();

      let updatedNotes = currentApp?.notes || "";
      let dbStatusToSave: DbAppointmentStatus = "confermato";
      let waitMinutes: number | undefined;
      let durationMinutes: number | undefined;

      if (status === "in_attesa") {
        dbStatusToSave = "confermato";
        updatedNotes = stripFlowTags(updatedNotes, [
          "Arrivo",
          "InizioVisita",
          "FineVisita",
          "Attesa",
          "Durata",
        ]);
        updatedNotes = `${updatedNotes} [Arrivo: ${nowIso}]`.trim();

        await supabase.from("crm_audit_log").insert({
          actor_role: "receptionist",
          table_name: "clinical_flow",
          record_id: appointmentId,
          action: "PATIENT_ARRIVED",
          diff: {
            appointmentId,
            patientId: currentApp?.patient_id,
            doctorId: currentApp?.doctor_id,
            roomId: currentApp?.room_id,
            arrived_at: nowIso,
          },
        });
      } else if (status === "in_visita") {
        dbStatusToSave = "confermato";
        const arrivoMatch = updatedNotes.match(/\[Arrivo:\s*([^\]]+)\]/);
        if (arrivoMatch && arrivoMatch[1]) {
          const arrivoTime = new Date(arrivoMatch[1].trim()).getTime();
          waitMinutes = Number.isFinite(arrivoTime)
            ? Math.max(1, Math.round((now.getTime() - arrivoTime) / 60000))
            : 5;
        } else {
          waitMinutes = 5;
        }

        updatedNotes = stripFlowTags(updatedNotes, [
          "InizioVisita",
          "FineVisita",
          "Attesa",
          "Durata",
        ]);
        updatedNotes = `${updatedNotes} [InizioVisita: ${nowIso}] [Attesa: ${waitMinutes}m]`.trim();

        await supabase.from("crm_audit_log").insert({
          actor_role: "receptionist",
          table_name: "clinical_flow",
          record_id: appointmentId,
          action: "VISIT_STARTED",
          diff: {
            appointmentId,
            patientId: currentApp?.patient_id,
            doctorId: currentApp?.doctor_id,
            roomId: currentApp?.room_id,
            visit_started_at: nowIso,
            wait_minutes: waitMinutes,
          },
        });
      } else if (status === "completato") {
        dbStatusToSave = "completato";
        const inizioMatch = updatedNotes.match(/\[InizioVisita:\s*([^\]]+)\]/);
        if (inizioMatch && inizioMatch[1]) {
          const inizioTime = new Date(inizioMatch[1].trim()).getTime();
          durationMinutes = Number.isFinite(inizioTime)
            ? Math.max(1, Math.round((now.getTime() - inizioTime) / 60000))
            : 45;
        } else {
          durationMinutes = 45;
        }

        updatedNotes = stripFlowTags(updatedNotes, ["FineVisita", "Durata"]);
        updatedNotes = `${updatedNotes} [FineVisita: ${nowIso}] [Durata: ${durationMinutes}m]`.trim();

        await supabase.from("crm_audit_log").insert({
          actor_role: "receptionist",
          table_name: "clinical_flow",
          record_id: appointmentId,
          action: "VISIT_COMPLETED",
          diff: {
            appointmentId,
            patientId: currentApp?.patient_id,
            doctorId: currentApp?.doctor_id,
            roomId: currentApp?.room_id,
            completed_at: nowIso,
            duration_minutes: durationMinutes,
          },
        });
      } else if (status === "confermato") {
        dbStatusToSave = "confermato";
        updatedNotes = stripFlowTags(updatedNotes, [
          "Arrivo",
          "InizioVisita",
          "FineVisita",
          "Attesa",
          "Durata",
        ]);
      } else if (
        status === "annullato" ||
        status === "no_show" ||
        status === "richiesto"
      ) {
        dbStatusToSave = status;
        if (reason) {
          updatedNotes = `${updatedNotes} [Motivo: ${reason}]`.trim();
        }
      } else {
        return NextResponse.json(
          { error: `Stato non valido: ${status}` },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("appointments")
        .update({
          status: dbStatusToSave,
          notes: updatedNotes,
          updated_at: nowIso,
        })
        .eq("id", appointmentId)
        .select();

      if (error) throw error;

      const mapped = (data || []).map((r) => ({
        ...r,
        status: deriveLiveStatus(r.status, r.notes),
      }));

      return NextResponse.json({
        success: true,
        updated: mapped,
        data: mapped[0]
          ? { ...mapped[0], status: deriveLiveStatus(data![0].status, data![0].notes) }
          : null,
        telemetry: { waitMinutes, durationMinutes },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. REMINDER -1H (WhatsApp PC / SMS Twilio)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "send_reminder") {
      const {
        appointmentId,
        channel = "whatsapp_pc",
        messageText,
        sendRealSms = false,
        phone,
      } = body;

      if (!appointmentId) {
        return NextResponse.json(
          { error: "Parametro appointmentId obbligatorio" },
          { status: 400 }
        );
      }

      const hhmm = getRomeHHMM(new Date());
      const channelLabel = channel === "sms_twilio" ? "SMS" : "WhatsApp";

      const { data: currentApp } = await supabase
        .from("appointments")
        .select("id, notes, patient_id, doctor_id")
        .eq("id", appointmentId)
        .maybeSingle();

      const cleanedNotes = stripFlowTags(currentApp?.notes || "", ["Reminder1h"]);
      const updatedNotes = `${cleanedNotes} [Reminder1h: ${hhmm} via ${channelLabel}]`.trim();

      const { error: updErr } = await supabase
        .from("appointments")
        .update({
          notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (updErr) throw updErr;

      await supabase.from("crm_audit_log").insert({
        actor_role: "receptionist",
        table_name: "clinical_flow",
        record_id: appointmentId,
        action: "REMINDER_1H_SENT",
        diff: {
          appointmentId,
          patientId: currentApp?.patient_id,
          doctorId: currentApp?.doctor_id,
          channel,
          reminderTime: hhmm,
          sendRealSms: Boolean(sendRealSms),
        },
      });

      let smsResult = undefined;
      if (channel === "sms_twilio" && sendRealSms && phone && messageText) {
        try {
          smsResult = await sendGenericSMS(phone, messageText);
        } catch (smsErr: any) {
          smsResult = {
            success: false,
            error: smsErr?.message || "Errore invio SMS",
          };
        }
      }

      return NextResponse.json({
        success: true,
        notes: updatedNotes,
        reminderTime: hhmm,
        ...(smsResult ? { smsResult } : {}),
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. REGISTRAZIONE PAGAMENTO / ACCONTO / COPERTURA PERCORSO SALUTE CLUB
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "record_payment") {
      const nowIso = new Date().toISOString();
      const rawMethod = String(body.paymentMethod || "pos")
        .toLowerCase()
        .trim() as DbPaymentMethod;
      const validMethod: DbPaymentMethod = VALID_PAYMENT_METHODS.has(rawMethod)
        ? rawMethod
        : "pos";

      // Modalità 1: Saldo di una rata esistente
      if (body.installmentId) {
        const { installmentId, invoiceMode, notes, appointmentId } = body;

        const { data: existingInst } = await supabase
          .from("treatment_installments")
          .select("*")
          .eq("id", installmentId)
          .maybeSingle();

        const modeTag = invoiceMode ? `[Fatturazione: ${invoiceMode}]` : "";
        const mergedNotes = [notes ?? existingInst?.notes ?? "", modeTag]
          .filter(Boolean)
          .join(" ")
          .trim();

        const { data, error } = await supabase
          .from("treatment_installments")
          .update({
            status: "pagato",
            paid_at: nowIso,
            payment_method: validMethod,
            receipt_number:
              existingInst?.receipt_number ||
              `RIC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            notes: mergedNotes || null,
          })
          .eq("id", installmentId)
          .select();

        if (error) throw error;

        const paidInst = data?.[0] || existingInst;
        let updatedPlan = null;
        if (paidInst?.plan_id) {
          const { data: pl } = await supabase
            .from("patient_treatment_plans")
            .select("*")
            .eq("id", paidInst.plan_id)
            .maybeSingle();
          updatedPlan = pl;
        }

        if (appointmentId && paidInst?.amount) {
          const { data: appRow } = await supabase
            .from("appointments")
            .select("notes")
            .eq("id", appointmentId)
            .maybeSingle();
          const baseNotes = stripFlowTags(appRow?.notes || "", ["Incasso"]);
          await supabase
            .from("appointments")
            .update({
              notes: `${baseNotes} [Incasso: €${Number(paidInst.amount)} (${validMethod.toUpperCase()})]`.trim(),
              updated_at: nowIso,
            })
            .eq("id", appointmentId);
        }

        return NextResponse.json({
          success: true,
          updated: data,
          installment: paidInst,
          plan: updatedPlan,
        });
      }

      // Modalità 2: Nuovo pagamento / acconto parziale / prestazione singola / copertura Club
      const {
        patientId,
        planId,
        amount,
        installmentType = "acconto",
        invoiceMode = "immediata",
        notes = "",
        singleVisitTitle,
        appointmentId,
      } = body;

      const numericAmount = Number(amount || 0);

      // 2a. Visita inclusa in Percorso Salute Cocoora Club o importo €0
      if (invoiceMode === "inclusa_club" || numericAmount === 0) {
        if (appointmentId) {
          const { data: appRow } = await supabase
            .from("appointments")
            .select("notes")
            .eq("id", appointmentId)
            .maybeSingle();
          const cleaned = stripFlowTags(appRow?.notes || "", ["Incasso"]);
          const updatedAppNotes = `${cleaned} [Incasso: Inclusa in Percorso Cocoora Club €0]`.trim();
          await supabase
            .from("appointments")
            .update({
              notes: updatedAppNotes,
              updated_at: nowIso,
            })
            .eq("id", appointmentId);
        }

        await supabase.from("crm_audit_log").insert({
          actor_role: "receptionist",
          table_name: "clinical_flow",
          record_id: appointmentId || patientId || "club_included",
          action: "CLUB_INCLUDED_VISIT",
          diff: {
            patientId: patientId || null,
            planId: planId || null,
            appointmentId: appointmentId || null,
            invoiceMode: "inclusa_club",
            amount: 0,
            notes,
          },
        });

        return NextResponse.json({
          success: true,
          mode: "inclusa_club",
        });
      }

      if (!(numericAmount > 0)) {
        return NextResponse.json(
          { error: "L'importo deve essere maggiore di zero" },
          { status: 400 }
        );
      }

      // Risolvi patientId (anche da appointmentId se non esplicitato)
      let resolvedPatientId: string | null = patientId || null;
      if (!resolvedPatientId && appointmentId) {
        const { data: appRow } = await supabase
          .from("appointments")
          .select("patient_id")
          .eq("id", appointmentId)
          .maybeSingle();
        resolvedPatientId = appRow?.patient_id || null;
      }

      if (!resolvedPatientId) {
        return NextResponse.json(
          { error: "Parametro patientId obbligatorio per registrare un incasso" },
          { status: 400 }
        );
      }

      const rawInstType = String(installmentType || "acconto")
        .toLowerCase()
        .trim() as DbInstallmentType;
      const validInstType: DbInstallmentType = VALID_INSTALLMENT_TYPES.has(
        rawInstType
      )
        ? rawInstType
        : "acconto";

      let targetPlanId: string | null = planId || null;

      // Se non è fornito un piano esistente, crea un piano prestazione singola
      if (!targetPlanId) {
        const { data: newPlan, error: newPlanErr } = await supabase
          .from("patient_treatment_plans")
          .insert({
            plan_code: "",
            patient_id: resolvedPatientId,
            title: singleVisitTitle || "Prestazione Clinica in Sede",
            total_amount: numericAmount,
            discount_amount: 0,
            net_total: numericAmount,
            status: "attivo",
            start_date: "2026-11-12",
            notes: notes || null,
          })
          .select()
          .single();

        if (newPlanErr) throw newPlanErr;
        targetPlanId = newPlan.id;
      }

      // Calcola nextInstallmentNumber dal MAX(installment_number) del piano
      const { data: maxRows } = await supabase
        .from("treatment_installments")
        .select("installment_number")
        .eq("plan_id", targetPlanId)
        .order("installment_number", { ascending: false })
        .limit(1);

      const nextInstallmentNumber =
        maxRows && maxRows.length > 0
          ? Number(maxRows[0].installment_number) + 1
          : 1;

      const invoiceTag =
        invoiceMode === "saldo_assicurazione"
          ? "[Fattura a Saldo / Rimborso Assicurativo]"
          : invoiceMode === "immediata"
          ? "[Fattura Immediata]"
          : `[Fatturazione: ${invoiceMode}]`;
      const notesWithInvoiceMode = `${notes || ""} ${invoiceTag}`.trim();
      const receiptNumber = `RIC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const todayIsoDate = new Date().toISOString().slice(0, 10);

      const { data: insertedInst, error: instErr } = await supabase
        .from("treatment_installments")
        .insert({
          plan_id: targetPlanId,
          patient_id: resolvedPatientId,
          installment_number: nextInstallmentNumber,
          installment_type: validInstType,
          amount: numericAmount,
          due_date: todayIsoDate,
          status: "pagato",
          payment_method: validMethod,
          paid_at: nowIso,
          receipt_number: receiptNumber,
          notes: notesWithInvoiceMode,
        })
        .select()
        .single();

      if (instErr) throw instErr;

      // Rileggi il piano aggiornato dal trigger recalc_plan_financials
      let { data: updatedPlan } = await supabase
        .from("patient_treatment_plans")
        .select("*")
        .eq("id", targetPlanId)
        .maybeSingle();

      // Riallinea eventuali rate 'previsto' residue del piano così lo scadenzario resta coerente al centesimo
      if (updatedPlan) {
        const currentBalance = Number(updatedPlan.balance_due || 0);
        const { data: openPreviste } = await supabase
          .from("treatment_installments")
          .select("id, amount")
          .eq("plan_id", targetPlanId)
          .eq("status", "previsto")
          .order("installment_number", { ascending: true });

        if (openPreviste && openPreviste.length > 0) {
          if (currentBalance <= 0) {
            await supabase
              .from("treatment_installments")
              .update({ status: "annullato" })
              .in(
                "id",
                openPreviste.map((r) => r.id)
              );
          } else if (openPreviste.length === 1 && Number(openPreviste[0].amount) > currentBalance) {
            await supabase
              .from("treatment_installments")
              .update({ amount: currentBalance })
              .eq("id", openPreviste[0].id);
          }
        }
      }

      // Accoda tag [Incasso: ...] alle note dell'appuntamento se passato
      if (appointmentId) {
        const { data: appRow } = await supabase
          .from("appointments")
          .select("notes")
          .eq("id", appointmentId)
          .maybeSingle();
        const cleaned = stripFlowTags(appRow?.notes || "", ["Incasso"]);
        const updatedAppNotes = `${cleaned} [Incasso: €${numericAmount} (${validMethod.toUpperCase()})]`.trim();
        await supabase
          .from("appointments")
          .update({
            notes: updatedAppNotes,
            updated_at: nowIso,
          })
          .eq("id", appointmentId);
      }

      // Tracciamento non bloccante verso Fatture in Cloud
      if (
        invoiceMode === "immediata" ||
        invoiceMode === "saldo_assicurazione"
      ) {
        try {
          await supabase.from("fatture_in_cloud_sync").insert({
            idempotency_key: `inst:${insertedInst.id}`,
            patient_id: resolvedPatientId,
            plan_id: targetPlanId,
            installment_id: insertedInst.id,
            document_type: "fattura",
            issue_reason:
              invoiceMode === "saldo_assicurazione"
                ? "rimborso_assicurativo"
                : "acconto",
            amount: numericAmount,
            status:
              invoiceMode === "saldo_assicurazione" ? "skipped" : "pending",
          });
        } catch (ficErr) {
          console.warn("Avviso non bloccante sync Fatture in Cloud:", ficErr);
        }
      }

      // Rileggi piano finale
      const { data: finalPlan } = await supabase
        .from("patient_treatment_plans")
        .select("*")
        .eq("id", targetPlanId)
        .maybeSingle();

      return NextResponse.json({
        success: true,
        installment: insertedInst,
        plan: finalPlan || updatedPlan,
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. RESET DEMO OGGI (12 NOVEMBRE 2026) — 1-CLICK IDEMPOTENTE
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "reset_demo_today") {
      // a) Ripristino piano PT-2026-0058 di Laura Ferri (Versato €800, Residuo €600)
      const { data: lauraPlan } = await supabase
        .from("patient_treatment_plans")
        .select("id, patient_id")
        .eq("plan_code", "PT-2026-0058")
        .maybeSingle();

      if (lauraPlan) {
        await supabase
          .from("fatture_in_cloud_sync")
          .delete()
          .eq("plan_id", lauraPlan.id);

        await supabase
          .from("treatment_installments")
          .delete()
          .eq("plan_id", lauraPlan.id)
          .gt("installment_number", 3);

        const { data: inst3 } = await supabase
          .from("treatment_installments")
          .select("id")
          .eq("plan_id", lauraPlan.id)
          .eq("installment_number", 3)
          .maybeSingle();

        if (inst3) {
          await supabase
            .from("treatment_installments")
            .update({
              installment_type: "rata",
              amount: 600,
              due_date: "2026-11-15",
              status: "previsto",
              payment_method: null,
              paid_at: null,
              receipt_number: null,
              notes: null,
            })
            .eq("id", inst3.id);
        } else {
          await supabase.from("treatment_installments").insert({
            plan_id: lauraPlan.id,
            patient_id: lauraPlan.patient_id,
            installment_number: 3,
            installment_type: "rata",
            amount: 600,
            due_date: "2026-11-15",
            status: "previsto",
          });
        }

        await supabase
          .from("patient_treatment_plans")
          .update({
            total_amount: 1400,
            discount_amount: 0,
            net_total: 1400,
            paid_total: 800,
            balance_due: 600,
            status: "attivo",
            payment_status: "parzialmente_pagato",
          })
          .eq("id", lauraPlan.id);
      }

      // b) Ripristino eventuale piano PT-2026-0064 di Giulia Esposito
      const { data: giuliaPlan } = await supabase
        .from("patient_treatment_plans")
        .select("id")
        .eq("plan_code", "PT-2026-0064")
        .maybeSingle();

      if (giuliaPlan) {
        await supabase
          .from("treatment_installments")
          .delete()
          .eq("plan_id", giuliaPlan.id)
          .gt("installment_number", 3);

        await supabase
          .from("treatment_installments")
          .update({
            amount: 600,
            status: "previsto",
            payment_method: null,
            paid_at: null,
            receipt_number: null,
          })
          .eq("plan_id", giuliaPlan.id)
          .in("installment_number", [2, 3]);

        await supabase
          .from("patient_treatment_plans")
          .update({
            total_amount: 1800,
            discount_amount: 0,
            net_total: 1800,
            paid_total: 600,
            balance_due: 1200,
            status: "attivo",
            payment_status: "parzialmente_pagato",
          })
          .eq("id", giuliaPlan.id);
      }

      // c) Rimozione eventuali piani singoli creati nei test del 12/11/2026
      const { data: extraPlans } = await supabase
        .from("patient_treatment_plans")
        .select("id, plan_code")
        .eq("start_date", "2026-11-12");

      const canonicalPlanCodes = new Set([
        "PT-2026-0058",
        "PT-2026-0064",
        "PT-2026-0042",
      ]);
      const extraPlanIds = (extraPlans || [])
        .filter((p) => !canonicalPlanCodes.has(p.plan_code))
        .map((p) => p.id);

      if (extraPlanIds.length > 0) {
        await supabase
          .from("fatture_in_cloud_sync")
          .delete()
          .in("plan_id", extraPlanIds);
        await supabase
          .from("patient_treatment_plans")
          .delete()
          .in("id", extraPlanIds);
      }

      // d) Riallineamento dei 6 appuntamenti demo del 2026-11-12
      const [
        { data: pts },
        { data: docs },
        { data: rms },
        { data: allPlans },
      ] = await Promise.all([
        supabase.from("patient_profiles").select("id, patient_code"),
        supabase.from("doctors").select("id, slug"),
        supabase.from("clinic_rooms").select("id, slug"),
        supabase.from("patient_treatment_plans").select("id, plan_code"),
      ]);

      const ptByCode = Object.fromEntries(
        (pts || []).map((p) => [p.patient_code, p.id])
      );
      const docBySlug = Object.fromEntries(
        (docs || []).map((d) => [d.slug, d.id])
      );
      const roomBySlug = Object.fromEntries(
        (rms || []).map((r) => [r.slug, r.id])
      );
      const planByCode = Object.fromEntries(
        (allPlans || []).map((p) => [p.plan_code, p.id])
      );

      const canonicalSlots = [
        {
          patient_id: ptByCode["COC-2026-01001"],
          doctor_id: docBySlug["elisa-russo"],
          room_id: roomBySlug["studio-1"],
          treatment_plan_id: planByCode["PT-2026-0042"] || null,
          starts_at: "2026-11-12T09:00:00+01:00",
          ends_at: "2026-11-12T10:00:00+01:00",
          status: "completato" as DbAppointmentStatus,
          is_first_visit: false,
          notes:
            "Controllo periodico allineatori trasparenti. [Reminder1h: 08:00 via WhatsApp] [Arrivo: 2026-11-12T08:54:00.000Z] [InizioVisita: 2026-11-12T09:00:00.000Z] [Attesa: 6m] [FineVisita: 2026-11-12T09:48:00.000Z] [Durata: 48m] [Incasso: Inclusa in Percorso]",
        },
        {
          patient_id: ptByCode["COC-2026-01005"],
          doctor_id: docBySlug["patty-scorzelli"],
          room_id: roomBySlug["studio-2"],
          treatment_plan_id: null,
          starts_at: "2026-11-12T10:30:00+01:00",
          ends_at: "2026-11-12T11:30:00+01:00",
          status: "confermato" as DbAppointmentStatus,
          is_first_visit: false,
          notes:
            "Seduta Carbossiterapia Medicale corpo. [Reminder1h: 09:30 via WhatsApp] [Arrivo: 2026-11-12T09:22:00.000Z]",
        },
        {
          patient_id: ptByCode["COC-2026-01002"],
          doctor_id: docBySlug["titti-errico"],
          room_id: roomBySlug["studio-3"],
          treatment_plan_id: planByCode["PT-2026-0058"] || null,
          starts_at: "2026-11-12T11:30:00+01:00",
          ends_at: "2026-11-12T12:30:00+01:00",
          status: "confermato" as DbAppointmentStatus,
          is_first_visit: false,
          notes: "Seduta protocollo rigenerativo viso e laserterapia medicale.",
        },
        {
          patient_id: ptByCode["COC-2026-01003"],
          doctor_id: docBySlug["elisa-russo"],
          room_id: roomBySlug["studio-1"],
          treatment_plan_id: planByCode["PT-2026-0064"] || null,
          starts_at: "2026-11-12T14:00:00+01:00",
          ends_at: "2026-11-12T15:00:00+01:00",
          status: "confermato" as DbAppointmentStatus,
          is_first_visit: false,
          notes:
            "Controllo ortodonzia intercettiva pediatrica (accompagnata da entrambi i genitori).",
        },
        {
          patient_id: ptByCode["COC-2026-01004"],
          doctor_id: docBySlug["jessica-de-ceglie"],
          room_id: roomBySlug["sala-filtro"],
          treatment_plan_id: null,
          starts_at: "2026-11-12T15:00:00+01:00",
          ends_at: "2026-11-12T16:00:00+01:00",
          status: "confermato" as DbAppointmentStatus,
          is_first_visit: true,
          notes:
            "Prima consulenza nutrizionale e valutazione composizione corporea.",
        },
        {
          patient_id: ptByCode["COC-2026-01006"] || ptByCode["COC-2026-01000"],
          doctor_id: docBySlug["raffaella-poppiti"],
          room_id: roomBySlug["studio-4"],
          treatment_plan_id: null,
          starts_at: "2026-11-12T16:30:00+01:00",
          ends_at: "2026-11-12T17:30:00+01:00",
          status: "confermato" as DbAppointmentStatus,
          is_first_visit: true,
          notes: "Prima visita specialistica ginecologica con ecografia.",
        },
      ].filter((s) => s.patient_id && s.doctor_id);

      // Trova gli appuntamenti attuali per preservare gli UUID dei 6 slot canonici ove presenti
      const { data: existingApps } = await supabase
        .from("appointments")
        .select("id, patient_id, doctor_id, starts_at")
        .order("starts_at", { ascending: true });

      const matchedIds = new Set<string>();
      const toInsert: typeof canonicalSlots = [];
      const toUpdate: Array<{ id: string; payload: (typeof canonicalSlots)[number] }> = [];

      for (const slot of canonicalSlots) {
        const match = (existingApps || []).find(
          (a) =>
            !matchedIds.has(a.id) &&
            a.patient_id === slot.patient_id &&
            a.doctor_id === slot.doctor_id
        );
        if (match) {
          matchedIds.add(match.id);
          toUpdate.push({ id: match.id, payload: slot });
        } else {
          toInsert.push(slot);
        }
      }

      // Elimina prima eventuali walk-in o slot spuri per evitare conflitti GiST su medico/stanza
      const spuriousIds = (existingApps || [])
        .filter((a) => !matchedIds.has(a.id))
        .map((a) => a.id);

      if (spuriousIds.length > 0) {
        await supabase.from("appointments").delete().in("id", spuriousIds);
      }

      // Metti temporaneamente in stato 'annullato' gli slot da riallineare così il vincolo GiST non scatta mai durante gli spostamenti d'orario
      if (toUpdate.length > 0) {
        await supabase
          .from("appointments")
          .update({ status: "annullato" })
          .in(
            "id",
            toUpdate.map((u) => u.id)
          );
      }

      for (const item of toUpdate) {
        const { error: uErr } = await supabase
          .from("appointments")
          .update({
            ...item.payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);
        if (uErr) throw uErr;
      }

      if (toInsert.length > 0) {
        const { error: iErr } = await supabase
          .from("appointments")
          .insert(toInsert);
        if (iErr) throw iErr;
      }

      return NextResponse.json({
        success: true,
        resetCount: toUpdate.length + toInsert.length,
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. EMISSIONE REFERTO / DOCUMENTO CLINICO
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "add_document") {
      const {
        patientId,
        doctorId,
        title,
        specialty,
        doctorName,
        diagnosis,
        recommendations,
      } = body;
      const code = `REF-${String(specialty || "GEN")
        .substring(0, 3)
        .toUpperCase()}-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const { data, error } = await supabase
        .from("clinical_documents")
        .insert({
          patient_id: patientId,
          doctor_id: doctorId || null,
          title,
          specialty,
          doctor_name: doctorName,
          diagnosis,
          recommendations,
          document_code: code,
          report_date: new Date().toISOString().split("T")[0],
          is_ready: true,
          file_size: "1.8 MB",
        })
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, document: data[0] });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 6. ACCOGLIENZA DIRETTA WALK-IN
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "create_walk_in") {
      const { patientId, doctorId, roomId, notes, isFirstVisit } = body;
      const now = new Date();
      const nowIso = now.toISOString();
      const in60 = new Date(now.getTime() + 60 * 60000);
      const baseNote = notes || "Accoglienza diretta al banco (walk-in)";

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          patient_id: patientId,
          doctor_id: doctorId,
          room_id: roomId,
          starts_at: nowIso,
          ends_at: in60.toISOString(),
          status: "confermato",
          is_first_visit: Boolean(isFirstVisit),
          notes: `${baseNote} [Arrivo: ${nowIso}]`.trim(),
        })
        .select();

      if (error) throw error;
      const row = data[0];
      return NextResponse.json({
        success: true,
        appointment: {
          ...row,
          status: deriveLiveStatus(row.status, row.notes),
        },
      });
    }

    return NextResponse.json(
      { error: "Azione non riconosciuta" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Errore azione reception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
