import type { Treatment } from "./types";

/**
 * Alias slug legacy → slug canonico.
 * Garantisce che nessun link esistente (menu, medici, CMS, esterne) vada in 404.
 */
export const TREATMENT_SLUG_ALIASES: Record<string, string> = {
  "criolipolisi": "cryoliposculpt",
  "peeling-chimico": "peeling-chimico",
  "peeling-medicali": "peeling-chimico",
  "peeling-medicale": "peeling-chimico",
  "biostimolazione": "biorivitalizzazione",
  "biostimolatori": "acido-polilattico",
  "botox": "tossina-botulinica",
  "filler-viso": "filler-acido-ialuronico",
  "piattaforma-laser": "laser-luce-pulsata",
  "laser-e-luce-pulsata": "laser-luce-pulsata",
  "ultrasuoni-focalizzati-cfu": "ultrasuoni-cfu",
  "valutazione-lipedema-e-linfedema": "lipedema-linfedema",
  "allineatori-adulti": "invisalign-adulti",
  "allineatori-trasparenti-adulti": "invisalign-adulti",
  "allineatori-adolescenti": "invisalign-adolescenti",
  "allineatori-trasparenti-adolescenti": "invisalign-adolescenti",
  "ortodonzia-intercettiva-bambini": "invisalign-bambini",
  "ortodonzia-intercettiva": "invisalign-bambini"
};

export function resolveTreatmentSlug(slug: string): string {
  return TREATMENT_SLUG_ALIASES[slug] ?? slug;
}

export const MEDICINA_ESTETICA_TREATMENTS: Treatment[] = [
  {
    "slug": "filler-acido-ialuronico",
    "aliases": [
      "filler-viso"
    ],
    "title": "Filler viso con acido ialuronico",
    "category": "medicina-estetica",
    "categoryName": "Viso e rigenerazione",
    "tagline": "Il filler di acido ialuronico è un trattamento medico iniettivo impiegato per armonizzare alcuni volumi del viso e valorizzarne le proporzioni, dopo un’attenta valutazione anatomica.",
    "description": "Il filler di acido ialuronico è un trattamento medico iniettivo impiegato per armonizzare alcuni volumi del viso e valorizzarne le proporzioni, dopo un’attenta valutazione anatomica.",
    "heroImage": "/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/filler-viso-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/filler-viso-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Filler viso con acido ialuronico a Napoli | Cocoora",
      "metaDescription": "Filler viso con acido ialuronico a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci filler labbra e filler zigomi.",
      "keywordMain": "filler viso Napoli",
      "keywordSec": "filler labbra; filler zigomi; filler mento e mandibola; filler solchi nasogenieni"
    },
    "whatIs": {
      "title": "Che cos’è il trattamento filler viso con acido ialuronico e come funziona?",
      "description": "I filler a base di acido ialuronico sono gel iniettabili che il medico può utilizzare in aree selezionate del volto. Formulazione, quantità e piano di trattamento dipendono dall’anatomia individuale e dall’obiettivo concordato: non esiste uno schema adatto a tutti.\n\nIl filler a base di acido ialuronico è utilizzato in medicina estetica per intervenire su volumi e proporzioni del viso. La visita non consiste nel decidere una quantità di prodotto: si osservano anatomia, simmetrie, espressioni e qualità dei tessuti, per valutare se il trattamento sia appropriato e in quali aree.",
      "paragraphs": [
        "I filler a base di acido ialuronico sono gel iniettabili che il medico può utilizzare in aree selezionate del volto. Formulazione, quantità e piano di trattamento dipendono dall’anatomia individuale e dall’obiettivo concordato: non esiste uno schema adatto a tutti.",
        "Il filler a base di acido ialuronico è utilizzato in medicina estetica per intervenire su volumi e proporzioni del viso. La visita non consiste nel decidere una quantità di prodotto: si osservano anatomia, simmetrie, espressioni e qualità dei tessuti, per valutare se il trattamento sia appropriato e in quali aree."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/filler-viso-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve il filler viso con acido ialuronico?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Filler labbra",
        "description": "Il filler labbra con acido ialuronico permette di valorizzare volume, contorno e simmetria delle labbra, rispettandone la forma naturale e l’armonia del viso."
      },
      {
        "title": "Filler zigomi e solchi nasogeni",
        "description": "Il filler zigomi aiuta a valorizzare i volumi e le proporzioni del viso, mantenendo un aspetto naturale. Può lavorare anche sui solchi nasogeni, rendendo meno evidenti le pieghe tra naso e bocca."
      },
      {
        "title": "Filler occhiaie",
        "description": "Il filler per occhiaie è indicato a chi presenta nella zona perioculare svuotamenti, occhiaie scavate e deficit volumetrico."
      },
      {
        "title": "Filler Full Face",
        "description": "I nostri medici valuteranno proporzioni, volumi, simmetrie e segni dell’invecchiamento per proporre un percorso completamente personalizzato e orientato alla valorizzazione del viso."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di filler viso con acido ialuronico?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Analisi del volto",
        "description": "Il medico raccoglie l’anamnesi, osserva proporzioni, dinamica espressiva e caratteristiche dei tessuti e valuta eventuali controindicazioni. La valutazione serve a proporre un percorso completamente personalizzato che abbia come obiettivo quello di valorizzare il volto, correggendo piccole imperfezioni con un risultato 100% naturale."
      },
      {
        "stepNumber": "02",
        "title": "Trattamento mirato",
        "description": "Se indicato, esegue le iniezioni nelle aree concordate, con modalità e quantità definite durante la visita. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Indicazioni e controllo",
        "description": "Spiega quali reazioni transitorie possono comparire e fornisce indicazioni per il periodo successivo e gli eventuali controlli. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Analisi del volto",
        "description": "Il medico raccoglie l’anamnesi, osserva proporzioni, dinamica espressiva e caratteristiche dei tessuti e valuta eventuali controindicazioni. La valutazione serve a proporre un percorso completamente personalizzato che abbia come obiettivo quello di valorizzare il volto, correggendo piccole imperfezioni con un risultato 100% naturale."
      },
      {
        "title": "Trattamento mirato",
        "description": "Se indicato, esegue le iniezioni nelle aree concordate, con modalità e quantità definite durante la visita. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Indicazioni e controllo",
        "description": "Spiega quali reazioni transitorie possono comparire e fornisce indicazioni per il periodo successivo e gli eventuali controlli. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Filler viso con acido ialuronico: quali risultati aspettarsi?",
      "description": "L’effetto volumizzante può risultare visibile dopo il trattamento, ma il risultato va rivalutato dopo l’assestamento dei tessuti. Durata e risposta variano secondo prodotto, area e caratteristiche individuali.\n\nUn esito armonico dipende dalla proporzione rispetto ai lineamenti e non da un volume prefissato. La durata degli effetti è variabile e non si può stabilire per tutti un identico intervallo di mantenimento.\n\nOgni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo.",
      "paragraphs": [
        "L’effetto volumizzante può risultare visibile dopo il trattamento, ma il risultato va rivalutato dopo l’assestamento dei tessuti. Durata e risposta variano secondo prodotto, area e caratteristiche individuali.",
        "Un esito armonico dipende dalla proporzione rispetto ai lineamenti e non da un volume prefissato. La durata degli effetti è variabile e non si può stabilire per tutti un identico intervallo di mantenimento.",
        "Ogni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo."
      ],
      "image": "/images/trattamenti/medicina-estetica/filler-viso-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Il filler cambia l’espressività del volto?",
        "a": "L’obiettivo può essere un riequilibrio proporzionato. Naturalezza ed espressività dipendono da indicazione, quantità e tecnica: vengono valutate durante la visita."
      },
      {
        "q": "Quanto dura il filler viso?",
        "a": "La durata non è uguale per tutti: incidono formulazione, area trattata e risposta individuale."
      },
      {
        "q": "Dopo il trattamento possono comparire gonfiore o lividi?",
        "a": "Sì, possono manifestarsi reazioni locali temporanee. Il medico illustra rischi, segnali da monitorare e gestione post-trattamento."
      },
      {
        "q": "Il filler è adatto a chiunque?",
        "a": "No. È necessaria una valutazione medica per indicazioni, controindicazioni e alternative."
      }
    ],
    "localSeo": {
      "title": "Filler viso con acido ialuronico a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato ai filler viso con acido ialuronico. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative al filler viso con acido ialuronico. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "tossina-botulinica",
    "aliases": [
      "botox"
    ],
    "title": "Tossina botulinica per le rughe dinamiche",
    "category": "medicina-estetica",
    "categoryName": "Viso e rigenerazione",
    "tagline": "Un trattamento medico indicato in casi selezionati per attenuare le rughe legate alla contrazione dei muscoli mimici, preservando l’equilibrio dell’espressività.",
    "description": "Un trattamento medico indicato in casi selezionati per attenuare le rughe legate alla contrazione dei muscoli mimici, preservando l’equilibrio dell’espressività.",
    "heroImage": "/images/trattamenti/medicina-estetica/tossina-botulinica-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/tossina-botulinica-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/tossina-botulinica-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/tossina-botulinica-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Tossina botulinica per le rughe dinamiche a Napoli | Cocoora",
      "metaDescription": "Tossina botulinica per le rughe dinamiche a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci tossina botulinica per rughe de",
      "keywordMain": "tossina botulinica Napoli",
      "keywordSec": "tossina botulinica per rughe della fronte; tossina botulinica per rughe glabellari; tossina botulinica per zampe di gallina; rughe dinamiche e rughe statiche"
    },
    "whatIs": {
      "title": "Che cos’è il trattamento con tossina botulinica per le rughe e come funziona?",
      "description": "La tossina botulinica agisce temporaneamente sulla trasmissione del segnale tra nervo e muscolo nell’area in cui viene somministrata. Il medico definisce se e come intervenire in funzione della mimica, dell’anatomia e delle indicazioni autorizzate del prodotto utilizzato.\n\nLa tossina botulinica agisce riducendo temporaneamente l’attività di muscoli selezionati. Le rughe che compaiono durante l’espressione non sono identiche ai segni presenti a riposo: distinguerle è importante per impostare aspettative realistiche e decidere se il trattamento sia indicato.",
      "paragraphs": [
        "La tossina botulinica agisce temporaneamente sulla trasmissione del segnale tra nervo e muscolo nell’area in cui viene somministrata. Il medico definisce se e come intervenire in funzione della mimica, dell’anatomia e delle indicazioni autorizzate del prodotto utilizzato.",
        "La tossina botulinica agisce riducendo temporaneamente l’attività di muscoli selezionati. Le rughe che compaiono durante l’espressione non sono identiche ai segni presenti a riposo: distinguerle è importante per impostare aspettative realistiche e decidere se il trattamento sia indicato."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/tossina-botulinica-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la tossina botulinica per le rughe dinamiche?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Tossina botulinica per rughe della fronte",
        "description": "La tossina botulinica aiuta ad attenuare le rughe orizzontali della fronte, favorendo un aspetto più disteso e naturale."
      },
      {
        "title": "Tossina botulinica per rughe glabellari",
        "description": "La tossina botulinica aiuta ad attenuare le rughe tra le sopracciglia, rendendo l’espressione più distesa e naturale."
      },
      {
        "title": "Tossina botulinica per bruxismo",
        "description": "La tossina botulinica blocca temporaneamente gli impulsi nervosi al muscolo, riducendo la forza di contrazione e il sovraccarico."
      },
      {
        "title": "Tossina botulinica per iperidrosi",
        "description": "La tossina botulinica blocca il rilascio del neurotrasmettitore che stimola le ghiandole sudoripare. È efficace per mani, piedi e ascelle."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di tossina botulinica per le rughe?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Visita e mímica",
        "description": "L’effetto non compare immediatamente dopo le microiniezioni. Indicazioni post-seduta e tempi di controllo vengono comunicati dal medico; la durata della risposta cambia in base al caso clinico e al prodotto. Possibili effetti indesiderati sono spiegati prima della procedura."
      },
      {
        "stepNumber": "02",
        "title": "Somministrazione",
        "description": "Quando appropriato, esegue piccole iniezioni in punti selezionati in base ai muscoli coinvolti. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Valutazione successiva",
        "description": "Fornisce istruzioni dopo la seduta e chiarisce i tempi per osservare il risultato e per eventuali controlli. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Visita e mímica",
        "description": "L’effetto non compare immediatamente dopo le microiniezioni. Indicazioni post-seduta e tempi di controllo vengono comunicati dal medico; la durata della risposta cambia in base al caso clinico e al prodotto. Possibili effetti indesiderati sono spiegati prima della procedura."
      },
      {
        "title": "Somministrazione",
        "description": "Quando appropriato, esegue piccole iniezioni in punti selezionati in base ai muscoli coinvolti. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Valutazione successiva",
        "description": "Fornisce istruzioni dopo la seduta e chiarisce i tempi per osservare il risultato e per eventuali controlli. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Tossina botulinica per le rughe: quali risultati aspettarsi?",
      "description": "L’effetto non è immediato e si sviluppa progressivamente. Entità e durata dipendono dalla risposta individuale e dal trattamento effettuato; non è un risultato permanente.\n\nL’obiettivo non è annullare ogni movimento, ma definire insieme al professionista un risultato compatibile con le caratteristiche del volto. Le rughe statiche e la qualità generale della pelle possono richiedere valutazioni diverse.\n\nOgni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo.",
      "paragraphs": [
        "L’effetto non è immediato e si sviluppa progressivamente. Entità e durata dipendono dalla risposta individuale e dal trattamento effettuato; non è un risultato permanente.",
        "L’obiettivo non è annullare ogni movimento, ma definire insieme al professionista un risultato compatibile con le caratteristiche del volto. Le rughe statiche e la qualità generale della pelle possono richiedere valutazioni diverse.",
        "Ogni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo."
      ],
      "image": "/images/trattamenti/medicina-estetica/tossina-botulinica-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "La tossina botulinica elimina tutte le rughe?",
        "a": "No. Agisce soprattutto sulle rughe legate alla contrazione muscolare e non sostituisce i trattamenti per texture o perdita di volume."
      },
      {
        "q": "Quando si nota l’effetto?",
        "a": "Generalmente compare nei giorni successivi; il medico chiarisce i tempi attesi per il caso specifico."
      },
      {
        "q": "Il volto resta espressivo?",
        "a": "La pianificazione tiene conto della mimica personale, ma l’esito dipende dalla dose, dalla sede e dalla risposta del muscolo."
      },
      {
        "q": "Si può ripetere il trattamento?",
        "a": "L’eventuale ripetizione e i tempi vanno definiti dal medico, rispettando le indicazioni del prodotto e le necessità cliniche."
      }
    ],
    "localSeo": {
      "title": "Tossina botulinica per le rughe a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato alla tossina botulinica per le rughe dinamiche. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative al tossina botulinica per le rughe dinamiche. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "biorivitalizzazione",
    "aliases": [
      "biostimolazione"
    ],
    "title": "Biostimolazione della pelle",
    "category": "medicina-estetica",
    "categoryName": "Viso e rigenerazione",
    "tagline": "La biostimolazione è un trattamento medico che mira a sostenere i processi fisiologici della pelle, con attenzione alla luminosità, all'elasticità e alla qualità dei tessuti.",
    "description": "La biostimolazione è un trattamento medico che mira a sostenere i processi fisiologici della pelle, con attenzione alla luminosità, all'elasticità e alla qualità dei tessuti.",
    "heroImage": "/images/trattamenti/medicina-estetica/biostimolazione-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/biostimolazione-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/biostimolazione-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/biostimolazione-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Biostimolazione della pelle a Napoli | Cocoora",
      "metaDescription": "Biostimolazione della pelle a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci biostimolazione viso per qualità della pelle",
      "keywordMain": "biostimolazione Napoli",
      "keywordSec": "biostimolazione viso per qualità della pelle; biostimolazione per pelle disidratata e poco luminosa; biostimolazione collo e décolleté; biostimolazione o filler"
    },
    "whatIs": {
      "title": "Che cos’è la biostimolazione della pelle e come funziona?",
      "description": "La biostimolazione è un trattamento di medicina estetica che favorisce i naturali processi di rinnovamento della pelle, contribuendo a migliorarne idratazione, elasticità, luminosità e compattezza.\n\nA differenza dei filler, che intervengono principalmente sui volumi del viso, la biostimolazione si concentra sulla qualità dei tessuti cutanei, aiutando la pelle a mantenere un aspetto più fresco, uniforme e vitale. Il trattamento viene personalizzato dal medico in base alle caratteristiche della pelle, alle esigenze individuali e agli obiettivi desiderati.",
      "paragraphs": [
        "La biostimolazione è un trattamento di medicina estetica che favorisce i naturali processi di rinnovamento della pelle, contribuendo a migliorarne idratazione, elasticità, luminosità e compattezza.",
        "A differenza dei filler, che intervengono principalmente sui volumi del viso, la biostimolazione si concentra sulla qualità dei tessuti cutanei, aiutando la pelle a mantenere un aspetto più fresco, uniforme e vitale. Il trattamento viene personalizzato dal medico in base alle caratteristiche della pelle, alle esigenze individuali e agli obiettivi desiderati."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/biostimolazione-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la biostimolazione della pelle?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Biostimolazione per qualità della pelle",
        "description": "La biostimolazione aiuta a migliorare idratazione, elasticità e qualità della pelle, senza modificarne i volumi."
      },
      {
        "title": "Biostimolazione per pelle disidratata e poco luminosa",
        "description": "La biostimolazione può contribuire a migliorare la luminosità e l’elasticità della pelle, donandole un aspetto più fresco e vitale."
      },
      {
        "title": "Biostimolazione collo e décolleté",
        "description": "La biostimolazione può contribuire a migliorare idratazione, elasticità e compattezza della pelle di collo e décolleté, quando indicata dal medico."
      },
      {
        "title": "Biostimolazione o filler?",
        "description": "Il filler con acido ialuronico aiuta a ridefinire i volumi e i contorni del viso, mentre la biostimolazione migliora la qualità della pelle, favorendone idratazione, elasticità e luminosità."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di biostimolazione della pelle?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Inquadramento clinico",
        "description": "La tecnica dipende dalla formulazione e dal protocollo utilizzati nel centro: non è corretto attribuire a tutte le biostimolazioni lo stesso metodo, numero di sedute o tempo di recupero. Questi dettagli vengono definiti e spiegati in visita."
      },
      {
        "stepNumber": "02",
        "title": "Procedura selezionata",
        "description": "Il professionista applica il protocollo indicato dopo aver chiarito la formulazione, la tecnica e i possibili effetti locali. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Monitoraggio",
        "description": "Vengono osservati la risposta cutanea e l'andamento del percorso, con eventuali modifiche del piano. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Inquadramento clinico",
        "description": "La tecnica dipende dalla formulazione e dal protocollo utilizzati nel centro: non è corretto attribuire a tutte le biostimolazioni lo stesso metodo, numero di sedute o tempo di recupero. Questi dettagli vengono definiti e spiegati in visita."
      },
      {
        "title": "Procedura selezionata",
        "description": "Il professionista applica il protocollo indicato dopo aver chiarito la formulazione, la tecnica e i possibili effetti locali. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Monitoraggio",
        "description": "Vengono osservati la risposta cutanea e l'andamento del percorso, con eventuali modifiche del piano. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Biostimolazione: quali risultati aspettarsi?",
      "description": "La biostimolazione può contribuire a migliorare progressivamente la qualità della pelle, favorendo una maggiore idratazione, elasticità, luminosità e compattezza. Il risultato è una pelle dall’aspetto più fresco, uniforme e vitale, nel rispetto delle sue caratteristiche naturali.\n\nI miglioramenti si sviluppano gradualmente, seguendo i naturali processi di rinnovamento cutaneo. Tempi e risultati possono variare in base alle condizioni iniziali della pelle, alla metodica utilizzata e alla risposta individuale.\n\nDurante la visita specialistica, il medico definisce il percorso più adatto alle esigenze della persona, stabilendo il numero di sedute e gli eventuali controlli per valutare l’evoluzione dei risultati nel tempo.",
      "paragraphs": [
        "La biostimolazione può contribuire a migliorare progressivamente la qualità della pelle, favorendo una maggiore idratazione, elasticità, luminosità e compattezza. Il risultato è una pelle dall’aspetto più fresco, uniforme e vitale, nel rispetto delle sue caratteristiche naturali.",
        "I miglioramenti si sviluppano gradualmente, seguendo i naturali processi di rinnovamento cutaneo. Tempi e risultati possono variare in base alle condizioni iniziali della pelle, alla metodica utilizzata e alla risposta individuale.",
        "Durante la visita specialistica, il medico definisce il percorso più adatto alle esigenze della persona, stabilendo il numero di sedute e gli eventuali controlli per valutare l’evoluzione dei risultati nel tempo."
      ],
      "image": "/images/trattamenti/medicina-estetica/biostimolazione-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "La biostimolazione sostituisce il filler?",
        "a": "I due trattamenti hanno finalità differenti e non sono automaticamente intercambiabili."
      },
      {
        "q": "È un trattamento per le rughe profonde?",
        "a": "La finalità principale indicata è il sostegno alla qualità cutanea; per le rughe profonde serve una valutazione specifica."
      },
      {
        "q": "I risultati sono immediati?",
        "a": "I tempi dipendono dal protocollo e dalla risposta fisiologica dei tessuti."
      },
      {
        "q": "Serve una valutazione prima della seduta?",
        "a": "Sì, per verificare indicazioni, eventuali controindicazioni e scelta della procedura."
      }
    ],
    "localSeo": {
      "title": "Biostimolazione della pelle a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato a biostimolazione della pelle. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative al biostimolazione della pelle. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "biorigenerazione",
    "title": "Biorigenerazione",
    "category": "medicina-estetica",
    "categoryName": "Viso e rigenerazione",
    "tagline": "Un approccio di medicina estetica rigenerativa che punta a sostenere la vitalità e la qualità dei tessuti, con protocolli definiti a partire dalla valutazione medica.",
    "description": "Un approccio di medicina estetica rigenerativa che punta a sostenere la vitalità e la qualità dei tessuti, con protocolli definiti a partire dalla valutazione medica.",
    "heroImage": "/images/trattamenti/medicina-estetica/biorigenerazione-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/biorigenerazione-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/biorigenerazione-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/biorigenerazione-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Biorigenerazione dei tessuti a Napoli | Cocoora",
      "metaDescription": "Biorigenerazione dei tessuti a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci biorigenerazione viso e miglioramento dei te",
      "keywordMain": "biorigenerazione Napoli",
      "keywordSec": "biorigenerazione viso e miglioramento dei tessuti; biorigenerazione per elasticità e compattezza cutanea; biorigenerazione e pelle segnata dal tempo; biorigenerazione e biostimolazione"
    },
    "whatIs": {
      "title": "Che cos’è la  biorigenerazione e come funziona?",
      "description": "La biorigenerazione è un trattamento di medicina estetica che favorisce i naturali processi di rigenerazione della pelle, contribuendo a migliorare la qualità e la vitalità dei tessuti cutanei.\n\nL’obiettivo è sostenere il rinnovamento della pelle, aiutandola a ritrovare un aspetto più fresco, uniforme e luminoso. Il trattamento si inserisce in un percorso personalizzato, definito dal medico in base alle caratteristiche dei tessuti, alle esigenze individuali e ai risultati desiderati.\n\nLa biorigenerazione privilegia un approccio graduale, orientato a valorizzare la naturale bellezza della pelle e a preservarne la qualità nel tempo.",
      "paragraphs": [
        "La biorigenerazione è un trattamento di medicina estetica che favorisce i naturali processi di rigenerazione della pelle, contribuendo a migliorare la qualità e la vitalità dei tessuti cutanei.",
        "L’obiettivo è sostenere il rinnovamento della pelle, aiutandola a ritrovare un aspetto più fresco, uniforme e luminoso. Il trattamento si inserisce in un percorso personalizzato, definito dal medico in base alle caratteristiche dei tessuti, alle esigenze individuali e ai risultati desiderati.",
        "La biorigenerazione privilegia un approccio graduale, orientato a valorizzare la naturale bellezza della pelle e a preservarne la qualità nel tempo."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/biorigenerazione-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la biorigenerazione?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Biorigenerazione viso",
        "description": "La biorigenerazione sostiene i naturali processi di rigenerazione cutanea, contribuendo a migliorare la qualità e la vitalità della pelle."
      },
      {
        "title": "Biorigenerazione per elasticità e compattezza cutanea",
        "description": "La biorigenerazione può contribuire a migliorare l’elasticità e la compattezza della pelle, favorendo un aspetto più tonico e uniforme."
      },
      {
        "title": "Biorigenerazione per pelle segnata dal tempo",
        "description": "La biorigenerazione può contribuire a migliorare la texture e l’uniformità della pelle, valorizzandone la qualità e la naturale luminosità."
      },
      {
        "title": "Biorigenerazione o biostimolazione?",
        "description": "La biorigenerazione e la biostimolazione favoriscono entrambe il miglioramento della qualità della pelle, ma si distinguono per le metodiche utilizzate e gli specifici obiettivi del trattamento."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di biorigenerazione dei tessuti?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Visita specialistica",
        "description": "Materiali, tecnica e calendario non vanno dedotti dal nome commerciale del trattamento. Prima di iniziare vengono illustrate indicazioni, limiti, possibili reazioni e modalità di controllo secondo il protocollo definito dal professionista. Si definiscono bisogni, caratteristiche della cute e idoneità a una procedura rigenerativa. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Piano terapeutico",
        "description": "Viene selezionato il protocollo specifico e ne sono spiegati obiettivi, limiti e possibili reazioni. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Controllo dell’andamento",
        "description": "I cambiamenti vengono osservati nel tempo e il percorso è adattato alla risposta individuale. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Visita specialistica",
        "description": "Materiali, tecnica e calendario non vanno dedotti dal nome commerciale del trattamento. Prima di iniziare vengono illustrate indicazioni, limiti, possibili reazioni e modalità di controllo secondo il protocollo definito dal professionista. Si definiscono bisogni, caratteristiche della cute e idoneità a una procedura rigenerativa. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Piano terapeutico",
        "description": "Viene selezionato il protocollo specifico e ne sono spiegati obiettivi, limiti e possibili reazioni. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Controllo dell’andamento",
        "description": "I cambiamenti vengono osservati nel tempo e il percorso è adattato alla risposta individuale. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Biorigenerazione dei tessuti: quali risultati aspettarsi?",
      "description": "La biorigenerazione può contribuire a migliorare progressivamente la qualità della pelle, favorendo una maggiore elasticità, compattezza e uniformità dei tessuti. Il risultato è una pelle dall’aspetto più fresco, luminoso e vitale, nel rispetto delle sue caratteristiche naturali.\n\nI miglioramenti si sviluppano gradualmente, accompagnando i processi fisiologici di rinnovamento cutaneo. I tempi e l’entità dei risultati dipendono dalle condizioni iniziali della pelle, dalla metodologia utilizzata e dalla risposta individuale.\n\nDurante la visita specialistica, il medico definisce un percorso personalizzato, individuando le sedute più appropriate e gli eventuali controlli per valutare l’evoluzione dei risultati nel tempo.",
      "paragraphs": [
        "La biorigenerazione può contribuire a migliorare progressivamente la qualità della pelle, favorendo una maggiore elasticità, compattezza e uniformità dei tessuti. Il risultato è una pelle dall’aspetto più fresco, luminoso e vitale, nel rispetto delle sue caratteristiche naturali.",
        "I miglioramenti si sviluppano gradualmente, accompagnando i processi fisiologici di rinnovamento cutaneo. I tempi e l’entità dei risultati dipendono dalle condizioni iniziali della pelle, dalla metodologia utilizzata e dalla risposta individuale.",
        "Durante la visita specialistica, il medico definisce un percorso personalizzato, individuando le sedute più appropriate e gli eventuali controlli per valutare l’evoluzione dei risultati nel tempo."
      ],
      "image": "/images/trattamenti/medicina-estetica/biorigenerazione-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Che differenza c’è tra biorigenerazione e biostimolazione?",
        "a": "Sono termini vicini ma non necessariamente coincidenti: il protocollo effettivamente usato chiarisce il meccanismo e la finalità."
      },
      {
        "q": "La biorigenerazione è chirurgica?",
        "a": "La modalità dipende dalla specifica procedura proposta; Cocoora deve confermare il protocollo."
      },
      {
        "q": "Si possono trattare tutte le aree del corpo?",
        "a": "Le aree eleggibili si definiscono solo dopo la valutazione specialistica."
      },
      {
        "q": "Quanto tempo occorre per valutare il risultato?",
        "a": "I tempi non sono uniformi e dipendono dalla tecnica e dalla risposta dei tessuti."
      }
    ],
    "localSeo": {
      "title": "Biorigenerazione a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato alla biorigenerazione dei tessuti. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative alla biorigenerazione dei tessuti. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "acido-polilattico",
    "aliases": [
      "biostimolatori"
    ],
    "title": "Biostimolatori per il viso",
    "category": "medicina-estetica",
    "categoryName": "Viso e rigenerazione",
    "tagline": "Trattamenti medici iniettivi con sostanze biostimolanti, tra cui acido polilattico e idrossiapatite di calcio, impiegati in casi selezionati per sostenere la qualità e la struttura dei tessuti.",
    "description": "Trattamenti medici iniettivi con sostanze biostimolanti, tra cui acido polilattico e idrossiapatite di calcio, impiegati in casi selezionati per sostenere la qualità e la struttura dei tessuti.",
    "heroImage": "/images/trattamenti/medicina-estetica/biostimolatori-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/biostimolatori-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/biostimolatori-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/biostimolatori-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Biostimolatori per il viso a Napoli | Cocoora",
      "metaDescription": "Biostimolatori per il viso a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci biostimolatori a base di acido polilattico e b",
      "keywordMain": "biostimolatori Napoli",
      "keywordSec": "biostimolatori a base di acido polilattico; biostimolatori con idrossiapatite di calcio; biostimolatori per lassità cutanea lieve; biostimolatori e filler"
    },
    "whatIs": {
      "title": "Che cos’è il trattamento con biostimolatori per il viso e come funziona?",
      "description": "I biostimolatori possono favorire progressivamente la produzione di collagene e il sostegno dei tessuti. Cocoora cita acido polilattico e idrossiapatite di calcio: prodotti diversi per caratteristiche e indicazioni, da scegliere solo dopo la valutazione anatomica e clinica. Non sono equivalenti a un filler volumizzante tradizionale.\n\nI biostimolatori descritti dal medico comprendono sostanze come acido polilattico e idrossiapatite di calcio. Vengono considerati in protocolli mirati al sostegno dei tessuti e alla stimolazione della produzione di collagene, con risultati che possono svilupparsi progressivamente.",
      "paragraphs": [
        "I biostimolatori possono favorire progressivamente la produzione di collagene e il sostegno dei tessuti. Cocoora cita acido polilattico e idrossiapatite di calcio: prodotti diversi per caratteristiche e indicazioni, da scegliere solo dopo la valutazione anatomica e clinica. Non sono equivalenti a un filler volumizzante tradizionale.",
        "I biostimolatori descritti dal medico comprendono sostanze come acido polilattico e idrossiapatite di calcio. Vengono considerati in protocolli mirati al sostegno dei tessuti e alla stimolazione della produzione di collagene, con risultati che possono svilupparsi progressivamente."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/biostimolatori-napoli-2.jpg"
    },
    "problemsTitle": "A cosa servono i biostimolatori per il viso?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Biostimolatori a base di acido polilattico",
        "description": "L’acido polilattico stimola la produzione di collagene, contribuendo a migliorare il sostegno e la compattezza dei tessuti."
      },
      {
        "title": "Biostimolatori con idrossiapatite di calcio",
        "description": "L’idrossiapatite di calcio stimola la produzione di collagene, contribuendo a migliorare la compattezza e il sostegno dei tessuti."
      },
      {
        "title": "Biostimolatori per lassità cutanea lieve",
        "description": "I biostimolatori possono contribuire a migliorare la compattezza e il sostegno dei tessuti, attenuando progressivamente i segni della lassità cutanea."
      },
      {
        "title": "Biostimolatori o filler?",
        "description": "Il filler ridefinisce i volumi del viso, mentre i biostimolatori favoriscono la produzione di collagene, migliorando progressivamente compattezza e qualità dei tessuti."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di biostimolatori per il viso?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Esame medico",
        "description": "Poiché si tratta di procedure mediche, il consenso informato deve descrivere reazioni locali ed eventi avversi possibili. Il professionista stabilisce il piano di trattamento e i tempi di rivalutazione senza promettere un cambiamento identico per ogni persona. La visita considera anamnesi, caratteristiche anatomiche, qualità della cute, indicazioni e controindicazioni. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Scelta del prodotto e trattamento",
        "description": "Il medico seleziona formulazione, area, tecnica e quantità, spiegando differenze, rischi e benefici potenziali. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Controllo e follow-up",
        "description": "Si ricevono indicazioni per il post-trattamento e si programmano eventuali controlli per valutare la risposta progressiva. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Esame medico",
        "description": "Poiché si tratta di procedure mediche, il consenso informato deve descrivere reazioni locali ed eventi avversi possibili. Il professionista stabilisce il piano di trattamento e i tempi di rivalutazione senza promettere un cambiamento identico per ogni persona. La visita considera anamnesi, caratteristiche anatomiche, qualità della cute, indicazioni e controindicazioni. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Scelta del prodotto e trattamento",
        "description": "Il medico seleziona formulazione, area, tecnica e quantità, spiegando differenze, rischi e benefici potenziali. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Controllo e follow-up",
        "description": "Si ricevono indicazioni per il post-trattamento e si programmano eventuali controlli per valutare la risposta progressiva. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Biostimolatori per il viso: quali risultati aspettarsi?",
      "description": "I biostimolatori favoriscono la naturale produzione di collagene, contribuendo a migliorare progressivamente la compattezza, l’elasticità e il sostegno dei tessuti. Il risultato è una pelle dall’aspetto più tonico, uniforme e distesa, con un miglioramento graduale della lassità cutanea.\n\nA differenza dei filler volumizzanti, i biostimolatori agiscono nel tempo, accompagnando i naturali processi di rimodellamento dei tessuti. I primi miglioramenti possono diventare visibili nelle settimane successive al trattamento, con tempi e risultati che variano in base al prodotto utilizzato e alla risposta individuale.\n\nDurante la visita specialistica, il medico definisce un percorso personalizzato, valutando le caratteristiche della pelle, gli obiettivi desiderati e il numero di sedute più appropriato per ottenere un risultato armonioso e naturale.",
      "paragraphs": [
        "I biostimolatori favoriscono la naturale produzione di collagene, contribuendo a migliorare progressivamente la compattezza, l’elasticità e il sostegno dei tessuti. Il risultato è una pelle dall’aspetto più tonico, uniforme e distesa, con un miglioramento graduale della lassità cutanea.",
        "A differenza dei filler volumizzanti, i biostimolatori agiscono nel tempo, accompagnando i naturali processi di rimodellamento dei tessuti. I primi miglioramenti possono diventare visibili nelle settimane successive al trattamento, con tempi e risultati che variano in base al prodotto utilizzato e alla risposta individuale.",
        "Durante la visita specialistica, il medico definisce un percorso personalizzato, valutando le caratteristiche della pelle, gli obiettivi desiderati e il numero di sedute più appropriato per ottenere un risultato armonioso e naturale."
      ],
      "image": "/images/trattamenti/medicina-estetica/biostimolatori-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Che differenza c’è tra biostimolatori e filler?",
        "a": "I biostimolatori sono utilizzati soprattutto per sostenere processi di rimodellamento dei tessuti; i filler di acido ialuronico possono essere scelti anche per armonizzare volumi e contorni."
      },
      {
        "q": "Quali sostanze vengono impiegate?",
        "a": "I trattamenti con biostimolatori possono prevedere l’utilizzo di acido polilattico o idrossiapatite di calcio, selezionati dal medico in base alle caratteristiche della pelle e agli obiettivi del trattamento."
      },
      {
        "q": "I risultati dei biostimolatori sono immediati?",
        "a": "L’effetto sul rimodellamento del collagene è generalmente progressivo; la risposta varia da persona a persona."
      },
      {
        "q": "Sono adatti a tutte le zone del viso?",
        "a": "No. Le aree di applicazione sono determinate dalla valutazione medica e dalle caratteristiche del prodotto."
      }
    ],
    "localSeo": {
      "title": "Biostimolatori per il viso a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato a biostimolatori per il viso. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative ai biostimolatori per il viso. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "peeling-chimico",
    "aliases": [
      "peeling-medicali",
      "peeling-medicale"
    ],
    "title": "Peeling chimico medicale",
    "category": "medicina-estetica",
    "categoryName": "Viso e rigenerazione",
    "tagline": "Un trattamento esfoliante eseguito in ambito medico per intervenire su texture, discromie e alcune imperfezioni cutanee, secondo la formulazione scelta dallo specialista.",
    "description": "Un trattamento esfoliante eseguito in ambito medico per intervenire su texture, discromie e alcune imperfezioni cutanee, secondo la formulazione scelta dallo specialista.",
    "heroImage": "/images/trattamenti/medicina-estetica/peeling-chimico-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/peeling-chimico-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/peeling-chimico-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/peeling-chimico-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Peeling chimico medicale a Napoli | Cocoora",
      "metaDescription": "Peeling chimico a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci peeling chimico per macchie e discromie e peeling chimico",
      "keywordMain": "peeling chimico Napoli",
      "keywordSec": "peeling chimico per macchie e discromie; peeling chimico per acne e imperfezioni; peeling chimico per pelle spenta e texture irregolare; peeling chimico per rughe sottili e fotoinvecchiamento"
    },
    "whatIs": {
      "title": "Che cos’è il trattamento peeling chimico e come funziona?",
      "description": "Il peeling medicale utilizza agenti esfolianti selezionati in base a fototipo, sensibilità, storia clinica e obiettivo. L’azione interessa strati cutanei diversi a seconda del tipo e della profondità del peeling; per questo la preparazione e il recupero non sono uguali per tutti.\n\nLa scelta non dipende soltanto dall’inestetismo visibile: il medico considera la barriera cutanea, l’eventuale tendenza alle macchie post-infiammatorie, le terapie in corso e la sensibilità individuale. Un peeling superficiale non ha lo stesso obiettivo né gli stessi tempi di recupero di uno più intenso. Per questo non esiste un’unica formulazione adatta a tutte le pelli.",
      "paragraphs": [
        "Il peeling medicale utilizza agenti esfolianti selezionati in base a fototipo, sensibilità, storia clinica e obiettivo. L’azione interessa strati cutanei diversi a seconda del tipo e della profondità del peeling; per questo la preparazione e il recupero non sono uguali per tutti.",
        "La scelta non dipende soltanto dall’inestetismo visibile: il medico considera la barriera cutanea, l’eventuale tendenza alle macchie post-infiammatorie, le terapie in corso e la sensibilità individuale. Un peeling superficiale non ha lo stesso obiettivo né gli stessi tempi di recupero di uno più intenso. Per questo non esiste un’unica formulazione adatta a tutte le pelli."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/peeling-chimico-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve il peeling chimico?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Peeling chimico medicale per macchie e discromie",
        "description": "Il peeling medicale può contribuire ad attenuare macchie e discromie, migliorando l’uniformità del colorito con trattamenti specifici per ogni esigenza."
      },
      {
        "title": "Peeling chimico medicale per acne e imperfezioni",
        "description": "Il peeling medicale può contribuire a ridurre comedoni e imperfezioni legate all’acne, migliorando la texture e l’uniformità della pelle."
      },
      {
        "title": "Peeling chimico medicale per pelle spenta e texture irregolare",
        "description": "Il peeling medicale favorisce il rinnovamento superficiale della pelle, migliorandone la texture e rendendola più liscia e uniforme."
      },
      {
        "title": "Peeling medicale per rughe sottili e fotoinvecchiamento",
        "description": "Il peeling medicale può contribuire ad attenuare rughe sottili e segni del fotoinvecchiamento, rendendo la pelle più levigata e il colorito uniforme."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di peeling chimico?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Esame della pelle",
        "description": "Il medico illustra cosa si può avvertire durante l’applicazione, come pizzicore o calore, e quando contattare lo studio in caso di reazioni inattese. La frequenza delle sedute non è standard: dipende dal prodotto selezionato e dalla risposta della pelle. Il medico valuta fototipo, sensibilità, eventuali farmaci e controindicazioni e sceglie l’agente esfoliante. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Applicazione controllata",
        "description": "La soluzione viene applicata secondo tempi e modalità stabiliti in base al peeling prescritto. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Cura post-procedura",
        "description": "Si ricevono istruzioni per la detergenza, la protezione dal sole e la gestione dell’eventuale desquamazione. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Esame della pelle",
        "description": "Il medico illustra cosa si può avvertire durante l’applicazione, come pizzicore o calore, e quando contattare lo studio in caso di reazioni inattese. La frequenza delle sedute non è standard: dipende dal prodotto selezionato e dalla risposta della pelle. Il medico valuta fototipo, sensibilità, eventuali farmaci e controindicazioni e sceglie l’agente esfoliante. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Applicazione controllata",
        "description": "La soluzione viene applicata secondo tempi e modalità stabiliti in base al peeling prescritto. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Cura post-procedura",
        "description": "Si ricevono istruzioni per la detergenza, la protezione dal sole e la gestione dell’eventuale desquamazione. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Peeling chimico medicale: quali risultati aspettarsi?",
      "description": "Il peeling medicale favorisce il rinnovamento cutaneo, contribuendo a migliorare la luminosità, la texture e l’uniformità della pelle. Il trattamento può aiutare ad attenuare macchie superficiali, imperfezioni e rughe sottili, donando al viso un aspetto più fresco, levigato e uniforme.\n\nI miglioramenti si sviluppano gradualmente, seguendo i naturali tempi di rinnovamento della pelle. In base alla tipologia e all’intensità del peeling, possono verificarsi rossore e una leggera desquamazione nei giorni successivi, parte del processo di recupero cutaneo.\n\nDurante la visita specialistica, il medico seleziona il peeling più indicato in base alle caratteristiche della pelle e agli obiettivi del trattamento, definendo le eventuali sedute successive e le indicazioni per preservare i risultati nel tempo, inclusa un’adeguata protezione solare.",
      "paragraphs": [
        "Il peeling medicale favorisce il rinnovamento cutaneo, contribuendo a migliorare la luminosità, la texture e l’uniformità della pelle. Il trattamento può aiutare ad attenuare macchie superficiali, imperfezioni e rughe sottili, donando al viso un aspetto più fresco, levigato e uniforme.",
        "I miglioramenti si sviluppano gradualmente, seguendo i naturali tempi di rinnovamento della pelle. In base alla tipologia e all’intensità del peeling, possono verificarsi rossore e una leggera desquamazione nei giorni successivi, parte del processo di recupero cutaneo.",
        "Durante la visita specialistica, il medico seleziona il peeling più indicato in base alle caratteristiche della pelle e agli obiettivi del trattamento, definendo le eventuali sedute successive e le indicazioni per preservare i risultati nel tempo, inclusa un’adeguata protezione solare."
      ],
      "image": "/images/trattamenti/medicina-estetica/peeling-chimico-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Il peeling medicale provoca desquamazione?",
        "a": "Può accadere, ma l'intensità e la durata cambiano in funzione della formulazione e della pelle."
      },
      {
        "q": "Si può fare il peeling in estate?",
        "a": "Dipende dal tipo di peeling, dal fototipo e dall’esposizione solare prevista: il medico valuta il momento più adatto."
      },
      {
        "q": "Il peeling elimina tutte le macchie?",
        "a": "No. La natura delle discromie va identificata prima di scegliere un trattamento e non tutte rispondono allo stesso modo."
      },
      {
        "q": "Qual è la differenza tra peeling e PRX?",
        "a": "PRX indica uno specifico protocollo di trattamento cutaneo; il peeling medicale comprende formulazioni e profondità diverse."
      }
    ],
    "localSeo": {
      "title": "Peeling medicale a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato a peeling chimico. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative al peeling chimico. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "prx",
    "title": "PRX",
    "category": "medicina-estetica",
    "categoryName": "Viso e rigenerazione",
    "tagline": "Il PRX è un protocollo medico di trattamento cutaneo senza aghi, proposto da Cocoora per lavorare su luminosità, texture e compattezza della pelle.",
    "description": "Il PRX è un protocollo medico di trattamento cutaneo senza aghi, proposto da Cocoora per lavorare su luminosità, texture e compattezza della pelle.",
    "heroImage": "/images/trattamenti/medicina-estetica/prx-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/prx-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/prx-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/prx-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Trattamento PRX a Napoli | Cocoora",
      "metaDescription": "Trattamento PRX a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci prx per pelle spenta e luminosità del viso e prx per text",
      "keywordMain": "PRX Napoli",
      "keywordSec": "prx per pelle spenta e luminosità del viso; prx per texture irregolare della pelle; prx per compattezza e qualità cutanea; prx e peeling chimico"
    },
    "whatIs": {
      "title": "Che cos’è il PRX e come funziona?",
      "description": "Il PRX è un trattamento di biostimolazione cutanea senza aghi che contribuisce a migliorare la luminosità, la compattezza e la qualità della pelle, favorendo un aspetto più fresco, levigato e uniforme.\n\nA differenza dei peeling tradizionali, il PRX è pensato per stimolare il rinnovamento cutaneo senza un’esfoliazione superficiale marcata. Il trattamento prevede l’applicazione di una formulazione specifica sulla pelle, attraverso un protocollo medico personalizzato in base alle caratteristiche cutanee e agli obiettivi desiderati.\n\nPuò essere inserito in percorsi dedicati al miglioramento della texture, dell’elasticità e dei primi segni dell’invecchiamento cutaneo, valorizzando la naturale qualità della pelle.",
      "paragraphs": [
        "Il PRX è un trattamento di biostimolazione cutanea senza aghi che contribuisce a migliorare la luminosità, la compattezza e la qualità della pelle, favorendo un aspetto più fresco, levigato e uniforme.",
        "A differenza dei peeling tradizionali, il PRX è pensato per stimolare il rinnovamento cutaneo senza un’esfoliazione superficiale marcata. Il trattamento prevede l’applicazione di una formulazione specifica sulla pelle, attraverso un protocollo medico personalizzato in base alle caratteristiche cutanee e agli obiettivi desiderati.",
        "Può essere inserito in percorsi dedicati al miglioramento della texture, dell’elasticità e dei primi segni dell’invecchiamento cutaneo, valorizzando la naturale qualità della pelle."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/prx-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve il PRX?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "PRX per pelle spenta e luminosità del viso",
        "description": "Il PRX è un trattamento di biostimolazione senza aghi che aiuta a migliorare luminosità, texture e compattezza della pelle, rendendo il viso più uniforme e levigato."
      },
      {
        "title": "PRX per texture irregolare della pelle",
        "description": "Il PRX può contribuire a migliorare la texture della pelle, rendendola più liscia e uniforme e attenuando le irregolarità superficiali."
      },
      {
        "title": "PRX per compattezza e qualità cutanea",
        "description": "Il PRX può contribuire a migliorare la compattezza e l’elasticità della pelle, favorendo un aspetto più tonico e disteso."
      },
      {
        "title": "PRX o peeling chimico?",
        "description": "Il PRX favorisce la biostimolazione cutanea senza aghi, mentre i peeling medicali agiscono attraverso un’esfoliazione controllata della pelle, con intensità variabile in base al trattamento."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di PRX?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Controllo preliminare",
        "description": "La procedura pratica e le precauzioni successive dipendono dal prodotto e dal protocollo effettivamente in uso nel centro. Per questo il sito non deve dichiarare assenza assoluta di fastidio, desquamazione o recupero senza una conferma clinica. Vengono valutati l'anamnesi, eventuali irritazioni e condizioni che possono rendere il protocollo non adatto. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Applicazione del protocollo",
        "description": "Il medico esegue il trattamento senza aghi secondo le istruzioni del prodotto selezionato. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Istruzioni successive",
        "description": "Sono spiegati eventuali effetti transitori, skincare appropriata e fotoprotezione. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Controllo preliminare",
        "description": "La procedura pratica e le precauzioni successive dipendono dal prodotto e dal protocollo effettivamente in uso nel centro. Per questo il sito non deve dichiarare assenza assoluta di fastidio, desquamazione o recupero senza una conferma clinica. Vengono valutati l'anamnesi, eventuali irritazioni e condizioni che possono rendere il protocollo non adatto. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Applicazione del protocollo",
        "description": "Il medico esegue il trattamento senza aghi secondo le istruzioni del prodotto selezionato. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Istruzioni successive",
        "description": "Sono spiegati eventuali effetti transitori, skincare appropriata e fotoprotezione. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "PRX: quali risultati aspettarsi?",
      "description": "Il PRX contribuisce a migliorare la luminosità, la compattezza e l’uniformità della pelle, favorendo un aspetto più fresco, levigato e vitale. Il trattamento può aiutare ad attenuare le irregolarità superficiali e a valorizzare la naturale qualità dei tessuti cutanei.\n\nI miglioramenti possono essere apprezzabili progressivamente, con tempi e risultati che dipendono dalle caratteristiche iniziali della pelle e dalla risposta individuale. Il PRX si inserisce in un percorso di biostimolazione orientato a migliorare la qualità cutanea senza ricorrere a trattamenti iniettivi.\n\nDurante la visita specialistica, il medico valuta le esigenze della pelle e definisce un protocollo personalizzato, stabilendo il numero di sedute e gli eventuali controlli per accompagnare e mantenere i risultati nel tempo.",
      "paragraphs": [
        "Il PRX contribuisce a migliorare la luminosità, la compattezza e l’uniformità della pelle, favorendo un aspetto più fresco, levigato e vitale. Il trattamento può aiutare ad attenuare le irregolarità superficiali e a valorizzare la naturale qualità dei tessuti cutanei.",
        "I miglioramenti possono essere apprezzabili progressivamente, con tempi e risultati che dipendono dalle caratteristiche iniziali della pelle e dalla risposta individuale. Il PRX si inserisce in un percorso di biostimolazione orientato a migliorare la qualità cutanea senza ricorrere a trattamenti iniettivi.",
        "Durante la visita specialistica, il medico valuta le esigenze della pelle e definisce un protocollo personalizzato, stabilendo il numero di sedute e gli eventuali controlli per accompagnare e mantenere i risultati nel tempo."
      ],
      "image": "/images/trattamenti/medicina-estetica/prx-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "PRX richiede iniezioni?",
        "a": "Il PRX è un trattamento di biostimolazione cutanea senza aghi, che prevede l’applicazione di una formulazione specifica direttamente sulla pelle."
      },
      {
        "q": "PRX e peeling sono equivalenti?",
        "a": "No. PRX identifica un protocollo preciso, mentre “peeling medicale” è una categoria più ampia."
      },
      {
        "q": "Sono previste più sedute?",
        "a": "La frequenza dipende dalla valutazione medica e dalle indicazioni del prodotto utilizzato."
      },
      {
        "q": "Il PRX è adatto alla pelle sensibile?",
        "a": "L’idoneità va verificata caso per caso, considerando integrità cutanea, sensibilità e controindicazioni."
      }
    ],
    "localSeo": {
      "title": "Trattamento PRX a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato al trattamento PRX. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative al trattamento prx. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "cryoliposculpt",
    "aliases": [
      "criolipolisi"
    ],
    "title": "Criolipolisi per adiposità localizzate",
    "category": "medicina-estetica",
    "categoryName": "Corpo e silhouette",
    "tagline": "Una tecnologia non invasiva rivolta al trattamento di accumuli adiposi localizzati in aree selezionate, dopo un inquadramento medico della silhouette e dei tessuti.",
    "description": "Una tecnologia non invasiva rivolta al trattamento di accumuli adiposi localizzati in aree selezionate, dopo un inquadramento medico della silhouette e dei tessuti.",
    "heroImage": "/images/trattamenti/medicina-estetica/criolipolisi-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/criolipolisi-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/criolipolisi-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/criolipolisi-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Criolipolisi per adiposità localizzate a Napoli | Cocoora",
      "metaDescription": "Criolipolisi per adiposità localizzate a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci criolipolisi addome per adiposità",
      "keywordMain": "criolipolisi Napoli",
      "keywordSec": "criolipolisi addome per adiposità localizzata; criolipolisi fianchi e profilo corporeo; criolipolisi cosce e culotte de cheval; criolipolisi e dimagrimento"
    },
    "whatIs": {
      "title": "Che cos’è la criolipolisi per adiposità localizzate e come funziona?",
      "description": "La criolipolisi è un trattamento di medicina estetica non invasivo che utilizza il freddo controllato per agire sugli accumuli di grasso localizzato, contribuendo a rimodellare il profilo corporeo senza ricorrere alla chirurgia.\n\nAttraverso la tecnologia Cryoliposculpt, il trattamento agisce sulle cellule adipose dell’area selezionata, favorendone la progressiva eliminazione attraverso i naturali processi dell’organismo.\n\nLa criolipolisi può essere indicata per intervenire su zone come addome, fianchi e cosce, con un percorso personalizzato definito dal medico in base alla distribuzione del tessuto adiposo e alle caratteristiche individuali.",
      "paragraphs": [
        "La criolipolisi è un trattamento di medicina estetica non invasivo che utilizza il freddo controllato per agire sugli accumuli di grasso localizzato, contribuendo a rimodellare il profilo corporeo senza ricorrere alla chirurgia.",
        "Attraverso la tecnologia Cryoliposculpt, il trattamento agisce sulle cellule adipose dell’area selezionata, favorendone la progressiva eliminazione attraverso i naturali processi dell’organismo.",
        "La criolipolisi può essere indicata per intervenire su zone come addome, fianchi e cosce, con un percorso personalizzato definito dal medico in base alla distribuzione del tessuto adiposo e alle caratteristiche individuali."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/criolipolisi-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la criolipolisi per adiposità localizzate?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Criolipolisi addome per adiposità localizzata",
        "description": "La criolipolisi può contribuire a ridurre il grasso localizzato sull’addome, favorendo un profilo più definito e armonioso."
      },
      {
        "title": "Criolipolisi fianchi e profilo corporeo",
        "description": "La criolipolisi può contribuire a ridurre il grasso localizzato sui fianchi, definendo il punto vita."
      },
      {
        "title": "Criolipolisi cosce e culotte de cheval",
        "description": "La criolipolisi può contribuire a ridurre il grasso localizzato sulle culotte de cheval, migliorando il profilo delle cosce."
      },
      {
        "title": "Criolipolisi braccia",
        "description": "La criolipolisi può lavorare efficacemente anche sulle braccia, una zona dove il grasso tende spesso ad accumularsi e dove ginnastica e diete non riescono a intervenire."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di criolipolisi per adiposità localizzate?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Valutazione delle aree",
        "description": "Durante la consulenza si discutono sensazioni durante l’applicazione, possibili reazioni transitorie e complicanze conosciute, compresa l’iperplasia adiposa paradossa, evento raro ma rilevante da illustrare in ambito clinico. Il medico esamina la zona, raccoglie anamnesi e verifica controindicazioni al freddo e alla procedura. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Raffreddamento controllato",
        "description": "Viene eseguita la seduta con il dispositivo selezionato, secondo parametri e protezioni previsti. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Controllo dei tessuti",
        "description": "Si spiegano possibili reazioni locali e il periodo necessario per valutare eventuali cambiamenti. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Valutazione delle aree",
        "description": "Durante la consulenza si discutono sensazioni durante l’applicazione, possibili reazioni transitorie e complicanze conosciute, compresa l’iperplasia adiposa paradossa, evento raro ma rilevante da illustrare in ambito clinico. Il medico esamina la zona, raccoglie anamnesi e verifica controindicazioni al freddo e alla procedura. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Raffreddamento controllato",
        "description": "Viene eseguita la seduta con il dispositivo selezionato, secondo parametri e protezioni previsti. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Controllo dei tessuti",
        "description": "Si spiegano possibili reazioni locali e il periodo necessario per valutare eventuali cambiamenti. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Criolipolisi per adiposità localizzate: quali risultati aspettarsi?",
      "description": "La criolipolisi può contribuire a ridurre progressivamente gli accumuli di grasso localizzato, favorendo un profilo corporeo più definito e una silhouette armoniosa, senza ricorrere alla chirurgia.\n\nI risultati si sviluppano gradualmente nelle settimane e nei mesi successivi al trattamento, seguendo i naturali processi con cui l’organismo elimina le cellule adipose interessate dal raffreddamento controllato. L’entità del miglioramento varia in base alla zona trattata, alle caratteristiche del tessuto adiposo e alla risposta individuale.\n\nDurante la visita specialistica, il medico valuta le aree su cui intervenire e definisce un percorso personalizzato, stabilendo gli eventuali controlli per osservare l’evoluzione dei risultati nel tempo. Vengono inoltre illustrate le possibili reazioni al trattamento, per affrontare ogni fase con informazioni chiare e aspettative realistiche.",
      "paragraphs": [
        "La criolipolisi può contribuire a ridurre progressivamente gli accumuli di grasso localizzato, favorendo un profilo corporeo più definito e una silhouette armoniosa, senza ricorrere alla chirurgia.",
        "I risultati si sviluppano gradualmente nelle settimane e nei mesi successivi al trattamento, seguendo i naturali processi con cui l’organismo elimina le cellule adipose interessate dal raffreddamento controllato. L’entità del miglioramento varia in base alla zona trattata, alle caratteristiche del tessuto adiposo e alla risposta individuale.",
        "Durante la visita specialistica, il medico valuta le aree su cui intervenire e definisce un percorso personalizzato, stabilendo gli eventuali controlli per osservare l’evoluzione dei risultati nel tempo. Vengono inoltre illustrate le possibili reazioni al trattamento, per affrontare ogni fase con informazioni chiare e aspettative realistiche."
      ],
      "image": "/images/trattamenti/medicina-estetica/criolipolisi-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "La criolipolisi fa dimagrire?",
        "a": "È rivolta a depositi adiposi localizzati, non al trattamento del sovrappeso o dell’obesità."
      },
      {
        "q": "Quando si osservano i cambiamenti?",
        "a": "Il processo è graduale e i tempi possono variare in base alla risposta individuale."
      },
      {
        "q": "È possibile trattare più zone?",
        "a": "La scelta delle aree e del numero di applicazioni segue criteri medici e tecnici."
      },
      {
        "q": "La criolipolisi ha controindicazioni?",
        "a": "Sì. Alcune condizioni, incluse particolari sensibilità al freddo, possono renderla non indicata."
      }
    ],
    "localSeo": {
      "title": "Criolipolisi per adiposità localizzate a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato alla criolipolisi per adiposità localizzate. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative alla criolipolisi per adiposità localizzate. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "carbossiterapia",
    "title": "Carbossiterapia",
    "category": "medicina-estetica",
    "categoryName": "Corpo e silhouette",
    "tagline": "Un trattamento medico che impiega anidride carbonica medicale in protocolli selezionati dedicati al microcircolo e alla qualità dei tessuti.",
    "description": "Un trattamento medico che impiega anidride carbonica medicale in protocolli selezionati dedicati al microcircolo e alla qualità dei tessuti.",
    "heroImage": "/images/trattamenti/medicina-estetica/carbossiterapia-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/carbossiterapia-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/carbossiterapia-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/carbossiterapia-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Carbossiterapia a Napoli | Cocoora",
      "metaDescription": "Carbossiterapia a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci carbossiterapia per cellulite e aspetto della cute e carb",
      "keywordMain": "carbossiterapia napoli",
      "keywordSec": "carbossiterapia per cellulite e aspetto della cute; carbossiterapia gambe e microcircolo; carbossiterapia cosce e glutei; carbossiterapia per pelle irregolare"
    },
    "whatIs": {
      "title": "Che cos’è la carbossiterapia e come funziona?",
      "description": "La carbossiterapia prevede la somministrazione controllata di CO₂ medicale nei tessuti mediante una procedura effettuata da un professionista. Cocoora la include nei percorsi per migliorare l’aspetto della cellulite e sostenere il microcircolo; indicazioni ed evidenze vanno rapportate al quadro individuale.\n\nLa carbossiterapia utilizza anidride carbonica medicale somministrata secondo un protocollo medico. Nelle indicazioni fornite da Cocoora trova spazio in percorsi rivolti alla qualità dei tessuti e all’aspetto della cellulite, con attenzione al microcircolo locale.",
      "paragraphs": [
        "La carbossiterapia prevede la somministrazione controllata di CO₂ medicale nei tessuti mediante una procedura effettuata da un professionista. Cocoora la include nei percorsi per migliorare l’aspetto della cellulite e sostenere il microcircolo; indicazioni ed evidenze vanno rapportate al quadro individuale.",
        "La carbossiterapia utilizza anidride carbonica medicale somministrata secondo un protocollo medico. Nelle indicazioni fornite da Cocoora trova spazio in percorsi rivolti alla qualità dei tessuti e all’aspetto della cellulite, con attenzione al microcircolo locale."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/carbossiterapia-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la carbossiterapia?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Carbossiterapia per cellulite",
        "description": "La carbossiterapia può contribuire a migliorare l’aspetto della cellulite e la qualità dei tessuti, favorendo il microcircolo."
      },
      {
        "title": "Carbossiterapia gambe",
        "description": "La carbossiterapia utilizza anidride carbonica medicale per favorire il microcircolo e migliorare la qualità dei tessuti delle gambe."
      },
      {
        "title": "Carbossiterapia cosce e glutei",
        "description": "La carbossiterapia può contribuire a migliorare la texture della pelle di cosce e glutei, attenuando l’aspetto della cellulite."
      },
      {
        "title": "Carbossiterapia per pelle irregolare",
        "description": "La carbossiterapia può contribuire a migliorare l’uniformità e la qualità della pelle, favorendo il microcircolo nelle aree trattate."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di carbossiterapia?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Visita e indicazione",
        "description": "Prima della seduta vengono esaminate eventuali controindicazioni. Modalità di somministrazione, aree, durata e frequenza dipendono dall’obiettivo e dal protocollo medico; piccoli fastidi o segni transitori possono essere possibili. Si valutano anamnesi, caratteristiche dei tessuti e possibili controindicazioni. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Somministrazione di CO₂",
        "description": "Il medico esegue il protocollo con strumenti e parametri appropriati alla zona. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Valutazione della risposta",
        "description": "Vengono fornite informazioni su sensazioni transitorie e programmazione dei controlli. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Visita e indicazione",
        "description": "Prima della seduta vengono esaminate eventuali controindicazioni. Modalità di somministrazione, aree, durata e frequenza dipendono dall’obiettivo e dal protocollo medico; piccoli fastidi o segni transitori possono essere possibili. Si valutano anamnesi, caratteristiche dei tessuti e possibili controindicazioni. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Somministrazione di CO₂",
        "description": "Il medico esegue il protocollo con strumenti e parametri appropriati alla zona. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Valutazione della risposta",
        "description": "Vengono fornite informazioni su sensazioni transitorie e programmazione dei controlli. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Carbossiterapia: quali risultati aspettarsi?",
      "description": "La carbossiterapia può contribuire a migliorare progressivamente l’aspetto della cellulite, favorendo il microcircolo e una maggiore uniformità e qualità della pelle. Il trattamento aiuta a rendere i tessuti più omogenei, per una pelle dall’aspetto più levigato.\n\nI miglioramenti si sviluppano gradualmente e possono variare in base alle caratteristiche della pelle, alla zona trattata e alla risposta individuale. Il medico definisce un percorso personalizzato, individuando il numero di sedute più appropriato per gli obiettivi desiderati.\n\nDurante i controlli viene valutata l’evoluzione dei risultati, così da adattare il percorso alle esigenze individuali e favorire il mantenimento dei benefici nel tempo.",
      "paragraphs": [
        "La carbossiterapia può contribuire a migliorare progressivamente l’aspetto della cellulite, favorendo il microcircolo e una maggiore uniformità e qualità della pelle. Il trattamento aiuta a rendere i tessuti più omogenei, per una pelle dall’aspetto più levigato.",
        "I miglioramenti si sviluppano gradualmente e possono variare in base alle caratteristiche della pelle, alla zona trattata e alla risposta individuale. Il medico definisce un percorso personalizzato, individuando il numero di sedute più appropriato per gli obiettivi desiderati.",
        "Durante i controlli viene valutata l’evoluzione dei risultati, così da adattare il percorso alle esigenze individuali e favorire il mantenimento dei benefici nel tempo."
      ],
      "image": "/images/trattamenti/medicina-estetica/carbossiterapia-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Che cos’è la CO₂ medicale?",
        "a": "È anidride carbonica impiegata per uso medico secondo protocolli e dispositivi dedicati."
      },
      {
        "q": "La carbossiterapia serve solo per la cellulite?",
        "a": "La carbossiterapia favorisce il microcircolo e contribuisce a migliorare la qualità, la texture e l’aspetto della pelle."
      },
      {
        "q": "La seduta può dare fastidio?",
        "a": "Sono possibili sensazioni locali durante la somministrazione; il medico spiega cosa aspettarsi."
      },
      {
        "q": "Quante sedute vengono consigliate?",
        "a": "Numero e frequenza dipendono dalla valutazione clinica e dal protocollo selezionato."
      }
    ],
    "localSeo": {
      "title": "Carbossiterapia a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato alla carbossiterapia. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative alla carbossiterapia. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "mesoterapia",
    "title": "Mesoterapia",
    "category": "medicina-estetica",
    "categoryName": "Corpo e silhouette",
    "tagline": "Una procedura medica che utilizza microiniezioni superficiali, considerata da Cocoora in percorsi per microcircolo, cellulite e texture cutanea.",
    "description": "Una procedura medica che utilizza microiniezioni superficiali, considerata da Cocoora in percorsi per microcircolo, cellulite e texture cutanea.",
    "heroImage": "/images/trattamenti/medicina-estetica/mesoterapia-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/mesoterapia-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/mesoterapia-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/mesoterapia-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Mesoterapia a Napoli | Cocoora",
      "metaDescription": "Mesoterapia a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci mesoterapia per cellulite di cosce e glutei e mesoterapia gam",
      "keywordMain": "mesoterapia Napoli",
      "keywordSec": "mesoterapia per cellulite di cosce e glutei; mesoterapia gambe e microcircolo; mesoterapia e miglioramento della texture cutanea; mesoterapia e intralipoterapia"
    },
    "whatIs": {
      "title": "Che cos’è la mesoterapia e come funziona?",
      "description": "La mesoterapia è un trattamento di medicina estetica che prevede microiniezioni superficiali di sostanze specifiche, selezionate dal medico in base alle caratteristiche della pelle e agli obiettivi del trattamento.\n\nPuò contribuire a migliorare il microcircolo, attenuare l’aspetto della cellulite e favorire una pelle più uniforme e levigata. Il trattamento viene personalizzato in base alle zone interessate e alle esigenze individuali, all’interno di un percorso mirato al miglioramento della qualità dei tessuti.",
      "paragraphs": [
        "La mesoterapia è un trattamento di medicina estetica che prevede microiniezioni superficiali di sostanze specifiche, selezionate dal medico in base alle caratteristiche della pelle e agli obiettivi del trattamento.",
        "Può contribuire a migliorare il microcircolo, attenuare l’aspetto della cellulite e favorire una pelle più uniforme e levigata. Il trattamento viene personalizzato in base alle zone interessate e alle esigenze individuali, all’interno di un percorso mirato al miglioramento della qualità dei tessuti."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/mesoterapia-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la mesoterapia?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Mesoterapia per cellulite di cosce e glutei",
        "description": "La mesoterapia aiuta ad attenuare la cellulite e a migliorare la texture della pelle attraverso microiniezioni superficiali."
      },
      {
        "title": "Mesoterapia gambe e microcircolo",
        "description": "La mesoterapia può contribuire a migliorare il microcircolo locale e la qualità dei tessuti nelle aree trattate."
      },
      {
        "title": "Mesoterapia e miglioramento della texture",
        "description": "La mesoterapia può contribuire a migliorare la texture e l’uniformità della pelle, attenuando le irregolarità superficiali."
      },
      {
        "title": "Mesoterapia o intralipoterapia?",
        "description": "La mesoterapia aiuta a migliorare il microcircolo, la cellulite e la qualità della pelle, mentre l’intralipoterapia è indicata per ridurre gli accumuli di grasso localizzato."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di mesoterapia?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Valutazione",
        "description": "Il piano viene impostato dopo anamnesi e verifica di eventuali allergie o controindicazioni. Sono stati chiariti la tecnica, la frequenza, i possibili segni locali e le precauzioni successive in base al prodotto effettivamente utilizzato. Il medico definisce obiettivi, zona di intervento e appropriatezza delle sostanze previste. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Microiniezioni",
        "description": "La procedura consiste in somministrazioni superficiali eseguite secondo un protocollo medico. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Controllo e indicazioni",
        "description": "Si monitorano la risposta, eventuali effetti locali e opportunità di incontri successivi. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Valutazione",
        "description": "Il piano viene impostato dopo anamnesi e verifica di eventuali allergie o controindicazioni. Sono stati chiariti la tecnica, la frequenza, i possibili segni locali e le precauzioni successive in base al prodotto effettivamente utilizzato. Il medico definisce obiettivi, zona di intervento e appropriatezza delle sostanze previste. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Microiniezioni",
        "description": "La procedura consiste in somministrazioni superficiali eseguite secondo un protocollo medico. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Controllo e indicazioni",
        "description": "Si monitorano la risposta, eventuali effetti locali e opportunità di incontri successivi. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Mesoterapia: quali risultati aspettarsi?",
      "description": "La mesoterapia può contribuire a migliorare progressivamente l’aspetto della cellulite, favorire il microcircolo e rendere la pelle più uniforme e levigata. Il trattamento agisce sulla qualità dei tessuti, aiutando a migliorare la texture delle aree interessate.\n\nI risultati si sviluppano gradualmente e variano in base alle caratteristiche della pelle, alle sostanze utilizzate e alla risposta individuale. Il medico definisce un percorso personalizzato, individuando il numero di sedute più appropriato in funzione delle esigenze e degli obiettivi del trattamento.\n\nDurante le visite di controllo viene monitorata l’evoluzione dei risultati, con la possibilità di adattare il percorso per valorizzare e mantenere nel tempo i benefici ottenuti.",
      "paragraphs": [
        "La mesoterapia può contribuire a migliorare progressivamente l’aspetto della cellulite, favorire il microcircolo e rendere la pelle più uniforme e levigata. Il trattamento agisce sulla qualità dei tessuti, aiutando a migliorare la texture delle aree interessate.",
        "I risultati si sviluppano gradualmente e variano in base alle caratteristiche della pelle, alle sostanze utilizzate e alla risposta individuale. Il medico definisce un percorso personalizzato, individuando il numero di sedute più appropriato in funzione delle esigenze e degli obiettivi del trattamento.",
        "Durante le visite di controllo viene monitorata l’evoluzione dei risultati, con la possibilità di adattare il percorso per valorizzare e mantenere nel tempo i benefici ottenuti."
      ],
      "image": "/images/trattamenti/medicina-estetica/mesoterapia-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "La mesoterapia è un massaggio?",
        "a": "No. È una procedura medica che prevede microiniezioni."
      },
      {
        "q": "Quali prodotti vengono iniettati?",
        "a": "I preparati dipendono dal protocollo; Cocoora dovrà confermarli prima di inserire nomi specifici sul sito."
      },
      {
        "q": "Può trattare tutte le forme di cellulite?",
        "a": "Le caratteristiche della cellulite e le eventuali cause associate vanno prima valutate."
      },
      {
        "q": "Occorre sospendere le normali attività?",
        "a": "Le indicazioni variano con zona, sostanze e reazioni locali; vengono date dal medico."
      }
    ],
    "localSeo": {
      "title": "Mesoterapia a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato alla mesoterapia. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative alla mesoterapia. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "biostimolazione-corpo",
    "title": "Biostimolazione corpo",
    "category": "medicina-estetica",
    "categoryName": "Corpo e silhouette",
    "tagline": "Un trattamento medico-estetico iniettivo che stimola la produzione di collagene per migliorare progressivamente la tonicità, la compattezza e la qualità della pelle del corpo.",
    "description": "Un trattamento medico-estetico iniettivo che stimola la produzione di collagene per migliorare progressivamente la tonicità, la compattezza e la qualità della pelle del corpo.",
    "heroImage": "/images/trattamenti/medicina-estetica/biostimolazione-corpo-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/biostimolazione-corpo-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/biostimolazione-corpo-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/biostimolazione-corpo-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Biostimolazione corpo a Napoli | Cocoora",
      "metaDescription": "Biostimolazione corpo a Napoli con acido poli-L-lattico e idrossiapatite di calcio. Scopri come migliorare progressivamente la qualità della pelle.",
      "keywordMain": "biostimolazione corpo",
      "keywordSec": "biostimolazione corpo Napoli, biostimolazione glutei, biostimolazione braccia, biostimolazione addome, biostimolazione cosce, biostimolazione collagene, trattamento lassità cutanea corpo."
    },
    "whatIs": {
      "title": "Che cos'è la biostimolazione corpo e come funziona?",
      "description": "La biostimolazione corpo è un trattamento di medicina estetica che utilizza sostanze iniettabili per stimolare la produzione di nuovo collagene e migliorare la struttura dei tessuti cutanei. Tra i principali biostimolanti utilizzati rientrano l'acido poli-L-lattico (PLLA) e l'idrossiapatite di calcio (CaHA). Entrambi favoriscono i processi di produzione del collagene, pur presentando caratteristiche, formulazioni e modalità di impiego differenti. L'obiettivo è intervenire sulla qualità della pelle, contribuendo a migliorarne elasticità, tonicità e compattezza. I cambiamenti si sviluppano progressivamente, attraverso la risposta biologica dei tessuti. A differenza dei trattamenti destinati alla riduzione delle adiposità localizzate, la biostimolazione non agisce sul grasso corporeo e non ha finalità dimagranti. È indicata in situazioni selezionate di lassità cutanea, dopo un'attenta valutazione medica.",
      "paragraphs": [
        "La biostimolazione corpo è un trattamento di medicina estetica che utilizza sostanze iniettabili per stimolare la produzione di nuovo collagene e migliorare la struttura dei tessuti cutanei. Tra i principali biostimolanti utilizzati rientrano l'acido poli-L-lattico (PLLA) e l'idrossiapatite di calcio (CaHA). Entrambi favoriscono i processi di produzione del collagene, pur presentando caratteristiche, formulazioni e modalità di impiego differenti. L'obiettivo è intervenire sulla qualità della pelle, contribuendo a migliorarne elasticità, tonicità e compattezza. I cambiamenti si sviluppano progressivamente, attraverso la risposta biologica dei tessuti. A differenza dei trattamenti destinati alla riduzione delle adiposità localizzate, la biostimolazione non agisce sul grasso corporeo e non ha finalità dimagranti. È indicata in situazioni selezionate di lassità cutanea, dopo un'attenta valutazione medica."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/biostimolazione-corpo-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la biostimolazione corpo?",
    "problemsSubtitle": "La biostimolazione può essere valutata per diverse aree del corpo in cui si desidera migliorare la qualità e il sostegno della pelle. La scelta della zona da trattare, del prodotto e della tecnica dipende dalle caratteristiche dei tessuti e dagli obiettivi definiti durante la visita.",
    "problemsGrid": [
      {
        "title": "Biostimolazione glutei",
        "description": "Nella regione glutea, la biostimolazione può contribuire a migliorare la compattezza della pelle e l'aspetto dei tessuti, soprattutto in presenza di lassità cutanea lieve o moderata."
      },
      {
        "title": "Biostimolazione braccia",
        "description": "La pelle delle braccia può perdere progressivamente elasticità e sostegno. La biostimolazione rappresenta una possibile opzione medico-estetica per intervenire sulla qualità cutanea, in particolare nelle aree caratterizzate da ridotta compattezza."
      },
      {
        "title": "Biostimolazione addome",
        "description": "Anche la pelle dell'addome può presentare variazioni di elasticità e tonicità, legate al naturale invecchiamento cutaneo o a cambiamenti corporei. La biostimolazione può essere presa in considerazione per favorire il sostegno dei tessuti e migliorarne gradualmente l'aspetto."
      },
      {
        "title": "Biostimolazione cosce",
        "description": "Nella zona delle cosce, la biostimolazione può aiutare a contrastare la perdita di compattezza cutanea, favorendo la produzione di collagene."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di biostimolazione corpo?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Valutazione medica iniziale",
        "description": "Il percorso inizia con una visita durante la quale il medico analizza la storia clinica, le caratteristiche della pelle e il grado di lassità cutanea. Questa fase permette di verificare l'appropriatezza del trattamento, individuare eventuali controindicazioni e definire gli obiettivi."
      },
      {
        "stepNumber": "02",
        "title": "Trattamento",
        "description": "Dopo aver individuato le aree da trattare, il medico procede alla somministrazione del prodotto selezionato attraverso iniezioni, utilizzando la tecnica più appropriata. La scelta tra acido poli-L-lattico e idrossiapatite di calcio dipende dalla valutazione specialistica e dalle indicazioni d'uso del dispositivo. Durata della seduta, numero di trattamenti ed eventuali intervalli vengono stabiliti in base al protocollo e alla risposta individuale."
      },
      {
        "stepNumber": "03",
        "title": "Indicazioni e monitoraggio",
        "description": "Al termine della procedura, il medico fornisce le indicazioni da seguire nei giorni successivi e programma, quando necessario, le sedute o i controlli successivi. Possono comparire effetti locali temporanei, come arrossamento, gonfiore, sensibilità o piccoli ematomi. Durante la consulenza vengono illustrati anche gli altri possibili rischi associati ai trattamenti iniettabili e le precauzioni da adottare."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Valutazione medica iniziale",
        "description": "Il percorso inizia con una visita durante la quale il medico analizza la storia clinica, le caratteristiche della pelle e il grado di lassità cutanea. Questa fase permette di verificare l'appropriatezza del trattamento, individuare eventuali controindicazioni e definire gli obiettivi."
      },
      {
        "title": "Trattamento",
        "description": "Dopo aver individuato le aree da trattare, il medico procede alla somministrazione del prodotto selezionato attraverso iniezioni, utilizzando la tecnica più appropriata. La scelta tra acido poli-L-lattico e idrossiapatite di calcio dipende dalla valutazione specialistica e dalle indicazioni d'uso del dispositivo. Durata della seduta, numero di trattamenti ed eventuali intervalli vengono stabiliti in base al protocollo e alla risposta individuale."
      },
      {
        "title": "Indicazioni e monitoraggio",
        "description": "Al termine della procedura, il medico fornisce le indicazioni da seguire nei giorni successivi e programma, quando necessario, le sedute o i controlli successivi. Possono comparire effetti locali temporanei, come arrossamento, gonfiore, sensibilità o piccoli ematomi. Durante la consulenza vengono illustrati anche gli altri possibili rischi associati ai trattamenti iniettabili e le precauzioni da adottare."
      }
    ],
    "results": {
      "title": "Biostimolazione corpo: quali risultati aspettarsi?",
      "description": "La biostimolazione corpo ha l'obiettivo di migliorare progressivamente la qualità cutanea attraverso la produzione di nuovo collagene. I cambiamenti possono riguardare una maggiore compattezza, un miglioramento dell'elasticità e un aspetto più uniforme dei tessuti nelle zone trattate.\n\nI risultati non sono immediati: la risposta biologica richiede tempo e i miglioramenti possono diventare osservabili nel corso delle settimane e dei mesi successivi al trattamento. L'entità e la durata degli effetti dipendono da diversi fattori, tra cui le caratteristiche iniziali della pelle, il prodotto utilizzato, il protocollo e la risposta individuale.",
      "paragraphs": [
        "La biostimolazione corpo ha l'obiettivo di migliorare progressivamente la qualità cutanea attraverso la produzione di nuovo collagene. I cambiamenti possono riguardare una maggiore compattezza, un miglioramento dell'elasticità e un aspetto più uniforme dei tessuti nelle zone trattate.",
        "I risultati non sono immediati: la risposta biologica richiede tempo e i miglioramenti possono diventare osservabili nel corso delle settimane e dei mesi successivi al trattamento. L'entità e la durata degli effetti dipendono da diversi fattori, tra cui le caratteristiche iniziali della pelle, il prodotto utilizzato, il protocollo e la risposta individuale."
      ],
      "image": "/images/trattamenti/medicina-estetica/biostimolazione-corpo-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni sulla biostimolazione corpo e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Qual è la differenza tra acido poli-L-lattico e idrossiapatite di calcio?",
        "a": "Sono due biostimolanti con proprietà differenti. Entrambi possono favorire la produzione di collagene, ma si distinguono per composizione, comportamento nei tessuti e modalità di utilizzo. Il medico stabilisce quale prodotto sia appropriato per la zona da trattare."
      },
      {
        "q": "Dopo quanto tempo si vedono i risultati della biostimolazione corpo?",
        "a": "I risultati si sviluppano gradualmente, poiché dipendono dai processi di produzione del collagene. I primi cambiamenti possono diventare osservabili nel corso delle settimane o dei mesi successivi, con tempistiche variabili secondo il prodotto e la risposta individuale."
      },
      {
        "q": "Quante sedute di biostimolazione corpo sono necessarie?",
        "a": "Non esiste un numero di sedute valido per tutti. Il programma dipende dall'area trattata, dalle condizioni della pelle, dal biostimolante scelto e dagli obiettivi concordati con il medico."
      },
      {
        "q": "La biostimolazione corpo aiuta a dimagrire?",
        "a": "No. La biostimolazione agisce sulla qualità dei tessuti cutanei e sulla produzione di collagene. Non è un trattamento dimagrante e non è destinata all'eliminazione del grasso localizzato."
      }
    ],
    "localSeo": {
      "title": "Biostimolazione corpo a Napoli",
      "description": "A Napoli, Cocoora propone un percorso di medicina estetica dedicato alla valutazione e al trattamento della lassità cutanea del corpo. La consulenza specialistica permette di individuare le aree sulle quali intervenire, valutare l'eventuale impiego di acido poli-L-lattico o idrossiapatite di calcio e definire un programma coerente con le caratteristiche della pelle e gli obiettivi individuali. Contatta Cocoora per ricevere informazioni sulla biostimolazione corpo e prenotare una valutazione medica.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "intralipoterapia",
    "title": "Intralipoterapia per adiposità localizzate",
    "category": "medicina-estetica",
    "categoryName": "Corpo e silhouette",
    "tagline": "Un trattamento medico iniettivo che può essere indicato per accumuli adiposi circoscritti, solo dopo un’attenta selezione della persona e dell’area.",
    "description": "Un trattamento medico iniettivo che può essere indicato per accumuli adiposi circoscritti, solo dopo un’attenta selezione della persona e dell’area.",
    "heroImage": "/images/trattamenti/medicina-estetica/intralipoterapia-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/intralipoterapia-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/intralipoterapia-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/intralipoterapia-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Intralipoterapia per adiposità localizzate a Napoli | Cocoora",
      "metaDescription": "Intralipoterapia per adiposità localizzate a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci intralipoterapia addome e intr",
      "keywordMain": "intralipoterapia Napoli",
      "keywordSec": "intralipoterapia addome; intralipoterapia fianchi e aree circoscritte; intralipoterapia interno coscia; intralipoterapia e cellulite"
    },
    "whatIs": {
      "title": "Che cos’è l’intralipoterapia per adiposità localizzate e come funziona?",
      "description": "L’intralipoterapia è un trattamento di medicina estetica che permette di intervenire in modo mirato sugli accumuli di grasso localizzati, contribuendo a rimodellare il profilo corporeo senza ricorrere alla chirurgia.\n\nLa procedura prevede l’iniezione di sostanze specifiche direttamente nel tessuto adiposo sottocutaneo, con l’obiettivo di favorire la riduzione del grasso nell’area trattata. Può essere presa in considerazione per zone come addome, fianchi e cosce, quando gli accumuli adiposi risultano circoscritti e adatti a questo tipo di intervento.\n\nPrima del trattamento, il medico valuta la distribuzione del tessuto adiposo, le caratteristiche della pelle e gli obiettivi della persona. Sulla base di questa analisi viene definito un percorso personalizzato, che tiene conto delle aree da trattare e dei risultati che è realisticamente possibile ottenere.",
      "paragraphs": [
        "L’intralipoterapia è un trattamento di medicina estetica che permette di intervenire in modo mirato sugli accumuli di grasso localizzati, contribuendo a rimodellare il profilo corporeo senza ricorrere alla chirurgia.",
        "La procedura prevede l’iniezione di sostanze specifiche direttamente nel tessuto adiposo sottocutaneo, con l’obiettivo di favorire la riduzione del grasso nell’area trattata. Può essere presa in considerazione per zone come addome, fianchi e cosce, quando gli accumuli adiposi risultano circoscritti e adatti a questo tipo di intervento.",
        "Prima del trattamento, il medico valuta la distribuzione del tessuto adiposo, le caratteristiche della pelle e gli obiettivi della persona. Sulla base di questa analisi viene definito un percorso personalizzato, che tiene conto delle aree da trattare e dei risultati che è realisticamente possibile ottenere."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/intralipoterapia-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve l'intralipoterapia per adiposità localizzate?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Intralipoterapia addome",
        "description": "L’intralipoterapia può contribuire a ridurre gli accumuli di grasso localizzati sull’addome, favorendo un profilo più definito."
      },
      {
        "title": "Intralipoterapia fianchi",
        "description": "L’intralipoterapia può contribuire a ridurre il grasso localizzato sui fianchi, favorendo un profilo corporeo più definito e armonioso."
      },
      {
        "title": "Intralipoterapia interno coscia",
        "description": "L’intralipoterapia può contribuire a ridurre il grasso localizzato nell’interno coscia, migliorandone il profilo."
      },
      {
        "title": "Intralipoterapia e cellulite",
        "description": "L’intralipoterapia aiuta a ridurre gli accumuli di grasso localizzati sull’addome, sui fianchi e sulle cosce, mentre la cellulite richiede un approccio specifico."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di intralipoterapia per adiposità localizzate?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Anamnesi e selezione",
        "description": "Il medico verifica il tipo di adiposità, l’idoneità e le controindicazioni, compresa l’appropriatezza del prodotto. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Procedura iniettiva",
        "description": "Solo se indicato, viene effettuata la somministrazione con tecnica e sedi conformi al protocollo autorizzato. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Sorveglianza",
        "description": "Si chiariscono reazioni possibili, gestione post-seduta e controlli clinici. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Anamnesi e selezione",
        "description": "Il medico verifica il tipo di adiposità, l’idoneità e le controindicazioni, compresa l’appropriatezza del prodotto. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Procedura iniettiva",
        "description": "Solo se indicato, viene effettuata la somministrazione con tecnica e sedi conformi al protocollo autorizzato. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Sorveglianza",
        "description": "Si chiariscono reazioni possibili, gestione post-seduta e controlli clinici. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Intralipoterapia per adiposità localizzate: quali risultati aspettarsi?",
      "description": "L’intralipoterapia può contribuire a ridurre gli accumuli adiposi localizzati e a migliorare progressivamente il profilo delle aree trattate, favorendo una silhouette più armoniosa e proporzionata.\n\nI risultati si sviluppano gradualmente, seguendo i tempi di risposta dell’organismo. L'entità del miglioramento varia in base alla zona interessata, alle caratteristiche del tessuto adiposo e al protocollo definito dal medico. In alcuni casi possono essere indicate più sedute per raggiungere gli obiettivi concordati.\n\nLa valutazione specialistica permette di individuare le aree su cui intervenire, definire aspettative realistiche e pianificare un percorso personalizzato, con controlli dedicati a osservare l’evoluzione del trattamento nel tempo.",
      "paragraphs": [
        "L’intralipoterapia può contribuire a ridurre gli accumuli adiposi localizzati e a migliorare progressivamente il profilo delle aree trattate, favorendo una silhouette più armoniosa e proporzionata.",
        "I risultati si sviluppano gradualmente, seguendo i tempi di risposta dell’organismo. L'entità del miglioramento varia in base alla zona interessata, alle caratteristiche del tessuto adiposo e al protocollo definito dal medico. In alcuni casi possono essere indicate più sedute per raggiungere gli obiettivi concordati.",
        "La valutazione specialistica permette di individuare le aree su cui intervenire, definire aspettative realistiche e pianificare un percorso personalizzato, con controlli dedicati a osservare l’evoluzione del trattamento nel tempo."
      ],
      "image": "/images/trattamenti/medicina-estetica/intralipoterapia-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "L’intralipoterapia sostituisce una dieta?",
        "a": "No. È rivolta a indicazioni localizzate e non tratta il sovrappeso."
      },
      {
        "q": "È la stessa cosa della criolipolisi?",
        "a": "No. L’intralipoterapia è iniettiva; la criolipolisi utilizza raffreddamento controllato."
      },
      {
        "q": "Quali aree si possono trattare?",
        "a": "Dipende dall’autorizzazione del prodotto e dalla valutazione specialistica."
      },
      {
        "q": "Quale sostanza utilizza Cocoora?",
        "a": "Il documento clinico fornito non la indica: è un dato da confermare prima della pubblicazione."
      }
    ],
    "localSeo": {
      "title": "Intralipoterapia per adiposità localizzate a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato all'intralipoterapia per adiposità localizzate. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative all'intralipoterapia per adiposità localizzate. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "laser-luce-pulsata",
    "aliases": [
      "piattaforma-laser",
      "laser-e-luce-pulsata"
    ],
    "title": "Laser per macchie e rossori",
    "category": "medicina-estetica",
    "categoryName": "Laser e tecnologie",
    "tagline": "Tecnologie selezionate dal medico per valutare discromie, rossori e alterazioni superficiali della pelle, scegliendo la sorgente più adatta a ciascuna indicazione.",
    "description": "Tecnologie selezionate dal medico per valutare discromie, rossori e alterazioni superficiali della pelle, scegliendo la sorgente più adatta a ciascuna indicazione.",
    "heroImage": "/images/trattamenti/medicina-estetica/laser-luce-pulsata-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/laser-luce-pulsata-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/laser-luce-pulsata-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/laser-luce-pulsata-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Laser e sorgenti luminose per la pelle a Napoli | Cocoora",
      "metaDescription": "Laser e sorgenti luminose per la pelle a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci laser per macchie cutanee e discromie",
      "keywordMain": "laser e luce pulsata Napoli",
      "keywordSec": "laser per macchie cutanee e discromie selezionate; luce pulsata cpl per rossori del viso; laser e luce pulsata per macchie solari; laser per pigmentazioni"
    },
    "whatIs": {
      "title": "Che cos’è il trattamento laser per macchie e rossori e come funziona?",
      "description": "non è per il cliente finale: Cocoora indica l’uso di QS NPP per pigmentazioni selezionate e CPL per rossori, macchie solari e fotodanneggiamento. Laser e sorgenti luminose non sono equivalenti: lunghezza d’onda, bersaglio e protocollo dipendono dalla tecnologia e dal tipo di pelle.\n\nLaser e sorgenti luminose non sono sinonimi: differiscono per caratteristiche fisiche e modalità di interazione con la cute. Cocoora cita QS NPP per pigmentazioni selezionate e CPL per rossori, macchie solari e segni di fotodanneggiamento. La scelta dipende dalla diagnosi e dal fototipo.",
      "paragraphs": [
        "non è per il cliente finale: Cocoora indica l’uso di QS NPP per pigmentazioni selezionate e CPL per rossori, macchie solari e fotodanneggiamento. Laser e sorgenti luminose non sono equivalenti: lunghezza d’onda, bersaglio e protocollo dipendono dalla tecnologia e dal tipo di pelle.",
        "Laser e sorgenti luminose non sono sinonimi: differiscono per caratteristiche fisiche e modalità di interazione con la cute. Cocoora cita QS NPP per pigmentazioni selezionate e CPL per rossori, macchie solari e segni di fotodanneggiamento. La scelta dipende dalla diagnosi e dal fototipo."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/laser-luce-pulsata-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve il laser per macchie e rossori?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Laser per macchie cutanee e discromie selezionate",
        "description": "Il laser QS NPP può contribuire ad attenuare macchie e pigmentazioni cutanee selezionate, favorendo un colorito più uniforme e luminoso dopo un’attenta valutazione dermatologica."
      },
      {
        "title": "Luce pulsata CPL per rossori del viso",
        "description": "La luce pulsata CPL può contribuire ad attenuare rossori e irregolarità del colorito, migliorando l’uniformità della pelle."
      },
      {
        "title": "Laser e luce pulsata per macchie solari",
        "description": "La luce pulsata CPL può contribuire ad attenuare macchie solari e segni del fotodanneggiamento, favorendo un colorito più uniforme e luminoso."
      },
      {
        "title": "Laser per pigmentazioni QS NPP e CPL",
        "description": "Le tecnologie QS NPP e CPL vengono selezionate dal medico in base al tipo di macchia o rossore e alle caratteristiche della pelle."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di laser e sorgenti luminose per la pelle?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Diagnosi della problematica",
        "description": "Durante la procedura vengono definiti la protezione oculare, i parametri, le sensazioni attese e le possibili reazioni. La necessità di più sedute e i tempi di recupero cambiano a seconda della tecnologia e dell’indicazione. Lo specialista valuta la natura delle alterazioni, il fototipo, i farmaci fotosensibilizzanti e altre controindicazioni. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Scelta della sorgente",
        "description": "Il medico seleziona QS NPP o CPL quando è coerente con il quadro clinico e applica i parametri appropriati. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Fotoprotezione e controllo",
        "description": "Il percorso prosegue con indicazioni per la pelle trattata, attenzione al sole ed eventuale rivalutazione. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Diagnosi della problematica",
        "description": "Durante la procedura vengono definiti la protezione oculare, i parametri, le sensazioni attese e le possibili reazioni. La necessità di più sedute e i tempi di recupero cambiano a seconda della tecnologia e dell’indicazione. Lo specialista valuta la natura delle alterazioni, il fototipo, i farmaci fotosensibilizzanti e altre controindicazioni. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Scelta della sorgente",
        "description": "Il medico seleziona QS NPP o CPL quando è coerente con il quadro clinico e applica i parametri appropriati. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Fotoprotezione e controllo",
        "description": "Il percorso prosegue con indicazioni per la pelle trattata, attenzione al sole ed eventuale rivalutazione. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Laser per macchie e rossori: quali risultati aspettarsi?",
      "description": "troppo negativo La risposta varia secondo la natura dell’alterazione, il fototipo e il trattamento. Possono comparire rossore e modificazioni temporanee della pigmentazione; la fotoprotezione è essenziale.\n\nLa fotoprotezione è fondamentale dopo il trattamento, come riportato nella documentazione clinica. La ricomparsa di alcune pigmentazioni è possibile e il risultato non può essere promesso in modo definitivo.\n\nOgni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo.",
      "paragraphs": [
        "troppo negativo La risposta varia secondo la natura dell’alterazione, il fototipo e il trattamento. Possono comparire rossore e modificazioni temporanee della pigmentazione; la fotoprotezione è essenziale.",
        "La fotoprotezione è fondamentale dopo il trattamento, come riportato nella documentazione clinica. La ricomparsa di alcune pigmentazioni è possibile e il risultato non può essere promesso in modo definitivo.",
        "Ogni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo."
      ],
      "image": "/images/trattamenti/medicina-estetica/laser-luce-pulsata-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Laser e luce pulsata sono uguali?",
        "a": "No. Sono tecnologie con caratteristiche e applicazioni diverse, da scegliere in base all’indicazione."
      },
      {
        "q": "Quali tecnologie sono disponibili da Cocoora?",
        "a": "Per il trattamento di macchie, discromie e rossori vengono utilizzate tecnologie specifiche, come il laser QS NPP e la luce pulsata CPL, selezionate in base alle caratteristiche della pelle."
      },
      {
        "q": "Si possono trattare tutte le macchie?",
        "a": "No. Prima si deve stabilire la natura della pigmentazione ed escludere lesioni che richiedono un altro percorso."
      },
      {
        "q": "Perché serve proteggere la pelle dal sole?",
        "a": "Per limitare i rischi di alterazioni pigmentarie e sostenere il recupero dopo la procedura."
      }
    ],
    "localSeo": {
      "title": "Laser per la pelle a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato ai laser per la pelle. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative al laser per la pelle. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "laser-resurfacing",
    "title": "Laser resurfacing",
    "category": "medicina-estetica",
    "categoryName": "Laser e tecnologie",
    "tagline": "Un trattamento medico basato su tecnologie laser per lavorare su irregolarità della superficie cutanea, cicatrici selezionate e alcuni segni del fotoinvecchiamento.",
    "description": "Un trattamento medico basato su tecnologie laser per lavorare su irregolarità della superficie cutanea, cicatrici selezionate e alcuni segni del fotoinvecchiamento.",
    "heroImage": "/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Laser resurfacing a Napoli | Cocoora",
      "metaDescription": "Laser resurfacing a Napoli da Cocoora: indicazioni, visita medica e possibili risultati.",
      "keywordMain": "laser resurfacing Napoli",
      "keywordSec": "laser co₂ per cicatrici da acne; laser erbium; laser resurfacing per rughe sottili e fotoinvecchiamento; laser co₂ o erbium"
    },
    "whatIs": {
      "title": "Che cos’è il trattamento laser resurfacing e come funziona?",
      "description": "Il laser resurfacing è un trattamento che favorisce il rinnovamento cutaneo, migliorando la texture della pelle e attenuando rughe e cicatrici da acne. A seconda delle esigenze, il medico può utilizzare il laser Erbium:YAG per intervenire sulle irregolarità più superficiali oppure il laser CO₂ per trattamenti più profondi.",
      "paragraphs": [
        "Il laser resurfacing è un trattamento che favorisce il rinnovamento cutaneo, migliorando la texture della pelle e attenuando rughe e cicatrici da acne. A seconda delle esigenze, il medico può utilizzare il laser Erbium:YAG per intervenire sulle irregolarità più superficiali oppure il laser CO₂ per trattamenti più profondi."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve il laser resurfacing?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Laser CO₂ per cicatrici da acne",
        "description": "Il laser CO₂ può contribuire ad attenuare le cicatrici da acne, migliorando progressivamente la texture e l’uniformità della pelle."
      },
      {
        "title": "Laser Erbium:YAG per texture irregolare",
        "description": "Il laser Erbium:YAG può contribuire ad attenuare rughe sottili e irregolarità superficiali, migliorando la texture e l’uniformità della pelle."
      },
      {
        "title": "Laser resurfacing per rughe sottili e fotoinvecchiamento",
        "description": "Il laser resurfacing può contribuire ad attenuare rughe sottili e irregolarità cutanee, favorendo una pelle più liscia, uniforme e levigata."
      },
      {
        "title": "Laser CO₂ o Erbium:YAG: profondità e recupero",
        "description": "I laser CO₂ ed Erbium:YAG agiscono a profondità differenti, permettendo di personalizzare il trattamento in base alle esigenze della pelle."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di laser resurfacing?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Valutazione del rischio",
        "description": "La procedura può richiedere differenti tempi di recupero e cure domiciliari; arrossamento e sensibilità sono possibili. L’intensità del trattamento viene calibrata e spiegata durante la visita, insieme ai rischi di alterazioni pigmentarie o cicatriziali. Si esaminano fototipo, cicatrizzazione, farmaci, esposizione solare e obiettivi del trattamento. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Resurfacing selezionato",
        "description": "Il medico utilizza Erbium:YAG o CO₂ secondo l’indicazione e la profondità necessaria. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Recupero guidato",
        "description": "Vengono fornite istruzioni sulla cura della pelle, sui tempi di recupero e sulla fotoprotezione rigorosa. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Valutazione del rischio",
        "description": "La procedura può richiedere differenti tempi di recupero e cure domiciliari; arrossamento e sensibilità sono possibili. L’intensità del trattamento viene calibrata e spiegata durante la visita, insieme ai rischi di alterazioni pigmentarie o cicatriziali. Si esaminano fototipo, cicatrizzazione, farmaci, esposizione solare e obiettivi del trattamento. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Resurfacing selezionato",
        "description": "Il medico utilizza Erbium:YAG o CO₂ secondo l’indicazione e la profondità necessaria. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Recupero guidato",
        "description": "Vengono fornite istruzioni sulla cura della pelle, sui tempi di recupero e sulla fotoprotezione rigorosa. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Laser resurfacing: quali risultati aspettarsi?",
      "description": "Il laser resurfacing può contribuire a migliorare la texture della pelle, attenuando cicatrici da acne, rughe e irregolarità cutanee. Il trattamento favorisce il rinnovamento della pelle, rendendola progressivamente più liscia, uniforme e levigata.\n\nI risultati si sviluppano gradualmente, seguendo i naturali processi di rigenerazione cutanea. Tempi di recupero e miglioramenti variano in base alla profondità del trattamento, alla tecnologia utilizzata e alle caratteristiche individuali della pelle.\n\nDurante la visita specialistica, il medico definisce il percorso più indicato e fornisce le indicazioni per il recupero, comprese le precauzioni e la protezione solare necessarie per accompagnare la guarigione e preservare i risultati nel tempo.",
      "paragraphs": [
        "Il laser resurfacing può contribuire a migliorare la texture della pelle, attenuando cicatrici da acne, rughe e irregolarità cutanee. Il trattamento favorisce il rinnovamento della pelle, rendendola progressivamente più liscia, uniforme e levigata.",
        "I risultati si sviluppano gradualmente, seguendo i naturali processi di rigenerazione cutanea. Tempi di recupero e miglioramenti variano in base alla profondità del trattamento, alla tecnologia utilizzata e alle caratteristiche individuali della pelle.",
        "Durante la visita specialistica, il medico definisce il percorso più indicato e fornisce le indicazioni per il recupero, comprese le precauzioni e la protezione solare necessarie per accompagnare la guarigione e preservare i risultati nel tempo."
      ],
      "image": "/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Che differenza c’è tra laser CO₂ ed Erbium:YAG?",
        "a": "Il laser CO₂ è indicato per trattamenti di resurfacing più profondi, mentre il laser Erbium:YAG permette di intervenire sulle irregolarità superficiali della pelle."
      },
      {
        "q": "Il laser resurfacing elimina le cicatrici da acne?",
        "a": "Può attenuare alcune cicatrici selezionate, ma non ne garantisce la scomparsa."
      },
      {
        "q": "Quanto dura il recupero?",
        "a": "Dipende dal dispositivo, dalla profondità di azione e dalla risposta della pelle."
      },
      {
        "q": "Si può esporsi al sole dopo il trattamento?",
        "a": "È necessaria una fotoprotezione rigorosa secondo le istruzioni dello specialista."
      }
    ],
    "localSeo": {
      "title": "Laser resurfacing a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato al laser resurfacing. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative al laser resurfacing. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "ultrasuoni-cfu",
    "aliases": [
      "ultrasuoni-focalizzati-cfu"
    ],
    "title": "Ultrasuoni focalizzati CFU",
    "category": "medicina-estetica",
    "categoryName": "Laser e tecnologie",
    "tagline": "Un trattamento non chirurgico che utilizza ultrasuoni focalizzati a profondità selezionate per stimolare i tessuti e favorire un miglioramento progressivo del loro aspetto.",
    "description": "Un trattamento non chirurgico che utilizza ultrasuoni focalizzati a profondità selezionate per stimolare i tessuti e favorire un miglioramento progressivo del loro aspetto.",
    "heroImage": "/images/trattamenti/medicina-estetica/ultrasuoni-cfu-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/ultrasuoni-cfu-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/ultrasuoni-cfu-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/ultrasuoni-cfu-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Ultrasuoni focalizzati CFU a Napoli | Cocoora",
      "metaDescription": "Ultrasuoni focalizzati CFU a Napoli da Cocoora: indicazioni, visita medica e possibili risultati. Approfondisci ultrasuoni cfu viso per lassità lieve o moderata",
      "keywordMain": "ultrasuoni focalizzati cfu Napoli",
      "keywordSec": "ultrasuoni cfu viso per lassità lieve o moderata; ultrasuoni cfu collo e sottomento; ultrasuoni focalizzati cfu per profilo mandibolare; ultrasuoni cfu corpo per compattezza dei tessuti"
    },
    "whatIs": {
      "title": "Che cos’è il trattamento a ultrasuoni focalizzati cfu e come funziona?",
      "description": "Gli ultrasuoni focalizzati CFU (Controlled Focalized Ultrasound) sono una tecnologia di medicina estetica non chirurgica che utilizza energia a ultrasuoni per agire in modo mirato a diverse profondità dei tessuti, stimolando i naturali processi di rimodellamento del collagene.\n\nIl trattamento contribuisce a migliorare progressivamente il tono, la compattezza e l’elasticità della pelle, aiutando ad attenuare i segni della lassità cutanea lieve o moderata. Può essere utilizzato su aree come viso, collo, sottomento e profilo mandibolare, favorendo una maggiore definizione dei contorni e un aspetto più tonico e disteso.\n\nDurante la visita specialistica, il medico valuta le caratteristiche della pelle e il grado di lassità per individuare le zone da trattare e definire un percorso personalizzato. I miglioramenti si sviluppano gradualmente, seguendo i naturali tempi di risposta dei tessuti.",
      "paragraphs": [
        "Gli ultrasuoni focalizzati CFU (Controlled Focalized Ultrasound) sono una tecnologia di medicina estetica non chirurgica che utilizza energia a ultrasuoni per agire in modo mirato a diverse profondità dei tessuti, stimolando i naturali processi di rimodellamento del collagene.",
        "Il trattamento contribuisce a migliorare progressivamente il tono, la compattezza e l’elasticità della pelle, aiutando ad attenuare i segni della lassità cutanea lieve o moderata. Può essere utilizzato su aree come viso, collo, sottomento e profilo mandibolare, favorendo una maggiore definizione dei contorni e un aspetto più tonico e disteso.",
        "Durante la visita specialistica, il medico valuta le caratteristiche della pelle e il grado di lassità per individuare le zone da trattare e definire un percorso personalizzato. I miglioramenti si sviluppano gradualmente, seguendo i naturali tempi di risposta dei tessuti."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/ultrasuoni-cfu-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve l'ultrasuono focalizzato cfu?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Ultrasuoni CFU viso per lassità lieve o moderata",
        "description": "Gli ultrasuoni focalizzati CFU stimolano il rimodellamento del collagene in profondità, contribuendo a migliorare tono, compattezza e definizione della pelle in presenza di lassità lieve o moderata."
      },
      {
        "title": "Ultrasuoni CFU collo e sottomento",
        "description": "Gli ultrasuoni focalizzati CFU possono contribuire a migliorare il tono e la compattezza della pelle del collo e del sottomento, favorendo un profilo più definito e armonioso."
      },
      {
        "title": "Ultrasuoni CFU corpo per compattezza dei tessuti",
        "description": "Gli ultrasuoni focalizzati CFU possono contribuire a migliorare il tono e la compattezza della pelle in aree del corpo selezionate."
      },
      {
        "title": "Ultrasuoni CFU o HIFU?",
        "description": "Il CFU rappresenta l’evoluzione diretta del tradizionale HIFU. A differenza dell’HIFU, il CFU è del tutto indolore, si muove con fluidità ed è più preciso."
      }
    ],
    "timelineTitle": "Come si svolge una seduta di ultrasuoni focalizzati cfu?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Valutazione della lassità",
        "description": "Prima di iniziare il medico spiega sensazioni possibili, controindicazioni e tempi realistici di rivalutazione, senza presentare la procedura come equivalente a un lifting chirurgico. Il medico analizza il grado di lassità, i tessuti e l'anatomia per stabilire se la procedura sia appropriata. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "stepNumber": "02",
        "title": "Applicazione degli ultrasuoni",
        "description": "La tecnologia emette energia focalizzata secondo profondità e parametri impostati per l’area. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Follow-up progressivo",
        "description": "Si valutano eventuali reazioni e si concordano tempi realistici per osservare i cambiamenti. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Valutazione della lassità",
        "description": "Prima di iniziare il medico spiega sensazioni possibili, controindicazioni e tempi realistici di rivalutazione, senza presentare la procedura come equivalente a un lifting chirurgico. Il medico analizza il grado di lassità, i tessuti e l'anatomia per stabilire se la procedura sia appropriata. La valutazione serve anche a esaminare eventuali controindicazioni, terapie in corso ed esigenze individuali; quando necessario, il medico propone accertamenti o un percorso diverso."
      },
      {
        "title": "Applicazione degli ultrasuoni",
        "description": "La tecnologia emette energia focalizzata secondo profondità e parametri impostati per l’area. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Follow-up progressivo",
        "description": "Si valutano eventuali reazioni e si concordano tempi realistici per osservare i cambiamenti. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Ultrasuoni focalizzati CFU: quali risultati aspettarsi?",
      "description": "Gli ultrasuoni focalizzati CFU stimolano la naturale produzione di collagene, contribuendo a migliorare progressivamente il tono, la compattezza e la definizione dei tessuti. Il trattamento può aiutare ad attenuare i segni della lassità cutanea, favorendo un aspetto più tonico e disteso.\n\nI miglioramenti si sviluppano gradualmente nelle settimane e nei mesi successivi alla seduta, seguendo i naturali processi di rimodellamento del collagene. Tempi ed entità dei risultati variano in base alla zona trattata, alle caratteristiche della pelle e alla risposta individuale.\n\nDurante la visita specialistica, il medico valuta il grado di lassità cutanea e definisce un percorso personalizzato, individuando le aree su cui intervenire e gli eventuali controlli per monitorare l’evoluzione dei risultati nel tempo.",
      "paragraphs": [
        "Gli ultrasuoni focalizzati CFU stimolano la naturale produzione di collagene, contribuendo a migliorare progressivamente il tono, la compattezza e la definizione dei tessuti. Il trattamento può aiutare ad attenuare i segni della lassità cutanea, favorendo un aspetto più tonico e disteso.",
        "I miglioramenti si sviluppano gradualmente nelle settimane e nei mesi successivi alla seduta, seguendo i naturali processi di rimodellamento del collagene. Tempi ed entità dei risultati variano in base alla zona trattata, alle caratteristiche della pelle e alla risposta individuale.",
        "Durante la visita specialistica, il medico valuta il grado di lassità cutanea e definisce un percorso personalizzato, individuando le aree su cui intervenire e gli eventuali controlli per monitorare l’evoluzione dei risultati nel tempo."
      ],
      "image": "/images/trattamenti/medicina-estetica/ultrasuoni-cfu-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul trattamento?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Gli ultrasuoni CFU sono un trattamento chirurgico?",
        "a": "Gli ultrasuoni focalizzati CFU sono un trattamento non chirurgico che contribuisce a migliorare il tono e la compattezza della pelle."
      },
      {
        "q": "Per quale grado di lassità sono indicati?",
        "a": "Il medico cita soprattutto lassità cutanea lieve o moderata, da verificare durante la visita."
      },
      {
        "q": "In quali zone si applicano?",
        "a": "Viso, collo, sottomento, profilo mandibolare e alcune aree del corpo selezionate."
      },
      {
        "q": "Il risultato è immediato?",
        "a": "Il rimodellamento dei tessuti richiede tempo e l’entità del cambiamento varia tra persone."
      }
    ],
    "localSeo": {
      "title": "Ultrasuoni focalizzati CFU a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato agli ultrasuoni focalizzati cfu. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nLa consulenza permette di affrontare dubbi su indicazioni, limiti e possibili alternative agli ultrasuoni focalizzati cfu. Per fissare un appuntamento è possibile contattare il team Cocoora: le modalità del percorso vengono spiegate prima di qualsiasi decisione.",
      "cta": "Richiedi una valutazione"
    }
  },
  {
    "slug": "lipedema-linfedema",
    "aliases": [
      "valutazione-lipedema-e-linfedema"
    ],
    "title": "Valutazione per lipedema e linfedema",
    "category": "medicina-estetica",
    "categoryName": "Percorsi specialistici",
    "tagline": "Un percorso di valutazione specialistica dedicato a due condizioni differenti, che richiedono un corretto inquadramento clinico e, quando necessario, il contributo di più professionisti.",
    "description": "Un percorso di valutazione specialistica dedicato a due condizioni differenti, che richiedono un corretto inquadramento clinico e, quando necessario, il contributo di più professionisti.",
    "heroImage": "/images/trattamenti/medicina-estetica/lipedema-linfedema-napoli-1.jpg",
    "galleryImages": [
      "/images/trattamenti/medicina-estetica/lipedema-linfedema-napoli-1.jpg",
      "/images/trattamenti/medicina-estetica/lipedema-linfedema-napoli-2.jpg",
      "/images/trattamenti/medicina-estetica/lipedema-linfedema-napoli-3.jpg"
    ],
    "heroCta": "Richiedi una valutazione",
    "seo": {
      "metaTitle": "Valutazione per lipedema e linfedema a Napoli | Cocoora",
      "metaDescription": "Visita specialistica per lipedema e linfedema a Napoli: come avviene la valutazione, quali differenze considerare e come orientare gli approfondimenti.",
      "keywordMain": "valutazione lipedema e linfedema Napoli",
      "keywordSec": "valutazione del lipedema alle gambe; valutazione del linfedema e gonfiore persistente; lipedema o linfedema; percorso specialistico per lipedema e linfedema"
    },
    "whatIs": {
      "title": "Che cos’è la valutazione per lipedema e linfedema e come funziona?",
      "description": "Il lipedema è una condizione cronica caratterizzata da una distribuzione alterata del tessuto adiposo, spesso agli arti inferiori. Il linfedema è legato a un accumulo di liquido linfatico nei tessuti, con possibile gonfiore persistente. Non sono sinonimi: distinguere le due condizioni è centrale per scegliere il percorso appropriato.\n\nLipedema e linfedema richiedono un inquadramento differenziale: il primo è una condizione cronica che interessa la distribuzione del tessuto adiposo, prevalentemente agli arti; il secondo riguarda l’accumulo di liquido linfatico nei tessuti. Sintomi e segni possono sovrapporsi, ma non sono la stessa diagnosi.",
      "paragraphs": [
        "Il lipedema è una condizione cronica caratterizzata da una distribuzione alterata del tessuto adiposo, spesso agli arti inferiori. Il linfedema è legato a un accumulo di liquido linfatico nei tessuti, con possibile gonfiore persistente. Non sono sinonimi: distinguere le due condizioni è centrale per scegliere il percorso appropriato.",
        "Lipedema e linfedema richiedono un inquadramento differenziale: il primo è una condizione cronica che interessa la distribuzione del tessuto adiposo, prevalentemente agli arti; il secondo riguarda l’accumulo di liquido linfatico nei tessuti. Sintomi e segni possono sovrapporsi, ma non sono la stessa diagnosi."
      ],
      "callout": "Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione.",
      "image": "/images/trattamenti/medicina-estetica/lipedema-linfedema-napoli-2.jpg"
    },
    "problemsTitle": "A cosa serve la valutazione specialistica per lipedema e linfedema?",
    "problemsSubtitle": "Le indicazioni dipendono dalle condizioni individuali e dall’inquadramento medico. Le quattro applicazioni che seguono chiariscono bisogni distinti e non sostituiscono la valutazione specialistica.",
    "problemsGrid": [
      {
        "title": "Valutazione del lipedema alle gambe",
        "description": "Il lipedema è una condizione cronica che interessa soprattutto gli arti inferiori. La visita specialistica permette di riconoscerne le caratteristiche e definire un percorso di cura personalizzato."
      },
      {
        "title": "Valutazione del linfedema e gonfiore persistente",
        "description": "Il linfedema può causare gonfiore e aumento di volume degli arti. La visita specialistica permette di individuarne le cause e definire il percorso di cura più appropriato."
      },
      {
        "title": "Lipedema o linfedema: riconoscere le differenze",
        "description": "Lipedema e linfedema sono condizioni differenti che possono interessare gli arti. La valutazione specialistica permette di distinguerle e individuare il percorso di cura più adatto."
      },
      {
        "title": "Percorso specialistico per lipedema e linfedema",
        "description": "La valutazione specialistica aiuta a comprendere la condizione e a definire un percorso di cura personalizzato, con eventuali esami e il supporto di più specialisti."
      }
    ],
    "timelineTitle": "Come si svolge la valutazione specialistica?",
    "timelineSteps": [
      {
        "stepNumber": "01",
        "title": "Raccolta della storia clinica",
        "description": "La valutazione specialistica per lipedema e linfedema permette di approfondire le caratteristiche di queste condizioni e individuare il percorso di cura più appropriato. Durante la visita, il medico raccoglie informazioni sui sintomi, sulla storia clinica e sull’evoluzione della condizione, valutando le caratteristiche dei tessuti e le esigenze individuali. Quando necessario, possono essere consigliati ulteriori accertamenti o il coinvolgimento di diversi specialisti, per definire un percorso personalizzato e favorire una gestione completa e coordinata della salute."
      },
      {
        "stepNumber": "02",
        "title": "Esame specialistico",
        "description": "Il medico esamina la distribuzione dei tessuti e i segni clinici, decidendo se siano necessari ulteriori accertamenti. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "stepNumber": "03",
        "title": "Orientamento del percorso",
        "description": "La persona riceve indicazioni sui passaggi successivi e sull’eventuale coinvolgimento di altri specialisti. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "timelineNote": {
      "title": "Ogni pelle è diversa",
      "text": "Il medico valuta la risposta della pelle e definisce l’eventuale necessità di ulteriori sedute o controlli nel tempo."
    },
    "steps": [
      {
        "title": "Raccolta della storia clinica",
        "description": "La valutazione specialistica per lipedema e linfedema permette di approfondire le caratteristiche di queste condizioni e individuare il percorso di cura più appropriato. Durante la visita, il medico raccoglie informazioni sui sintomi, sulla storia clinica e sull’evoluzione della condizione, valutando le caratteristiche dei tessuti e le esigenze individuali. Quando necessario, possono essere consigliati ulteriori accertamenti o il coinvolgimento di diversi specialisti, per definire un percorso personalizzato e favorire una gestione completa e coordinata della salute."
      },
      {
        "title": "Esame specialistico",
        "description": "Il medico esamina la distribuzione dei tessuti e i segni clinici, decidendo se siano necessari ulteriori accertamenti. Tecnica, durata e numero di incontri non sono uguali per tutti: vengono definiti dal professionista in funzione del protocollo effettivamente disponibile e dell’obiettivo clinico."
      },
      {
        "title": "Orientamento del percorso",
        "description": "La persona riceve indicazioni sui passaggi successivi e sull’eventuale coinvolgimento di altri specialisti. Prima di concludere, il medico chiarisce i possibili effetti indesiderati, le indicazioni per i giorni successivi e i segnali per cui è importante contattare lo studio."
      }
    ],
    "results": {
      "title": "Valutazione di lipedema e linfedema: che cosa aspettarsi?",
      "description": "Il primo risultato atteso dalla valutazione è un inquadramento più preciso e la definizione di un percorso appropriato. Non si promette la risoluzione del gonfiore o la guarigione: le opzioni dipendono dalla diagnosi.\n\nIl valore della visita è individuare una direzione appropriata, chiarire i passaggi successivi e riconoscere le situazioni in cui sono necessari altri specialisti. Le decisioni devono essere costruite sulla condizione clinica individuale.\n\nOgni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo.",
      "paragraphs": [
        "Il primo risultato atteso dalla valutazione è un inquadramento più preciso e la definizione di un percorso appropriato. Non si promette la risoluzione del gonfiore o la guarigione: le opzioni dipendono dalla diagnosi.",
        "Il valore della visita è individuare una direzione appropriata, chiarire i passaggi successivi e riconoscere le situazioni in cui sono necessari altri specialisti. Le decisioni devono essere costruite sulla condizione clinica individuale.",
        "Ogni risultato deve essere interpretato alla luce del punto di partenza e della risposta individuale. Durante la consulenza vengono chiariti i limiti della procedura, le possibili alternative e i tempi più appropriati per un eventuale controllo."
      ],
      "image": "/images/trattamenti/medicina-estetica/lipedema-linfedema-napoli-3.jpg"
    },
    "leadForm": {
      "title": "Hai domande sul percorso specialistico?",
      "subtitle": "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
      "cta": "Richiedi ora"
    },
    "faq": [
      {
        "q": "Lipedema e linfedema sono la stessa malattia?",
        "a": "No. Nel lipedema cambia soprattutto la distribuzione del tessuto adiposo; il linfedema riguarda l’accumulo di liquido linfatico."
      },
      {
        "q": "Quale specialista valuta queste condizioni?",
        "a": "Il professionista indicato dipende dai sintomi e dall’organizzazione clinica; Cocoora confermerà i referenti effettivi."
      },
      {
        "q": "La valutazione prevede esami strumentali?",
        "a": "Possono essere necessari in alcuni casi, ma la scelta dipende dal quadro clinico."
      },
      {
        "q": "È possibile avere entrambe le condizioni?",
        "a": "Alcune situazioni possono essere complesse o sovrapposte: serve un inquadramento specialistico."
      }
    ],
    "localSeo": {
      "title": "Valutazione per lipedema e linfedema a Napoli",
      "description": "A Napoli, Cocoora propone un primo confronto specialistico dedicato alla valutazione per lipedema e linfedema. Il medico esamina la richiesta, la storia clinica e le caratteristiche dell’area coinvolta, così da chiarire quali opzioni siano appropriate e quali risultati possano essere realisticamente discussi.\n\nL’inquadramento può richiedere ulteriori accertamenti o il coinvolgimento di più specialisti. Contatta Cocoora per informazioni sulla visita e sull’organizzazione del percorso clinico.",
      "cta": "Richiedi una valutazione"
    }
  }
];
