import { notFound } from "next/navigation";
import { getTreatmentBySlug, TREATMENTS } from "@/lib/content";
import { TreatmentClient } from "./treatment-client";

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const treatment = getTreatmentBySlug(slug);
  if (!treatment) notFound();
  return <TreatmentClient treatment={treatment} />;
}
