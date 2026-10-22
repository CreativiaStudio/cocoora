import type { Treatment } from "./types";

/**
 * Alias slug legacy → slug canonico.
 * Garantisce che nessun link esistente (menu, medici, CMS) vada in 404.
 */
export const TREATMENT_SLUG_ALIASES: Record<string, string> = {
  criolipolisi: "cryoliposculpt",
  "peeling-chimico": "peeling-medicali",
  "allineatori-adulti": "invisalign-adulti",
  "allineatori-trasparenti-adulti": "invisalign-adulti",
  "allineatori-adolescenti": "invisalign-adolescenti",
  "allineatori-trasparenti-adolescenti": "invisalign-adolescenti",
  "ortodonzia-intercettiva-bambini": "invisalign-bambini",
  "ortodonzia-intercettiva": "invisalign-bambini",
};

export function resolveTreatmentSlug(slug: string): string {
  return TREATMENT_SLUG_ALIASES[slug] ?? slug;
}

export const MEDICINA_ESTETICA_TREATMENTS: Treatment[] = [
  {
    slug: "biorivitalizzazione",
    title: "Biorivitalizzazione / Biostimolazione",
    category: "medicina-estetica",
    tagline: "Idratazione profonda, luminosità ed elasticità cutanea",
    description:
      "Per stimolare i naturali processi cutanei, migliorando idratazione, luminosità, elasticità e qualità della pelle attraverso protocolli medici personalizzati.",
    steps: [
      { title: "Valutazione medica", description: "Analisi del grado di idratazione, della qualità cutanea e degli obiettivi della persona." },
      { title: "Seduta / Protocollo", description: "Micro-iniezioni superficiali di sostanze biocompatibili nelle aree da trattare, secondo il protocollo definito dal medico." },
      { title: "Risultato e follow-up", description: "Pelle progressivamente più idratata e luminosa; il medico pianifica il ciclo di sedute e i controlli successivi." },
    ],
    faq: [
      { q: "Serve anestesia?", a: "No, il trattamento è minimamente invasivo e ben tollerato dalla maggior parte delle persone." },
      { q: "Quante sedute sono consigliate?", a: "In genere un ciclo di più sedute ravvicinate, definito dal medico in base alle caratteristiche della cute." },
      { q: "Posso tornare subito alle mie attività?", a: "Sì, salvo diverse indicazioni mediche; possono comparire piccoli pomfi o arrossamenti transitori." },
    ],
  },
  {
    slug: "biorigenerazione",
    title: "Biorigenerazione",
    category: "medicina-estetica",
    tagline: "Rigenerazione e vitalità dei tessuti cutanei",
    description:
      "Trattamento dedicato alla rigenerazione e al miglioramento della qualità dei tessuti, con un approccio orientato alla salute e alla vitalità cutanea.",
    steps: [
      { title: "Valutazione medica", description: "Studio della qualità dei tessuti e definizione degli obiettivi di rigenerazione cutanea." },
      { title: "Seduta / Protocollo", description: "Protocollo biorigenerante personalizzato sulle aree indicate dal medico." },
      { title: "Risultato e follow-up", description: "Miglioramento progressivo della vitalità dei tessuti, monitorato nelle sedute di controllo." },
    ],
    faq: [
      { q: "Per chi è indicata?", a: "Per chi desidera migliorare la qualità e la vitalità dei tessuti cutanei, previa valutazione medica." },
      { q: "Qual è la differenza con la biorivitalizzazione?", a: "La biorigenerazione è orientata al miglioramento strutturale dei tessuti; il medico indica il percorso più appropriato al singolo caso." },
    ],
  },
  {
    slug: "acido-polilattico",
    title: "Bioristrutturazione con Biostimolatori",
    category: "medicina-estetica",
    tagline: "Acido Polilattico e Idrossiapatite di Calcio per il sostegno dei tessuti",
    description:
      "Protocolli con biostimolatori come acido polilattico e idrossiapatite di calcio, indicati per favorire la produzione di collagene, migliorare il sostegno dei tessuti e contrastare progressivamente i segni di lassità.",
    steps: [
      { title: "Valutazione medica", description: "Analisi del grado di lassità, dei tessuti e delle aree da sostenere." },
      { title: "Seduta / Protocollo", description: "Infiltrazione del biostimolatore selezionato dal medico (acido polilattico o idrossiapatite di calcio) secondo un piano personalizzato." },
      { title: "Risultato e follow-up", description: "Effetto di sostegno progressivo nelle settimane successive, con controlli programmati." },
    ],
    faq: [
      { q: "Quante sedute servono?", a: "In genere un ciclo di 2-3 sedute distanziate, da personalizzare in base agli obiettivi e alla risposta dei tessuti." },
      { q: "Il risultato è immediato?", a: "Il miglioramento si sviluppa progressivamente grazie alla stimolazione della produzione di collagene." },
    ],
  },
  {
    slug: "filler-acido-ialuronico",
    title: "Filler di Acido Ialuronico",
    category: "medicina-estetica",
    tagline: "Ripristino dei volumi e armonizzazione delle proporzioni del volto",
    description:
      "Per ripristinare o armonizzare i volumi, ridefinire i contorni e valorizzare le proporzioni del volto nel pieno rispetto dell’armonia naturale.",
    steps: [
      { title: "Valutazione medica", description: "Studio dell'anatomia del volto, dei volumi e delle proporzioni da valorizzare." },
      { title: "Seduta / Protocollo", description: "Iniezione di acido ialuronico con tecnica minimamente invasiva nelle aree pianificate." },
      { title: "Risultato e follow-up", description: "Verifica del risultato e controllo programmato per valutare l'armonia del volto." },
    ],
    faq: [
      { q: "Il risultato è naturale?", a: "Sì, l'obiettivo è valorizzare i tratti e le proporzioni in modo armonico, senza trasformarli." },
      { q: "Quanto dura?", a: "La durata varia in base al prodotto e all'area trattata, generalmente da 6 a 18 mesi." },
    ],
  },
  {
    slug: "tossina-botulinica",
    title: "Tossina Botulinica",
    category: "medicina-estetica",
    tagline: "Attenuazione delle rughe dinamiche con naturalezza ed espressività",
    description:
      "Trattamento medico mirato ad attenuare le rughe dinamiche d’espressione mantenendo intatta la naturalezza e l’espressività del volto.",
    steps: [
      { title: "Valutazione medica", description: "Analisi delle rughe dinamiche, della mimica facciale e delle aspettative della persona." },
      { title: "Seduta / Protocollo", description: "Micro-iniezioni mirate nei distretti muscolari selezionati dal medico." },
      { title: "Risultato e follow-up", description: "Effetto visibile in alcuni giorni e mantenuto per alcuni mesi, con controllo programmato." },
    ],
    faq: [
      { q: "Il viso resta espressivo?", a: "Sì, il trattamento è calibrato per attenuare le rughe dinamiche preservando naturalezza ed espressività." },
      { q: "Quanto dura l'effetto?", a: "La durata varia in base alla persona e all'area trattata; il follow-up medico definisce i tempi di eventuali richiami." },
    ],
  },
  {
    slug: "medicina-rigenerativa",
    title: "Medicina Rigenerativa",
    category: "medicina-estetica",
    tagline: "Protocolli medici per i processi fisiologici di rigenerazione",
    description:
      "Protocolli medici avanzati studiati per sostenere i processi fisiologici di rigenerazione e il miglioramento globale della qualità dei tessuti.",
    steps: [
      { title: "Valutazione medica", description: "Inquadramento clinico dei tessuti e definizione degli obiettivi di rigenerazione." },
      { title: "Seduta / Protocollo", description: "Applicazione del protocollo rigenerativo personalizzato selezionato dal medico." },
      { title: "Risultato e follow-up", description: "Monitoraggio del miglioramento della qualità dei tessuti nelle visite di controllo." },
    ],
    faq: [
      { q: "A chi si rivolge?", a: "A chi desidera sostenere i processi fisiologici di rigenerazione dei tessuti, previa valutazione medica specialistica." },
      { q: "È combinabile con altri trattamenti?", a: "Sì, il medico può integrare la medicina rigenerativa in un percorso multidisciplinare personalizzato." },
    ],
  },
  {
    slug: "peeling-medicali",
    title: "Peeling chimico",
    category: "medicina-estetica",
    tagline:
      "Un trattamento di medicina estetica che favorisce il rinnovamento della pelle, contribuendo a migliorare la texture, l'uniformità dell'incarnato e alcune imperfezioni cutanee.",
    description:
      "Trattamenti esfolianti selezionati dal medico per intervenire su texture, luminosità, discromie, imperfezioni e segni del fotoinvecchiamento.",
    steps: [
      { title: "Valutazione medica", description: "Analisi del tipo di pelle, delle discromie e delle imperfezioni da trattare." },
      { title: "Seduta / Protocollo", description: "Applicazione del peeling selezionato dal medico con esfoliazione controllata." },
      { title: "Risultato e follow-up", description: "Miglioramento progressivo di texture e luminosità, con fotoprotezione rigorosa e controlli programmati." },
    ],
    faq: [
      {
        q: "Quante sedute sono necessarie?",
        a: "Il numero di sedute dipende dal tipo di peeling, dalle condizioni della pelle e dagli obiettivi del percorso. In alcuni casi può essere sufficiente un singolo trattamento, in altri il medico indica un ciclo di più sedute distanziate.",
      },
      {
        q: "Il peeling chimico fa male?",
        a: "Durante l'applicazione si può avvertire una sensazione di bruciore o pizzicore, generalmente transitoria. L'intensità varia in base al tipo di peeling e alla sensibilità individuale: il medico modula il protocollo in base alla tolleranza.",
      },
      {
        q: "La pelle si spella sempre?",
        a: "Non sempre. L'entità della desquamazione dipende dalla profondità del peeling: i peeling superficiali possono provocare una desquamazione lieve, mentre quelli più intensi richiedono tempi di recupero più lunghi. Il medico spiega cosa aspettarsi prima del trattamento.",
      },
      {
        q: "Si può fare in estate?",
        a: "L'esposizione solare aumenta il rischio di discromie dopo il peeling. Per questo il periodo dell'anno e il grado di esposizione vengono valutati in visita; in alcuni casi il medico consiglia di programmare il trattamento in un periodo di minore esposizione solare, mantenendo sempre una fotoprotezione rigorosa.",
      },
      {
        q: "È indicato per le macchie?",
        a: "Può essere inserito in protocolli dedicati alle discromie, ma l'indicazione dipende dal tipo di macchia e dalla sua origine. La valutazione medica è necessaria per distinguere le diverse forme e scegliere il trattamento più adeguato.",
      },
      {
        q: "Qual è la differenza rispetto alla biorivitalizzazione?",
        a: "La biorivitalizzazione agisce attraverso micro-iniezioni di sostanze biocompatibili per migliorare idratazione e qualità della pelle. Il peeling chimico utilizza sostanze esfolianti applicate sulla superficie cutanea per favorire il rinnovamento degli strati superficiali. Sono approcci diversi e possono essere integrati in un percorso definito dal medico.",
      },
      {
        q: "Quali sono i tempi di recupero?",
        a: "Dipende dalla profondità del peeling: dopo un peeling superficiale possono comparire arrossamento e desquamazione lieve per alcuni giorni, mentre i peeling più intensi richiedono tempi più lunghi. Il medico fornisce indicazioni specifiche per il singolo caso.",
      },
      {
        q: "Ci sono controindicazioni?",
        a: "Sì, il peeling chimico non è indicato in alcune condizioni, come dermatiti attive, infezioni cutanee, esposizione solare recente e, per specifiche sostanze, gravidanza e allattamento. La valutazione medica e l'anamnesi permettono di verificare l'idoneità al trattamento.",
      },
    ],
    heroImage: "/images/aesthetic-skin.jpg",
    heroQuickSpecialist: { title: "Medico specialista", subtitle: "Da associare" },
    heroQuickTier: { title: "Percorsi Salute", subtitle: "Da verificare" },
    whatIs: {
      overline: "MEDICINA ESTETICA",
      title: "Che cos'è il peeling chimico e come funziona?",
      description:
        "Il peeling chimico è un trattamento medico che prevede l'applicazione controllata sulla pelle di sostanze esfolianti, selezionate in base alle caratteristiche cutanee e agli obiettivi da raggiungere.",
      paragraphs: [
        "Il peeling chimico è un trattamento medico che prevede l'applicazione controllata sulla pelle di sostanze esfolianti, selezionate in base alle caratteristiche cutanee e agli obiettivi da raggiungere.",
        "La sua azione favorisce il distacco e il rinnovamento degli strati superficiali della pelle, contribuendo a migliorare l'aspetto dell'incarnato e alcune alterazioni cutanee, come macchie, texture irregolare e linee sottili.",
      ],
      callout:
        "Esistono peeling superficiali, medi e profondi, che si distinguono per intensità e profondità d'azione. La scelta dipende dalle condizioni della pelle, dall'inestetismo da trattare e dalla valutazione medica.",
      image: "/images/laser-technology.jpg",
    },
    problemsGrid: [
      {
        title: "Macchie e discromie",
        description:
          "Alterazioni del tono cutaneo e iperpigmentazioni, inquadrate dal medico per definirne tipologia e indicazione al trattamento.",
      },
      {
        title: "Acne e imperfezioni",
        description:
          "Texture irregolare e imperfezioni cutanee, da valutare clinicamente prima di impostare il percorso più adeguato.",
      },
      {
        title: "Pelle spenta e texture irregolare",
        description:
          "Aspetto opaco e superficie non uniforme, per cui il peeling può favorire il rinnovamento degli strati superficiali.",
      },
      {
        title: "Primi segni dell'invecchiamento",
        description:
          "Linee sottili e perdita di luminosità, affrontate con un protocollo personalizzato sulla base della valutazione medica.",
      },
    ],
    timelineSteps: [
      {
        stepNumber: "01",
        title: "Valutazione medica",
        description:
          "Analisi del tipo di pelle, delle discromie e delle imperfezioni, con definizione degli obiettivi e verifica delle controindicazioni.",
      },
      {
        stepNumber: "02",
        title: "Trattamento",
        description:
          "Applicazione controllata delle sostanze esfolianti selezionate dal medico, con intensità calibrata sulle caratteristiche della pelle.",
      },
      {
        stepNumber: "03",
        title: "Indicazioni e monitoraggio",
        description:
          "Indicazioni per la gestione della pelle nei giorni successivi, fotoprotezione e controllo della risposta cutanea.",
      },
    ],
    timelineNote: {
      title: "Ogni pelle è diversa",
      text: "Il medico valuta la risposta della pelle e definisce l'eventuale necessità di ulteriori sedute.",
    },
    results: {
      overline: "RISULTATI CLINICI",
      title: "Peeling chimico: quali risultati aspettarsi?",
      paragraphs: [
        "Il peeling chimico può contribuire a migliorare la texture della pelle, l'uniformità dell'incarnato e alcune imperfezioni superficiali.",
        "Gli eventuali risultati dipendono dalla tipologia di peeling utilizzata, dalle condizioni iniziali della pelle e dalla risposta individuale. In alcuni casi può essere sufficiente un singolo trattamento, mentre in altri è necessario un ciclo di più sedute.",
        "Il peeling non garantisce l'eliminazione definitiva delle macchie o delle imperfezioni. Una valutazione medica permette di definire obiettivi realistici e individuare il percorso più appropriato.",
      ],
      image: "/images/doctor-consultation.jpg",
    },
    leadForm: {
      overline: "RICHIEDI UNA VALUTAZIONE",
      title: "Hai domande sul peeling?",
      subtitle:
        "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
    },
    localSeo: {
      overline: "MEDICINA ESTETICA A NAPOLI",
      title: "Peeling chimico a Napoli",
      description:
        "Nel nostro centro a Napoli, in Via De Bonis 81 (Posillipo/Fuorigrotta), ogni percorso comincia da una valutazione medica personalizzata, per individuare il trattamento più adatto alle caratteristiche e alle esigenze della tua pelle.",
      image: "/images/hero-clinic.jpg",
    },
  },
  {
    slug: "prx",
    title: "PRX — Biostimolazione senza aghi",
    category: "medicina-estetica",
    tagline: "Biostimolazione cutanea senza aghi per luminosità e compattezza",
    description:
      "Biostimolazione cutanea senza aghi indicata per migliorare luminosità, texture e compattezza della pelle in modo delicato e non invasivo.",
    steps: [
      { title: "Valutazione medica", description: "Verifica dell'idoneità della cute e definizione delle aree da biostimolare." },
      { title: "Seduta / Protocollo", description: "Applicazione della soluzione biostimolante senza aghi, con massaggio delicato." },
      { title: "Risultato e follow-up", description: "Pelle progressivamente più luminosa e compatta; il medico definisce il ciclo di sedute." },
    ],
    faq: [
      { q: "È adatto a tutti?", a: "È indicato per la maggior parte delle pelli; la valutazione medica preliminare conferma l'idoneità." },
      { q: "Si può fare in ogni stagione?", a: "Sì, previa indicazione medica e con un'adeguata fotoprotezione." },
    ],
  },
  {
    slug: "cryoliposculpt",
    title: "Criolipolisi (Cryoliposculpt)",
    category: "medicina-estetica",
    tagline: "Riduzione non invasiva degli accumuli adiposi localizzati",
    description:
      "Trattamento medico non invasivo (Cryoliposculpt) dedicato a ridurre gli accumuli adiposi localizzati e ridefinire il profilo corporeo su addome, fianchi, culotte de cheval, interno coscia e area sottoglutea/banana roll.",
    steps: [
      { title: "Valutazione medica", description: "Analisi delle aree adipose, della qualità dei tessuti e definizione del piano personalizzato." },
      { title: "Seduta / Protocollo", description: "Posizionamento della manipola dedicata sull'area, con raffreddamento controllato dei tessuti." },
      { title: "Risultato e follow-up", description: "Riduzione progressiva nelle settimane successive, monitorata nelle visite di controllo." },
    ],
    machines: ["Cryoliposculpt", "Manipole dedicate"],
    faq: [
      { q: "Il trattamento è doloroso?", a: "No, durante la seduta si avverte una sensazione di freddo intenso iniziale che si attenua in pochi minuti." },
      { q: "Quante sedute sono necessarie?", a: "Dipende dall'area e dagli obiettivi: in genere una o due sedute per area, da valutare in visita medica." },
      { q: "Quali zone si possono trattare?", a: "Addome, fianchi, culotte de cheval, interno coscia, area sottoglutea/banana roll e altre aree selezionate dopo valutazione medica." },
    ],
  },
  {
    slug: "carbossiterapia",
    title: "Carbossiterapia",
    category: "medicina-estetica",
    tagline: "Anidride carbonica medicale per microcircolo, cellulite e qualità dei tessuti",
    description:
      "Trattamento medico che utilizza anidride carbonica medicale per migliorare l’aspetto della cellulite e la qualità dei tessuti, favorendo il microcircolo nelle aree trattate.",
    steps: [
      { title: "Valutazione medica", description: "Individuazione delle aree da trattare e degli obiettivi del protocollo." },
      { title: "Seduta / Protocollo", description: "Somministrazione controllata di anidride carbonica medicale nelle aree selezionate." },
      { title: "Risultato e follow-up", description: "Miglioramento progressivo nell'arco di un ciclo di sedute, con controlli programmati." },
    ],
    faq: [
      { q: "È sicura?", a: "Sì, utilizza anidride carbonica medicale ed è eseguita da personale medico qualificato." },
      { q: "Su quali inestetismi agisce?", a: "Può essere inserita in protocolli dedicati a cellulite, microcircolo e qualità dei tessuti." },
    ],
  },
  {
    slug: "mesoterapia",
    title: "Mesoterapia",
    category: "medicina-estetica",
    tagline: "Microiniezioni superficiali per microcircolo, cellulite e texture",
    description:
      "Trattamento medico iniettivo mediante microiniezioni superficiali mirato al miglioramento del microcircolo, della cellulite e della texture cutanea.",
    steps: [
      { title: "Valutazione medica", description: "Analisi delle aree interessate da cellulite o ritenzione e definizione del protocollo." },
      { title: "Seduta / Protocollo", description: "Microiniezioni superficiali di sostanze selezionate dal medico nelle aree da trattare." },
      { title: "Risultato e follow-up", description: "Risultati progressivi nell'arco del ciclo di sedute, con monitoraggio medico." },
    ],
    faq: [
      { q: "Il trattamento è doloroso?", a: "Le microiniezioni superficiali sono generalmente ben tollerate; la percezione varia da persona a persona." },
      { q: "Quante sedute servono?", a: "Il ciclo viene personalizzato dal medico in base all'entità dell'inestetismo e alla risposta dei tessuti." },
    ],
  },
  {
    slug: "intralipoterapia",
    title: "Intralipoterapia",
    category: "medicina-estetica",
    tagline: "Riduzione mirata di adiposità localizzate selezionate",
    description:
      "Trattamento medico iniettivo indicato per la riduzione non chirurgica di adiposità localizzate accuratamente selezionate in sede di visita.",
    steps: [
      { title: "Valutazione medica", description: "Selezione accurata delle adiposità localizzate trattabili e definizione del piano." },
      { title: "Seduta / Protocollo", description: "Micro-infiltrazioni nelle aree adipose selezionate dal medico." },
      { title: "Risultato e follow-up", description: "Riduzione progressiva nelle settimane successive, con controlli programmati." },
    ],
    faq: [
      { q: "Per chi è indicata?", a: "Per chi presenta adiposità localizzate accuratamente selezionate in sede di visita medica." },
      { q: "È un'alternativa alla chirurgia?", a: "È un trattamento medico non chirurgico; l'idoneità e gli obiettivi vengono valutati esclusivamente in visita." },
    ],
  },
  {
    slug: "ultrasuoni-cfu",
    title: "Ultrasuoni CFU",
    category: "medicina-estetica",
    tagline: "Controlled Focalized Ultrasound per tono, compattezza e definizione",
    description:
      "La nuova frontiera degli ultrasuoni focalizzati (Controlled Focalized Ultrasound): agisce a profondità selezionate su viso, collo, sottomento, profilo mandibolare e aree corporee per stimolare il rimodellamento del collagene e contrastare la lassità lieve o moderata.",
    steps: [
      { title: "Valutazione medica", description: "Studio del grado di lassità, delle aree da ridefinire e dell'idoneità al trattamento." },
      { title: "Seduta / Protocollo", description: "Emissione di ultrasuoni focalizzati a profondità selezionate, con stimolazione controllata dei tessuti." },
      { title: "Risultato e follow-up", description: "Miglioramento progressivo di tono e compattezza, con tempi ed entità variabili in base alla risposta individuale dei tessuti." },
    ],
    machines: ["Ultrasuoni CFU (Controlled Focalized Ultrasound)"],
    faq: [
      { q: "A cosa serve?", a: "A migliorare tono, compattezza e definizione su viso, collo, sottomento, profilo mandibolare e aree corporee selezionate." },
      { q: "Per chi è indicato?", a: "Per chi presenta lassità lieve o moderata e desidera un approccio non chirurgico." },
      { q: "Cosa aspettarsi?", a: "Un miglioramento progressivo, con tempi ed entità del risultato variabili in base alla risposta individuale dei tessuti." },
    ],
  },
  {
    slug: "piattaforma-laser",
    title: "Piattaforma Laser",
    category: "medicina-estetica",
    tagline: "QS NPP, Erbium:YAG, CPL e Laser CO₂ per viso e corpo",
    description:
      "Tecnologie laser e sorgenti luminose selezionate dal medico: QS NPP (macchie e discromie), Erbium:YAG (texture e resurfacing superficiale), CPL (rossori e fotodanneggiamento) e Laser CO₂ (cicatrici da acne, rughe e resurfacing profondo).",
    steps: [
      { title: "Valutazione medica", description: "Diagnosi cutanea con identificazione del tipo di pelle e delle problematiche da trattare." },
      { title: "Seduta / Protocollo", description: "Scelta della tecnologia più adatta al singolo caso tra QS NPP, Erbium:YAG, CPL e Laser CO₂." },
      { title: "Risultato e follow-up", description: "Monitoraggio dei risultati, fotoprotezione rigorosa e pianificazione delle sedute successive." },
    ],
    machines: ["Laser QS NPP", "Laser Erbium:YAG", "Luce pulsata CPL", "Laser CO₂"],
    faq: [
      { q: "Quali problematiche tratta?", a: "Macchie e discromie (QS NPP), texture e rughe sottili (Erbium:YAG), rossori e fotodanneggiamento (CPL), cicatrici da acne e resurfacing profondo (Laser CO₂)." },
      { q: "Cosa aspettarsi dopo la seduta?", a: "I tempi di recupero variano in base all'intensità del trattamento scelto; è sempre richiesta una fotoprotezione rigorosa nei giorni successivi." },
    ],
  },
];
