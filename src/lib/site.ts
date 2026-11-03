import type { InstagramPost, NavNode, ServiceArea, VideoItem } from "./types";

export const SITE = {
  name: "Cocoora",
  fullName: "Cocoora Centro Medico",
  claim: "Connessi alla tua salute.",
  phone: "081 18182091",
  phoneRaw: "08118182091",
  email: "info@cocoora.it",
  emails: {
    info: "info@cocoora.it",
    prenotazioni: "prenotazioni@cocoora.it",
    amministrazione: "amministrazione@cocoora.it",
    direzioneSanitaria: "direzionesanitaria@cocoora.it",
  },
  contactEmails: [
    { label: "Informazioni & Accoglienza", email: "info@cocoora.it" },
    { label: "Prenotazioni & Visite", email: "prenotazioni@cocoora.it" },
    { label: "Amministrazione & Contabilità", email: "amministrazione@cocoora.it" },
    { label: "Direzione Sanitaria Specialistica", email: "direzionesanitaria@cocoora.it" },
  ],
  address: "Via Generale Giovanni De Bonis, 81",
  zip: "80123",
  city: "Napoli",
  fullAddress: "Via Generale Giovanni De Bonis, 81 - 80123 Napoli",
  whatsapp: "https://wa.me/3908118182091",
  instagram: "https://www.instagram.com/",
  hours: "Lun–Ven · 8:00–20:00 (Orario continuato) — Sab · 9:00–14:00",
};

export const NAV_NODES: NavNode[] = [
  {
    label: "Medicina Estetica",
    href: "/servizi/medicina-estetica",
    children: [
      {
        label: "Viso & Rigenerazione",
        href: "/servizi/medicina-estetica#viso",
        description:
          "Filler acido ialuronico, Tossina botulinica, Biorivitalizzazione, Acido Polilattico e Peeling chimico.",
        image: "/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg",
      },
      {
        label: "Corpo & Silhouette",
        href: "/servizi/medicina-estetica#corpo",
        description:
          "Biostimolazione Corpo, Criolipolisi, Carbossiterapia, Mesoterapia e Lipedema.",
      },
      {
        label: "Laser & Tecnologie",
        href: "/servizi/medicina-estetica#laser",
        description:
          "Laser medicali, Resurfacing cutaneo e Ultrasuoni CFU ad alta intensità.",
      },
      {
        label: "Non sai da dove iniziare?",
        href: "/servizi/medicina-estetica#guida",
        description:
          "Percorso guidato per orientarti tra i trattamenti viso e corpo più adatti a te.",
      },
    ],
  },
  {
    label: "Odontoiatria",
    href: "/servizi/odontoiatria",
    children: [
      {
        label: "Allineatori trasparenti",
        href: "/trattamenti/allineatori-trasparenti",
        description:
          "Ortodonzia specialistica · Bambini, adolescenti e adulti.",
        image: "/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
      },
      {
        label: "Apparecchio fisso",
        href: "/trattamenti/apparecchio-fisso",
        description:
          "Ortodonzia specialistica · Adulti e adolescenti.",
        image: "/images/trattamenti/odontoiatria/apparecchio-fisso-napoli-1.jpg",
      },
      {
        label: "Ortodonzia intercettiva",
        href: "/trattamenti/ortodonzia-intercettiva",
        description: "Ortodonzia specialistica · Bambini e adolescenti.",
        image: "/images/trattamenti/odontoiatria/ortodonzia-intercettiva-napoli-1.jpg",
      },
      {
        label: "Contenzione",
        href: "/trattamenti/contenzione",
        description:
          "Ortodonzia specialistica · Mantenimento del risultato.",
        image: "/images/trattamenti/odontoiatria/contenzione-napoli-1.jpg",
      },
      {
        label: "Visita odontoiatrica",
        href: "/trattamenti/visita-odontoiatrica",
        description: "Salute e prevenzione · Valutazione e piano di cura.",
        image: "/images/trattamenti/odontoiatria/visita-odontoiatrica-napoli-1.jpg",
      },
      {
        label: "Igiene orale professionale",
        href: "/trattamenti/igiene",
        description: "Salute e prevenzione · Prevenzione e salute delle gengive.",
        image: "/images/trattamenti/odontoiatria/igiene-orale-professionale-napoli-1.jpg",
      },
      {
        label: "Conservativa",
        href: "/trattamenti/conservativa",
        description: "Cura e riabilitazione · Otturazioni e trattamenti.",
        image: "/images/trattamenti/odontoiatria/conservativa-napoli-1.jpg",
      },
      {
        label: "Endodonzia",
        href: "/trattamenti/endodonzia",
        description: "Cura e riabilitazione · Cura canalare.",
        image: "/images/trattamenti/odontoiatria/endodonzia-napoli-1.jpg",
      },
      {
        label: "Parodontologia",
        href: "/trattamenti/parodontologia",
        description: "Cura e riabilitazione · Salute delle gengive.",
        image: "/images/trattamenti/odontoiatria/paradontologia-napoli-1.jpg",
      },
      {
        label: "Protesi",
        href: "/trattamenti/protesi",
        description: "Cura e riabilitazione · Protesi fisse e rimovibili.",
        image: "/images/trattamenti/odontoiatria/protesi-napoli-1.jpg",
      },
      {
        label: "Implantologia",
        href: "/trattamenti/implantologia",
        description: "Cura e riabilitazione · Impianti dentali.",
        image: "/images/trattamenti/odontoiatria/implantologia-napoli-1.jpg",
      },
    ],
  },
  {
    label: "Visite Specialistiche",
    href: "/visite",
    children: [
      {
        label: "Odontoiatria",
        href: "/servizi/odontoiatria",
        description: "Benessere e cura di sé.",
      },
      {
        label: "Nutrizione",
        href: "/visite/nutrizione",
        description: "Benessere e cura di sé · Piano nutrizionale personalizzato.",
        image: "/images/visite/nutrizione-napoli-1.jpg",
      },
      {
        label: "Medicina estetica",
        href: "/servizi/medicina-estetica",
        description: "Benessere e cura di sé.",
      },
      {
        label: "Dermatologia",
        href: "/visite/dermatologia",
        description: "Benessere e cura di sé · Mappatura nei e salute cutanea.",
        image: "/images/visite/dermatologia-napoli-1.jpg",
      },
      {
        label: "Chirurgia plastica",
        href: "/visite/chirurgia-plastica",
        description: "Benessere e cura di sé · Consulenza e chirurgia ambulatoriale.",
        image: "/images/visite/chiururgia-plastica-napoli-1.jpg",
      },
      {
        label: "Radiologia",
        href: "/visite/radiologia",
        description: "Diagnostica e prevenzione · Diagnostica ecografica e per immagini.",
        image: "/images/visite/radiologia-napoli-1.jpg",
      },
      {
        label: "Cardiologia",
        href: "/visite/cardiologia",
        description: "Diagnostica e prevenzione · ECG ed ecocardiografia avanzata.",
        image: "/images/visite/cardiologia-napoli-1.jpg",
      },
      {
        label: "Diabetologia",
        href: "/visite/diabetologia",
        description: "Diagnostica e prevenzione · Prevenzione metabolica ed endocrinologica.",
        image: "/images/visite/diabetologia-napoli-1.jpg",
      },
      {
        label: "Ginecologia",
        href: "/visite/ginecologia",
        description: "Diagnostica e prevenzione · Visita ed ecografia ginecologica.",
        image: "/images/visite/ginecologia-napoli-1.jpg",
      },
      {
        label: "Pediatria",
        href: "/visite/pediatria",
        description: "Diagnostica e prevenzione · Salute e bilanci di crescita.",
        image: "/images/visite/pediatria-napoli-1.jpg",
      },
      {
        label: "Oculistica",
        href: "/visite/oculistica",
        description: "Diagnostica e prevenzione · Screening della vista e fondo oculare.",
        image: "/images/visite/oculistica-napoli-1.jpg",
      },
      {
        label: "Psicologia",
        href: "/visite/psicologia",
        description:
          "Specialistiche per la famiglia · Sostegno psicologico e benessere emotivo.",
        image: "/images/visite/psicologia-napoli-1.jpg",
      },
      {
        label: "Medicina dello sport",
        href: "/visite/medicina-dello-sport",
        description:
          "Specialistiche per la famiglia · Idoneità sportiva e monitoraggio atletico.",
        image: "/images/visite/medicina-dello-sport-napoli-1.jpg",
      },
      {
        label: "Senologia",
        href: "/visite/senologia",
        description: "Specialistiche per la famiglia · Prevenzione senologica ed ecografia mammaria.",
        image: "/images/visite/senologia-napoli-1.jpg",
      },
      {
        label: "Oncologia",
        href: "/visite/oncologia",
        description:
          "Specialistiche per la famiglia · Prevenzione oncologica e percorsi multidisciplinari.",
        image: "/images/visite/oncologia-napoli-1.jpg",
      },
      {
        label: "Cocoora Precision (Genomica & Longevità)",
        href: "/precision",
        description:
          "Medicina predittiva e preventiva: test DNA 5, Kit Microbiota e longevità attiva.",
        image: "/images/visite/diabetologia-napoli-2.jpg",
      },
    ],
  },
  {
    label: "I Medici",
    href: "/medici",
    children: [
      {
        label: "L'Équipe Specialistica",
        href: "/medici",
        description:
          "Specialisti di riferimento per un percorso clinico multidisciplinare e coordinato a Napoli.",
        image: "/images/visite/oncologia-napoli-1.jpg",
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
    href: "/chi-siamo",
    children: [
      {
        label: "La Filosofia del Centro",
        href: "/chi-siamo",
        description:
          "Eccellenza clinica, tecnologie diagnostiche avanzate e accoglienza riservata in Via De Bonis 81 a Napoli.",
        image: "/images/trattamenti/medicina-estetica/biostimolazione-napoli-2.jpg",
      },
      {
        label: "Sede & Accoglienza",
        href: "/contatti",
        description:
          "Struttura medica autorizzata a Napoli (Cavalleggeri / Fuorigrotta). Orario continuato Lun–Ven 8:00–20:00, Sab 9:00–14:00.",
      },
    ],
  },
  {
    label: "Percorsi Salute",
    href: "/club",
    children: [
      {
        label: "Panoramica Percorsi",
        href: "/club",
        description:
          "I percorsi annuali dedicati alla prevenzione continua per singoli e famiglie.",
        image: "/images/visite/cardiologia-napoli-2.jpg",
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
  { label: "Medicina Estetica", href: "/servizi/medicina-estetica" },
  { label: "Odontoiatria", href: "/servizi/odontoiatria" },
  { label: "Visite Specialistiche", href: "/visite" },
  { label: "I Medici", href: "/medici" },
  { label: "Il Centro", href: "/chi-siamo" },
  { label: "Percorsi Salute", href: "/club" },
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
    poster: "/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
    title: "Il tuo sorriso, in digitale",
    caption: "Percorsi con allineatori trasparenti, dalla diagnosi alla simulazione 3D.",
    ctaLabel: "Scopri l'Odontoiatria",
    ctaLink: "/servizi/odontoiatria",
    visible: true,
  },
  {
    id: "video_2",
    type: "mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/trattamenti/medicina-estetica/biorigenerazione-napoli-1.jpg",
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
    poster: "/images/visite/cardiologia-napoli-2.jpg",
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
    image: "/images/trattamenti/medicina-estetica/biostimolazione-napoli-2.jpg",
    caption:
      "Benvenuti nel Centro. Luce, materiali naturali e silenzio: il tuo benessere inizia dall'accoglienza. #CocooraClinic #CentroMedico",
    likes: 184,
    comments: 14,
    tag: "Il Centro",
  },
  {
    id: 2,
    image: "/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
    caption:
      "Il tuo sorriso, progettato in digitale. Allineatori trasparenti per percorsi discreti ed efficaci. #AllineatoriTrasparenti #CocooraSmile",
    likes: 242,
    comments: 19,
    tag: "Odontoiatria",
  },
  {
    id: 3,
    image: "/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg",
    caption:
      "Medicina estetica naturale: valorizzare senza trasformare, con protocolli su misura. #MedicinaEstetica #CocooraBeauty",
    likes: 310,
    comments: 27,
    tag: "Medicina Estetica",
  },
  {
    id: 4,
    image: "/images/visite/oncologia-napoli-1.jpg",
    caption:
      "Il tempo che dedichiamo a te è il farmaco più prezioso. Il metodo Cocoora, la salute al centro del tuo tempo. #CocooraCare #SaluteIntegrata",
    likes: 198,
    comments: 16,
    tag: "Filosofia Clinica",
  },
  {
    id: 5,
    image: "/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-1.jpg",
    caption:
      "Tecnologia di precisione al servizio della pelle. Trattamenti laser medicali per risultati armoniosi e sicuri. #CocooraTech #LaserMedicale",
    likes: 156,
    comments: 11,
    tag: "Tecnologia",
  },
  {
    id: 6,
    image: "/images/visite/diabetologia-napoli-2.jpg",
    caption:
      "La prevenzione diventa predittiva. DNA 5 e microbiota per leggere il tuo futuro e proteggerti prima. #CocooraPrecision #Longevità",
    likes: 275,
    comments: 23,
    tag: "Precision",
  },
];
