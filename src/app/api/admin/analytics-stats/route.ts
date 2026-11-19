import { NextResponse } from "next/server";
import { getAggregatedStatsWithDiagnostics } from "@/lib/telemetry-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { stats, diagnostics } = await getAggregatedStatsWithDiagnostics();
    return NextResponse.json(
      { ok: true, stats, diagnostics },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore caricamento statistiche.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
