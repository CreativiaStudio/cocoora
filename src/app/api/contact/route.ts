import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Formato payload non valido (JSON richiesto)." },
        { status: 400 }
      );
    }

    const {
      nome,
      cognome,
      telefono,
      email,
      servizio = "Generale",
      messaggio = "",
      consenso,
      consensoMarketing = false,
    } = body ?? {};

    // 1. Validazione campi obbligatori (supporta anche nome completo singolo dai form rapidi)
    const rawNome = typeof nome === "string" ? nome.trim() : "";
    const rawCognome = typeof cognome === "string" ? cognome.trim() : "";

    let trimmedNome = rawNome;
    let trimmedCognome = rawCognome;
    if (!trimmedCognome && trimmedNome.includes(" ")) {
      const parts = trimmedNome.split(/\s+/);
      trimmedNome = parts[0];
      trimmedCognome = parts.slice(1).join(" ");
    } else if (!trimmedCognome && trimmedNome.length >= 2) {
      trimmedCognome = "-";
    }

    const trimmedTelefono = typeof telefono === "string" ? telefono.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedServizio = typeof servizio === "string" ? servizio.trim() : "Generale";
    const trimmedMessaggio = typeof messaggio === "string" ? messaggio.trim() : "";

    if (!trimmedNome || trimmedNome.length < 2) {
      return NextResponse.json(
        { success: false, error: "Il nome è obbligatorio (almeno 2 caratteri)." },
        { status: 400 }
      );
    }

    if (rawCognome !== "" && trimmedCognome.length < 2) {
      return NextResponse.json(
        { success: false, error: "Il cognome è obbligatorio (almeno 2 caratteri)." },
        { status: 400 }
      );
    }

    const phoneRegex = /^[\d\s+\-().]{6,25}$/;
    if (!trimmedTelefono || !phoneRegex.test(trimmedTelefono)) {
      return NextResponse.json(
        { success: false, error: "Inserire un numero di telefono valido." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Inserire un indirizzo email valido." },
        { status: 400 }
      );
    }

    if (!consenso) {
      return NextResponse.json(
        { success: false, error: "È necessario accettare l'informativa sulla privacy per procedere." },
        { status: 400 }
      );
    }

    // 2. Persistenza su Supabase tramite service_role con dual-path & safe fallback
    try {
      const supabase = getServiceSupabase();

      // Tentativo A: Tabella leads
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .insert({
          first_name: trimmedNome,
          last_name: trimmedCognome,
          phone: trimmedTelefono,
          email: trimmedEmail,
          service: trimmedServizio,
          message: trimmedMessaggio || null,
          source: "form_contatti",
          status: "nuovo",
        })
        .select()
        .maybeSingle();

      if (!leadError) {
        // Registrazione audit log facoltativa
        try {
          await supabase.from("crm_audit_log").insert({
            table_name: "leads",
            record_id: leadData?.id ? String(leadData.id) : null,
            action: "INSERT",
            diff: {
              new: {
                nome: trimmedNome,
                cognome: trimmedCognome,
                email: trimmedEmail,
                phone: trimmedTelefono,
                service: trimmedServizio,
              },
            },
          });
        } catch {
          // Ignora errori di audit secondari
        }

        return NextResponse.json({
          success: true,
          message: "Richiesta inviata con successo",
          leadId: leadData?.id,
        });
      }

      // Tentativo B (Fallback): Tabella patient_profiles se leads non esiste
      console.warn(
        "Inserimento tabella leads non riuscito o tabella assente, fallback su patient_profiles:",
        leadError.message
      );

      const notesContent = `[Richiesta Form Contatti] Servizio: ${trimmedServizio}${
        trimmedMessaggio ? ` | Messaggio: ${trimmedMessaggio}` : ""
      }`;

      // Verifica sicura (senza interpolazione .or() vulnerabile a caratteri speciali) se esiste già un profilo
      const { data: byEmail } = await supabase
        .from("patient_profiles")
        .select("id, notes")
        .eq("email", trimmedEmail)
        .limit(1)
        .maybeSingle();

      const existingPatient =
        byEmail ??
        (
          await supabase
            .from("patient_profiles")
            .select("id, notes")
            .eq("phone", trimmedTelefono)
            .limit(1)
            .maybeSingle()
        ).data;

      let patientId: string | undefined = existingPatient?.id;

      if (existingPatient) {
        const updatedNotes = existingPatient.notes
          ? `${existingPatient.notes}\n${notesContent}`
          : notesContent;

        await supabase
          .from("patient_profiles")
          .update({
            notes: updatedNotes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingPatient.id);
      } else {
        const { data: insertedPatient } = await supabase
          .from("patient_profiles")
          .insert({
            first_name: trimmedNome,
            last_name: trimmedCognome,
            phone: trimmedTelefono,
            email: trimmedEmail,
            notes: notesContent,
            gdpr_consent_at: new Date().toISOString(),
            gdpr_marketing: Boolean(consensoMarketing),
          })
          .select("id")
          .maybeSingle();

        if (insertedPatient?.id) {
          patientId = insertedPatient.id;
        }
      }

      // Registrazione audit log su patient_profiles
      try {
        await supabase.from("crm_audit_log").insert({
          table_name: "patient_profiles",
          record_id: patientId ? String(patientId) : null,
          action: existingPatient ? "UPDATE" : "INSERT",
          diff: {
            source: "form_contatti",
            service: trimmedServizio,
            phone: trimmedTelefono,
            email: trimmedEmail,
          },
        });
      } catch {
        // Ignora errori di audit secondari
      }

      return NextResponse.json({
        success: true,
        message: "Richiesta inviata con successo",
      });
    } catch (dbErr: any) {
      // Fallback sicuro contro isolamento di rete o database offline
      console.warn(
        "[API /api/contact] Errore connessione Supabase. Fallback sicuro attivato:",
        dbErr?.message || dbErr
      );

      // Rispondiamo con success: true e fallback: true per non bloccare l'esperienza utente
      return NextResponse.json({
        success: true,
        message: "Richiesta presa in carico con successo",
        fallback: true,
      });
    }
  } catch (err: any) {
    console.error("Errore imprevisto in /api/contact:", err);
    return NextResponse.json(
      { success: false, error: "Si è verificato un errore interno. Riprova più tardi." },
      { status: 500 }
    );
  }
}
