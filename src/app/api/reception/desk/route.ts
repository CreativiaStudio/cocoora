import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const supabase = getServiceSupabase();
    const today = new Date().toISOString().split("T")[0];

    // 1. Appuntamenti di oggi e prossimi
    const { data: appointments, error: appErr } = await supabase
      .from("appointments")
      .select(`
        id,
        starts_at,
        ends_at,
        status,
        notes,
        is_first_visit,
        patient_profiles ( id, patient_code, first_name, last_name, phone, email ),
        doctors ( id, full_name, title, specialty_slug ),
        clinic_rooms ( id, name, slug )
      `)
      .order("starts_at", { ascending: true });

    if (appErr) throw appErr;

    // 2. Stanze e medici
    const { data: rooms } = await supabase.from("clinic_rooms").select("*").order("slug");
    const { data: doctors } = await supabase.from("doctors").select("*").eq("is_active", true).order("full_name");
    const { data: patients } = await supabase.from("patient_profiles").select("*").order("last_name");
    const { data: documents } = await supabase
      .from("clinical_documents")
      .select("*, patient_profiles(id, patient_code, first_name, last_name)")
      .order("report_date", { ascending: false })
      .limit(20);

    // 3. Piani e rate
    const { data: installments } = await supabase
      .from("treatment_installments")
      .select("*, patient_profiles(id, patient_code, first_name, last_name)")
      .order("due_date", { ascending: true });

    return NextResponse.json({
      appointments: appointments || [],
      rooms: rooms || [],
      doctors: doctors || [],
      patients: patients || [],
      documents: documents || [],
      installments: installments || [],
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

    if (action === "update_status") {
      const { appointmentId, status } = body;
      const { data, error } = await supabase
        .from("appointments")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", appointmentId)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, updated: data });
    }

    if (action === "add_document") {
      const { patientId, doctorId, title, specialty, doctorName, diagnosis, recommendations } = body;
      const code = `REF-${specialty.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

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

    if (action === "record_payment") {
      const { installmentId, paymentMethod } = body;
      const { data, error } = await supabase
        .from("treatment_installments")
        .update({
          status: "pagato",
          paid_at: new Date().toISOString(),
          payment_method: paymentMethod || "pos",
        })
        .eq("id", installmentId)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, updated: data });
    }

    if (action === "create_walk_in") {
      const { patientId, doctorId, roomId, notes, isFirstVisit } = body;
      const now = new Date();
      const in30 = new Date(now.getTime() + 30 * 60000);

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          patient_id: patientId,
          doctor_id: doctorId,
          room_id: roomId,
          starts_at: now.toISOString(),
          ends_at: in30.toISOString(),
          status: "confermato",
          is_first_visit: isFirstVisit || false,
          notes: notes || "Accoglienza diretta al banco (walk-in)",
        })
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, appointment: data[0] });
    }

    return NextResponse.json({ error: "Azione non riconosciuta" }, { status: 400 });
  } catch (err: any) {
    console.error("Errore azione reception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
