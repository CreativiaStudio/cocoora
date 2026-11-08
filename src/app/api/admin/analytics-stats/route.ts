import { NextResponse } from "next/server";
import { getAggregatedStats } from "@/lib/telemetry-store";

export async function GET() {
  try {
    const stats = await getAggregatedStats();
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Errore caricamento statistiche." },
      { status: 500 }
    );
  }
}
