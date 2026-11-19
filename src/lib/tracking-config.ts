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

export function normalizeGtmId(raw?: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/GTM-[A-Z0-9]+/i);
  return match ? match[0].toUpperCase() : trimmed;
}

export function normalizeGaId(raw?: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/G-[A-Z0-9]+/i);
  return match ? match[0].toUpperCase() : trimmed;
}

export function normalizeAdsId(raw?: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/AW-[0-9]+/i);
  return match ? match[0].toUpperCase() : trimmed;
}

export function normalizePixelId(raw?: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  if (/^[0-9\s]+$/.test(trimmed)) {
    return trimmed.replace(/\s+/g, "");
  }
  return trimmed;
}

export async function getTrackingConfig(options?: {
  fresh?: boolean;
}): Promise<TrackingConfig> {
  const stored = await readCmsKey<Partial<TrackingConfig>>(
    TRACKING_CONFIG_KEY,
    options
  );
  return {
    ...DEFAULT_CONFIG,
    ...(stored || {}),
    gaMeasurementId: normalizeGaId(
      stored?.gaMeasurementId ||
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
        process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
    ),
    gtmContainerId: normalizeGtmId(
      stored?.gtmContainerId || process.env.NEXT_PUBLIC_GTM_ID
    ),
    gscVerificationTag: (
      stored?.gscVerificationTag ||
      process.env.NEXT_PUBLIC_GSC_VERIFICATION ||
      ""
    ).trim(),
    metaPixelId: normalizePixelId(
      stored?.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID
    ),
    googleAdsId: normalizeAdsId(
      stored?.googleAdsId || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
    ),
    metaCapiAccessToken: (stored?.metaCapiAccessToken || "").trim(),
    metaCapiTestEventCode: (stored?.metaCapiTestEventCode || "").trim(),
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
    gaMeasurementId: normalizeGaId(
      newConfig.gaMeasurementId ?? current.gaMeasurementId
    ),
    gtmContainerId: normalizeGtmId(
      newConfig.gtmContainerId ?? current.gtmContainerId
    ),
    gscVerificationTag: (
      newConfig.gscVerificationTag ?? current.gscVerificationTag
    ).trim(),
    metaPixelId: normalizePixelId(newConfig.metaPixelId ?? current.metaPixelId),
    googleAdsId: normalizeAdsId(newConfig.googleAdsId ?? current.googleAdsId),
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
