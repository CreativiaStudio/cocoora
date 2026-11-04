import type { ClubTier, PrecisionPath } from "./types";

export const CLUB_TIERS: ClubTier[] = [
  {
    id: "discover",
    name: "Discover",
    shortName: "Discover",
    price: 0,
    priceLabel: "Free",
    description:
      "Il percorso gratuito per entrare in Cocoora Club e iniziare il tuo percorso digitale.",
    features: [
      "Registrazione app Cocoora",
      "Profilo sanitario digitale",
      "Questionario anamnestico di base",
      "Accesso al catalogo servizi e referti digitali",
      "Kit di benvenuto Cocoora",
    ],
    free: true,
  },
  {
    id: "access",
    name: "Access",
    shortName: "Access",
    price: 149,
    priceLabel: "€149 / anno",
    discountClub: "5%",
    checkupName: "Cocoora Check-up Salute (17 voci)",
    description:
      "La porta d'ingresso nel mondo Cocoora: una prima valutazione dello stato di salute essenziale.",
    features: [
      "Check-up laboratorio Salute (17 voci)",
      "Medicina Interna + ECG a 12 derivazioni",
      "Visita odontoiatrica specialistica + OPT",
      "Visita medicina estetica viso e corpo",
      "Booklet «Il tuo Percorso di Salute»",
      "Sconto Club 5% sulle prestazioni extra",
    ],
  },
  {
    id: "care",
    name: "Care Plus",
    shortName: "Care Plus",
    price: 299,
    priceLabel: "€299 / anno",
    badge: "Più Scelto",
    discountClub: "10%",
    checkupName: "Cocoora Check-up Salute (17 voci)",
    description:
      "Percorso completo di prevenzione, salute orale e nutrizione con prestazioni e continuità.",
    features: [
      "Tutte le prestazioni incluse in Access",
      "Seduta di igiene orale professionale in sede",
      "Visita nutrizionale + piano alimentare scritto",
      "1° controllo nutrizionale di monitoraggio",
      "Booklet «Il tuo Percorso di Salute»",
      "Sconto Club 10% sulle prestazioni extra",
    ],
  },
  {
    id: "experience",
    name: "Experience",
    shortName: "Experience",
    price: 599,
    priceUomo: 599,
    priceDonna: 649,
    priceLabel: "da €599 / anno",
    badge: "Avanzato",
    discountClub: "15%",
    genderToggle: true,
    checkupName: "Cocoora Check-up Completo Uomo / Donna",
    description:
      "Un approfondimento della salute con analisi più complete e valutazioni specialistiche integrate.",
    descriptionDonna:
      "Un percorso completo con approfondimenti specialistici e attenzione alla salute del seno.",
    features: [
      "Tutte le prestazioni Care Plus",
      "Check-up Completo Uomo (laboratorio)",
      "Cardiologia + ecocardiogramma Color Doppler",
      "Oculistica specialistica + skin check-up",
      "2° controllo nutrizionale di monitoraggio",
      "Sconto Club 15% sulle prestazioni extra",
    ],
    featuresDonna: [
      "Tutte le prestazioni Care Plus",
      "Check-up Completo Donna (laboratorio)",
      "Senologia + eco mammaria bilaterale",
      "Cardiologia + ecocardiogramma Color Doppler",
      "Oculistica specialistica + skin check-up",
      "Sconto Club 15% sulle prestazioni extra",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    shortName: "Signature",
    price: 940,
    priceUomo: 940,
    priceDonna: 990,
    priceLabel: "da €940 / anno",
    badge: "Top Longevity",
    discountClub: "20%",
    genderToggle: true,
    checkupName: "Cocoora Check-up Avanzato Uomo / Donna + FIT",
    description:
      "Il percorso più approfondito di Cocoora Club, con analisi avanzate e test genomico DNA 5.",
    descriptionDonna:
      "Il percorso più approfondito dedicato alla salute femminile con genomica e diagnostica d'eccellenza.",
    features: [
      "Tutte le prestazioni Experience Uomo",
      "Check-up Avanzato Uomo + test FIT",
      "Ecografia addominale completa",
      "Dermatologia specialistica + dermatoscopia",
      "Test Cocoora DNA 5 con consulenza genetica",
      "Sconto Club 20% sulle prestazioni extra",
    ],
    featuresDonna: [
      "Tutte le prestazioni Experience Donna",
      "Check-up Avanzato Donna + test FIT",
      "Senologia + eco mammaria bilaterale",
      "Ecografia addominale completa",
      "Test Cocoora DNA 5 con consulenza genetica",
      "Sconto Club 20% sulle prestazioni extra",
    ],
  },
];

export const FAMILY_ADDONS: ClubTier[] = [
  {
    id: "family-basic",
    name: "Family Care Basic",
    shortName: "Basic",
    price: 149,
    priceLabel: "€149 / anno",
    description:
      "Copertura essenziale per i minori collegati a un Percorso Salute adulto (attivabile su percorsi da €99 / anno in su, escluso Discover Free).",
    features: ["Visite pediatriche di base", "Check-up essenziale", "Referti digitali"],
    family: true,
  },
  {
    id: "family-elite",
    name: "Family Care Elite",
    shortName: "Elite",
    price: 199,
    priceLabel: "€199 / anno",
    description:
      "Copertura completa tutto l'anno per la salute dei più piccoli, riservata ai titolari di percorsi con quota pari o superiore ad Access (€99+ / anno).",
    features: ["Visite pediatriche estese", "Check-up completo", "Priorità di prenotazione"],
    family: true,
  },
];

export const PRECISION_PATHS: PrecisionPath[] = [
  {
    id: "skin-precision",
    name: "Skin Precision",
    description:
      "Diagnosi cutanea avanzata e protocolli personalizzati per la salute della pelle.",
    features: ["Analisi cutanea strumentale", "Protocollo rigenerativo", "Follow-up dedicato"],
  },
  {
    id: "nutri-precision",
    name: "Nutri Precision",
    description:
      "Piani nutrizionali di precisione basati su dati clinici e obiettivi personali.",
    features: ["Valutazione composizione corporea", "Piano personalizzato", "Monitoraggio continuo"],
  },
  {
    id: "donna-precision",
    name: "Donna Precision",
    description:
      "Percorsi dedicati alla salute della donna in ogni fase della vita.",
    features: ["Check-up dedicati", "Screening mirati", "Equipe specialistica"],
  },
  {
    id: "dna-genomix",
    name: "DNA 5 Genomix",
    description:
      "Analisi genomica per comprendere predisposizioni e orientare la prevenzione.",
    features: ["Test genetico 5 aree", "Report interpretato", "Piano preventivo"],
  },
  {
    id: "microbiota",
    name: "Microbiota",
    description:
      "Analisi del microbiota per riequilibrare l'asse intestino-salute.",
    features: ["Test microbiota", "Piano di riequilibrio", "Consulenza dedicata"],
  },
];

export type ComparisonBenefitRow = {
  category?: string;
  label: string;
  access: boolean | string;
  care: boolean | string;
  experience: boolean | string;
  signature: boolean | string;
  note?: string;
};

export const CLUB_BENEFITS: ComparisonBenefitRow[] = [
  {
    category: "Prevenzione & Diagnostica",
    label: "Check-up laboratorio ematochimico",
    access: "Salute (17 voci)",
    care: "Salute (17 voci)",
    experience: "Completo U/D",
    signature: "Avanzato U/D",
  },
  {
    category: "Prevenzione & Diagnostica",
    label: "FIT (sangue occulto fecale immunochimico)",
    access: false,
    care: false,
    experience: false,
    signature: true,
  },
  {
    category: "Visite Cliniche & Strumentali",
    label: "Medicina interna + ECG 12 derivazioni con referto",
    access: true,
    care: true,
    experience: true,
    signature: true,
  },
  {
    category: "Visite Cliniche & Strumentali",
    label: "Visita odontoiatrica specialistica + OPT digitale",
    access: true,
    care: true,
    experience: true,
    signature: true,
  },
  {
    category: "Visite Cliniche & Strumentali",
    label: "Visita medicina estetica viso/corpo (valutazione)",
    access: true,
    care: true,
    experience: true,
    signature: true,
    note: "Valutazione clinica specialistica senza trattamenti inclusi",
  },
  {
    category: "Salute Orale & Nutrizione",
    label: "Seduta di igiene orale professionale",
    access: false,
    care: true,
    experience: true,
    signature: true,
  },
  {
    category: "Salute Orale & Nutrizione",
    label: "Visita nutrizionale specialistica + piano alimentare",
    access: false,
    care: true,
    experience: true,
    signature: true,
  },
  {
    category: "Salute Orale & Nutrizione",
    label: "Primo controllo nutrizionale di monitoraggio",
    access: false,
    care: true,
    experience: true,
    signature: true,
  },
  {
    category: "Salute Orale & Nutrizione",
    label: "Secondo controllo nutrizionale di monitoraggio",
    access: false,
    care: false,
    experience: true,
    signature: true,
  },
  {
    category: "Specialistiche Avanzate",
    label: "Cardiologia + ecocardiogramma Color Doppler",
    access: false,
    care: false,
    experience: true,
    signature: true,
  },
  {
    category: "Specialistiche Avanzate",
    label: "Oculistica specialistica + skin check-up",
    access: false,
    care: false,
    experience: true,
    signature: true,
  },
  {
    category: "Specialistiche Avanzate",
    label: "Senologia + ecografia mammaria bilaterale (Donna)",
    access: false,
    care: false,
    experience: "✓ (Donna)",
    signature: "✓ (Donna)",
    note: "Mammografia non in sede (centro esterno convenzionato)",
  },
  {
    category: "Diagnostica di Secondo Livello",
    label: "Ecografia addome completo",
    access: false,
    care: false,
    experience: false,
    signature: true,
  },
  {
    category: "Diagnostica di Secondo Livello",
    label: "Dermatologia + dermatoscopia (Mappatura nei)",
    access: false,
    care: false,
    experience: false,
    signature: true,
  },
  {
    category: "Genomica & Longevità",
    label: "Test genomico DNA 5 + consulenza genetica",
    access: false,
    care: false,
    experience: false,
    signature: true,
  },
  {
    category: "Servizi di Governance & Coordinamento",
    label: "Booklet personale «Il tuo Percorso di Salute»",
    access: true,
    care: true,
    experience: true,
    signature: true,
  },
  {
    category: "Servizi di Governance & Coordinamento",
    label: "Sconto Club su tutte le prestazioni extra",
    access: "5%",
    care: "10%",
    experience: "15%",
    signature: "20%",
  },
];
