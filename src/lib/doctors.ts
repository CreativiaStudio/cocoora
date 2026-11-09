import type { Doctor } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Database Specialisti Cocoora Centro Medico.
// Organico ufficiale desunto dal calendario clinico (Novembre 2026).
// Nomenclatura ufficiale: nomi senza prefissi Dr./Dott.ssa e titoli per esteso.
// ─────────────────────────────────────────────────────────────────────────

export const DOCTORS: Doctor[] = [
  // ── Specialisti con foto ritratto ufficiale (7) ────────────────────────
  {
    slug: "elisa-russo",
    name: "Elisa Russo",
    title: "Odontoiatra, Specialista in Ortognatodonzia · Direttrice Sanitaria",
    branca: "Odontoiatria & Ortodonzia Digitale",
    affiliation: "Odontoiatra, Specialista in Ortognatodonzia · Direttrice Sanitaria",
    badge: "Direzione Sanitaria",
    image: "/images/doctors/elisa-russo.jpg",
    bio: "Elisa Russo guida la direzione sanitaria del centro con una visione incentrata sulla prevenzione precoce, sull'ortodonzia digitale con allineatori trasparenti e sul benessere odontoiatrico completo di adulti e bambini.",
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
    slug: "titti-errico",
    name: "Concetta Errico",
    title: "Medico Chirurgo e Specialista in Chirurgia Plastica e Ricostruttiva",
    branca: "Medicina Estetica Avanzata",
    affiliation: "Medico Chirurgo e Specialista in Chirurgia Plastica e Ricostruttiva",
    image: "/images/doctors/titti-errico.jpg",
    bio: "Concetta Errico si dedica alla medicina estetica avanzata, alla chirurgia ambulatoriale mininvasiva e al ringiovanimento cutaneo profondo con approccio sartoriale.",
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
    slug: "mirella-dandrea",
    name: "Mirella D'Andrea",
    title: "Medico Chirurgo, Specialista in Dermatologia e Venereologia",
    branca: "Dermatologia & Salute della Pelle",
    affiliation: "Medico Chirurgo, Specialista in Dermatologia e Venereologia",
    image: "/images/doctors/mirella-dandrea.jpg",
    bio: "Mirella D'Andrea è medico chirurgo specialista in dermatologia e venereologia. Si dedica alla diagnosi e cura delle affezioni cutanee, al controllo dei nei e al benessere di pelle, unghie e capelli.",
    approach:
      "La salute della pelle è fondamentale per il benessere complessivo: un approccio clinico scrupoloso e preventivo permette di intercettare precocemente ogni alterazione.",
    curriculum: [
      "Laurea in Medicina e Chirurgia",
      "Specializzazione in Dermatologia e Venereologia",
      "Perfezionamento in Dermatoscopia clinica e controllo nei",
    ],
    servizi: [
      "Visita dermatologica specialistica",
      "Dermatoscopia per il controllo dei nei",
      "Trattamento di dermatiti, affezioni cutanee e acne",
      "Valutazione della salute di capelli e unghie",
    ],
    specialtyId: "dermatologia",
    clubTierIds: ["experience", "signature"],
    tariffaVisita: 0,
  },
  {
    slug: "anna-maria-stillo",
    name: "Anna Maria Stillo",
    title: "Medico Chirurgo Specialista in Malattie dell’Apparato Cardiovascolare",
    branca: "Cardiologia & Diagnostica Vascolare",
    affiliation: "Medico Chirurgo Specialista in Malattie dell’Apparato Cardiovascolare",
    image: "/images/doctors/anna-maria-stillo.jpg",
    bio: "Anna Maria Stillo è cardiologa dedicata alla prevenzione cardiovascolare primaria e secondaria, all'elettrocardiografia ad alta definizione e all'ecocardiografia color-Doppler.",
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
    name: "Giuseppe Buono",
    title: "Medico Chirurgo Specialista in Radiodiagnostica",
    branca: "Diagnostica Ecografica",
    affiliation: "Medico Chirurgo Specialista in Radiodiagnostica",
    image: "/images/doctors/giuseppe-buono.jpg",
    bio: "Giuseppe Buono gestisce il servizio di diagnostica ecografica con ecografo digitale di ultima generazione, assicurando refertazione accurata e tempi rapidi per tutte le indagini internistiche.",
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
    slug: "alessandra-totaro",
    name: "Alessandra Totaro",
    title: "Psicologa, Psicoterapeuta",
    branca: "Psicologia & Benessere Integrato",
    affiliation: "Psicologa, Psicoterapeuta",
    image: "/images/doctors/alessandra-totaro.jpg",
    bio: "Alessandra Totaro offre percorsi di sostegno psicologico, gestione dell'ansia e dello stress e percorsi di consapevolezza emotiva integrati con la salute fisica.",
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
    name: "Jessica De Ceglie",
    title: "Biologa, Nutrizionista",
    branca: "Nutrizione Clinica & Metabolismo",
    affiliation: "Biologa, Nutrizionista",
    image: "/images/doctors/jessica-de-ceglie.jpg",
    bio: "Jessica De Ceglie è dedicata alla nutrizione clinica e ai protocolli mirati per il metabolismo, il supporto all'attività fisica e la prevenzione infiammatoria.",
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

  // ── Specialisti con avatar placeholder (10) ────────────────────────────
  {
    slug: "raffaele-dalessio",
    name: "Raffaele D'Alessio",
    title: "Odontoiatria, Chirurgia e Implantologia",
    branca: "Odontoiatria & Ortodonzia Digitale",
    affiliation: "Odontoiatria, Chirurgia e Implantologia",
    image: "/images/doctors/raffaele-dalessio.jpg",
    bio: "Raffaele D'Alessio è chirurgo orale dedicato alla riabilitazione complessa, all'implantologia computer-guidata a carico immediato e alla chirurgia ossea piezoelettrica mininvasiva.",
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
    name: "Alessandra Riccardi",
    title: "Medico Chirurgo – Medicina Estetica",
    branca: "Medicina Estetica Avanzata",
    affiliation: "Medico Chirurgo – Medicina Estetica",
    image: "/images/doctors/alessandra-riccardi.jpg",
    bio: "Alessandra Riccardi unisce la medicina estetica alla biostimolazione rigenerativa, focalizzandosi su trattamenti viso e corpo che esaltano l'armonia naturale senza alterare l'espressività.",
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
    slug: "patty-scorzelli",
    name: "Patrizia Scorzelli",
    title: "Operatrice Estetica",
    branca: "Medicina Estetica Avanzata",
    affiliation: "Operatrice Estetica",
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
    slug: "martina-pontillo",
    name: "Martina Pontillo",
    title: "Medico Chirurgo – Senologia e Chirurgia Senologica",
    branca: "Senologia & Prevenzione Donna",
    affiliation: "Medico Chirurgo – Senologia e Chirurgia Senologica",
    image: "/images/doctors/martina-pontillo.jpg",
    bio: "Martina Pontillo si dedica alla prevenzione senologica con visita clinica accurata ed ecografia mammaria ad alta risoluzione (si ricorda che la mammografia non è eseguita in sede).",
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
    slug: "mario-toro",
    name: "Mario Toro",
    title: "Medico Chirurgo Specialista in Oftalmologia e Chirurgia Vitreo-Retinica",
    branca: "Oculistica & Salute della Vista",
    affiliation: "Medico Chirurgo Specialista in Oftalmologia e Chirurgia Vitreo-Retinica",
    image: "/images/doctors/mario-toro.jpg",
    bio: "Mario Toro si occupa della salute della vista e della prevenzione oftalmologica, dalla misurazione della pressione intraoculare all'esame del fondo oculare e biomicroscopia del segmento anteriore.",
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
    slug: "vittorio-riccio",
    name: "Vittorio Riccio",
    title: "Medico Chirurgo – Oncologia Medica",
    branca: "Oncologia & Prevenzione Clinica",
    affiliation: "Medico Chirurgo – Oncologia Medica",
    image: "/images/doctors/vittorio-riccio.jpg",
    bio: "Vittorio Riccio si occupa di prevenzione oncologica primaria, consulenze specialistiche per la valutazione dei fattori di rischio e percorsi di follow-up.",
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
    slug: "rocco-spera",
    name: "Rocco Spera",
    title: "Medico Chirurgo Specialista in Medicina dello Sport",
    branca: "Medicina dello Sport & Valutazione Funzionale",
    affiliation: "Medico Chirurgo Specialista in Medicina dello Sport",
    image: "/images/doctors/rocco-spera.jpg",
    bio: "Rocco Spera effettua valutazioni clinico-funzionali per sportivi agonisti e amatori, promuovendo l'attività fisica come strumento insostituibile di prevenzione e longevità.",
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
    name: "Filippo Iaccarino",
    title: "Medico Chirurgo Specialista in Pediatria e Neonatologia",
    branca: "Pediatria & Cura della Crescita",
    affiliation: "Medico Chirurgo Specialista in Pediatria e Neonatologia",
    image: "/images/doctors/filippo-iaccarino.jpg",
    bio: "Filippo Iaccarino accoglie le famiglie e i piccoli pazienti con disponibilità ed empatia, seguendo i bilanci di salute e le tappe fondamentali dello sviluppo pediatrico.",
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
