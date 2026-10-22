import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientCode = searchParams.get("code") || "COC-2026-01001"; // Default: Marco De Luca

    const supabase = getServiceSupabase();

    // 1. Recupera profilo paziente
    const { data: patient, error: pErr } = await supabase
      .from("patient_profiles")
      .select("*")
      .eq("patient_code", patientCode)
      .maybeSingle();

    if (pErr || !patient) {
      // Se non trovato, recupera il primo paziente disponibile
      const { data: fallback } = await supabase
        .from("patient_profiles")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!fallback) {
        return NextResponse.json({ error: "Paziente non trovato" }, { status: 404 });
      }
      return await getPatientData(supabase, fallback);
    }

    return await getPatientData(supabase, patient);
  } catch (err: any) {
    console.error("Errore recupero portale paziente:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function getPatientData(supabase: any, patient: any) {
  // 2. Recupera referti clinici
  const { data: documents } = await supabase
    .from("clinical_documents")
    .select("*")
    .eq("patient_id", patient.id)
    .order("report_date", { ascending: false });

  // 3. Recupera appuntamenti (con medico e stanza)
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id,
      starts_at,
      ends_at,
      status,
      notes,
      is_first_visit,
      doctors ( id, full_name, title, specialty_slug ),
      clinic_rooms ( id, name, slug )
    `)
    .eq("patient_id", patient.id)
    .order("starts_at", { ascending: true });

  // 4. Recupera piano terapeutico attivo
  const { data: plan } = await supabase
    .from("patient_treatment_plans")
    .select(`
      id,
      plan_code,
      title,
      description,
      total_amount,
      discount_amount,
      net_total,
      paid_total,
      balance_due,
      status,
      payment_status,
      treatment_installments (
        id,
        installment_number,
        amount,
        due_date,
        status,
        paid_at,
        payment_method,
        notes
      )
    `)
    .eq("patient_id", patient.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 5. Elenco tutti pazienti demo per switcher
  const { data: allPatients } = await supabase
    .from("patient_profiles")
    .select("id, patient_code, first_name, last_name, email, notes")
    .order("patient_code", { ascending: true });

  return NextResponse.json({
    patient,
    documents: documents || [],
    appointments: appointments || [],
    plan: plan || null,
    allPatients: allPatients || [],
  });
}
