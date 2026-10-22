import type { GalleryItem, Leader, Principle, ShowroomTile } from "./types";

export const PRINCIPLES: Principle[] = [
  {
    id: "filosofia",
    title: "La Filosofia Cocoora",
    text: "Un centro medico integrato che ti ascolta, ti orienta e ti accompagna nel tempo, eliminando l'ansia e la frammentazione tipica della sanità tradizionale.",
    icon: "HeartHandshake",
  },
  {
    id: "zero-burocrazia",
    title: "Zero Attese & Fluidità Totale",
    text: "Piattaforma digitale proprietaria: prenoti in meno di 2 minuti, niente code in sala d'attesa, referti e cartelle cliniche disponibili h24 sul tuo smartphone.",
    icon: "Clock",
  },
  {
    id: "multidisciplinare",
    title: "Sinergia Multidisciplinare",
    text: "I nostri specialisti (odontoiatri, medici estetici, cardiologi, nutrizionisti, genetisti) dialogano costantemente tra loro condividendo un piano di cura integrato.",
    icon: "Users",
  },
  {
    id: "precisione",
    title: "Appropriatezza & Medicina Rigenerativa",
    text: "Rifiutiamo gli esami inutili e i trattamenti aggressivi. Crediamo nell'appropriatezza clinica, nella prevenzione predittiva (DNA e microbiota) e in risultati estetici armoniosi.",
    icon: "Sparkles",
  },
];

export const CLINIC_GALLERY: GalleryItem[] = [
  {
    id: "lounge",
    image: "/images/clinic-lounge.jpg",
    caption: "La Lounge di Benvenuto: arredi tortora, luce soffusa e un'atmosfera lontana dai cliché ospedalieri.",
  },
  {
    id: "reception",
    image: "/images/hero-clinic.jpg",
    caption: "L'Atrio Centrale: accoglienza digitale e check-in rapido con QR code.",
  },
  {
    id: "dental-suite",
    image: "/images/dental-operatory.jpg",
    caption: "Suite Odontoiatrica: tecnologia digitale 3D, scanner intraorale e poltrone ad alto comfort.",
  },
  {
    id: "laser-room",
    image: "/images/laser-technology.jpg",
    caption: "Area Medicina Estetica: piattaforma laser medicale multifunzionale e Cryoliposculpt.",
  },
  {
    id: "diagnostics",
    image: "/images/diagnostics-lab.jpg",
    caption: "Ambulatorio Diagnostico: ecocardiografia e diagnostica per immagini ad alta definizione.",
  },
  {
    id: "consultation",
    image: "/images/doctor-consultation.jpg",
    caption: "Spazi di Consultazione: riservatezza, ascolto e tempo dedicato tra medico e paziente.",
  },
];

export const SHOWROOM_TILES: ShowroomTile[] = [
  {
    id: "allineatori",
    title: "Allineatori Trasparenti",
    text: "Scansione digitale 3D e pianificazione ortodontica specialistica per allineare il sorriso con mascherine trasparenti rimovibili.",
    image: "/images/invisalign-smile.jpg",
  },
  {
    id: "cryoliposculpt",
    title: "Cryoliposculpt & Rimodellamento",
    text: "Raffreddamento medicale controllato per adiposità localizzate e tonicità tessutale senza aghi.",
    image: "/images/body-wellness.jpg",
  },
  {
    id: "laser-platform",
    title: "Piattaforma Laser Quadri-Manipolo",
    text: "QS NPP, Erbium:YAG, CPL e Laser CO2 per macchie, cicatrici, rossori e texture cutanea radiosa.",
    image: "/images/laser-technology.jpg",
  },
  {
    id: "genomics-lab",
    title: "Genomica & Microbiota NGS",
    text: "Sequenziamento del DNA e microbioma intestinale per guidare longevità, prevenzione e nutrizione.",
    image: "/images/dna-genomics.jpg",
  },
];

export const LEADERSHIP: Leader[] = [
  {
    id: "simone-papagno",
    name: "Simone Papagno",
    role: "Fondatore & Vision Lead",
    monogram: "SP",
    bio: "Imprenditore con una visione chiara: trasformare l'accesso alla salute attraverso tecnologia, trasparenza e un'esperienza clinica impeccabile per il paziente contemporaneo.",
  },
  {
    id: "direzione-sanitaria",
    name: "Comitato Clinico & Direzione Sanitaria",
    role: "Supervisione Medica & Qualità",
    monogram: "DS",
    bio: "Un'équipe selezionata di professionisti abilitati e docenti specialisti che garantiscono rigore clinico, sicurezza farmacologica e continuità terapeutica in ogni branca.",
  },
];
