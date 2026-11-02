import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VISITE_SPECIALISTICHE, getVisitaBySlug } from "@/lib/visite-specialistiche";
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

  return {
    title: `${visita.title} a Napoli — Visite Specialistiche | Cocoora`,
    description: `${visita.tagline || visita.description}`.slice(0, 160),
    alternates: { canonical: `/visite/${visita.slug}` },
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
  return <VisitaClient visita={visita} />;
}
