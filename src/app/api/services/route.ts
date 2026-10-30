import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data: services, error } = await supabase
      .from("medical_services")
      .select("id, code, name, category, duration_minutes, base_price, is_bookable_online, is_listed, is_active, room, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ services: services || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore recupero prestazioni";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
