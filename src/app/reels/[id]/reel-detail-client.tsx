"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Film,
  Instagram,
  MessageCircle,
  Play,
  Share2,
} from "lucide-react";
import { Container, Badge } from "@/components/ui";
import {
  getInstagramEmbedUrl,
  getReelSharePath,
  SITE_URL,
} from "@/lib/reels-utils";
import type { VideoItem } from "@/lib/types";

export function ReelDetailClient({
  video,
  otherVideos,
  sharePath,
}: {
  video: VideoItem;
  otherVideos: VideoItem[];
  sharePath: string;
}) {
  const [origin, setOrigin] = useState(SITE_URL);
  const [copied, setCopied] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const shareUrl = `${origin}${sharePath}`;
  const instagramEmbedUrl =
    video.type === "instagram" ? getInstagramEmbedUrl(video.url) : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${video.title} — Cocoora Centro Medico`,
          text: video.caption || video.title,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or unsupported -> fallback copy
      }
    }
    await handleCopy();
  };

  const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(
    `${video.title} — Cocoora Centro Medico\n${shareUrl}`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03354B] via-[#072b3b] to-[#edf4f7] pb-20 pt-28 sm:pt-32">
      <Container>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/#trattamenti"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Torna ai Reels Cocoora
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-teal-100 backdrop-blur-md">
            {video.type === "instagram" ? (
              <>
                <Instagram className="h-3.5 w-3.5" /> Instagram Reel
              </>
            ) : (
              <>
                <Film className="h-3.5 w-3.5" /> Video Verticale 9:16
              </>
            )}
          </span>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(280px,380px)_1fr] lg:gap-14">
          {/* Player Verticale 9:16 */}
          <div className="mx-auto w-full max-w-[360px]">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] border border-white/15 bg-[#002231] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]">
              {video.type === "mp4" && video.url && !videoError ? (
                <video
                  src={video.url}
                  poster={video.poster}
                  controls
                  autoPlay
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  onError={() => setVideoError(true)}
                  className="h-full w-full object-cover"
                />
              ) : video.type === "instagram" && instagramEmbedUrl ? (
                <iframe
                  src={instagramEmbedUrl}
                  title={video.title}
                  className="h-full w-full border-0 bg-white"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center text-white">
                  {video.poster && (
                    <img
                      src={video.poster}
                      alt={video.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-35"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-serif text-xl font-semibold">{video.title}</p>
                    <p className="mt-2 text-xs text-teal-100/80">
                      {videoError
                        ? "Riproduzione diretta non disponibile su questo browser."
                        : "Apri il contenuto sul canale ufficiale."}
                    </p>
                    {video.url && (
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-dark-navy shadow-md hover:bg-teal-50"
                      >
                        Apri video sorgente <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {video.type === "instagram" && video.url && (
              <div className="mt-3 text-center">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-100/90 underline underline-offset-4 hover:text-white"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  Apri questo Reel direttamente su Instagram
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Dettagli, CTA & Condivisione */}
          <div className="rounded-3xl border border-teal-100 bg-white p-7 shadow-xl sm:p-10">
            <Badge className="bg-teal-50 text-teal-800 border border-teal-200">
              Cocoora Centro Medico · Napoli
            </Badge>

            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-dark-navy sm:text-4xl">
              {video.title}
            </h1>

            {video.caption && (
              <p className="mt-4 text-base leading-relaxed text-charcoal/80 whitespace-pre-line">
                {video.caption}
              </p>
            )}

            {/* CTA Primario */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={video.ctaLink || "/club"}
                className="inline-flex items-center gap-2 rounded-full bg-dark-navy px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-900"
              >
                {video.ctaLabel || "Scopri i Percorsi Salute"}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/70 px-5 py-3 text-sm font-semibold text-teal-900 transition hover:bg-teal-100"
              >
                Richiedi informazioni
              </Link>
            </div>

            {/* Box Condivisione URL */}
            <div className="mt-8 rounded-2xl border border-teal-100 bg-[#f4f8fa] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-900">
                Condividi questo Reel
              </p>
              <p className="mt-1 text-xs text-charcoal/70">
                Copia il collegamento diretto con anteprima ottimizzata per WhatsApp e social.
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  aria-label="URL condivisibile del Reel"
                  className="flex-1 rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-800 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Link copiato!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copia link
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={whatsappShareHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Invia su WhatsApp
                </a>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-semibold text-teal-900 transition hover:bg-teal-50 cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Condividi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Altri Reels */}
        {otherVideos.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-semibold text-dark-navy sm:text-3xl">
              Altri video dal centro medico
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {otherVideos.map((item) => (
                <Link
                  key={item.id}
                  href={getReelSharePath(item)}
                  className="group flex items-center gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-20 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-teal-700 to-dark-navy">
                    {item.poster ? (
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/80">
                        <Play className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      {item.type === "instagram" ? "Instagram Reel" : "Video 9:16"}
                    </p>
                    <p className="mt-0.5 truncate font-serif text-lg font-semibold text-dark-navy group-hover:text-teal-700">
                      {item.title}
                    </p>
                    {item.caption && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-charcoal/65">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
