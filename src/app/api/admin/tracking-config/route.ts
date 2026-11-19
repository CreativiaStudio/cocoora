import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getTrackingConfig, saveTrackingConfig } from "@/lib/tracking-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getTrackingConfig({ fresh: true });
  return NextResponse.json({
    ok: true,
    config,
    diagnostics: {
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      metaCapiConfigured: Boolean(
        config.metaCapiAccessToken || process.env.META_CAPI_ACCESS_TOKEN
      ),
      storage: "supabase",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ ok: false, error: "Dati mancanti" }, { status: 400 });
    }

    const result = await saveTrackingConfig(
      {
        gaMeasurementId: String(body.gaMeasurementId || "").trim(),
        gtmContainerId: String(body.gtmContainerId || "").trim(),
        gscVerificationTag: String(body.gscVerificationTag || "").trim(),
        gscVerificationMethod:
          body.gscVerificationMethod === "dns_txt" ? "dns_txt" : "meta",
        metaPixelId: String(body.metaPixelId || "").trim(),
        googleAdsId: String(body.googleAdsId || "").trim(),
        ...(body.metaCapiAccessToken !== undefined
          ? { metaCapiAccessToken: String(body.metaCapiAccessToken || "").trim() }
          : {}),
        ...(body.metaCapiTestEventCode !== undefined
          ? { metaCapiTestEventCode: String(body.metaCapiTestEventCode || "").trim() }
          : {}),
        serverTelemetryEnabled: body.serverTelemetryEnabled !== false,
      },
      body.updatedBy || "Marco & Silvia / Agenzia SEO"
    );

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            result.error ||
            "Errore salvataggio configurazione su Supabase. Verifica SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    revalidateTag("cms");
    revalidatePath("/", "layout");

    return NextResponse.json({
      ok: true,
      config: result.config,
      storage: result.storage,
    });
  } catch (err) {
    console.error("Errore salvataggio tracking config:", err);
    return NextResponse.json(
      { ok: false, error: "Errore interno durante il salvataggio." },
      { status: 500 }
    );
  }
}
