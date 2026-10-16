import type { Treatment } from "./types";

export const ODONTOIATRIA_TREATMENTS: Treatment[] = [
  {
    slug: "invisalign-adulti",
    title: "Allineatori Trasparenti Adulti",
    category: "odontoiatria",
    tagline:
      "Il momento giusto è quello valutato insieme — Discreti nell'aspetto, specialistici nel progetto",
    description:
      "Affollamento, spazi tra i denti e specifiche alterazioni occlusali possono essere affrontati anche in età adulta con allineatori trasparenti rimovibili e realizzati su misura, eseguiti esclusivamente da specialisti in ortodonzia. Lo specialista considera salute gengivale, restauri esistenti e obiettivi funzionali ed estetici e, quando indicato, prepara il sorriso a trattamenti protesici o implantari. La simulazione 3D mostra il progetto terapeutico: è una rappresentazione digitale, non una garanzia del risultato finale.",
    steps: [
      {
        title: "Ascoltare, comprendere, progettare",
        description:
          "Visita approfondita della salute orale, delle gengive, dell'occlusione e scansione intraorale con software di pianificazione. La simulazione 3D mostra il progetto terapeutico: è una rappresentazione digitale, non una garanzia del risultato finale.",
      },
      {
        title: "Terapia attiva e controlli specialistici",
        description:
          "Consegna degli allineatori su misura ed eventuale applicazione di attachment in composito o ausili ortodontici, con controlli periodici e possibili adattamenti del piano da parte dello specialista.",
      },
      {
        title: "Contenzione e mantenimento nel tempo",
        description:
          "Dopo la fase attiva, la contenzione con dispositivi fissi o rimovibili aiuta a limitare gli spostamenti indesiderati dei denti, preservando la stabilità del sorriso.",
      },
    ],
    machines: ["Scanner intraorale 3D", "Allineatori trasparenti su misura"],
    faq: [
      {
        q: "La simulazione 3D garantisce il risultato finale?",
        a: "No. La scansione intraorale e i software di pianificazione aiutano lo specialista a studiare la sequenza dei movimenti. La simulazione 3D mostra il progetto terapeutico: è una rappresentazione digitale, non una garanzia del risultato finale.",
      },
      {
        q: "Come vanno indossati gli allineatori nella quotidianità?",
        a: "Gli allineatori possono essere rimossi per mangiare e per l'igiene orale, ma per funzionare correttamente devono essere indossati secondo le indicazioni dello specialista: la collaborazione del paziente è parte integrante del trattamento.",
      },
      {
        q: "Cosa succede al termine della fase attiva?",
        a: "Dopo la fase attiva è prevista la contenzione con dispositivi fissi o rimovibili per limitare gli spostamenti indesiderati dei denti. Il mantenimento è una fase essenziale del percorso ortodontico.",
      },
    ],
  },
  {
    slug: "invisalign-adolescenti",
    title: "Allineatori Trasparenti Adolescenti",
    category: "odontoiatria",
    tagline: "Crescere con un sorriso seguito da vicino dagli specialisti in ortodonzia",
    description:
      "Durante l'adolescenza, la valutazione ortodontica tiene conto della dentizione e della crescita residua. Allineatori trasparenti, apparecchi fissi e altri dispositivi vengono selezionati dallo specialista in ortodonzia in funzione delle necessità cliniche e della collaborazione individuale, e non soltanto delle preferenze estetiche.",
    steps: [
      {
        title: "Valutazione della crescita e della dentizione",
        description:
          "Studio clinico specialistico della malocclusione, della dentizione e del potenziale di crescita residua dell'adolescente.",
      },
      {
        title: "Pianificazione digitale specialistica",
        description:
          "Scansione intraorale e studio della sequenza di movimenti biologicamente compatibili. La simulazione 3D mostra il progetto terapeutico: è una rappresentazione digitale, non una garanzia del risultato finale.",
      },
      {
        title: "Controlli periodici e contenzione",
        description:
          "Monitoraggio dell'evoluzione terapeutica, verifica della collaborazione individuale e fase finale di contenzione per mantenere il risultato nel tempo.",
      },
    ],
    machines: ["Scanner intraorale 3D", "Allineatori trasparenti su misura"],
    faq: [
      {
        q: "Come viene scelto il dispositivo più adatto per un adolescente?",
        a: "Allineatori, apparecchi fissi e altri dispositivi vengono selezionati dallo specialista in ortodonzia in funzione della diagnosi, delle necessità cliniche e della collaborazione individuale.",
      },
      {
        q: "Quanto conta la collaborazione del ragazzo o della ragazza?",
        a: "È parte integrante del trattamento: gli allineatori sono rimovibili per i pasti e l'igiene orale, ma devono essere indossati con costanza secondo le indicazioni dello specialista.",
      },
    ],
  },
  {
    slug: "invisalign-bambini",
    title: "Ortodonzia Intercettiva Bambini",
    category: "odontoiatria",
    tagline: "Osservare oggi, intervenire quando serve — Prima valutazione intorno ai 7 anni",
    description:
      "L'ortodonzia intercettiva si occupa di specifiche alterazioni durante la crescita, come alcuni morsi crociati, problemi eruttivi o discrepanze delle arcate. Non tutti i bambini hanno bisogno di un apparecchio precoce: spesso la scelta più appropriata è monitorare lo sviluppo. Una prima valutazione ortodontica intorno ai sette anni può aiutare a individuare situazioni da approfondire.",
    steps: [
      {
        title: "Prima valutazione intorno ai 7 anni",
        description:
          "Esame clinico specialistico per osservare la crescita delle arcate, l'eruzione dentale e individuare eventuali alterazioni occlusali da approfondire.",
      },
      {
        title: "Monitoraggio dello sviluppo o terapia intercettiva",
        description:
          "Definizione del percorso più appropriato: osservazione periodica della crescita oppure intervento mirato su morsi crociati, problemi eruttivi o discrepanze delle arcate.",
      },
      {
        title: "Accompagnamento evolutivo",
        description:
          "Controlli programmati nel tempo per accompagnare in modo biologico e prudente lo sviluppo del sorriso del bambino.",
      },
    ],
    faq: [
      {
        q: "Tutti i bambini hanno bisogno di un apparecchio precoce?",
        a: "No. Non tutti i bambini hanno bisogno di un apparecchio precoce: spesso la scelta più appropriata è monitorare lo sviluppo nel tempo con controlli dedicati.",
      },
      {
        q: "A che età è consigliata la prima visita ortodontica?",
        a: "Una prima valutazione ortodontica intorno ai sette anni può aiutare a individuare precocemente eventuali situazioni da approfondire, come morsi crociati, problemi eruttivi o discrepanze delle arcate.",
      },
    ],
  },
  {
    slug: "igiene",
    title: "Igiene & Prevenzione",
    category: "odontoiatria",
    tagline: "Prevenzione e igiene professionale per proteggere denti e gengive ogni giorno",
    description:
      "La bellezza parte dalla salute. Attraverso controlli periodici, rimozione professionale dei depositi di placca e tartaro e consigli personalizzati, proteggiamo denti e gengive ogni giorno come base indispensabile di qualsiasi percorso odontoiatrico.",
    steps: [
      {
        title: "Valutazione della salute orale",
        description:
          "Controllo periodico dello stato di salute di denti, gengive e mucose per intercettare precocemente ogni necessità di cura.",
      },
      {
        title: "Rimozione professionale dei depositi",
        description:
          "Seduta di igiene professionale mirata all'eliminazione delicata ed efficace di placca e tartaro sopra e sottogengivale.",
      },
      {
        title: "Prevenzione domiciliare personalizzata",
        description:
          "Indicazioni pratiche e su misura per proteggere denti e gengive ogni giorno a casa.",
      },
    ],
    faq: [
      {
        q: "Perché l'igiene professionale è il punto di partenza?",
        a: "Perché ogni trattamento odontoiatrico o ortodontico poggia su denti e gengive sani: controlli periodici e rimozione professionale dei depositi mantengono in equilibrio la salute orale nel tempo.",
      },
    ],
  },
  {
    slug: "conservativa",
    title: "Odontoiatria Conservativa",
    category: "odontoiatria",
    tagline: "Recuperare la struttura dei denti danneggiati preservando il tessuto naturale",
    description:
      "L'odontoiatria conservativa comprende i trattamenti dedicati a recuperare la struttura dei denti danneggiati da carie o traumi, restituendo funzione, integrità ed estetica naturale con un approccio rispettoso dei tessuti dentali.",
    steps: [
      {
        title: "Diagnosi clinica e radiografica",
        description:
          "Individuazione precisa delle lesioni cariose o strutturali e definizione delle priorità terapeutiche.",
      },
      {
        title: "Restauro conservativo",
        description:
          "Rimozione del tessuto danneggiato e ricostruzione anatomica del dente con materiali estetici e biocompatibili.",
      },
      {
        title: "Controllo funzionale e occlusale",
        description:
          "Verifica dei punti di contatto, dell'occlusione e monitoraggio del restauro nei controlli periodici.",
      },
    ],
    faq: [
      {
        q: "Qual è l'obiettivo dell'odontoiatria conservativa?",
        a: "Recuperare la struttura dei denti danneggiati preservando quanto più possibile il tessuto dentale sano e restituendo una corretta funzione masticatoria ed estetica.",
      },
    ],
  },
  {
    slug: "endodonzia",
    title: "Endodonzia",
    category: "odontoiatria",
    tagline: "Conservare i denti naturali anche in presenza di patologie della polpa dentaria",
    description:
      "L'endodonzia si occupa di trattare e conservare, quando possibile, i denti naturali anche in presenza di problemi della polpa dentaria o dei tessuti periapicali, evitando l'estrazione e preservando l'elemento dentale nell'arcata.",
    steps: [
      {
        title: "Inquadramento diagnostico",
        description:
          "Valutazione clinica e radiografica dello stato della polpa dentaria e dei tessuti periapicali.",
      },
      {
        title: "Terapia canalare",
        description:
          "Detersione, disinfezione e sigillatura tridimensionale del sistema dei canali radicolari in anestesia locale.",
      },
      {
        title: "Recupero funzionale e strutturale",
        description:
          "Ricostruzione dell'elemento trattato per proteggerlo dai carichi masticatori e mantenerlo nel tempo.",
      },
    ],
    faq: [
      {
        q: "Quando è necessario un trattamento endodontico?",
        a: "Quando carie profonde o traumi coinvolgono la polpa dentaria o i tessuti periapicali: il trattamento permette, quando clinicamente possibile, di conservare il dente naturale.",
      },
    ],
  },
  {
    slug: "parodontologia",
    title: "Parodontologia",
    category: "odontoiatria",
    tagline: "Diagnosi e gestione delle malattie di gengive e tessuti di supporto",
    description:
      "La parodontologia si dedica alla diagnosi e alla gestione delle malattie che interessano le gengive e i tessuti di supporto dei denti, affiancando alle terapie mirate programmi di mantenimento personalizzati per la stabilità a lungo termine.",
    steps: [
      {
        title: "Diagnosi parodontale approfondita",
        description:
          "Valutazione clinica e sondaggio parodontale per analizzare lo stato di salute di gengive e tessuti di supporto.",
      },
      {
        title: "Gestione clinica mirata",
        description:
          "Terapia causale non chirurgica o specialistica per arrestare l'infiammazione e controllare la patologia parodontale.",
      },
      {
        title: "Programma di mantenimento personalizzato",
        description:
          "Richiami periodici strutturati su misura per preservare la salute gengivale e prevenire le recidive.",
      },
    ],
    faq: [
      {
        q: "Perché la salute delle gengive è fondamentale anche prima dell'ortodonzia?",
        a: "Perché denti, gengive e occlusione fanno parte di un'unica visione clinica d'insieme: muovere o riabilitare i denti richiede tessuti di supporto sani e controllati.",
      },
    ],
  },
  {
    slug: "estetica-dentale",
    title: "Protesi & Estetica",
    category: "odontoiatria",
    tagline: "Sbiancamento, restauri estetici e protesi valutati sulle tue condizioni cliniche",
    description:
      "Dallo sbiancamento ai restauri estetici, dalle faccette alle corone protesiche: soluzioni progettate in una visione clinica integrata, sempre da valutare in relazione alle condizioni cliniche e alle aspettative individuali, senza scorciatoie e senza promesse irrealistiche.",
    steps: [
      {
        title: "Ascolto e studio clinico del sorriso",
        description:
          "Analisi di denti, gengive, occlusione ed estetica per comprendere la storia del tuo sorriso e definire obiettivi realistici.",
      },
      {
        title: "Progettazione multidisciplinare",
        description:
          "Integrazione tra odontoiatria restaurativa, protesi, parodontologia e, quando indicato, ortodonzia pre-protesica.",
      },
      {
        title: "Realizzazione e mantenimento",
        description:
          "Esecuzione di sbiancamenti, restauri estetici o corone protesiche con protocolli controllati e richiami dedicati.",
      },
    ],
    faq: [
      {
        q: "Come vengono scelti i trattamenti estetici e protesici?",
        a: "Non cerchiamo sorrisi tutti uguali: ogni soluzione — dallo sbiancamento ai restauri estetici fino alle corone — viene valutata in relazione alle condizioni cliniche reali e alle aspettative individuali.",
      },
    ],
  },
  {
    slug: "implantologia",
    title: "Implantologia",
    category: "odontoiatria",
    tagline: "Riabilitazioni implantari integrate nel piano di salute orale",
    description:
      "Le riabilitazioni implantari permettono di sostituire gli elementi dentali mancanti ripristinando funzione masticatoria e armonia del sorriso. Ogni intervento è valutato in relazione alle condizioni cliniche generali e locali e può dialogare con l'ortodonzia e la protesi per preparare in modo ottimale gli spazi riabilitativi.",
    steps: [
      {
        title: "Valutazione clinica e radiografica 3D",
        description:
          "Studio dell'anatomia ossea, della salute parodontale e dell'occlusione per verificare le condizioni cliniche dell'intervento.",
      },
      {
        title: "Chirurgia implantare pianificata",
        description:
          "Inserimento degli impianti con protocolli sicuri, eventualmente coordinati con una preparazione ortodontica o parodontale.",
      },
      {
        title: "Riabilitazione protesica e follow-up",
        description:
          "Applicazione delle corone o protesi su impianti e inserimento in un programma rigoroso di igiene e controlli.",
      },
    ],
    machines: ["Cone Beam 3D"],
    faq: [
      {
        q: "L'ortodonzia può essere utile prima di un impianto?",
        a: "Sì, quando clinicamente indicato l'ortodonzia in età adulta può preparare il sorriso e redistribuire correttamente gli spazi prima di trattamenti protesici o implantari.",
      },
    ],
  },
  {
    slug: "gnatologia-bruxismo-bite",
    title: "Gnatologia e Disturbi Temporomandibolari",
    category: "odontoiatria",
    tagline: "Valutazione dell'articolazione temporomandibolare, del dolore e del bruxismo",
    description:
      "La gnatologia si occupa della valutazione di dolore, limitazioni funzionali e disturbi dell'articolazione temporomandibolare (ATM). Il bruxismo richiede un inquadramento specifico: eventuali bite possono avere una funzione protettiva o sintomatica, ma non rappresentano una cura universale.",
    steps: [
      {
        title: "Inquadramento clinico specifico",
        description:
          "Valutazione approfondita di dolore oro-facciale, limitazioni funzionali, muscolatura masticatoria e articolazione temporomandibolare.",
      },
      {
        title: "Definizione del percorso terapeutico",
        description:
          "Individuazione delle strategie di gestione più appropriate; quando indicato, progettazione di un bite con funzione protettiva o sintomatica.",
      },
      {
        title: "Monitoraggio nel tempo",
        description:
          "Controlli clinici periodici per verificare la risposta sintomatica e funzionale del paziente.",
      },
    ],
    faq: [
      {
        q: "Il bite risolve definitivamente il bruxismo o tutti i disturbi ATM?",
        a: "No. Il bruxismo richiede un inquadramento clinico specifico: eventuali bite possono avere una funzione protettiva o sintomatica, ma non rappresentano una cura universale.",
      },
    ],
  },
];
