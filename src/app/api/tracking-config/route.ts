import { NextResponse } from "next/server";
import { getTrackingConfig } from "@/lib/tracking-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getTrackingConfig({ fresh: true });
  return NextResponse.json(
    {
      ok: true,
      config: {
        gaMeasurementId: config.gaMeasurementId || "",
        gtmContainerId: config.gtmContainerId || "",
        gscVerificationTag: config.gscVerificationTag || "",
        gscVerificationMethod: config.gscVerificationMethod || "meta",
        metaPixelId: config.metaPixelId || "",
        googleAdsId: config.googleAdsId || "",
        serverTelemetryEnabled: config.serverTelemetryEnabled !== false,
        metaCapiConfigured: Boolean(
          config.metaPixelId &&
            (config.metaCapiAccessToken || process.env.META_CAPI_ACCESS_TOKEN)
        ),
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
