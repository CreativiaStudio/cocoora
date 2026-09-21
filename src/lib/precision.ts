import type { DnaCombo, MicrobiotaKit, PrecisionProgram } from "./types";

export const PRECISION_PROGRAMS: PrecisionProgram[] = [
  {
    id: "skin-precision",
    name: "Skin Precision",
    tagline: "Beauty & Skin Quality Program",
    description:
      "Il percorso medico dedicato alla qualità biologica della pelle. Superiamo il concetto di singolo trattamento isolato per creare un protocollo rigenerativo personalizzato basato su microbioma cutaneo, collagene e texture profonda.",
    image: "/images/aesthetic-skin.jpg",
    options: [
      {
        id: "skin-base",
        name: "Skin Precision Base",
        price: 250,
        description: "Valutazione medica estetica/dermatologica approfondita, skin check-up digitale e piano rigenerativo.",
        includes: [
          "Visita medica estetica / dermatologica",
          "Skin check-up digitale computerizzato",
          "Piano personalizzato di protocolli combinati",
          "Follow-up e monitoraggio della risposta biologica",
        ],
      },
      {
        id: "skin-advanced-micro",
        name: "Skin Precision Advanced (Microbiota)",
        price: 490,
        description: "Tutto il percorso Base integrato con il test del microbioma della pelle o intestinale.",
        includes: [
          "Tutto il pacchetto Skin Precision Base",
          "Kit test microbiota cutaneo o intestinale",
          "Referto scientifico di laboratorio",
          "Consulenza medica di lettura integrata",
        ],
        highlight: true,
      },
      {
        id: "skin-advanced-dna",
        name: "Skin Precision Advanced (DNA 5 Skin)",
        price: 690,
        description: "Tutto il percorso Base integrato con il pannello genetico DNA 5 Skin & Beauty.",
        includes: [
          "Tutto il pacchetto Skin Precision Base",
          "Test genetico DNA 5 Skin & Beauty (5 pannelli mirati)",
          "Referto genetico su aging cutaneo, antiossidanti ed elastina",
          "Consulenza specialistica di orientamento dermocosmetico e laser",
        ],
      },
    ],
  },
  {
    id: "nutri-precision",
    name: "Nutri Precision",
    tagline: "Metabolic & Microbiota Program",
    description:
      "Nutrizione scientifica e metabolismo su misura. Nessuna dieta generica o promesse di intolleranze indifferenziate: analizziamo la tua risposta biologica individuale, il microbioma e il profilo genetico.",
    image: "/images/body-wellness.jpg",
    options: [
      {
        id: "nutri-microbiota",
        name: "Nutri Precision Microbiota",
        price: 490,
        description: "Visita nutrizionale clinica + analisi NGS del microbiota intestinale per disbiosi, gonfiore e metabolismo.",
        includes: [
          "Visita nutrizionale con anamnesi metabolica",
          "Test microbiota intestinale (kit domiciliare)",
          "Referto laboratoristico completo",
          "Piano alimentare personalizzato e 1 controllo",
        ],
      },
      {
        id: "nutri-dna",
        name: "Nutri Precision DNA",
        price: 690,
        description: "Visita nutrizionale + test genetico DNA 5 Nutri Metabolic (metabolismo zuccheri/lipidi, detox e micronutrienti).",
        includes: [
          "Visita nutrizionale clinica approfondita",
          "Test DNA 5 Nutri Metabolic (5 pannelli genetici)",
          "Piano nutrizionale basato sul genotipo",
          "1 visita di controllo e follow-up",
        ],
      },
      {
        id: "nutri-complete",
        name: "Nutri Precision Complete",
        price: 890,
        description: "L'approccio più completo: sinergia simultanea tra analisi del microbiota intestinale e DNA 5.",
        includes: [
          "Visita nutrizionale clinica iniziale",
          "Test microbiota intestinale + Test DNA 5 Nutri Metabolic",
          "Lettura congiunta dei report genetici e del microbioma",
          "Piano alimentare ad alta precisione e monitoraggio a 3 mesi",
        ],
        highlight: true,
      },
    ],
  },
  {
    id: "donna-precision",
    name: "Donna Precision",
    tagline: "Women's Health & Longevity Program",
    description:
      "Prevenzione e benessere femminile integrato a 360°. Unisce diagnostica senologica, ecografia pelvica, salute cutanea, equilibrio del microbioma e profilo ormonale per ogni fase della vita.",
    image: "/images/doctor-consultation.jpg",
    options: [
      {
        id: "donna-base",
        name: "Donna Precision Base",
        price: 590,
        description: "Visita senologica + ecografia mammaria + ecografia pelvica + visita medicina estetica e nutrizione.",
        includes: [
          "Visita senologica clinica ed ecografia mammaria",
          "Ecografia pelvica sovrapubica / transvaginale",
          "Visita medicina estetica viso/corpo e skin check-up",
          "Consulenza nutrizionale orientativa",
        ],
      },
      {
        id: "donna-advanced",
        name: "Donna Precision Advanced",
        price: 790,
        description: "Include tutto il percorso Base con aggiunta di test del microbiota vaginale o intestinale.",
        includes: [
          "Tutto il pacchetto Donna Precision Base",
          "Test microbiota vaginale o intestinale con kit a casa",
          "Referto laboratoristico e consulenza di lettura",
          "Orientamento ginecologico integrato",
        ],
        highlight: true,
      },
      {
        id: "donna-complete",
        name: "Donna Precision Complete",
        price: 990,
        description: "Il protocollo donna definitivo: Base + DNA 5 Donna + Microbiota con integrazione specialistica.",
        includes: [
          "Tutto il pacchetto Donna Precision Base",
          "Test genetico DNA 5 Donna (estrogeni, tiroide, ossa, metabolismo)",
          "Test microbiota vaginale o intestinale",
          "Consulenza multidisciplinare e piano salute a lungo termine",
        ],
      },
    ],
  },
];

export const DNA_COMBOS: DnaCombo[] = [
  {
    id: "longevity-core",
    name: "DNA 5 — Longevity Core",
    description: "Configurazione cardine per Signature Longevity. Focus su invecchiamento cellulare, protezione cardiovascolare e infiammazione silente.",
    areas: ["CardioPrevent", "Metabolismo", "Infiammazione", "Anti-Aging", "Micronutrienti"],
  },
  {
    id: "skin-beauty",
    name: "DNA 5 — Skin & Beauty",
    description: "Supporto ai percorsi di medicina estetica e rigenerativa. Analizza predisposizione a perdita di collagene, stress ossidativo e tono cutaneo.",
    areas: ["Pelle", "Anti-Aging", "Infiammazione", "Detox", "Micronutrienti"],
  },
  {
    id: "nutri-metabolic",
    name: "DNA 5 — Nutri Metabolic",
    description: "Profilo nutrizionale e risposta individuale agli alimenti: metabolismo dei carboidrati, grassi, gestione dell'infiammazione e detossificazione.",
    areas: ["Metabolismo", "Intolleranze & Allergie", "Micronutrienti", "Infiammazione", "Detox"],
  },
  {
    id: "donna",
    name: "DNA 5 — Donna",
    description: "Equilibrio ormonale femminile, metabolismo degli estrogeni, densità minerale ossea e salute tiroidea.",
    areas: ["Estrogeni", "Tiroide", "Ossa", "Metabolismo", "Micronutrienti"],
  },
  {
    id: "uomo-performance",
    name: "DNA 5 — Uomo Performance & Prevention",
    description: "Target maschile attivo, manager e sportivi: predisposizione cardiovascolare, efficienza energetica e recupero muscolare.",
    areas: ["CardioPrevent", "Metabolismo", "Micronutrienti", "Top Training", "Talent"],
  },
  {
    id: "neuro-stress",
    name: "DNA 5 — Neuro Stress",
    description: "Equilibrio neurochimico, risposta fisiologica allo stress cronico, regolazione del ciclo sonno-veglia e concentrazione.",
    areas: ["Neurogenomica", "Infiammazione", "Micronutrienti", "Metabolismo", "Anti-Aging"],
  },
  {
    id: "pharma-safe",
    name: "DNA 5 — Pharma Safe",
    description: "Riservato a pazienti con indicazione medica: farmacogenomica, biotrasformazione epatica e sicurezza nei percorsi terapeutici.",
    areas: ["Farmacogenomica", "Detox", "Infiammazione", "Metabolismo", "CardioPrevent"],
  },
];

export const MICROBIOTA_KITS: MicrobiotaKit[] = [
  {
    id: "microbiota-intestinale",
    name: "Microbiota Intestinale NGS",
    description: "Sequenziamento genetico dell'ecosistema batterico intestinale. Identifica disbiosi, biodiversità, ceppi protettivi e batteri infiammatori.",
    includes: [
      "Kit prelievo a domicilio non invasivo",
      "Spedizione refrigerata tracciata al laboratorio partner",
      "Sequenziamento NGS ad alta profondità",
      "Referto clinico e consulenza medica di lettura",
    ],
  },
  {
    id: "microbiota-cutaneo",
    name: "Microbiota Pelle",
    description: "Analisi dell'equilibrio della barriera cutanea per comprendere acne recidiva, dermatiti, sensibilità e invecchiamento precoce.",
    includes: [
      "Tampone cutaneo non invasivo",
      "Mappatura dei ceppi cutanei protettivi",
      "Protocollo dermocosmetico personalizzato in base al referto",
    ],
  },
  {
    id: "microbiota-vaginale",
    name: "Microbiota Vaginale",
    description: "Valutazione dell'ecosistema vaginale e dei lattobacilli per cistiti o vaginiti ricorrenti, fertilità e benessere pelvico.",
    includes: [
      "Kit tampone domiciliare semplice e indolore",
      "Valutazione del profilo di protezione naturale",
      "Piano integrativo e terapeutico mirato con il ginecologo",
    ],
  },
];
