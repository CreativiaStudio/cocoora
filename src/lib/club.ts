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
      "Accesso al catalogo servizi",
      "Prenotazione a tariffa piena",
      "Referti e documenti digitali",
      "Kit di benvenuto Cocoora",
    ],
    free: true,
  },
  {
    id: "access",
    name: "Access",
    shortName: "Access",
    price: 99,
    priceLabel: "€99 / anno",
    description:
      "Il pacchetto di ingresso per iniziare un percorso di prevenzione essenziale.",
    features: [
      "Visita medica generale",
      "ECG a riposo",
      "Esami ematici — pannello base",
      "Visita odontoiatrica + OPT",
      "Consulenza nutrizionale",
      "Visita di medicina estetica",
      "Sconto 5% sui servizi",
    ],
  },
  {
    id: "care",
    name: "Care",
    shortName: "Care",
    price: 349,
    priceLabel: "€349 / anno",
    badge: "Più Scelto",
    description:
      "Il percorso di prevenzione completo per prenderti cura di te, tutto l'anno.",
    genderToggle: true,
    features: [
      "Check-up completo personalizzato",
      "Consulenze specialistiche dedicate",
      "Priorità di prenotazione",
      "Referti e monitoraggio digitale",
      "Sconti esclusivi sui trattamenti",
      "Percorsi Uomo / Donna dedicati",
    ],
  },
  {
    id: "experience",
    name: "Experience",
    shortName: "Experience",
    price: 649,
    priceLabel: "€649 / anno",
    description:
      "Un'esperienza di salute elevata, con check-up avanzati e servizi premium.",
    genderToggle: true,
    features: [
      "Tutto il percorso Care",
      "Check-up avanzati estesi",
      "Diagnostica per immagini inclusa",
      "Accesso prioritario assoluto",
      "Concierge sanitario dedicato",
      "Percorsi Uomo / Donna premium",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    shortName: "Signature",
    price: 890,
    priceLabel: "€890 / anno",
    description:
      "Il massimo della prevenzione, con un team multidisciplinare al tuo fianco.",
    features: [
      "Tutto il percorso Experience",
      "Valutazione multidisciplinare",
      "Percorso di salute personalizzato",
      "Una singola consulenza per ciascuna specialità inclusa",
      "Refertazione prioritaria",
    ],
  },
  {
    id: "signature-longevity",
    name: "Signature Longevity",
    shortName: "Longevity",
    price: 1190,
    listPrice: 1280,
    priceLabel: "€1.190 / anno",
    description:
      "Il programma più avanzato dedicato alla longevità e all'ottimizzazione del benessere.",
    features: [
      "Tutto il percorso Signature",
      "Protocollo Longevity dedicato",
      "Test genetici e biomarcatori",
      "Piano nutrizionale di precisione",
      "Follow-up continuo dedicato",
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

export const CLUB_BENEFITS = [
  { label: "Priorità di prenotazione", access: true, care: true, experience: true, signature: true },
  { label: "Check-up dedicati", access: true, care: true, experience: true, signature: true },
  { label: "Diagnostica per immagini", access: false, care: true, experience: true, signature: true },
  { label: "Concierge sanitario", access: false, care: false, experience: true, signature: true },
  { label: "Percorsi Longevity", access: false, care: false, experience: false, signature: true },
];
