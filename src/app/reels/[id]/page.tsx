import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerCmsState, getServerVideoByIdOrSlug } from "@/lib/cms-server";
import { getInstagramEmbedUrl, getReelSharePath, SITE_URL } from "@/lib/reels-utils";
import { ReelDetailClient } from "./reel-detail-client";

export const dynamic = "force-dynamic";

const FALLBACK_OG_IMAGE =
  "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-1.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const video = await getServerVideoByIdOrSlug(id);
  if (!video) {
    return {
      title: "Reel non trovato",
      robots: { index: false, follow: false },
    };
  }

  const sharePath = getReelSharePath(video);
  const canonicalUrl = `${SITE_URL}${sharePath}`;
  const posterUrl = video.poster?.trim() || FALLBACK_OG_IMAGE;
  const description =
    video.caption?.trim() ||
    `Guarda il video verticale "${video.title}" di Cocoora Centro Medico a Napoli.`;

  return {
    title: `${video.title} — Cocoora Reels`,
    description: description.slice(0, 160),
    alternates: { canonical: sharePath },
    openGraph: {
      type: "video.other",
      locale: "it_IT",
      siteName: "Cocoora",
      url: canonicalUrl,
      title: `${video.title} | Cocoora Centro Medico`,
      description: description.slice(0, 200),
      images: [
        {
          url: posterUrl,
          width: 1080,
          height: 1920,
          alt: video.title,
        },
      ],
      ...(video.type === "mp4" && video.url
        ? {
            videos: [
              {
                url: video.url,
                width: 1080,
                height: 1920,
                type: "video/mp4",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${video.title} | Cocoora Centro Medico`,
      description: description.slice(0, 200),
      images: [posterUrl],
    },
  };
}

export default async function ReelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getServerVideoByIdOrSlug(id);

  if (!video) {
    notFound();
  }

  const state = await getServerCmsState({ fresh: true });
  const otherVideos = state.videos.filter((v) => v.visible && v.id !== video.id);
  const sharePath = getReelSharePath(video);
  const canonicalUrl = `${SITE_URL}${sharePath}`;
  const posterUrl = video.poster?.trim() || FALLBACK_OG_IMAGE;
  const embedUrl = video.type === "instagram" ? getInstagramEmbedUrl(video.url) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.caption || video.title,
    thumbnailUrl: [posterUrl],
    uploadDate: video.createdAt || "2026-11-01T09:00:00+01:00",
    url: canonicalUrl,
    ...(video.type === "mp4" && video.url ? { contentUrl: video.url } : {}),
    ...(embedUrl ? { embedUrl } : {}),
    publisher: {
      "@type": "MedicalClinic",
      name: "Cocoora Centro Medico",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReelDetailClient video={video} otherVideos={otherVideos} sharePath={sharePath} />
    </>
  );
}
