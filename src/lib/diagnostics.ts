import type { Specialty } from "./types";

export const SPECIALTIES: Specialty[] = [
  {
    id: "cardiologia",
    title: "Cardiologia & Diagnostica Vascolare",
    description:
      "Monitoraggio preventivo dell'apparato cardiovascolare con tecnologia ecocardiografica ed eco-color-Doppler ad alta risoluzione.",
    icon: "Heart",
    image: "/images/diagnostics-lab.jpg",
    exams: [
      "Visita cardiologica con anamnesi del rischio",
      "Elettrocardiogramma (ECG) a riposo",
      "Ecocardiogramma color-Doppler",
      "Ecocolordoppler TSA (Tronchi Sovraortici)",
      "Monitoraggio della pressione e holter su indicazione",
    ],
  },
  {
    id: "senologia",
    title: "Senologia & Prevenzione Donna",
    description:
      "Percorsi dedicati alla salute della ghiandola mammaria, con ecografia ad alta definizione e approccio multidisciplinare empatico.",
    icon: "ShieldCheck",
    image: "/images/doctor-consultation.jpg",
    exams: [
      "Visita senologica clinica",
      "Ecografia mammaria bilaterale ad alta risoluzione",
      "Valutazione della familiarità e profilo di rischio",
      "Integrazione con percorsi Donna Precision",
    ],
  },
  {
    id: "radiologia-ecografie",
    title: "Ecografia & Diagnostica per Immagini",
    description:
      "Diagnostica ecografica completa per organi interni, tiroide, apparato urinario e muscolo-scheletrico.",
    icon: "Activity",
    image: "/images/laser-technology.jpg",
    exams: [
      "Ecografia addome completo",
      "Ecografia tiroidea e paratiroidea",
      "Ecografia apparato urinario e vescico-prostatica",
      "Ecografia pelvica sovrapubica",
      "Ecografia muscolo-tendinea",
    ],
  },
  {
    id: "oculistica",
    title: "Oculistica & Salute della Vista",
    description:
      "Screening visivo avanzato, misurazione del tono oculare e valutazione del fondo oculare per tutte le età.",
    icon: "Eye",
    image: "/images/clinic-lounge.jpg",
    exams: [
      "Visita oculistica completa",
      "Esame del visus e refrazione",
      "Tonometria per pressione intraoculare",
      "Esame del fondo oculare (fundus oculi)",
    ],
  },
  {
    id: "pediatria",
    title: "Pediatria & Cura della Crescita",
    description:
      "Assistenza specialistica per neonati, bambini e adolescenti in un ambiente rilassante e rassicurante.",
    icon: "Baby",
    image: "/images/pediatric-family.jpg",
    exams: [
      "Visite di controllo della crescita (bilanci di salute)",
      "Certificazioni per idoneità sportiva non agonistica",
      "Supporto nutrizionale pediatrico ed educazione alimentare",
      "Consulenza coordinata con ortodonzia intercettiva pediatrica",
    ],
  },
  {
    id: "ginecologia",
    title: "Ginecologia & Benessere Intimo",
    description:
      "Dalla prevenzione di routine alla valutazione dell'equilibrio ormonale e del microbiota intimo.",
    icon: "Sparkles",
    image: "/images/aesthetic-skin.jpg",
    exams: [
      "Visita ginecologica di controllo",
      "Ecografia pelvica transvaginale / sovrapubica",
      "Valutazione climaterio e menopausa",
      "Test del microbiota vaginale integrato",
    ],
  },
];
