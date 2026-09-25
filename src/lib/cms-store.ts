import { DEFAULT_VIDEOS } from "./site";
import { TREATMENTS } from "./content";
import type { CmsState, Faq, SeoPage, VideoItem } from "./types";
import { uid } from "./utils";

const STORAGE_KEY = "cocoora_cms_v1";

const HOME_FAQ: Faq[] = [
  {
    q: "Cosa offre Cocoora Studio Medico Polispecialistico?",
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
    title: `${t.title} a Cocoora | ${t.tagline}`,
    metaDescription: t.description.slice(0, 155),
    h1: t.title,
    h2: t.tagline,
    faq: t.faq.map((f) => ({ q: f.q, a: f.a })),
    canvasMode: false,
  }));
}

function buildDefaultPages(): SeoPage[] {
  return [
    {
      id: "page_home",
      path: "/",
      label: "Homepage",
      title: "Cocoora — Studio Medico Polispecialistico | Connessi alla tua salute",
      metaDescription:
        "Cocoora è lo studio medico polispecialistico che azzera attese, burocrazia e complessità. Prenota in meno di 2 minuti, consulta referti 24/7 e vivi un percorso di salute fluido e immediato.",
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
      title: "Odontoiatria e Ortodonzia a Cocoora | Invisalign Diamond Provider",
      metaDescription:
        "Cura, prevenzione e allineamento del sorriso con un approccio digitale. Cocoora è Invisalign Diamond Provider.",
      h1: "Odontoiatria e ortodonzia a Cocoora",
      h2: "Cocoora è Invisalign Diamond Provider",
      faq: [
        {
          q: "Cosa significa essere Invisalign Diamond Provider?",
          a: "Significa avere un'esperienza consolidata nella pianificazione e gestione dei percorsi di allineamento con la tecnologia Invisalign.",
        },
        {
          q: "Quali servizi odontoiatrici offrite?",
          a: "Igiene, conservativa, endodonzia, parodontologia, estetica dentale, implantologia, gnatologia e ortodonzia Invisalign per adulti, adolescenti e bambini.",
        },
      ],
      canvasMode: false,
    },
    {
      id: "page_medicina_estetica",
      path: "/servizi/medicina-estetica",
      label: "Medicina Estetica",
      title: "Medicina Estetica a Cocoora | Trattamenti medici e rigenerativi",
      metaDescription:
        "Tecnologie medicali, trattamenti rigenerativi e protocolli personalizzati per valorizzare viso e corpo in modo armonico e naturale.",
      h1: "Medicina estetica a Cocoora",
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
      title: "Chi Siamo — Il Metodo Cocoora | Studio Medico Polispecialistico Napoli",
      metaDescription:
        "La visione clinica di Cocoora: Amico Medico, zero burocrazia, sinergia multidisciplinare e medicina rigenerativa. Scopri gli spazi e la direzione sanitaria.",
      h1: "La medicina come dovrebbe essere: umana, immediata, predittiva.",
      h2: "Il Metodo Cocoora",
      faq: [
        {
          q: "Cos'è il concetto di 'Amico Medico'?",
          a: "È il punto di riferimento fidato che ti ascolta, ti orienta e ti accompagna nel tempo, eliminando l'ansia e la frammentazione della sanità tradizionale.",
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
      title: "Diagnostica & Poliambulatorio a Cocoora | Napoli",
      metaDescription:
        "Cardiologia, senologia, ecografia, oculistica, pediatria e ginecologia: diagnostica rapida, refertazione digitale e specialisti dedicati, senza liste d'attesa.",
      h1: "Diagnostica rapida, refertazione digitale e specialisti dedicati.",
      h2: "Poliambulatorio Specialistico",
      faq: [
        {
          q: "Serve l'impegnativa del medico di base per prenotare?",
          a: "No, presso Cocoora puoi prenotare visite specialistiche ed esami diagnostici anche in regime privato, senza impegnativa e senza liste d'attesa.",
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
      title: "Contatti & Prenotazioni — Cocoora Studio Medico Napoli",
      metaDescription:
        "Prenota la tua visita a Cocoora: indirizzo Napoli, telefono, email, orari di apertura e form di richiesta prenotazione. Rispondiamo in meno di 2 minuti.",
      h1: "Prenota la tua visita in meno di 2 minuti.",
      h2: "Contatti & Prenotazioni",
      faq: [
        {
          q: "Quali sono gli orari di apertura?",
          a: "Siamo aperti dal Lunedì al Venerdì dalle 8:00 alle 20:00 e il Sabato dalle 9:00 alle 14:00.",
        },
        {
          q: "Come posso raggiungervi con i mezzi pubblici?",
          a: "Lo studio è comodamente raggiungibile con la metropolitana e dispone di parcheggi convenzionati nelle vicinanze per chi arriva in auto.",
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
    if (!window.localStorage) return false;
    const test = "__test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
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
    return {
      videos: parsed.videos ?? initial.videos,
      pages: parsed.pages ?? initial.pages,
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
