import type { VideoItem } from "./types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.cocoora.it"
).replace(/\/$/, "");

export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  try {
    const clean = url.trim();
    const parsed = new URL(clean);
    if (!parsed.hostname.includes("instagram.com")) return null;
    const match = parsed.pathname.match(/\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
    return match?.[1] || null;
  } catch {
    const fallbackMatch = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
    return fallbackMatch?.[1] || null;
  }
}

export function getInstagramEmbedUrl(url: string): string | null {
  const code = extractInstagramShortcode(url);
  if (!code) return null;
  return `https://www.instagram.com/reel/${code}/embed/`;
}

export function slugifyReelTitle(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return base || "cocoora-reel";
}

export function getReelSharePath(video: Pick<VideoItem, "id" | "slug">): string {
  const segment = (video.slug && video.slug.trim()) || video.id;
  return `/reels/${encodeURIComponent(segment)}`;
}

export function getReelShareUrl(
  video: Pick<VideoItem, "id" | "slug">,
  origin?: string
): string {
  const base = (origin || SITE_URL).replace(/\/$/, "");
  return `${base}${getReelSharePath(video)}`;
}

export function validateReelUrl(
  type: "instagram" | "mp4",
  url: string
): { valid: boolean; reason?: string; shortcode?: string } {
  const trimmed = (url || "").trim();
  if (!trimmed) {
    return { valid: false, reason: "Inserisci un URL o carica un file video." };
  }

  if (type === "instagram") {
    const shortcode = extractInstagramShortcode(trimmed);
    if (!shortcode) {
      return {
        valid: false,
        reason:
          "URL Instagram non riconosciuto. Usa un link tipo https://www.instagram.com/reel/CODICE/",
      };
    }
    return { valid: true, shortcode };
  }

  if (trimmed.startsWith("/")) {
    return { valid: true };
  }

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, reason: "Il link video deve iniziare con https://." };
    }
    const lowerPath = parsed.pathname.toLowerCase();
    const looksLikeVideo =
      lowerPath.endsWith(".mp4") ||
      lowerPath.endsWith(".webm") ||
      lowerPath.endsWith(".mov") ||
      parsed.hostname.includes("r2.dev") ||
      parsed.hostname.includes("googleapis.com") ||
      parsed.hostname.includes("mozilla.net") ||
      parsed.hostname.includes("cloudflare");
    if (!looksLikeVideo) {
      return {
        valid: true,
        reason: "Verifica che il link punti direttamente a un file .mp4/.webm riproducibile.",
      };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: "Formato URL non valido." };
  }
}
