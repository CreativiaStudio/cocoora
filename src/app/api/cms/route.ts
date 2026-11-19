import { NextResponse } from "next/server";
import { getServerCmsState } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await getServerCmsState({ fresh: true });
    return NextResponse.json(
      { ok: true, state },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore caricamento CMS";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
