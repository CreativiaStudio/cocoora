import { promises as fs } from "fs";
import path from "path";
import os from "os";

export interface TrackingConfig {
  gaMeasurementId: string;
  gtmContainerId: string;
  gscVerificationTag: string;
  metaPixelId: string;
  serverTelemetryEnabled: boolean;
  updatedAt: string;
  updatedBy?: string;
}

const DEFAULT_CONFIG: TrackingConfig = {
  gaMeasurementId: "",
  gtmContainerId: "",
  gscVerificationTag: "",
  metaPixelId: "",
  serverTelemetryEnabled: true,
  updatedAt: new Date().toISOString(),
  updatedBy: "Sistema",
};

// In-memory cache per performance elevate lato server
let cachedConfig: TrackingConfig | null = null;

const CONFIG_FILE_PATH =
  process.env.VERCEL || process.env.NODE_ENV === "production"
    ? path.join(os.tmpdir(), "cocoora-tracking-config.json")
    : path.join(process.cwd(), "scratch", "tracking-config.json");

export async function getTrackingConfig(): Promise<TrackingConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const raw = await fs.readFile(CONFIG_FILE_PATH, "utf-8");
    cachedConfig = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    return cachedConfig!;
  } catch {
    cachedConfig = { ...DEFAULT_CONFIG };
    return cachedConfig;
  }
}

export async function saveTrackingConfig(
  newConfig: Partial<TrackingConfig>,
  user?: string
): Promise<TrackingConfig> {
  const current = await getTrackingConfig();
  const updated: TrackingConfig = {
    ...current,
    ...newConfig,
    updatedAt: new Date().toISOString(),
    updatedBy: user || "Operatore",
  };

  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Impossibile salvare tracking-config su file:", err);
  }

  cachedConfig = updated;
  return updated;
}
