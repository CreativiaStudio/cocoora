import type { Treatment } from "./types";

export const ODONTOIATRIA_TREATMENTS: Treatment[] = [
  {
    slug: "invisalign-adulti",
    title: "Invisalign Adulti",
    category: "odontoiatria",
    tagline: "Allineatori trasparenti per adulti — Invisalign Diamond Provider",
    description:
      "Il percorso Invisalign per adulti allinea il sorriso con allineatori trasparenti personalizzati, progettati secondo un piano clinico digitale individuale. Dalla diagnosi alla fase di mantenimento, accompagniamo ogni paziente in un percorso ortodontico completo.",
    steps: [
      { title: "Diagnosi e scansione", description: "Scansione 3D del sorriso e definizione del piano digitale." },
      { title: "Piano clinico", description: "Simulazione del movimento dentale e consegna degli allineatori." },
      { title: "Monitoraggio", description: "Controlli periodici e fase di mantenimento dedicata." },
    ],
    machines: ["Scanner intraorale 3D", "Allineatori Invisalign"],
    faq: [
      { q: "Quanto dura il trattamento?", a: "La durata dipende dalla complessità del caso, in genere da 6 a 18 mesi." },
      { q: "Gli allineatori sono visibili?", a: "No, sono trasparenti e rimovibili, pensati per la massima discrezione." },
    ],
  },
  {
    slug: "invisalign-adolescenti",
    title: "Invisalign Adolescenti",
    category: "odontoiatria",
    tagline: "Percorsi ortodontici dedicati agli adolescenti",
    description:
      "Invisalign per adolescenti accompagna lo sviluppo del sorriso con allineatori trasparenti progettati per l'età evolutiva, con indicatori di utilizzo e controllo clinico dedicato.",
    steps: [
      { title: "Valutazione evolutiva", description: "Analisi dello sviluppo dentale e scheletrico." },
      { title: "Piano digitale", description: "Progettazione del percorso con allineatori dedicati." },
      { title: "Controlli", description: "Monitoraggio della crescita e dell'avanzamento del trattamento." },
    ],
    machines: ["Scanner intraorale 3D", "Allineatori Invisalign"],
    faq: [
      { q: "Da che età si può iniziare?", a: "La valutazione ortodontica è consigliata fin dall'infanzia; il percorso si personalizza in base allo sviluppo." },
    ],
  },
  {
    slug: "invisalign-bambini",
    title: "Invisalign Intercettiva Bambini",
    category: "odontoiatria",
    tagline: "Ortodonzia intercettiva per i più piccoli",
    description:
      "L'ortodonzia intercettiva Invisalign per bambini guida la crescita delle arcate e previene problemi futuri, intervenendo precocemente sullo sviluppo del sorriso.",
    steps: [
      { title: "Screening precoce", description: "Valutazione dello sviluppo delle arcate e delle abitudini." },
      { title: "Piano intercettivo", description: "Progettazione di un percorso dedicato alla crescita." },
      { title: "Follow-up", description: "Controlli periodici per accompagnare lo sviluppo." },
    ],
    faq: [
      { q: "Perché intervenire precocemente?", a: "Intervenire durante la crescita permette di prevenire o correggere problemi prima che si consolidino." },
    ],
  },
  {
    slug: "igiene",
    title: "Igiene Dentale",
    category: "odontoiatria",
    tagline: "Prevenzione e salute parodontale",
    description:
      "L'igiene dentale professionale rimuove placca e tartaro, previene le malattie gengivali e mantiene il sorriso sano nel tempo, con sessioni personalizzate.",
    steps: [
      { title: "Valutazione", description: "Controllo dello stato di salute di denti e gengive." },
      { title: "Igiene professionale", description: "Rimozione di placca e tartaro con strumentazione dedicata." },
      { title: "Consigli", description: "Indicazioni personalizzate per l'igiene domiciliare." },
    ],
    faq: [
      { q: "Ogni quanto va fatta?", a: "In genere ogni 6-12 mesi, in base alle esigenze individuali." },
    ],
  },
  {
    slug: "conservativa",
    title: "Odontoiatria Conservativa",
    category: "odontoiatria",
    tagline: "Cura e preservazione dei denti naturali",
    description:
      "La conservativa cura carie e lesioni dentali preservando il più possibile il tessuto naturale, con materiali estetici e tecniche minimamente invasive.",
    steps: [
      { title: "Diagnosi", description: "Valutazione delle lesioni e piano di cura." },
      { title: "Trattamento", description: "Ricostruzione con materiali estetici biocompatibili." },
      { title: "Controllo", description: "Verifica nel tempo e prevenzione delle recidive." },
    ],
    faq: [
      { q: "Le otturazioni sono visibili?", a: "No, vengono utilizzati materiali estetici del colore del dente." },
    ],
  },
  {
    slug: "endodonzia",
    title: "Endodonzia",
    category: "odontoiatria",
    tagline: "Trattamento dei canali radicolari",
    description:
      "L'endodonzia tratta le patologie della polpa dentale, salvando il dente naturale attraverso la cura dei canali radicolari con tecniche moderne e indolori.",
    steps: [
      { title: "Diagnosi", description: "Valutazione clinica e radiografica del dente." },
      { title: "Trattamento canalare", description: "Pulizia, sagomatura e otturazione dei canali." },
      { title: "Ricostruzione", description: "Ricostruzione del dente per ripristinarne la funzione." },
    ],
    faq: [
      { q: "È doloroso?", a: "No, il trattamento viene eseguito in anestesia locale." },
    ],
  },
  {
    slug: "parodontologia",
    title: "Parodontologia",
    category: "odontoiatria",
    tagline: "Cura delle gengive e dei tessuti di supporto",
    description:
      "La parodontologia si occupa della salute di gengive e tessuti di supporto del dente, prevenendo e trattando le malattie parodontali.",
    steps: [
      { title: "Sondaggio parodontale", description: "Valutazione della profondità delle tasche e dello stato gengivale." },
      { title: "Terapia", description: "Trattamento non chirurgico o chirurgico secondo il caso." },
      { title: "Mantenimento", description: "Programma di richiami periodici dedicati." },
    ],
    faq: [
      { q: "Le gengive che sanguinano sono un problema?", a: "Sì, il sanguinamento è un segnale da non sottovalutare e va valutato tempestivamente." },
    ],
  },
  {
    slug: "estetica-dentale",
    title: "Estetica Dentale",
    category: "odontoiatria",
    tagline: "Sbiancamento, faccette e sorriso armonico",
    description:
      "L'estetica dentale migliora colore, forma e allineamento del sorriso con sbiancamento, faccette e ricostruzioni estetiche studiate sul singolo paziente.",
    steps: [
      { title: "Analisi del sorriso", description: "Studio estetico di colore, forma e proporzioni." },
      { title: "Progetto", description: "Pianificazione digitale del risultato desiderato." },
      { title: "Trattamento", description: "Esecuzione del piano estetico personalizzato." },
    ],
    faq: [
      { q: "Lo sbiancamento danneggia i denti?", a: "No, se eseguito sotto controllo professionale è un trattamento sicuro." },
    ],
  },
  {
    slug: "implantologia",
    title: "Implantologia",
    category: "odontoiatria",
    tagline: "Sostituzione dei denti mancanti",
    description:
      "L'implantologia ripristina i denti mancanti con impianti in titanio e riabilitazioni protesiche, restituendo funzione ed estetica in modo duraturo.",
    steps: [
      { title: "Pianificazione", description: "Studio radiografico 3D e progettazione implantare." },
      { title: "Intervento", description: "Inserimento dell'impianto in condizioni di comfort." },
      { title: "Riabilitazione", description: "Posizionamento della protesi e follow-up." },
    ],
    machines: ["Cone Beam 3D"],
    faq: [
      { q: "Quanto durano gli impianti?", a: "Con una corretta igiene e controlli regolari, gli impianti possono durare molti anni." },
    ],
  },
  {
    slug: "gnatologia-bruxismo-bite",
    title: "Gnatologia e Bruxismo",
    category: "odontoiatria",
    tagline: "Bite e riequilibrio dell'articolazione temporo-mandibolare",
    description:
      "La gnatologia si occupa dell'equilibrio tra denti, muscoli e articolazione temporo-mandibolare, trattando bruxismo e disfunzioni con bite personalizzati.",
    steps: [
      { title: "Valutazione", description: "Analisi dell'occlusione e dei sintomi muscolari." },
      { title: "Bite personalizzato", description: "Realizzazione di un bite su misura." },
      { title: "Controlli", description: "Verifica dell'equilibrio occlusale nel tempo." },
    ],
    faq: [
      { q: "Cosa causa il bruxismo?", a: "Può dipendere da stress, postura o squilibri occlusali; la valutazione gnatologica aiuta a identificare le cause." },
    ],
  },
];
