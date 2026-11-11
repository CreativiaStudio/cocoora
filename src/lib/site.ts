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
    prenotazioni: "info@cocoora.it",
    amministrazione: "info@cocoora.it",
    direzioneSanitaria: "info@cocoora.it",
  },
  contactEmails: [
    { label: "Informazioni & Accoglienza", email: "info@cocoora.it" },
    { label: "Prenotazioni & Visite", email: "info@cocoora.it" },
    { label: "Amministrazione & Contabilità", email: "info@cocoora.it" },
    { label: "Direzione Sanitaria Specialistica", email: "info@cocoora.it" },
  ],
  address: "Via Generale Giovanni De Bonis, 81",
  zip: "80123",
  city: "Napoli",
  fullAddress: "Via Generale Giovanni De Bonis, 81 - 80123 Napoli",
  whatsapp: "https://wa.me/3908118182091",
  instagram: "https://www.instagram.com/cocoora_official/",
  hours: "Lun–Ven · 9:00–19:00 (Orario continuato) — Sabato chiuso",
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
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg",
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
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
      },
      {
        label: "Apparecchio fisso",
        href: "/trattamenti/apparecchio-fisso",
        description:
          "Ortodonzia specialistica · Adulti e adolescenti.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/apparecchio-fisso-napoli-1.jpg",
      },
      {
        label: "Ortodonzia intercettiva",
        href: "/trattamenti/ortodonzia-intercettiva",
        description: "Ortodonzia specialistica · Bambini e adolescenti.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/ortodonzia-intercettiva-napoli-1.jpg",
      },
      {
        label: "Contenzione",
        href: "/trattamenti/contenzione",
        description:
          "Ortodonzia specialistica · Mantenimento del risultato.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/contenzione-napoli-1.jpg",
      },
      {
        label: "Visita odontoiatrica",
        href: "/trattamenti/visita-odontoiatrica",
        description: "Salute e prevenzione · Valutazione e piano di cura.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/visita-odontoiatrica-napoli-1.jpg",
      },
      {
        label: "Igiene orale professionale",
        href: "/trattamenti/igiene",
        description: "Salute e prevenzione · Prevenzione e salute delle gengive.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/igiene-orale-professionale-napoli-1.jpg",
      },
      {
        label: "Conservativa",
        href: "/trattamenti/conservativa",
        description: "Cura e riabilitazione · Otturazioni e trattamenti.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/conservativa-napoli-1.jpg",
      },
      {
        label: "Endodonzia",
        href: "/trattamenti/endodonzia",
        description: "Cura e riabilitazione · Cura canalare.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/endodonzia-napoli-1.jpg",
      },
      {
        label: "Parodontologia",
        href: "/trattamenti/parodontologia",
        description: "Cura e riabilitazione · Salute delle gengive.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/paradontologia-napoli-1.jpg",
      },
      {
        label: "Protesi",
        href: "/trattamenti/protesi",
        description: "Cura e riabilitazione · Protesi fisse e rimovibili.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/protesi-napoli-1.jpg",
      },
      {
        label: "Implantologia",
        href: "/trattamenti/implantologia",
        description: "Cura e riabilitazione · Impianti dentali.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/implantologia-napoli-1.jpg",
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
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/nutrizione-napoli-1.jpg",
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
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/dermatologia-napoli-1.jpg",
      },
      {
        label: "Chirurgia plastica",
        href: "/visite/chirurgia-plastica",
        description: "Benessere e cura di sé · Consulenza e chirurgia ambulatoriale.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/chiururgia-plastica-napoli-1.jpg",
      },
      {
        label: "Radiologia",
        href: "/visite/radiologia",
        description: "Diagnostica e prevenzione · Diagnostica ecografica e per immagini.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/radiologia-napoli-1.jpg",
      },
      {
        label: "Cardiologia",
        href: "/visite/cardiologia",
        description: "Diagnostica e prevenzione · ECG ed ecocardiografia avanzata.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/cardiologia-napoli-1.jpg",
      },
      {
        label: "Ginecologia",
        href: "/visite/ginecologia",
        description: "Diagnostica e prevenzione · Visita ed ecografia ginecologica.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/ginecologia-napoli-1.jpg",
      },
      {
        label: "Senologia",
        href: "/visite/senologia",
        description: "Diagnostica e prevenzione · Prevenzione senologica ed ecografia mammaria.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/senologia-napoli-1.jpg",
      },
      {
        label: "Oncologia",
        href: "/visite/oncologia",
        description:
          "Diagnostica e prevenzione · Prevenzione oncologica e percorsi multidisciplinari.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/oncologia-napoli-1.jpg",
      },
      {
        label: "Pediatria",
        href: "/visite/pediatria",
        description: "Specialistiche per la famiglia · Salute e bilanci di crescita.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/pediatria-napoli-1.jpg",
      },
      {
        label: "Oculistica",
        href: "/visite/oculistica",
        description: "Specialistiche per la famiglia · Screening della vista e fondo oculare.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/oculistica-napoli-1.jpg",
      },
      {
        label: "Psicologia",
        href: "/visite/psicologia",
        description:
          "Specialistiche per la famiglia · Sostegno psicologico e benessere emotivo.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/psicologia-napoli-1.jpg",
      },
      {
        label: "Medicina dello sport",
        href: "/visite/medicina-dello-sport",
        description:
          "Specialistiche per la famiglia · Idoneità sportiva e monitoraggio atletico.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/medicina-dello-sport-napoli-1.jpg",
      },
      {
        label: "Cocoora Precision (Genomica & Longevità)",
        href: "/precision",
        description:
          "Medicina predittiva e preventiva: test DNA 5, Kit Microbiota e longevità attiva.",
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/dna-genomics.jpg",
      },
    ],
  },
  {
    label: "I Medici",
    href: "/medici",
  },
  {
    label: "Il Centro",
    href: "/chi-siamo",
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
        image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/cardiologia-napoli-2.jpg",
      },
      {
        label: "Discover",
        href: "/club/discover",
        description:
          "Il percorso gratuito per attivare il profilo sanitario digitale e consultare referti online (Free).",
      },
      {
        label: "Access",
        href: "/club/access",
        description:
          "Valutazione iniziale con Check-up Salute 17 parametri, Visita medica, Medicina Interna, OPT ed ECG (149 €/anno).",
      },
      {
        label: "Care Plus",
        href: "/club/care",
        description:
          "Prevenzione continua con igiene orale, piano nutrizionale personalizzato e primo controllo (299 €/anno).",
      },
      {
        label: "Experience",
        href: "/club/experience",
        description:
          "Approfondimento completo con Color Doppler, visita oculistica, skin check-up e senologia (da 599 €/anno).",
      },
      {
        label: "Signature",
        href: "/club/signature",
        description:
          "Massima prevenzione e longevità: Check-up Avanzato + FIT, ecografia addome e DNA 5 (da 940 €/anno).",
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
    poster: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
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
    poster: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/biorigenerazione-napoli-1.jpg",
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
    poster: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/cardiologia-napoli-2.jpg",
    title: "La prevenzione è il tuo stile",
    caption: "Cocoora Club: check-up dedicati e vantaggi per tutta la famiglia.",
    ctaLabel: "Entra nel Club",
    ctaLink: "/club",
    visible: true,
  },
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "DfJyVyAD8C1",
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/instagram/post-1-DfJyVyAD8C1.jpg",
    caption:
      "A Posillipo un hub unico che unisce medicina, estetica, nutrizione e odontoiatria sotto una sola regia clinica. Meno attrito, zero logistica, massimo valore per il tuo tempo. #Cocoora #Napoli",
    likes: 17,
    comments: 0,
    tag: "Hub Posillipo",
    permalink: "https://www.instagram.com/p/DfJyVyAD8C1/",
  },
  {
    id: "DfEoxqKiSti",
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/instagram/post-2-DfEoxqKiSti.jpg",
    caption:
      "La logistica familiare non dovrebbe essere un secondo lavoro. Competenze pediatriche, adulte e geriatriche nello stesso spazio con percorsi su misura. #Cocoora #Napoli",
    likes: 10,
    comments: 0,
    tag: "Famiglia",
    permalink: "https://www.instagram.com/p/DfEoxqKiSti/",
  },
  {
    id: "De_fFLUCeeZ",
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/instagram/post-3-De_fFLUCeeZ.jpg",
    caption:
      "Un punto fermo dove ritrovare continuità, efficienza e la migliore cura di sé. Via Generale De Bonis, 81 — Napoli (Posillipo). #Cocoora #Napoli",
    likes: 24,
    comments: 0,
    tag: "Il Centro",
    permalink: "https://www.instagram.com/p/De_fFLUCeeZ/",
  },
  {
    id: "De1FIzJCHN1",
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/instagram/post-4-De1FIzJCHN1.jpg",
    caption:
      "C'è una grande differenza tra accumulare visite mediche e seguire un percorso clinico coordinato. Quattro macro-aree cliniche che dialogano in tempo reale. #Cocoora #Napoli",
    likes: 21,
    comments: 0,
    tag: "Percorsi Clinici",
    permalink: "https://www.instagram.com/p/De1FIzJCHN1/",
  },
  {
    id: "Dev7gnbEhsx",
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/instagram/post-5-Dev7gnbEhsx.jpg",
    caption:
      "Scegliere un centro medico significa scegliere un metodo. L'appropriatezza clinica parte da qui: dare una ragione alle scelte con specialisti dedicati. #Cocoora #Napoli",
    likes: 30,
    comments: 1,
    tag: "Metodo Cocoora",
    permalink: "https://www.instagram.com/p/Dev7gnbEhsx/",
  },
  {
    id: "Deqx3eqEXEF",
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/instagram/post-6-Deqx3eqEXEF.jpg",
    caption:
      "Condividiamo cos'è Cocoora: uno spazio pensato per dare risposte chiare, coordinate e continuative alla tua salute a Napoli. #Cocoora #Napoli",
    likes: 32,
    comments: 2,
    tag: "Visione Clinica",
    permalink: "https://www.instagram.com/p/Deqx3eqEXEF/",
  },
];
