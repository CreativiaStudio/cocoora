import { getStripe, type BillingEntity } from "./stripe";
import { getServiceSupabase } from "./supabase";
import { CLUB_TIERS } from "./club";

export const HEALTH_PATH_UUIDS: Record<string, string> = {
  discover: "0344a8b6-9d6b-4ab5-9360-a1f2974f9598",
  access: "8234f6b7-69a2-445c-808f-3f7b469fac82",
  care: "3876b48a-cb76-40bd-9b8b-515681b4519d",
  experience: "9372ce27-9fc8-4f6d-9355-f8fec882f5dd",
  signature: "7fbb2546-bcfb-4a86-966d-3bf3de450d78",
  "signature-longevity": "b793d1d8-57a7-4383-a908-235bae39d9ff",
  "family-basic": "2b6a0884-5a30-459a-b6d6-282462bb20c8",
  "family-elite": "202cb872-09c9-4ee0-892b-6a633571a460",
};

export interface ReconcileResult {
  success: boolean;
  verified: boolean;
  patientId?: string;
  patientCode?: string;
  patientName?: string;
  patientEmail?: string;
  tierId?: string;
  tierName?: string;
  amount?: number;
  message?: string;
}

/**
 * Riconcilia in modo idempotente una sessione di pagamento Stripe con il database clinico/CRM.
 * Crea o aggiorna il profilo paziente, associa il Percorso Salute, registra il piano
 * terapeutico e inserisce l'incasso nelle rate con saldo a zero.
 */
export async function reconcileStripeSession(sessionId: string): Promise<ReconcileResult> {
  if (!sessionId) {
    return { success: false, verified: false, message: "Session ID mancante." };
  }

  // Proviamo prima Primecare (membership), poi fallback Cocoora STP
  let session: any = null;
  let entity: BillingEntity = "primecare";

  try {
    const stripePrime = getStripe("primecare");
    session = await stripePrime.checkout.sessions.retrieve(sessionId);
  } catch {
    try {
      const stripeCocoora = getStripe("cocoora_stp");
      session = await stripeCocoora.checkout.sessions.retrieve(sessionId);
      entity = "cocoora_stp";
    } catch (err: any) {
      return {
        success: false,
        verified: false,
        message: `Impossibile recuperare la sessione Stripe: ${err.message}`,
      };
    }
  }

  if (!session) {
    return { success: false, verified: false, message: "Sessione non trovata su Stripe." };
  }

  const isPaid = session.payment_status === "paid" || session.status === "complete";
  if (!isPaid) {
    return {
      success: true,
      verified: false,
      message: `Stato pagamento non saldato: ${session.payment_status}`,
    };
  }

  // Estrazione metadati
  const metadata = session.metadata || {};
  const tierId = metadata.tier_id || "access";
  const tier = CLUB_TIERS.find((t) => t.id === tierId);
  const tierName = tier?.name || metadata.tier_name || "Percorso Salute";
  const amountTotal = (session.amount_total ?? 0) / 100;

  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    metadata.customer_email ||
    "";
  const customerName =
    session.customer_details?.name ||
    metadata.customer_name ||
    "Paziente";
  const customerPhone =
    session.customer_details?.phone ||
    metadata.customer_phone ||
    "";

  const nameParts = customerName.trim().split(" ");
  const firstName = nameParts[0] || "Paziente";
  const lastName = nameParts.slice(1).join(" ") || "Cocoora";

  const supabase = getServiceSupabase();

  // 1. Cerca o crea il paziente in patient_profiles
  let patientId = metadata.patient_id || null;
  let patientCode = metadata.patient_code || null;

  if (!patientId && customerEmail) {
    let q = supabase.from("patient_profiles").select("id, patient_code, notes");
    if (customerPhone) {
      q = q.or(`email.eq.${customerEmail.toLowerCase().trim()},phone.eq.${customerPhone.trim()}`);
    } else {
      q = q.eq("email", customerEmail.toLowerCase().trim());
    }
    const { data: existing } = await q.limit(1).maybeSingle();
    if (existing) {
      patientId = existing.id;
      patientCode = existing.patient_code;
    }
  }

  const healthPathUuid = HEALTH_PATH_UUIDS[tierId] || null;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  const todayStr = now.toISOString().split("T")[0];
  const notesLine = `[Iscrizione Confermata Stripe] ${tierName} (€${amountTotal}) — Sessione: ${session.id}`;

  if (patientId) {
    // Aggiorna profilo esistente
    const { data: currentP } = await supabase
      .from("patient_profiles")
      .select("notes")
      .eq("id", patientId)
      .maybeSingle();

    const existingNotes = currentP?.notes || "";
    const updatedNotes = existingNotes.includes(session.id)
      ? existingNotes
      : existingNotes
      ? `${existingNotes}\n${notesLine}`
      : notesLine;

    await supabase
      .from("patient_profiles")
      .update({
        notes: updatedNotes,
        health_path_id: healthPathUuid,
        health_path_started_on: todayStr,
        health_path_expires_on: expiresAt.toISOString().split("T")[0],
        updated_at: now.toISOString(),
      })
      .eq("id", patientId);
  } else {
    // Inserisci nuovo profilo
    const { data: newPatient, error: pErr } = await supabase
      .from("patient_profiles")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: customerEmail.toLowerCase().trim() || null,
        phone: customerPhone.trim() || null,
        health_path_id: healthPathUuid,
        health_path_started_on: todayStr,
        health_path_expires_on: expiresAt.toISOString().split("T")[0],
        notes: notesLine,
        gdpr_consent_at: now.toISOString(),
        gdpr_marketing: true,
      })
      .select("id, patient_code")
      .maybeSingle();

    if (!pErr && newPatient) {
      patientId = newPatient.id;
      patientCode = newPatient.patient_code;
    }
  }

  if (!patientId) {
    return {
      success: false,
      verified: true,
      message: "Pagamento registrato ma impossibile associare il paziente su Supabase.",
    };
  }

  // 2. Registra o aggiorna il piano terapeutico (patient_treatment_plans)
  let planId: string | null = null;
  const planTitle = `Cocoora Club · Percorso ${tierName}`;

  const { data: existingPlan } = await supabase
    .from("patient_treatment_plans")
    .select("id, paid_total, total_amount")
    .eq("patient_id", patientId)
    .eq("title", planTitle)
    .maybeSingle();

  if (existingPlan) {
    planId = existingPlan.id;
    await supabase
      .from("patient_treatment_plans")
      .update({
        paid_total: amountTotal,
        balance_due: 0,
        payment_status: "saldato",
        status: "attivo",
        updated_at: now.toISOString(),
      })
      .eq("id", planId);
  } else {
    const { data: newPlan, error: plErr } = await supabase
      .from("patient_treatment_plans")
      .insert({
        patient_id: patientId,
        title: planTitle,
        description: `Percorso Annuale di Prevenzione Continua — Ricevuta Stripe ${session.id}`,
        total_amount: amountTotal,
        discount_amount: 0,
        net_total: amountTotal,
        paid_total: amountTotal,
        balance_due: 0,
        status: "attivo",
        payment_status: "saldato",
        start_date: todayStr,
        expected_end_date: expiresAt.toISOString().split("T")[0],
      })
      .select("id")
      .maybeSingle();

    if (!plErr && newPlan) {
      planId = newPlan.id;
    }
  }

  // 3. Registra l'incasso nelle rate (treatment_installments) con controllo idempotenza
  const { data: existingInstallment } = await supabase
    .from("treatment_installments")
    .select("id")
    .eq("patient_id", patientId)
    .ilike("notes", `%${session.id}%`)
    .maybeSingle();

  if (!existingInstallment) {
    await supabase.from("treatment_installments").insert({
      plan_id: planId,
      patient_id: patientId,
      installment_number: 1,
      installment_type: "rata",
      amount: amountTotal,
      due_date: todayStr,
      status: "pagato",
      payment_method: "pos", // Transazione digitale carta/stripe
      paid_at: now.toISOString(),
      notes: `Pagamento Digitale Stripe Checkout (${session.id}) — ${entity === "primecare" ? "PRIMECARE SRL" : "COCOORA STP SRL"}`,
    });
  }

  return {
    success: true,
    verified: true,
    patientId,
    patientCode: patientCode || undefined,
    patientName: `${firstName} ${lastName}`,
    patientEmail: customerEmail,
    tierId,
    tierName,
    amount: amountTotal,
  };
}
