import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VISITE_SPECIALISTICHE, getVisitaBySlug } from "@/lib/visite-specialistiche";
import { getServerSeoPage } from "@/lib/cms-server";
import { SITE_URL } from "@/lib/reels-utils";
import { VisitaClient } from "./visita-client";

export function generateStaticParams() {
  return VISITE_SPECIALISTICHE.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const visita = getVisitaBySlug(slug);
  if (!visita) return {};

  const seo = await getServerSeoPage(`/visite/${visita.slug}`).catch(
    () => undefined
  );
  const title =
    seo?.title ||
    visita.seo?.metaTitle ||
    `${visita.title} a Napoli — Visite Specialistiche | Cocoora`;
  const description = (
    seo?.metaDescription ||
    visita.seo?.metaDescription ||
    visita.tagline ||
    visita.description
  ).slice(0, 160);
  const canonical = seo?.canonicalUrl || `/visite/${visita.slug}`;
  const ogImage = seo?.ogImage || seo?.heroImage || visita.heroImage;

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
      url: `${SITE_URL}/visite/${visita.slug}`,
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: visita.title }] }
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

export default async function VisitaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const visita = getVisitaBySlug(slug);
  if (!visita) notFound();

  const seo = await getServerSeoPage(`/visite/${visita.slug}`).catch(
    () => undefined
  );
  const faqList = seo?.faq?.length ? seo.faq : visita.faq ?? [];

  const specialtyLd = {
    "@context": "https://schema.org",
    "@type": seo?.schemaType || "MedicalSpecialty",
    name: seo?.h1 || `${visita.title} a Napoli`,
    description: seo?.metaDescription || visita.tagline || visita.description,
    url: `${SITE_URL}/visite/${visita.slug}`,
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
          __html: JSON.stringify(faqLd ? [specialtyLd, faqLd] : specialtyLd),
        }}
      />
      <VisitaClient visita={visita} />
    </>
  );
}
