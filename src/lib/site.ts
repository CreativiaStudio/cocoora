import type { InstagramPost, NavNode, ServiceArea, VideoItem } from "./types";

export const SITE = {
  name: "Cocoora",
  fullName: "Cocoora Studio Medico Polispecialistico",
  claim: "Connessi alla tua salute.",
  phone: "081 18182091",
  phoneRaw: "08118182091",
  email: "hello@cocoora.it",
  address: "Via Generale Giovanni De Bonis, 81",
  zip: "80123",
  city: "Napoli",
  fullAddress: "Via Generale Giovanni De Bonis, 81 - 80123 Napoli",
  whatsapp: "https://wa.me/3908118182091",
  instagram: "https://www.instagram.com/",
  hours: "Lun–Ven · 8:00–20:00 — Sab · 9:00–14:00",
};

export const NAV_NODES: NavNode[] = [
  {
    label: "Visite & Trattamenti",
    children: [
      {
        label: "Odontoiatria & Ortodonzia Digitale",
        href: "/servizi/odontoiatria",
        description: "Invisalign Diamond Provider, implantologia guidata e salute orale senza attese.",
        image: "/images/invisalign-smile.jpg",
      },
      {
        label: "Medicina Estetica & Rigenerativa",
        href: "/servizi/medicina-estetica",
        description: "Laser medicali, iniettivi naturali, Cryoliposculpt e protocolli su misura per viso e corpo.",
        image: "/images/aesthetic-skin.jpg",
      },
      {
        label: "Poliambulatorio & Visite Specialistiche",
        href: "/visite",
        description: "Cardiologia, Ginecologia, Senologia, Ecografia, Pediatria e Oculistica — prima visita entro 72h.",
        image: "/images/diagnostics-lab.jpg",
      },
      {
        label: "Tutti i Trattamenti Specialistici",
        href: "/trattamenti",
        description: "Panoramica di tutti i 19 trattamenti specialistici disponibili nel nostro centro.",
      },
    ],
  },
  {
    label: "I Medici",
    children: [
      {
        label: "Tutta l'Équipe Specialistica",
        href: "/medici",
        description: "Medici con cattedre universitarie e convenzioni ospedaliere a Napoli (Federico II, Vanvitelli, Cardarelli).",
        image: "/images/doctor-consultation.jpg",
      },
      {
        label: "Zero Liste d'Attesa",
        href: "/medici",
        description: "Visite specialistiche garantite entro 72 ore con i massimi docenti universitari, senza le attese del SSN.",
      },
      {
        label: "Il Metodo «Amico Medico»",
        href: "/chi-siamo",
        description: "Tempo dedicato alla persona, ascolto clinico empatico e un unico punto di riferimento per la tua salute.",
      },
    ],
  },
  {
    label: "Lo Studio",
    children: [
      {
        label: "Chi Siamo & La Visione",
        href: "/chi-siamo",
        description: "Il nostro polo polispecialistico a Napoli: standard di clinica svizzera, privacy e zero burocrazia.",
        image: "/images/clinic-lounge.jpg",
      },
      {
        label: "La Sede di Napoli (Via De Bonis 81)",
        href: "/contatti",
        description: "Posillipo / Fuorigrotta: ambienti moderni, accoglienza riservata, orari comodi e facilità di parcheggio.",
      },
      {
        label: "Tecnologie 3D & Laser Medicali",
        href: "/servizi/diagnostica",
        description: "Scanner intraorale iTero, ecografia HD, piattaforma laser multi-lunghezza d'onda.",
      },
    ],
  },
  {
    label: "Piani Salute",
    children: [
      {
        label: "Cocoora Club (Membership Annuali)",
        href: "/club",
        description: "Discover 0€, Access, Care da 29€/mese e Signature: visite e check-up inclusi tutto l'anno.",
        image: "/images/hero-clinic.jpg",
      },
      {
        label: "Cocoora Precision (Genomica & Longevità)",
        href: "/precision",
        description: "Test DNA 5 predittivo e sequenziamento del microbiota intestinale per una longevità attiva.",
        image: "/images/dna-genomics.jpg",
      },
      {
        label: "Family Care & Minori",
        href: "/club",
        description: "Piani integrati di prevenzione per bambini e ragazzi con ortodonzia e visite pediatriche.",
      },
    ],
  },
];

export const NAV_LINKS = [
  { label: "Visite & Trattamenti", href: "/#servizi" },
  { label: "I Medici", href: "/medici" },
  { label: "Lo Studio", href: "/chi-siamo" },
  { label: "Piani Salute", href: "/club" },
  { label: "Contatti", href: "/contatti" },
];

export const TRUST_METRICS = [
  { value: "< 2 min", label: "Prenotazione" },
  { value: "15+", label: "Specialisti" },
  { value: "24/7", label: "Referti" },
];

export const MANIFESTO = {
  h2: "Il tuo benessere senza ostacoli",
  paragraphs: [
    "Il nostro centro supera l'idea tradizionale di visita medica. Qui l'efficienza non è solo organizzazione, è la cornice che permette alla medicina di esprimersi al meglio.",
    "Abbiamo azzerato attese, burocrazia e complessità per permetterti di vivere un percorso di salute fluido e immediato. Dedichiamo ogni risorsa, ogni spazio e ogni tecnologia alla qualità del rapporto tra te e il tuo specialista.",
    "La tua salute merita attenzione, dedizione e, soprattutto, nessun ostacolo.",
  ],
};

export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: "benessere",
    title: "Benessere e Cura del Sé",
    description: "L'attenzione alla persona, dall'estetica alla salute orale.",
    items: ["Odontoiatria", "Medicina Estetica", "Dermatologia", "Chirurgia Plastica"],
  },
  {
    id: "diagnostica",
    title: "Diagnostica e Prevenzione",
    description: "Per chi vuole chiarezza, controllo e monitoraggio.",
    items: [
      "Radiologia",
      "Cardiologia",
      "Neurologia",
      "Endocrinologia",
      "Diabetologia",
      "Oftalmologia",
    ],
  },
  {
    id: "famiglia",
    title: "Specialistiche per la Famiglia",
    description: "Percorsi dedicati a ogni età e fase della vita.",
    items: [
      "Pediatria",
      "Senologia",
      "Ginecologia",
      "Urologia",
      "Geriatria",
      "Oncologia",
    ],
  },
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "video_1",
    type: "mp4",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: "/images/invisalign-smile.jpg",
    title: "Il tuo sorriso, in digitale",
    caption: "Percorsi Invisalign Diamond Provider, dalla diagnosi alla simulazione 3D.",
    ctaLabel: "Scopri l'Odontoiatria",
    ctaLink: "/servizi/odontoiatria",
    visible: true,
  },
  {
    id: "video_2",
    type: "mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/aesthetic-skin.jpg",
    title: "Medicina estetica naturale",
    caption: "Tecnologie medicali e protocolli personalizzati per valorizzare viso e corpo.",
    ctaLabel: "Scopri la Medicina Estetica",
    ctaLink: "/servizi/medicina-estetica",
    visible: true,
  },
  {
    id: "video_3",
    type: "mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "/images/doctor-consultation.jpg",
    title: "La prevenzione è il tuo stile",
    caption: "Cocoora Club: check-up dedicati e vantaggi per tutta la famiglia.",
    ctaLabel: "Entra nel Club",
    ctaLink: "/club",
    visible: true,
  },
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 1,
    image: "/images/clinic-lounge.jpg",
    caption:
      "Benvenuti nello Studio. Luce, materiali naturali e silenzio: il tuo benessere inizia dall'accoglienza. #CocooraClinic #AmicoMedico",
    likes: 184,
    comments: 14,
    tag: "Studio",
  },
  {
    id: 2,
    image: "/images/invisalign-smile.jpg",
    caption:
      "Il tuo sorriso, progettato in digitale. Invisalign Diamond Provider per percorsi invisibili ed eleganti. #InvisalignDiamond #CocooraSmile",
    likes: 242,
    comments: 19,
    tag: "Odontoiatria",
  },
  {
    id: 3,
    image: "/images/aesthetic-skin.jpg",
    caption:
      "Medicina estetica naturale: valorizzare senza trasformare, con protocolli su misura. #MedicinaEstetica #CocooraBeauty",
    likes: 310,
    comments: 27,
    tag: "Medicina Estetica",
  },
  {
    id: 4,
    image: "/images/doctor-consultation.jpg",
    caption:
      "Il tempo che dedichiamo a te è il farmaco più prezioso. Il metodo Cocoora, un medico sempre al tuo fianco. #AmicoMedico #CocooraCare",
    likes: 198,
    comments: 16,
    tag: "Amico Medico",
  },
  {
    id: 5,
    image: "/images/laser-technology.jpg",
    caption:
      "Tecnologia di precisione al servizio della pelle. Trattamenti laser medicali per risultati armoniosi e sicuri. #CocooraTech #LaserMedicale",
    likes: 156,
    comments: 11,
    tag: "Tecnologia",
  },
  {
    id: 6,
    image: "/images/dna-genomics.jpg",
    caption:
      "La prevenzione diventa predittiva. DNA 5 e microbiota per leggere il tuo futuro e proteggerti prima. #CocooraPrecision #Longevità",
    likes: 275,
    comments: 23,
    tag: "Precision",
  },
];
