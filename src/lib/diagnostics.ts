import type { Specialty } from "./types";

export const SPECIALTIES: Specialty[] = [
  {
    id: "cardiologia",
    title: "Cardiologia & Diagnostica Vascolare",
    description:
      "Monitoraggio preventivo dell'apparato cardiovascolare con tecnologia ecocardiografica ed eco-color-Doppler ad alta risoluzione.",
    icon: "Heart",
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/diagnostics-lab.jpg",
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
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/senologia-napoli-1.jpg",
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
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/radiologia-napoli-1.jpg",
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
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/clinic-lounge.jpg",
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
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/pediatric-family.jpg",
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
    icon: "Heart",
    image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/aesthetic-skin.jpg",
    exams: [
      "Visita ginecologica di controllo",
      "Ecografia pelvica transvaginale / sovrapubica",
      "Valutazione climaterio e menopausa",
      "Test del microbiota vaginale integrato",
    ],
  },
];
