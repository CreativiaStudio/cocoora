import { MEDICINA_ESTETICA_TREATMENTS } from "./treatments-medicina";
import { ODONTOIATRIA_TREATMENTS } from "./treatments-odontoiatria";
import type { SeoPage } from "./types";
import { SITE_URL } from "./reels-utils";

export type SeoPageCategory = "medicina" | "odontoiatria" | "visite" | "hub";

const ODONTO_SLUGS = new Set(ODONTOIATRIA_TREATMENTS.map((t) => `/trattamenti/${t.slug}`));
const MEDICINA_SLUGS = new Set(MEDICINA_ESTETICA_TREATMENTS.map((t) => `/trattamenti/${t.slug}`));

export function getSeoPageCategory(page: SeoPage): SeoPageCategory {
  if (page.path === "/servizi/odontoiatria" || ODONTO_SLUGS.has(page.path)) {
    return "odontoiatria";
  }
  if (page.path === "/servizi/medicina-estetica" || MEDICINA_SLUGS.has(page.path)) {
    return "medicina";
  }
  if (
    page.path === "/visite" ||
    page.path === "/servizi/diagnostica" ||
    page.path.startsWith("/visite/")
  ) {
    return "visite";
  }
  return "hub";
}

type GuardRule = {
  id: string;
  regex: RegExp;
  label: string;
  replacement: string;
};

const BRAND_GUARD_RULES: GuardRule[] = [
  {
    id: "aligner_brand",
    regex: /\binvis\x61lign\b/i,
    label: "Marchio commerciale ortodontico vietato",
    replacement: 'Usa "Allineatori Trasparenti" o "Ortodonzia Intercettiva"',
  },
  {
    id: "toxin_brand",
    regex: /\bbo\x74ox\b/i,
    label: "Nome commerciale tossina vietato in Ads/Menu",
    replacement: "Usa la descrizione clinica del trattamento medico estetico",
  },
  {
    id: "poli_clinic",
    regex: /\bpolispecialistic[oa]\b/i,
    label: "Dicitura struttura non autorizzata",
    replacement: 'Usa "Cocoora Centro Medico" o "Centro Medico Autorizzato"',
  },
  {
    id: "poli_amb",
    regex: /\bpoliambulatori[oa]\b/i,
    label: "Termine sostituito dal Brand Vault",
    replacement: 'Usa "Visite Specialistiche" o "Cocoora Centro Medico"',
  },
  {
    id: "piani_salute",
    regex: /\bpian[oi]\s+salute\b/i,
    label: "Nome pacchetto deprecato",
    replacement: 'Usa sempre "Percorsi Salute" o "Percorsi"',
  },
  {
    id: "lo_studio",
    regex: /\blo\s+studio\b/i,
    label: "Dicitura menu sostituita",
    replacement: 'Usa "Il Centro" o "nel nostro centro"',
  },
  {
    id: "amico_medico",
    regex: /\bamico\s+medico\b/i,
    label: "Concept abolito dal Brand Vault",
    replacement: "È il Centro Medico a fare da garante",
  },
  {
    id: "zero_attese",
    regex: /\bzero\s+attese\b/i,
    label: "Promessa non consentita",
    replacement: 'Usa "su appuntamento dedicato"',
  },
  {
    id: "hours_72",
    regex: /\b72\s*(?:h|ore)\b/i,
    label: "Promessa temporale vietata",
    replacement: "Rimuovi la garanzia oraria fissa",
  },
  {
    id: "private_lounge",
    regex: /\bprivate\s+lounge\b/i,
    label: "Dicitura ambienti abolita",
    replacement: 'Usa "Studio 1", "Studio 2", "Studio 3"',
  },
];

export type PolicyAlert = {
  id: string;
  field: string;
  label: string;
  replacement: string;
};

export function detectPolicyAlerts(page: SeoPage): PolicyAlert[] {
  const fields: { name: string; value?: string }[] = [
    { name: "Meta Title", value: page.title },
    { name: "Meta Description", value: page.metaDescription },
    { name: "Titolo H1", value: page.h1 },
    { name: "Sottotitolo H2", value: page.h2 },
    { name: "OG Title", value: page.ogTitle },
    { name: "OG Description", value: page.ogDescription },
    { name: "Keyword", value: `${page.focusKeyword || ""} ${page.keywords || ""}` },
    ...page.faq.map((f, idx) => ({
      name: `FAQ #${idx + 1}`,
      value: `${f.q} ${f.a}`,
    })),
  ];

  const alerts: PolicyAlert[] = [];
  const seen = new Set<string>();

  for (const field of fields) {
    if (!field.value) continue;
    for (const rule of BRAND_GUARD_RULES) {
      if (rule.regex.test(field.value)) {
        const key = `${rule.id}:${field.name}`;
        if (!seen.has(key)) {
          seen.add(key);
          alerts.push({
            id: key,
            field: field.name,
            label: rule.label,
            replacement: rule.replacement,
          });
        }
      }
    }
  }

  return alerts;
}

export type SeoCheckItem = {
  id: string;
  label: string;
  passed: boolean;
  status: "ok" | "warn" | "error";
  detail: string;
};

export type SeoAuditResult = {
  score: number;
  titleLen: number;
  descLen: number;
  checks: SeoCheckItem[];
  policyAlerts: PolicyAlert[];
  hasOgImage: boolean;
};

export function evaluateSeoPage(page: SeoPage): SeoAuditResult {
  const titleLen = (page.title || "").trim().length;
  const descLen = (page.metaDescription || "").trim().length;
  const focusKw = (page.focusKeyword || "").trim().toLowerCase();
  const hasOgImage = Boolean((page.ogImage || page.heroImage || "").trim());
  const policyAlerts = detectPolicyAlerts(page);

  let score = 0;
  const checks: SeoCheckItem[] = [];

  // 1. Meta Title (20 punti)
  if (titleLen >= 30 && titleLen <= 60) {
    score += 20;
    checks.push({
      id: "title",
      label: "Lunghezza Meta Title ottimale",
      passed: true,
      status: "ok",
      detail: `${titleLen}/60 caratteri`,
    });
  } else if (titleLen > 0) {
    score += 10;
    checks.push({
      id: "title",
      label: titleLen > 60 ? "Meta Title troppo lungo (>60ch)" : "Meta Title corto (<30ch)",
      passed: false,
      status: "warn",
      detail: `${titleLen} caratteri (ideale 35–60)`,
    });
  } else {
    checks.push({
      id: "title",
      label: "Meta Title mancante",
      passed: false,
      status: "error",
      detail: "Inserisci un titolo SEO",
    });
  }

  // 2. Meta Description (20 punti)
  if (descLen >= 100 && descLen <= 160) {
    score += 20;
    checks.push({
      id: "desc",
      label: "Meta Description ottimale",
      passed: true,
      status: "ok",
      detail: `${descLen}/158 caratteri`,
    });
  } else if (descLen > 0) {
    score += 10;
    checks.push({
      id: "desc",
      label: descLen > 160 ? "Meta Description lunga (>160ch)" : "Meta Description corta (<100ch)",
      passed: false,
      status: "warn",
      detail: `${descLen} caratteri (ideale 110–158)`,
    });
  } else {
    checks.push({
      id: "desc",
      label: "Meta Description mancante",
      passed: false,
      status: "error",
      detail: "Aggiungi una descrizione persuasiva",
    });
  }

  // 3. H1 & H2 (15 punti)
  if ((page.h1 || "").trim() && (page.h2 || "").trim()) {
    score += 15;
    checks.push({
      id: "headings",
      label: "Gerarchia H1 & H2 compilata",
      passed: true,
      status: "ok",
      detail: "Intestazioni presenti",
    });
  } else if ((page.h1 || "").trim()) {
    score += 8;
    checks.push({
      id: "headings",
      label: "Sottotitolo H2 mancante",
      passed: false,
      status: "warn",
      detail: "Compila H2 per completezza semantica",
    });
  } else {
    checks.push({
      id: "headings",
      label: "Titolo H1 mancante",
      passed: false,
      status: "error",
      detail: "Imposta l'H1 principale",
    });
  }

  // 4. Focus Keyword coverage (15 punti)
  const haystack = `${page.title} ${page.metaDescription} ${page.h1}`.toLowerCase();
  if (focusKw && haystack.includes(focusKw)) {
    score += 15;
    checks.push({
      id: "keyword",
      label: "Focus Keyword presente in Title/H1/Meta",
      passed: true,
      status: "ok",
      detail: `"${page.focusKeyword}"`,
    });
  } else if (focusKw) {
    const words = focusKw.split(/\s+/).filter((w) => w.length > 3);
    const partial = words.length > 0 && words.every((w) => haystack.includes(w));
    if (partial) {
      score += 12;
      checks.push({
        id: "keyword",
        label: "Termini della Focus Keyword presenti",
        passed: true,
        status: "ok",
        detail: `"${page.focusKeyword}"`,
      });
    } else {
      score += 5;
      checks.push({
        id: "keyword",
        label: "Focus Keyword assente da Title/H1",
        passed: false,
        status: "warn",
        detail: `Inserisci "${page.focusKeyword}" nei meta tag`,
      });
    }
  } else {
    checks.push({
      id: "keyword",
      label: "Focus Keyword non definita",
      passed: false,
      status: "warn",
      detail: "Imposta una parola chiave obiettivo",
    });
  }

  // 5. OpenGraph Image (10 punti)
  if (hasOgImage) {
    score += 10;
    checks.push({
      id: "og",
      label: "Immagine anteprima social (og:image) configurata",
      passed: true,
      status: "ok",
      detail: "WhatsApp / Social pronti",
    });
  } else {
    checks.push({
      id: "og",
      label: "Immagine OG mancante",
      passed: false,
      status: "warn",
      detail: "Seleziona un'immagine nella scheda Social OG",
    });
  }

  // 6. Schema.org & FAQ (10 punti)
  if (page.faq.length > 0 || page.schemaType) {
    score += 10;
    checks.push({
      id: "schema",
      label: page.faq.length > 0 ? `Schema.org + ${page.faq.length} FAQ` : `Schema ${page.schemaType}`,
      passed: true,
      status: "ok",
      detail: "Dati strutturati attivi",
    });
  } else {
    checks.push({
      id: "schema",
      label: "Nessuna FAQ strutturata",
      passed: false,
      status: "warn",
      detail: "Aggiungi FAQ per ottenere Rich Snippet",
    });
  }

  // 7. Brand & Policy Guard (10 punti)
  if (policyAlerts.length === 0) {
    score += 10;
    checks.push({
      id: "policy",
      label: "Conforme al Brand Vault & Policy Sanitaria",
      passed: true,
      status: "ok",
      detail: "Nessun termine vietato rilevato",
    });
  } else {
    score = Math.max(0, score - 10);
    checks.push({
      id: "policy",
      label: `${policyAlerts.length} termini non conformi rilevati`,
      passed: false,
      status: "error",
      detail: policyAlerts.map((a) => a.field).join(", "),
    });
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    titleLen,
    descLen,
    checks,
    policyAlerts,
    hasOgImage,
  };
}

export function buildPageJsonLd(page: SeoPage) {
  const fullUrl = `${SITE_URL}${page.path === "/" ? "" : page.path}`;
  const mainEntityType = page.schemaType || "WebPage";

  const mainNode: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": mainEntityType,
    name: page.h1 || page.title,
    description: page.metaDescription,
    url: page.canonicalUrl || fullUrl,
  };

  if (mainEntityType === "MedicalClinic") {
    mainNode.name = "Cocoora Centro Medico";
    mainNode.telephone = "+39 081 1818 2091";
    mainNode.address = {
      "@type": "PostalAddress",
      streetAddress: "Via Generale Giovanni De Bonis 81",
      addressLocality: "Napoli",
      postalCode: "80123",
      addressCountry: "IT",
    };
  } else if (mainEntityType === "MedicalProcedure" || mainEntityType === "MedicalSpecialty") {
    mainNode.provider = {
      "@type": "MedicalClinic",
      name: "Cocoora Centro Medico",
      url: SITE_URL,
    };
  }

  if (page.faq.length > 0) {
    return [
      mainNode,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ];
  }

  return mainNode;
}
