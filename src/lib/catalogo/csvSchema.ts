/**
 * Catalogo Unico delle Prestazioni — schema, tipi e parser CSV.
 *
 * Questo modulo è condiviso tra Server Actions e interfaccia admin: non usa
 * API server-only, così l'anteprima del CSV può essere calcolata anche nel
 * browser prima dell'applicazione sicura.
 *
 * Nota tecnica: il progetto non dichiara `zod` tra le dipendenze, ma Next.js
 * distribuisce il runtime di Zod nel proprio bundle compilato. Usiamo quella
 * copia per mantenere lo schema Zod richiesto senza aggiungere pacchetti.
 */

// Next.js distribuisce Zod nel proprio runtime compilato senza dichiarazioni
// TypeScript. L'import mantiene il progetto senza dipendenze aggiuntive.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — tipi non pubblicati da next/dist/compiled/zod
import zodRuntime from "next/dist/compiled/zod/index.cjs";

/* eslint-disable @typescript-eslint/no-explicit-any */
function resolveZodRuntime(value: unknown): any {
  let current: any = value;

  // A seconda del bundler il modulo può arrivare come namespace `z`, come
  // modulo CJS completo oppure come insieme di export nominati.
  for (let depth = 0; depth < 5 && current; depth += 1) {
    if (current.z && typeof current.z.object === "function") {
      return current.z;
    }

    if (
      typeof current.object === "function" &&
      typeof current.string === "function" &&
      typeof current.number === "function" &&
      typeof current.union === "function" &&
      typeof current.enum === "function"
    ) {
      return {
        object: current.object,
        string: current.string,
        number: current.number,
        boolean: current.boolean,
        enum: current.enum,
        union: current.union,
        null: current["null"],
        array: current.array,
        literal: current.literal,
        optional: current.optional,
        nullable: current.nullable,
      };
    }

    current = current.default;
  }

  return null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const z = resolveZodRuntime(zodRuntime);

if (!z) {
  throw new Error(
    "Runtime Zod non disponibile: verificare l'installazione di Next.js."
  );
}

export const CATALOG_AREAS = [
  "Medicina Estetica",
  "Odontoiatria",
  "Visite Specialistiche",
] as const;

export type CatalogArea = (typeof CATALOG_AREAS)[number];

export const PRICE_MODES = [
  "FISSO",
  "DA_DEFINIRE",
  "POST_VISITA",
  "SU_RICHIESTA",
] as const;

export type CatalogPriceMode = (typeof PRICE_MODES)[number];

export const CATALOG_STATUSES = ["ATTIVA", "SOSPESA", "ARCHIVIATA"] as const;

export type CatalogStatus = (typeof CATALOG_STATUSES)[number];

export const DEFAULT_VAT_REGIME =
  "ESENTE IVA art. 10, c.1, n.18 DPR 633/72";

export const VAT_REGIME_OPTIONS = [
  DEFAULT_VAT_REGIME,
  "IVA 22%",
  "IVA 10%",
  "NON APPLICABILE",
] as const;

export type CatalogStep = {
  id: string;
  order: number;
  title: string;
  room: string;
  durationMinutes: number;
  withDoctor: boolean;
  notes?: string;
};

export type ServiceCatalogCsvRowBase = {
  /** Codice univoco della prestazione, nel formato COC-xxx. */
  code: string;
  /** Specialità clinica di appartenenza (es. Cardiologia, Ortodonzia). */
  specialty: string;
  /** Denominazione della prestazione. */
  name: string;
  /** Prezzo in centesimi; null quando il prezzo è da definire. */
  priceCents: number | null;
  /** Modalità di determinazione del prezzo. */
  priceMode: CatalogPriceMode;
  /** Indicazione fiscale originale, riportata senza interpretazioni. */
  vatRegime: string;
  /** Sala operativa: Studio 1, Studio 2, Studio 3, Studio 4 o Sala OPT. */
  room: string | null;
  /** Indica se la prestazione è prenotabile online. */
  bookableOnline: boolean;
  /** Stato della prestazione nel catalogo. */
  status: CatalogStatus;
  /** Note cliniche e operative provenienti dal foglio di lavoro. */
  notes: string | null;
};

export type ServiceCatalogCsvRow = ServiceCatalogCsvRowBase & {
  /** Area amministrativa derivata da specialità e denominazione. */
  area: CatalogArea;
};

export type ParsedServiceCatalogRow = ServiceCatalogCsvRow & {
  /** Riga fisica del file CSV, utile per gli errori di importazione. */
  lineNumber: number;
};

export type CatalogCsvRowError = {
  line: number;
  code?: string;
  message: string;
};

export type CatalogCsvParseResult = {
  rows: ParsedServiceCatalogRow[];
  errors: CatalogCsvRowError[];
  warnings: string[];
  delimiter: "," | ";";
  header: string[];
  totalRows: number;
};

export type CatalogService = {
  id: string;
  code: string;
  specialty: string;
  name: string;
  area: CatalogArea;
  priceCents: number | null;
  priceMode: CatalogPriceMode;
  vatRegime: string;
  room: string | null;
  bookableOnline: boolean;
  isListed: boolean;
  isActive: boolean;
  durationMinutes: number;
  notes: string | null;
  steps: CatalogStep[];
  source: "database" | "csv";
  updatedAt: string | null;
};

type ZodSafeParseResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        issues: Array<{ path: Array<string | number>; message: string }>;
        message: string;
      };
    };

type ZodSchema<T> = {
  parse: (input: unknown) => T;
  safeParse: (input: unknown) => ZodSafeParseResult<T>;
};

/**
 * Schema Zod della riga canonica del CSV unico prestazioni.
 *
 * Le colonne accettate in ingresso sono: Codice, Specialità, Prestazione,
 * Prezzo, Modalità di prezzo, Indicazione fiscale, Sala, Prenotabile online.
 * Stato e note sono opzionali e vengono valorizzati con default sicuri.
 */
export const serviceCatalogCsvRowSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(
      /^COC-\d{3,}$/i,
      "Codice non valido: formato atteso COC-xxx (es. COC-001)."
    )
    .transform((value: string) => value.toUpperCase()),
  specialty: z
    .string()
    .trim()
    .min(1, "La specialità è obbligatoria.")
    .max(120, "La specialità supera i 120 caratteri."),
  name: z
    .string()
    .trim()
    .min(1, "La prestazione è obbligatoria.")
    .max(240, "La prestazione supera i 240 caratteri."),
  priceCents: z.union([z.number().int().nonnegative(), z.null()]),
  priceMode: z.enum(PRICE_MODES),
  vatRegime: z
    .string()
    .trim()
    .min(1, "L'indicazione fiscale è obbligatoria.")
    .max(200, "L'indicazione fiscale supera i 200 caratteri."),
  room: z.union([
    z.string().trim().min(1, "La sala non può essere vuota.").max(80),
    z.null(),
  ]),
  bookableOnline: z.boolean(),
  status: z.enum(CATALOG_STATUSES).default("ATTIVA"),
  notes: z
    .union([z.string().trim().max(2000, "Le note superano i 2000 caratteri."), z.null()])
    .default(null),
}) as unknown as ZodSchema<ServiceCatalogCsvRowBase>;

const HEADER_ALIASES: Record<keyof ServiceCatalogCsvRowBase, string[]> = {
  code: ["codice", "code", "codice prestazione", "codice servizio"],
  specialty: [
    "specialita",
    "specialita clinica",
    "area",
    "area medica",
    "reparto",
    "branch",
  ],
  name: ["prestazione", "nome prestazione", "servizio", "trattamento", "name"],
  priceCents: ["prezzo", "prezzo euro", "importo", "tariffa", "price"],
  priceMode: [
    "modalita di prezzo",
    "modalita prezzo",
    "tipo prezzo",
    "price mode",
  ],
  vatRegime: [
    "indicazione fiscale originale",
    "indicazione fiscale",
    "regime iva",
    "iva",
    "vat",
  ],
  room: ["sala", "stanza", "room", "studio"],
  bookableOnline: ["prenotabile online", "prenotabile", "bookable online", "online"],
  status: ["stato prestazione", "stato", "status"],
  notes: ["note cliniche e operative", "note cliniche", "note", "notes"],
};

type CsvColumns = Record<keyof ServiceCatalogCsvRowBase, number>;

function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function cleanCell(value: string | undefined): string {
  return (value ?? "").replace(/\u00a0/g, " ").trim();
}

function cellAt(cells: string[], index: number): string {
  return index >= 0 ? cleanCell(cells[index]) : "";
}

function findColumn(headers: string[], aliases: string[]): number {
  for (const alias of aliases) {
    const exact = headers.indexOf(alias);
    if (exact !== -1) return exact;
  }
  for (let index = 0; index < headers.length; index += 1) {
    if (aliases.some((alias) => headers[index].startsWith(alias))) {
      return index;
    }
  }
  return -1;
}

function mapColumns(headers: string[]): CsvColumns {
  return {
    code: findColumn(headers, HEADER_ALIASES.code),
    specialty: findColumn(headers, HEADER_ALIASES.specialty),
    name: findColumn(headers, HEADER_ALIASES.name),
    priceCents: findColumn(headers, HEADER_ALIASES.priceCents),
    priceMode: findColumn(headers, HEADER_ALIASES.priceMode),
    vatRegime: findColumn(headers, HEADER_ALIASES.vatRegime),
    room: findColumn(headers, HEADER_ALIASES.room),
    bookableOnline: findColumn(headers, HEADER_ALIASES.bookableOnline),
    status: findColumn(headers, HEADER_ALIASES.status),
    notes: findColumn(headers, HEADER_ALIASES.notes),
  };
}

function detectDelimiter(lines: string[]): "," | ";" {
  let commas = 0;
  let semicolons = 0;
  let inQuotes = false;

  for (const line of lines.slice(0, 20)) {
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"') {
        if (inQuotes && line[index + 1] === '"') {
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (!inQuotes && char === ",") {
        commas += 1;
      } else if (!inQuotes && char === ";") {
        semicolons += 1;
      }
    }
    inQuotes = false;
  }

  return semicolons > commas ? ";" : ",";
}

export function splitCsvLine(line: string, delimiter: "," | ";" = ","): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

/**
 * Converte un prezzo italiano in centesimi.
 * Gestisce "180", "180,50", "1.190", "€ 1.190,00" e valori vuoti.
 */
export function parsePriceToCents(raw: string | null | undefined): number | null {
  const cleaned = cleanCell(raw ?? undefined).replace(/[^\d,.\-]/g, "");
  if (!cleaned) return null;

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let normalized = cleaned;

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      normalized = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  } else if (lastComma !== -1) {
    const parts = cleaned.split(",");
    normalized =
      parts.length === 2 && parts[1].length <= 2
        ? `${parts[0]}.${parts[1]}`
        : parts.join("");
  } else if (lastDot !== -1) {
    const parts = cleaned.split(".");
    normalized =
      parts.length === 2 && parts[1].length <= 2
        ? cleaned
        : parts.join("");
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

export function formatPriceCents(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "Da definire";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatStepDuration(minutes: number): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  if (safeMinutes < 60) return `${safeMinutes} min`;
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;
  return remainder === 0 ? `${hours} h` : `${hours} h ${remainder} min`;
}

function normalizePriceMode(raw: string): CatalogPriceMode {
  const value = normalizeHeader(raw).replace(/\s+/g, "_").toUpperCase();
  if (value.includes("PREVENTIVO")) return "POST_VISITA";
  if (value.includes("DEFINIRE") || value.includes("DA_DEF")) return "DA_DEFINIRE";
  if (value.includes("RICHIES")) return "SU_RICHIESTA";
  if (value.includes("FISSO")) return "FISSO";
  return "DA_DEFINIRE";
}

function normalizeStatus(raw: string): CatalogStatus {
  const value = normalizeHeader(raw).toUpperCase();
  if (value.includes("SOSPES")) return "SOSPESA";
  if (value.includes("ARCHIV")) return "ARCHIVIATA";
  return "ATTIVA";
}

function parseBoolean(raw: string): boolean {
  const value = normalizeHeader(raw);
  if (!value) return false;
  return ["si", "s", "yes", "true", "1", "x", "online"].includes(value);
}

export function normalizeRoom(raw: string | null | undefined): string | null {
  const value = cleanCell(raw ?? undefined);
  if (!value) return null;

  const studio = value.match(/studio\s*([1-4])/i);
  if (studio) return `Studio ${studio[1]}`;

  if (/(sala\s*)?(opt|rx|radiograf|tac)/i.test(value)) {
    return "Sala OPT";
  }

  const sala = value.match(/sala\s*([1-4])/i);
  if (sala) return `Sala ${sala[1]}`;

  return value.slice(0, 80);
}

/**
 * Determina l'area amministrativa usando specialità e nome della prestazione.
 * Le tre aree coincidono con i tre dropdown del menu pubblico.
 */
export function resolveCatalogArea(
  specialty: string,
  name: string = ""
): CatalogArea {
  const text = normalizeHeader(`${specialty} ${name}`);

  if (
    /(odonto|ortodon|allineator|implant|endodon|parodont|protesi|conservativa|igiene dentale|sorriso|gnatolog|bite)/.test(
      text
    )
  ) {
    return "Odontoiatria";
  }

  if (
    /(estetica|rigenerativ|plastica|filler|botulin|tossina|biorivital|biostimol|peeling|prx|criolip|carbossi|mesoterap|intralipo|laser|luce pulsata|resurfacing|ultrasuoni|cfu|epilazione|scleroterap|lipofill|acido ialuronico)/.test(
      text
    )
  ) {
    return "Medicina Estetica";
  }

  return "Visite Specialistiche";
}

export type DbServiceCategory =
  | "odontoiatria"
  | "medicina_estetica"
  | "visita_specialistica"
  | "diagnostica"
  | "precision"
  | "igiene_prevenzione"
  | "altro";

export function areaToDbCategory(
  area: CatalogArea,
  specialty: string,
  name: string = ""
): DbServiceCategory {
  if (area === "Odontoiatria") return "odontoiatria";
  if (area === "Medicina Estetica") return "medicina_estetica";

  const text = normalizeHeader(`${specialty} ${name}`);
  if (/(diagnost|ecograf|radiolog|tomograf|tac|rx|opt|laborator)/.test(text)) {
    return "diagnostica";
  }
  if (/(igiene|prevenzione)/.test(text)) return "igiene_prevenzione";
  return "visita_specialistica";
}

export function dbCategoryToArea(
  category: string | null | undefined,
  specialty: string,
  name: string
): CatalogArea {
  switch (category) {
    case "odontoiatria":
      return "Odontoiatria";
    case "medicina_estetica":
      return "Medicina Estetica";
    case "visita_specialistica":
    case "diagnostica":
    case "igiene_prevenzione":
      return "Visite Specialistiche";
    case "precision":
      return "Visite Specialistiche";
    case "altro":
    default:
      return resolveCatalogArea(specialty, name);
  }
}

/**
 * Costruisce i segmenti operativi della prestazione.
 * La Sala OPT è condivisa e la sua acquisizione precede la visita in studio.
 */
export function deriveCatalogSteps(input: {
  room: string | null;
  name: string;
  durationMinutes: number;
}): CatalogStep[] {
  const duration = Math.max(5, Math.round(input.durationMinutes || 60));
  const room = input.room?.trim() || "Sala da assegnare";
  const needsImaging =
    /(opt|ortopantom|radiograf|rx|tac|ecograf)/i.test(input.name) ||
    /sala opt/i.test(room);

  if (needsImaging && duration > 10) {
    return [
      {
        id: "step-1",
        order: 1,
        title: "Acquisizione diagnostica",
        room: "Sala OPT",
        durationMinutes: 10,
        withDoctor: false,
        notes:
          "Sala RX/OPT/TAC condivisa: verificare la disponibilità prima di confermare l'appuntamento.",
      },
      {
        id: "step-2",
        order: 2,
        title: "Visita e refertazione",
        room: room === "Sala OPT" ? "Studio 1" : room,
        durationMinutes: Math.max(5, duration - 10),
        withDoctor: true,
      },
    ];
  }

  const requiresDoctor = !/(igiene|medicazion|rimozione punti|medicazione)/i.test(
    input.name
  );

  return [
    {
      id: "step-1",
      order: 1,
      title: requiresDoctor
        ? "Accoglienza e prestazione con medico"
        : "Accoglienza e prestazione assistita",
      room,
      durationMinutes: duration,
      withDoctor: requiresDoctor,
    },
  ];
}

/**
 * Parser difensivo del CSV unico. Tollerante a preamboli, BOM, delimitatore
 * virgola/punto e virgola e intestazioni con accenti o unità di misura.
 */
export function parseServiceCatalogCsv(csvContent: string): CatalogCsvParseResult {
  const normalized = csvContent
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n");

  if (!normalized.trim()) {
    return {
      rows: [],
      errors: [{ line: 1, message: "Il file CSV è vuoto." }],
      warnings: [],
      delimiter: ",",
      header: [],
      totalRows: 0,
    };
  }

  const lines = normalized.split("\n");
  const delimiter = detectDelimiter(lines);

  const headerIndex = lines.findIndex((line) => {
    const headers = splitCsvLine(line, delimiter).map(normalizeHeader);
    return (
      headers.includes("codice") &&
      headers.some((header) => header.includes("prestazione"))
    );
  });

  if (headerIndex === -1) {
    return {
      rows: [],
      errors: [
        {
          line: 1,
          message:
            "Intestazione non trovata. Sono richieste almeno le colonne Codice e Prestazione.",
        },
      ],
      warnings: [],
      delimiter,
      header: [],
      totalRows: 0,
    };
  }

  const rawHeader = splitCsvLine(lines[headerIndex], delimiter).map(cleanCell);
  const headers = rawHeader.map(normalizeHeader);
  const columns = mapColumns(headers);
  const errors: CatalogCsvRowError[] = [];
  const warnings: string[] = [];
  const rows: ParsedServiceCatalogRow[] = [];
  const seenCodes = new Map<string, number>();
  let totalRows = 0;

  if (columns.code === -1 || columns.name === -1) {
    return {
      rows: [],
      errors: [
        {
          line: headerIndex + 1,
          message:
            "Colonne obbligatorie mancanti: servono Codice e Prestazione.",
        },
      ],
      warnings: [],
      delimiter,
      header: rawHeader,
      totalRows: 0,
    };
  }

  for (let index = headerIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const cells = splitCsvLine(line, delimiter);
    if (cells.every((cell) => !cleanCell(cell))) continue;

    totalRows += 1;
    const code = cellAt(cells, columns.code).toUpperCase();
    const name = cellAt(cells, columns.name);

    if (!code && !name) continue;

    const candidate: ServiceCatalogCsvRowBase = {
      code,
      specialty:
        cellAt(cells, columns.specialty) || "Specialità da assegnare",
      name,
      priceCents: parsePriceToCents(cellAt(cells, columns.priceCents)),
      priceMode: normalizePriceMode(cellAt(cells, columns.priceMode)),
      vatRegime:
        cellAt(cells, columns.vatRegime) || DEFAULT_VAT_REGIME,
      room: normalizeRoom(cellAt(cells, columns.room)),
      bookableOnline: parseBoolean(cellAt(cells, columns.bookableOnline)),
      status: normalizeStatus(cellAt(cells, columns.status)),
      notes: cellAt(cells, columns.notes) || null,
    };

    const parsed = serviceCatalogCsvRowSchema.safeParse(candidate);

    if (!parsed.success) {
      errors.push({
        line: index + 1,
        code: code || undefined,
        message: parsed.error.issues
          .map((issue) => {
            const path = issue.path.length ? `${issue.path.join(".")}: ` : "";
            return `${path}${issue.message}`;
          })
          .join("; "),
      });
      continue;
    }

    const row = parsed.data;
    const lineNumber = index + 1;

    if (seenCodes.has(row.code)) {
      errors.push({
        line: lineNumber,
        code: row.code,
        message: `Codice duplicato nel file (già presente alla riga ${seenCodes.get(
          row.code
        )}).`,
      });
      continue;
    }
    seenCodes.set(row.code, lineNumber);

    if (row.priceMode === "FISSO" && row.priceCents === null) {
      warnings.push(
        `Riga ${lineNumber} (${row.code}): modalità FISSO senza prezzo. La prestazione verrà importata ma non pubblicata online finché non viene inserita una tariffa.`
      );
    }

    if (row.bookableOnline && row.priceCents === null) {
      warnings.push(
        `Riga ${lineNumber} (${row.code}): prenotabile online senza prezzo. La prenotazione online verrà disattivata fino all'inserimento della tariffa.`
      );
    }

    rows.push({
      ...row,
      area: resolveCatalogArea(row.specialty, row.name),
      lineNumber,
    });
  }

  return {
    rows,
    errors,
    warnings,
    delimiter,
    header: rawHeader,
    totalRows,
  };
}

/** Intestazioni consigliate per il file modello scaricabile dal pannello. */
export const SERVICE_CATALOG_CSV_HEADERS = [
  "Codice",
  "Specialità",
  "Prestazione",
  "Prezzo (€)",
  "Modalità di prezzo",
  "Indicazione fiscale",
  "Sala",
  "Prenotabile online",
] as const;

/** Riga di esempio conforme allo schema, usata dal pannello admin. */
export const SERVICE_CATALOG_CSV_SAMPLE_ROW = [
  "COC-001",
  "Cardiologia",
  "Visita cardiologica con ECG ed ecocardiogramma color Doppler",
  "180,00",
  "FISSO",
  "ESENTE IVA art. 10, c.1, n.18 DPR 633/72",
  "Studio 1",
  "SI",
] as const;
