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
    label: "Aree Mediche",
    children: [
      {
        label: "Medicina Estetica & Rigenerativa",
        href: "/servizi/medicina-estetica",
        description:
          "Viso (Biostimolazione, Filler, Tossina botulinica), Corpo (Criolipolisi, Ultrasuoni CFU) e Laser medicali.",
        image: "/images/aesthetic-skin.jpg",
      },
      {
        label: "Odontoiatria & Ortodonzia",
        href: "/servizi/odontoiatria",
        description:
          "Allineatori Trasparenti, Ortodonzia Specialistica, Estetica del Sorriso, Igiene & Prevenzione.",
        image: "/images/invisalign-smile.jpg",
      },
      {
        label: "Visite Specialistiche",
        href: "/visite",
        description:
          "Cardiologia, Ginecologia, Senologia, Ecografia, Oculistica, Pediatria, Psicologia e Medicina dello Sport.",
        image: "/images/diagnostics-lab.jpg",
      },
      {
        label: "Cocoora Precision (Genomica & Longevità)",
        href: "/precision",
        description:
          "Medicina del Futuro & Percorsi: test DNA 5, Kit Microbiota e longevità attiva.",
        image: "/images/dna-genomics.jpg",
      },
    ],
  },
  {
    label: "I Medici",
    children: [
      {
        label: "L'Équipe Specialistica",
        href: "/medici",
        description:
          "Specialisti di riferimento per un percorso clinico multidisciplinare e coordinato a Napoli.",
        image: "/images/doctor-consultation.jpg",
      },
      {
        label: "Docenti Universitari e Ospedalieri",
        href: "/medici#docenti",
        description:
          "Professori e dirigenti medici delle Università Federico II, Vanvitelli e dei principali poli ospedalieri.",
      },
    ],
  },
  {
    label: "Il Centro",
    children: [
      {
        label: "La Filosofia del Centro",
        href: "/chi-siamo",
        description:
          "Eccellenza clinica, tecnologie diagnostiche avanzate e accoglienza riservata in Via De Bonis 81 a Napoli.",
        image: "/images/clinic-lounge.jpg",
      },
      {
        label: "Gli Spazi Clinici: Studio 1, 2, 3",
        href: "/chi-siamo#spazi",
        description:
          "Ambienti clinici dedicati per odontoiatria, medicina estetica, diagnostica e visite specialistiche.",
      },
    ],
  },
  {
    label: "Percorsi Salute",
    children: [
      {
        label: "Panoramica Percorsi",
        href: "/club",
        description:
          "I percorsi annuali dedicati alla prevenzione continua per singoli e famiglie.",
        image: "/images/hero-clinic.jpg",
      },
      {
        label: "Discover",
        href: "/club#discover",
        description: "Il primo passo per entrare nel mondo della prevenzione Cocoora.",
      },
      {
        label: "Access",
        href: "/club#access",
        description:
          "Accesso strutturato alle prestazioni specialistiche e diagnostiche del centro.",
      },
      {
        label: "Care",
        href: "/club#care",
        description:
          "Prevenzione periodica e continuità assistenziale durante tutto l'anno.",
      },
      {
        label: "Experience",
        href: "/club#experience",
        description: "Percorso avanzato multidisciplinare per il benessere completo.",
      },
      {
        label: "Signature",
        href: "/club#signature",
        description:
          "Il percorso esclusivo e onnicomprensivo di longevità e salute dedicata.",
      },
    ],
  },
];

export const NAV_LINKS = [
  { label: "Aree Mediche", href: "/#servizi" },
  { label: "I Medici", href: "/medici" },
  { label: "Il Centro", href: "/chi-siamo" },
  { label: "Percorsi Salute", href: "/club" },
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
