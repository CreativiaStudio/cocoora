import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data: rooms, error } = await supabase
      .from("clinic_rooms")
      .select(`
        id,
        slug,
        name,
        floor,
        description,
        doctor_availability (
          id,
          weekday,
          start_time,
          end_time,
          doctors (
            id,
            full_name,
            title
          )
        )
      `)
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ rooms });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore recupero stanze";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = getServiceSupabase();
    const body = await req.json();
    const { id, name, floor, description } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID e Nome Stanza obbligatori" }, { status: 400 });
    }

    const { error } = await supabase
      .from("clinic_rooms")
      .update({ name, floor, description })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore aggiornamento stanza";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
