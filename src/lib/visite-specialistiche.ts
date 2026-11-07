import type { Faq } from "./types";

export type VisitaSpecialistica = {
  slug: string;
  title: string;
  categoryName: string;
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  heroCta: string;
  seo?: { metaTitle?: string; metaDescription?: string; keywordMain?: string; keywordSec?: string };
  whatIs: { title: string; description: string; paragraphs: string[]; image?: string };
  problemsTitle: string;
  problemsSubtitle?: string;
  problemsGrid: { title: string; description: string }[];
  leadForm?: { title: string; subtitle: string; cta: string };
  timelineTitle: string;
  timelineSteps: { stepNumber: string; title: string; description: string }[];
  results: { title: string; description: string; paragraphs: string[]; image?: string };
  faq: Faq[];
  localSeo: { title: string; description: string; cta: string };
};

/**
 * Catalogo Ufficiale Visite Specialistiche Cocoora Centro Medico
 * Sincronizzato dai materiali ufficiali e cartelle Drive (Silvia Monticelli)
 */
export const VISITE_SPECIALISTICHE: VisitaSpecialistica[] = [
  {
    "slug": "nutrizione",
    "title": "Visita nutrizionale",
    "categoryName": "Benessere e cura di sé",
    "tagline": "Mangiare bene comincia dal conoscere le proprie abitudini. La visita nutrizionale mette in relazione alimentazione, storia personale e quotidianità, per costruire indicazioni concrete e un percorso che possa trovare spazio nella vita di ogni giorno.",
    "description": "La visita nutrizionale è una valutazione delle abitudini alimentari e delle esigenze della persona. Considera la storia clinica, gli obiettivi, l’organizzazione dei pasti e ciò che rende semplice o difficile seguire un’alimentazione adeguata.\n\nIl confronto non si limita a un elenco di alimenti. Orari, preferenze, lavoro, attività quotidiane e percorsi già affrontati aiutano a comprendere il punto di partenza. Gli eventuali esami disponibili e le informazioni sulla salute completano la valutazione.\n\nIl percorso può comprendere un piano alimentare personalizzato e successivi controlli. Da Cocoora l’obiettivo è dare alle indicazioni una direzione chiara, verificandone nel tempo l’adeguatezza rispetto alle esigenze emerse.",
    "heroImage": "/images/visite/nutrizione-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/nutrizione-napoli-1.jpg",
      "/images/visite/nutrizione-napoli-2.jpg",
      "/images/visite/nutrizione-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita nutrizionale a Napoli | Cocoora",
      "metaDescription": "Visita nutrizionale a Napoli: abitudini alimentari, esigenze personali e piano su misura. Scopri come funziona il percorso di nutrizione Cocoora.",
      "keywordMain": "visita nutrizionale Napoli",
      "keywordSec": "nutrizionista Napoli; consulenza nutrizionale Napoli; piano alimentare personalizzato Napoli; educazione alimentare; controlli nutrizionali."
    },
    "whatIs": {
      "title": "Che cos’è la visita nutrizionale e come funziona?",
      "description": "La visita nutrizionale è una valutazione delle abitudini alimentari e delle esigenze della persona. Considera la storia clinica, gli obiettivi, l’organizzazione dei pasti e ciò che rende semplice o difficile seguire un’alimentazione adeguata.\n\nIl confronto non si limita a un elenco di alimenti. Orari, preferenze, lavoro, attività quotidiane e percorsi già affrontati aiutano a comprendere il punto di partenza. Gli eventuali esami disponibili e le informazioni sulla salute completano la valutazione.\n\nIl percorso può comprendere un piano alimentare personalizzato e successivi controlli. Da Cocoora l’obiettivo è dare alle indicazioni una direzione chiara, verificandone nel tempo l’adeguatezza rispetto alle esigenze emerse.",
      "paragraphs": [
        "La visita nutrizionale è una valutazione delle abitudini alimentari e delle esigenze della persona. Considera la storia clinica, gli obiettivi, l’organizzazione dei pasti e ciò che rende semplice o difficile seguire un’alimentazione adeguata.",
        "Il confronto non si limita a un elenco di alimenti. Orari, preferenze, lavoro, attività quotidiane e percorsi già affrontati aiutano a comprendere il punto di partenza. Gli eventuali esami disponibili e le informazioni sulla salute completano la valutazione.",
        "Il percorso può comprendere un piano alimentare personalizzato e successivi controlli. Da Cocoora l’obiettivo è dare alle indicazioni una direzione chiara, verificandone nel tempo l’adeguatezza rispetto alle esigenze emerse."
      ],
      "image": "/images/visite/nutrizione-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve una visita nutrizionale?",
    "problemsSubtitle": "Ci si può rivolgere al professionista per un obiettivo specifico o per riorganizzare il proprio modo di mangiare. Il programma nasce da ciò che serve alla persona, non da uno schema uguale per tutti.",
    "problemsGrid": [
      {
        "title": "Organizzare un’alimentazione più equilibrata",
        "description": "La consulenza aiuta a leggere le abitudini attuali e a individuare cambiamenti praticabili. Distribuzione dei pasti, varietà degli alimenti e organizzazione della giornata vengono affrontate con indicazioni comprensibili, da applicare anche fuori casa."
      },
      {
        "title": "Affrontare gli obiettivi legati al peso",
        "description": "Quando il peso rientra nella richiesta, viene considerato insieme alla salute, alla storia alimentare e alle esperienze precedenti. Il percorso definisce obiettivi individuali e modalità di monitoraggio, senza ridurre la valutazione a un numero sulla bilancia."
      },
      {
        "title": "Adattare l’alimentazione alle esigenze di salute",
        "description": "In presenza di condizioni già diagnosticate, la documentazione clinica permette di valutare come inserirle nel percorso nutrizionale. Le indicazioni vengono costruite nel rispetto delle competenze del professionista e delle cure seguite, con un eventuale raccordo con il medico."
      },
      {
        "title": "Dare continuità alle abitudini nel tempo",
        "description": "I controlli sono utili per capire che cosa sta funzionando e quali aspetti richiedono un adattamento. Un cambio di orari, nuove esigenze o difficoltà nell’organizzare i pasti possono diventare il punto di partenza per rivedere le indicazioni."
      }
    ],
    "leadForm": {
      "title": "Costruiamo un percorso intorno alle tue abitudini",
      "subtitle": "Lascia i tuoi contatti per ricevere informazioni sulla visita nutrizionale. Il team Cocoora ti aiuterà a organizzare il primo appuntamento.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita nutrizionale?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Ascolto e storia alimentare",
        "description": "Il primo incontro parte dalla richiesta, dalla storia clinica e dal racconto di una giornata abituale. Si approfondiscono preferenze, orari, eventuali percorsi precedenti e aspettative, per mettere a fuoco le priorità."
      },
      {
        "stepNumber": "02",
        "title": "Valutazione delle esigenze",
        "description": "Il professionista raccoglie i dati utili alla valutazione nutrizionale ed esamina la documentazione disponibile. Queste informazioni vengono lette insieme alle abitudini, per scegliere indicazioni coerenti con il contesto personale."
      },
      {
        "stepNumber": "03",
        "title": "Indicazioni personalizzate e controlli",
        "description": "Vengono condivisi gli obiettivi e, quando previsto, il piano alimentare. I successivi incontri permettono di monitorare il percorso, chiarire i dubbi e apportare modifiche in base all’esperienza quotidiana."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dal percorso nutrizionale?",
      "description": "Il primo risultato è comprendere meglio le proprie esigenze e avere indicazioni utilizzabili nella quotidianità. Il percorso può aiutare a dare maggiore regolarità ai pasti e a scegliere con più consapevolezza, senza affidarsi a soluzioni generiche.\n\nGli obiettivi vengono verificati durante i controlli, considerando sia gli eventuali parametri nutrizionali sia la sostenibilità delle abitudini. Tempi e cambiamenti dipendono dal punto di partenza e dal programma condiviso.",
      "paragraphs": [
        "Il primo risultato è comprendere meglio le proprie esigenze e avere indicazioni utilizzabili nella quotidianità. Il percorso può aiutare a dare maggiore regolarità ai pasti e a scegliere con più consapevolezza, senza affidarsi a soluzioni generiche.",
        "Gli obiettivi vengono verificati durante i controlli, considerando sia gli eventuali parametri nutrizionali sia la sostenibilità delle abitudini. Tempi e cambiamenti dipendono dal punto di partenza e dal programma condiviso."
      ],
      "image": "/images/visite/nutrizione-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "La visita nutrizionale serve soltanto per dimagrire?",
        "a": "No. Può riguardare l’organizzazione dei pasti, l’educazione alimentare, esigenze di salute o il mantenimento delle abitudini. L’obiettivo viene definito durante il primo incontro."
      },
      {
        "q": "Che cosa devo portare alla prima visita?",
        "a": "Porta la documentazione clinica disponibile, gli esami recenti già effettuati e l’elenco delle terapie seguite. Può essere utile annotare come sono organizzati i pasti e quali aspetti desideri approfondire."
      },
      {
        "q": "Devo fare esami prima dell’appuntamento?",
        "a": "Non è previsto un elenco di esami uguale per tutti. Al momento della prenotazione puoi chiedere quali documenti portare; gli eventuali approfondimenti vengono valutati in relazione alla situazione personale."
      },
      {
        "q": "Il piano può tenere conto dei pasti fuori casa?",
        "a": "Gli orari di lavoro, le preferenze e l’organizzazione dei pasti sono informazioni importanti da condividere. Aiutano a costruire indicazioni realistiche, da integrare nella propria giornata."
      },
      {
        "q": "Ogni quanto si fanno i controlli nutrizionali?",
        "a": "La frequenza dipende dagli obiettivi e dalla fase del percorso. I controlli servono a valutare l’adeguatezza del programma e a modificarlo quando le esigenze cambiano."
      },
      {
        "q": "Quanto costa una visita nutrizionale a Napoli?",
        "a": "Il team Cocoora può indicare il costo della prima valutazione e dei successivi controlli. Prima di prenotare è utile chiarire quali prestazioni comprende l’appuntamento e come viene organizzato il piano alimentare."
      }
    ],
    "localSeo": {
      "title": "Visita nutrizionale a Napoli",
      "description": "A Napoli, Cocoora propone un percorso nutrizionale che parte dalle abitudini e dalle esigenze della persona. La valutazione iniziale e i controlli permettono di costruire indicazioni personalizzate e accompagnarne l’applicazione nel tempo.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "medicina-estetica",
    "title": "Visita di medicina estetica",
    "categoryName": "Benessere e cura di sé",
    "tagline": "Prima di scegliere un trattamento, serve comprendere che cosa può essere utile. La visita di medicina estetica è un confronto dedicato al viso e al corpo, per mettere in relazione caratteristiche della pelle, desideri e possibilità di intervento.",
    "description": "La visita di medicina estetica permette di valutare la qualità della pelle e le esigenze estetiche del viso e del corpo. Il medico raccoglie la storia clinica, ascolta la richiesta e osserva le aree interessate, per comprendere quali opzioni possano essere appropriate.\n\nIl punto di partenza può essere un desiderio preciso oppure una domanda ancora aperta. Non occorre arrivare conoscendo già il nome del trattamento: la consulenza serve anche a distinguere metodiche con finalità diverse e a capire che cosa aspettarsi da ciascuna.\n\nQuando indicato, vengono illustrate possibilità non chirurgiche o minimamente invasive, spiegando obiettivi e limiti. La visita è un momento di valutazione e scelta; l’eventuale procedura viene concordata in base al percorso definito.",
    "heroImage": "/images/visite/medicina-estetica-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/medicina-estetica-napoli-1.jpg",
      "/images/visite/medicina-estetica-napoli-2.jpg",
      "/images/visite/medicina-estetica-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita di medicina estetica a Napoli | Cocoora",
      "metaDescription": "Visita di medicina estetica a Napoli per viso e corpo. Da Cocoora ascolto, valutazione della pelle e indicazioni personalizzate prima del trattamento.",
      "keywordMain": "visita di medicina estetica Napoli.",
      "keywordSec": "medico estetico Napoli; medicina estetica Napoli; consulenza medicina estetica Napoli; valutazione estetica viso e corpo."
    },
    "whatIs": {
      "title": "Che cos’è la visita di medicina estetica e come funziona?",
      "description": "La visita di medicina estetica permette di valutare la qualità della pelle e le esigenze estetiche del viso e del corpo. Il medico raccoglie la storia clinica, ascolta la richiesta e osserva le aree interessate, per comprendere quali opzioni possano essere appropriate.\n\nIl punto di partenza può essere un desiderio preciso oppure una domanda ancora aperta. Non occorre arrivare conoscendo già il nome del trattamento: la consulenza serve anche a distinguere metodiche con finalità diverse e a capire che cosa aspettarsi da ciascuna.\n\nQuando indicato, vengono illustrate possibilità non chirurgiche o minimamente invasive, spiegando obiettivi e limiti. La visita è un momento di valutazione e scelta; l’eventuale procedura viene concordata in base al percorso definito.",
      "paragraphs": [
        "La visita di medicina estetica permette di valutare la qualità della pelle e le esigenze estetiche del viso e del corpo. Il medico raccoglie la storia clinica, ascolta la richiesta e osserva le aree interessate, per comprendere quali opzioni possano essere appropriate.",
        "Il punto di partenza può essere un desiderio preciso oppure una domanda ancora aperta. Non occorre arrivare conoscendo già il nome del trattamento: la consulenza serve anche a distinguere metodiche con finalità diverse e a capire che cosa aspettarsi da ciascuna.",
        "Quando indicato, vengono illustrate possibilità non chirurgiche o minimamente invasive, spiegando obiettivi e limiti. La visita è un momento di valutazione e scelta; l’eventuale procedura viene concordata in base al percorso definito."
      ],
      "image": "/images/visite/medicina-estetica-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la consulenza di medicina estetica?",
    "problemsSubtitle": "La valutazione consente di dare un significato alla richiesta, distinguendo le caratteristiche della pelle dalle altre componenti che influenzano l’aspetto di una zona.",
    "problemsGrid": [
      {
        "title": "Valutare la qualità della pelle",
        "description": "Texture, elasticità e aspetto cutaneo vengono osservati insieme alle abitudini di cura e ai trattamenti già eseguiti. Il medico chiarisce quali caratteristiche possono essere affrontate attraverso la medicina estetica e quali richiedono un approfondimento diverso."
      },
      {
        "title": "Comprendere i cambiamenti del viso nel tempo",
        "description": "La consulenza aiuta a leggere i segni dell’invecchiamento senza considerarli tutti allo stesso modo. Le caratteristiche individuali e gli obiettivi guidano il confronto sulle possibilità di trattamento, nel rispetto dell’espressività e dell’insieme del viso."
      },
      {
        "title": "Orientarsi tra i trattamenti per il corpo",
        "description": "Una richiesta che riguarda il corpo può coinvolgere aspetti differenti dei tessuti. La visita serve a riconoscere ciò su cui intervenire e a distinguere le finalità delle procedure, evitando di scegliere una metodica soltanto dal suo nome o dalla sua popolarità."
      },
      {
        "title": "Definire priorità e sequenza del percorso",
        "description": "Quando le esigenze sono più di una, la consulenza permette di decidere da dove iniziare. Il medico illustra le opzioni pertinenti e come potrebbero articolarsi gli appuntamenti, così da valutare il percorso nel suo insieme prima di procedere."
      }
    ],
    "leadForm": {
      "title": "Iniziamo da una valutazione, non da un trattamento",
      "subtitle": "Scrivi al team Cocoora per organizzare una visita di medicina estetica. Potrai approfondire le esigenze di viso e corpo e ricevere indicazioni sul percorso.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita di medicina estetica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Conoscere la richiesta e la storia personale",
        "description": "Il medico ascolta ciò che desideri approfondire, raccoglie le informazioni sulla salute e chiede quali trattamenti siano già stati eseguiti. È il momento per condividere aspettative, dubbi e preferenze."
      },
      {
        "stepNumber": "02",
        "title": "Osservare pelle e aree interessate",
        "description": "La valutazione clinica considera la qualità cutanea e le caratteristiche della zona. Il medico collega quanto osservato alla richiesta, spiegando quali obiettivi siano pertinenti e quali alternative meritino attenzione."
      },
      {
        "stepNumber": "03",
        "title": "Condividere le possibilità di trattamento",
        "description": "Il confronto si conclude con indicazioni sul percorso proposto, sulle eventuali sedute e sui controlli. Puoi chiarire i passaggi e prenderti il tempo necessario per decidere, senza dover scegliere una procedura prima della visita."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dalla visita?",
      "description": "La consulenza offre una lettura più chiara delle proprie esigenze e delle opzioni disponibili. Il suo risultato è un orientamento personalizzato: quali obiettivi affrontare, con quale approccio e attraverso quali passaggi.\n\nGli eventuali cambiamenti estetici dipenderanno dal trattamento scelto, non dalla sola visita. Prima di iniziare, il medico chiarisce ciò che può essere ragionevolmente atteso rispetto al punto di partenza.",
      "paragraphs": [
        "La consulenza offre una lettura più chiara delle proprie esigenze e delle opzioni disponibili. Il suo risultato è un orientamento personalizzato: quali obiettivi affrontare, con quale approccio e attraverso quali passaggi.",
        "Gli eventuali cambiamenti estetici dipenderanno dal trattamento scelto, non dalla sola visita. Prima di iniziare, il medico chiarisce ciò che può essere ragionevolmente atteso rispetto al punto di partenza."
      ],
      "image": "/images/visite/medicina-estetica-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "Devo sapere già quale trattamento voglio fare?",
        "a": "No. Puoi partire da una domanda o da un’esigenza. Il medico ti aiuta a capire le differenze tra le possibilità pertinenti e a scegliere sulla base della valutazione."
      },
      {
        "q": "La prima visita comprende anche il trattamento?",
        "a": "Visita e procedura sono momenti distinti. L’organizzazione dipende dal trattamento eventualmente indicato: al momento della prenotazione il team chiarisce cosa prevede l’appuntamento."
      },
      {
        "q": "Posso parlare sia del viso sia del corpo?",
        "a": "Sì, puoi segnalare le aree che desideri approfondire. Comunicarlo quando prenoti aiuta a organizzare il confronto e a mettere a fuoco le priorità."
      },
      {
        "q": "Devo riferire i trattamenti estetici già eseguiti?",
        "a": "Sì. Porta, se disponibile, la documentazione con date, zone e prodotti utilizzati, insieme alle informazioni sulle terapie in corso. La storia dei trattamenti è parte della valutazione."
      },
      {
        "q": "Medicina estetica e chirurgia plastica sono la stessa cosa?",
        "a": "No. La medicina estetica comprende approcci non chirurgici o minimamente invasivi; la consulenza di chirurgia plastica valuta anche soluzioni chirurgiche e ricostruttive. La visita aiuta a orientare la richiesta."
      },
      {
        "q": "Quanto costa una visita di medicina estetica a Napoli?",
        "a": "Contatta Cocoora per conoscere il costo della consulenza. L’eventuale preventivo dei trattamenti viene formulato in relazione al programma individuato, distinguendo visita, procedure e controlli."
      }
    ],
    "localSeo": {
      "title": "Visita di medicina estetica a Napoli",
      "description": "Da Cocoora, a Napoli, la medicina estetica inizia dall’ascolto e dalla valutazione clinica. La consulenza dedicata al viso e al corpo permette di comprendere le possibilità di intervento e costruire una scelta consapevole, prima di programmare il trattamento.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "dermatologia",
    "title": "Visita dermatologica",
    "categoryName": "Benessere e cura di sé",
    "tagline": "La pelle racconta cambiamenti che meritano di essere compresi. La visita dermatologica approfondisce la salute di pelle, capelli e unghie, dal controllo dei nei alla valutazione di manifestazioni cutanee, per individuare cure e controlli appropriati.",
    "description": "La visita dermatologica è una valutazione medica dedicata alle patologie della pelle e dei suoi annessi, come capelli e unghie. Può servire a comprendere una manifestazione nuova, controllare una condizione già nota o esaminare nei e altre lesioni cutanee.\n\nIl dermatologo mette in relazione l’aspetto della pelle con la storia dei sintomi, le abitudini e i prodotti o le terapie utilizzati. Un arrossamento o un cambiamento visibile non viene considerato soltanto sul piano estetico: occorre comprenderne la natura.\n\nLa valutazione orienta le indicazioni di cura e l’eventuale necessità di approfondimenti. Da Cocoora il percorso comprende anche la spiegazione dei passaggi successivi, per sapere come seguire le indicazioni e quando tornare a controllo.",
    "heroImage": "/images/visite/dermatologia-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/dermatologia-napoli-1.jpg",
      "/images/visite/dermatologia-napoli-2.jpg",
      "/images/visite/dermatologia-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita dermatologica a Napoli | Cocoora",
      "metaDescription": "Visita dermatologica a Napoli per pelle, nei, capelli e unghie. Cocoora propone una valutazione specialistica e un percorso di cura e controlli.",
      "keywordMain": "visita dermatologica Napoli.",
      "keywordSec": "dermatologo Napoli; controllo nei Napoli; visita dermatologica acne Napoli; dermatologo capelli e unghie Napoli."
    },
    "whatIs": {
      "title": "Che cos’è la visita dermatologica e come funziona?",
      "description": "La visita dermatologica è una valutazione medica dedicata alle patologie della pelle e dei suoi annessi, come capelli e unghie. Può servire a comprendere una manifestazione nuova, controllare una condizione già nota o esaminare nei e altre lesioni cutanee.\n\nIl dermatologo mette in relazione l’aspetto della pelle con la storia dei sintomi, le abitudini e i prodotti o le terapie utilizzati. Un arrossamento o un cambiamento visibile non viene considerato soltanto sul piano estetico: occorre comprenderne la natura.\n\nLa valutazione orienta le indicazioni di cura e l’eventuale necessità di approfondimenti. Da Cocoora il percorso comprende anche la spiegazione dei passaggi successivi, per sapere come seguire le indicazioni e quando tornare a controllo.",
      "paragraphs": [
        "La visita dermatologica è una valutazione medica dedicata alle patologie della pelle e dei suoi annessi, come capelli e unghie. Può servire a comprendere una manifestazione nuova, controllare una condizione già nota o esaminare nei e altre lesioni cutanee.",
        "Il dermatologo mette in relazione l’aspetto della pelle con la storia dei sintomi, le abitudini e i prodotti o le terapie utilizzati. Un arrossamento o un cambiamento visibile non viene considerato soltanto sul piano estetico: occorre comprenderne la natura.",
        "La valutazione orienta le indicazioni di cura e l’eventuale necessità di approfondimenti. Da Cocoora il percorso comprende anche la spiegazione dei passaggi successivi, per sapere come seguire le indicazioni e quando tornare a controllo."
      ],
      "image": "/images/visite/dermatologia-napoli-2.jpg"
    },
    "problemsTitle": "Quando è utile una visita dermatologica?",
    "problemsSubtitle": "Le esigenze dermatologiche possono riguardare aree circoscritte o manifestazioni più diffuse. Raccontare quando sono comparse e come sono cambiate aiuta a orientare la visita.",
    "problemsGrid": [
      {
        "title": "Acne e manifestazioni della pelle",
        "description": "La valutazione dell’acne considera distribuzione, andamento e trattamenti già provati. Il dermatologo individua le indicazioni pertinenti e chiarisce come organizzare la cura, senza affidarsi soltanto al tentativo di nuovi prodotti."
      },
      {
        "title": "Dermatiti, prurito e condizioni cutanee ricorrenti",
        "description": "Eczemi, dermatiti e psoriasi richiedono un inquadramento specifico. La visita aiuta a distinguere manifestazioni che possono sembrare simili e a costruire un programma di gestione, considerando anche l’evoluzione nel tempo."
      },
      {
        "title": "Controllo dei nei e delle lesioni cutanee",
        "description": "Il dermatologo esamina nei e lesioni della pelle, raccogliendo le informazioni su eventuali cambiamenti osservati. In base ai riscontri può indicare un controllo successivo o ulteriori accertamenti, spiegandone la finalità."
      },
      {
        "title": "Salute di capelli, cuoio capelluto e unghie",
        "description": "Anche alterazioni di capelli e unghie rientrano nella valutazione dermatologica. Il medico osserva le aree interessate e ne ricostruisce la storia, per orientare la diagnosi e scegliere gli eventuali approfondimenti."
      }
    ],
    "leadForm": {
      "title": "Diamo attenzione alla salute della pelle",
      "subtitle": "Compila il form per organizzare una visita dermatologica. Il team Cocoora ti fornirà le informazioni utili per l’appuntamento e per la documentazione da portare.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita dermatologica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Ricostruire la storia della manifestazione",
        "description": "Si approfondiscono comparsa, durata e andamento dei disturbi, oltre a storia clinica, terapie e prodotti utilizzati. Le informazioni sui controlli precedenti aiutano a comprendere il quadro attuale."
      },
      {
        "stepNumber": "02",
        "title": "Esaminare la pelle e le aree interessate",
        "description": "Il dermatologo osserva le manifestazioni e valuta quali elementi siano utili alla diagnosi. Quando l’esame clinico non è sufficiente, indica gli approfondimenti pertinenti invece di proporre un insieme di test uguale per tutti."
      },
      {
        "stepNumber": "03",
        "title": "Definire cura e controlli",
        "description": "Al termine vengono spiegate le indicazioni emerse, le modalità dell’eventuale terapia e il programma di monitoraggio. Il percorso può essere aggiornato nei controlli in base all’evoluzione della condizione."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dalla valutazione dermatologica?",
      "description": "La visita permette di dare un inquadramento alle manifestazioni e di individuare una direzione di cura. In alcuni casi la diagnosi può essere formulata durante l’incontro; in altri occorre completarla con accertamenti mirati.\n\nIl miglioramento viene seguito rispetto alla condizione specifica e alla risposta alla terapia. Per i disturbi ricorrenti, i controlli aiutano a gestire le diverse fasi e a mantenere indicazioni adeguate nel tempo.",
      "paragraphs": [
        "La visita permette di dare un inquadramento alle manifestazioni e di individuare una direzione di cura. In alcuni casi la diagnosi può essere formulata durante l’incontro; in altri occorre completarla con accertamenti mirati.",
        "Il miglioramento viene seguito rispetto alla condizione specifica e alla risposta alla terapia. Per i disturbi ricorrenti, i controlli aiutano a gestire le diverse fasi e a mantenere indicazioni adeguate nel tempo."
      ],
      "image": "/images/visite/dermatologia-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "Il dermatologo si occupa anche di capelli e unghie?",
        "a": "Sì. La dermatologia comprende anche queste aree. Specifica la richiesta quando prenoti, così da organizzare una valutazione centrata sull’esigenza da approfondire."
      },
      {
        "q": "Il controllo dei nei coincide con una mappatura digitale?",
        "a": "Non necessariamente. La valutazione clinica dei nei e un percorso di documentazione digitale non sono la stessa prestazione. Al momento della prenotazione puoi chiarire quale esame sia previsto."
      },
      {
        "q": "Devo fare esami prima di andare dal dermatologo?",
        "a": "Porta gli esami già disponibili e le indicazioni del medico curante. L’eventuale necessità di nuovi accertamenti dipende dalla valutazione, non da un elenco standard da eseguire in anticipo."
      },
      {
        "q": "Che cosa è utile portare alla visita?",
        "a": "Referti precedenti, elenco dei farmaci e informazioni sui prodotti applicati sulla zona interessata. Se la manifestazione cambia nel tempo, descriverne l’andamento aiuta il confronto con il medico."
      },
      {
        "q": "Ogni quanto va ripetuto il controllo dermatologico?",
        "a": "L’intervallo viene definito in base alla condizione, alla terapia e alle caratteristiche individuali. Il medico chiarisce quando tornare e quali aspetti osservare tra un appuntamento e l’altro."
      },
      {
        "q": "Quanto costa una visita dermatologica a Napoli?",
        "a": "Il team Cocoora può indicare il costo della visita e chiarire cosa comprende. Eventuali esami o prestazioni aggiuntive vengono distinti dalla consulenza iniziale."
      }
    ],
    "localSeo": {
      "title": "Visita dermatologica a Napoli",
      "description": "Cocoora propone a Napoli visite dermatologiche dedicate a pelle, nei, capelli e unghie. La valutazione specialistica mette in relazione i segni osservati con la storia personale, per orientare diagnosi, cure e controlli.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "chirurgia-plastica",
    "title": "Consulenza di chirurgia plastica",
    "categoryName": "Benessere e cura di sé",
    "tagline": "Uno spazio per comprendere le possibilità, prima di decidere. La consulenza di chirurgia plastica permette di approfondire esigenze estetiche o ricostruttive e confrontarle con le caratteristiche dei tessuti, le alternative e gli obiettivi personali.",
    "description": "La consulenza di chirurgia plastica è una visita specialistica per valutare richieste di correzione estetica o ricostruzione. Il chirurgo esamina la zona interessata e la storia clinica, ascolta le aspettative e spiega quali possibilità meritino di essere considerate.\n\nL’incontro permette di chiarire non soltanto come si potrebbe intervenire, ma anche quale risultato sia coerente con il punto di partenza. Il confronto comprende le alternative, i passaggi preparatori e l’organizzazione di un eventuale percorso successivo.\n\nIn Cocoora la prestazione è dedicata alla consulenza. Quando viene presa in considerazione una soluzione chirurgica, il professionista ne valuta il successivo svolgimento in una struttura idonea.",
    "heroImage": "/images/visite/chiururgia-plastica-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/chiururgia-plastica-napoli-1.jpg",
      "/images/visite/chiururgia-plastica-napoli-2.jpg",
      "/images/visite/chiururgia-plastica-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita di chirurgia plastica a Napoli | Cocoora",
      "metaDescription": "Consulenza di chirurgia plastica a Napoli. Da Cocoora una valutazione delle esigenze estetiche o ricostruttive, delle alternative e del possibile percorso.",
      "keywordMain": "visita chirurgia plastica Napoli.",
      "keywordSec": "chirurgo plastico Napoli; consulenza chirurgia plastica Napoli; visita chirurgia estetica Napoli; valutazione chirurgia ricostruttiva."
    },
    "whatIs": {
      "title": "Che cos’è la consulenza di chirurgia plastica?",
      "description": "La consulenza di chirurgia plastica è una visita specialistica per valutare richieste di correzione estetica o ricostruzione. Il chirurgo esamina la zona interessata e la storia clinica, ascolta le aspettative e spiega quali possibilità meritino di essere considerate.\n\nL’incontro permette di chiarire non soltanto come si potrebbe intervenire, ma anche quale risultato sia coerente con il punto di partenza. Il confronto comprende le alternative, i passaggi preparatori e l’organizzazione di un eventuale percorso successivo.\n\nIn Cocoora la prestazione è dedicata alla consulenza. Quando viene presa in considerazione una soluzione chirurgica, il professionista ne valuta il successivo svolgimento in una struttura idonea.",
      "paragraphs": [
        "La consulenza di chirurgia plastica è una visita specialistica per valutare richieste di correzione estetica o ricostruzione. Il chirurgo esamina la zona interessata e la storia clinica, ascolta le aspettative e spiega quali possibilità meritino di essere considerate.",
        "L’incontro permette di chiarire non soltanto come si potrebbe intervenire, ma anche quale risultato sia coerente con il punto di partenza. Il confronto comprende le alternative, i passaggi preparatori e l’organizzazione di un eventuale percorso successivo.",
        "In Cocoora la prestazione è dedicata alla consulenza. Quando viene presa in considerazione una soluzione chirurgica, il professionista ne valuta il successivo svolgimento in una struttura idonea."
      ],
      "image": "/images/visite/chiururgia-plastica-napoli-2.jpg"
    },
    "problemsTitle": "Per quali esigenze si può richiedere la consulenza?",
    "problemsSubtitle": "La visita può partire da una richiesta estetica o da un’esigenza ricostruttiva. In entrambi i casi, serve a trasformare una domanda generale in una valutazione clinica concreta.",
    "problemsGrid": [
      {
        "title": "Cambiamenti estetici del viso",
        "description": "Il chirurgo valuta le caratteristiche del viso e della zona su cui si desidera un confronto. Il colloquio aiuta a mettere in relazione la richiesta con le proporzioni e i tessuti, per comprendere quali possibilità siano pertinenti."
      },
      {
        "title": "Modifiche del corpo e dei tessuti",
        "description": "Quando la richiesta riguarda il corpo, la visita considera le caratteristiche anatomiche e i cambiamenti intervenuti nel tempo. Si approfondisce l’obiettivo e si chiarisce che cosa un eventuale approccio chirurgico potrebbe affrontare."
      },
      {
        "title": "Esigenze ricostruttive",
        "description": "La consulenza può orientare richieste di recupero della forma o della funzione dei tessuti. La documentazione clinica e la storia degli eventuali trattamenti precedenti permettono di comprendere il caso e individuare il percorso specialistico più appropriato."
      },
      {
        "title": "Confronto tra soluzioni chirurgiche e non chirurgiche",
        "description": "Una stessa richiesta può far sorgere dubbi su approcci differenti. La visita aiuta a comprenderne finalità e limiti, senza considerare automaticamente intercambiabili chirurgia plastica e medicina estetica."
      }
    ],
    "leadForm": {
      "title": "Un confronto specialistico per orientare la scelta",
      "subtitle": "Lascia i tuoi contatti per organizzare una consulenza di chirurgia plastica. Il team Cocoora ti aiuterà a preparare il primo incontro con lo specialista.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la consulenza di chirurgia plastica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Esprimere obiettivi e aspettative",
        "description": "Il colloquio inizia dalla richiesta e dalle informazioni sulla salute. Puoi raccontare ciò che desideri approfondire, eventuali interventi già effettuati e le domande che vorresti chiarire."
      },
      {
        "stepNumber": "02",
        "title": "Valutazione clinica e confronto sulle opzioni",
        "description": "Il chirurgo esamina la zona e illustra le possibilità pertinenti. Il confronto mette in relazione i cambiamenti desiderati con le caratteristiche individuali, considerando anche eventuali alternative."
      },
      {
        "stepNumber": "03",
        "title": "Orientamento dei passaggi successivi",
        "description": "Se si delinea un possibile percorso, vengono spiegati gli approfondimenti necessari, l’organizzazione delle fasi e gli aspetti da definire prima di decidere. L’incontro lascia spazio anche a una scelta successiva, dopo aver valutato le informazioni ricevute."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dalla consulenza?",
      "description": "La consulenza permette di comprendere se la richiesta possa trovare risposta in un percorso chirurgico o in un’altra soluzione. Il risultato dell’incontro è una valutazione motivata, con indicazioni sulle possibilità e sui passaggi da approfondire.\n\nNon è necessario arrivare con una decisione già presa. Il confronto serve proprio a costruirla, distinguendo i desideri dai risultati realisticamente raggiungibili nel caso individuale.",
      "paragraphs": [
        "La consulenza permette di comprendere se la richiesta possa trovare risposta in un percorso chirurgico o in un’altra soluzione. Il risultato dell’incontro è una valutazione motivata, con indicazioni sulle possibilità e sui passaggi da approfondire.",
        "Non è necessario arrivare con una decisione già presa. Il confronto serve proprio a costruirla, distinguendo i desideri dai risultati realisticamente raggiungibili nel caso individuale."
      ],
      "image": "/images/visite/chiururgia-plastica-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "Posso prenotare anche se non ho deciso di operarmi?",
        "a": "Sì. La consulenza serve a comprendere le opzioni e a chiarire i dubbi. Non richiede di aver già scelto un intervento."
      },
      {
        "q": "La visita riguarda soltanto esigenze estetiche?",
        "a": "Può riguardare anche richieste ricostruttive. Comunica il motivo dell’appuntamento e la documentazione disponibile, così da orientare correttamente il confronto."
      },
      {
        "q": "Che documenti devo portare?",
        "a": "Porta i referti pertinenti, l’elenco delle terapie e la documentazione degli eventuali interventi precedenti. Le informazioni aiutano il chirurgo a ricostruire la storia della zona interessata."
      },
      {
        "q": "Gli eventuali interventi vengono eseguiti da Cocoora?",
        "a": "La prestazione descritta è la consulenza specialistica. L’eventuale percorso chirurgico viene valutato separatamente e deve svolgersi in una struttura idonea, individuata in relazione alla procedura."
      },
      {
        "q": "Si possono confrontare chirurgia e medicina estetica?",
        "a": "Sì, quando il confronto è pertinente alla richiesta. Il professionista spiega le differenze tra gli approcci e quali obiettivi possano essere affrontati con ciascuno."
      },
      {
        "q": "Quanto costa una visita di chirurgia plastica a Napoli?",
        "a": "Il team Cocoora può comunicare il costo della consulenza. Il preventivo di un eventuale intervento è distinto e dipende dal progetto, dalla procedura e dalla struttura in cui verrebbe svolto."
      }
    ],
    "localSeo": {
      "title": "Consulenza di chirurgia plastica a Napoli",
      "description": "A Napoli, Cocoora offre un confronto specialistico dedicato alle esigenze estetiche e ricostruttive. La consulenza di chirurgia plastica aiuta a comprendere le opzioni, valutare le alternative e orientare gli eventuali passaggi successivi con obiettivi chiari.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "radiologia",
    "title": "Radiologia ed ecografie",
    "categoryName": "Diagnostica e prevenzione",
    "tagline": "Un accertamento mirato per conoscere meglio organi e tessuti. Le ecografie utilizzano ultrasuoni per ottenere immagini utili alla valutazione medica, senza radiazioni ionizzanti. L’esame viene scelto in relazione all’area da studiare e alla richiesta clinica.",
    "description": "L’ecografia è un esame diagnostico che utilizza ultrasuoni per rappresentare organi e tessuti. Durante un’ecografia esterna, una sonda viene appoggiata sulla pelle e spostata sull’area interessata; le immagini vengono osservate dal medico durante l’esame.\n\nLa valutazione parte da una domanda clinica: approfondire un sintomo, esaminare una zona o controllare un reperto già conosciuto. Il radiologo o lo specialista interpreta ciò che vede alla luce delle informazioni disponibili e redige il referto.\n\nIn Cocoora la diagnostica descritta comprende ecografie addominali e dei tessuti superficiali. Al momento della prenotazione viene verificata la corrispondenza tra l’esame richiesto e la prestazione disponibile.",
    "heroImage": "/images/visite/radiologia-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/radiologia-napoli-1.jpg",
      "/images/visite/radiologia-napoli-2.jpg",
      "/images/visite/radiologia-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Ecografie a Napoli | Diagnostica Cocoora",
      "metaDescription": "Ecografie a Napoli da Cocoora: esami addominali e dei tessuti superficiali, preparazione e referto. Scopri come organizzare l’accertamento indicato.",
      "keywordMain": "ecografia Napoli.",
      "keywordSec": "radiologia Napoli; ecografia addome Napoli; ecografia tessuti superficiali Napoli; ecografia tessuti molli Napoli; preparazione ecografia."
    },
    "whatIs": {
      "title": "Che cos’è un’ecografia e come funziona?",
      "description": "L’ecografia è un esame diagnostico che utilizza ultrasuoni per rappresentare organi e tessuti. Durante un’ecografia esterna, una sonda viene appoggiata sulla pelle e spostata sull’area interessata; le immagini vengono osservate dal medico durante l’esame.\n\nLa valutazione parte da una domanda clinica: approfondire un sintomo, esaminare una zona o controllare un reperto già conosciuto. Il radiologo o lo specialista interpreta ciò che vede alla luce delle informazioni disponibili e redige il referto.\n\nIn Cocoora la diagnostica descritta comprende ecografie addominali e dei tessuti superficiali. Al momento della prenotazione viene verificata la corrispondenza tra l’esame richiesto e la prestazione disponibile.",
      "paragraphs": [
        "L’ecografia è un esame diagnostico che utilizza ultrasuoni per rappresentare organi e tessuti. Durante un’ecografia esterna, una sonda viene appoggiata sulla pelle e spostata sull’area interessata; le immagini vengono osservate dal medico durante l’esame.",
        "La valutazione parte da una domanda clinica: approfondire un sintomo, esaminare una zona o controllare un reperto già conosciuto. Il radiologo o lo specialista interpreta ciò che vede alla luce delle informazioni disponibili e redige il referto.",
        "In Cocoora la diagnostica descritta comprende ecografie addominali e dei tessuti superficiali. Al momento della prenotazione viene verificata la corrispondenza tra l’esame richiesto e la prestazione disponibile."
      ],
      "image": "/images/visite/radiologia-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la diagnostica ecografica?",
    "problemsSubtitle": "L’ecografia può contribuire all’inquadramento di esigenze diverse. La scelta della zona da esaminare e del tipo di accertamento dipende dalla domanda a cui il medico cerca una risposta.",
    "problemsGrid": [
      {
        "title": "Ecografie addominali",
        "description": "Gli esami addominali permettono di studiare gli organi compresi nell’area richiesta. Possono essere indicati per approfondire un quadro clinico o verificare reperti precedenti; la prestazione specifica viene individuata sulla base della richiesta medica."
      },
      {
        "title": "Ecografie dei tessuti superficiali",
        "description": "L’esame dei tessuti superficiali può aiutare a caratterizzare alterazioni localizzate, come una formazione palpabile. Le immagini offrono informazioni da collegare alla visita e alla storia della zona interessata."
      },
      {
        "title": "Approfondimento di un riscontro clinico",
        "description": "Dopo una visita, l’ecografia può aggiungere elementi utili a comprendere ciò che è stato osservato. L’esame viene orientato da un quesito preciso, così che il referto possa contribuire alle decisioni del medico che segue il percorso."
      },
      {
        "title": "Controllo di reperti già conosciuti",
        "description": "Quando è indicato un monitoraggio, il confronto con le immagini e i referti precedenti aiuta a descrivere l’evoluzione di un reperto. La frequenza dei controlli viene definita in relazione alla situazione clinica."
      }
    ],
    "leadForm": {
      "title": "Organizza il tuo esame ecografico",
      "subtitle": "Lascia i tuoi recapiti e indica il tipo di esame richiesto. Il team Cocoora ti aiuterà a verificare la prestazione e a conoscere la preparazione prevista.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge un’ecografia?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Verifica dell’esame e preparazione",
        "description": "In fase di prenotazione si chiariscono area da esaminare e richiesta clinica. Ricevi le eventuali indicazioni di preparazione, che cambiano in base all’esame e vanno seguite secondo quanto comunicato dallo studio."
      },
      {
        "stepNumber": "02",
        "title": "Esecuzione dell’esame",
        "description": "Il medico esamina la documentazione e posiziona la sonda sull’area, utilizzando un gel che favorisce il contatto. Durante l’osservazione può chiederti di cambiare posizione o seguire brevi indicazioni utili a ottenere le immagini."
      },
      {
        "stepNumber": "03",
        "title": "Referto e lettura nel percorso clinico",
        "description": "Lo specialista descrive i reperti nel referto. Il documento viene poi messo in relazione con i sintomi, la visita e gli altri dati disponibili dal medico che segue il caso, per decidere gli eventuali passaggi successivi."
      }
    ],
    "results": {
      "title": "Quali informazioni può fornire un’ecografia?",
      "description": "L’esame offre immagini e una descrizione delle strutture studiate. Può contribuire a chiarire un quesito clinico, orientare un controllo o indicare la necessità di approfondire alcuni aspetti.\n\nIl referto non va letto isolatamente: il suo significato dipende anche dalla visita e dalla storia della persona. L’obiettivo è ottenere informazioni pertinenti, scegliendo l’accertamento adatto alla domanda clinica.",
      "paragraphs": [
        "L’esame offre immagini e una descrizione delle strutture studiate. Può contribuire a chiarire un quesito clinico, orientare un controllo o indicare la necessità di approfondire alcuni aspetti.",
        "Il referto non va letto isolatamente: il suo significato dipende anche dalla visita e dalla storia della persona. L’obiettivo è ottenere informazioni pertinenti, scegliendo l’accertamento adatto alla domanda clinica."
      ],
      "image": "/images/visite/radiologia-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "L’ecografia utilizza radiazioni?",
        "a": "Utilizza ultrasuoni, non radiazioni ionizzanti. È una metodica diversa dalla radiografia, dalla TAC e dalla risonanza magnetica."
      },
      {
        "q": "Quali ecografie si possono prenotare da Cocoora?",
        "a": "La proposta comprende esami addominali e dei tessuti superficiali. Comunica al team la denominazione esatta dell’esame richiesto, per verificare la prestazione e organizzare l’appuntamento."
      },
      {
        "q": "Per l’ecografia devo essere a digiuno?",
        "a": "La preparazione dipende dal tipo di esame. Per alcuni accertamenti possono esserci indicazioni specifiche su alimentazione o idratazione: segui quelle ricevute al momento della prenotazione, senza applicare istruzioni generiche."
      },
      {
        "q": "Che cosa devo portare?",
        "a": "Porta la richiesta medica, se disponibile, e gli esami precedenti relativi alla stessa area, comprese le immagini. Il confronto aiuta lo specialista a interpretare i reperti nel loro contesto."
      },
      {
        "q": "Quando riceverò il referto?",
        "a": "Le modalità di consegna vengono chiarite dal team per la prestazione prenotata. Il referto è redatto dallo specialista che esegue l’esame e va condiviso con il medico che segue il percorso clinico."
      },
      {
        "q": "Quanto costa un’ecografia a Napoli?",
        "a": "Il costo varia in base all’esame e all’area da studiare. Comunica la prestazione richiesta al team Cocoora per ricevere informazioni precise prima della prenotazione."
      }
    ],
    "localSeo": {
      "title": "Ecografie a Napoli",
      "description": "Da Cocoora, a Napoli, la diagnostica ecografica comprende esami addominali e dei tessuti superficiali eseguiti e refertati dallo specialista. Il percorso parte dalla richiesta clinica e dalla scelta dell’accertamento, con informazioni sulla preparazione e sull’organizzazione dell’appuntamento.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "cardiologia",
    "title": "Visita cardiologica",
    "categoryName": "Diagnostica e prevenzione",
    "tagline": "Conoscere la salute del cuore significa mettere insieme sintomi, abitudini e storia personale. La visita cardiologica permette di valutare il quadro cardiovascolare e individuare le indicazioni utili per la prevenzione, gli approfondimenti e i controlli.",
    "description": "La visita cardiologica è una valutazione specialistica della salute del cuore e dei principali fattori di rischio cardiovascolare. Può essere richiesta per approfondire un disturbo, controllare una condizione già conosciuta o definire un percorso di prevenzione.\n\nIl cardiologo considera la storia clinica e familiare, le abitudini quotidiane, i farmaci assunti e gli esami disponibili. Queste informazioni aiutano a comprendere i riscontri della visita nel contesto della persona.\n\nGli eventuali esami strumentali vengono scelti in base alla domanda clinica. Da Cocoora il confronto con lo specialista serve a dare ordine ai passaggi: che cosa approfondire, quali indicazioni seguire e quando programmare un controllo.",
    "heroImage": "/images/visite/cardiologia-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/cardiologia-napoli-1.jpg",
      "/images/visite/cardiologia-napoli-2.jpg",
      "/images/visite/cardiologia-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita cardiologica a Napoli | Cocoora",
      "metaDescription": "Visita cardiologica a Napoli: valutazione del cuore, pressione e fattori di rischio. Cocoora propone un percorso specialistico e controlli personalizzati.",
      "keywordMain": "visita cardiologica Napoli.",
      "keywordSec": "cardiologo Napoli; controllo cardiologico Napoli; visita cardiologica pressione alta; prevenzione cardiovascolare Napoli; controllo palpitazioni."
    },
    "whatIs": {
      "title": "Che cos’è la visita cardiologica e come funziona?",
      "description": "La visita cardiologica è una valutazione specialistica della salute del cuore e dei principali fattori di rischio cardiovascolare. Può essere richiesta per approfondire un disturbo, controllare una condizione già conosciuta o definire un percorso di prevenzione.\n\nIl cardiologo considera la storia clinica e familiare, le abitudini quotidiane, i farmaci assunti e gli esami disponibili. Queste informazioni aiutano a comprendere i riscontri della visita nel contesto della persona.\n\nGli eventuali esami strumentali vengono scelti in base alla domanda clinica. Da Cocoora il confronto con lo specialista serve a dare ordine ai passaggi: che cosa approfondire, quali indicazioni seguire e quando programmare un controllo.",
      "paragraphs": [
        "La visita cardiologica è una valutazione specialistica della salute del cuore e dei principali fattori di rischio cardiovascolare. Può essere richiesta per approfondire un disturbo, controllare una condizione già conosciuta o definire un percorso di prevenzione.",
        "Il cardiologo considera la storia clinica e familiare, le abitudini quotidiane, i farmaci assunti e gli esami disponibili. Queste informazioni aiutano a comprendere i riscontri della visita nel contesto della persona.",
        "Gli eventuali esami strumentali vengono scelti in base alla domanda clinica. Da Cocoora il confronto con lo specialista serve a dare ordine ai passaggi: che cosa approfondire, quali indicazioni seguire e quando programmare un controllo."
      ],
      "image": "/images/visite/cardiologia-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve una visita cardiologica?",
    "problemsSubtitle": "Un controllo del cuore può rispondere a esigenze differenti. Il motivo dell’appuntamento orienta la valutazione e permette di concentrarsi sulle informazioni davvero utili.",
    "problemsGrid": [
      {
        "title": "Valutazione della pressione arteriosa",
        "description": "Valori pressori alterati o una diagnosi di ipertensione possono richiedere un approfondimento cardiologico. Lo specialista considera le misurazioni disponibili e il quadro generale, per definire o rivedere le indicazioni di gestione."
      },
      {
        "title": "Approfondimento di palpitazioni e affanno ricorrenti",
        "description": "Il racconto di quando compaiono i disturbi e di come si manifestano aiuta il cardiologo a orientare la valutazione. La visita permette di capire quali aspetti approfondire e se siano necessari esami specifici."
      },
      {
        "title": "Prevenzione e fattori di rischio cardiovascolare",
        "description": "Storia familiare, condizioni di salute e abitudini contribuiscono a definire il profilo individuale. La consulenza aiuta a individuare le priorità della prevenzione e a scegliere controlli proporzionati alle esigenze."
      },
      {
        "title": "Controlli per condizioni cardiache già note",
        "description": "Per chi segue già un percorso cardiologico, la visita offre un momento di rivalutazione. Il medico esamina l’andamento clinico, i risultati degli accertamenti e la terapia, organizzando il monitoraggio successivo."
      }
    ],
    "leadForm": {
      "title": "Programma il tuo controllo cardiologico",
      "subtitle": "Lascia i tuoi contatti per ricevere informazioni sulla visita cardiologica. Il team Cocoora ti aiuterà a organizzare l’appuntamento e a conoscere la documentazione utile.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita cardiologica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Storia clinica e motivo del controllo",
        "description": "Il cardiologo raccoglie informazioni sui disturbi, sulle condizioni già diagnosticate e sulle terapie. I referti precedenti e le eventuali misurazioni pressorie già disponibili aiutano a ricostruire l’andamento nel tempo."
      },
      {
        "stepNumber": "02",
        "title": "Valutazione clinica del cuore",
        "description": "L’esame clinico comprende le verifiche pertinenti, come l’auscultazione e la misurazione della pressione. In relazione ai riscontri, il medico valuta se servano approfondimenti strumentali."
      },
      {
        "stepNumber": "03",
        "title": "Indicazioni e programma di monitoraggio",
        "description": "Al termine vengono condivise le indicazioni emerse e gli eventuali esami da eseguire. Lo specialista chiarisce anche come organizzare i controlli e il rapporto con le cure già seguite."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dalla visita cardiologica?",
      "description": "La valutazione offre una lettura del quadro cardiovascolare e un orientamento sui passaggi successivi. Può chiarire le priorità della prevenzione, completare il monitoraggio di una condizione o individuare un approfondimento diagnostico.\n\nQuando il percorso richiede altri esami, le conclusioni vengono costruite insieme ai loro risultati. La continuità dei controlli permette di aggiornare le indicazioni rispetto all’evoluzione della salute.",
      "paragraphs": [
        "La valutazione offre una lettura del quadro cardiovascolare e un orientamento sui passaggi successivi. Può chiarire le priorità della prevenzione, completare il monitoraggio di una condizione o individuare un approfondimento diagnostico.",
        "Quando il percorso richiede altri esami, le conclusioni vengono costruite insieme ai loro risultati. La continuità dei controlli permette di aggiornare le indicazioni rispetto all’evoluzione della salute."
      ],
      "image": "/images/visite/cardiologia-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "La visita è utile anche per la prevenzione?",
        "a": "Può esserlo quando è indicata rispetto alla storia personale e ai fattori di rischio. Il confronto con il medico aiuta a scegliere la valutazione e la frequenza dei controlli."
      },
      {
        "q": "La visita cardiologica comprende sempre l’ECG?",
        "a": "La visita clinica e l’elettrocardiogramma sono prestazioni distinte. L’eventuale esecuzione dell’ECG dipende dall’indicazione e dall’appuntamento prenotato: il team chiarisce cosa è previsto."
      },
      {
        "q": "Che cosa devo portare al cardiologo?",
        "a": "Porta referti cardiologici precedenti, esami disponibili, elenco dei farmaci e, se già raccolte, le misurazioni della pressione. È utile annotare quando compaiono gli eventuali disturbi."
      },
      {
        "q": "Occorre una preparazione particolare?",
        "a": "Le indicazioni dipendono dalle prestazioni previste nell’appuntamento. Chiedi al team le informazioni relative alla visita prenotata e comunica le terapie seguite, senza modificarle autonomamente."
      },
      {
        "q": "Ogni quanto va ripetuto il controllo del cuore?",
        "a": "L’intervallo viene stabilito dal cardiologo in relazione a condizioni cliniche, fattori di rischio e obiettivi del monitoraggio. Non esiste una frequenza uguale per ogni persona."
      },
      {
        "q": "Quanto costa una visita cardiologica a Napoli?",
        "a": "Il team Cocoora può comunicare il costo della visita e specificare le prestazioni comprese. Eventuali esami strumentali vanno considerati secondo il percorso effettivamente previsto."
      }
    ],
    "localSeo": {
      "title": "Visita cardiologica a Napoli",
      "description": "A Napoli, Cocoora propone visite cardiologiche per la valutazione del cuore e dei fattori di rischio cardiovascolare. Il percorso specialistico collega storia clinica, visita ed eventuali accertamenti, con indicazioni dedicate alla prevenzione e al monitoraggio.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "ginecologia",
    "title": "Visita ginecologica",
    "categoryName": "Diagnostica e prevenzione",
    "tagline": "La salute ginecologica cambia insieme alle fasi della vita. La visita permette di approfondire disturbi, dubbi e necessità di prevenzione, mettendo in relazione sintomi, storia personale e caratteristiche individuali.",
    "description": "La visita ginecologica è una valutazione specialistica dedicata alla salute dell’apparato genitale femminile. Può essere richiesta per un controllo periodico, per approfondire un sintomo o per affrontare esigenze che cambiano dall’età fertile alla menopausa.\n\nIl medico raccoglie la storia clinica e ginecologica, ascolta il motivo dell’appuntamento e approfondisce aspetti come ciclo mestruale, eventuali disturbi, terapie e controlli già effettuati. La valutazione viene adattata all’età, alla storia personale e alla richiesta.\n\nQuando servono ulteriori accertamenti, il ginecologo spiega quali possono essere utili e come inserirli nel percorso. Visita, ecografia, Pap test e altri esami sono prestazioni diverse: ciò che viene eseguito o programmato dipende dall’indicazione e dall’appuntamento organizzato.",
    "heroImage": "/images/visite/ginecologia-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/ginecologia-napoli-1.jpg",
      "/images/visite/ginecologia-napoli-2.jpg",
      "/images/visite/ginecologia-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita ginecologica a Napoli | Cocoora",
      "metaDescription": "Visita ginecologica a Napoli per controlli, disturbi del ciclo, prevenzione e salute nelle diverse fasi della vita. Scopri il percorso Cocoora.",
      "keywordMain": "visita ginecologica Napoli.",
      "keywordSec": "ginecologo Napoli; ginecologa Napoli; controllo ginecologico Napoli; visita ginecologica ciclo irregolare; ginecologo menopausa Napoli; prevenzione ginecologica."
    },
    "whatIs": {
      "title": "Che cos’è la visita ginecologica e come funziona?",
      "description": "La visita ginecologica è una valutazione specialistica dedicata alla salute dell’apparato genitale femminile. Può essere richiesta per un controllo periodico, per approfondire un sintomo o per affrontare esigenze che cambiano dall’età fertile alla menopausa.\n\nIl medico raccoglie la storia clinica e ginecologica, ascolta il motivo dell’appuntamento e approfondisce aspetti come ciclo mestruale, eventuali disturbi, terapie e controlli già effettuati. La valutazione viene adattata all’età, alla storia personale e alla richiesta.\n\nQuando servono ulteriori accertamenti, il ginecologo spiega quali possono essere utili e come inserirli nel percorso. Visita, ecografia, Pap test e altri esami sono prestazioni diverse: ciò che viene eseguito o programmato dipende dall’indicazione e dall’appuntamento organizzato.",
      "paragraphs": [
        "La visita ginecologica è una valutazione specialistica dedicata alla salute dell’apparato genitale femminile. Può essere richiesta per un controllo periodico, per approfondire un sintomo o per affrontare esigenze che cambiano dall’età fertile alla menopausa.",
        "Il medico raccoglie la storia clinica e ginecologica, ascolta il motivo dell’appuntamento e approfondisce aspetti come ciclo mestruale, eventuali disturbi, terapie e controlli già effettuati. La valutazione viene adattata all’età, alla storia personale e alla richiesta.",
        "Quando servono ulteriori accertamenti, il ginecologo spiega quali possono essere utili e come inserirli nel percorso. Visita, ecografia, Pap test e altri esami sono prestazioni diverse: ciò che viene eseguito o programmato dipende dall’indicazione e dall’appuntamento organizzato."
      ],
      "image": "/images/visite/ginecologia-napoli-2.jpg"
    },
    "problemsTitle": "Quando è utile una visita ginecologica?",
    "problemsSubtitle": "Non serve aspettare che compaia un problema importante. Il controllo può essere utile per prevenzione, per capire un cambiamento o per avere indicazioni più chiare su una fase della propria vita.",
    "problemsGrid": [
      {
        "title": "Ciclo irregolare, doloroso o cambiato nel tempo",
        "description": "Variazioni nella regolarità, nella durata o nell’intensità del ciclo possono essere approfondite durante la visita. Il ginecologo raccoglie le informazioni sull’andamento mestruale e valuta se siano necessari ulteriori accertamenti."
      },
      {
        "title": "Dolore, fastidio o altri sintomi ginecologici",
        "description": "Dolore pelvico, perdite insolite, prurito o altri cambiamenti meritano un inquadramento quando persistono o creano dubbi. La visita aiuta a comprenderne le caratteristiche e a orientare le eventuali cure o verifiche."
      },
      {
        "title": "Prevenzione e controlli periodici",
        "description": "La visita può essere anche un momento dedicato alla prevenzione. In base all’età, alla storia clinica e ai controlli già effettuati, il medico chiarisce quali esami o appuntamenti siano pertinenti e con quale frequenza."
      },
      {
        "title": "Contraccezione e salute riproduttiva",
        "description": "Quando la richiesta riguarda la contraccezione o un progetto di gravidanza, il colloquio permette di affrontare dubbi e necessità personali. Le indicazioni vengono definite rispetto alla storia clinica e agli obiettivi individuali."
      },
      {
        "title": "Menopausa e cambiamenti della fase adulta",
        "description": "La menopausa può accompagnarsi a cambiamenti del ciclo e a sintomi che incidono sulla quotidianità. La visita offre uno spazio per valutarli e comprendere quali indicazioni o approfondimenti possano essere utili."
      }
    ],
    "leadForm": {
      "title": "Dedica uno spazio alla tua salute ginecologica",
      "subtitle": "Lascia i tuoi contatti per ricevere informazioni sulla visita ginecologica. Il team Cocoora ti aiuterà a organizzare l’appuntamento e a capire quale documentazione portare.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita ginecologica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Colloquio e storia ginecologica",
        "description": "L’incontro parte dal motivo della visita. Il medico raccoglie informazioni sul ciclo, sui sintomi, sulle terapie, su eventuali gravidanze, interventi e controlli precedenti, lasciando spazio alle domande della persona."
      },
      {
        "stepNumber": "02",
        "title": "Valutazione clinica",
        "description": "La visita viene organizzata in base all’età e alla situazione individuale. Il ginecologo esegue le valutazioni cliniche appropriate alla richiesta e tiene conto della documentazione disponibile."
      },
      {
        "stepNumber": "03",
        "title": "Indicazioni e controlli successivi",
        "description": "Al termine vengono spiegati i riscontri e gli eventuali passi successivi. Se sono necessari esami, terapie o controlli, il medico ne chiarisce la finalità e come inserirli nel percorso."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dalla visita ginecologica?",
      "description": "La visita aiuta a comprendere meglio la propria salute ginecologica e a dare una direzione alle domande emerse. Può confermare che non servano ulteriori interventi, suggerire un monitoraggio o indicare approfondimenti mirati.\n\nIl percorso non è uguale per tutte: età, sintomi, storia personale e obiettivi cambiano le priorità. Per questo la visita serve soprattutto a costruire indicazioni coerenti con la persona e con la fase di vita che sta attraversando.",
      "paragraphs": [
        "La visita aiuta a comprendere meglio la propria salute ginecologica e a dare una direzione alle domande emerse. Può confermare che non servano ulteriori interventi, suggerire un monitoraggio o indicare approfondimenti mirati.",
        "Il percorso non è uguale per tutte: età, sintomi, storia personale e obiettivi cambiano le priorità. Per questo la visita serve soprattutto a costruire indicazioni coerenti con la persona e con la fase di vita che sta attraversando."
      ],
      "image": "/images/visite/ginecologia-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "Quando è consigliabile fare una visita ginecologica?",
        "a": "Può essere utile per un controllo periodico, in presenza di sintomi o quando si desidera approfondire temi legati al ciclo, alla contraccezione, alla salute riproduttiva o alla menopausa. La frequenza dei controlli viene personalizzata."
      },
      {
        "q": "Devo aspettare di avere un problema per prenotare?",
        "a": "No. La visita può avere anche una funzione di prevenzione e controllo. Il ginecologo valuta la storia personale e indica gli eventuali approfondimenti pertinenti."
      },
      {
        "q": "La visita comprende sempre il Pap test?",
        "a": "No. Visita ginecologica e Pap test sono prestazioni distinte. L’eventuale esecuzione dipende dall’indicazione clinica, dal programma di prevenzione e dall’appuntamento prenotato."
      },
      {
        "q": "La visita comprende un’ecografia?",
        "a": "Non automaticamente. L’ecografia è un esame distinto e può essere indicata in relazione alla situazione clinica. Il team Cocoora può chiarire in fase di prenotazione quali prestazioni sono previste."
      },
      {
        "q": "Che cosa devo portare alla prima visita?",
        "a": "È utile portare eventuali referti ginecologici precedenti, esami già eseguiti e l’elenco delle terapie in corso. Se il motivo riguarda il ciclo, può essere utile ricordare l’andamento degli ultimi mesi."
      },
      {
        "q": "Quanto costa una visita ginecologica a Napoli?",
        "a": "Il team Cocoora può comunicare il costo della visita e chiarire cosa comprende l’appuntamento. Eventuali esami o prestazioni aggiuntive vengono considerati separatamente."
      }
    ],
    "localSeo": {
      "title": "Visita ginecologica a Napoli",
      "description": "A Napoli, Cocoora propone visite ginecologiche dedicate alla prevenzione e alla salute nelle diverse fasi della vita. Il percorso parte dall’ascolto della richiesta e dalla valutazione specialistica, per orientare controlli, eventuali approfondimenti e indicazioni personalizzate.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "pediatria",
    "title": "Visita pediatrica",
    "categoryName": "Specialistiche per la famiglia",
    "tagline": "Crescere significa cambiare continuamente. La visita pediatrica accompagna bambini, ragazzi e famiglie nei controlli di salute, nella valutazione della crescita e nell’approfondimento dei disturbi più comuni dell’età evolutiva.",
    "description": "La visita pediatrica è una valutazione dedicata alla salute e allo sviluppo di bambini e ragazzi. Può essere programmata come controllo periodico oppure richiesta quando emerge un disturbo, un cambiamento o una domanda che la famiglia desidera approfondire.\n\nIl pediatra raccoglie le informazioni sulla storia del bambino, osserva crescita e sviluppo e considera alimentazione, sonno, attività quotidiane e altri aspetti utili in relazione all’età. I dati vengono letti nel loro insieme, non come valori isolati.\n\nQuando è necessario un approfondimento, il medico indica gli eventuali controlli o il coinvolgimento di altre competenze. Da Cocoora il percorso è pensato per dare alla famiglia indicazioni chiare sui passi successivi.",
    "heroImage": "/images/visite/pediatria-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/pediatria-napoli-1.jpg",
      "/images/visite/pediatria-napoli-2.jpg",
      "/images/visite/pediatria-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita pediatrica a Napoli | Cocoora",
      "metaDescription": "Visita pediatrica a Napoli per salute, crescita e sviluppo di bambini e ragazzi. Scopri il percorso Cocoora e come organizzare il controllo.",
      "keywordMain": "pediatra Napoli.",
      "keywordSec": "visita pediatrica Napoli; pediatra bambini Napoli; controllo crescita bambino Napoli; visita crescita pediatrica; controllo pediatrico Napoli."
    },
    "whatIs": {
      "title": "Che cos’è la visita pediatrica e come funziona?",
      "description": "La visita pediatrica è una valutazione dedicata alla salute e allo sviluppo di bambini e ragazzi. Può essere programmata come controllo periodico oppure richiesta quando emerge un disturbo, un cambiamento o una domanda che la famiglia desidera approfondire.\n\nIl pediatra raccoglie le informazioni sulla storia del bambino, osserva crescita e sviluppo e considera alimentazione, sonno, attività quotidiane e altri aspetti utili in relazione all’età. I dati vengono letti nel loro insieme, non come valori isolati.\n\nQuando è necessario un approfondimento, il medico indica gli eventuali controlli o il coinvolgimento di altre competenze. Da Cocoora il percorso è pensato per dare alla famiglia indicazioni chiare sui passi successivi.",
      "paragraphs": [
        "La visita pediatrica è una valutazione dedicata alla salute e allo sviluppo di bambini e ragazzi. Può essere programmata come controllo periodico oppure richiesta quando emerge un disturbo, un cambiamento o una domanda che la famiglia desidera approfondire.",
        "Il pediatra raccoglie le informazioni sulla storia del bambino, osserva crescita e sviluppo e considera alimentazione, sonno, attività quotidiane e altri aspetti utili in relazione all’età. I dati vengono letti nel loro insieme, non come valori isolati.",
        "Quando è necessario un approfondimento, il medico indica gli eventuali controlli o il coinvolgimento di altre competenze. Da Cocoora il percorso è pensato per dare alla famiglia indicazioni chiare sui passi successivi."
      ],
      "image": "/images/visite/pediatria-napoli-2.jpg"
    },
    "problemsTitle": "Quando è utile una visita pediatrica?",
    "problemsSubtitle": "La visita può rispondere a esigenze molto diverse nel corso della crescita. Un appuntamento non serve soltanto quando il bambino è malato: può essere anche un momento di verifica e confronto.",
    "problemsGrid": [
      {
        "title": "Controllare crescita e sviluppo",
        "description": "Peso, altezza e cambiamenti legati all’età vengono osservati nel tempo e messi in relazione con la storia del bambino. Il pediatra valuta il percorso di crescita nel suo complesso e chiarisce eventuali aspetti da monitorare."
      },
      {
        "title": "Approfondire disturbi comuni dell’età evolutiva",
        "description": "Febbre ricorrente, disturbi gastrointestinali, tosse, problemi cutanei o altri sintomi frequenti possono essere inquadrati dal pediatra, che valuta quando siano sufficienti indicazioni generali e quando servano approfondimenti."
      },
      {
        "title": "Alimentazione e abitudini quotidiane",
        "description": "Cambiamenti nell’appetito, organizzazione dei pasti, sonno e attività fisica possono essere discussi durante la visita. Le indicazioni vengono adattate all’età e alle caratteristiche del bambino, evitando schemi uguali per tutti."
      },
      {
        "title": "Dubbi su sviluppo e comportamento",
        "description": "La famiglia può portare domande su tappe dello sviluppo, autonomia, sonno o altri cambiamenti osservati. Il pediatra aiuta a capire quali aspetti rientrino nella variabilità della crescita e quali meritino un approfondimento."
      },
      {
        "title": "Controlli periodici anche in assenza di disturbi",
        "description": "I controlli programmati permettono di seguire l’evoluzione del bambino e aggiornare le indicazioni nel tempo. La frequenza viene definita in base all’età, alla storia personale e alle esigenze emerse."
      }
    ],
    "leadForm": {
      "title": "Un appuntamento dedicato alla crescita",
      "subtitle": "Lascia i tuoi contatti per ricevere informazioni sulla visita pediatrica. Il team Cocoora ti aiuterà a organizzare l’appuntamento e a preparare la documentazione utile.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita pediatrica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Ascolto della famiglia e storia del bambino",
        "description": "Il pediatra raccoglie il motivo dell’appuntamento, la storia clinica e le informazioni utili sulla quotidianità. Referti precedenti, terapie e controlli già effettuati aiutano a ricostruire il percorso."
      },
      {
        "stepNumber": "02",
        "title": "Valutazione clinica e della crescita",
        "description": "La visita comprende le verifiche appropriate all’età e alla richiesta. Il medico osserva le condizioni generali e, quando pertinente, considera i parametri di crescita e gli aspetti dello sviluppo."
      },
      {
        "stepNumber": "03",
        "title": "Indicazioni e prossimi controlli",
        "description": "Al termine vengono spiegati i riscontri e le indicazioni. Se servono altri esami o una valutazione specialistica, il pediatra chiarisce il motivo e aiuta a orientare i passaggi successivi."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dalla visita pediatrica?",
      "description": "La visita offre alla famiglia un punto di riferimento per comprendere la situazione attuale e sapere come proseguire. In alcuni casi il controllo conferma un andamento regolare; in altri permette di individuare aspetti da seguire nel tempo o da approfondire.\n\nIl valore del percorso sta anche nella continuità. Confrontare visite e informazioni nel tempo aiuta a leggere i cambiamenti della crescita e ad adattare le indicazioni alle nuove esigenze del bambino.",
      "paragraphs": [
        "La visita offre alla famiglia un punto di riferimento per comprendere la situazione attuale e sapere come proseguire. In alcuni casi il controllo conferma un andamento regolare; in altri permette di individuare aspetti da seguire nel tempo o da approfondire.",
        "Il valore del percorso sta anche nella continuità. Confrontare visite e informazioni nel tempo aiuta a leggere i cambiamenti della crescita e ad adattare le indicazioni alle nuove esigenze del bambino."
      ],
      "image": "/images/visite/pediatria-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "La visita pediatrica serve anche se mio figlio sta bene?",
        "a": "Sì. Un controllo può essere utile per seguire crescita e sviluppo e per confrontarsi su alimentazione, sonno, abitudini e altri aspetti legati all’età, secondo le indicazioni del pediatra."
      },
      {
        "q": "Quali documenti è utile portare?",
        "a": "Porta i referti disponibili, l’elenco delle eventuali terapie e la documentazione relativa ai controlli già eseguiti. Quando presenti, anche i dati di crescita precedenti aiutano a ricostruire l’andamento nel tempo."
      },
      {
        "q": "Posso parlare di alimentazione e sonno durante la visita?",
        "a": "Sì. Sono aspetti della quotidianità che possono essere discussi con il pediatra quando pertinenti alla richiesta e all’età del bambino."
      },
      {
        "q": "Quando un disturbo richiede uno specialista pediatrico?",
        "a": "Dipende dal tipo di problema e da ciò che emerge durante la valutazione. Il pediatra può indicare un approfondimento specialistico quando ritiene utile una competenza dedicata."
      },
      {
        "q": "La visita pediatrica da Cocoora è un servizio di urgenza?",
        "a": "La pagina descrive visite programmate. Per situazioni acute o urgenti è necessario rivolgersi ai servizi sanitari appropriati. Il team Cocoora può invece fornire informazioni sull’organizzazione degli appuntamenti programmati."
      },
      {
        "q": "Quanto costa una visita pediatrica a Napoli?",
        "a": "Il team Cocoora può comunicare il costo della visita e chiarire cosa comprende l’appuntamento. Eventuali esami o valutazioni specialistiche aggiuntive vengono considerate separatamente."
      }
    ],
    "localSeo": {
      "title": "Visita pediatrica a Napoli",
      "description": "A Napoli, Cocoora propone visite pediatriche dedicate alla salute, alla crescita e allo sviluppo di bambini e ragazzi. Il pediatra accompagna la famiglia nella valutazione dei bisogni del momento e nell’organizzazione degli eventuali controlli successivi.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "oculistica",
    "title": "Visita oculistica",
    "categoryName": "Specialistiche per la famiglia",
    "tagline": "Vedere bene e conoscere la salute degli occhi sono aspetti dello stesso percorso. La visita oculistica valuta la funzione visiva, approfondisce gli eventuali disturbi e orienta controlli, correzioni o ulteriori accertamenti.",
    "description": "La visita oculistica è una valutazione medica della vista e della salute degli occhi. Non si limita alla gradazione degli occhiali: mette in relazione la capacità visiva con le condizioni oculari, la storia personale e gli eventuali sintomi.\n\nL’oculista raccoglie le informazioni sulle difficoltà riscontrate, sulle correzioni utilizzate e sui controlli già effettuati. Esamina poi gli occhi e la funzione visiva attraverso le verifiche appropriate alla richiesta.\n\nIn base ai riscontri, può indicare una correzione, una cura, ulteriori esami o un programma di monitoraggio. Da Cocoora la visita aiuta a comprendere quale attenzione dedicare agli occhi e come organizzare i passaggi successivi.",
    "heroImage": "/images/visite/oculistica-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/oculistica-napoli-1.jpg",
      "/images/visite/oculistica-napoli-2.jpg",
      "/images/visite/oculistica-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita oculistica a Napoli | Cocoora",
      "metaDescription": "Visita oculistica a Napoli per valutare vista e salute degli occhi. Cocoora propone un controllo specialistico e indicazioni sugli eventuali approfondimenti.",
      "keywordMain": "visita oculistica Napoli.",
      "keywordSec": "oculista Napoli; controllo vista Napoli; controllo occhi Napoli; prima visita oculistica; visita per difficoltà visive."
    },
    "whatIs": {
      "title": "Che cos’è la visita oculistica e come funziona?",
      "description": "La visita oculistica è una valutazione medica della vista e della salute degli occhi. Non si limita alla gradazione degli occhiali: mette in relazione la capacità visiva con le condizioni oculari, la storia personale e gli eventuali sintomi.\n\nL’oculista raccoglie le informazioni sulle difficoltà riscontrate, sulle correzioni utilizzate e sui controlli già effettuati. Esamina poi gli occhi e la funzione visiva attraverso le verifiche appropriate alla richiesta.\n\nIn base ai riscontri, può indicare una correzione, una cura, ulteriori esami o un programma di monitoraggio. Da Cocoora la visita aiuta a comprendere quale attenzione dedicare agli occhi e come organizzare i passaggi successivi.",
      "paragraphs": [
        "La visita oculistica è una valutazione medica della vista e della salute degli occhi. Non si limita alla gradazione degli occhiali: mette in relazione la capacità visiva con le condizioni oculari, la storia personale e gli eventuali sintomi.",
        "L’oculista raccoglie le informazioni sulle difficoltà riscontrate, sulle correzioni utilizzate e sui controlli già effettuati. Esamina poi gli occhi e la funzione visiva attraverso le verifiche appropriate alla richiesta.",
        "In base ai riscontri, può indicare una correzione, una cura, ulteriori esami o un programma di monitoraggio. Da Cocoora la visita aiuta a comprendere quale attenzione dedicare agli occhi e come organizzare i passaggi successivi."
      ],
      "image": "/images/visite/oculistica-napoli-2.jpg"
    },
    "problemsTitle": "Per quali esigenze è utile una visita oculistica?",
    "problemsSubtitle": "La valutazione può riguardare una difficoltà precisa oppure un controllo della salute oculare. Le abitudini di lettura, lavoro e utilizzo degli occhiali aiutano a descrivere l’esperienza visiva quotidiana.",
    "problemsGrid": [
      {
        "title": "Difficoltà a vedere da vicino o da lontano",
        "description": "Quando la lettura o la visione a distanza risultano meno nitide, l’oculista valuta la funzione visiva e l’eventuale necessità di una correzione. La visita considera anche gli occhiali già utilizzati e i cambiamenti riferiti."
      },
      {
        "title": "Disturbi visivi da approfondire",
        "description": "Un disturbo della vista richiede di comprenderne caratteristiche e andamento. Il medico raccoglie il racconto della persona e lo collega all’esame degli occhi, per orientare gli eventuali approfondimenti."
      },
      {
        "title": "Controlli di condizioni oculari già note",
        "description": "Chi segue già un percorso oculistico può utilizzare la visita per verificare la situazione e confrontare gli esami nel tempo. Il controllo permette di aggiornare le indicazioni e organizzare il monitoraggio successivo."
      },
      {
        "title": "Prevenzione in relazione alla storia personale",
        "description": "Età, familiarità e condizioni di salute possono orientare l’attenzione verso specifici aspetti oculari. La valutazione aiuta a scegliere controlli pertinenti, anche quando la richiesta non riguarda un nuovo paio di occhiali."
      }
    ],
    "leadForm": {
      "title": "Dedica un appuntamento alla salute degli occhi",
      "subtitle": "Lascia i tuoi recapiti per ricevere informazioni sulla visita oculistica. Il team Cocoora ti aiuterà a programmare il controllo e a preparare la documentazione.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita oculistica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Conoscere la storia visiva",
        "description": "L’oculista chiede quali difficoltà siano presenti, da quando e in quali situazioni. Valuta la documentazione, le terapie seguite e le correzioni già utilizzate, raccogliendo anche le informazioni familiari pertinenti."
      },
      {
        "stepNumber": "02",
        "title": "Esame degli occhi e della funzione visiva",
        "description": "Il medico esegue le verifiche cliniche necessarie per valutare vista e strutture oculari. La scelta degli eventuali esami aggiuntivi dipende dai riscontri e dalla situazione individuale."
      },
      {
        "stepNumber": "03",
        "title": "Spiegazione delle indicazioni",
        "description": "Al termine viene illustrato ciò che è emerso, chiarendo le eventuali indicazioni sulla correzione visiva, sulle cure o sugli approfondimenti. Quando serve, si definisce il prossimo controllo."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dal controllo oculistico?",
      "description": "La visita offre un quadro della funzione visiva e della salute degli occhi, con indicazioni collegate alle esigenze emerse. Può aiutare a comprendere una difficoltà, verificare una correzione o dare continuità a un percorso già in corso.\n\nAlcune situazioni richiedono esami ulteriori prima di completare la valutazione. Lo specialista ne chiarisce la finalità, così da sapere perché vengono proposti e come si inseriscono nel percorso.",
      "paragraphs": [
        "La visita offre un quadro della funzione visiva e della salute degli occhi, con indicazioni collegate alle esigenze emerse. Può aiutare a comprendere una difficoltà, verificare una correzione o dare continuità a un percorso già in corso.",
        "Alcune situazioni richiedono esami ulteriori prima di completare la valutazione. Lo specialista ne chiarisce la finalità, così da sapere perché vengono proposti e come si inseriscono nel percorso."
      ],
      "image": "/images/visite/oculistica-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "La visita oculistica è soltanto una misurazione della vista?",
        "a": "No. La valutazione medica comprende la salute degli occhi e l’inquadramento degli eventuali disturbi, oltre alla funzione visiva e alla possibile necessità di una correzione."
      },
      {
        "q": "Devo portare gli occhiali che uso?",
        "a": "Sì, è utile portare gli occhiali e le prescrizioni disponibili, insieme ai referti precedenti. Segnala anche l’eventuale utilizzo di lenti a contatto quando organizzi la visita."
      },
      {
        "q": "Sono necessari esami prima dell’appuntamento?",
        "a": "Porta la documentazione già disponibile. Gli accertamenti ulteriori vengono indicati in relazione alla visita o a una richiesta medica specifica, senza un elenco uguale per tutti."
      },
      {
        "q": "La visita comprende tutti gli esami oculari?",
        "a": "La consulenza e gli esami strumentali aggiuntivi sono prestazioni da distinguere. Il team chiarisce cosa comprende l’appuntamento; l’oculista valuta gli eventuali approfondimenti clinicamente utili."
      },
      {
        "q": "Ogni quanto si controllano gli occhi?",
        "a": "La frequenza dipende da età, storia personale, condizioni oculari e percorso già seguito. L’oculista definisce l’intervallo appropriato, anche in assenza di nuovi disturbi."
      },
      {
        "q": "Quanto costa una visita oculistica a Napoli?",
        "a": "Contatta il team Cocoora per conoscere il costo della visita e le prestazioni comprese. Eventuali esami aggiuntivi vengono considerati separatamente rispetto alla consulenza."
      }
    ],
    "localSeo": {
      "title": "Visita oculistica a Napoli",
      "description": "Da Cocoora, a Napoli, la visita oculistica è dedicata alla funzione visiva e alla salute degli occhi. Il controllo specialistico parte dalla storia personale e dalle difficoltà riferite, per orientare le indicazioni e l’eventuale programma di monitoraggio.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "psicologia",
    "title": "Colloquio psicologico",
    "categoryName": "Specialistiche per la famiglia",
    "tagline": "Non serve avere già tutte le parole per iniziare. Il colloquio psicologico offre uno spazio di ascolto per comprendere difficoltà emotive, stress, cambiamenti e relazioni, dando forma insieme al professionista alla richiesta di sostegno.",
    "description": "Il colloquio psicologico è un incontro professionale dedicato alla comprensione di ciò che una persona sta vivendo. Attraverso l’ascolto e il confronto, lo psicologo aiuta a mettere a fuoco la richiesta, le difficoltà e le risorse su cui poter lavorare.\n\nSi può partire da un problema riconoscibile oppure dalla sensazione di attraversare un momento complesso. Il primo incontro non richiede un racconto perfettamente ordinato: il dialogo permette di individuare gli aspetti da approfondire.\n\nDa Cocoora la valutazione iniziale può orientare un percorso di sostegno o, quando più appropriato, un confronto con altri professionisti. Obiettivi e modalità vengono condivisi, senza proporre lo stesso percorso a ogni persona.",
    "heroImage": "/images/visite/psicologia-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/psicologia-napoli-1.jpg",
      "/images/visite/psicologia-napoli-2.jpg",
      "/images/visite/psicologia-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Psicologo a Napoli | Colloquio psicologico Cocoora",
      "metaDescription": "Colloqui psicologici a Napoli per difficoltà emotive, stress e cambiamenti personali. Scopri come iniziare un percorso di ascolto e sostegno da Cocoora.",
      "keywordMain": "psicologo Napoli.",
      "keywordSec": "colloquio psicologico Napoli; sostegno psicologico Napoli; primo colloquio psicologo Napoli; supporto psicologico stress Napoli; difficoltà relazionali."
    },
    "whatIs": {
      "title": "Che cos’è il colloquio psicologico e come funziona?",
      "description": "Il colloquio psicologico è un incontro professionale dedicato alla comprensione di ciò che una persona sta vivendo. Attraverso l’ascolto e il confronto, lo psicologo aiuta a mettere a fuoco la richiesta, le difficoltà e le risorse su cui poter lavorare.\n\nSi può partire da un problema riconoscibile oppure dalla sensazione di attraversare un momento complesso. Il primo incontro non richiede un racconto perfettamente ordinato: il dialogo permette di individuare gli aspetti da approfondire.\n\nDa Cocoora la valutazione iniziale può orientare un percorso di sostegno o, quando più appropriato, un confronto con altri professionisti. Obiettivi e modalità vengono condivisi, senza proporre lo stesso percorso a ogni persona.",
      "paragraphs": [
        "Il colloquio psicologico è un incontro professionale dedicato alla comprensione di ciò che una persona sta vivendo. Attraverso l’ascolto e il confronto, lo psicologo aiuta a mettere a fuoco la richiesta, le difficoltà e le risorse su cui poter lavorare.",
        "Si può partire da un problema riconoscibile oppure dalla sensazione di attraversare un momento complesso. Il primo incontro non richiede un racconto perfettamente ordinato: il dialogo permette di individuare gli aspetti da approfondire.",
        "Da Cocoora la valutazione iniziale può orientare un percorso di sostegno o, quando più appropriato, un confronto con altri professionisti. Obiettivi e modalità vengono condivisi, senza proporre lo stesso percorso a ogni persona."
      ],
      "image": "/images/visite/psicologia-napoli-2.jpg"
    },
    "problemsTitle": "Per quali esigenze si può chiedere un colloquio?",
    "problemsSubtitle": "Chiedere un confronto può essere un modo per dare attenzione a ciò che occupa spazio nella propria quotidianità. Il motivo dell’incontro non deve essere uguale a quello di qualcun altro.",
    "problemsGrid": [
      {
        "title": "Stress e difficoltà emotive",
        "description": "Quando gli impegni o le preoccupazioni diventano difficili da gestire, il colloquio permette di esplorare come vengono vissuti. Lo psicologo aiuta a riconoscere i contesti e i modi di reagire che meritano attenzione."
      },
      {
        "title": "Cambiamenti e passaggi personali",
        "description": "Un cambiamento nella vita, nel lavoro o negli equilibri quotidiani può richiedere un tempo di elaborazione. Il sostegno offre uno spazio per comprendere le emozioni e affrontare le domande che accompagnano questa fase."
      },
      {
        "title": "Difficoltà nelle relazioni",
        "description": "Il colloquio individuale può aiutare a riflettere sul modo di vivere i rapporti, comunicare i bisogni o affrontare i conflitti. L’attenzione è rivolta all’esperienza della persona e alle situazioni che desidera comprendere meglio."
      },
      {
        "title": "Orientamento verso il sostegno più adatto",
        "description": "Non sempre è chiaro quale aiuto cercare. La valutazione iniziale serve anche a definire la richiesta e a capire se proseguire con un sostegno psicologico o coinvolgere competenze diverse, in relazione a ciò che emerge."
      }
    ],
    "leadForm": {
      "title": "Il primo passo può essere una richiesta di informazioni",
      "subtitle": "Lascia i tuoi contatti per conoscere le modalità del colloquio psicologico. Non occorre raccontare dettagli personali nel form: potrai approfondirli direttamente con il professionista.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge il primo colloquio psicologico?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Accoglienza e racconto della richiesta",
        "description": "Lo psicologo presenta le modalità dell’incontro e lascia spazio a ciò che ti ha portato a chiedere un confronto. Puoi iniziare da un episodio, da una domanda o da una difficoltà attuale."
      },
      {
        "stepNumber": "02",
        "title": "Comprensione del contesto",
        "description": "Il dialogo approfondisce la storia e le situazioni rilevanti, senza fermarsi al singolo episodio. Si mettono a fuoco le esigenze e gli aspetti su cui può essere utile lavorare."
      },
      {
        "stepNumber": "03",
        "title": "Condivisione dei possibili passi successivi",
        "description": "Al termine viene discusso come proseguire. Se è indicato un percorso, si chiariscono finalità, organizzazione e frequenza degli incontri; in altri casi il colloquio può orientare verso un diverso tipo di supporto."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dal sostegno psicologico?",
      "description": "Il percorso può aiutare a comprendere meglio le proprie difficoltà, riconoscere risorse e individuare modalità più consapevoli di affrontare situazioni ed emozioni. Il primo incontro serve soprattutto a costruire una comprensione condivisa della richiesta.\n\nI cambiamenti vengono osservati rispetto agli obiettivi personali. Tempi e modalità si definiscono nel confronto con lo psicologo: il sostegno non è una sequenza di soluzioni preconfezionate, ma un lavoro costruito insieme.",
      "paragraphs": [
        "Il percorso può aiutare a comprendere meglio le proprie difficoltà, riconoscere risorse e individuare modalità più consapevoli di affrontare situazioni ed emozioni. Il primo incontro serve soprattutto a costruire una comprensione condivisa della richiesta.",
        "I cambiamenti vengono osservati rispetto agli obiettivi personali. Tempi e modalità si definiscono nel confronto con lo psicologo: il sostegno non è una sequenza di soluzioni preconfezionate, ma un lavoro costruito insieme."
      ],
      "image": "/images/visite/psicologia-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "Devo sapere esattamente quale problema voglio affrontare?",
        "a": "No. Puoi partire da ciò che stai vivendo o da una domanda ancora poco definita. Uno degli obiettivi del primo incontro è mettere a fuoco insieme la richiesta."
      },
      {
        "q": "Serve una diagnosi per chiedere un colloquio?",
        "a": "Si può chiedere un confronto anche per stress, cambiamenti o difficoltà relazionali, senza avere già una diagnosi. Lo psicologo valuta la richiesta e orienta i passi successivi."
      },
      {
        "q": "Come posso prepararmi al primo incontro?",
        "a": "Può essere utile pensare a ciò che ti ha spinto a cercare un confronto, ma non serve preparare un discorso. Se hai già seguito percorsi di supporto, potrai raccontarlo durante il colloquio."
      },
      {
        "q": "Quanti incontri sono necessari?",
        "a": "Il numero dipende dalla richiesta e dagli obiettivi concordati. La valutazione iniziale aiuta a comprendere quale percorso possa essere utile; l’andamento viene poi discusso con il professionista."
      },
      {
        "q": "Il primo colloquio comporta l’avvio di un percorso lungo?",
        "a": "Non automaticamente. Il primo incontro serve anche a orientarsi. La possibilità di proseguire e le modalità vengono condivise dopo aver approfondito la richiesta."
      },
      {
        "q": "Quanto costa un colloquio psicologico a Napoli?",
        "a": "Il team Cocoora può indicare costo e durata dell’appuntamento. L’eventuale frequenza degli incontri successivi viene concordata con lo psicologo, in relazione al percorso."
      }
    ],
    "localSeo": {
      "title": "Colloqui psicologici a Napoli",
      "description": "A Napoli, Cocoora propone colloqui psicologici dedicati all’ascolto e alla comprensione delle difficoltà emotive e relazionali. La valutazione iniziale aiuta a individuare il sostegno appropriato, con attenzione alla storia e alle esigenze della persona.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "medicina-dello-sport",
    "title": "Visita di medicina dello sport",
    "categoryName": "Specialistiche per la famiglia",
    "tagline": "L’attività fisica merita indicazioni coerenti con la propria salute. La visita di medicina dello sport mette in relazione condizioni personali, abitudini e pratica sportiva, per orientare il movimento e gli eventuali approfondimenti.",
    "description": "La visita di medicina dello sport valuta le condizioni di salute in relazione all’attività fisica e ai fattori di rischio individuali. Il confronto considera ciò che si pratica, con quale frequenza e quali obiettivi, insieme alla storia clinica.\n\nIl medico aiuta a comprendere come inserire il movimento nel contesto personale e se siano utili accertamenti mirati. La valutazione può riguardare chi è già attivo o chi desidera iniziare o riprendere una pratica sportiva.\n\nDa Cocoora, il percorso descritto è una valutazione specialistica. Eventuali richieste di certificazione seguono requisiti e percorsi specifici: il tipo di prestazione deve essere chiarito prima della prenotazione.",
    "heroImage": "/images/visite/medicina-dello-sport-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/medicina-dello-sport-napoli-1.jpg",
      "/images/visite/medicina-dello-sport-napoli-2.jpg",
      "/images/visite/medicina-dello-sport-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita di medicina dello sport a Napoli | Cocoora",
      "metaDescription": "Medicina dello sport a Napoli: valutazione della salute in relazione all’attività fisica, indicazioni individuali e orientamento del percorso da Cocoora.",
      "keywordMain": "medicina dello sport Napoli.",
      "keywordSec": "visita medico sportiva Napoli; medico dello sport Napoli; valutazione attività fisica Napoli; visita prima di riprendere sport."
    },
    "whatIs": {
      "title": "Che cos’è la visita di medicina dello sport?",
      "description": "La visita di medicina dello sport valuta le condizioni di salute in relazione all’attività fisica e ai fattori di rischio individuali. Il confronto considera ciò che si pratica, con quale frequenza e quali obiettivi, insieme alla storia clinica.\n\nIl medico aiuta a comprendere come inserire il movimento nel contesto personale e se siano utili accertamenti mirati. La valutazione può riguardare chi è già attivo o chi desidera iniziare o riprendere una pratica sportiva.\n\nDa Cocoora, il percorso descritto è una valutazione specialistica. Eventuali richieste di certificazione seguono requisiti e percorsi specifici: il tipo di prestazione deve essere chiarito prima della prenotazione.",
      "paragraphs": [
        "La visita di medicina dello sport valuta le condizioni di salute in relazione all’attività fisica e ai fattori di rischio individuali. Il confronto considera ciò che si pratica, con quale frequenza e quali obiettivi, insieme alla storia clinica.",
        "Il medico aiuta a comprendere come inserire il movimento nel contesto personale e se siano utili accertamenti mirati. La valutazione può riguardare chi è già attivo o chi desidera iniziare o riprendere una pratica sportiva.",
        "Da Cocoora, il percorso descritto è una valutazione specialistica. Eventuali richieste di certificazione seguono requisiti e percorsi specifici: il tipo di prestazione deve essere chiarito prima della prenotazione."
      ],
      "image": "/images/visite/medicina-dello-sport-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve una valutazione medico-sportiva?",
    "problemsSubtitle": "Non conta soltanto quale sport si svolge, ma anche la situazione da cui si parte. Il colloquio aiuta a collegare la richiesta alle esigenze di salute e al percorso appropriato.",
    "problemsGrid": [
      {
        "title": "Iniziare o riprendere attività fisica",
        "description": "Dopo un periodo di inattività, può essere utile confrontarsi sulle proprie condizioni e sull’attività che si desidera praticare. La visita permette di individuare gli aspetti da considerare prima di organizzare la ripresa."
      },
      {
        "title": "Valutare la salute nella pratica sportiva abituale",
        "description": "Chi si allena con regolarità può approfondire il rapporto tra attività svolta e stato di salute. Il medico considera caratteristiche della pratica, storia personale e documentazione disponibile per orientare i controlli utili."
      },
      {
        "title": "Considerare condizioni personali e fattori di rischio",
        "description": "Eventuali condizioni già diagnosticate e terapie fanno parte della valutazione. Le indicazioni sul movimento vengono inserite in questo contesto, con il possibile coinvolgimento di altre competenze quando necessario."
      },
      {
        "title": "Orientare la richiesta di accertamenti o certificazioni",
        "description": "Quando una società o un’organizzazione sportiva richiede documentazione, è importante chiarire esattamente la prestazione necessaria. Il confronto permette di distinguere una consulenza clinica da uno specifico percorso certificativo."
      }
    ],
    "leadForm": {
      "title": "Parliamo della tua attività fisica",
      "subtitle": "Contatta Cocoora indicando il motivo della richiesta e lo sport praticato. Il team ti aiuterà a verificare la prestazione e a organizzare l’appuntamento appropriato.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita di medicina dello sport?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Definire attività e motivo dell’appuntamento",
        "description": "Il medico raccoglie informazioni sulla pratica sportiva, sulla frequenza degli allenamenti e sugli obiettivi. Vengono considerate la storia clinica, le eventuali terapie e le ragioni della richiesta."
      },
      {
        "stepNumber": "02",
        "title": "Valutare il quadro di salute",
        "description": "La visita clinica e la documentazione disponibile permettono di individuare gli aspetti rilevanti rispetto all’attività fisica. Gli eventuali accertamenti vengono definiti in funzione del caso e del percorso richiesto."
      },
      {
        "stepNumber": "03",
        "title": "Condividere indicazioni e passaggi successivi",
        "description": "Lo specialista illustra le indicazioni pertinenti e chiarisce se proseguire con controlli o approfondimenti. Se la richiesta riguarda una certificazione, devono essere verificati separatamente i requisiti e la prestazione prevista."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dalla valutazione medico-sportiva?",
      "description": "L’incontro aiuta a comprendere il rapporto tra stato di salute e attività fisica, con indicazioni individuali e una direzione per gli eventuali controlli. L’obiettivo è orientare la pratica, non promettere un miglioramento automatico della prestazione sportiva.\n\nL’esito dipende dalla richiesta e dai riscontri clinici. Una visita di consulenza non coincide automaticamente con il rilascio di un certificato: questo aspetto viene chiarito in relazione al percorso effettivamente disponibile.",
      "paragraphs": [
        "L’incontro aiuta a comprendere il rapporto tra stato di salute e attività fisica, con indicazioni individuali e una direzione per gli eventuali controlli. L’obiettivo è orientare la pratica, non promettere un miglioramento automatico della prestazione sportiva.",
        "L’esito dipende dalla richiesta e dai riscontri clinici. Una visita di consulenza non coincide automaticamente con il rilascio di un certificato: questo aspetto viene chiarito in relazione al percorso effettivamente disponibile."
      ],
      "image": "/images/visite/medicina-dello-sport-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "La visita riguarda soltanto gli atleti agonisti?",
        "a": "La valutazione della salute in relazione all’attività fisica può riguardare esigenze diverse. Il tipo di percorso viene individuato in base alla pratica e al motivo della richiesta."
      },
      {
        "q": "Posso chiedere una valutazione prima di riprendere sport?",
        "a": "Sì, puoi confrontarti sulle condizioni di salute e sull’attività che desideri riprendere. Il medico valuta quali indicazioni e approfondimenti siano pertinenti."
      },
      {
        "q": "La visita comprende sempre un certificato sportivo?",
        "a": "Non automaticamente. Comunica la richiesta esatta prima di prenotare: Cocoora chiarirà se il percorso necessario è disponibile e quali passaggi prevede."
      },
      {
        "q": "Certificato agonistico e non agonistico sono la stessa richiesta?",
        "a": "Sono richieste differenti, con percorsi e requisiti specifici. È utile verificare con la propria organizzazione sportiva quale documentazione serva e comunicarla al momento della prenotazione."
      },
      {
        "q": "Che cosa devo portare alla visita?",
        "a": "Porta la documentazione clinica disponibile, gli esami precedenti e l’elenco delle terapie. Se esiste una richiesta della società sportiva, condividila in anticipo con il team."
      },
      {
        "q": "Quanto costa una visita di medicina dello sport a Napoli?",
        "a": "Il costo va riferito alla prestazione prenotata. Il team Cocoora può chiarire tariffa e contenuto dell’appuntamento, distinguendo la consulenza dagli eventuali accertamenti o percorsi certificativi."
      }
    ],
    "localSeo": {
      "title": "Medicina dello sport a Napoli",
      "description": "A Napoli, Cocoora propone una valutazione di medicina dello sport dedicata alla salute in relazione all’attività fisica. Il confronto specialistico considera la storia personale e la pratica svolta, per orientare indicazioni, approfondimenti e controlli.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "senologia",
    "title": "Visita senologica",
    "categoryName": "Diagnostica e prevenzione",
    "tagline": "Un controllo dedicato alla salute del seno, alle domande e ai cambiamenti da approfondire. La visita senologica collega storia personale, esame clinico e documentazione, per individuare gli eventuali accertamenti e programmare i controlli.",
    "description": "La visita senologica è una valutazione clinica della mammella. Consente di approfondire eventuali sintomi, alterazioni palpabili o risultati di controlli precedenti, mettendoli in relazione con la storia personale e familiare.\n\nIl medico ascolta il motivo dell’appuntamento, esamina la documentazione e valuta il seno attraverso l’osservazione e la palpazione. La visita aiuta a comprendere se siano sufficienti le informazioni disponibili o se occorrano altri accertamenti.\n\nIn Cocoora il percorso può comprendere un’ecografia mammaria eseguita dallo specialista, quando clinicamente indicata. Gli eventuali ulteriori esami vengono orientati secondo le esigenze emerse.",
    "heroImage": "/images/visite/senologia-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/senologia-napoli-1.jpg",
      "/images/visite/senologia-napoli-2.jpg",
      "/images/visite/senologia-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita senologica a Napoli | Cocoora",
      "metaDescription": "Visita senologica a Napoli per la salute del seno. Cocoora propone valutazione specialistica, ecografia mammaria quando indicata e orientamento dei controlli.",
      "keywordMain": "visita senologica Napoli.",
      "keywordSec": "senologo Napoli; ecografia mammaria Napoli; controllo seno Napoli; visita senologica con ecografia; valutazione nodulo mammario."
    },
    "whatIs": {
      "title": "Che cos’è la visita senologica e come funziona?",
      "description": "La visita senologica è una valutazione clinica della mammella. Consente di approfondire eventuali sintomi, alterazioni palpabili o risultati di controlli precedenti, mettendoli in relazione con la storia personale e familiare.\n\nIl medico ascolta il motivo dell’appuntamento, esamina la documentazione e valuta il seno attraverso l’osservazione e la palpazione. La visita aiuta a comprendere se siano sufficienti le informazioni disponibili o se occorrano altri accertamenti.\n\nIn Cocoora il percorso può comprendere un’ecografia mammaria eseguita dallo specialista, quando clinicamente indicata. Gli eventuali ulteriori esami vengono orientati secondo le esigenze emerse.",
      "paragraphs": [
        "La visita senologica è una valutazione clinica della mammella. Consente di approfondire eventuali sintomi, alterazioni palpabili o risultati di controlli precedenti, mettendoli in relazione con la storia personale e familiare.",
        "Il medico ascolta il motivo dell’appuntamento, esamina la documentazione e valuta il seno attraverso l’osservazione e la palpazione. La visita aiuta a comprendere se siano sufficienti le informazioni disponibili o se occorrano altri accertamenti.",
        "In Cocoora il percorso può comprendere un’ecografia mammaria eseguita dallo specialista, quando clinicamente indicata. Gli eventuali ulteriori esami vengono orientati secondo le esigenze emerse."
      ],
      "image": "/images/visite/senologia-napoli-2.jpg"
    },
    "problemsTitle": "Quando è utile una visita senologica?",
    "problemsSubtitle": "Il confronto può nascere da un cambiamento osservato, da un referto o dalla necessità di organizzare i controlli. Il punto di partenza orienta il percorso.",
    "problemsGrid": [
      {
        "title": "Valutazione della salute del seno",
        "description": "La visita consente di considerare la situazione mammaria insieme alla storia personale e familiare. Il medico chiarisce quali controlli siano pertinenti e come inserirli nel percorso individuale."
      },
      {
        "title": "Noduli e alterazioni palpabili",
        "description": "Una zona che appare diversa al tatto può richiedere una valutazione senologica. L’esame clinico e gli accertamenti eventualmente indicati aiutano a comprenderne le caratteristiche, senza trarre conclusioni dalla sola percezione del cambiamento."
      },
      {
        "title": "Dolore e altri cambiamenti del seno",
        "description": "Il medico approfondisce natura, durata e andamento dei sintomi, collegandoli alla visita. Raccontare quando compaiono e come si sono modificati aiuta a individuare gli aspetti da esaminare."
      },
      {
        "title": "Lettura dei referti e controlli successivi",
        "description": "La consulenza può servire a mettere in relazione esami già effettuati e quadro clinico. Il confronto con la documentazione precedente permette di orientare gli eventuali approfondimenti e la programmazione dei controlli."
      }
    ],
    "leadForm": {
      "title": "Organizza il tuo appuntamento senologico",
      "subtitle": "Lascia i tuoi contatti per ricevere informazioni sulla visita. Il team Cocoora ti aiuterà a preparare la documentazione e a chiarire le prestazioni previste nell’appuntamento.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita senologica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Ascolto e documentazione clinica",
        "description": "Il medico raccoglie il motivo della visita, la storia personale e familiare e le informazioni sulle terapie. Prende visione degli esami già svolti, considerando anche le eventuali immagini disponibili."
      },
      {
        "stepNumber": "02",
        "title": "Esame clinico della mammella",
        "description": "La valutazione comprende osservazione e palpazione delle mammelle. Quando indicata e organizzata nell’appuntamento, l’ecografia mammaria può aggiungere informazioni allo studio clinico."
      },
      {
        "stepNumber": "03",
        "title": "Orientamento di accertamenti e controlli",
        "description": "Lo specialista spiega ciò che è emerso e chiarisce se servano altri esami. Il programma successivo viene definito in base alla valutazione, collegando eventuali approfondimenti e monitoraggio."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dalla valutazione senologica?",
      "description": "La visita offre un inquadramento della richiesta e una direzione per i passaggi successivi. Può aiutare a comprendere un sintomo, interpretare un reperto o organizzare il controllo di una situazione già conosciuta.\n\nQuando sono necessari ulteriori accertamenti, il percorso diagnostico prosegue attraverso gli esami indicati. Visita ed ecografia vengono utilizzate per le informazioni che possono fornire, senza considerarle automaticamente sostitutive di ogni altro controllo.",
      "paragraphs": [
        "La visita offre un inquadramento della richiesta e una direzione per i passaggi successivi. Può aiutare a comprendere un sintomo, interpretare un reperto o organizzare il controllo di una situazione già conosciuta.",
        "Quando sono necessari ulteriori accertamenti, il percorso diagnostico prosegue attraverso gli esami indicati. Visita ed ecografia vengono utilizzate per le informazioni che possono fornire, senza considerarle automaticamente sostitutive di ogni altro controllo."
      ],
      "image": "/images/visite/senologia-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "Visita senologica ed ecografia mammaria sono la stessa cosa?",
        "a": "No. La visita è una valutazione clinica; l’ecografia è un esame che utilizza ultrasuoni. Possono essere integrate quando indicato, ma rispondono a funzioni differenti."
      },
      {
        "q": "Da Cocoora è possibile effettuare anche l’ecografia mammaria?",
        "a": "Il percorso può comprendere l’ecografia mammaria eseguita dallo specialista quando clinicamente indicata. Il team chiarisce come organizzare l’appuntamento e quali prestazioni sono previste."
      },
      {
        "q": "L’ecografia evita sempre la necessità di altri esami?",
        "a": "No. In base alla valutazione possono essere indicati altri accertamenti, tra cui la mammografia. Il medico spiega quali informazioni servono e come completare il percorso diagnostico."
      },
      {
        "q": "Che cosa devo portare alla visita?",
        "a": "Porta referti e immagini degli esami senologici precedenti, la documentazione di eventuali cure e l’elenco delle terapie. Il confronto nel tempo è utile alla valutazione."
      },
      {
        "q": "Ogni quanto va ripetuta una visita senologica?",
        "a": "L’intervallo viene definito in relazione alla storia personale, agli esami e alle indicazioni del percorso di prevenzione o cura. Lo specialista chiarisce quali controlli programmare e quando."
      },
      {
        "q": "Quanto costa una visita senologica a Napoli?",
        "a": "Il team Cocoora può comunicare il costo della visita e dell’eventuale ecografia, distinguendo le prestazioni. Al momento della prenotazione puoi chiarire cosa comprende l’appuntamento."
      }
    ],
    "localSeo": {
      "title": "Visita senologica a Napoli",
      "description": "Da Cocoora, a Napoli, la senologia è dedicata alla valutazione clinica del seno e all’orientamento degli accertamenti. La visita può essere integrata con ecografia mammaria quando indicata, con attenzione alla storia personale e alla continuità dei controlli.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  },
  {
    "slug": "oncologia",
    "title": "Visita oncologica",
    "categoryName": "Diagnostica e prevenzione",
    "tagline": "Comprendere i referti e avere una direzione per i passi successivi. La visita oncologica offre un confronto specialistico per valutare la situazione clinica, approfondire le domande e orientare gli accertamenti o i controlli in coordinamento con i centri di cura.",
    "description": "La visita oncologica è una valutazione specialistica rivolta a persone con una diagnosi oncologica o che necessitano di un inquadramento e di controlli successivi. L’oncologo mette in relazione la storia clinica, la documentazione e le condizioni attuali.\n\nIl colloquio aiuta a comprendere quali informazioni siano già disponibili e quali aspetti richiedano ulteriori accertamenti. Le domande della persona fanno parte dell’incontro, insieme all’esame dei referti e alla valutazione clinica.\n\nIn Cocoora la consulenza si inserisce in un percorso coordinato con i centri di cura. Lo scopo è dare continuità alle informazioni e orientare i passaggi pertinenti, nel rispetto del programma clinico seguito.",
    "heroImage": "/images/visite/oncologia-napoli-1.jpg",
    "galleryImages": [
      "/images/visite/oncologia-napoli-1.jpg",
      "/images/visite/oncologia-napoli-2.jpg",
      "/images/visite/oncologia-napoli-3.jpg"
    ],
    "heroCta": "Iscriviti gratuitamente al Cocoora Club",
    "seo": {
      "metaTitle": "Visita oncologica a Napoli | Cocoora",
      "metaDescription": "Visita oncologica a Napoli: valutazione della documentazione, confronto specialistico e orientamento dei controlli, in coordinamento con i centri di cura.",
      "keywordMain": "visita oncologica Napoli.",
      "keywordSec": "oncologo Napoli; consulenza oncologica Napoli; controllo oncologico Napoli; visita oncologica documenti; follow-up oncologico."
    },
    "whatIs": {
      "title": "Che cos’è la visita oncologica e come funziona?",
      "description": "La visita oncologica è una valutazione specialistica rivolta a persone con una diagnosi oncologica o che necessitano di un inquadramento e di controlli successivi. L’oncologo mette in relazione la storia clinica, la documentazione e le condizioni attuali.\n\nIl colloquio aiuta a comprendere quali informazioni siano già disponibili e quali aspetti richiedano ulteriori accertamenti. Le domande della persona fanno parte dell’incontro, insieme all’esame dei referti e alla valutazione clinica.\n\nIn Cocoora la consulenza si inserisce in un percorso coordinato con i centri di cura. Lo scopo è dare continuità alle informazioni e orientare i passaggi pertinenti, nel rispetto del programma clinico seguito.",
      "paragraphs": [
        "La visita oncologica è una valutazione specialistica rivolta a persone con una diagnosi oncologica o che necessitano di un inquadramento e di controlli successivi. L’oncologo mette in relazione la storia clinica, la documentazione e le condizioni attuali.",
        "Il colloquio aiuta a comprendere quali informazioni siano già disponibili e quali aspetti richiedano ulteriori accertamenti. Le domande della persona fanno parte dell’incontro, insieme all’esame dei referti e alla valutazione clinica.",
        "In Cocoora la consulenza si inserisce in un percorso coordinato con i centri di cura. Lo scopo è dare continuità alle informazioni e orientare i passaggi pertinenti, nel rispetto del programma clinico seguito."
      ],
      "image": "/images/visite/oncologia-napoli-2.jpg"
    },
    "problemsTitle": "Per quali esigenze si può richiedere una visita oncologica?",
    "problemsSubtitle": "Il motivo dell’appuntamento e la documentazione disponibile aiutano a preparare un confronto utile. La visita può collocarsi in momenti differenti del percorso.",
    "problemsGrid": [
      {
        "title": "Valutazione dopo una diagnosi oncologica",
        "description": "L’oncologo esamina gli elementi che hanno portato alla diagnosi e ricostruisce la situazione clinica. Il colloquio permette di chiarire il significato delle informazioni e quali aspetti siano ancora da approfondire."
      },
      {
        "title": "Approfondimento di una richiesta specialistica",
        "description": "Quando il medico che segue il caso indica un confronto oncologico, la visita aiuta a leggere i risultati degli esami nel contesto complessivo. Lo specialista valuta se siano necessari altri accertamenti per completare l’inquadramento."
      },
      {
        "title": "Controlli e follow-up",
        "description": "Le visite di controllo permettono di rivalutare il quadro clinico e la documentazione aggiornata. Modalità e tempi vengono collegati al programma del centro di cura, per mantenere coerenza tra i diversi passaggi."
      },
      {
        "title": "Chiarimento del percorso e delle priorità",
        "description": "Referti e appuntamenti possono sollevare domande su ciò che viene prima e su come proseguire. La consulenza offre un momento dedicato a riorganizzare le informazioni e a discutere gli aspetti da condividere con l’équipe di riferimento."
      }
    ],
    "leadForm": {
      "title": "Organizziamo il confronto con lo specialista",
      "subtitle": "Lascia i tuoi recapiti per ricevere informazioni sulla visita oncologica. Il team Cocoora ti aiuterà a preparare l’appuntamento; la documentazione clinica potrà essere condivisa secondo le modalità indicate.",
      "cta": "Richiedi ora"
    },
    "timelineTitle": "Come si svolge la visita oncologica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Ricostruzione della storia clinica",
        "description": "L’oncologo raccoglie le informazioni sulla salute e sui percorsi già effettuati. La lettura ordinata dei referti, delle immagini e delle relazioni dei centri di cura aiuta a ricostruire il quadro."
      },
      {
        "stepNumber": "02",
        "title": "Valutazione e confronto sulle domande",
        "description": "Il medico valuta le condizioni attuali e mette in relazione i dati disponibili. Durante l’incontro puoi approfondire i dubbi sulla documentazione e sugli obiettivi dei passaggi già programmati."
      },
      {
        "stepNumber": "03",
        "title": "Indicazioni in coordinamento con il centro di cura",
        "description": "La visita si conclude con indicazioni sugli eventuali approfondimenti e sui controlli. Il percorso viene orientato in coordinamento con i professionisti e i centri che seguono la situazione clinica."
      }
    ],
    "results": {
      "title": "Che cosa aspettarsi dal confronto oncologico?",
      "description": "Il valore della visita è una lettura specialistica della situazione e una maggiore chiarezza sulle priorità. Può contribuire a completare l’inquadramento, orientare accertamenti o dare continuità ai controlli.\n\nLe conclusioni dipendono dalle informazioni disponibili e dagli eventuali esami da completare. Il colloquio non promette esiti terapeutici: offre indicazioni cliniche da inserire nel percorso di cura individuale.",
      "paragraphs": [
        "Il valore della visita è una lettura specialistica della situazione e una maggiore chiarezza sulle priorità. Può contribuire a completare l’inquadramento, orientare accertamenti o dare continuità ai controlli.",
        "Le conclusioni dipendono dalle informazioni disponibili e dagli eventuali esami da completare. Il colloquio non promette esiti terapeutici: offre indicazioni cliniche da inserire nel percorso di cura individuale."
      ],
      "image": "/images/visite/oncologia-napoli-3.jpg"
    },
    "faq": [
      {
        "q": "Serve già una diagnosi per prenotare?",
        "a": "La visita può essere indicata anche quando il medico richiede un approfondimento oncologico sulla base di esami o valutazioni precedenti. Il motivo della richiesta va condiviso per organizzare il confronto appropriato."
      },
      {
        "q": "Quali documenti è utile portare?",
        "a": "Porta referti, immagini disponibili, eventuali esami istologici, lettere di dimissione o relazioni dei centri di cura e l’elenco delle terapie. Una documentazione ordinata per data facilita la ricostruzione del percorso."
      },
      {
        "q": "Posso chiedere di essere accompagnato?",
        "a": "Puoi segnalare questa esigenza quando prenoti. Il team chiarirà l’organizzazione dell’incontro, rispettando la tua volontà rispetto alla presenza di una persona di fiducia."
      },
      {
        "q": "La visita comprende terapie oncologiche in sede?",
        "a": "La prestazione descritta riguarda la consulenza e la valutazione specialistica. Le eventuali terapie rientrano nel programma definito con il centro di cura responsabile del percorso."
      },
      {
        "q": "Come si organizzano i controlli successivi?",
        "a": "I controlli vengono orientati dalla situazione clinica e dal programma seguito. È utile portare le indicazioni del centro di riferimento, così da coordinare gli appuntamenti e gli eventuali esami."
      },
      {
        "q": "Quanto costa una visita oncologica a Napoli?",
        "a": "Il team Cocoora può comunicare il costo della consulenza e le modalità dell’appuntamento. Gli eventuali ulteriori accertamenti vengono distinti dalla visita specialistica."
      }
    ],
    "localSeo": {
      "title": "Visita oncologica a Napoli",
      "description": "Cocoora propone a Napoli visite oncologiche dedicate alla valutazione clinica, alla lettura della documentazione e all’orientamento dei controlli. Il confronto specialistico si svolge in coordinamento con i centri di cura, per dare continuità al percorso della persona.",
      "cta": "Iscriviti gratuitamente al Cocoora Club"
    }
  }
];

export function getVisitaBySlug(slug: string): VisitaSpecialistica | undefined {
  return VISITE_SPECIALISTICHE.find((v) => v.slug === slug);
}
