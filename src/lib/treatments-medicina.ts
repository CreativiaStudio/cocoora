import type { Treatment } from "./types";

export const MEDICINA_ESTETICA_TREATMENTS: Treatment[] = [
  {
    slug: "cryoliposculpt",
    title: "Cryoliposculpt",
    category: "medicina-estetica",
    tagline: "Riduzione non invasiva delle adiposità localizzate",
    description:
      "Cryoliposculpt è un trattamento non invasivo che agisce sulle adiposità localizzate resistenti a dieta ed esercizio. Attraverso il raffreddamento controllato dei tessuti, favorisce la riduzione progressiva dello spessore del pannicolo adiposo, rispettando i tessuti circostanti.",
    steps: [
      { title: "Valutazione medica", description: "Analisi delle aree da trattare e definizione del piano personalizzato." },
      { title: "Applicazione", description: "La manipola viene posizionata sull'area, con raffreddamento controllato e confortevole." },
      { title: "Risultato progressivo", description: "I risultati si manifestano gradualmente nelle settimane successive al trattamento." },
    ],
    machines: ["Cryoliposculpt", "Manipole dedicate"],
    faq: [
      { q: "Il trattamento è doloroso?", a: "No, durante la seduta si avverte una sensazione di freddo intenso iniziale che si attenua in pochi minuti." },
      { q: "Quante sedute sono necessarie?", a: "Dipende dall'area e dagli obiettivi: in genere una o due sedute per area, da valutare in visita medica." },
    ],
  },
  {
    slug: "ultrasuoni-cfu",
    title: "Ultrasuoni CFU",
    category: "medicina-estetica",
    tagline: "Tightening e ridefinizione di mandibola e collo",
    description:
      "Gli ultrasuoni focalizzati (CFU) stimolano il collagene in profondità per un effetto di tightening e ridefinizione del profilo di mandibola e collo, senza interventi chirurgici.",
    steps: [
      { title: "Valutazione", description: "Studio del profilo e delle aree da ridefinire." },
      { title: "Seduta", description: "Emissione di ultrasuoni focalizzati in profondità con effetto lifting progressivo." },
      { title: "Risultato", description: "Miglioramento del tono e del contorno nelle settimane successive." },
    ],
    machines: ["Ultrasuoni focalizzati CFU"],
    faq: [
      { q: "Quanto dura l'effetto?", a: "L'effetto tightening è progressivo e può durare molti mesi, con eventuali sedute di mantenimento." },
    ],
  },
  {
    slug: "piattaforma-laser",
    title: "Piattaforma Laser",
    category: "medicina-estetica",
    tagline: "QS NPP, Erbium, CPL e CO2 per viso e corpo",
    description:
      "La piattaforma laser integra tecnologie QS NPP, Erbium, CPL e CO2 per trattare macchie cutanee, texture irregolare, cicatrici e ringiovanimento del viso.",
    steps: [
      { title: "Diagnosi cutanea", description: "Identificazione del tipo di cute e delle problematiche da trattare." },
      { title: "Protocollo laser", description: "Scelta della tecnologia più adatta al singolo caso." },
      { title: "Follow-up", description: "Monitoraggio dei risultati e pianificazione delle sedute successive." },
    ],
    machines: ["Laser QS NPP", "Laser Erbium", "Luce pulsata CPL", "Laser CO2"],
    faq: [
      { q: "Quali problematiche tratta?", a: "Macchie cutanee, texture irregolare, cicatrici, rughe sottili e segni del fotoinvecchiamento." },
    ],
  },
  {
    slug: "filler-acido-ialuronico",
    title: "Filler Acido Ialuronico",
    category: "medicina-estetica",
    tagline: "Restauro dei volumi e armonizzazione del viso",
    description:
      "Il filler a base di acido ialuronico restituisce volume e definizione al viso, correggendo i segni del tempo con un risultato naturale e armonico.",
    steps: [
      { title: "Consulenza", description: "Valutazione dei volumi e degli obiettivi estetici." },
      { title: "Trattamento", description: "Iniezione di acido ialuronico con tecnica minimamente invasiva." },
      { title: "Controllo", description: "Verifica del risultato e follow-up programmato." },
    ],
    faq: [
      { q: "Il risultato è naturale?", a: "Sì, l'obiettivo è valorizzare i tratti in modo armonico, senza trasformarli." },
      { q: "Quanto dura?", a: "La durata varia in base al prodotto e all'area, generalmente da 6 a 18 mesi." },
    ],
  },
  {
    slug: "biorivitalizzazione",
    title: "Biorivitalizzazione",
    category: "medicina-estetica",
    tagline: "Idratazione profonda e luminosità della pelle",
    description:
      "La biorivitalizzazione idrata in profondità la pelle, migliorando elasticità, luminosità e compattezza con micro-iniezioni di sostanze biocompatibili.",
    steps: [
      { title: "Valutazione cutanea", description: "Analisi del grado di idratazione e delle esigenze della cute." },
      { title: "Micro-iniezioni", description: "Trattamento di stimolazione e idratazione profonda." },
      { title: "Ciclo consigliato", description: "In genere un ciclo di più sedute ravvicinate per un risultato ottimale." },
    ],
    faq: [
      { q: "Serve anestesia?", a: "No, il trattamento è ben tollerato e minimamente invasivo." },
    ],
  },
  {
    slug: "prx",
    title: "PRX",
    category: "medicina-estetica",
    tagline: "Biostimolazione senza aghi",
    description:
      "Il PRX è un trattamento di biostimolazione cutanea che migliora tono e texture della pelle senza utilizzo di aghi, ideale per un effetto rigenerativo delicato.",
    steps: [
      { title: "Applicazione", description: "Applicazione della soluzione biostimolante sulla cute." },
      { title: "Stimolazione", description: "Attivazione dei processi rigenerativi della pelle." },
      { title: "Risultato", description: "Pelle più luminosa, tonica e compatta nel tempo." },
    ],
    faq: [
      { q: "È adatto a tutti?", a: "È indicato per la maggior parte delle pelli; la valutazione medica preliminare conferma l'idoneità." },
    ],
  },
  {
    slug: "acido-polilattico",
    title: "Acido Polilattico",
    category: "medicina-estetica",
    tagline: "Biostimolazione volumetrica progressiva",
    description:
      "L'acido polilattico è un biostimolatore che agisce in profondità stimolando la produzione di collagene per un effetto di rimpolpamento progressivo e naturale.",
    steps: [
      { title: "Valutazione", description: "Definizione delle aree e del numero di sedute." },
      { title: "Trattamento", description: "Iniezioni di acido polilattico nelle aree da stimolare." },
      { title: "Risultato graduale", description: "L'effetto si sviluppa gradualmente nell'arco di alcune settimane." },
    ],
    faq: [
      { q: "Quante sedute servono?", a: "In genere un ciclo di 2-3 sedute distanziate, da personalizzare in base agli obiettivi." },
    ],
  },
  {
    slug: "tossina-botulinica",
    title: "Tossina Botulinica",
    category: "medicina-estetica",
    tagline: "Trattamento delle rughe d'espressione",
    description:
      "Il trattamento con tossina botulinica distende le rughe d'espressione, donando un aspetto riposato e naturale, con una tecnica medica attenta all'armonia del viso.",
    steps: [
      { title: "Consulto medico", description: "Analisi delle rughe d'espressione e delle aspettative." },
      { title: "Trattamento", description: "Micro-iniezioni mirate nelle aree da distendere." },
      { title: "Risultato", description: "Effetto visibile in pochi giorni, mantenuto per alcuni mesi." },
    ],
    faq: [
      { q: "Il viso resta espressivo?", a: "Sì, l'obiettivo è un risultato naturale che preserva l'espressività." },
    ],
  },
  {
    slug: "carbossiterapia",
    title: "Carbossiterapia",
    category: "medicina-estetica",
    tagline: "Microcircolo, tono e ossigenazione dei tessuti",
    description:
      "La carbossiterapia utilizza micro-iniezioni di anidride carbonica medicale per migliorare microcircolo, tono e ossigenazione dei tessuti, utile su corpo e viso.",
    steps: [
      { title: "Valutazione", description: "Individuazione delle aree da trattare." },
      { title: "Seduta", description: "Somministrazione controllata di CO2 medicale." },
      { title: "Ciclo", description: "Un ciclo di sedute per risultati progressivi e duraturi." },
    ],
    faq: [
      { q: "È sicura?", a: "Sì, utilizza anidride carbonica medicale e viene eseguita da personale qualificato." },
    ],
  },
];
