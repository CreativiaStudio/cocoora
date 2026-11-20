import { DEFAULT_VIDEOS } from "./site";
import { CLUB_TIERS, TREATMENTS, VISITE_SPECIALISTICHE } from "./content";
import { slugifyReelTitle } from "./reels-utils";
import type { CmsState, Faq, SeoPage, SeoRedirect, VideoItem } from "./types";
import { uid } from "./utils";

const STORAGE_KEY = "cocoora_cms_v6_cloud";

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
    schemaType: "MedicalProcedure",
    focusKeyword: t.seo?.keywordMain || `${t.title} Napoli`,
    ogImage: t.heroImage,
    heroImage: t.heroImage,
    galleryImages: t.galleryImages,
    keywords: t.seo ? [t.seo.keywordMain, t.seo.keywordSec].filter(Boolean).join("; ") : undefined,
    heroCta: t.heroCta || "Iscriviti gratuitamente al Cocoora Club",

    // Blocco 2 — Che cos'è e come funziona?
    whatIsTitle: t.whatIs?.title || `Che cos'è ${t.title} e come funziona?`,
    whatIsDescription:
      t.whatIs?.paragraphs?.join("\n\n") ||
      t.whatIs?.description ||
      t.description,
    whatIsCallout: t.whatIs?.callout,
    whatIsImage: t.whatIs?.image,

    // Blocco 3 — A cosa serve? (4 card)
    problemsTitle: t.problemsTitle || `A cosa serve ${t.title}?`,
    problemsSubtitle:
      t.problemsSubtitle ||
      "Il medico valuta se il percorso è indicato per queste condizioni, definendo obiettivi realistici e personalizzati.",
    problemsGrid: t.problemsGrid?.map((p) => ({
      title: p.title,
      description: p.description,
      icon: p.icon,
    })),

    // Blocco 4 — Come si svolge una seduta? (3 step)
    timelineTitle: t.timelineTitle || `Come si svolge una seduta di ${t.title}?`,
    timelineSteps:
      t.timelineSteps?.map((s) => ({
        stepNumber: s.stepNumber,
        title: s.title,
        description: s.description,
      })) ||
      t.steps?.map((s, i) => ({
        stepNumber: String(i + 1).padStart(2, "0"),
        title: s.title,
        description: s.description,
      })),
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
    localSeoCta: t.localSeo?.cta || "Iscriviti gratuitamente al Cocoora Club",
  }));
}

function buildVisitaPages(): SeoPage[] {
  return VISITE_SPECIALISTICHE.map((v) => ({
    id: `page_visita_${v.slug}`,
    path: `/visite/${v.slug}`,
    label: `Visita · ${v.title}`,
    title: v.seo?.metaTitle || `${v.title} a Napoli — Visite Specialistiche | Cocoora`,
    metaDescription: (v.seo?.metaDescription || v.tagline || v.description).slice(0, 158),
    h1: `${v.title} a Napoli`,
    h2: v.tagline,
    faq: v.faq.map((f) => ({ q: f.q, a: f.a })),
    canvasMode: false,
    schemaType: "MedicalSpecialty",
    focusKeyword: v.seo?.keywordMain || `${v.title} Napoli`,
    keywords: v.seo ? [v.seo.keywordMain, v.seo.keywordSec].filter(Boolean).join("; ") : undefined,
    heroImage: v.heroImage,
    ogImage: v.heroImage,
    galleryImages: v.galleryImages,
    heroCta: v.heroCta || "Iscriviti gratuitamente al Cocoora Club",
    whatIsTitle: v.whatIs?.title,
    whatIsDescription: v.whatIs?.paragraphs?.join("\n\n") || v.whatIs?.description,
    whatIsImage: v.whatIs?.image,
    problemsTitle: v.problemsTitle,
    problemsSubtitle: v.problemsSubtitle,
    problemsGrid: v.problemsGrid,
    timelineTitle: v.timelineTitle,
    timelineSteps: v.timelineSteps,
    resultsTitle: v.results?.title,
    resultsDescription: v.results?.paragraphs?.join("\n\n") || v.results?.description,
    resultsImage: v.results?.image,
    leadTitle: v.leadForm?.title,
    leadSubtitle: v.leadForm?.subtitle,
    leadCta: v.leadForm?.cta || "Richiedi ora",
    localSeoTitle: v.localSeo?.title,
    localSeoDescription: v.localSeo?.description,
    localSeoCta: v.localSeo?.cta,
  }));
}

function buildClubTierPages(): SeoPage[] {
  return CLUB_TIERS.map((tier) => ({
    id: `page_club_${tier.id}`,
    path: `/club/${tier.id}`,
    label: `Percorso Club · ${tier.name}`,
    title: `${tier.name} — Cocoora Club | Percorsi Salute a Napoli`,
    metaDescription: tier.description.slice(0, 158),
    h1: `Percorso ${tier.name}`,
    h2: tier.description,
    faq: [],
    canvasMode: false,
    schemaType: "WebPage",
    focusKeyword: `Cocoora Club ${tier.name} Napoli`,
    ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-14.webp",
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
        "Cocoora è il centro medico a Napoli che azzera attese, burocrazia e complessità. Prenota in meno di 2 minuti, consulta referti 24/7 e vivi un percorso di salute fluido.",
      h1: "Connessi alla tua salute.",
      h2: "Il tuo benessere senza ostacoli",
      faq: HOME_FAQ.map((f) => ({ q: f.q, a: f.a })),
      canvasMode: false,
      schemaType: "MedicalClinic",
      focusKeyword: "centro medico Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-1.webp",
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
      schemaType: "WebPage",
      focusKeyword: "Cocoora Club prevenzione Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-20.webp",
    },
    {
      id: "page_odontoiatria",
      path: "/servizi/odontoiatria",
      label: "Odontoiatria",
      title: "Odontoiatria e Ortodonzia — Cocoora Centro Medico | Allineatori Trasparenti",
      metaDescription:
        "Cura, prevenzione e allineamento del sorriso con un approccio digitale e specialistico a Napoli.",
      h1: "Il tuo sorriso, la nostra visione.",
      h2: "La bellezza si riconosce. La competenza si sente. La salute si costruisce nel tempo.",
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
      schemaType: "MedicalSpecialty",
      focusKeyword: "odontoiatria ortodonzia Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
    },
    {
      id: "page_medicina_estetica",
      path: "/servizi/medicina-estetica",
      label: "Medicina Estetica",
      title: "Medicina Estetica — Cocoora Centro Medico | Trattamenti medici e rigenerativi",
      metaDescription:
        "Tecnologie medicali, trattamenti rigenerativi e protocolli personalizzati per valorizzare viso e corpo in modo armonico e naturale.",
      h1: "Da dove vuoi iniziare?",
      h2: "Ogni persona ha esigenze diverse. Esplora i trattamenti Cocoora partendo da ciò che vorresti migliorare.",
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
      schemaType: "MedicalSpecialty",
      focusKeyword: "medicina estetica Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/aesthetic-skin.jpg",
    },
    {
      id: "page_chi_siamo",
      path: "/chi-siamo",
      label: "Il Centro (Chi Siamo)",
      title: "Il Centro — La Filosofia Cocoora | Centro Medico Napoli",
      metaDescription:
        "La visione clinica di Cocoora: ascolto empatico, zero burocrazia, sinergia multidisciplinare e medicina rigenerativa. Scopri gli spazi e la direzione sanitaria.",
      h1: "Connessi alla tua salute",
      h2: "La tua salute, la nostra Attenzione",
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
      schemaType: "MedicalClinic",
      focusKeyword: "Cocoora Centro Medico Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-1.webp",
    },
    {
      id: "page_diagnostica",
      path: "/servizi/diagnostica",
      label: "Visite Specialistiche & Diagnostica",
      title: "Visite Specialistiche & Diagnostica — Cocoora Centro Medico | Napoli",
      metaDescription:
        "Cardiologia, senologia, ecografia, oculistica, pediatria e ginecologia: diagnostica dedicata, refertazione digitale e specialisti coordinati su appuntamento.",
      h1: "Diagnostica rapida, refertazione digitale e specialisti dedicati.",
      h2: "Un unico centro, sei branche specialistiche",
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
      schemaType: "MedicalSpecialty",
      focusKeyword: "visite specialistiche diagnostica Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/diagnostics-lab.jpg",
    },
    {
      id: "page_precision",
      path: "/precision",
      label: "Cocoora Precision",
      title: "Cocoora Precision — Genomica, Microbiota & Longevità",
      metaDescription:
        "Skin Precision, Nutri Precision e Donna Precision: percorsi di medicina predittiva con test genetici DNA 5 e sequenziamento del microbiota NGS.",
      h1: "La biologia individuale, letta con precisione.",
      h2: "Due mappe, un unico disegno biologico.",
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
      schemaType: "WebPage",
      focusKeyword: "medicina predittiva DNA microbiota Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/dna-genomics.jpg",
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
          a: "Siamo aperti dal Lunedì al Venerdì dalle 9:00 alle 19:00 (orario continuato). Il Sabato la struttura è chiusa.",
        },
        {
          q: "Come posso raggiungervi con i mezzi pubblici?",
          a: "Il centro medico è comodamente raggiungibile con la metropolitana e dispone di parcheggi convenzionati nelle vicinanze per chi arriva in auto.",
        },
      ],
      canvasMode: false,
      schemaType: "MedicalClinic",
      focusKeyword: "contatti Cocoora Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-18.webp",
    },
    {
      id: "page_trattamenti_hub",
      path: "/trattamenti",
      label: "Indice Trattamenti",
      title: "Tutti i Trattamenti — Medicina Estetica e Odontoiatria | Cocoora Napoli",
      metaDescription:
        "Esplora l'elenco completo dei trattamenti di medicina estetica rigenerativa, laser medicali e odontoiatria specialistica disponibili da Cocoora a Napoli.",
      h1: "Medicina Estetica, Odontoiatria e Visite Specialistiche",
      h2: "Guida ai Percorsi Clinici",
      faq: [],
      canvasMode: false,
      schemaType: "WebPage",
      focusKeyword: "trattamenti medicina estetica odontoiatria Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/laser-technology.jpg",
    },
    {
      id: "page_visite_hub",
      path: "/visite",
      label: "Indice Visite Specialistiche",
      title: "Visite Specialistiche Private a Napoli | Cocoora Centro Medico",
      metaDescription:
        "Tutte le branche specialistiche Cocoora a Napoli: cardiologia, ginecologia, pediatria, dermatologia, nutrizione, oculistica, senologia ed ecografia.",
      h1: "Visite Specialistiche Private a Napoli",
      h2: "Tutte le visite specialistiche",
      faq: [],
      canvasMode: false,
      schemaType: "MedicalSpecialty",
      focusKeyword: "visite specialistiche private Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-8.webp",
    },
    {
      id: "page_medici",
      path: "/medici",
      label: "Équipe Medica (I Medici)",
      title: "I Medici & Specialisti — Équipe Clinica Cocoora Napoli",
      metaDescription:
        "Conosci gli specialisti e i docenti universitari dell'équipe Cocoora a Napoli sotto la Direzione Sanitaria della Dott.ssa Elisa Russo.",
      h1: "I Nostri Specialisti",
      h2: "Un'équipe multidisciplinare al servizio della tua salute",
      faq: [],
      canvasMode: false,
      schemaType: "Physician",
      focusKeyword: "medici specialisti Cocoora Napoli",
      ogImage: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-14.webp",
    },
    ...buildClubTierPages(),
    ...buildTreatmentPages(),
    ...buildVisitaPages(),
  ];
}

export function buildInitialState(): CmsState {
  return {
    videos: DEFAULT_VIDEOS.map((v) => ({ ...v })),
    pages: buildDefaultPages(),
    redirects: [],
  };
}

const SERVER_SNAPSHOT: CmsState = buildInitialState();

export type CmsSyncStatus = "idle" | "saving" | "saved" | "error";

export type CmsSyncMeta = {
  status: CmsSyncStatus;
  lastSavedAt?: string;
  error?: string;
  storage?: string;
};

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const ls = window.localStorage;
    if (!ls) return false;
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
      redirects: Array.isArray(parsed.redirects) ? parsed.redirects : [],
    };
  } catch {
    return null;
  }
}

type Listener = () => void;

class CmsStore {
  private state: CmsState = SERVER_SNAPSHOT;
  private listeners = new Set<Listener>();
  private syncListeners = new Set<Listener>();
  private hydrated = false;
  private syncMeta: CmsSyncMeta = { status: "idle" };
  private pageTimers = new Map<string, ReturnType<typeof setTimeout>>();

  getState(): CmsState {
    return this.state;
  }

  getServerSnapshot(): CmsState {
    return SERVER_SNAPSHOT;
  }

  getSyncMeta(): CmsSyncMeta {
    return this.syncMeta;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeSync(listener: Listener): () => void {
    this.syncListeners.add(listener);
    return () => this.syncListeners.delete(listener);
  }

  private setSyncMeta(next: CmsSyncMeta) {
    this.syncMeta = next;
    this.syncListeners.forEach((l) => l());
  }

  async hydrate() {
    if (this.hydrated) return;
    this.hydrated = true;

    if (isLocalStorageAvailable()) {
      const stored = loadStoredState();
      if (stored) {
        this.state = stored;
        this.listeners.forEach((l) => l());
      }
    }

    if (typeof window === "undefined") return;
    try {
      const res = await fetch("/api/cms", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.ok && data?.state) {
        const initial = buildInitialState();
        const serverVideos: VideoItem[] = Array.isArray(data.state.videos)
          ? data.state.videos
          : initial.videos;
        const serverPagesInput: SeoPage[] = Array.isArray(data.state.pages)
          ? data.state.pages
          : initial.pages;
        const mergedPages = initial.pages.map((base) => {
          const match = serverPagesInput.find((p) => p.id === base.id || p.path === base.path);
          return match ? { ...base, ...match } : base;
        });
        const serverRedirects: SeoRedirect[] = Array.isArray(data.state.redirects)
          ? data.state.redirects
          : [];

        const nextState: CmsState = {
          videos: serverVideos,
          pages: mergedPages,
          redirects: serverRedirects,
        };
        this.setState(nextState, false);
        this.setSyncMeta({
          status: "saved",
          lastSavedAt: new Date().toISOString(),
          storage: "supabase",
        });
      }
    } catch {
      // Fallback silenzioso su local/default se offline
    }
  }

  private setState(next: CmsState, writeLocal = true) {
    this.state = next;
    if (writeLocal && isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full / unavailable — ignore
      }
    }
    this.listeners.forEach((l) => l());
  }

  private async persistToServer(payload: Record<string, unknown>) {
    if (typeof window === "undefined") return;
    this.setSyncMeta({ ...this.syncMeta, status: "saving", error: undefined });
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        this.setSyncMeta({
          status: "error",
          error: data?.error || `Errore salvataggio (${res.status})`,
        });
        return false;
      }
      this.setSyncMeta({
        status: "saved",
        lastSavedAt: data.savedAt || new Date().toISOString(),
        storage: data.storage || "supabase",
      });
      return true;
    } catch (err) {
      this.setSyncMeta({
        status: "error",
        error: err instanceof Error ? err.message : "Errore di rete durante il salvataggio.",
      });
      return false;
    }
  }

  // ── Videos ──────────────────────────────────────────────────────────
  addVideo(video: Omit<VideoItem, "id">): VideoItem {
    const id = uid("video");
    const slug = (video.slug && slugifyReelTitle(video.slug)) || slugifyReelTitle(video.title || id);
    const next: VideoItem = {
      ...video,
      id,
      slug,
      createdAt: video.createdAt || new Date().toISOString(),
    };
    const videos = [...this.state.videos, next];
    this.setState({ ...this.state, videos });
    void this.persistToServer({ section: "videos", videos });
    return next;
  }

  updateVideo(id: string, patch: Partial<VideoItem>) {
    const videos = this.state.videos.map((v) => {
      if (v.id !== id) return v;
      const merged = { ...v, ...patch };
      if (patch.slug !== undefined) {
        merged.slug = patch.slug.trim() ? slugifyReelTitle(patch.slug) : slugifyReelTitle(merged.title || id);
      } else if (!merged.slug) {
        merged.slug = slugifyReelTitle(merged.title || id);
      }
      return merged;
    });
    this.setState({ ...this.state, videos });
    void this.persistToServer({ section: "videos", videos });
  }

  deleteVideo(id: string) {
    const videos = this.state.videos.filter((v) => v.id !== id);
    this.setState({ ...this.state, videos });
    void this.persistToServer({ section: "videos", videos });
  }

  reorderVideos(id: string, direction: "up" | "down") {
    const idx = this.state.videos.findIndex((v) => v.id === id);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= this.state.videos.length) return;
    const copy = [...this.state.videos];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    this.setState({ ...this.state, videos: copy });
    void this.persistToServer({ section: "videos", videos: copy });
  }

  // ── SEO Pages ───────────────────────────────────────────────────────
  updatePage(id: string, patch: Partial<SeoPage>) {
    const nextPages = this.state.pages.map((p) => (p.id === id ? { ...p, ...patch } : p));
    this.setState({ ...this.state, pages: nextPages });
    const updatedPage = nextPages.find((p) => p.id === id);
    if (!updatedPage) return;

    this.setSyncMeta({ ...this.syncMeta, status: "saving", error: undefined });
    const existingTimer = this.pageTimers.get(id);
    if (existingTimer) clearTimeout(existingTimer);
    const timer = setTimeout(() => {
      this.pageTimers.delete(id);
      void this.persistToServer({ section: "page", page: updatedPage });
    }, 600);
    this.pageTimers.set(id, timer);
  }

  async savePageNow(page?: SeoPage): Promise<boolean> {
    const target = page || this.state.pages[0];
    if (!target) return false;
    const existingTimer = this.pageTimers.get(target.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.pageTimers.delete(target.id);
    }
    const ok = await this.persistToServer({ section: "page", page: target });
    return Boolean(ok);
  }

  // ── SEO Redirects ───────────────────────────────────────────────────
  addRedirect(input: Omit<SeoRedirect, "id" | "createdAt">) {
    const normalizePath = (p: string) => {
      const trimmed = p.trim();
      if (!trimmed) return "/";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    };
    const next: SeoRedirect = {
      ...input,
      source: normalizePath(input.source),
      destination: normalizePath(input.destination),
      id: uid("redir"),
      createdAt: new Date().toISOString(),
    };
    const redirects = [next, ...(this.state.redirects ?? [])];
    this.setState({ ...this.state, redirects });
    void this.persistToServer({ section: "redirects", redirects });
  }

  updateRedirect(id: string, patch: Partial<SeoRedirect>) {
    const redirects = (this.state.redirects ?? []).map((r) =>
      r.id === id ? { ...r, ...patch } : r
    );
    this.setState({ ...this.state, redirects });
    void this.persistToServer({ section: "redirects", redirects });
  }

  deleteRedirect(id: string) {
    const redirects = (this.state.redirects ?? []).filter((r) => r.id !== id);
    this.setState({ ...this.state, redirects });
    void this.persistToServer({ section: "redirects", redirects });
  }

  reset() {
    const initial = buildInitialState();
    this.setState(initial);
    void this.persistToServer({ section: "videos", videos: initial.videos });
    void this.persistToServer({ section: "redirects", redirects: [] });
  }
}

export const cmsStore = new CmsStore();

export function getPageByPath(path: string): SeoPage | undefined {
  return cmsStore.getState().pages.find((p) => p.path === path);
}

export function getVisibleVideos(): VideoItem[] {
  return cmsStore.getState().videos.filter((v) => v.visible);
}

export const SUPABASE_READY = true;
