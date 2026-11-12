import type { ClubExamItem, ClubTierDetail } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Layer 3 — Prestazioni cliniche incluse nei Percorsi Salute Cocoora Club.
// Fonte Unica e Ufficiale: documento definitivo di Simone Papagno (10/11/2026).
// ─────────────────────────────────────────────────────────────────────────

const CORE_DOCTORS = ["elisa-russo", "alessandra-riccardi", "anna-maria-stillo", "jessica-de-ceglie"];
const CARE_DOCTORS = [...CORE_DOCTORS, "mario-toro", "martina-pontillo"];
const EXPERIENCE_DOCTORS = [...CARE_DOCTORS, "giuseppe-buono", "titti-errico", "patty-scorzelli", "mirella-dandrea"];

const DOSSIER_TOOLTIP =
  "Documento personale che riunisce risultati, referti e indicazioni dei professionisti per comprendere il tuo stato salute ed i prossimi passi.";
const MAMMOGRAFIA_NOTE =
  "Nota: La mammografia non è inclusa nella membership e può essere effettuata presso un centro convenzionato.";
const VISITA_MEDICA_TOOLTIP =
  "Anamnesi, esame medico, valutazione diagnostica ed eventuale prescrizione di esami o terapie.";
const DNA5_TOOLTIP =
  "È un test genetico predittivo che individua la presenza di varianti genetiche che possono essere associate ad una predisposizione a sviluppare una determinata patologia, problematica, carenza.";

const EXPERIENCE_UOMO_EXAMS: ClubExamItem[] = [
  { label: "Analisi del sangue con prelievo e analisi delle urine: Check-up Completo Uomo (48 parametri)", value: 0, checkupPanel: "completo_48" },
  { label: "Visita medica completa", value: 0, tooltip: VISITA_MEDICA_TOOLTIP },
  { label: "Visita cardiologica", value: 0 },
  { label: "Elettrocardiogramma (ECG) a 12 derivazioni", value: 0 },
  { label: "Ecocardiogramma Color Doppler", value: 0 },
  { label: "Visita oculistica", value: 0 },
  { label: "Visita odontoiatrica con ortopantomografia (OPT – Panoramica)", value: 0 },
  { label: "Seduta di igiene orale professionale", value: 0 },
  { label: "Visita di medicina estetica viso e corpo (valutazione clinica)", value: 0 },
  { label: "Visita nutrizionale specialistica con piano alimentare personalizzato", value: 0 },
  { label: "Primo controllo nutrizionale di monitoraggio", value: 0 },
  { label: "Secondo controllo nutrizionale di monitoraggio", value: 0 },
  { label: "Dossier “Il tuo Percorso Salute”", value: 0, tooltip: DOSSIER_TOOLTIP },
  { label: "Sconto Club 15% sulle prestazioni aggiuntive", value: 0 },
];

const SIGNATURE_UOMO_EXAMS: ClubExamItem[] = [
  { label: "Analisi del sangue con prelievo e analisi delle urine: Check-up Avanzato Uomo (59 parametri)", value: 0, checkupPanel: "avanzato_uomo_59" },
  { label: "Test FIT (ricerca immunochimica del sangue occulto nelle feci)", value: 0 },
  { label: "Visita medica completa", value: 0, tooltip: VISITA_MEDICA_TOOLTIP },
  { label: "Visita cardiologica", value: 0 },
  { label: "Elettrocardiogramma (ECG) a 12 derivazioni", value: 0 },
  { label: "Ecocardiogramma Color Doppler", value: 0 },
  { label: "Ecografia addominale", value: 0 },
  { label: "Visita dermatologica con dermatoscopia", value: 0 },
  { label: "Visita oculistica", value: 0 },
  { label: "Visita odontoiatrica con ortopantomografia (OPT – Panoramica)", value: 0 },
  { label: "Seduta di igiene orale professionale", value: 0 },
  { label: "Visita di medicina estetica viso e corpo (valutazione clinica)", value: 0 },
  { label: "Visita nutrizionale specialistica con piano alimentare personalizzato", value: 0 },
  { label: "Primo controllo nutrizionale di monitoraggio", value: 0 },
  { label: "Secondo controllo nutrizionale di monitoraggio", value: 0 },
  { label: "Test Cocoora DNA 5 con consulenza genetica", value: 0, tooltip: DNA5_TOOLTIP },
  { label: "Dossier “Il tuo Percorso Salute”", value: 0, tooltip: DOSSIER_TOOLTIP },
  { label: "Sconto Club 20% sulle prestazioni aggiuntive", value: 0 },
];

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
      { label: "Analisi del sangue con prelievo e analisi delle urine: Check-up Salute (17 parametri)", value: 0, checkupPanel: "salute_17" },
      { label: "Visita medica completa", value: 0, tooltip: VISITA_MEDICA_TOOLTIP },
      { label: "Elettrocardiogramma (ECG) a 12 derivazioni con referto", value: 0 },
      { label: "Visita odontoiatrica con ortopantomografia (OPT – Panoramica)", value: 0 },
      { label: "Visita di medicina estetica viso e corpo (valutazione clinica)", value: 0 },
      { label: "Dossier “Il tuo Percorso Salute”", value: 0, tooltip: DOSSIER_TOOLTIP },
      { label: "Sconto Club 5% sulle prestazioni aggiuntive", value: 0 },
    ],
    doctorSlugs: CORE_DOCTORS,
    perks: ["Accesso prioritario alla clinica", "Condizioni dedicate riservate agli iscritti", "Referti digitali h24"],
  },
  {
    tierId: "care",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: [
      { label: "Analisi del sangue con prelievo e analisi delle urine: Check-up Salute (17 parametri)", value: 0, checkupPanel: "salute_17" },
      { label: "Visita medica completa", value: 0, tooltip: VISITA_MEDICA_TOOLTIP },
      { label: "Elettrocardiogramma (ECG) a 12 derivazioni con referto", value: 0 },
      { label: "Visita odontoiatrica con ortopantomografia (OPT – Panoramica)", value: 0 },
      { label: "Seduta di igiene orale professionale", value: 0 },
      { label: "Visita di medicina estetica viso e corpo (valutazione clinica)", value: 0 },
      { label: "Visita nutrizionale specialistica con piano alimentare personalizzato", value: 0 },
      { label: "Primo controllo nutrizionale di monitoraggio", value: 0 },
      { label: "Dossier “Il tuo Percorso Salute”", value: 0, tooltip: DOSSIER_TOOLTIP },
      { label: "Sconto Club 10% sulle prestazioni aggiuntive", value: 0 },
    ],
    doctorSlugs: CARE_DOCTORS,
    perks: ["Priorità di prenotazione", "Percorsi Uomo / Donna dedicati", "Continuità assistenziale coordinata"],
  },
  {
    tierId: "experience",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: EXPERIENCE_UOMO_EXAMS,
    genderExams: {
      uomo: EXPERIENCE_UOMO_EXAMS,
      donna: [
        { label: "Analisi del sangue con prelievo e analisi delle urine: Check-up Completo Donna (48 parametri)", value: 0, checkupPanel: "completo_48" },
        { label: "Visita medica completa", value: 0, tooltip: VISITA_MEDICA_TOOLTIP },
        { label: "Visita cardiologica", value: 0 },
        { label: "Elettrocardiogramma (ECG) a 12 derivazioni", value: 0 },
        { label: "Ecocardiogramma Color Doppler", value: 0 },
        { label: "Visita senologica con ecografia mammaria bilaterale", value: 0, tooltip: MAMMOGRAFIA_NOTE },
        { label: "Visita oculistica", value: 0 },
        { label: "Visita odontoiatrica con ortopantomografia (OPT – Panoramica)", value: 0 },
        { label: "Seduta di igiene orale professionale", value: 0 },
        { label: "Visita di medicina estetica viso e corpo (valutazione clinica)", value: 0 },
        { label: "Visita nutrizionale specialistica con piano alimentare personalizzato", value: 0 },
        { label: "Primo controllo nutrizionale di monitoraggio", value: 0 },
        { label: "Secondo controllo nutrizionale di monitoraggio", value: 0 },
        { label: "Dossier “Il tuo Percorso Salute”", value: 0, tooltip: DOSSIER_TOOLTIP },
        { label: "Sconto Club 15% sulle prestazioni aggiuntive", value: 0 },
      ],
    },
    doctorSlugs: EXPERIENCE_DOCTORS,
    perks: ["Diagnostica per immagini inclusa", "Percorsi Uomo / Donna dedicati", "Accesso prioritario assoluto"],
  },
  {
    tierId: "signature",
    installmentCount: 3,
    installmentProviders: ["Klarna", "Scalapay", "PayPal"],
    commonExams: SIGNATURE_UOMO_EXAMS,
    genderExams: {
      uomo: SIGNATURE_UOMO_EXAMS,
      donna: [
        { label: "Analisi del sangue con prelievo e analisi delle urine: Check-up Avanzato Donna (57 parametri)", value: 0, checkupPanel: "avanzato_donna_57" },
        { label: "Test FIT (ricerca immunochimica del sangue occulto nelle feci)", value: 0 },
        { label: "Visita medica completa", value: 0, tooltip: VISITA_MEDICA_TOOLTIP },
        { label: "Visita cardiologica", value: 0 },
        { label: "Elettrocardiogramma (ECG) a 12 derivazioni", value: 0 },
        { label: "Ecocardiogramma Color Doppler", value: 0 },
        { label: "Visita ginecologica con ecografia e Pap-test", value: 0 },
        { label: "Visita senologica con ecografia mammaria bilaterale", value: 0, tooltip: MAMMOGRAFIA_NOTE },
        { label: "Ecografia addominale", value: 0 },
        { label: "Visita dermatologica con dermatoscopia", value: 0 },
        { label: "Visita oculistica", value: 0 },
        { label: "Visita odontoiatrica con ortopantomografia (OPT – Panoramica)", value: 0 },
        { label: "Seduta di igiene orale professionale", value: 0 },
        { label: "Visita di medicina estetica viso e corpo (valutazione clinica)", value: 0 },
        { label: "Visita nutrizionale specialistica con piano alimentare personalizzato", value: 0 },
        { label: "Primo controllo nutrizionale di monitoraggio", value: 0 },
        { label: "Secondo controllo nutrizionale di monitoraggio", value: 0 },
        { label: "Test Cocoora DNA 5 con consulenza genetica", value: 0, tooltip: DNA5_TOOLTIP },
        { label: "Dossier “Il tuo Percorso Salute”", value: 0, tooltip: DOSSIER_TOOLTIP },
        { label: "Sconto Club 20% sulle prestazioni aggiuntive", value: 0 },
      ],
    },
    doctorSlugs: EXPERIENCE_DOCTORS,
    perks: ["Genomica DNA 5 e longevità", "Screening avanzato FIT ed ecografia addome", "Refertazione prioritaria h24"],
  },
];

export function getTierDetail(tierId: string): ClubTierDetail | undefined {
  return CLUB_TIER_DETAILS.find((d) => d.tierId === tierId);
}

export function computeTierValue(
  detail: ClubTierDetail,
  gender?: "uomo" | "donna"
): { items: ClubExamItem[]; total: number } {
  const items =
    gender && detail.genderExams && detail.genderExams[gender]?.length
      ? detail.genderExams[gender]
      : detail.commonExams;
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
