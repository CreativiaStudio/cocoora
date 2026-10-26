import type { Doctor } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Database Specialisti Cocoora.
// Ogni medico ha convenzioni con le principali strutture universitarie e
// ospedaliere napoletane e opera in modo coordinato nel nostro centro.
// ─────────────────────────────────────────────────────────────────────────

export const DOCTORS: Doctor[] = [
  {
    slug: "antonio-sorrentino",
    name: "Dr. Antonio Sorrentino",
    title: "Specialista in Odontoiatria e Ortognatodonzia",
    branca: "Odontoiatria & Ortodonzia Digitale",
    affiliation: "Docente a contratto — Università degli Studi di Napoli \"Federico II\"",
    image: "/images/doctors/antonio-sorrentino.jpg",
    bio: "Il Dr. Sorrentino affianca alla pratica clinica quotidiana l'attività didattica universitaria, portando nel centro i protocolli più aggiornati di ortodonzia digitale e chirurgia implantare guidata. Specialista in ortodonzia con allineatori trasparenti e tecnologie digitali 3D, ha costruito il proprio percorso professionale sull'idea che la tecnologia debba semplificare, non complicare, il rapporto tra medico e paziente.",
    approach:
      "Non esistono due sorrisi identici: ogni piano di trattamento nasce da una diagnosi digitale accurata e viene condiviso con il paziente prima di iniziare, senza sorprese e senza tempi morti.",
    curriculum: [
      "Laurea in Odontoiatria e Protesi Dentaria — Università degli Studi di Napoli \"Federico II\"",
      "Specializzazione in Ortognatodonzia — Seconda Università di Napoli (oggi Vanvitelli)",
      "Perfezionamento in Ortodonzia Digitale con Allineatori Trasparenti",
      "Perfezionamento in Chirurgia Implantare Guidata e Piezoelettrica",
      "Relatore in convegni nazionali di odontoiatria digitale",
    ],
    servizi: [
      "Ortodonzia con Allineatori Trasparenti (adulti, adolescenti, bambini)",
      "Implantologia a carico immediato e chirurgia guidata 3D",
      "Igiene dentale professionale e prevenzione parodontale",
      "Endodonzia e conservativa estetica",
      "Gnatologia, bruxismo e bite personalizzati",
    ],
    treatmentSlugs: [
      "invisalign-adulti",
      "invisalign-adolescenti",
      "invisalign-bambini",
      "implantologia",
      "igiene",
      "gnatologia-bruxismo-bite",
    ],
    specialtyId: undefined,
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 90,
  },
  {
    slug: "chiara-del-prete",
    name: "Dr.ssa Chiara Del Prete",
    title: "Specialista in Dermatologia e Medicina Estetica",
    branca: "Medicina Estetica Avanzata",
    affiliation: "Già Dirigente Medico — A.O.U. Vanvitelli, U.O.C. Dermatologia",
    image: "/images/doctors/chiara-del-prete.jpg",
    bio: "La Dr.ssa Del Prete unisce la formazione dermatologica ospedaliera a un approccio estetico rigenerativo, fondato sull'appropriatezza clinica prima che sull'esecuzione del trattamento. Ogni percorso viene costruito partendo dalla qualità biologica della pelle, non dal singolo protocollo isolato.",
    approach:
      "Il mio obiettivo non è trasformare, ma valorizzare: prima la diagnosi medica, poi la tecnologia più adatta a ottenere un risultato naturale e coerente con l'identità della persona.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università degli Studi di Napoli \"Federico II\"",
      "Specializzazione in Dermatologia e Venereologia — Università della Campania \"Luigi Vanvitelli\"",
      "Master in Medicina Estetica Rigenerativa",
      "Formazione avanzata in laserterapia dermatologica e biostimolazione",
      "Membro di società scientifiche di medicina estetica",
    ],
    servizi: [
      "Piattaforma laser (QS NPP, Erbium, CPL, CO2) per viso e corpo",
      "Biorivitalizzazione, PRX e acido polilattico",
      "Filler ad acido ialuronico e tossina botulinica",
      "Cryoliposculpt e rimodellamento corporeo",
      "Skin check-up digitale e piani rigenerativi personalizzati",
    ],
    treatmentSlugs: [
      "piattaforma-laser",
      "biorivitalizzazione",
      "filler-acido-ialuronico",
      "tossina-botulinica",
      "cryoliposculpt",
    ],
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 120,
  },
  {
    slug: "ferdinando-esposito",
    name: "Dr. Ferdinando Esposito",
    title: "Specialista in Cardiologia e Diagnostica Vascolare",
    branca: "Cardiologia & Prevenzione Cardiovascolare",
    affiliation: "Già Dirigente Medico I livello — A.O.R.N. \"Antonio Cardarelli\", U.O.C. Cardiologia",
    image: "/images/doctors/ferdinando-esposito.jpg",
    bio: "Dopo anni di attività in ambito ospedaliero d'urgenza, il Dr. Esposito ha scelto di dedicarsi alla prevenzione cardiovascolare ambulatoriale, portando nel nostro centro la stessa attenzione clinica riservata ai casi acuti. Crede che la vera cardiologia si faccia prima che il problema si manifesti.",
    approach:
      "La prevenzione cardiovascolare funziona solo se è costante e senza attriti: per questo affianco ogni paziente con controlli regolari e un dialogo diretto, senza filtri burocratici.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università degli Studi di Napoli \"Federico II\"",
      "Specializzazione in Cardiologia — Università degli Studi di Napoli \"Federico II\"",
      "Perfezionamento in Ecocardiografia Color-Doppler ed Ecocolordoppler vascolare",
      "Esperienza pluriennale in Unità di Terapia Intensiva Cardiologica",
      "Formazione continua in prevenzione cardiovascolare e medicina della longevità",
    ],
    servizi: [
      "Visita cardiologica con anamnesi del rischio cardiovascolare",
      "Elettrocardiogramma (ECG) a riposo e holter su indicazione",
      "Ecocardiogramma color-Doppler",
      "Ecocolordoppler dei tronchi sovraortici (TSA)",
      "Percorsi di prevenzione cardiovascolare Cocoora Club",
    ],
    specialtyId: "cardiologia",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 130,
  },
  {
    slug: "marianna-coppola",
    name: "Dr.ssa Marianna Coppola",
    title: "Specialista in Senologia",
    branca: "Senologia & Prevenzione Donna",
    affiliation: "Consulente senologa — Policlinico Universitario \"Federico II\"",
    image: "/images/doctors/marianna-coppola.jpg",
    bio: "La Dr.ssa Coppola ha costruito la propria carriera intorno a un principio semplice: la prevenzione senologica deve essere accessibile, empatica e priva di ansia da attesa. Il suo approccio multidisciplinare integra la valutazione clinica con il supporto psicologico del percorso.",
    approach:
      "Ogni visita senologica è un momento delicato: il mio compito è trasformarlo in un'occasione di chiarezza e serenità, non di preoccupazione.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università degli Studi di Napoli \"Federico II\"",
      "Specializzazione in Ginecologia e Ostetricia, indirizzo Senologico",
      "Perfezionamento in Ecografia Mammaria ad alta risoluzione",
      "Esperienza in programmi di screening senologico territoriale",
      "Collaborazione con équipe multidisciplinari oncologiche",
    ],
    servizi: [
      "Visita senologica clinica completa",
      "Ecografia mammaria bilaterale ad alta risoluzione",
      "Valutazione della familiarità e profilo di rischio",
      "Percorsi integrati Donna Precision",
    ],
    specialtyId: "senologia",
    clubTierIds: ["care", "experience", "signature"],
    tariffaVisita: 120,
  },
  {
    slug: "gennaro-iovine",
    name: "Dr. Gennaro Iovine",
    title: "Specialista in Radiodiagnostica",
    branca: "Ecografia & Diagnostica per Immagini",
    affiliation: "Già Dirigente Medico — A.O.R.N. \"Antonio Cardarelli\", U.O.C. Radiologia",
    image: "/images/doctors/gennaro-iovine.jpg",
    bio: "Il Dr. Iovine porta nel nostro centro un'esperienza maturata su migliaia di esami ecografici in ambito ospedaliero, applicata oggi a un contesto ambulatoriale rapido e ben organizzato. La sua diagnostica per immagini è il punto di riferimento trasversale a più branche cliniche del centro.",
    approach:
      "Un'immagine diagnostica di qualità vale quanto il tempo dedicato a leggerla: referto accurato, spiegato chiaramente, disponibile subito nella tua area digitale.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università degli Studi di Napoli \"Federico II\"",
      "Specializzazione in Radiodiagnostica — Università della Campania \"Luigi Vanvitelli\"",
      "Perfezionamento in Ecografia Internistica e Muscolo-Scheletrica",
      "Esperienza pluriennale in diagnostica per immagini ospedaliera d'urgenza",
      "Formazione continua in ecografia vescico-prostatica e tiroidea",
    ],
    servizi: [
      "Ecografia addome completo",
      "Ecografia tiroidea e paratiroidea",
      "Ecografia apparato urinario e vescico-prostatica",
      "Ecografia pelvica sovrapubica",
      "Ecografia muscolo-tendinea",
    ],
    specialtyId: "radiologia-ecografie",
    clubTierIds: ["experience", "signature"],
    tariffaVisita: 90,
  },
  {
    slug: "ilaria-russo",
    name: "Dr.ssa Ilaria Russo",
    title: "Specialista in Oftalmologia",
    branca: "Oculistica & Salute della Vista",
    affiliation: "Consulente oculista — A.O.U. Vanvitelli, U.O.C. Oculistica",
    image: "/images/doctors/ilaria-russo.jpg",
    bio: "La Dr.ssa Russo si dedica alla prevenzione oculistica per tutte le età, dallo screening pediatrico ai controlli di routine per l'adulto. Predilige un approccio informativo, spiegando ogni esame in modo che il paziente comprenda davvero lo stato di salute della propria vista.",
    approach:
      "La vista si tutela con controlli regolari, non con interventi tardivi: per questo rendo ogni visita un momento di educazione oltre che di diagnosi.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università della Campania \"Luigi Vanvitelli\"",
      "Specializzazione in Oftalmologia — Università della Campania \"Luigi Vanvitelli\"",
      "Perfezionamento in Tonometria e Diagnostica del Fondo Oculare",
      "Esperienza in screening visivi scolastici e pediatrici",
      "Aggiornamento continuo in prevenzione del glaucoma",
    ],
    servizi: [
      "Visita oculistica completa",
      "Esame del visus e della refrazione",
      "Tonometria per la pressione intraoculare",
      "Esame del fondo oculare (fundus oculi)",
    ],
    specialtyId: "oculistica",
    clubTierIds: ["care", "experience", "signature"],
    tariffaVisita: 110,
  },
  {
    slug: "teresa-amato",
    name: "Dr.ssa Teresa Amato",
    title: "Specialista in Pediatria",
    branca: "Pediatria & Cura della Crescita",
    affiliation: "Consulente pediatra — Policlinico Universitario \"Federico II\"",
    image: "/images/doctors/teresa-amato.jpg",
    bio: "La Dr.ssa Amato ha scelto la pediatria ambulatoriale per costruire un rapporto continuativo con le famiglie, in un ambiente pensato per mettere a proprio agio i più piccoli. Coordina inoltre i percorsi di ortodonzia intercettiva con l'équipe odontoiatrica.",
    approach:
      "Un bambino sereno è un bambino che collabora: dedico tempo a costruire fiducia, prima ancora che a eseguire la visita.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università degli Studi di Napoli \"Federico II\"",
      "Specializzazione in Pediatria — Università degli Studi di Napoli \"Federico II\"",
      "Perfezionamento in Nutrizione Pediatrica ed Educazione Alimentare",
      "Esperienza in bilanci di salute e certificazioni sportive non agonistiche",
      "Collaborazione con l'équipe di ortodonzia intercettiva",
    ],
    servizi: [
      "Visite di controllo della crescita (bilanci di salute)",
      "Certificazioni per idoneità sportiva non agonistica",
      "Supporto nutrizionale pediatrico",
      "Coordinamento con ortodonzia intercettiva",
    ],
    specialtyId: "pediatria",
    clubTierIds: ["family-basic", "family-elite"],
    tariffaVisita: 90,
  },
  {
    slug: "federica-caputo",
    name: "Dr.ssa Federica Caputo",
    title: "Specialista in Ginecologia e Ostetricia",
    branca: "Ginecologia & Benessere Intimo",
    affiliation: "Consulente ginecologa — A.O.U. Vanvitelli, U.O.C. Ginecologia e Ostetricia",
    image: "/images/doctors/federica-caputo.jpg",
    bio: "La Dr.ssa Caputo accompagna le pazienti in ogni fase della vita, dalla prevenzione di routine alla gestione del climaterio, con un'attenzione particolare all'equilibrio ormonale e al microbiota intimo. Lavora a stretto contatto con l'équipe di Donna Precision.",
    approach:
      "La salute della donna cambia nel tempo: il mio compito è adattare il percorso di prevenzione a ogni fase, senza schemi standardizzati.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università della Campania \"Luigi Vanvitelli\"",
      "Specializzazione in Ginecologia e Ostetricia — Università della Campania \"Luigi Vanvitelli\"",
      "Perfezionamento in Ecografia Pelvica e Transvaginale",
      "Formazione in valutazione del climaterio e della menopausa",
      "Collaborazione con i percorsi Donna Precision e microbiota vaginale",
    ],
    servizi: [
      "Visita ginecologica di controllo",
      "Ecografia pelvica transvaginale / sovrapubica",
      "Valutazione del climaterio e della menopausa",
      "Test del microbiota vaginale integrato",
    ],
    specialtyId: "ginecologia",
    clubTierIds: ["care", "experience", "signature"],
    tariffaVisita: 110,
  },
  {
    slug: "luca-marino",
    name: "Dr. Luca Marino",
    title: "Specialista in Scienza dell'Alimentazione",
    branca: "Nutrizione Clinica & Metabolismo",
    affiliation: "Docente a contratto — Università degli Studi di Napoli \"Federico II\"",
    image: "/images/doctors/luca-marino.jpg",
    bio: "Il Dr. Marino applica un approccio nutrizionale basato su dati clinici e biologia individuale, integrando quando indicato il profilo genetico e il microbiota intestinale nella costruzione dei piani alimentari. Nessuna dieta generica: solo protocolli personalizzati.",
    approach:
      "La nutrizione di precisione parte dai dati, non dalle mode: analizzo la risposta biologica individuale per costruire un piano che funzioni davvero, nel tempo.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università degli Studi di Napoli \"Federico II\"",
      "Specializzazione in Scienza dell'Alimentazione — Università degli Studi di Napoli \"Federico II\"",
      "Perfezionamento in Nutrigenomica e Test DNA 5 Nutri Metabolic",
      "Formazione in interpretazione del microbiota intestinale NGS",
      "Docenze e relazioni in convegni di nutrizione clinica",
    ],
    servizi: [
      "Consulenza nutrizionale con anamnesi metabolica",
      "Piani alimentari personalizzati su base clinica",
      "Percorsi Nutri Precision (DNA 5 e microbiota)",
      "Follow-up e monitoraggio della composizione corporea",
    ],
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 100,
  },
];

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return DOCTORS.find((d) => d.slug === slug);
}

export function getDoctorsByClubTier(tierId: string): Doctor[] {
  return DOCTORS.filter((d) => d.clubTierIds.includes(tierId));
}

export function getDoctorsBySpecialty(specialtyId: string): Doctor[] {
  return DOCTORS.filter((d) => d.specialtyId === specialtyId);
}

export function getDoctorsByTreatment(treatmentSlug: string): Doctor[] {
  return DOCTORS.filter((d) => d.treatmentSlugs?.includes(treatmentSlug));
}

export const BRANCHE = Array.from(new Set(DOCTORS.map((d) => d.branca)));
