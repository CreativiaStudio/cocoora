import type { ClubExamItem, ClubTierDetail } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Layer 3 — Prestazioni cliniche incluse nei Percorsi Salute Cocoora Club.
// Fonte Unica e Ufficiale: Tabella Comparativa Prestazioni (26/10/2026).
// ─────────────────────────────────────────────────────────────────────────

const CORE_DOCTORS = ["antonio-sorrentino", "chiara-del-prete", "ferdinando-esposito", "luca-marino"];
const CARE_DOCTORS = [...CORE_DOCTORS, "ilaria-russo", "marianna-coppola", "federica-caputo"];
const EXPERIENCE_DOCTORS = [...CARE_DOCTORS, "gennaro-iovine"];

export const CLUB_TIER_DETAILS: ClubTierDetail[] = [
  {
    tierId: "discover",
    commonExams: [
      { label: "Registrazione app e profilo sanitario digitale", value: 0 },
      { label: "Questionario anamnestico di base", value: 0 },
      { label: "Accesso al catalogo completo degli specialisti", value: 0 },
    ],
    doctorSlugs: EXPERIENCE_DOCTORS,
    perks: ["Nessun costo di attivazione", "Kit di benvenuto digitale", "Referti sempre disponibili in app"],
  },
  {
    tierId: "access",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [
      { label: "Check-up laboratorio ematochimico Salute (17 voci, urine incluse)", value: 0 },
      { label: "Medicina interna + ECG a 12 derivazioni a riposo con referto", value: 0 },
      { label: "Visita odontoiatrica specialistica + OPT digitale (panoramica)", value: 0 },
      { label: "Visita di medicina estetica viso/corpo (valutazione clinica)", value: 0 },
      { label: "Booklet personale «Il tuo Percorso di Salute»", value: 0 },
      { label: "Sconto Club 5% su tutte le prestazioni extra non incluse", value: 0 },
    ],
    doctorSlugs: CORE_DOCTORS,
    perks: ["Accesso prioritario alla clinica", "Condizioni dedicate riservate agli iscritti", "Referti digitali h24"],
  },
  {
    tierId: "care",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [
      { label: "Tutte le prestazioni incluse nel percorso Access", value: 0 },
      { label: "Check-up laboratorio ematochimico Salute (17 voci, urine incluse)", value: 0 },
      { label: "Medicina interna + ECG a 12 derivazioni con referto", value: 0 },
      { label: "Seduta di igiene orale professionale in sede", value: 0 },
      { label: "Visita odontoiatrica specialistica + OPT digitale", value: 0 },
      { label: "Visita nutrizionale specialistica + piano alimentare scritto", value: 0 },
      { label: "1° controllo nutrizionale di monitoraggio", value: 0 },
      { label: "Visita di medicina estetica viso/corpo (valutazione clinica)", value: 0 },
      { label: "Booklet personale «Il tuo Percorso di Salute»", value: 0 },
      { label: "Sconto Club 10% su tutte le prestazioni extra non incluse", value: 0 },
    ],
    doctorSlugs: CARE_DOCTORS,
    perks: ["Priorità di prenotazione", "Percorsi Uomo / Donna dedicati", "Continuità assistenziale coordinata"],
  },
  {
    tierId: "experience",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [
      { label: "Tutte le prestazioni incluse nel percorso Care Plus", value: 0 },
      { label: "Check-up laboratorio ematochimico Completo Uomo / Donna", value: 0 },
      { label: "Visita cardiologica specialistica + ecocardiogramma Color Doppler", value: 0 },
      { label: "Visita oculistica specialistica + skin check-up", value: 0 },
      { label: "Igiene orale professionale in sede + OPT digitale", value: 0 },
      { label: "Visita nutrizionale + 1° e 2° controllo di monitoraggio", value: 0 },
      { label: "Visita di medicina estetica viso/corpo", value: 0 },
      { label: "Concierge sanitario dedicato e priorità assoluta", value: 0 },
      { label: "Booklet personale «Il tuo Percorso di Salute»", value: 0 },
      { label: "Sconto Club 15% su tutte le prestazioni extra non incluse", value: 0 },
    ],
    genderExams: {
      uomo: [],
      donna: [
        { label: "Visita senologica specialistica + ecografia mammaria bilaterale", value: 0 },
      ],
    },
    doctorSlugs: EXPERIENCE_DOCTORS,
    perks: ["Diagnostica per immagini inclusa", "Concierge sanitario dedicato", "Accesso prioritario assoluto"],
  },
  {
    tierId: "signature",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [
      { label: "Tutte le prestazioni incluse nel percorso Experience", value: 0 },
      { label: "Check-up laboratorio Avanzato Uomo/Donna + test FIT (sangue occulto)", value: 0 },
      { label: "Ecografia addome completo ad alta risoluzione", value: 0 },
      { label: "Visita dermatologica specialistica + dermatoscopia (mappatura nei)", value: 0 },
      { label: "Test genomico DNA 5 + consulenza genetica specialistica", value: 0 },
      { label: "Visita cardiologica + ecocardiogramma Color Doppler", value: 0 },
      { label: "Visita oculistica specialistica + skin check-up", value: 0 },
      { label: "Visita nutrizionale specialistica con doppio follow-up", value: 0 },
      { label: "Igiene orale professionale + visita odontoiatrica con OPT", value: 0 },
      { label: "Coordinamento clinico multidisciplinare dedicato dell'équipe", value: 0 },
      { label: "Booklet personale «Il tuo Percorso di Salute»", value: 0 },
      { label: "Sconto Club 20% su tutte le prestazioni extra non incluse", value: 0 },
    ],
    genderExams: {
      uomo: [],
      donna: [
        { label: "Visita senologica specialistica + ecografia mammaria bilaterale", value: 0 },
      ],
    },
    doctorSlugs: EXPERIENCE_DOCTORS,
    perks: ["Genomica DNA 5 e longevità", "Coordinamento clinico multidisciplinare", "Refertazione prioritaria h24"],
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
