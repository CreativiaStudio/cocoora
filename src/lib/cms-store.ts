import { DEFAULT_VIDEOS } from "./site";
import { TREATMENTS } from "./content";
import type { CmsState, Faq, SeoPage, VideoItem } from "./types";
import { uid } from "./utils";

const STORAGE_KEY = "cocoora_cms_v4_blocks";

const HOME_FAQ: Faq[] = [
  {
    q: "Cosa offre Cocoora Centro Medico?",
    a: "Un unico hub multidisciplinare con specialisti d'eccellenza, dalla prevenzione quotidiana alla diagnostica avanzata, in un percorso digitale fluido e immediato.",
  },
  {
    q: "Come funziona la prenotazione?",
    a: "Registrati all'app in 2 minuti, scegli specialista, sede e orario, e ricevi referti e documenti digitali in un'area riservata sicura.",
  },
  {
    q: "Cos'è il Cocoora Club?",
    a: "Un programma esclusivo dedicato alla prevenzione costante, con accesso prioritario, check-up dedicati e vantaggi per tutta la famiglia.",
  },
];

function buildTreatmentPages(): SeoPage[] {
  return TREATMENTS.map((t) => ({
    id: `page_trattamento_${t.slug}`,
    path: `/trattamenti/${t.slug}`,
    label: `Trattamento · ${t.title}`,
    title: t.seo?.metaTitle || `${t.title} a Napoli | ${t.tagline}`,
    metaDescription: t.seo?.metaDescription || t.description.slice(0, 155),
    h1: t.title,
    h2: t.tagline,
    faq: t.faq.map((f) => ({ q: f.q, a: f.a })),
    canvasMode: false,
    heroImage: t.heroImage,
    galleryImages: t.galleryImages,
    keywords: t.seo ? [t.seo.keywordMain, t.seo.keywordSec].filter(Boolean).join("; ") : undefined,
    heroCta: "Richiedi una valutazione",

    // Blocco 2 — Che cos'è e come funziona?
    whatIsTitle: t.whatIs?.title || `Che cos'è ${t.title} e come funziona?`,
    whatIsDescription:
      t.whatIs?.paragraphs?.join("\n\n") ||
      t.whatIs?.description ||
      t.description,
    whatIsCallout: t.whatIs?.callout,
    whatIsImage: t.whatIs?.image,

    // Blocco 3 — A cosa serve? (4 card)
    problemsTitle: `A cosa serve ${t.title}?`,
    problemsSubtitle: "Il medico valuta se il percorso è indicato per queste condizioni, definendo obiettivi realistici e personalizzati.",
    problemsGrid: t.problemsGrid?.map((p) => ({ title: p.title, description: p.description, icon: p.icon })),

    // Blocco 4 — Come si svolge una seduta? (3 step)
    timelineTitle: `Come si svolge una seduta di ${t.title}?`,
    timelineSteps:
      t.timelineSteps?.map((s) => ({ stepNumber: s.stepNumber, title: s.title, description: s.description })) ||
      t.steps?.map((s, i) => ({ stepNumber: String(i + 1).padStart(2, "0"), title: s.title, description: s.description })),
    timelineNoteTitle: t.timelineNote?.title || "Ogni persona è diversa",
    timelineNoteText:
      t.timelineNote?.text ||
      "Il medico valuta la risposta individuale e definisce l'eventuale necessità di ulteriori sedute o controlli nel tempo.",

    // Blocco 5 — Quali risultati aspettarsi?
    resultsTitle: t.results?.title || `${t.title}: quali risultati aspettarsi?`,
    resultsDescription:
      t.results?.paragraphs?.join("\n\n") || t.results?.description,
    resultsImage: t.results?.image,

    // Blocco 6 — Form lead dedicato
    leadTitle: t.leadForm?.title || "Hai domande sul trattamento?",
    leadSubtitle:
      t.leadForm?.subtitle ||
      "Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni e aiutarti a organizzare una valutazione medica.",
    leadCta: "Richiedi ora",

    // Blocco 8 — Geo-Local SEO Napoli
    localSeoTitle: t.localSeo?.title || `${t.title} a Napoli`,
    localSeoDescription: t.localSeo?.description,
    localSeoCta: "Richiedi una valutazione",
  }));
}

function buildDefaultPages(): SeoPage[] {
  return [
    {
      id: "page_home",
      path: "/",
      label: "Homepage",
      title: "Cocoora — Centro Medico | Connessi alla tua salute",
      metaDescription:
        "Cocoora è il centro medico che azzera attese, burocrazia e complessità. Prenota in meno di 2 minuti, consulta referti 24/7 e vivi un percorso di salute fluido e immediato.",
      h1: "Connessi alla tua salute.",
      h2: "Il tuo benessere senza ostacoli",
      faq: HOME_FAQ.map((f) => ({ q: f.q, a: f.a })),
      canvasMode: false,
    },
    {
      id: "page_club",
      path: "/club",
      label: "Cocoora Club",
      title: "Cocoora Club — Membership e Percorsi di Prevenzione",
      metaDescription:
        "Scopri i percorsi Cocoora Club e Cocoora Precision: membership annuali con check-up dedicati, accesso prioritario e vantaggi per tutta la famiglia.",
      h1: "Cocoora Club",
      h2: "La salute come stile di vita",
      faq: [
        {
          q: "Le membership Cocoora Club sono trasferibili?",
          a: "No, tutte le membership sono nominative, personali e non trasferibili, salvo i pacchetti Family Care dedicati ai minori.",
        },
        {
          q: "Quanto durano le membership?",
          a: "Le membership hanno durata annuale dalla data di attivazione.",
        },
      ],
      canvasMode: false,
    },
    {
      id: "page_odontoiatria",
      path: "/servizi/odontoiatria",
      label: "Odontoiatria",
      title: "Odontoiatria e Ortodonzia — Cocoora Centro Medico | Allineatori Trasparenti",
      metaDescription:
        "Cura, prevenzione e allineamento del sorriso con un approccio digitale e specialistico a Napoli.",
      h1: "Odontoiatria e ortodonzia presso Cocoora",
      h2: "Ortodonzia Digitale & Allineatori Trasparenti",
      faq: [
        {
          q: "Come funzionano gli allineatori trasparenti?",
          a: "Gli allineatori sono mascherine invisibili rimovibili realizzate su misura a partire da una scansione digitale 3D, progettate dallo specialista in ortodonzia per allineare i denti in modo graduale e confortevole.",
        },
        {
          q: "Quali servizi odontoiatrici offrite?",
          a: "Igiene, conservativa, endodonzia, parodontologia, estetica dentale, implantologia, gnatologia e ortodonzia con allineatori trasparenti per adulti, adolescenti e bambini.",
        },
      ],
      canvasMode: false,
    },
    {
      id: "page_medicina_estetica",
      path: "/servizi/medicina-estetica",
      label: "Medicina Estetica",
      title: "Medicina Estetica — Cocoora Centro Medico | Trattamenti medici e rigenerativi",
      metaDescription:
        "Tecnologie medicali, trattamenti rigenerativi e protocolli personalizzati per valorizzare viso e corpo in modo armonico e naturale.",
      h1: "Medicina estetica presso Cocoora",
      h2: "L'approccio Cocoora",
      faq: [
        {
          q: "Come nasce un trattamento di medicina estetica?",
          a: "Ogni trattamento parte da una valutazione medica e dalla definizione di un piano personalizzato, con attenzione a sicurezza e naturalezza del risultato.",
        },
        {
          q: "Quali tecnologie utilizzate?",
          a: "Cryoliposculpt, ultrasuoni focalizzati CFU, piattaforme laser QS NPP/Erbium/CPL/CO2, iniettivi e biostimolazione.",
        },
      ],
      canvasMode: false,
    },
    {
      id: "page_chi_siamo",
      path: "/chi-siamo",
      label: "Chi Siamo",
      title: "Chi Siamo — La Filosofia Cocoora | Centro Medico Napoli",
      metaDescription:
        "La visione clinica di Cocoora: ascolto empatico, zero burocrazia, sinergia multidisciplinare e medicina rigenerativa. Scopri gli spazi e la direzione sanitaria.",
      h1: "La medicina come dovrebbe essere: umana, immediata, predittiva.",
      h2: "La Filosofia Cocoora",
      faq: [
        {
          q: "Cos'è la filosofia del Centro Cocoora?",
          a: "È il nostro modello di presa in carico integrata: un centro multidisciplinare che ti ascolta, ti orienta e ti accompagna nel tempo, eliminando l'ansia e la frammentazione della sanità tradizionale.",
        },
        {
          q: "Come garantite la qualità clinica?",
          a: "Attraverso un Comitato Clinico e una Direzione Sanitaria che supervisionano rigore, sicurezza farmacologica e continuità terapeutica in ogni branca.",
        },
      ],
      canvasMode: false,
    },
    {
      id: "page_diagnostica",
      path: "/servizi/diagnostica",
      label: "Diagnostica",
      title: "Visite Specialistiche & Diagnostica — Cocoora Centro Medico | Napoli",
      metaDescription:
        "Cardiologia, senologia, ecografia, oculistica, pediatria e ginecologia: diagnostica dedicata, refertazione digitale e specialisti coordinati su appuntamento.",
      h1: "Diagnostica dedicata, refertazione digitale e specialisti di riferimento.",
      h2: "Visite Specialistiche e Diagnostica",
      faq: [
        {
          q: "Serve l'impegnativa del medico di base per prenotare?",
          a: "No, presso Cocoora puoi prenotare visite specialistiche ed esami diagnostici in regime privato su appuntamento dedicato, senza impegnativa.",
        },
        {
          q: "Quanto tempo occorre per ricevere il referto?",
          a: "I referti digitali sono disponibili nella tua area riservata, generalmente entro 24/48 ore dall'esame, consultabili h24 da smartphone.",
        },
      ],
      canvasMode: false,
    },
    {
      id: "page_precision",
      path: "/precision",
      label: "Cocoora Precision",
      title: "Cocoora Precision — Genomica, Microbiota & Longevità",
      metaDescription:
        "Skin Precision, Nutri Precision e Donna Precision: percorsi di medicina predittiva con test genetici DNA 5 e sequenziamento del microbiota NGS.",
      h1: "Conosci il tuo codice biologico, progetta il tuo futuro in salute.",
      h2: "Medicina Predittiva e Longevity",
      faq: [
        {
          q: "Cos'è il test DNA 5?",
          a: "Un pannello genetico mirato su 5 aree biologiche (es. metabolismo, infiammazione, anti-aging) che orienta la prevenzione e i protocolli personalizzati.",
        },
        {
          q: "Come funziona il test del microbiota?",
          a: "Ricevi un kit di prelievo non invasivo da usare a domicilio, lo spedisci al laboratorio partner e ricevi un referto clinico con consulenza medica di lettura.",
        },
      ],
      canvasMode: false,
    },
    {
      id: "page_contatti",
      path: "/contatti",
      label: "Contatti",
      title: "Contatti & Prenotazioni — Cocoora Centro Medico Napoli",
      metaDescription:
        "Prenota la tua visita presso Cocoora Centro Medico: indirizzo Napoli, telefono, email istituzionali, orario continuato e form di richiesta appuntamento.",
      h1: "Prenota la tua visita in meno di 2 minuti.",
      h2: "Contatti & Prenotazioni",
      faq: [
        {
          q: "Quali sono gli orari di apertura?",
          a: "Siamo aperti dal Lunedì al Venerdì dalle 8:00 alle 20:00 (orario continuato) e il Sabato dalle 9:00 alle 14:00.",
        },
        {
          q: "Come posso raggiungervi con i mezzi pubblici?",
          a: "Il centro medico è comodamente raggiungibile con la metropolitana e dispone di parcheggi convenzionati nelle vicinanze per chi arriva in auto.",
        },
      ],
      canvasMode: false,
    },
    ...buildTreatmentPages(),
  ];
}

export function buildInitialState(): CmsState {
  return {
    videos: DEFAULT_VIDEOS.map((v) => ({ ...v })),
    pages: buildDefaultPages(),
  };
}

// Snapshot stabile per il server (usato anche durante l'hydration lato client).
const SERVER_SNAPSHOT: CmsState = buildInitialState();

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const ls = window.localStorage;
    if (!ls) return false;
    // Guard esplicita: in alcuni ambienti Node (es. con --localstorage-file)
    // localStorage esiste come oggetto ma i metodi non sono funzioni native.
    if (typeof ls.getItem !== "function") return false;
    if (typeof ls.setItem !== "function") return false;
    const test = "__test__";
    ls.setItem(test, test);
    ls.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function loadStoredState(): CmsState | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CmsState>;
    const initial = buildInitialState();
    const storedVideos = parsed.videos?.map((v) => {
      const fallback = initial.videos.find((d) => d.id === v.id);
      return fallback && !v.url ? { ...fallback, visible: v.visible } : v;
    });
    const storedPages = initial.pages.map((initialPage) => {
      const stored = parsed.pages?.find((p) => p.id === initialPage.id);
      if (!stored) return initialPage;
      return { ...initialPage, ...stored };
    });

    return {
      videos: storedVideos ?? initial.videos,
      pages: storedPages,
    };
  } catch {
    return null;
  }
}

type Listener = () => void;

class CmsStore {
  private state: CmsState = SERVER_SNAPSHOT;
  private listeners = new Set<Listener>();
  private hydrated = false;

  getState(): CmsState {
    return this.state;
  }

  getServerSnapshot(): CmsState {
    return SERVER_SNAPSHOT;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  hydrate() {
    if (this.hydrated || !isLocalStorageAvailable()) return;
    this.hydrated = true;
    const stored = loadStoredState();
    if (stored) {
      this.state = stored;
      this.listeners.forEach((l) => l());
    }
  }

  private setState(next: CmsState) {
    this.state = next;
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full / unavailable — ignore
      }
    }
    this.listeners.forEach((l) => l());
  }

  // ── Videos ──────────────────────────────────────────────────────────
  addVideo(video: Omit<VideoItem, "id">) {
    const next: VideoItem = { ...video, id: uid("video") };
    this.setState({ ...this.state, videos: [...this.state.videos, next] });
  }

  updateVideo(id: string, patch: Partial<VideoItem>) {
    this.setState({
      ...this.state,
      videos: this.state.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    });
  }

  deleteVideo(id: string) {
    this.setState({
      ...this.state,
      videos: this.state.videos.filter((v) => v.id !== id),
    });
  }

  // ── SEO Pages ───────────────────────────────────────────────────────
  updatePage(id: string, patch: Partial<SeoPage>) {
    this.setState({
      ...this.state,
      pages: this.state.pages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  }

  reset() {
    this.setState(buildInitialState());
  }
}

export const cmsStore = new CmsStore();

export function getPageByPath(path: string): SeoPage | undefined {
  return cmsStore.getState().pages.find((p) => p.path === path);
}

export function getVisibleVideos(): VideoItem[] {
  return cmsStore.getState().videos.filter((v) => v.visible);
}

// Predisposizione Supabase — in V2 il persist verrà spostato su Supabase
// (tabella `cms_content`), mantenendo invariata l'interfaccia del cms-store.
export const SUPABASE_READY = false;
