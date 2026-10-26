export type Faq = { q: string; a: string };

export type TreatmentCategory = "odontoiatria" | "medicina-estetica";

export type NavChild = {
  label: string;
  href: string;
  description?: string;
  image?: string;
};

export type NavNode = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export type Pillar = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  cta: string;
};

export type ShowroomTile = {
  id: string;
  title: string;
  text: string;
  image: string;
};

export type Principle = {
  id: string;
  title: string;
  text: string;
  icon: string;
};

export type GalleryItem = {
  id: string;
  image: string;
  caption: string;
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  monogram: string;
  bio: string;
};

export type Specialty = {
  id: string;
  title: string;
  description: string;
  icon: string;
  exams: string[];
  image?: string;
};

export type PrecisionOption = {
  id: string;
  name: string;
  price: number;
  description: string;
  includes: string[];
  highlight?: boolean;
};

export type PrecisionProgram = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image?: string;
  options: PrecisionOption[];
};

export type DnaCombo = {
  id: string;
  name: string;
  description: string;
  areas: string[];
};

export type MicrobiotaKit = {
  id: string;
  name: string;
  description: string;
  includes: string[];
};

export type TreatmentProblem = {
  title: string;
  description: string;
  icon?: string;
};

export type TreatmentTimelineStep = {
  stepNumber?: string;
  title: string;
  description: string;
  duration?: string;
  icon?: string;
};

export type TreatmentWhatIs = {
  overline?: string;
  title?: string;
  description: string;
  paragraphs?: string[];
  callout?: string;
  image?: string;
  bullets?: string[];
};

export type TreatmentResults = {
  overline?: string;
  title?: string;
  description?: string;
  paragraphs?: string[];
  image?: string;
  images?: string[];
};

export type Treatment = {
  slug: string;
  title: string;
  category: TreatmentCategory;
  tagline: string;
  description: string;
  steps: { title: string; description: string }[];
  machines?: string[];
  faq: Faq[];
  heroImage?: string;
  heroQuickSpecialist?: { title: string; subtitle: string; href?: string };
  heroQuickTier?: { title: string; subtitle: string; href?: string };
  whatIs?: TreatmentWhatIs;
  problemsGrid?: TreatmentProblem[];
  timelineSteps?: TreatmentTimelineStep[];
  timelineNote?: { title: string; text: string };
  results?: TreatmentResults;
  leadForm?: { overline?: string; title?: string; subtitle?: string };
  localSeo?: { overline?: string; title?: string; description?: string; image?: string };
};

export type ClubTier = {
  id: string;
  name: string;
  shortName: string;
  price: number;
  priceUomo?: number;
  priceDonna?: number;
  listPrice?: number;
  priceLabel: string;
  badge?: string;
  description: string;
  features: string[];
  free?: boolean;
  genderToggle?: boolean;
  family?: boolean;
};

export type PrecisionPath = {
  id: string;
  name: string;
  description: string;
  features: string[];
};

export type ServiceArea = {
  id: string;
  title: string;
  description: string;
  items: string[];
};

export type InstagramPost = {
  id: number;
  image: string;
  caption: string;
  likes: number;
  comments?: number;
  tag?: string;
};

export type VideoItem = {
  id: string;
  type: "instagram" | "mp4";
  url: string;
  poster?: string;
  title: string;
  caption: string;
  ctaLabel?: string;
  ctaLink?: string;
  visible: boolean;
};

export type SeoPage = {
  id: string;
  path: string;
  label: string;
  title: string;
  metaDescription: string;
  h1: string;
  h2: string;
  faq: Faq[];
  canvasMode: boolean;
};

export type CmsState = {
  videos: VideoItem[];
  pages: SeoPage[];
};

export type Doctor = {
  slug: string;
  name: string;
  title: string;
  branca: string;
  affiliation: string;
  badge?: string;
  image: string;
  bio: string;
  approach: string;
  curriculum: string[];
  servizi: string[];
  treatmentSlugs?: string[];
  specialtyId?: string;
  clubTierIds: string[];
  tariffaVisita: number;
};

export type ClubExamItem = { label: string; value: number };

export type ClubTierDetail = {
  tierId: string;
  installmentCount?: number;
  installmentProviders?: string[];
  commonExams: ClubExamItem[];
  genderExams?: {
    uomo: ClubExamItem[];
    donna: ClubExamItem[];
  };
  doctorSlugs: string[];
  perks: string[];
};

export type ConsentState = {
  ad_storage: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  functionality_storage: "granted" | "denied";
  personalization_storage: "granted" | "denied";
  security_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};
