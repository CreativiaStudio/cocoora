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
    label: "Servizi",
    children: [
      {
        label: "Odontoiatria Digitale",
        href: "/servizi/odontoiatria",
        description: "Invisalign Diamond Provider, implantologia guidata e chirurgia piezoelettrica.",
        image: "/images/invisalign-smile.jpg",
      },
      {
        label: "Medicina Estetica Avanzata",
        href: "/servizi/medicina-estetica",
        description: "Protocolli rigenerativi, biostimolazione e laserterapia per viso e corpo.",
        image: "/images/aesthetic-skin.jpg",
      },
      {
        label: "Diagnostica & Poliambulatorio",
        href: "/servizi/diagnostica",
        description: "Visite specialistiche, ecografie, cardiologia, ginecologia e senologia senza attese.",
        image: "/images/diagnostics-lab.jpg",
      },
    ],
  },
  {
    label: "Studio",
    children: [
      {
        label: "Chi Siamo & Metodo",
        href: "/chi-siamo",
        description: "La visione clinica, gli ambienti accoglienti e l'approccio Amico Medico.",
        image: "/images/clinic-lounge.jpg",
      },
      {
        label: "Tutti i Trattamenti",
        href: "/#trattamenti",
        description: "Panoramica clinica completa di tutte le prestazioni erogate.",
      },
    ],
  },
  {
    label: "Medici",
    children: [
      {
        label: "Tutti gli Specialisti",
        href: "/medici",
        description: "Zero liste d'attesa: la rete di medici con convenzione universitaria e ospedaliera.",
        image: "/images/doctor-consultation.jpg",
      },
      {
        label: "Odontoiatria & Invisalign",
        href: "/servizi/odontoiatria",
        description: "Ortodonzia digitale e chirurgia guidata con specialisti Invisalign Diamond Provider.",
      },
      {
        label: "Cardiologia & Diagnostica",
        href: "/servizi/diagnostica",
        description: "Cardiologi, senologi e radiologi con affiliazioni Federico II, Vanvitelli e Cardarelli.",
      },
    ],
  },
  {
    label: "Club & Percorsi",
    children: [
      {
        label: "Cocoora Club",
        href: "/club",
        description: "Membership annuali di prevenzione: Discover, Access, Care, Experience, Signature, Longevity.",
        image: "/images/hero-clinic.jpg",
      },
      {
        label: "Cocoora Precision",
        href: "/precision",
        description: "Genomica predittiva, test DNA 5 e sequenziamento microbiota per una longevità attiva.",
        image: "/images/dna-genomics.jpg",
      },
    ],
  },
  {
    label: "Contatti",
    href: "/contatti",
  },
];

export const NAV_LINKS = [
  { label: "Servizi", href: "/#servizi" },
  { label: "Studio", href: "/chi-siamo" },
  { label: "Cocoora Club", href: "/club" },
  { label: "Trattamenti", href: "/#trattamenti" },
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
    type: "instagram",
    url: "",
    title: "Il tuo sorriso, in digitale",
    caption: "Percorsi Invisalign Diamond Provider, dalla diagnosi alla simulazione 3D.",
    ctaLabel: "Scopri l'Odontoiatria",
    ctaLink: "/servizi/odontoiatria",
    visible: true,
  },
  {
    id: "video_2",
    type: "instagram",
    url: "",
    title: "Medicina estetica naturale",
    caption: "Tecnologie medicali e protocolli personalizzati per valorizzare viso e corpo.",
    ctaLabel: "Scopri la Medicina Estetica",
    ctaLink: "/servizi/medicina-estetica",
    visible: true,
  },
  {
    id: "video_3",
    type: "instagram",
    url: "",
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
