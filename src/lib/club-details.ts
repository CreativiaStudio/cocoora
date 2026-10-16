import type { ClubExamItem, ClubTierDetail } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Layer 3 — Scomposizione clinica dettagliata dei pacchetti Cocoora Club.
// Ogni voce ha un valore indicativo di mercato "a tariffa singola", usato
// per calcolare il risparmio effettivo rispetto all'acquisto separato.
// ─────────────────────────────────────────────────────────────────────────

const CORE_DOCTORS = ["antonio-sorrentino", "chiara-del-prete", "ferdinando-esposito", "luca-marino"];
const CARE_DOCTORS = [...CORE_DOCTORS, "ilaria-russo", "marianna-coppola", "federica-caputo"];
const EXPERIENCE_DOCTORS = [...CARE_DOCTORS, "gennaro-iovine"];

const CARE_COMMON: ClubExamItem[] = [
  { label: "Check-up con visita medica generale", value: 90 },
  { label: "Pannello ematico esteso (emocromo, epatico, renale, tiroide TSH, vitamina D, ferritina)", value: 90 },
  { label: "ECG a riposo + visita cardiologica", value: 130 },
  { label: "Visita odontoiatrica + igiene dentale professionale", value: 130 },
  { label: "Visita medicina estetica + skin check-up digitale", value: 120 },
  { label: "Consulenza nutrizionale con piano personalizzato", value: 90 },
];

const EXPERIENCE_EXTRA: ClubExamItem[] = [
  { label: "Ecografia addome completo", value: 90 },
  { label: "Ecocardiogramma color-Doppler", value: 120 },
  { label: "Visita oculistica completa + tonometria", value: 100 },
  { label: "Test genetico DNA 5 — pannello mirato", value: 250 },
];

export const CLUB_TIER_DETAILS: ClubTierDetail[] = [
  {
    tierId: "discover",
    commonExams: [
      { label: "Registrazione app e profilo sanitario digitale", value: 0 },
      { label: "Questionario anamnestico di base", value: 0 },
      { label: "Accesso al catalogo completo degli specialisti", value: 0 },
    ],
    doctorSlugs: [
      ...EXPERIENCE_DOCTORS,
      "gennaro-iovine",
    ],
    perks: ["Nessun costo di attivazione", "Kit di benvenuto digitale", "Referti sempre disponibili in app"],
  },
  {
    tierId: "access",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [
      { label: "Visita medica generale", value: 60 },
      { label: "Elettrocardiogramma (ECG) a riposo", value: 40 },
      { label: "Esami ematici — pannello base", value: 45 },
      { label: "Visita odontoiatrica di controllo + OPT panoramica", value: 90 },
      { label: "Consulenza nutrizionale", value: 60 },
      { label: "Visita di medicina estetica", value: 80 },
    ],
    doctorSlugs: CORE_DOCTORS,
    perks: ["Accesso prioritario alla clinica", "Sconto 5% su tutti i servizi", "Referti digitali h24"],
  },
  {
    tierId: "care",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: CARE_COMMON,
    genderExams: {
      uomo: [{ label: "Ecografia vescico-prostatica di prevenzione", value: 100 }],
      donna: [{ label: "Visita ginecologica + ecografia pelvica", value: 140 }],
    },
    doctorSlugs: CARE_DOCTORS,
    perks: ["Priorità di prenotazione", "Percorsi Uomo / Donna dedicati", "Sconti esclusivi sui trattamenti"],
  },
  {
    tierId: "experience",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [...CARE_COMMON, ...EXPERIENCE_EXTRA],
    genderExams: {
      uomo: [{ label: "Ecografia prostatica trans-addominale + valutazione andrologica", value: 110 }],
      donna: [{ label: "Ecografia mammaria bilaterale + visita senologica", value: 150 }],
    },
    doctorSlugs: EXPERIENCE_DOCTORS,
    perks: ["Diagnostica per immagini inclusa", "Concierge sanitario dedicato", "Accesso prioritario assoluto"],
  },
  {
    tierId: "signature",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [
      ...CARE_COMMON,
      ...EXPERIENCE_EXTRA,
      { label: "Valutazione multidisciplinare con equipe dedicata", value: 150 },
      { label: "Piano di salute personalizzato (nutrizionista + follow-up)", value: 120 },
      { label: "Ecografia tiroidea", value: 70 },
      { label: "Refertazione prioritaria e assistenza dedicata", value: 80 },
    ],
    doctorSlugs: EXPERIENCE_DOCTORS,
    perks: ["Una singola consulenza per ciascuna specialità", "Percorso di salute personalizzato", "Refertazione prioritaria"],
  },
  {
    tierId: "signature-longevity",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [
      ...CARE_COMMON,
      ...EXPERIENCE_EXTRA,
      { label: "Valutazione multidisciplinare con equipe dedicata", value: 150 },
      { label: "Piano di salute personalizzato (nutrizionista + follow-up)", value: 120 },
      { label: "Ecografia tiroidea", value: 70 },
      { label: "Refertazione prioritaria e assistenza dedicata", value: 80 },
      { label: "Pannello Longevity Biomarkers avanzato (infiammazione, stress ossidativo, ormonale)", value: 280 },
      { label: "Test Microbiota Intestinale NGS", value: 200 },
      { label: "Piano nutrizionale di precisione con 3 follow-up dedicati", value: 180 },
      { label: "Follow-up continuo trimestrale con l'équipe medica Cocoora", value: 150 },
    ],
    doctorSlugs: EXPERIENCE_DOCTORS,
    perks: ["Protocollo Longevity dedicato", "Test genetici e biomarcatori", "Follow-up continuo"],
  },
];

export function getTierDetail(tierId: string): ClubTierDetail | undefined {
  return CLUB_TIER_DETAILS.find((d) => d.tierId === tierId);
}

export function computeTierValue(
  detail: ClubTierDetail,
  gender?: "uomo" | "donna"
): { items: ClubExamItem[]; total: number } {
  const genderItems = gender && detail.genderExams ? detail.genderExams[gender] : [];
  const items = [...detail.commonExams, ...genderItems];
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return { items, total };
}

export function computeSavings(
  price: number,
  detail: ClubTierDetail,
  gender?: "uomo" | "donna"
): { totalValue: number; savings: number; savingsPercent: number; items: ClubExamItem[] } {
  const { items, total } = computeTierValue(detail, gender);
  const savings = Math.max(total - price, 0);
  const savingsPercent = total > 0 ? Math.round((savings / total) * 100) : 0;
  return { totalValue: total, savings, savingsPercent, items };
}

export function computeInstallment(price: number, count = 3): number {
  return Math.round((price / count) * 100) / 100;
}
