import { readCmsKey, writeCmsKey } from "./cms-server";

export interface TrackingConfig {
  gaMeasurementId: string;
  gtmContainerId: string;
  gscVerificationTag: string;
  metaPixelId: string;
  googleAdsId: string;
  metaCapiAccessToken?: string;
  metaCapiTestEventCode?: string;
  serverTelemetryEnabled: boolean;
  updatedAt: string;
  updatedBy?: string;
}

const DEFAULT_CONFIG: TrackingConfig = {
  gaMeasurementId: "",
  gtmContainerId: "",
  gscVerificationTag: "",
  metaPixelId: "",
  googleAdsId: "",
  metaCapiAccessToken: "",
  metaCapiTestEventCode: "",
  serverTelemetryEnabled: true,
  updatedAt: new Date().toISOString(),
  updatedBy: "Sistema",
};

const TRACKING_CONFIG_KEY = "tracking_config";

export async function getTrackingConfig(options?: {
  fresh?: boolean;
}): Promise<TrackingConfig> {
  const stored = await readCmsKey<Partial<TrackingConfig>>(
    TRACKING_CONFIG_KEY,
    options
  );
  if (!stored) {
    return { ...DEFAULT_CONFIG };
  }
  return {
    ...DEFAULT_CONFIG,
    ...stored,
    gaMeasurementId: (stored.gaMeasurementId || "").trim(),
    gtmContainerId: (stored.gtmContainerId || "").trim(),
    gscVerificationTag: (stored.gscVerificationTag || "").trim(),
    metaPixelId: (stored.metaPixelId || "").trim(),
    googleAdsId: (stored.googleAdsId || "").trim(),
    metaCapiAccessToken: (stored.metaCapiAccessToken || "").trim(),
    metaCapiTestEventCode: (stored.metaCapiTestEventCode || "").trim(),
  };
}

export async function saveTrackingConfig(
  newConfig: Partial<TrackingConfig>,
  user?: string
): Promise<{
  config: TrackingConfig;
  ok: boolean;
  storage: string;
  error?: string;
}> {
  const current = await getTrackingConfig({ fresh: true });
  const updated: TrackingConfig = {
    ...current,
    ...newConfig,
    gaMeasurementId: (
      newConfig.gaMeasurementId ?? current.gaMeasurementId
    ).trim(),
    gtmContainerId: (
      newConfig.gtmContainerId ?? current.gtmContainerId
    ).trim(),
    gscVerificationTag: (
      newConfig.gscVerificationTag ?? current.gscVerificationTag
    ).trim(),
    metaPixelId: (newConfig.metaPixelId ?? current.metaPixelId).trim(),
    googleAdsId: (newConfig.googleAdsId ?? current.googleAdsId).trim(),
    metaCapiAccessToken: (
      newConfig.metaCapiAccessToken ??
      current.metaCapiAccessToken ??
      ""
    ).trim(),
    metaCapiTestEventCode: (
      newConfig.metaCapiTestEventCode ??
      current.metaCapiTestEventCode ??
      ""
    ).trim(),
    updatedAt: new Date().toISOString(),
    updatedBy: user || "Operatore",
  };

  const res = await writeCmsKey(TRACKING_CONFIG_KEY, updated, updated.updatedBy);
  return {
    config: updated,
    ok: res.ok,
    storage: res.storage,
    error: res.error,
  };
}
