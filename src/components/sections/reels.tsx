"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Instagram,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCms } from "../providers";
import { getReelSharePath } from "@/lib/reels-utils";
import type { VideoItem } from "@/lib/types";
import { Badge, SectionLabel } from "../ui";

export function ReelsSection() {
  const { videos } = useCms();
  const visible = videos.filter((v) => v.visible);

  if (visible.length === 0) return null;

  return (
    <section
      id="trattamenti"
      className="relative overflow-hidden border-y border-[#c5dbe3]/60 bg-[#edf4f7] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="w-full">
            <SectionLabel>Reels &amp; Trattamenti</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-[#00344b] sm:text-4xl lg:text-[44px] whitespace-normal sm:whitespace-nowrap">
              Guarda, scopri, prenditi cura di te
            </h2>
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
  const [copied, setCopied] = useState(false);
  const sharePath = getReelSharePath(video);

  const handleCopyShare = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}${sharePath}`;
      if (navigator.share && typeof window !== "undefined" && window.innerWidth < 640) {
        await navigator.share({ title: video.title, url }).catch(async () => {
          await navigator.clipboard.writeText(url);
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <article className="group mx-auto flex w-full max-w-[320px] flex-col">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-dark-navy to-teal-900 shadow-[0_24px_50px_-16px_rgba(3,53,75,0.4)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_32px_60px_-16px_rgba(3,53,75,0.55)]">
        {video.type === "mp4" && video.url ? (
          <ReelPlayer video={video} sharePath={sharePath} />
        ) : (
          <Link href={sharePath} className="block h-full w-full">
            <ReelPoster video={video} />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-1 h-7 w-7 fill-white text-white" />
              </span>
            </div>
          </Link>
        )}

        {/* Pulsante Condividi / Copia URL in alto a destra */}
        <div className="absolute right-3.5 top-3.5 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyShare}
            title="Copia link condivisibile Reel"
            aria-label={`Condividi Reel: ${video.title}`}
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/30 bg-dark-navy/60 px-3 text-[11px] font-semibold text-white backdrop-blur-md transition hover:bg-dark-navy/85 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>Copiato</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Condividi</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info, Caption & CTA reali sotto la card */}
      <div className="mt-4 flex flex-1 flex-col justify-between px-1">
        <div>
          <Link
            href={sharePath}
            className="font-serif text-xl font-semibold text-[#00344b] transition-colors hover:text-teal-700"
          >
            {video.title}
          </Link>
          {video.caption && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal/75">
              {video.caption}
            </p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {video.ctaLabel && video.ctaLink ? (
            <Link
              href={video.ctaLink}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-dark-navy"
            >
              <span>{video.ctaLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href={sharePath}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-dark-navy"
            >
              <span>Guarda il Reel</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {video.type === "instagram" && video.url && (
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-charcoal/60 hover:text-teal-800"
            >
              <Instagram className="h-3 w-3" />
              <span>IG</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ReelPlayer({ video, sharePath }: { video: VideoItem; sharePath: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  const play = () => {
    ref.current?.play().catch(() => setPlaying(false));
  };

  const pause = () => {
    ref.current?.pause();
  };

  const handleEnter = () => {
    if (!pinned && !hasError) play();
  };

  const handleLeave = () => {
    if (!pinned && !hasError) pause();
  };

  const handleClick = () => {
    if (hasError) return;
    if (pinned) {
      setPinned(false);
      pause();
      return;
    }
    setPinned(true);
    play();
  };

  const toggleMute = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  if (hasError) {
    return (
      <Link href={sharePath} className="block h-full w-full">
        <ReelPoster video={video} />
      </Link>
    );
  }

  return (
    <div
      className="relative h-full w-full cursor-pointer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={playing ? `Metti in pausa: ${video.title}` : `Riproduci: ${video.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <video
        ref={ref}
        src={video.url}
        poster={video.poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-navy/70 via-dark-navy/5 to-dark-navy/25 transition-opacity duration-500 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="pointer-events-none absolute left-4 top-4">
        <Badge className="bg-white/15 text-white backdrop-blur-md">Cocoora Reel</Badge>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          playing ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-[0_10px_40px_-10px_rgba(3,53,75,0.7)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <Play className="ml-1 h-7 w-7 fill-white text-white" />
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
        <Link
          href={sharePath}
          onClick={(e) => e.stopPropagation()}
          className="rounded-full border border-white/30 bg-dark-navy/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition hover:bg-dark-navy/85"
        >
          Apri pagina Reel
        </Link>

        {playing && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Attiva audio" : "Disattiva audio"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-dark-navy/50 text-white backdrop-blur-md transition-colors hover:bg-dark-navy/80 cursor-pointer"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function ReelPoster({ video }: { video: VideoItem }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between bg-gradient-to-br from-teal-700 via-dark-navy to-teal-900 p-6">
      {video.poster && (
        <>
          <img
            src={video.poster}
            alt={video.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-dark-navy/35 to-dark-navy/50" />
        </>
      )}
      <div className="relative z-10 w-full">
        <Badge className="bg-white/15 text-white backdrop-blur-md">
          {video.type === "instagram" ? "Instagram Reel" : "Cocoora Reel"}
        </Badge>
      </div>
      <p className="relative z-10 text-center font-serif text-2xl font-semibold leading-snug text-white drop-shadow">
        {video.title}
      </p>
      <div className="relative z-10 w-full text-right text-xs font-medium uppercase tracking-[0.2em] text-teal-200/80">
        @cocoora_official
      </div>
    </div>
  );
}
