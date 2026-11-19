import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CLUB_TIERS } from "@/lib/club";
import { getServerSeoPage } from "@/lib/cms-server";
import { SITE_URL } from "@/lib/reels-utils";
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

  const seo = await getServerSeoPage(`/club/${tier.id}`).catch(() => undefined);
  const title = seo?.title || `${tier.name} — Cocoora Club`;
  const description = (seo?.metaDescription || tier.description).slice(0, 160);
  const canonical = seo?.canonicalUrl || `/club/${tier.id}`;
  const ogImage =
    seo?.ogImage ||
    "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-14.webp";

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: !(seo?.noindex ?? false),
      follow: !(seo?.nofollow ?? false),
    },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: "Cocoora",
      url: `${SITE_URL}/club/${tier.id}`,
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: tier.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: [ogImage],
    },
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
