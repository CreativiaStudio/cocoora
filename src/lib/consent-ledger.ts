import crypto from "crypto";
import { getServiceSupabase } from "./supabase";

export type ConsentStatus = "granted" | "denied" | "partially_granted" | "revoked";

export type ConsentChannel =
  | "cookie_banner"
  | "form_contatti"
  | "booking_reception"
  | "checkout_club"
  | "questionario_salute"
  | "modulo_cartaceo_frontdesk";

export interface ConsentPreferences {
  technical: boolean; // Sempre true
  analytics: boolean;
  marketing: boolean;
  sanitaryDataArt9?: boolean;
  directMarketingWhatsapp?: boolean;
  newsletter?: boolean;
  emailTracking?: boolean;
}

export interface ConsentRecord {
  id: string;
  timestamp: string;
  anonymizedIp: string;
  userIdentifier: string;
  channel: ConsentChannel;
  policyVersion: string;
  status: ConsentStatus;
  preferences: ConsentPreferences;
  userAgent: string;
  proofSignature: string;
  notes?: string;
}

export interface ConsentLedgerStats {
  totalRecords: number;
  allGrantedCount: number;
  onlyNecessaryCount: number;
  partiallyGrantedCount: number;
  sanitaryConsentsCount: number;
  lastUpdated: string;
}

const AUDIT_SALT = "cocoora_gdpr_audit_salt_2026_secur_v2";
const LEDGER_TABLE_KEY = "gdpr_consent_ledger";

export function anonymizeIp(rawIp: string | null | undefined): string {
  if (!rawIp || typeof rawIp !== "string") {
    return "0.0.0.xxx";
  }

  let cleanIp = rawIp.trim().split(",")[0].trim();
  if (cleanIp.startsWith("::ffff:")) {
    cleanIp = cleanIp.substring(7);
  }

  if (cleanIp === "::1" || cleanIp === "127.0.0.1" || cleanIp === "localhost") {
    return "127.0.0.xxx";
  }

  const ipv4Parts = cleanIp.split(".");
  if (ipv4Parts.length === 4) {
    return `${ipv4Parts[0]}.${ipv4Parts[1]}.${ipv4Parts[2]}.xxx`;
  }

  const ipv6Parts = cleanIp.split(":");
  if (ipv6Parts.length > 2) {
    return `${ipv6Parts.slice(0, 3).join(":")}:xxxx:xxxx:xxxx:xxxx`;
  }

  return "anonymized.xxx";
}

function generateProofSignature(
  id: string,
  timestamp: string,
  anonymizedIp: string,
  status: string,
  preferences: ConsentPreferences
): string {
  const payload = `${id}|${timestamp}|${anonymizedIp}|${status}|${JSON.stringify(preferences)}|${AUDIT_SALT}`;
  return crypto.createHash("sha256").update(payload).digest("hex").substring(0, 32);
}

async function loadLedgerFromSupabase(): Promise<ConsentRecord[]> {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("crm_audit_log")
      .select("diff, created_at")
      .eq("table_name", LEDGER_TABLE_KEY)
      .eq("action", "CONSENT_RECORD")
      .order("created_at", { ascending: false })
      .limit(2000);

    if (error || !data) {
      return [];
    }

    return data
      .map((row) => row.diff as ConsentRecord | null)
      .filter((r): r is ConsentRecord => Boolean(r && r.id));
  } catch (err) {
    console.error("Errore lettura consent ledger da Supabase:", err);
    return [];
  }
}

/**
 * Registra una nuova prova di consenso conforme all'Art. 7.1 GDPR su Supabase (crm_audit_log).
 */
export async function recordConsent(params: {
  channel: ConsentChannel;
  rawIp: string | null | undefined;
  userAgent?: string;
  preferences: ConsentPreferences;
  userIdentifier?: string;
  policyVersion?: string;
  notes?: string;
}): Promise<ConsentRecord> {
  const id = `cst_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${crypto.randomBytes(4).toString("hex")}`;
  const timestamp = new Date().toISOString();
  const anonymizedIp = anonymizeIp(params.rawIp);
  const policyVersion = params.policyVersion || "v1.2 - Novembre 2026";
  const userAgent = params.userAgent || "Unknown Device";

  let status: ConsentStatus = "granted";
  if (!params.preferences.analytics && !params.preferences.marketing) {
    status = "denied";
  } else if (!params.preferences.marketing || !params.preferences.analytics) {
    status = "partially_granted";
  }

  const normalizedPreferences: ConsentPreferences = {
    technical: true,
    analytics: Boolean(params.preferences.analytics),
    marketing: Boolean(params.preferences.marketing),
    sanitaryDataArt9: params.preferences.sanitaryDataArt9,
    directMarketingWhatsapp: params.preferences.directMarketingWhatsapp,
    newsletter: params.preferences.newsletter,
    emailTracking: params.preferences.emailTracking,
  };

  const proofSignature = generateProofSignature(
    id,
    timestamp,
    anonymizedIp,
    status,
    normalizedPreferences
  );

  const newRecord: ConsentRecord = {
    id,
    timestamp,
    anonymizedIp,
    userIdentifier: params.userIdentifier || `anon_usr_${crypto.randomBytes(3).toString("hex")}`,
    channel: params.channel,
    policyVersion,
    status,
    preferences: normalizedPreferences,
    userAgent,
    proofSignature,
    notes: params.notes,
  };

  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase.from("crm_audit_log").insert({
      actor_role: null,
      table_name: LEDGER_TABLE_KEY,
      record_id: id,
      action: "CONSENT_RECORD",
      diff: newRecord,
    });
    if (error) {
      console.error("Errore salvataggio prova consenso su Supabase:", error.message);
    }
  } catch (err) {
    console.error("Errore salvataggio prova consenso su Supabase:", err);
  }

  return newRecord;
}

export async function getConsents(filters?: {
  channel?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ConsentRecord[]> {
  const all = await loadLedgerFromSupabase();

  return all.filter((r) => {
    if (filters?.channel && filters.channel !== "all" && r.channel !== filters.channel) {
      return false;
    }
    if (filters?.status && filters.status !== "all" && r.status !== filters.status) {
      return false;
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.anonymizedIp.toLowerCase().includes(q) ||
        r.userIdentifier.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filters?.startDate && new Date(r.timestamp) < new Date(filters.startDate)) {
      return false;
    }
    if (filters?.endDate && new Date(r.timestamp) > new Date(filters.endDate)) {
      return false;
    }
    return true;
  });
}

export async function getConsentStats(): Promise<ConsentLedgerStats> {
  const all = await loadLedgerFromSupabase();

  let allGranted = 0;
  let onlyNecessary = 0;
  let partiallyGranted = 0;
  let sanitaryCount = 0;

  for (const r of all) {
    if (r.status === "granted") allGranted++;
    else if (r.status === "denied") onlyNecessary++;
    else if (r.status === "partially_granted") partiallyGranted++;

    if (r.preferences.sanitaryDataArt9) sanitaryCount++;
  }

  return {
    totalRecords: all.length,
    allGrantedCount: allGranted,
    onlyNecessaryCount: onlyNecessary,
    partiallyGrantedCount: partiallyGranted,
    sanitaryConsentsCount: sanitaryCount,
    lastUpdated: all[0]?.timestamp || new Date().toISOString(),
  };
}

export async function exportConsentsCsv(filters?: {
  channel?: string;
  status?: string;
  search?: string;
}): Promise<string> {
  const records = await getConsents(filters);

  const headers = [
    "Consent_ID",
    "Data_Ora_ISO",
    "IP_Anonimizzato_Minimizzato",
    "Identificativo_Soggetto",
    "Canale_Raccolta",
    "Versione_Informativa",
    "Stato_Consenso",
    "Cookie_Tecnici_Necessari",
    "Cookie_Analytics_GA4",
    "Cookie_Marketing_Pixel",
    "Consenso_Dati_Sanitari_Art9",
    "Consenso_WhatsApp_Contatto",
    "Consenso_Tracking_Email",
    "User_Agent_Dispositivo",
    "Firma_Integrita_SHA256",
    "Note_Audit",
  ];

  const rows = records.map((r) => [
    `"${r.id}"`,
    `"${r.timestamp}"`,
    `"${r.anonymizedIp}"`,
    `"${r.userIdentifier}"`,
    `"${r.channel}"`,
    `"${r.policyVersion}"`,
    `"${r.status}"`,
    `"SI"`,
    `"${r.preferences.analytics ? "SI" : "NO"}"`,
    `"${r.preferences.marketing ? "SI" : "NO"}"`,
    `"${r.preferences.sanitaryDataArt9 ? "SI" : "N/A"}"`,
    `"${r.preferences.directMarketingWhatsapp ? "SI" : "NO"}"`,
    `"${r.preferences.emailTracking ? "SI" : "NO"}"`,
    `"${(r.userAgent || "").replace(/"/g, '""')}"`,
    `"${r.proofSignature}"`,
    `"${(r.notes || "").replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}
