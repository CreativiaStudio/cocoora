import { NextResponse } from "next/server";
import { getTrackingConfig, saveTrackingConfig } from "@/lib/tracking-config";

export async function GET() {
  const config = await getTrackingConfig();
  return NextResponse.json({ ok: true, config });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ ok: false, error: "Dati mancanti" }, { status: 400 });
    }

    const updated = await saveTrackingConfig(
      {
        gaMeasurementId: (body.gaMeasurementId || "").trim(),
        gtmContainerId: (body.gtmContainerId || "").trim(),
        gscVerificationTag: (body.gscVerificationTag || "").trim(),
        metaPixelId: (body.metaPixelId || "").trim(),
        serverTelemetryEnabled: body.serverTelemetryEnabled !== false,
      },
      body.updatedBy || "Silvia / Agenzia SEO"
    );

    return NextResponse.json({ ok: true, config: updated });
  } catch (err) {
    console.error("Errore salvataggio tracking config:", err);
    return NextResponse.json(
      { ok: false, error: "Errore interno durante il salvataggio." },
      { status: 500 }
    );
  }
}
