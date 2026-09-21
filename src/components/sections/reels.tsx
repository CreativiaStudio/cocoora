"use client";

import { ArrowUpRight, Play } from "lucide-react";
import { useCms } from "../providers";
import type { VideoItem } from "@/lib/types";
import { Badge, ButtonLink, SectionLabel } from "../ui";

export function ReelsSection() {
  const { videos } = useCms();
  const visible = videos.filter((v) => v.visible).slice(0, 3);

  if (visible.length === 0) return null;

  return (
    <section id="trattamenti" className="relative overflow-hidden bg-canvas py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <SectionLabel>Reels &amp; Trattamenti</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Guarda, scopri, prenditi cura di te
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Video verticali e anteprime dei nostri percorsi, direttamente dal
              mondo Cocoora.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((video) => (
            <ReelCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReelCard({ video }: { video: VideoItem }) {
  return (
    <article className="group mx-auto flex w-full max-w-[300px] flex-col">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-dark-navy to-teal-900 shadow-[0_30px_60px_-24px_rgba(3,53,75,0.5)]">
        {video.type === "mp4" && video.url ? (
          <video
            src={video.url}
            poster={undefined}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : video.type === "instagram" && video.url ? (
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
            <ReelPoster title={video.title} />
          </a>
        ) : (
          <ReelPoster title={video.title} />
        )}

        {video.type === "instagram" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 text-white" />
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 px-1">
        <h3 className="font-serif text-xl font-semibold text-teal-900">{video.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{video.caption}</p>
        {video.ctaLabel && video.ctaLink && (
          <div className="mt-4">
            <ButtonLink href={video.ctaLink} variant="secondary" size="sm">
              {video.ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        )}
      </div>
    </article>
  );
}

function ReelPoster({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between bg-gradient-to-br from-teal-700 via-dark-navy to-teal-900 p-6">
      <div className="w-full">
        <Badge className="bg-white/15 text-white">Cocoora Reel</Badge>
      </div>
      <p className="text-center font-serif text-2xl font-semibold leading-snug text-white">
        {title}
      </p>
      <div className="w-full text-right text-xs font-medium uppercase tracking-[0.2em] text-teal-200/60">
        @cocoora
      </div>
    </div>
  );
}
