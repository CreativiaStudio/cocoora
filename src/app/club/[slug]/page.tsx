import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CLUB_TIERS } from "@/lib/club";
import { ClubTierClient } from "./club-tier-client";

export function generateStaticParams() {
  return CLUB_TIERS.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tier = CLUB_TIERS.find((t) => t.id === slug);
  if (!tier) return {};
  return {
    title: `${tier.name} — Cocoora Club`,
    description: tier.description,
  };
}

export default async function ClubTierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tier = CLUB_TIERS.find((t) => t.id === slug);
  if (!tier) notFound();
  return <ClubTierClient tier={tier} />;
}
