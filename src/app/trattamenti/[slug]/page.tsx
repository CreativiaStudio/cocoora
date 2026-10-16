import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentBySlug, TREATMENTS } from "@/lib/content";
import { TREATMENT_SLUG_ALIASES } from "@/lib/treatments-medicina";
import { TreatmentClient } from "./treatment-client";

/**
 * Genera le rotte statiche per tutti i trattamenti del catalogo
 * (odontoiatria + medicina estetica) e per gli alias slug legacy,
 * così che nessun link esistente vada in 404.
 */
export function generateStaticParams() {
  const slugs = TREATMENTS.map((t) => t.slug);
  const aliasSlugs = Object.keys(TREATMENT_SLUG_ALIASES).filter(
    (alias) => !slugs.includes(alias)
  );
  return [...slugs, ...aliasSlugs].map((slug) => ({ slug }));
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

  const branch =
    treatment.category === "odontoiatria"
      ? "Odontoiatria"
      : "Medicina Estetica";

  return {
    title: `${treatment.title} a Napoli — ${branch} | Cocoora`,
    description: `${treatment.tagline}. ${treatment.description}`.slice(0, 160),
    alternates: { canonical: `/trattamenti/${treatment.slug}` },
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
  return <TreatmentClient treatment={treatment} />;
}
