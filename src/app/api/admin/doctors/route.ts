import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data: doctors, error: docError } = await supabase
      .from("doctors")
      .select(`
        id,
        slug,
        full_name,
        title,
        badge,
        affiliation,
        specialty_slug,
        branch_id,
        bio,
        tariffa_visita,
        is_active,
        doctor_availability (
          id,
          room_id,
          weekday,
          start_time,
          end_time,
          slot_minutes,
          is_active,
          clinic_rooms (
            id,
            slug,
            name
          )
        )
      `)
      .order("full_name", { ascending: true });

    if (docError) throw docError;

    const { data: rooms, error: roomError } = await supabase
      .from("clinic_rooms")
      .select("id, slug, name, floor, description")
      .order("name", { ascending: true });

    if (roomError) throw roomError;

    const { data: branches, error: branchError } = await supabase
      .from("branches")
      .select("id, slug, name")
      .order("sort_order", { ascending: true });

    if (branchError) throw branchError;

    return NextResponse.json({ doctors, rooms, branches });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore recupero medici";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getServiceSupabase();
    const body = await req.json();
    const {
      id,
      slug,
      full_name,
      title,
      badge,
      affiliation,
      specialty_slug,
      branch_id,
      bio,
      tariffa_visita,
      is_active,
      slots,
    } = body;

    if (!slug || !full_name) {
      return NextResponse.json({ error: "Slug e Nome Completo sono obbligatori." }, { status: 400 });
    }

    let doctorId = id;

    if (doctorId) {
      // Update doctor
      const { error: updateError } = await supabase
        .from("doctors")
        .update({
          full_name,
          title,
          badge,
          affiliation,
          specialty_slug: specialty_slug || null,
          branch_id: branch_id || null,
          bio,
          tariffa_visita: tariffa_visita || 0,
          is_active: is_active ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", doctorId);

      if (updateError) throw updateError;
    } else {
      // Insert new doctor
      const { data: newDoc, error: insertError } = await supabase
        .from("doctors")
        .insert({
          slug,
          full_name,
          title,
          badge,
          affiliation,
          specialty_slug: specialty_slug || null,
          branch_id: branch_id || null,
          bio,
          tariffa_visita: tariffa_visita || 0,
          is_active: is_active ?? true,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      doctorId = newDoc.id;
    }

    // Update availability slots if provided
    if (Array.isArray(slots)) {
      // Clean existing slots
      await supabase.from("doctor_availability").delete().eq("doctor_id", doctorId);

      if (slots.length > 0) {
        const slotsToInsert = slots.map((s: { room_id?: string; weekday: number; start_time: string; end_time: string; slot_minutes?: number }) => ({
          doctor_id: doctorId,
          room_id: s.room_id || null,
          weekday: Number(s.weekday),
          start_time: s.start_time,
          end_time: s.end_time,
          slot_minutes: s.slot_minutes || 30,
          is_active: true,
        }));

        const { error: slotError } = await supabase.from("doctor_availability").insert(slotsToInsert);
        if (slotError) throw slotError;
      }
    }

    return NextResponse.json({ success: true, doctorId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore salvataggio medico";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
