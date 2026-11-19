import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentBySlug, TREATMENTS } from "@/lib/content";
import { TREATMENT_SLUG_ALIASES } from "@/lib/treatments-medicina";
import { getServerSeoPage } from "@/lib/cms-server";
import { SITE_URL } from "@/lib/reels-utils";
import { TreatmentClient } from "./treatment-client";

export function generateStaticParams() {
  const slugs = TREATMENTS.map((t) => t.slug);
  const aliasSlugs = TREATMENTS.flatMap((t) => t.aliases ?? []);
  const legacyAliases = Object.keys(TREATMENT_SLUG_ALIASES);
  const allSlugs = Array.from(new Set([...slugs, ...aliasSlugs, ...legacyAliases]));
  return allSlugs.map((slug) => ({ slug }));
}

function findTreatment(slug: string) {
  const direct = getTreatmentBySlug(slug);
  if (direct) return direct;
  const aliased = TREATMENT_SLUG_ALIASES[slug];
  return aliased ? getTreatmentBySlug(aliased) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const treatment = findTreatment(slug);
  if (!treatment) return {};

  const seo = await getServerSeoPage(`/trattamenti/${treatment.slug}`).catch(
    () => undefined
  );
  const branch =
    treatment.category === "odontoiatria" ? "Odontoiatria" : "Medicina Estetica";

  const title =
    seo?.title ||
    treatment.seo?.metaTitle ||
    `${treatment.title} a Napoli — ${branch} | Cocoora`;
  const description = (
    seo?.metaDescription ||
    treatment.seo?.metaDescription ||
    treatment.tagline ||
    treatment.description
  ).slice(0, 160);
  const canonical = seo?.canonicalUrl || `/trattamenti/${treatment.slug}`;
  const ogImage = seo?.ogImage || seo?.heroImage || treatment.heroImage;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: !(seo?.noindex ?? false),
      follow: !(seo?.nofollow ?? false),
    },
    openGraph: {
      type: "article",
      locale: "it_IT",
      siteName: "Cocoora",
      url: `${SITE_URL}/trattamenti/${treatment.slug}`,
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      ...(ogImage
        ? {
            images: [{ url: ogImage, width: 1200, height: 630, alt: treatment.title }],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const treatment = findTreatment(slug);
  if (!treatment) notFound();

  const seo = await getServerSeoPage(`/trattamenti/${treatment.slug}`).catch(
    () => undefined
  );
  const faqList = seo?.faq?.length ? seo.faq : treatment.faq ?? [];

  const procedureLd = {
    "@context": "https://schema.org",
    "@type": seo?.schemaType || "MedicalProcedure",
    name: seo?.h1 || treatment.title,
    description: seo?.metaDescription || treatment.tagline || treatment.description,
    url: `${SITE_URL}/trattamenti/${treatment.slug}`,
    provider: {
      "@type": "MedicalClinic",
      name: "Cocoora Centro Medico",
      url: SITE_URL,
    },
  };

  const faqLd =
    faqList.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqList.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd ? [procedureLd, faqLd] : procedureLd),
        }}
      />
      <TreatmentClient treatment={treatment} />
    </>
  );
}
