const fs = require('fs');
const path = require('path');

const parsed = JSON.parse(fs.readFileSync('scratch/parsed_data/all_parsed_treatments.json', 'utf8'));

// Helper per trovare immagini reali esistenti
function getImages(dir, prefix) {
  const fullDir = path.resolve(dir);
  if (!fs.existsSync(fullDir)) return [];
  const files = fs.readdirSync(fullDir);
  return files
    .filter(f => f.startsWith(prefix) && f.endsWith('.jpg'))
    .map(f => `/${path.relative(path.resolve('public'), path.join(fullDir, f)).replace(/\\/g, '/')}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ODONTOIATRIA
// ─────────────────────────────────────────────────────────────────────────────

const ODON_MAPPING = [
  {
    docKey: 'odontoiatria_allineatori-trasparenti.docx',
    slug: 'allineatori-trasparenti',
    aliases: ['allineatori-adulti', 'allineatori-adolescenti', 'allineatori-trasparenti-adulti', 'allineatori-trasparenti-adolescenti'],
    categoryName: 'Ortodonzia specialistica',
    imgPrefix: 'allineatori-trasparenti'
  },
  {
    docKey: 'odontoiatria_apparecchio-fisso.docx',
    slug: 'apparecchio-fisso',
    aliases: [],
    categoryName: 'Ortodonzia specialistica',
    imgPrefix: 'apparecchio-fisso'
  },
  {
    docKey: 'odontoiatria_ortodonzia-intercettiva.docx',
    slug: 'ortodonzia-intercettiva',
    aliases: ['ortodonzia-intercettiva-bambini'],
    categoryName: 'Ortodonzia specialistica',
    imgPrefix: 'ortodonzia-intercettiva'
  },
  {
    docKey: 'odontoiatria_contenzione.docx',
    slug: 'contenzione',
    aliases: [],
    categoryName: 'Ortodonzia specialistica',
    imgPrefix: 'contenzione'
  },
  {
    docKey: 'odontoiatria_visita-odontoiatrica.docx',
    slug: 'visita-odontoiatrica',
    aliases: [],
    categoryName: 'Salute e prevenzione',
    imgPrefix: 'visita-odontoiatrica'
  },
  {
    docKey: 'odontoiatria_igiene-orale-professionale.docx',
    slug: 'igiene',
    aliases: ['igiene-orale-professionale'],
    categoryName: 'Salute e prevenzione',
    imgPrefix: 'igiene-orale-professionale'
  },
  {
    docKey: 'odontoiatria_conservativa.docx',
    slug: 'conservativa',
    aliases: [],
    categoryName: 'Cura e riabilitazione',
    imgPrefix: 'conservativa'
  },
  {
    docKey: 'odontoiatria_endodonzia.docx',
    slug: 'endodonzia',
    aliases: [],
    categoryName: 'Cura e riabilitazione',
    imgPrefix: 'endodonzia'
  },
  {
    docKey: 'odontoiatria_paradontologia.docx',
    slug: 'parodontologia',
    aliases: ['paradontologia'],
    categoryName: 'Cura e riabilitazione',
    imgPrefix: 'paradontologia'
  },
  {
    docKey: 'odontoiatria_protesi.docx',
    slug: 'protesi',
    aliases: ['estetica-dentale'],
    categoryName: 'Cura e riabilitazione',
    imgPrefix: 'protesi'
  },
  {
    docKey: 'odontoiatria_implantologia.docx',
    slug: 'implantologia',
    aliases: [],
    categoryName: 'Cura e riabilitazione',
    imgPrefix: 'implantologia'
  }
];

const odonTreatments = [];

for (const m of ODON_MAPPING) {
  const d = parsed[m.docKey];
  if (!d) {
    console.warn(`Doc mancante: ${m.docKey}`);
    continue;
  }
  const images = getImages('public/images/trattamenti/odontoiatria', m.imgPrefix);
  const heroImage = images[0] || `/images/trattamenti/odontoiatria/${m.imgPrefix}-napoli-1.jpg`;
  const galleryImages = images.length > 0 ? images : [heroImage];
  const whatIsImage = galleryImages[1] || heroImage;
  const resultsImage = galleryImages[2] || galleryImages[1] || heroImage;

  const treatment = {
    slug: m.slug,
    aliases: m.aliases,
    title: d.title,
    category: 'odontoiatria',
    categoryName: m.categoryName,
    tagline: d.tagline,
    description: d.whatIs.description || d.tagline,
    heroImage,
    galleryImages,
    heroCta: 'Iscriviti gratuitamente al Cocoora Club',
    seo: {
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      keywordMain: d.keywordMain,
      keywordSec: d.keywordSec
    },
    whatIs: {
      title: d.whatIs.title || `Che cos’è ${d.title}?`,
      description: d.whatIs.description,
      paragraphs: d.whatIs.paragraphs,
      image: whatIsImage
    },
    problemsTitle: d.problemsTitle || 'Cosa vorresti migliorare?',
    problemsSubtitle: d.problemsSubtitle || '',
    problemsGrid: d.problemsGrid,
    leadForm: d.leadForm && d.leadForm.title ? { title: d.leadForm.title, subtitle: d.leadForm.subtitle || '', cta: d.leadForm.cta || 'Richiedi ora' } : undefined,
    timelineTitle: d.timelineTitle || 'Il percorso clinico passo dopo passo',
    timelineSteps: d.timelineSteps.map((s, idx) => ({
      stepNumber: `0${idx + 1}`,
      title: s.title,
      description: s.description
    })),
    steps: d.timelineSteps.map(s => ({ title: s.title, description: s.description })),
    results: {
      title: d.results.title || 'Cosa aspettarsi dal trattamento',
      description: d.results.description,
      paragraphs: d.results.paragraphs,
      image: resultsImage
    },
    faq: d.faq,
    localSeo: {
      title: d.localSeo.title || `${d.title} a Napoli`,
      description: d.localSeo.description,
      cta: 'Iscriviti gratuitamente al Cocoora Club'
    }
  };
  odonTreatments.push(treatment);
}

const odonFileContent = `import type { Treatment } from "./types";

/**
 * Catalogo Ufficiale Odontoiatria & Ortodonzia Cocoora Centro Medico
 * Sincronizzato dai materiali ufficiali e cartelle Drive (Silvia Monticelli)
 */
export const ODONTOIATRIA_TREATMENTS: Treatment[] = ${JSON.stringify(odonTreatments, null, 2)};
`;

fs.writeFileSync('src/lib/treatments-odontoiatria.ts', odonFileContent, 'utf8');
console.log(`✅ Generato src/lib/treatments-odontoiatria.ts con ${odonTreatments.length} trattamenti.`);

// ─────────────────────────────────────────────────────────────────────────────
// 2. VISITE SPECIALISTICHE
// ─────────────────────────────────────────────────────────────────────────────

const VISITE_MAPPING = [
  {
    docKey: 'visite_nutrizione.docx',
    slug: 'nutrizione',
    categoryName: 'Benessere e cura di sé',
    imgPrefix: 'nutrizione'
  },
  {
    docKey: 'visite_medicina-estetica.docx',
    slug: 'medicina-estetica',
    categoryName: 'Benessere e cura di sé',
    imgPrefix: 'medicina-estetica'
  },
  {
    docKey: 'visite_dermatologia.docx',
    slug: 'dermatologia',
    categoryName: 'Benessere e cura di sé',
    imgPrefix: 'dermatologia'
  },
  {
    docKey: 'visite_chirurgia-plastica.docx',
    slug: 'chirurgia-plastica',
    categoryName: 'Benessere e cura di sé',
    imgPrefix: 'chiururgia-plastica'
  },
  {
    docKey: 'visite_radiologia.docx',
    slug: 'radiologia',
    categoryName: 'Diagnostica e prevenzione',
    imgPrefix: 'radiologia'
  },
  {
    docKey: 'visite_cardiologia.docx',
    slug: 'cardiologia',
    categoryName: 'Diagnostica e prevenzione',
    imgPrefix: 'cardiologia'
  },
  {
    docKey: 'visite_diabetologia.docx',
    slug: 'diabetologia',
    categoryName: 'Diagnostica e prevenzione',
    imgPrefix: 'diabetologia'
  },
  {
    docKey: 'visite_ginecologia.docx',
    slug: 'ginecologia',
    categoryName: 'Diagnostica e prevenzione',
    imgPrefix: 'ginecologia'
  },
  {
    docKey: 'visite_pediatria.docx',
    slug: 'pediatria',
    categoryName: 'Diagnostica e prevenzione',
    imgPrefix: 'pediatria'
  },
  {
    docKey: 'visite_oculistica.docx',
    slug: 'oculistica',
    categoryName: 'Diagnostica e prevenzione',
    imgPrefix: 'oculistica'
  },
  {
    docKey: 'visite_psicologia.docx',
    slug: 'psicologia',
    categoryName: 'Specialistiche per la famiglia',
    imgPrefix: 'psicologia'
  },
  {
    docKey: 'visite_medicina-dello-sport.docx',
    slug: 'medicina-dello-sport',
    categoryName: 'Specialistiche per la famiglia',
    imgPrefix: 'medicina-dello-sport'
  },
  {
    docKey: 'visite_senologia.docx',
    slug: 'senologia',
    categoryName: 'Specialistiche per la famiglia',
    imgPrefix: 'senologia'
  },
  {
    docKey: 'visite_oncologia.docx',
    slug: 'oncologia',
    categoryName: 'Specialistiche per la famiglia',
    imgPrefix: 'oncologia'
  }
];

const visiteList = [];

for (const m of VISITE_MAPPING) {
  const d = parsed[m.docKey];
  if (!d) {
    console.warn(`Doc mancante: ${m.docKey}`);
    continue;
  }
  const images = getImages('public/images/visite', m.imgPrefix);
  const heroImage = images[0] || `/images/visite/${m.imgPrefix}-napoli-1.jpg`;
  const galleryImages = images.length > 0 ? images : [heroImage];
  const whatIsImage = galleryImages[1] || heroImage;
  const resultsImage = galleryImages[2] || galleryImages[1] || heroImage;

  const item = {
    slug: m.slug,
    title: d.title,
    categoryName: m.categoryName,
    tagline: d.tagline,
    description: d.whatIs.description || d.tagline,
    heroImage,
    galleryImages,
    heroCta: 'Iscriviti gratuitamente al Cocoora Club',
    seo: {
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      keywordMain: d.keywordMain,
      keywordSec: d.keywordSec
    },
    whatIs: {
      title: d.whatIs.title || `In cosa consiste la ${d.title}?`,
      description: d.whatIs.description,
      paragraphs: d.whatIs.paragraphs,
      image: whatIsImage
    },
    problemsTitle: d.problemsTitle || 'Quando è indicata?',
    problemsSubtitle: d.problemsSubtitle || '',
    problemsGrid: d.problemsGrid,
    leadForm: d.leadForm && d.leadForm.title ? { title: d.leadForm.title, subtitle: d.leadForm.subtitle || '', cta: d.leadForm.cta || 'Richiedi ora' } : undefined,
    timelineTitle: d.timelineTitle || 'Come si svolge la visita',
    timelineSteps: d.timelineSteps.map((s, idx) => ({
      stepNumber: `0${idx + 1}`,
      title: s.title,
      description: s.description
    })),
    results: {
      title: d.results.title || 'Cosa comprende e refertazione',
      description: d.results.description,
      paragraphs: d.results.paragraphs,
      image: resultsImage
    },
    faq: d.faq,
    localSeo: {
      title: d.localSeo.title || `${d.title} a Napoli`,
      description: d.localSeo.description,
      cta: 'Iscriviti gratuitamente al Cocoora Club'
    }
  };
  visiteList.push(item);
}

const visiteFileContent = `import type { Faq } from "./types";

export type VisitaSpecialistica = {
  slug: string;
  title: string;
  categoryName: string;
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  heroCta: string;
  seo?: { metaTitle?: string; metaDescription?: string; keywordMain?: string; keywordSec?: string };
  whatIs: { title: string; description: string; paragraphs: string[]; image?: string };
  problemsTitle: string;
  problemsSubtitle?: string;
  problemsGrid: { title: string; description: string }[];
  leadForm?: { title: string; subtitle: string; cta: string };
  timelineTitle: string;
  timelineSteps: { stepNumber: string; title: string; description: string }[];
  results: { title: string; description: string; paragraphs: string[]; image?: string };
  faq: Faq[];
  localSeo: { title: string; description: string; cta: string };
};

/**
 * Catalogo Ufficiale Visite Specialistiche Cocoora Centro Medico
 * Sincronizzato dai materiali ufficiali e cartelle Drive (Silvia Monticelli)
 */
export const VISITE_SPECIALISTICHE: VisitaSpecialistica[] = ${JSON.stringify(visiteList, null, 2)};

export function getVisitaBySlug(slug: string): VisitaSpecialistica | undefined {
  return VISITE_SPECIALISTICHE.find((v) => v.slug === slug);
}
`;

fs.writeFileSync('src/lib/visite-specialistiche.ts', visiteFileContent, 'utf8');
console.log(`✅ Generato src/lib/visite-specialistiche.ts con ${visiteList.length} visite.`);
