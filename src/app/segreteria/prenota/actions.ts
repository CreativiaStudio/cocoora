"use server";

import { getServiceSupabase } from "@/lib/supabase";
import type {
  BillingEntity,
  BookAppointmentInput,
  BookResult,
  ClinicalArea,
  SlotCandidate,
  VatRegime,
} from "@/lib/scheduling/contract";
import type { PatientSearchResult } from "@/components/segreteria/booking/PatientSearch";
import type { ServiceSearchResult } from "@/components/segreteria/booking/ServiceSearch";

/* ------------------------------------------------------------------------- */
/*  TIPI ESPORTATI PER L'AGENDA LIVE                                         */
/* ------------------------------------------------------------------------- */

export type LiveAgendaStatus =
  | "confermato"
  | "in_attesa"
  | "in_visita"
  | "completato";

export type LiveAgendaItem = {
  id: string;
  time: string;
  endTime: string;
  patient: string;
  patientId: string | null;
  service: string;
  doctor: string;
  status: LiveAgendaStatus;
  roomId: string;
  roomName: string;
  covered: boolean;
};

export type BookAppointmentExtendedInput = BookAppointmentInput & {
  roomId?: string;
  notes?: string;
  patientData?: {
    firstName: string;
    lastName: string;
    phone?: string | null;
    email?: string | null;
  };
};

/* ------------------------------------------------------------------------- */
/*  SPECIALISTI E STANZE UFFICIALI COCOORA                                   */
/* ------------------------------------------------------------------------- */

const ROME_TIMEZONE = "Europe/Rome";
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Orari ufficiali Centro Medico Cocoora:
 * Lun–Ven 09:00–19:00 (orario continuato: mattina 09:00–14:00, pomeriggio 14:00–19:00)
 * Sabato e Domenica CHIUSO.
 * Durata slot standard fase avvio: 60 minuti (1 ora).
 */
const STANDARD_SLOT_MINUTES = 60;
const OFFICIAL_HOURLY_SLOTS = [
  540, // 09:00 – 10:00 (Mattina)
  600, // 10:00 – 11:00
  660, // 11:00 – 12:00
  720, // 12:00 – 13:00
  780, // 13:00 – 14:00
  840, // 14:00 – 15:00 (Pomeriggio)
  900, // 15:00 – 16:00
  960, // 16:00 – 17:00
  1020, // 17:00 – 18:00
  1080, // 18:00 – 19:00
];

type OfficialSpecialist = {
  id: string;
  slug: string;
  altSlugs?: string[];
  name: string;
  title: string;
  specialtySlug: string;
  area: ClinicalArea;
  roomId: string;
  roomName: string;
};

const OFFICIAL_SPECIALISTS: OfficialSpecialist[] = [
  // Studio 1 (studio-1) — Odontoiatria e Ortognatodonzia
  {
    id: "7f203a0c-a916-4782-be8c-d3b6658f5180",
    slug: "elisa-russo",
    name: "Dott.ssa Elisa Russo",
    title: "Odontoiatra, Specialista in Ortognatodonzia",
    specialtySlug: "odontoiatria",
    area: "odontoiatria",
    roomId: "studio-1",
    roomName: "Studio 1 (Odontoiatria)",
  },
  {
    id: "eabac97b-7083-41f9-9163-176e03b6f2a6",
    slug: "raffaele-dalessio",
    name: "Dr. Raffaele D'Alessio",
    title: "Odontoiatria, Chirurgia e Implantologia",
    specialtySlug: "odontoiatria",
    area: "odontoiatria",
    roomId: "studio-1",
    roomName: "Studio 1 (Odontoiatria)",
  },

  // Studio 2 (studio-2) — Carbossiterapia / Corpo & Dermatologia
  {
    id: "f40de7d0-f77f-4936-9c98-805bfa24a6e7",
    slug: "patrizia-scorzelli",
    altSlugs: ["patty-scorzelli"],
    name: "Patrizia Scorzelli",
    title: "Operatrice Estetica — Carbossiterapia e Trattamenti Corpo",
    specialtySlug: "carbossiterapia",
    area: "medicina_estetica",
    roomId: "studio-2",
    roomName: "Studio 2 (Carbossiterapia & Corpo)",
  },
  {
    id: "doc-mirella-dandrea",
    slug: "mirella-dandrea",
    name: "Dott.ssa Mirella D'Andrea",
    title: "Specialista in Dermatologia",
    specialtySlug: "dermatologia",
    area: "visite_specialistiche",
    roomId: "studio-2",
    roomName: "Studio 2 (Dermatologia)",
  },

  // Studio 3 (studio-3) — Chirurgia Plastica, Medicina Estetica & Psicologia
  {
    id: "c100ee52-1cae-4727-8be7-b7adab675db3",
    slug: "titti-errico",
    altSlugs: ["concetta-errico", "concetta-titti-errico"],
    name: "Dott.ssa Concetta (Titti) Errico",
    title: "Specialista in Chirurgia Plastica e Medicina Estetica",
    specialtySlug: "chirurgia-plastica",
    area: "medicina_estetica",
    roomId: "studio-3",
    roomName: "Studio 3 (Chirurgia Plastica & Medicina Estetica)",
  },
  {
    id: "a33ac8ec-64e2-4c54-be98-78b083184928",
    slug: "francesco-dandrea",
    name: "Prof. Dr. Francesco D'Andrea",
    title: "Professore Ordinario di Chirurgia Plastica",
    specialtySlug: "chirurgia-plastica",
    area: "medicina_estetica",
    roomId: "studio-3",
    roomName: "Studio 3 (Chirurgia Plastica)",
  },
  {
    id: "b85be9a4-683d-496d-8160-60d8d8b74ae2",
    slug: "alessandra-riccardi",
    name: "Dott.ssa Alessandra Riccardi",
    title: "Specialista in Medicina Estetica",
    specialtySlug: "medicina-estetica",
    area: "medicina_estetica",
    roomId: "studio-3",
    roomName: "Studio 3 (Medicina Estetica)",
  },
  {
    id: "18a08105-9bc6-41f8-867e-573162554027",
    slug: "alessandra-totaro",
    name: "Dott.ssa Alessandra Totaro",
    title: "Psicologa e Psicoterapeuta",
    specialtySlug: "psicologia",
    area: "visite_specialistiche",
    roomId: "studio-3",
    roomName: "Studio 3 (Psicologia)",
  },

  // Studio 4 (studio-4) — Ginecologia, Cardiologia, Ecografia, Senologia, Oftalmologia
  {
    id: "doc-raffaella-poppiti",
    slug: "raffaella-poppiti",
    name: "Dott.ssa Raffaella Poppiti",
    title: "Specialista in Ginecologia ed Ostetricia",
    specialtySlug: "ginecologia",
    area: "visite_specialistiche",
    roomId: "studio-4",
    roomName: "Studio 4 (Ginecologia ed Ostetricia)",
  },
  {
    id: "8f141577-afb7-4683-886e-c6967f02c584",
    slug: "anna-maria-stillo",
    name: "Dott.ssa Anna Maria Stillo",
    title: "Specialista in Cardiologia",
    specialtySlug: "cardiologia",
    area: "visite_specialistiche",
    roomId: "studio-4",
    roomName: "Studio 4 (Cardiologia)",
  },
  {
    id: "7840978e-48e7-425c-8882-d0096b07faed",
    slug: "giuseppe-buono",
    name: "Dr. Giuseppe Buono",
    title: "Specialista in Radiodiagnostica ed Ecografia",
    specialtySlug: "ecografia",
    area: "visite_specialistiche",
    roomId: "studio-4",
    roomName: "Studio 4 (Radiodiagnostica & Ecografia)",
  },
  {
    id: "c2c2b5be-5b9f-467c-8262-8553c0b28271",
    slug: "martina-pontillo",
    name: "Dott.ssa Martina Pontillo",
    title: "Specialista in Senologia",
    specialtySlug: "senologia",
    area: "visite_specialistiche",
    roomId: "studio-4",
    roomName: "Studio 4 (Senologia)",
  },
  {
    id: "786329db-e9c9-4545-a42b-f587365624f4",
    slug: "mario-toro",
    name: "Dr. Mario Toro",
    title: "Specialista in Oftalmologia",
    specialtySlug: "oculistica",
    area: "visite_specialistiche",
    roomId: "studio-4",
    roomName: "Studio 4 (Oftalmologia)",
  },

  // Sala Filtro (sala-filtro) — Nutrizione
  {
    id: "930bbd9f-6358-45c6-adbc-c332da903ce7",
    slug: "jessica-de-ceglie",
    name: "Dott.ssa Jessica De Ceglie",
    title: "Biologa, Nutrizionista",
    specialtySlug: "nutrizione",
    area: "visite_specialistiche",
    roomId: "sala-filtro",
    roomName: "Sala Filtro (Nutrizione)",
  },
];

const FALLBACK_SERVICES: ServiceSearchResult[] = [
  {
    id: "svc-visita-odontoiatrica",
    code: "COC-109",
    name: "Visita Odontoiatrica",
    area: "odontoiatria",
    specialty: "Odontoiatria",
    totalDurationMin: 60,
    priceCents: 9000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-igiene-orale",
    code: "COC-095",
    name: "Igiene Orale Professionale",
    area: "odontoiatria",
    specialty: "Igiene dentale",
    totalDurationMin: 60,
    priceCents: 9000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: false,
    isBookableOnline: true,
  },
  {
    id: "svc-allineatori-prima-visita",
    code: "COC-ODO-003",
    name: "Allineatori Trasparenti - Prima Visita",
    area: "odontoiatria",
    specialty: "Ortognatodonzia",
    totalDurationMin: 60,
    priceCents: 10000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-carbossiterapia",
    code: "COC-039",
    name: "Carbossiterapia – Trattamento Singolo",
    area: "medicina_estetica",
    specialty: "Trattamenti corpo",
    totalDurationMin: 60,
    priceCents: 15000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: false,
    isBookableOnline: true,
  },
  {
    id: "svc-criolipolisi",
    code: "COC-041",
    name: "Criolipolisi",
    area: "medicina_estetica",
    specialty: "Trattamenti corpo",
    totalDurationMin: 60,
    priceCents: 25000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: false,
    isBookableOnline: true,
  },
  {
    id: "svc-visita-dermatologica",
    code: "COC-021",
    name: "Visita Dermatologica",
    area: "visite_specialistiche",
    specialty: "Dermatologia",
    totalDurationMin: 60,
    priceCents: 15000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-mappatura-nei",
    code: "COC-019",
    name: "Mappatura Nei",
    area: "visite_specialistiche",
    specialty: "Dermatologia",
    totalDurationMin: 60,
    priceCents: 25000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-medicina-estetica",
    code: "COC-076",
    name: "Visita di Medicina Estetica o Chirurgia Plastica",
    area: "medicina_estetica",
    specialty: "Chirurgia plastica e Medicina estetica",
    totalDurationMin: 60,
    priceCents: 10000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-biorivitalizzazione",
    code: "COC-035",
    name: "Biorivitalizzazione",
    area: "medicina_estetica",
    specialty: "Medicina estetica",
    totalDurationMin: 60,
    priceCents: 12000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: false,
    isBookableOnline: true,
  },
  {
    id: "svc-psicologia",
    code: "COC-PSI-001",
    name: "Colloquio Psicologico Clinico",
    area: "visite_specialistiche",
    specialty: "Psicologia",
    totalDurationMin: 60,
    priceCents: 9000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-visita-ginecologica",
    code: "COC-026",
    name: "Visita Specialistica Ginecologica",
    area: "visite_specialistiche",
    specialty: "Ginecologia ed Ostetricia",
    totalDurationMin: 60,
    priceCents: 18000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-visita-cardiologica",
    code: "COC-004",
    name: "Visita Cardiologica",
    area: "visite_specialistiche",
    specialty: "Cardiologia",
    totalDurationMin: 60,
    priceCents: 12000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-ecografia-addome",
    code: "COC-DIA-001",
    name: "Ecografia Addome Completo",
    area: "visite_specialistiche",
    specialty: "Radiodiagnostica ed Ecografia",
    totalDurationMin: 60,
    priceCents: 10000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: false,
    isBookableOnline: true,
  },
  {
    id: "svc-visita-senologica",
    code: "COC-SEN-001",
    name: "Visita Senologica ed Ecografia Mammaria",
    area: "visite_specialistiche",
    specialty: "Senologia",
    totalDurationMin: 60,
    priceCents: 15000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-visita-oculistica",
    code: "COC-082",
    name: "Visita Oculistica",
    area: "visite_specialistiche",
    specialty: "Oftalmologia",
    totalDurationMin: 60,
    priceCents: 20000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
  {
    id: "svc-visita-nutrizionale",
    code: "COC-080",
    name: "Prima Visita Nutrizionale con Piano Alimentare",
    area: "visite_specialistiche",
    specialty: "Nutrizione",
    totalDurationMin: 60,
    priceCents: 10000,
    vatRegime: "esente_art10",
    billingEntity: "cocoora_stp",
    isCoveredByMembership: true,
    isBookableOnline: true,
  },
];

/* ------------------------------------------------------------------------- */
/*  HELPER DATI / DATE / SANITIZZAZIONE BRAND VAULT                          */
/* ------------------------------------------------------------------------- */

function isUuid(value: string | null | undefined): boolean {
  return Boolean(value && UUID_REGEX.test(value.trim()));
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function text(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return null;
}

function numberValue(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return fallback;
}

function firstObject(value: unknown): Record<string, unknown> | null {
  if (Array.isArray(value)) {
    const first = value[0];
    return first && typeof first === "object"
      ? (first as Record<string, unknown>)
      : null;
  }
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function pick(row: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return null;
}

function todayInRome(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isWeekendDate(dateStr: string): boolean {
  const jsDay = new Date(`${dateStr}T12:00:00Z`).getUTCDay(); // 0 = Domenica, 6 = Sabato
  return jsDay === 0 || jsDay === 6;
}

function romeOffset(dateStr: string): string {
  const probe = new Date(`${dateStr}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ROME_TIMEZONE,
    timeZoneName: "longOffset",
  }).formatToParts(probe);
  const raw =
    parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+01:00";
  const match = raw.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!match) return "+01:00";
  return `${match[1]}${match[2].padStart(2, "0")}:${(match[3] ?? "00").padStart(2, "0")}`;
}

function isoAt(dateStr: string, minutesFromMidnight: number): string {
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${dateStr}T${hh}:${mm}:00${romeOffset(dateStr)}`;
}

function romeParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ROME_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

function formatRomeTime(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "--:--";
  const parts = romeParts(parsed);
  return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

function romeDateFromIso(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  const parts = romeParts(parsed);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function romeMinutesFromIso(iso: string): number {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return -1;
  const parts = romeParts(parsed);
  return parts.hour * 60 + parts.minute;
}

function normalizeDate(dateStr?: string): string {
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const probe = new Date(`${dateStr}T12:00:00Z`);
    if (!Number.isNaN(probe.getTime())) return dateStr;
  }
  return todayInRome();
}

/**
 * Sanitizza sempre i nomi degli specialisti secondo Brand Vault:
 * - Patrizia Scorzelli: MAI prefisso "Dott.ssa"
 * - Concetta (Titti) Errico: dicitura ufficiale
 * - Nessun medico non contrattualizzato mostrato
 */
function sanitizeSpecialistName(
  slug?: string | null,
  rawName?: string | null
): string {
  const normSlug = normalize(slug ?? "");
  const normName = normalize(rawName ?? "");

  if (normSlug.includes("scorzelli") || normName.includes("scorzelli")) {
    return "Patrizia Scorzelli";
  }
  if (normSlug.includes("errico") || normName.includes("errico")) {
    return "Dott.ssa Concetta (Titti) Errico";
  }

  const matchedOfficial = OFFICIAL_SPECIALISTS.find(
    (s) =>
      s.slug === normSlug ||
      (s.altSlugs ?? []).includes(normSlug) ||
      normalize(s.name) === normName
  );
  if (matchedOfficial) {
    return matchedOfficial.name;
  }

  // Rimozione nomi legacy/demo se presenti in record storici
  if (
    normName.includes("sorrentino") ||
    normName.includes("luca costa") ||
    normName.includes("giulia ferraro") ||
    normName.includes("anna romano") ||
    normName.includes("paola ruggiero") ||
    normName.includes("chiara del prete") ||
    normName.includes("marco esposito")
  ) {
    return "Dott.ssa Elisa Russo";
  }

  return rawName?.trim() || "Specialista Cocoora";
}

function specialistsForService(
  service: ServiceSearchResult,
  doctorId?: string
): OfficialSpecialist[] {
  if (doctorId) {
    const exact = OFFICIAL_SPECIALISTS.find(
      (doc) =>
        doc.id === doctorId ||
        doc.slug === doctorId ||
        (doc.altSlugs ?? []).includes(doctorId)
    );
    if (exact) return [exact];
  }

  const haystack = normalize(`${service.name} ${service.specialty ?? ""} ${service.code}`);

  // Sala Filtro: Nutrizione
  if (
    haystack.includes("nutriz") ||
    haystack.includes("aliment") ||
    haystack.includes("bioimpedenz") ||
    haystack.includes("nutri")
  ) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "jessica-de-ceglie");
  }

  // Studio 1: Odontoiatria, Ortognatodonzia, Chirurgia Orale, OPT
  if (
    service.area === "odontoiatria" ||
    haystack.includes("odont") ||
    haystack.includes("dent") ||
    haystack.includes("igiene") ||
    haystack.includes("allineat") ||
    haystack.includes("ortod") ||
    haystack.includes("endodonz") ||
    haystack.includes("implant") ||
    haystack.includes("estraz") ||
    haystack.includes("opt") ||
    haystack.includes("ortopant") ||
    haystack.includes("cbct") ||
    haystack.includes("cone beam")
  ) {
    if (
      haystack.includes("estraz") ||
      haystack.includes("implant") ||
      haystack.includes("ottav")
    ) {
      return OFFICIAL_SPECIALISTS.filter(
        (d) => d.slug === "raffaele-dalessio" || d.slug === "elisa-russo"
      ).reverse();
    }
    return OFFICIAL_SPECIALISTS.filter(
      (d) => d.slug === "elisa-russo" || d.slug === "raffaele-dalessio"
    );
  }

  // Studio 2: Patrizia Scorzelli (Carbossiterapia / Trattamenti Corpo)
  if (
    haystack.includes("carbossi") ||
    haystack.includes("criolipolisi") ||
    haystack.includes("cryolipo") ||
    haystack.includes("anticellulit") ||
    haystack.includes("mesoterapia corpo") ||
    haystack.includes("adiposita")
  ) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "patrizia-scorzelli");
  }

  // Studio 2: Dott.ssa Mirella D'Andrea (Dermatologia)
  if (
    haystack.includes("dermat") ||
    haystack.includes("mappatura") ||
    haystack.includes("nei") ||
    haystack.includes("nevo") ||
    haystack.includes("epiluminesc") ||
    haystack.includes("cisti cutanea")
  ) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "mirella-dandrea");
  }

  // Studio 3: Psicologia
  if (haystack.includes("psicolog") || haystack.includes("psicoterap")) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "alessandra-totaro");
  }

  // Studio 4: Ginecologia ed Ostetricia
  if (
    haystack.includes("ginecolog") ||
    haystack.includes("ostetric") ||
    haystack.includes("pap test") ||
    haystack.includes("donna")
  ) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "raffaella-poppiti");
  }

  // Studio 4: Cardiologia
  if (
    haystack.includes("cardiolog") ||
    haystack.includes("elettrocardiog") ||
    haystack.includes("ecg")
  ) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "anna-maria-stillo");
  }

  // Studio 4: Senologia
  if (haystack.includes("senolog") || haystack.includes("mammar")) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "martina-pontillo");
  }

  // Studio 4: Oftalmologia / Oculistica
  if (
    haystack.includes("oculist") ||
    haystack.includes("oftalm") ||
    haystack.includes("fondo oculare")
  ) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "mario-toro");
  }

  // Studio 4: Radiodiagnostica / Ecografia
  if (haystack.includes("ecograf") || haystack.includes("radiodiagnost")) {
    return OFFICIAL_SPECIALISTS.filter((d) => d.slug === "giuseppe-buono");
  }

  // Studio 3: Chirurgia Plastica
  if (
    haystack.includes("chirurgia plastica") ||
    haystack.includes("chirurgia ambulatoriale") ||
    haystack.includes("medicazion") ||
    haystack.includes("rimozione punti")
  ) {
    return OFFICIAL_SPECIALISTS.filter(
      (d) => d.slug === "francesco-dandrea" || d.slug === "titti-errico"
    );
  }

  // Studio 3: Medicina Estetica / Laser
  if (
    service.area === "medicina_estetica" ||
    haystack.includes("estet") ||
    haystack.includes("laser") ||
    haystack.includes("filler") ||
    haystack.includes("bioriv") ||
    haystack.includes("biostim") ||
    haystack.includes("peeling") ||
    haystack.includes("prx") ||
    haystack.includes("skin") ||
    haystack.includes("hifu") ||
    haystack.includes("tossina")
  ) {
    return OFFICIAL_SPECIALISTS.filter(
      (d) =>
        d.slug === "titti-errico" ||
        d.slug === "alessandra-riccardi" ||
        d.slug === "francesco-dandrea"
    );
  }

  // Default: Studio 4 Specialistica
  return OFFICIAL_SPECIALISTS.filter(
    (d) =>
      d.slug === "giuseppe-buono" ||
      d.slug === "anna-maria-stillo" ||
      d.slug === "raffaella-poppiti"
  );
}

/* ------------------------------------------------------------------------- */
/*  MAPPING DB → CONTRACT                                                    */
/* ------------------------------------------------------------------------- */

function mapDbPatient(row: Record<string, unknown>): PatientSearchResult {
  return {
    id: text(row.id) ?? "",
    firstName: text(pick(row, "first_name", "firstName")) ?? "",
    lastName: text(pick(row, "last_name", "lastName")) ?? "",
    phone: text(row.phone) ?? "",
    email: text(row.email),
    fiscalCode: text(pick(row, "fiscal_code", "fiscalCode", "codice_fiscale")),
    birthDate: text(pick(row, "birth_date", "birthDate", "data_nascita")),
    membershipId: text(
      pick(row, "health_path_id", "membership_id", "membershipId", "percorso_id")
    ),
    pathName: text(pick(row, "path_name", "pathName", "percorso_nome")),
  };
}

function mapDbService(row: Record<string, unknown>): ServiceSearchResult {
  const cat = normalize(text(pick(row, "category", "area")) ?? "");
  let area: ClinicalArea = "visite_specialistiche";
  if (cat.includes("odont") || cat.includes("dent") || cat.includes("igiene")) {
    area = "odontoiatria";
  } else if (cat.includes("estet") || cat.includes("laser")) {
    area = "medicina_estetica";
  }

  const vatRegime = (text(pick(row, "vat_regime", "vatRegime")) ??
    "esente_art10") as VatRegime;
  const billingEntity = (text(pick(row, "billing_entity", "billingEntity")) ??
    "cocoora_stp") as BillingEntity;

  const rawPrice = numberValue(
    pick(row, "price_cents", "priceCents", "base_price", "prezzo"),
    0
  );
  const priceCents =
    rawPrice > 1000 ? Math.round(rawPrice) : Math.round(rawPrice * 100);

  return {
    id: text(row.id) ?? `svc-${Math.random().toString(36).slice(2, 10)}`,
    code: text(pick(row, "code", "codice")) ?? "COC-000",
    name: text(pick(row, "name", "nome")) ?? "Prestazione Specialistica",
    area,
    specialty: text(pick(row, "category", "specialty", "specialita")),
    totalDurationMin: STANDARD_SLOT_MINUTES,
    priceCents,
    vatRegime,
    billingEntity,
    isCoveredByMembership: booleanValue(
      pick(
        row,
        "is_club_included",
        "is_covered_by_membership",
        "isCoveredByMembership"
      ),
      false
    ),
    isBookableOnline: booleanValue(
      pick(row, "is_bookable_online", "isBookableOnline"),
      true
    ),
  };
}

type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

function isSlotConflictError(
  error: SupabaseErrorLike | null | undefined
): boolean {
  if (!error) return false;
  const message =
    `${error.code ?? ""} ${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();
  return (
    error.code === "23P01" ||
    error.code === "23505" ||
    message.includes("overlap") ||
    message.includes("appointments_no_overlap") ||
    message.includes("appointments_room_no_overlap") ||
    message.includes("sovrapp") ||
    message.includes("duplicate key")
  );
}

/* ------------------------------------------------------------------------- */
/*  RICERCA PAZIENTI                                                         */
/* ------------------------------------------------------------------------- */

export async function searchPatientsAction(
  query: string
): Promise<PatientSearchResult[]> {
  const raw = typeof query === "string" ? query.trim() : "";
  const safe = raw.replace(/[%,()*]/g, " ").trim();
  if (safe.length < 2) return [];

  try {
    const supabase = getServiceSupabase();
    const digits = safe.replace(/\D/g, "");
    const filters = [
      `phone.ilike.%${safe}%`,
      `last_name.ilike.%${safe}%`,
      `first_name.ilike.%${safe}%`,
      `email.ilike.%${safe}%`,
      `fiscal_code.ilike.%${safe}%`,
    ];
    if (digits.length >= 4 && digits !== safe) {
      filters.push(`phone.ilike.%${digits}%`);
    }

    const { data, error } = await supabase
      .from("patient_profiles")
      .select("*")
      .or(filters.join(","))
      .order("updated_at", { ascending: false })
      .limit(8);

    if (error || !data) return [];
    return (data as unknown as Record<string, unknown>[]).map(mapDbPatient);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------------- */
/*  RICERCA PRESTAZIONI                                                      */
/* ------------------------------------------------------------------------- */

function searchFallbackServices(query: string): ServiceSearchResult[] {
  const needle = normalize(query);
  if (!needle) return FALLBACK_SERVICES.slice(0, 8);
  return FALLBACK_SERVICES.filter((service) => {
    const haystack = normalize(
      `${service.name} ${service.code} ${service.specialty ?? ""} ${service.area}`
    );
    return haystack.includes(needle);
  }).slice(0, 8);
}

export async function searchServicesAction(
  query: string
): Promise<ServiceSearchResult[]> {
  const raw = typeof query === "string" ? query.trim() : "";
  const safe = raw.replace(/[%,()*]/g, " ").trim();

  try {
    const supabase = getServiceSupabase();

    if (safe.length >= 1) {
      const normSafe = normalize(safe);
      const orClauses = [
        `name.ilike.%${safe}%`,
        `code.ilike.%${safe}%`,
      ];
      if (normSafe.includes("criolipolisi")) {
        orClauses.push("name.ilike.%cryolipo%");
      }

      const { data, error } = await supabase
        .from("medical_services")
        .select("*")
        .eq("is_active", true)
        .or(orClauses.join(","))
        .limit(12);

      const dbMapped =
        !error && data
          ? (data as unknown as Record<string, unknown>[]).map(mapDbService)
          : [];

      const fallbackMatched = searchFallbackServices(raw);
      const merged: ServiceSearchResult[] = [...dbMapped];

      for (const fb of fallbackMatched) {
        const alreadyPresent = merged.some(
          (item) =>
            normalize(item.name) === normalize(fb.name) ||
            normalize(item.code) === normalize(fb.code)
        );
        if (!alreadyPresent) {
          merged.push(fb);
        }
      }

      return merged.slice(0, 12);
    }

    const { data: defaultServices } = await supabase
      .from("medical_services")
      .select("*")
      .eq("is_active", true)
      .limit(10);

    if (defaultServices && defaultServices.length > 0) {
      return (defaultServices as unknown as Record<string, unknown>[]).map(
        mapDbService
      );
    }

    return FALLBACK_SERVICES.slice(0, 8);
  } catch {
    return searchFallbackServices(raw);
  }
}

async function findServiceById(
  serviceId: string
): Promise<{ service: ServiceSearchResult; source: "db" | "fallback" } | null> {
  try {
    const supabase = getServiceSupabase();
    if (isUuid(serviceId)) {
      const { data, error } = await supabase
        .from("medical_services")
        .select("*")
        .eq("id", serviceId)
        .maybeSingle();

      if (!error && data) {
        return {
          service: mapDbService(data as unknown as Record<string, unknown>),
          source: "db",
        };
      }
    } else {
      const localMatch = FALLBACK_SERVICES.find(
        (s) => s.id === serviceId || normalize(s.code) === normalize(serviceId)
      );
      const codeToFind = localMatch?.code ?? serviceId;
      const { data, error } = await supabase
        .from("medical_services")
        .select("*")
        .eq("code", codeToFind)
        .maybeSingle();

      if (!error && data) {
        const mapped = mapDbService(data as unknown as Record<string, unknown>);
        return {
          service: localMatch ? { ...mapped, name: localMatch.name } : mapped,
          source: "db",
        };
      }
    }
  } catch {
    // Fallback al catalogo ufficiale locale
  }

  const local = FALLBACK_SERVICES.find(
    (service) =>
      service.id === serviceId ||
      normalize(service.code) === normalize(serviceId)
  );

  return local ? { service: local, source: "fallback" } : null;
}

/* ------------------------------------------------------------------------- */
/*  SLOT DISPONIBILI (Lun–Ven 09:00–19:00, Sab–Dom CHIUSO, Slot da 60 min)   */
/* ------------------------------------------------------------------------- */

export async function getAvailableSlotsAction(
  serviceId: string,
  doctorId?: string,
  dateStr?: string
): Promise<SlotCandidate[]> {
  const date = normalizeDate(dateStr);

  // Sabato (6) e Domenica (0) Centro Chiuso: nessuno slot prenotabile
  if (isWeekendDate(date)) {
    return [];
  }

  const today = todayInRome();
  if (date < today) {
    return [];
  }

  const found = await findServiceById(serviceId);
  if (!found) return [];

  const service = found.service;
  const specialists = specialistsForService(service, doctorId);
  if (specialists.length === 0) return [];

  const now = romeParts(new Date());
  const nowMinutes = now.hour * 60 + now.minute;
  const offset = romeOffset(date);

  // Recupera occupazioni reali da Supabase (medici + stanze) per il giorno selezionato
  const busyIntervals: Array<{
    doctorUuid: string;
    roomUuid: string;
    roomSlug: string;
    start: number;
    end: number;
  }> = [];

  const dbDoctorUuidBySlug = new Map<string, string>();
  const dbRoomUuidBySlug = new Map<string, string>();

  try {
    const supabase = getServiceSupabase();

    const [roomsRes, docsRes, apptsRes] = await Promise.all([
      supabase.from("clinic_rooms").select("id, slug, name"),
      supabase.from("doctors").select("id, slug, full_name, is_active"),
      supabase
        .from("appointments")
        .select("doctor_id, room_id, starts_at, ends_at, status, clinic_rooms(slug)")
        .gte("starts_at", `${date}T00:00:00${offset}`)
        .lte("starts_at", `${date}T23:59:59${offset}`),
    ]);

    for (const r of (roomsRes.data ?? []) as Array<Record<string, unknown>>) {
      const rId = text(r.id);
      const rSlug = text(r.slug);
      if (rId && rSlug) dbRoomUuidBySlug.set(rSlug, rId);
    }

    for (const d of (docsRes.data ?? []) as Array<Record<string, unknown>>) {
      const dId = text(d.id);
      const dSlug = text(d.slug);
      if (dId && dSlug) dbDoctorUuidBySlug.set(dSlug, dId);
    }

    for (const appt of (apptsRes.data ?? []) as Array<Record<string, unknown>>) {
      const status = normalize(text(appt.status) ?? "");
      if (["annullato", "cancelled", "no_show"].includes(status)) continue;

      const start = romeMinutesFromIso(text(appt.starts_at) ?? "");
      const end = romeMinutesFromIso(text(appt.ends_at) ?? "");
      if (start < 0 || end <= start) continue;

      const joinedRoom = firstObject(appt.clinic_rooms);
      busyIntervals.push({
        doctorUuid: text(appt.doctor_id) ?? "",
        roomUuid: text(appt.room_id) ?? "",
        roomSlug: text(joinedRoom?.slug) ?? "",
        start,
        end,
      });
    }
  } catch {
    // Se il DB non risponde temporaneamente, prosegue con gli slot orari standard
  }

  const slots: SlotCandidate[] = [];

  for (let idx = 0; idx < OFFICIAL_HOURLY_SLOTS.length; idx += 1) {
    const startMinutes = OFFICIAL_HOURLY_SLOTS[idx];
    const endMinutes = startMinutes + STANDARD_SLOT_MINUTES;

    // Su oggi mostra solo gli slot futuri
    if (date === today && startMinutes <= nowMinutes + 5) {
      continue;
    }

    // Ruota tra gli specialisti ufficiali abilitati alla prestazione cercando chi è libero
    let chosenSpecialist: OfficialSpecialist | null = null;
    let chosenDoctorId = "";

    for (let sIdx = 0; sIdx < specialists.length; sIdx += 1) {
      const candidate = specialists[(idx + sIdx) % specialists.length];
      const resolvedDocId =
        dbDoctorUuidBySlug.get(candidate.slug) ??
        candidate.altSlugs?.map((alt) => dbDoctorUuidBySlug.get(alt)).find(Boolean) ??
        candidate.id;
      const resolvedRoomUuid = dbRoomUuidBySlug.get(candidate.roomId) ?? "";

      const hasConflict = busyIntervals.some((busy) => {
        const timeOverlaps =
          Math.max(startMinutes, busy.start) < Math.min(endMinutes, busy.end);
        if (!timeOverlaps) return false;

        const sameDoctor =
          resolvedDocId !== "" && busy.doctorUuid === resolvedDocId;
        const sameRoom =
          (resolvedRoomUuid !== "" && busy.roomUuid === resolvedRoomUuid) ||
          busy.roomSlug === candidate.roomId;

        return sameDoctor || sameRoom;
      });

      if (!hasConflict) {
        chosenSpecialist = candidate;
        chosenDoctorId = resolvedDocId;
        break;
      }
    }

    if (!chosenSpecialist) continue;

    slots.push({
      start: isoAt(date, startMinutes),
      end: isoAt(date, endMinutes),
      doctorId: chosenDoctorId,
      doctorName: chosenSpecialist.name,
      roomId: chosenSpecialist.roomId,
      roomName: chosenSpecialist.roomName,
      priceCents: service.priceCents,
      vatRegime: service.vatRegime,
      billingEntity: service.billingEntity,
      isCoveredByMembership: service.isCoveredByMembership,
    });
  }

  return slots;
}

/* ------------------------------------------------------------------------- */
/*  AGENDA VERA DEL GIORNO DA SUPABASE                                       */
/* ------------------------------------------------------------------------- */

function mapAgendaStatus(
  rawStatus: string | null,
  rawNotes?: string | null
): LiveAgendaStatus | null {
  const s = normalize(rawStatus ?? "");
  if (s === "annullato" || s === "cancelled" || s === "no_show") return null;
  if (s === "completato" || s === "completed") return "completato";
  if (s === "in_visita" || s === "in_progress") return "in_visita";
  if (s === "in_attesa" || s === "arrivato" || s === "checked_in") {
    return "in_attesa";
  }
  const notes = rawNotes ?? "";
  if (notes.includes("[FineVisita:")) return "completato";
  if (notes.includes("[InizioVisita:")) return "in_visita";
  if (notes.includes("[Arrivo:")) return "in_attesa";
  return "confermato";
}

function cleanAppointmentNotes(rawNotes: string | null): string {
  if (!rawNotes) return "";
  return rawNotes
    .replace(
      /\[(Arrivo|InizioVisita|FineVisita|Attesa|Durata|Spostato|DISDETTA|NO-SHOW|Reminder1h|Incasso)[^\]]*\]/gi,
      ""
    )
    .trim();
}

export async function getLiveAgendaForDateAction(
  dateIso: string
): Promise<LiveAgendaItem[]> {
  const date = normalizeDate(dateIso);
  const offset = romeOffset(date);

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        id,
        starts_at,
        ends_at,
        status,
        is_first_visit,
        notes,
        patient_profiles ( id, patient_code, first_name, last_name, health_path_id ),
        doctors ( id, slug, full_name ),
        clinic_rooms ( id, slug, name ),
        medical_services ( id, name, code, is_club_included )
      `
      )
      .gte("starts_at", `${date}T00:00:00${offset}`)
      .lte("starts_at", `${date}T23:59:59${offset}`)
      .order("starts_at", { ascending: true });

    if (error || !data) return [];

    const items: LiveAgendaItem[] = [];

    for (const row of data as unknown as Array<Record<string, unknown>>) {
      const startsAt = text(row.starts_at) ?? "";
      if (romeDateFromIso(startsAt) !== date) continue;

      const mappedStatus = mapAgendaStatus(text(row.status), text(row.notes));
      if (!mappedStatus) continue;

      const patientObj = firstObject(row.patient_profiles);
      const doctorObj = firstObject(row.doctors);
      const roomObj = firstObject(row.clinic_rooms);
      const serviceObj = firstObject(row.medical_services);

      const firstName = text(patientObj?.first_name) ?? "";
      const lastName = text(patientObj?.last_name) ?? "";
      const patientFullName =
        `${lastName} ${firstName}`.trim() || "Paziente Registrato";

      const cleanNotes = cleanAppointmentNotes(text(row.notes));
      const serviceTitle =
        text(serviceObj?.name) ??
        (cleanNotes ? cleanNotes.split(" — ")[0] : null) ??
        "Visita Specialistica";

      const rawRoomSlug = text(roomObj?.slug) ?? "studio-1";
      const normalizedRoomId =
        rawRoomSlug === "sala-opt" ? "studio-1" : rawRoomSlug;
      const roomName =
        text(roomObj?.name) ??
        (normalizedRoomId === "sala-filtro"
          ? "Sala Filtro"
          : normalizedRoomId.replace("studio-", "Studio "));

      const hasHealthPath = Boolean(text(patientObj?.health_path_id));
      const isClubIncluded = booleanValue(serviceObj?.is_club_included, false);

      items.push({
        id: text(row.id) ?? `appt-${items.length}`,
        time: formatRomeTime(startsAt),
        endTime: formatRomeTime(text(row.ends_at) ?? startsAt),
        patient: patientFullName,
        patientId: text(patientObj?.id),
        service: serviceTitle,
        doctor: sanitizeSpecialistName(
          text(doctorObj?.slug),
          text(doctorObj?.full_name)
        ),
        status: mappedStatus,
        roomId: normalizedRoomId,
        roomName,
        covered: hasHealthPath || isClubIncluded,
      });
    }

    return items;
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------------- */
/*  CREAZIONE PAZIENTE VELOCE (Salvataggio reale in patient_profiles)        */
/* ------------------------------------------------------------------------- */

export async function quickCreatePatientAction(data: {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
}): Promise<
  | { success: true; patient: PatientSearchResult }
  | { success: false; error: string }
> {
  const firstName = (data.firstName ?? "").trim();
  const lastName = (data.lastName ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const email = (data.email ?? "").trim() || null;
  const phoneDigits = phone.replace(/\D/g, "");

  if (firstName.length < 2) {
    return { success: false, error: "Inserisci il nome del paziente." };
  }
  if (lastName.length < 2) {
    return { success: false, error: "Inserisci il cognome del paziente." };
  }
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    return {
      success: false,
      error: "Inserisci un numero di cellulare valido (almeno 8 cifre).",
    };
  }

  try {
    const supabase = getServiceSupabase();

    // Cerca prima paziente esistente per telefono o nome+cognome
    const lastNine = phoneDigits.slice(-9);
    const { data: existingByPhone } = await supabase
      .from("patient_profiles")
      .select("*")
      .ilike("phone", `%${lastNine}%`)
      .limit(1);

    if (existingByPhone && existingByPhone.length > 0) {
      return {
        success: true,
        patient: mapDbPatient(
          existingByPhone[0] as unknown as Record<string, unknown>
        ),
      };
    }

    const nowIso = new Date().toISOString();
    let insertResult = await supabase
      .from("patient_profiles")
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        gdpr_consent_at: nowIso,
        notes: "Registrato da Segreteria",
      })
      .select("*")
      .single();

    if (insertResult.error) {
      insertResult = await supabase
        .from("patient_profiles")
        .insert({
          patient_code: `COC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          gdpr_consent_at: nowIso,
          notes: "Registrato da Segreteria",
        })
        .select("*")
        .single();
    }

    if (insertResult.error || !insertResult.data) {
      return {
        success: false,
        error: `Impossibile registrare il paziente su database: ${insertResult.error?.message ?? "errore sconosciuto"}.`,
      };
    }

    return {
      success: true,
      patient: mapDbPatient(
        insertResult.data as unknown as Record<string, unknown>
      ),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore di connessione";
    return {
      success: false,
      error: `Impossibile creare il paziente: ${msg}`,
    };
  }
}

/* ------------------------------------------------------------------------- */
/*  RISOLUZIONE UUID REALI PER SUPABASE (Paziente, Stanza, Medico)           */
/* ------------------------------------------------------------------------- */

async function resolvePatientUuid(
  supabase: ReturnType<typeof getServiceSupabase>,
  patientId: string,
  patientData?: {
    firstName: string;
    lastName: string;
    phone?: string | null;
    email?: string | null;
  }
): Promise<string | null> {
  if (isUuid(patientId)) {
    const { data } = await supabase
      .from("patient_profiles")
      .select("id")
      .eq("id", patientId)
      .maybeSingle();

    if (data?.id) return String(data.id);
  }

  const firstName = (patientData?.firstName ?? "").trim();
  const lastName = (patientData?.lastName ?? "").trim();
  const phone = (patientData?.phone ?? "").trim();
  const email = (patientData?.email ?? "").trim() || null;
  const phoneDigits = phone.replace(/\D/g, "");

  // 1. Ricerca per telefono
  if (phoneDigits.length >= 8) {
    const lastNine = phoneDigits.slice(-9);
    const { data: byPhone } = await supabase
      .from("patient_profiles")
      .select("id")
      .ilike("phone", `%${lastNine}%`)
      .limit(1);

    if (byPhone && byPhone.length > 0 && byPhone[0]?.id) {
      return String(byPhone[0].id);
    }
  }

  // 2. Ricerca per nome + cognome
  if (firstName && lastName) {
    const { data: byName } = await supabase
      .from("patient_profiles")
      .select("id")
      .ilike("first_name", firstName)
      .ilike("last_name", lastName)
      .limit(1);

    if (byName && byName.length > 0 && byName[0]?.id) {
      return String(byName[0].id);
    }
  }

  // 3. Creazione reale in patient_profiles
  const safeFirst = firstName || "Paziente";
  const safeLast = lastName || "Cocoora";
  const nowIso = new Date().toISOString();

  let created = await supabase
    .from("patient_profiles")
    .insert({
      first_name: safeFirst,
      last_name: safeLast,
      phone: phone || null,
      email,
      gdpr_consent_at: nowIso,
      notes: "Registrato da Segreteria",
    })
    .select("id")
    .single();

  if (created.error) {
    created = await supabase
      .from("patient_profiles")
      .insert({
        patient_code: `COC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        first_name: safeFirst,
        last_name: safeLast,
        phone: phone || null,
        email,
        gdpr_consent_at: nowIso,
        notes: "Registrato da Segreteria",
      })
      .select("id")
      .single();
  }

  return created.data?.id ? String(created.data.id) : null;
}

async function resolveRoomUuid(
  supabase: ReturnType<typeof getServiceSupabase>,
  roomIdOrSlug: string | undefined,
  fallbackSlug: string
): Promise<string | null> {
  const candidate = (roomIdOrSlug ?? "").trim();

  if (isUuid(candidate)) {
    const { data } = await supabase
      .from("clinic_rooms")
      .select("id")
      .eq("id", candidate)
      .maybeSingle();

    if (data?.id) return String(data.id);
  }

  const targetSlug = candidate && !isUuid(candidate) ? candidate : fallbackSlug;

  const { data: bySlug } = await supabase
    .from("clinic_rooms")
    .select("id")
    .eq("slug", targetSlug)
    .maybeSingle();

  if (bySlug?.id) return String(bySlug.id);

  const { data: allRooms } = await supabase
    .from("clinic_rooms")
    .select("id, slug, name")
    .order("slug");

  if (allRooms && allRooms.length > 0) {
    const matched = allRooms.find(
      (r) =>
        normalize(String(r.slug ?? "")) === normalize(fallbackSlug) ||
        normalize(String(r.name ?? "")) ===
          normalize(fallbackSlug.replace("-", " "))
    );
    return String((matched ?? allRooms[0]).id);
  }

  return null;
}

async function resolveDoctorUuid(
  supabase: ReturnType<typeof getServiceSupabase>,
  doctorIdOrSlug: string | undefined,
  specialist: OfficialSpecialist
): Promise<string | null> {
  const candidate = (doctorIdOrSlug ?? "").trim();

  // 1. Se è già un UUID valido presente in doctors
  if (isUuid(candidate)) {
    const { data } = await supabase
      .from("doctors")
      .select("id")
      .eq("id", candidate)
      .maybeSingle();

    if (data?.id) return String(data.id);
  }

  // 2. Cerca per slug ufficiale o alternativo
  const slugsToCheck = [specialist.slug, ...(specialist.altSlugs ?? [])];
  if (candidate && !isUuid(candidate) && !slugsToCheck.includes(candidate)) {
    slugsToCheck.unshift(candidate);
  }

  const { data: bySlug } = await supabase
    .from("doctors")
    .select("id, slug")
    .in("slug", slugsToCheck)
    .limit(1);

  if (bySlug && bySlug.length > 0 && bySlug[0]?.id) {
    return String(bySlug[0].id);
  }

  // 3. Cerca per full_name
  const { data: allActiveDocs } = await supabase
    .from("doctors")
    .select("id, slug, full_name, specialty_slug, is_active")
    .eq("is_active", true);

  const activeList = (allActiveDocs ?? []) as Array<Record<string, unknown>>;
  const targetNormName = normalize(specialist.name);

  const byFullName = activeList.find((doc) => {
    const dbNorm = normalize(text(doc.full_name) ?? "");
    return dbNorm === targetNormName || dbNorm.includes(specialist.slug.replace("-", " "));
  });

  if (byFullName?.id) {
    return String(byFullName.id);
  }

  // 4. Se lo specialista ufficiale (es. Mirella D'Andrea o Raffaella Poppiti) non è ancora censito in doctors, lo inserisce
  const { data: insertedDoc } = await supabase
    .from("doctors")
    .insert({
      slug: specialist.slug,
      full_name: specialist.name,
      title: specialist.title,
      specialty_slug: specialist.specialtySlug,
      tariffa_visita: 120,
      is_active: true,
    })
    .select("id")
    .single();

  if (insertedDoc?.id) {
    return String(insertedDoc.id);
  }

  // 5. Fallback al primo medico attivo della branca/sala
  const sameRoomOfficialSlugs = OFFICIAL_SPECIALISTS.filter(
    (s) => s.roomId === specialist.roomId
  ).flatMap((s) => [s.slug, ...(s.altSlugs ?? [])]);

  const fallbackRoomDoc = activeList.find((doc) =>
    sameRoomOfficialSlugs.includes(text(doc.slug) ?? "")
  );
  if (fallbackRoomDoc?.id) {
    return String(fallbackRoomDoc.id);
  }

  return activeList[0]?.id ? String(activeList[0].id) : null;
}

/* ------------------------------------------------------------------------- */
/*  PRENOTAZIONE VERA SU SUPABASE (appointments + patient_profiles)          */
/* ------------------------------------------------------------------------- */

export async function bookAppointmentAction(
  input: BookAppointmentExtendedInput
): Promise<BookResult> {
  const patientId = (input.patientId ?? "").trim();
  const serviceId = (input.serviceId ?? "").trim();
  const startDate = new Date(input.start ?? "");

  if (!patientId && !input.patientData?.lastName) {
    return {
      success: false,
      errorCode: "INVALID_PATIENT",
      errorMessage: "Seleziona un paziente prima di confermare.",
    };
  }

  if (!serviceId) {
    return {
      success: false,
      errorCode: "UNKNOWN_ERROR",
      errorMessage: "Seleziona una prestazione prima di confermare.",
    };
  }

  if (Number.isNaN(startDate.getTime())) {
    return {
      success: false,
      errorCode: "UNKNOWN_ERROR",
      errorMessage: "Lo slot selezionato non è valido. Ricarica gli orari.",
    };
  }

  const slotDateRome = romeDateFromIso(startDate.toISOString());
  if (isWeekendDate(slotDateRome)) {
    return {
      success: false,
      errorCode: "DOCTOR_UNAVAILABLE",
      errorMessage:
        "Il Centro è chiuso il Sabato e la Domenica. Orari ufficiali: Lun–Ven 09:00–19:00.",
    };
  }

  const slotMinutesRome = romeMinutesFromIso(startDate.toISOString());
  if (slotMinutesRome < 540 || slotMinutesRome + STANDARD_SLOT_MINUTES > 1140) {
    return {
      success: false,
      errorCode: "DOCTOR_UNAVAILABLE",
      errorMessage:
        "Orario fuori fascia clinica. Il Centro riceve Lun–Ven dalle 09:00 alle 19:00.",
    };
  }

  const found = await findServiceById(serviceId);
  const service = found?.service ?? null;
  const endDate = new Date(
    startDate.getTime() + STANDARD_SLOT_MINUTES * 60 * 1000
  );
  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

  const matchingSpecialists = service
    ? specialistsForService(service, input.doctorId)
    : OFFICIAL_SPECIALISTS.slice(0, 1);
  const targetSpecialist = matchingSpecialists[0] ?? OFFICIAL_SPECIALISTS[0];

  try {
    const supabase = getServiceSupabase();

    // 1. Risolve o crea il paziente reale in patient_profiles
    const patientUuid = await resolvePatientUuid(
      supabase,
      patientId,
      input.patientData
    );
    if (!patientUuid) {
      return {
        success: false,
        errorCode: "INVALID_PATIENT",
        errorMessage:
          "Impossibile registrare o associare l'anagrafica paziente sul database clinico.",
      };
    }

    // 2. Risolve lo slug stanza (es. "studio-1") nel vero UUID di clinic_rooms
    const roomUuid = await resolveRoomUuid(
      supabase,
      input.roomId,
      targetSpecialist.roomId
    );
    if (!roomUuid) {
      return {
        success: false,
        errorCode: "UNKNOWN_ERROR",
        errorMessage:
          "Impossibile identificare lo studio medico selezionato su database.",
      };
    }

    // 3. Risolve il medico nel vero UUID di doctors
    const doctorUuid = await resolveDoctorUuid(
      supabase,
      input.doctorId,
      targetSpecialist
    );
    if (!doctorUuid) {
      return {
        success: false,
        errorCode: "DOCTOR_UNAVAILABLE",
        errorMessage:
          "Impossibile associare lo specialista selezionato su database.",
      };
    }

    // 4. Costruisce il payload reale per appointments
    const serviceTitle = service?.name ?? "Visita Specialistica";
    const extraNotes = (input.notes ?? input.overrideReason ?? "").trim();
    const notesValue = extraNotes
      ? `${serviceTitle} — ${extraNotes}`
      : serviceTitle;

    const serviceUuid =
      service && isUuid(service.id) && found?.source === "db"
        ? service.id
        : null;

    const insertPayload: Record<string, unknown> = {
      patient_id: patientUuid,
      doctor_id: doctorUuid,
      room_id: roomUuid,
      starts_at: startIso,
      ends_at: endIso,
      status: "confermato",
      is_first_visit: true,
      notes: notesValue,
    };

    if (serviceUuid) {
      insertPayload.service_id = serviceUuid;
    }

    const result = await supabase
      .from("appointments")
      .insert(insertPayload)
      .select("id")
      .single();

    if (result.error || !result.data?.id) {
      if (isSlotConflictError(result.error)) {
        return {
          success: false,
          errorCode: "SLOT_TAKEN",
          errorMessage:
            "Questo orario risulta già occupato per lo specialista o lo studio selezionato. Scegli un altro slot libero.",
        };
      }

      return {
        success: false,
        errorCode: "UNKNOWN_ERROR",
        errorMessage: `Errore salvataggio appuntamento: ${result.error?.message ?? "riprova tra qualche istante"}.`,
      };
    }

    return {
      success: true,
      appointmentId: String(result.data.id),
    };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Connessione al database non riuscita";
    return {
      success: false,
      errorCode: "UNKNOWN_ERROR",
      errorMessage: `Prenotazione non salvata: ${msg}`,
    };
  }
}
