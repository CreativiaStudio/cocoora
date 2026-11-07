import type { Doctor } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Database Specialisti Cocoora Centro Medico.
// Organico ufficiale desunto dal calendario clinico (Novembre 2026).
// ─────────────────────────────────────────────────────────────────────────

export const DOCTORS: Doctor[] = [
  {
    slug: "elisa-russo",
    name: "Dott.ssa Elisa Russo",
    title: "Direttrice Sanitaria · Specialista in Ortognatodonzia e Odontoiatria Pediatrica",
    branca: "Odontoiatria & Ortodonzia Digitale",
    affiliation: "Direttrice Sanitaria — Cocoora Centro Medico",
    badge: "Direzione Sanitaria",
    image: "/images/doctors/elisa-russo.jpg",
    bio: "La Dott.ssa Elisa Russo guida la direzione sanitaria del centro con una visione incentrata sulla prevenzione precoce, sull'ortodonzia digitale con allineatori trasparenti e sul benessere odontoiatrico completo di adulti e bambini.",
    approach:
      "La salute del cavo orale è il primo presidio di salute sistemica: pianifichiamo ogni percorso con diagnosi digitale 3D, garantendo trattamenti confortevoli, predicibili e senza sorprese.",
    curriculum: [
      "Laurea in Odontoiatria e Protesi Dentaria — Università degli Studi di Napoli Federico II",
      "Specializzazione in Ortognatodonzia e Odontoiatria Pediatrica",
      "Perfezionamento in Ortodonzia Digitale con Allineatori Trasparenti",
      "Membro della Società Italiana di Ortodonzia (SIDO)",
    ],
    servizi: [
      "Ortodonzia con allineatori trasparenti per adulti e ragazzi",
      "Ortodonzia intercettiva pediatrica",
      "Igiene dentale professionale e prevenzione parodontale",
      "Conservativa estetica ed endodonzia",
    ],
    treatmentSlugs: [
      "allineatori-trasparenti",
      "ortodonzia-intercettiva",
      "igiene-dentale",
      "sbiancamento-dentale",
    ],
    specialtyId: "odontoiatria",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "raffaele-dalessio",
    name: "Dr. Raffaele D'Alessio",
    title: "Chirurgo Orale e Implantologo",
    branca: "Odontoiatria & Ortodonzia Digitale",
    affiliation: "Specialista in Chirurgia Orale e Implantologia Guidata",
    image: "/images/doctors/raffaele-dalessio.jpg",
    bio: "Il Dr. D'Alessio è chirurgo orale dedicato alla riabilitazione complessa, all'implantologia computer-guidata a carico immediato e alla chirurgia ossea piezoelettrica mininvasiva.",
    approach:
      "Precisione millimetrica e massimo comfort: la chirurgia guidata 3D permette di ripristinare funzionalità ed estetica con tempi di guarigione minimi.",
    curriculum: [
      "Laurea in Odontoiatria e Protesi Dentaria — Università degli Studi di Napoli Federico II",
      "Perfezionamento in Chirurgia Orale Avanzata e Rigenerazione Ossea",
      "Master in Implantologia Osteointegrata e Carico Immediato",
    ],
    servizi: [
      "Implantologia computer-guidata a carico immediato",
      "Chirurgia ossea ricostruttiva e rigenerazione guidata",
      "Estrazioni complesse di elementi inclusi",
    ],
    specialtyId: "odontoiatria",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "alessandra-riccardi",
    name: "Dott.ssa Alessandra Riccardi",
    title: "Medico Estetico e Rigenerativo",
    branca: "Medicina Estetica Avanzata",
    affiliation: "Specialista in Medicina Rigenerativa e Trattamenti Laser",
    image: "/images/doctors/alessandra-riccardi.jpg",
    bio: "La Dott.ssa Alessandra Riccardi unisce la medicina estetica alla biostimolazione rigenerativa, focalizzandosi su trattamenti viso e corpo che esaltano l'armonia naturale senza alterare l'espressività.",
    approach:
      "La medicina estetica d'eccellenza non stravolge: rigenera la qualità biologica dei tessuti con tecnologie laser all'avanguardia e protocolli su misura.",
    curriculum: [
      "Laurea in Medicina e Chirurgia — Università degli Studi di Napoli Federico II",
      "Master Universitario di II Livello in Medicina Estetica e Rigenerativa",
      "Formazione avanzata in laserterapia dermatologica ed estetica",
    ],
    servizi: [
      "Biorivitalizzazione e biostimolazione con acido ialuronico e polinucleotidi",
      "Trattamenti laser vascolari e pigmentari",
      "Rimodellamento labbra e profilo viso naturale",
    ],
    treatmentSlugs: [
      "biorivitalizzazione",
      "acido-ialuronico-filler",
      "laser-ringiovanimento",
    ],
    specialtyId: "medicina-estetica",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "titti-errico",
    name: "Dott.ssa Titti Errico",
    title: "Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica",
    branca: "Medicina Estetica Avanzata",
    affiliation: "Specialista in Chirurgia Estetica e Protocolli Rigenerativi",
    image: "/images/doctors/titti-errico.jpg",
    bio: "La Dott.ssa Titti Errico opera in sinergia con il Prof. D'Andrea, dedicandosi alla medicina estetica avanzata, alla chirurgia ambulatoriale mininvasiva e al ringiovanimento cutaneo profondo.",
    approach:
      "Ogni persona ha un'armonia propria: definiamo interventi personalizzati che valorizzano la bellezza autentica nel rispetto della fisionomia.",
    curriculum: [
      "Laurea in Medicina e Chirurgia con lode",
      "Specializzazione in Chirurgia Plastica, Ricostruttiva ed Estetica",
      "Perfezionamento in tecniche iniettive avanzate e biorimodellamento",
    ],
    servizi: [
      "Filler dermici avanzati e distensione rughe",
      "Chirurgia ambulatoriale delle neoformazioni cutanee",
      "Biorivitalizzazione con fili di trazione e biostimolanti",
    ],
    specialtyId: "medicina-estetica",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "patty-scorzelli",
    name: "Patrizia Scorzelli",
    title: "Operatrice Estetica",
    branca: "Medicina Estetica Avanzata",
    affiliation: "Operatrice Estetica — Cocoora Centro Medico",
    image: "/images/doctors/patty-scorzelli.jpg",
    bio: "Patrizia Scorzelli è operatrice estetica specializzata in trattamenti corpo, silhouette e tecnologie estetiche avanzate per il benessere dei tessuti.",
    approach:
      "Protocolli estetici personalizzati per la cura della persona, con approccio dedicato e massima attenzione al benessere dei tessuti.",
    curriculum: [
      "Operatrice Estetica qualificata",
      "Specializzazione in trattamenti estetici corpo e tecnologie avanzate",
      "Perfezionamento in protocolli silhouette e benessere cutaneo",
    ],
    servizi: [
      "Trattamenti estetici corpo e silhouette",
      "Protocolli di benessere cutaneo e rigenerazione",
      "Assistenza e cura personalizzata della persona",
    ],
    specialtyId: "carbossiterapia",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "anna-maria-stillo",
    name: "Dott.ssa Anna Maria Stillo",
    title: "Specialista in Cardiologia ed Ecografia Cardiaca",
    branca: "Cardiologia & Diagnostica Vascolare",
    affiliation: "Specialista in Cardiologia Clinica ed Imaging Cardiovascolare",
    image: "/images/doctors/anna-maria-stillo.jpg",
    bio: "La Dott.ssa Anna Maria Stillo è cardiologa dedicata alla prevenzione cardiovascolare primaria e secondaria, all'elettrocardiografia ad alta definizione e all'ecocardiografia color-Doppler.",
    approach:
      "La tutela del cuore richiede ascolto clinico meticoloso e diagnostica per immagini puntuale, prima ancora che insorgano sintomi clinici conclamati.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione in Malattie dell'Apparato Cardiovascolare",
      "Master in Ecocardiografia Color Doppler avanzata",
    ],
    servizi: [
      "Visita cardiologica specialistica",
      "Elettrocardiogramma (ECG) a riposo",
      "Ecocardiogramma color-Doppler transtoracico",
      "Valutazione del rischio cardiovascolare globale",
    ],
    specialtyId: "cardiologia",
    clubTierIds: ["care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "giuseppe-buono",
    name: "Dr. Giuseppe Buono",
    title: "Specialista in Diagnostica per Immagini ed Ecografia Clinica",
    branca: "Diagnostica Ecografica",
    affiliation: "Specialista in Radiodiagnostica ed Ecografia Internistica",
    image: "/images/doctors/giuseppe-buono.jpg",
    bio: "Il Dr. Giuseppe Buono gestisce il servizio di diagnostica ecografica con ecografo digitale di ultima generazione, assicurando refertazione accurata e tempi rapidi per tutte le indagini internistiche.",
    approach:
      "Un'ecografia ad alta definizione costituisce la base oggettiva per orientare le scelte terapeutiche di tutte le specialità del centro.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione in Radiodiagnostica",
      "Perfezionamento in Ecografia Internistica, Tiroidea e Vascolare",
    ],
    servizi: [
      "Ecografia addome completo e superiore",
      "Ecografia tiroidea e paratiroidea con color-Doppler",
      "Ecografia apparato urinario e renale",
      "Ecocolordoppler dei vasi periferici e sovraortici",
    ],
    specialtyId: "ecografia",
    clubTierIds: ["experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "mario-toro",
    name: "Dr. Mario Toro",
    title: "Specialista in Oculistica e Chirurgia Refrattiva",
    branca: "Oculistica & Salute della Vista",
    affiliation: "Specialista in Oftalmologia e Diagnostica Oculare",
    image: "/images/doctors/mario-toro.jpg",
    bio: "Il Dr. Mario Toro si occupa della salute della vista e della prevenzione oftalmologica, dalla misurazione della pressione intraoculare all'esame del fondo oculare e biomicroscopia del segmento anteriore.",
    approach:
      "La vista è il senso primario attraverso cui percepiamo il mondo: controlli periodici accurati preservano la qualità visiva a ogni età.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione in Oftalmologia",
      "Esperienza in diagnostica strumentale oculare avanzata e tonometria",
    ],
    servizi: [
      "Visita oculistica completa per adulti e ragazzi",
      "Tonometria per lo screening del glaucoma",
      "Esame del fondo oculare (fundus oculi)",
      "Biomicroscopia alla lampada a fessura",
    ],
    specialtyId: "oculistica",
    clubTierIds: ["care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "raffaella-poppiti",
    name: "Dott.ssa Raffaella Poppiti",
    title: "Specialista in Ginecologia, Ostetricia ed Ecografia Pelvica",
    branca: "Ginecologia & Benessere Donna",
    affiliation: "Specialista in Ginecologia Clinica e Prevenzione di Genere",
    image: "/images/doctors/raffaella-poppiti.jpg",
    bio: "La Dott.ssa Raffaella Poppiti segue la salute femminile nelle diverse fasi della vita, dalla prevenzione adolescenziale e contraccettiva alla maternità e al benessere in menopausa.",
    approach:
      "Accoglienza, riservatezza e ascolto empatico per una prevenzione ginecologica serena, integrata con l'ecografia pelvica e transvaginale.",
    curriculum: [
      "Laurea in Medicina e Chirurgia con lode",
      "Specializzazione in Ginecologia e Ostetricia",
      "Master in Ecografia Ostetrico-Ginecologica",
    ],
    servizi: [
      "Visita ginecologica specialistica",
      "Ecografia pelvica transvaginale e sovrapubica",
      "Consulenza contraccettiva e preconcezionale",
      "Prevenzione e gestione ormonale della menopausa",
    ],
    specialtyId: "ginecologia",
    clubTierIds: ["care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "alessandra-totaro",
    name: "Dott.ssa Alessandra Totaro",
    title: "Psicologa Clinica e Psicoterapeuta",
    branca: "Psicologia & Benessere Integrato",
    affiliation: "Psicologa e Psicoterapeuta ad Orientamento Integrato",
    image: "/images/doctors/alessandra-totaro.jpg",
    bio: "La Dott.ssa Alessandra Totaro offre percorsi di sostegno psicologico, gestione dell'ansia e dello stress e percorsi di consapevolezza emotiva integrati con la salute fisica.",
    approach:
      "Il corpo e la mente dialogano costantemente: la vera longevità e salute richiedono un equilibrio emotivo solido e armonioso.",
    curriculum: [
      "Laurea Magistrale in Psicologia Clinica",
      "Specializzazione in Psicoterapia",
      "Formazione in gestione dello stress e psiconutrizione",
    ],
    servizi: [
      "Colloquio clinico individuale",
      "Percorsi di supporto psicologico e mindfulness",
      "Sostegno nella gestione del cambiamento e dello stress",
    ],
    specialtyId: "psicologia",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "jessica-de-ceglie",
    name: "Dott.ssa Jessica De Ceglie",
    title: "Biologa Nutrizionista Specialista in Educazione Alimentare",
    branca: "Nutrizione Clinica & Metabolismo",
    affiliation: "Biologa Nutrizionista Clinica",
    image: "/images/doctors/jessica-de-ceglie.jpg",
    bio: "La Dott.ssa Jessica De Ceglie è dedicata alla nutrizione clinica e ai protocolli mirati per il metabolismo, il supporto all'attività fisica e la prevenzione infiammatoria.",
    approach:
      "Il cibo è medicina preventiva: la nutrizione mirata migliora energia, longevità e forma fisica in modo misurabile e costante.",
    curriculum: [
      "Laurea Magistrale in Biologia della Nutrizione",
      "Corso di Alta Formazione in Nutrizione Preventiva e Anti-Aging",
    ],
    servizi: [
      "Consulenza nutrizionale e valutazione metabolica",
      "Percorsi nutrizionali personalizzati",
      "Supporto alimentare integrato",
    ],
    specialtyId: "nutrizione",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "martina-pontillo",
    name: "Dott.ssa Martina Pontillo",
    title: "Specialista in Senologia ed Ecografia Mammaria",
    branca: "Senologia & Prevenzione Donna",
    affiliation: "Specialista in Senologia Diagnostica",
    image: "/images/doctors/martina-pontillo.jpg",
    bio: "La Dott.ssa Martina Pontillo si dedica alla prevenzione senologica con visita clinica accurata ed ecografia mammaria ad alta risoluzione (si ricorda che la mammografia non è eseguita in sede).",
    approach:
      "La prevenzione senologica regolare è il dono più prezioso che ogni donna possa fare a se stessa, affrontata con serenità e competenza specialistica.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione con indirizzo senologico",
      "Esperienza in ecografia mammaria ad alta definizione",
    ],
    servizi: [
      "Visita senologica clinica",
      "Ecografia mammaria bilaterale ad alta risoluzione",
      "Valutazione del profilo di rischio familiare",
    ],
    specialtyId: "senologia",
    clubTierIds: ["care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "vittorio-riccio",
    name: "Dr. Vittorio Riccio",
    title: "Specialista in Oncologia Medica e Prevenzione",
    branca: "Oncologia & Prevenzione Clinica",
    affiliation: "Specialista in Oncologia Medica",
    image: "/images/doctors/vittorio-riccio.jpg",
    bio: "Il Dr. Vittorio Riccio si occupa di prevenzione oncologica primaria, consulenze specialistiche per la valutazione dei fattori di rischio e percorsi di follow-up.",
    approach:
      "Prevenire significa conoscere i propri fattori biologici e intervenire tempestivamente con percorsi diagnostici appropriati.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione in Oncologia Medica",
      "Formazione in prevenzione e stili di vita per la longevità",
    ],
    servizi: [
      "Visita oncologica specialistica preventiva",
      "Valutazione del rischio oncologico eredo-familiare",
      "Counseling clinico e follow-up preventivo",
    ],
    specialtyId: "oncologia",
    clubTierIds: ["experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "guido-ciorra",
    name: "Dr. Guido Ciorra",
    title: "Specialista in Chirurgia Generale e Ambulatoriale Mininvasiva",
    branca: "Chirurgia Generale & Ambulatoriale",
    affiliation: "Specialista in Chirurgia Generale e Mininvasiva",
    image: "/images/doctors/guido-ciorra.jpg",
    bio: "Il Dr. Guido Ciorra è chirurgo dedicato alla diagnostica e al trattamento ambulatoriale delle patologie di interesse chirurgico generale, dermatologico e dei tessuti molli.",
    approach:
      "La chirurgia ambulatoriale moderna unisce rigore tecnico e mininvasività per risolvere problematiche cliniche in sicurezza e senza degenza.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione in Chirurgia Generale",
      "Esperienza in chirurgia ambulatoriale mininvasiva",
    ],
    servizi: [
      "Visita di chirurgia generale specialistica",
      "Chirurgia dermatologica ambulatoriale",
      "Valutazione delle lesioni dei tessuti molli",
    ],
    specialtyId: "chirurgia-generale",
    clubTierIds: ["care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "rocco-spera",
    name: "Dr. Rocco Spera",
    title: "Specialista in Medicina dello Sport e Valutazione Funzionale",
    branca: "Medicina dello Sport & Valutazione Funzionale",
    affiliation: "Specialista in Medicina dello Sport",
    image: "/images/doctors/rocco-spera.jpg",
    bio: "Il Dr. Rocco Spera effettua valutazioni clinico-funzionali per sportivi agonisti e amatori, promuovendo l'attività fisica come strumento insostituibile di prevenzione e longevità.",
    approach:
      "Lo sport praticato in sicurezza è la prima terapia per il sistema cardiovascolare e metabolico: valutiamo con rigore l'idoneità fisica.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione in Medicina dello Sport",
      "Perfezionamento in Valutazione Funzionale dell'Atleta",
    ],
    servizi: [
      "Visita specialistica di medicina dello sport",
      "Test da sforzo ed elettrocardiogramma",
      "Consulenza per l'idoneità fisica e l'allenamento sicuro",
    ],
    specialtyId: "medicina-sport",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "filippo-iaccarino",
    name: "Dr. Filippo Iaccarino",
    title: "Specialista in Pediatria e Cura dell'Accrescimento",
    branca: "Pediatria & Cura della Crescita",
    affiliation: "Specialista in Pediatria Clinica e Cure Pediatriche",
    image: "/images/doctors/filippo-iaccarino.jpg",
    bio: "Il Dr. Filippo Iaccarino accoglie le famiglie e i piccoli pazienti con disponibilità ed empatia, seguendo i bilanci di salute e le tappe fondamentali dello sviluppo pediatrico.",
    approach:
      "Ogni bambino merita un ambiente rilassante e rassicurante: la visita pediatrica deve essere un'esperienza positiva sia per il bambino sia per i genitori.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione in Pediatria",
      "Esperienza in bilanci di crescita e prevenzione infantile",
    ],
    servizi: [
      "Visita pediatrica specialistica e bilanci di salute",
      "Monitoraggio dell'accrescimento e sviluppo",
      "Consulenza per l'alimentazione del bambino",
    ],
    specialtyId: "pediatria",
    clubTierIds: ["access", "care", "experience", "signature"],
    tariffaVisita: 0,
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
