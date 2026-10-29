"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { getServiceSupabase } from "@/lib/supabase";
import {
  CATALOG_AREAS,
  DEFAULT_VAT_REGIME,
  type CatalogArea,
  type CatalogPriceMode,
  type CatalogService,
  type CatalogStep,
  type CatalogCsvRowError,
  areaToDbCategory,
  dbCategoryToArea,
  deriveCatalogSteps,
  parseServiceCatalogCsv,
} from "@/lib/catalogo/csvSchema";

/* -------------------------------------------------------------------------- */
/*  Tipi pubblici delle Server Actions                                        */
/* -------------------------------------------------------------------------- */

export type AdminServicesFilters = {
  area?: string;
  search?: string;
};

export type AdminServicesListResult = {
  ok: boolean;
  services: CatalogService[];
  source: "database" | "csv" | "empty";
  error?: string;
};

export type ServiceToggleField =
  | "is_listed"
  | "is_bookable_online"
  | "is_active";

export type ServiceMutationResult = {
  ok: boolean;
  error?: string;
  notice?: string;
  persisted?: boolean;
};

export type ImportServicesResult = {
  ok: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: CatalogCsvRowError[];
  warnings: string[];
  message: string;
  persisted: boolean;
};

/* -------------------------------------------------------------------------- */
/*  Stato locale di supporto                                                  */
/* -------------------------------------------------------------------------- */

type CatalogOverlayEntry = {
  is_active?: boolean;
  is_listed?: boolean;
  is_bookable_online?: boolean;
  price_cents?: number | null;
  price_mode?: CatalogPriceMode;
  vat_regime?: string;
  room?: string | null;
  steps?: CatalogStep[];
};

/**
 * Il database clinico espone già `base_price` e `is_active` su
 * `medical_services`. I campi `is_listed`, `is_bookable_online` e `vat_regime`
 * vengono scritti direttamente quando la colonna è presente; in loro assenza
 * il pannello mantiene un overlay di sessione e lo segnala all'amministratore.
 * In questo modo nessuna migrazione distruttiva viene eseguita dal pannello.
 */
type CatalogGlobalState = typeof globalThis & {
  __cocooraCatalogOverlay?: Map<string, CatalogOverlayEntry>;
};

const catalogGlobal = globalThis as CatalogGlobalState;
const overlay =
  catalogGlobal.__cocooraCatalogOverlay ??
  (catalogGlobal.__cocooraCatalogOverlay = new Map<string, CatalogOverlayEntry>());

function overlayKey(code: string): string {
  return code.trim().toUpperCase();
}

function readOverlay(code: string): CatalogOverlayEntry {
  return overlay.get(overlayKey(code)) ?? {};
}

function patchOverlay(code: string, patch: CatalogOverlayEntry): void {
  const key = overlayKey(code);
  const current = overlay.get(key) ?? {};
  overlay.set(key, { ...current, ...patch });
}

/* -------------------------------------------------------------------------- */
/*  Mapping database -> catalogo admin                                        */
/* -------------------------------------------------------------------------- */

type DbBranch = {
  name: string | null;
  slug: string | null;
};

type DbMedicalServiceRow = {
  id: string;
  code: string | null;
  name: string;
  category: string | null;
  branch_id: string | null;
  description: string | null;
  duration_minutes: number | null;
  base_price: number | string | null;
  is_active: boolean | null;
  sort_order: number | null;
  updated_at: string | null;
  branches?: DbBranch | DbBranch[] | null;
};

function firstBranch(
  value: DbBranch | DbBranch[] | null | undefined
): DbBranch | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function specialtyFromDescription(description: string | null): string | null {
  if (!description) return null;
  const marker = description.indexOf(" — ");
  if (marker > 0 && marker <= 120) {
    return description.slice(0, marker).trim() || null;
  }
  return null;
}

function inferRoom(
  row: Pick<DbMedicalServiceRow, "code" | "name" | "description">,
  area: CatalogArea
): string {
  const text = `${row.code ?? ""} ${row.name} ${row.description ?? ""}`.toLowerCase();

  if (/(opt|ortopantom|radiograf|\brx\b|\btac\b)/.test(text)) return "Sala OPT";
  if (/(oculist|oculistica)/.test(text)) return "Studio 4";
  if (/(laser|luce pulsata|resurfacing|co2)/.test(text)) return "Studio 3";
  if (/(criolip|carbossi|mesoterap|ultrasuoni|intralipo)/.test(text)) {
    return "Studio 2";
  }
  if (area === "Odontoiatria") return "Studio 1";
  if (area === "Medicina Estetica") return "Studio 2";
  return "Studio 1";
}

function mapDatabaseService(row: DbMedicalServiceRow): CatalogService {
  const branch = firstBranch(row.branches);
  const specialty =
    branch?.name?.trim() ||
    specialtyFromDescription(row.description) ||
    "Specialità da assegnare";
  const name = row.name?.trim() || "Prestazione senza denominazione";
  const area = dbCategoryToArea(row.category, specialty, name);
  const local = readOverlay(row.code ?? row.id);

  const databasePrice = Number(row.base_price);
  const basePriceCents =
    Number.isFinite(databasePrice) && databasePrice > 0
      ? Math.round(databasePrice * 100)
      : null;

  const priceCents =
    local.price_cents !== undefined ? local.price_cents : basePriceCents;
  const isActive =
    local.is_active !== undefined ? local.is_active : row.is_active !== false;
  const room = local.room !== undefined ? local.room : inferRoom(row, area);
  const isListed =
    local.is_listed !== undefined
      ? local.is_listed
      : isActive && priceCents !== null;
  const bookableOnline =
    local.is_bookable_online !== undefined
      ? local.is_bookable_online
      : false;
  const priceMode =
    local.price_mode !== undefined
      ? local.price_mode
      : priceCents !== null
        ? "FISSO"
        : "DA_DEFINIRE";

  const steps =
    local.steps ??
    deriveCatalogSteps({
      room,
      name,
      durationMinutes: row.duration_minutes ?? 60,
    });

  return {
    id: row.id,
    code: row.code?.trim() || `LEGACY-${row.id.slice(0, 8).toUpperCase()}`,
    specialty,
    name,
    area,
    priceCents,
    priceMode,
    vatRegime: local.vat_regime ?? DEFAULT_VAT_REGIME,
    room,
    bookableOnline: bookableOnline && priceCents !== null && isListed,
    isListed: isListed && priceCents !== null,
    isActive,
    durationMinutes: row.duration_minutes ?? 60,
    notes: row.description,
    steps,
    source: "database",
    updatedAt: row.updated_at,
  };
}

function mapCsvFallbackRow(
  row: ReturnType<typeof parseServiceCatalogCsv>["rows"][number]
): CatalogService {
  const local = readOverlay(row.code);
  const priceCents =
    local.price_cents !== undefined ? local.price_cents : row.priceCents;
  const isActive =
    local.is_active !== undefined ? local.is_active : row.status === "ATTIVA";
  const room = local.room !== undefined ? local.room : row.room;
  const isListed =
    local.is_listed !== undefined
      ? local.is_listed
      : isActive && priceCents !== null;
  const bookableOnline =
    local.is_bookable_online !== undefined
      ? local.is_bookable_online
      : row.bookableOnline;

  return {
    id: `csv-${row.code}`,
    code: row.code,
    specialty: row.specialty,
    name: row.name,
    area: row.area,
    priceCents,
    priceMode:
      local.price_mode !== undefined ? local.price_mode : row.priceMode,
    vatRegime: local.vat_regime ?? row.vatRegime ?? DEFAULT_VAT_REGIME,
    room,
    bookableOnline: bookableOnline && priceCents !== null && isListed,
    isListed: isListed && priceCents !== null,
    isActive,
    durationMinutes: 60,
    notes: row.notes,
    steps:
      local.steps ??
      deriveCatalogSteps({
        room,
        name: row.name,
        durationMinutes: 60,
      }),
    source: "csv",
    updatedAt: null,
  };
}

async function loadDatabaseCatalog(): Promise<{
  rows: DbMedicalServiceRow[];
  error: string | null;
}> {
  try {
    const supabase = getServiceSupabase();

    const withBranch = await supabase
      .from("medical_services")
      .select(
        "id, code, name, category, branch_id, description, duration_minutes, base_price, is_active, sort_order, updated_at, branches(name, slug)"
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (!withBranch.error) {
      return {
        rows: (withBranch.data ?? []) as unknown as DbMedicalServiceRow[],
        error: null,
      };
    }

    const withoutBranch = await supabase
      .from("medical_services")
      .select(
        "id, code, name, category, branch_id, description, duration_minutes, base_price, is_active, sort_order, updated_at"
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (withoutBranch.error) {
      return { rows: [], error: withoutBranch.error.message };
    }

    return {
      rows: (withoutBranch.data ?? []) as unknown as DbMedicalServiceRow[],
      error: null,
    };
  } catch (error: unknown) {
    return {
      rows: [],
      error:
        error instanceof Error
          ? error.message
          : "Database del catalogo non raggiungibile.",
    };
  }
}

async function loadCsvFallbackCatalog(): Promise<CatalogService[]> {
  try {
    const csvPath = path.join(
      process.cwd(),
      "docs",
      "catalogo_unico_prestazioni_ottobre_2026.csv"
    );
    const content = await readFile(csvPath, "utf8");
    const parsed = parseServiceCatalogCsv(content);
    return parsed.rows.map(mapCsvFallbackRow);
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*  Lettura catalogo                                                          */
/* -------------------------------------------------------------------------- */

export async function getAdminServicesListAction(
  filters: AdminServicesFilters = {}
): Promise<AdminServicesListResult> {
  const database = await loadDatabaseCatalog();

  let services =
    database.rows.length > 0
      ? database.rows.map(mapDatabaseService)
      : await loadCsvFallbackCatalog();

  const source: AdminServicesListResult["source"] =
    database.rows.length > 0 ? "database" : services.length > 0 ? "csv" : "empty";

  const area = filters.area?.trim();
  if (area && CATALOG_AREAS.includes(area as CatalogArea)) {
    services = services.filter((service) => service.area === area);
  }

  const search = filters.search?.trim().toLowerCase();
  if (search) {
    services = services.filter((service) => {
      const haystack = `${service.code} ${service.name} ${service.specialty}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  services.sort((left, right) =>
    left.code.localeCompare(right.code, "it", { numeric: true })
  );

  return {
    ok: true,
    services,
    source,
    error: database.error ?? undefined,
  };
}

async function resolveServiceById(
  serviceId: string
): Promise<CatalogService | null> {
  if (!serviceId) return null;

  if (serviceId.startsWith("csv-")) {
    const fallback = await loadCsvFallbackCatalog();
    return (
      fallback.find((service) => service.id === serviceId) ??
      fallback.find(
        (service) =>
          service.code.toUpperCase() ===
          serviceId.replace(/^csv-/i, "").toUpperCase()
      ) ??
      null
    );
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("medical_services")
      .select(
        "id, code, name, category, branch_id, description, duration_minutes, base_price, is_active, sort_order, updated_at, branches(name, slug)"
      )
      .eq("id", serviceId)
      .maybeSingle();

    if (!error && data) {
      return mapDatabaseService(data as unknown as DbMedicalServiceRow);
    }
  } catch {
    // Fallback al catalogo CSV sottostante.
  }

  const fallback = await loadCsvFallbackCatalog();
  return fallback.find((service) => service.id === serviceId) ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Toggle di stato                                                           */
/* -------------------------------------------------------------------------- */

function isMissingColumnError(message: string): boolean {
  const value = message.toLowerCase();
  return (
    value.includes("pgrst204") ||
    (value.includes("column") &&
      (value.includes("does not exist") ||
        value.includes("could not find") ||
        value.includes("schema cache")))
  );
}

export async function toggleServiceStatusAction(
  serviceId: string,
  field: ServiceToggleField,
  value: boolean
): Promise<ServiceMutationResult> {
  if (!serviceId) {
    return { ok: false, error: "Prestazione non specificata." };
  }

  if (!["is_listed", "is_bookable_online", "is_active"].includes(field)) {
    return { ok: false, error: "Campo di stato non riconosciuto." };
  }

  const service = await resolveServiceById(serviceId);
  if (!service) {
    return { ok: false, error: "Prestazione non trovata nel catalogo." };
  }

  if (field === "is_listed" && value && service.priceCents === null) {
    return {
      ok: false,
      error:
        "Imposta prima una tariffa: una prestazione senza prezzo non può essere pubblicata online.",
    };
  }

  if (field === "is_bookable_online" && value) {
    if (service.priceCents === null) {
      return {
        ok: false,
        error:
          "Imposta prima una tariffa: una prestazione senza prezzo non può essere prenotabile online.",
      };
    }
    if (!service.isListed) {
      return {
        ok: false,
        error:
          "Rendi prima visibile online la prestazione, poi abilita la prenotazione.",
      };
    }
  }

  const localPatch: CatalogOverlayEntry = {};

  if (field === "is_active") localPatch.is_active = value;
  if (field === "is_listed") localPatch.is_listed = value;
  if (field === "is_bookable_online") localPatch.is_bookable_online = value;

  if (field === "is_listed" && !value) {
    localPatch.is_bookable_online = false;
  }

  if (field === "is_active" && !value) {
    localPatch.is_listed = false;
    localPatch.is_bookable_online = false;
  }

  if (service.source === "csv" || serviceId.startsWith("csv-")) {
    patchOverlay(service.code, localPatch);
    return {
      ok: true,
      persisted: false,
      notice:
        "Modifica applicata all'anteprima locale. Importa il CSV nel database per renderla definitiva.",
    };
  }

  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from("medical_services")
      .update({ [field]: value })
      .eq("id", serviceId);

    if (!error) {
      patchOverlay(service.code, localPatch);
      return { ok: true, persisted: true };
    }

    if (isMissingColumnError(error.message)) {
      patchOverlay(service.code, localPatch);
      return {
        ok: true,
        persisted: false,
        notice:
          "Stato aggiornato nel pannello. La colonna dedicata non è ancora presente nel database: la modifica resta attiva finché il catalogo viene importato o la migrazione viene applicata.",
      };
    }

    return { ok: false, error: error.message };
  } catch (error: unknown) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Errore durante l'aggiornamento dello stato.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  Aggiornamento tariffa                                                     */
/* -------------------------------------------------------------------------- */

export async function updateServicePriceAction(
  serviceId: string,
  amountCents: number,
  vatRegime: string
): Promise<ServiceMutationResult> {
  if (!serviceId) {
    return { ok: false, error: "Prestazione non specificata." };
  }

  if (!Number.isInteger(amountCents) || amountCents < 0) {
    return {
      ok: false,
      error: "La tariffa deve essere un importo valido in centesimi, non negativo.",
    };
  }

  const normalizedVat = vatRegime?.trim();
  if (!normalizedVat) {
    return { ok: false, error: "L'indicazione fiscale è obbligatoria." };
  }

  if (normalizedVat.length > 200) {
    return {
      ok: false,
      error: "L'indicazione fiscale supera i 200 caratteri consentiti.",
    };
  }

  const service = await resolveServiceById(serviceId);
  if (!service) {
    return { ok: false, error: "Prestazione non trovata nel catalogo." };
  }

  const localPatch: CatalogOverlayEntry = {
    price_cents: amountCents,
    vat_regime: normalizedVat,
    price_mode: amountCents > 0 ? "FISSO" : service.priceMode,
  };

  if (amountCents === 0) {
    localPatch.is_listed = false;
    localPatch.is_bookable_online = false;
  }

  const noticeWithoutPrice =
    amountCents === 0
      ? "Tariffa azzerata: la prestazione è stata rimossa dalla pubblicazione online e dalla prenotazione."
      : undefined;

  if (service.source === "csv" || serviceId.startsWith("csv-")) {
    patchOverlay(service.code, localPatch);
    return {
      ok: true,
      persisted: false,
      notice:
        noticeWithoutPrice ??
        "Tariffa aggiornata nell'anteprima locale. Importa il CSV nel database per renderla definitiva.",
    };
  }

  const euros = amountCents / 100;

  try {
    const supabase = getServiceSupabase();
    const withVat = await supabase
      .from("medical_services")
      .update({ base_price: euros, vat_regime: normalizedVat })
      .eq("id", serviceId);

    if (!withVat.error) {
      patchOverlay(service.code, localPatch);
      return { ok: true, persisted: true, notice: noticeWithoutPrice };
    }

    if (isMissingColumnError(withVat.error.message)) {
      const priceOnly = await supabase
        .from("medical_services")
        .update({ base_price: euros })
        .eq("id", serviceId);

      if (priceOnly.error) {
        return { ok: false, error: priceOnly.error.message };
      }

      patchOverlay(service.code, localPatch);
      return {
        ok: true,
        persisted: false,
        notice:
          noticeWithoutPrice ??
          "Tariffa salvata. Il regime fiscale resta nel pannello finché la colonna dedicata non sarà disponibile nel database.",
      };
    }

    return { ok: false, error: withVat.error.message };
  } catch (error: unknown) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Errore durante l'aggiornamento della tariffa.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  Importazione CSV                                                          */
/* -------------------------------------------------------------------------- */

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

type ExistingServiceRow = {
  id: string;
  code: string | null;
  slug: string | null;
};

export async function importServicesCsvAction(
  csvContent: string
): Promise<ImportServicesResult> {
  if (typeof csvContent !== "string" || !csvContent.trim()) {
    return {
      ok: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [{ line: 1, message: "Nessun contenuto CSV ricevuto." }],
      warnings: [],
      message: "Il file CSV è vuoto o non leggibile.",
      persisted: false,
    };
  }

  if (csvContent.length > 5_000_000) {
    return {
      ok: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [
        {
          line: 1,
          message: "Il file supera il limite di 5 MB consentito dal pannello.",
        },
      ],
      warnings: [],
      message: "File troppo grande. Riduci il CSV e riprova.",
      persisted: false,
    };
  }

  const parsed = parseServiceCatalogCsv(csvContent);

  if (parsed.rows.length === 0) {
    return {
      ok: false,
      totalRows: parsed.totalRows,
      validRows: 0,
      invalidRows: parsed.errors.length,
      inserted: 0,
      updated: 0,
      skipped: parsed.totalRows,
      errors: parsed.errors,
      warnings: parsed.warnings,
      message:
        "Nessuna riga valida trovata. Controlla l'intestazione e i codici COC-xxx.",
      persisted: false,
    };
  }

  for (const row of parsed.rows) {
    patchOverlay(row.code, {
      price_cents: row.priceCents,
      price_mode: row.priceMode,
      vat_regime: row.vatRegime,
      room: row.room,
      is_listed:
        row.status === "ATTIVA" &&
        row.priceCents !== null,
      is_bookable_online:
        row.status === "ATTIVA" &&
        row.priceCents !== null &&
        row.bookableOnline,
      steps: deriveCatalogSteps({
        room: row.room,
        name: row.name,
        durationMinutes: 60,
      }),
    });
  }

  let existing: ExistingServiceRow[] = [];

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("medical_services")
      .select("id, code, slug")
      .not("code", "is", null);

    if (error) {
      return {
        ok: false,
        totalRows: parsed.totalRows,
        validRows: parsed.rows.length,
        invalidRows: parsed.errors.length,
        inserted: 0,
        updated: 0,
        skipped: parsed.totalRows,
        errors: [
          ...parsed.errors,
          { line: 0, message: `Database non raggiungibile: ${error.message}` },
        ],
        warnings: parsed.warnings,
        message:
          "Anteprima pronta, ma il database non è raggiungibile: nessuna riga è stata salvata.",
        persisted: false,
      };
    }

    existing = (data ?? []) as ExistingServiceRow[];
  } catch (error: unknown) {
    return {
      ok: false,
      totalRows: parsed.totalRows,
      validRows: parsed.rows.length,
      invalidRows: parsed.errors.length,
      inserted: 0,
      updated: 0,
      skipped: parsed.totalRows,
      errors: [
        ...parsed.errors,
        {
          line: 0,
          message:
            error instanceof Error
              ? `Database non raggiungibile: ${error.message}`
              : "Database non raggiungibile.",
        },
      ],
      warnings: parsed.warnings,
      message:
        "Anteprima pronta, ma il database non è raggiungibile: nessuna riga è stata salvata.",
      persisted: false,
    };
  }

  const existingByCode = new Map<string, ExistingServiceRow>();
  for (const row of existing) {
    if (row.code) existingByCode.set(row.code.toUpperCase(), row);
  }

  const supabase = getServiceSupabase();
  const errors: CatalogCsvRowError[] = [...parsed.errors];
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  const toInsert: Array<Record<string, unknown>> = [];
  const toUpdate: Array<{
    id: string;
    payload: Record<string, unknown>;
    code: string;
  }> = [];

  for (let index = 0; index < parsed.rows.length; index += 1) {
    const row = parsed.rows[index];
    const payload: Record<string, unknown> = {
      code: row.code,
      name: row.name,
      category: areaToDbCategory(row.area, row.specialty, row.name),
      description: row.notes
        ? `${row.specialty} — ${row.notes}`
        : row.specialty,
      duration_minutes: 60,
      base_price: (row.priceCents ?? 0) / 100,
      is_active: row.status === "ATTIVA",
      sort_order: row.lineNumber + index,
      updated_at: new Date().toISOString(),
    };

    const match = existingByCode.get(row.code);
    if (match) {
      toUpdate.push({ id: match.id, payload, code: row.code });
      continue;
    }

    const slugBase = slugify(row.name) || "prestazione";
    toInsert.push({
      ...payload,
      slug: `${slugBase}-${row.code.toLowerCase()}`,
    });
  }

  const INSERT_BATCH_SIZE = 40;
  for (let index = 0; index < toInsert.length; index += INSERT_BATCH_SIZE) {
    const batch = toInsert.slice(index, index + INSERT_BATCH_SIZE);
    const { error } = await supabase.from("medical_services").insert(batch);

    if (!error) {
      inserted += batch.length;
      continue;
    }

    // Isola l'eventuale riga problematica senza perdere l'intero lotto.
    for (const payload of batch) {
      const single = await supabase.from("medical_services").insert(payload);
      if (single.error) {
        const code = String(payload.code ?? "");
        errors.push({
          line: 0,
          code: code || undefined,
          message: single.error.message,
        });
        skipped += 1;
      } else {
        inserted += 1;
      }
    }
  }

  const UPDATE_BATCH_SIZE = 15;
  for (let index = 0; index < toUpdate.length; index += UPDATE_BATCH_SIZE) {
    const batch = toUpdate.slice(index, index + UPDATE_BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (item) => {
        const { error } = await supabase
          .from("medical_services")
          .update(item.payload)
          .eq("id", item.id);
        return { item, error };
      })
    );

    for (const result of results) {
      if (result.error) {
        errors.push({
          line: 0,
          code: result.item.code,
          message: result.error.message,
        });
        skipped += 1;
      } else {
        updated += 1;
      }
    }
  }

  const persisted = inserted + updated > 0;
  const invalidRows = parsed.totalRows - parsed.rows.length;

  return {
    ok: persisted,
    totalRows: parsed.totalRows,
    validRows: parsed.rows.length,
    invalidRows,
    inserted,
    updated,
    skipped,
    errors,
    warnings: parsed.warnings,
    message: persisted
      ? `Importazione completata: ${inserted} nuove prestazioni, ${updated} aggiornate, ${skipped} scartate.`
      : "Nessuna prestazione è stata salvata. Controlla gli errori riportati.",
    persisted,
  };
}
