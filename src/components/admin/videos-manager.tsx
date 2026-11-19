"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  Cloud,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  Instagram,
  Loader2,
  Pencil,
  Play,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { cmsStore } from "@/lib/cms-store";
import {
  getReelSharePath,
  slugifyReelTitle,
  validateReelUrl,
} from "@/lib/reels-utils";
import { useCms, useCmsSync } from "../providers";
import type { VideoItem } from "@/lib/types";
import { Button } from "../ui";
import { MediaLibraryModal } from "./media-library-modal";

type VideoForm = Omit<VideoItem, "id">;

const EMPTY: VideoForm = {
  type: "instagram",
  url: "",
  poster: "",
  slug: "",
  title: "",
  caption: "",
  ctaLabel: "",
  ctaLink: "",
  visible: true,
};

const QUICK_CTA_LINKS = [
  { label: "Cocoora Club", link: "/club" },
  { label: "Medicina Estetica", link: "/servizi/medicina-estetica" },
  { label: "Odontoiatria", link: "/servizi/odontoiatria" },
  { label: "Visite Specialistiche", link: "/servizi/diagnostica" },
  { label: "Contatti", link: "/contatti" },
];

export function VideosManager() {
  const { videos } = useCms();
  const sync = useCmsSync();
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState<VideoForm>(EMPTY);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const urlCheck = validateReelUrl(form.type, form.url);
  const effectivePreviewSlug =
    (form.slug && slugifyReelTitle(form.slug)) ||
    (form.title ? slugifyReelTitle(form.title) : editing?.id || "nuovo-reel");

  const startAdd = () => {
    setForm(EMPTY);
    setEditing(null);
    setUploadMsg(null);
    setUploadError(null);
  };

  const startEdit = (v: VideoItem) => {
    setEditing(v);
    setUploadMsg(null);
    setUploadError(null);
    setForm({
      type: v.type,
      url: v.url,
      poster: v.poster ?? "",
      slug: v.slug ?? slugifyReelTitle(v.title || v.id),
      title: v.title,
      caption: v.caption,
      ctaLabel: v.ctaLabel ?? "",
      ctaLink: v.ctaLink ?? "",
      visible: v.visible,
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned: VideoForm = {
      ...form,
      url: form.url.trim(),
      poster: form.poster?.trim() || undefined,
      slug: (form.slug?.trim() && slugifyReelTitle(form.slug)) || slugifyReelTitle(form.title || "reel"),
      title: form.title.trim(),
      caption: form.caption.trim(),
      ctaLabel: form.ctaLabel?.trim() || undefined,
      ctaLink: form.ctaLink?.trim() || undefined,
    };
    if (editing) {
      cmsStore.updateVideo(editing.id, cleaned);
    } else {
      cmsStore.addVideo(cleaned);
    }
    startAdd();
  };

  const copyShareUrl = async (v: VideoItem) => {
    const path = getReelSharePath(v);
    const fullUrl = origin ? `${origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(v.id);
      setTimeout(() => setCopiedId((prev) => (prev === v.id ? null : prev)), 2200);
    } catch {
      // ignore
    }
  };

  const handleVideoFileUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingVideo(true);
    setUploadError(null);
    setUploadMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setUploadError(data.error || "Errore durante il caricamento del video su Cloudflare R2.");
      } else {
        setForm((prev) => ({
          ...prev,
          type: "mp4",
          url: data.url,
          title:
            prev.title ||
            file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "),
        }));
        setUploadMsg(`Video caricato su R2 (${data.sizeKb} KB). Ricorda di salvare il Reel.`);
      }
    } catch {
      setUploadError("Errore di rete durante il caricamento del video.");
    } finally {
      setUploadingVideo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra Stato Cloud & Info Condivisione */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-white px-5 py-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-100">
            <Film className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-serif text-lg font-semibold text-teal-950">
              Video Verticali &amp; Reels Condivisibili (9:16)
            </h2>
            <p className="text-xs text-charcoal/65">
              Ogni Reel ha una pagina pubblica dedicata <code className="rounded bg-teal-50 px-1 py-0.5 text-[11px] font-mono text-teal-900">/reels/[slug]</code> con anteprima WhatsApp/OpenGraph e player integrato.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sync.status === "saving" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Salvataggio su Cloud...
            </span>
          ) : sync.status === "error" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">
              <AlertTriangle className="h-3.5 w-3.5" />
              {sync.error || "Errore sincronizzazione"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Cloud className="h-3.5 w-3.5" />
              Sincronizzato su Cloud
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Elenco Reel */}
        <div className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]">
          <div className="flex items-center justify-between border-b border-teal-100 px-6 py-4">
            <div>
              <h3 className="font-serif text-xl font-semibold text-teal-900">
                Catalogo Reels ({videos.length})
              </h3>
              <p className="text-[11px] text-charcoal/55">
                Visibili sul sito: {videos.filter((v) => v.visible).length} · Tutti i reel visibili compaiono in Homepage
              </p>
            </div>
            <Button size="sm" onClick={startAdd}>
              <Plus className="h-4 w-4" /> Nuovo Reel
            </Button>
          </div>

          {videos.length === 0 ? (
            <p className="p-8 text-sm text-charcoal/60">
              Nessun video. Aggiungi il primo reel Instagram o video MP4.
            </p>
          ) : (
            <div className="divide-y divide-teal-50">
              {videos.map((v, idx) => {
                const check = validateReelUrl(v.type, v.url);
                const sharePath = getReelSharePath(v);
                const isCopied = copiedId === v.id;
                return (
                  <div
                    key={v.id}
                    className={`flex flex-col gap-4 px-6 py-4 transition-colors sm:flex-row sm:items-center ${
                      editing?.id === v.id ? "bg-teal-50/50" : "hover:bg-teal-50/20"
                    }`}
                  >
                    {/* Thumbnail 9:16 */}
                    <div className="relative h-20 w-12 shrink-0 overflow-hidden rounded-xl border border-teal-100 bg-gradient-to-br from-teal-700 to-dark-navy shadow-xs">
                      {v.poster ? (
                        <img
                          src={v.poster}
                          alt={v.title}
                          className="h-full w-full object-cover"
                        />
                      ) : v.type === "mp4" && v.url ? (
                        <video
                          src={v.url}
                          muted
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/80">
                          {v.type === "instagram" ? (
                            <Instagram className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dettagli */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-serif text-base font-semibold text-teal-950">
                          {v.title || "Senza titolo"}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            v.type === "instagram"
                              ? "bg-pink-50 text-pink-800 border border-pink-200"
                              : "bg-teal-50 text-teal-800 border border-teal-200"
                          }`}
                        >
                          {v.type === "instagram" ? "Instagram Reel" : "Video MP4"}
                        </span>
                        {check.valid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {check.shortcode ? `IG: ${check.shortcode}` : "Link valido"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            URL da verificare
                          </span>
                        )}
                      </div>

                      <p className="truncate font-mono text-[11px] text-teal-800">
                        URL condivisibile: <span className="font-semibold">{sharePath}</span>
                      </p>

                      {v.caption && (
                        <p className="line-clamp-1 text-xs text-charcoal/60">{v.caption}</p>
                      )}
                    </div>

                    {/* Azioni rapide */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyShareUrl(v)}
                        title="Copia URL condivisibile"
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          isCopied
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-teal-200 bg-teal-50/70 text-teal-900 hover:bg-teal-100"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Copiato!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copia URL
                          </>
                        )}
                      </button>

                      <Link
                        href={sharePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Apri pagina Reel pubblica"
                        className="inline-flex items-center gap-1 rounded-xl border border-teal-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-teal-900 transition hover:bg-teal-50"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => cmsStore.reorderVideos(v.id, "up")}
                        disabled={idx === 0}
                        title="Sposta su"
                        className="rounded-lg p-1.5 text-charcoal/50 hover:bg-teal-50 hover:text-teal-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => cmsStore.reorderVideos(v.id, "down")}
                        disabled={idx === videos.length - 1}
                        title="Sposta giù"
                        className="rounded-lg p-1.5 text-charcoal/50 hover:bg-teal-50 hover:text-teal-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => cmsStore.updateVideo(v.id, { visible: !v.visible })}
                        title={v.visible ? "Nascondi dal sito" : "Mostra sul sito"}
                        className={`rounded-lg p-1.5 transition cursor-pointer ${
                          v.visible
                            ? "text-teal-700 hover:bg-teal-50"
                            : "text-charcoal/35 hover:bg-slate-100"
                        }`}
                      >
                        {v.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(v)}
                        title="Modifica Reel"
                        className="rounded-lg p-1.5 text-charcoal/55 transition-colors hover:bg-teal-50 hover:text-teal-800 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => cmsStore.deleteVideo(v.id)}
                        title="Elimina Reel"
                        className="rounded-lg p-1.5 text-charcoal/50 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Colonna Editor + Anteprima */}
        <div className="space-y-6">
          <form
            onSubmit={submit}
            className="h-fit rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-teal-900">
                {editing ? "Modifica Reel" : "Aggiungi nuovo Reel"}
              </h3>
              {editing && (
                <button
                  type="button"
                  onClick={startAdd}
                  className="text-charcoal/40 hover:text-charcoal cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Tipo sorgente */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "instagram" })}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                    form.type === "instagram"
                      ? "border-teal-600 bg-teal-50 text-teal-900"
                      : "border-teal-100 text-charcoal/60 hover:bg-slate-50"
                  }`}
                >
                  <Instagram className="h-3.5 w-3.5" />
                  Instagram Reel
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "mp4" })}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                    form.type === "mp4"
                      ? "border-teal-600 bg-teal-50 text-teal-900"
                      : "border-teal-100 text-charcoal/60 hover:bg-slate-50"
                  }`}
                >
                  <Film className="h-3.5 w-3.5" />
                  Video MP4 (R2)
                </button>
              </div>

              {/* Upload Video MP4 su R2 */}
              {form.type === "mp4" && (
                <div className="rounded-2xl border border-dashed border-teal-300 bg-teal-50/40 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-teal-950">
                        Carica video MP4 su Cloudflare R2
                      </p>
                      <p className="text-[11px] text-charcoal/60">
                        MP4 / WebM / MOV verticale (max 50 MB)
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-dark-navy px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-900">
                      {uploadingVideo ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Caricamento...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-3.5 w-3.5" />
                          Carica MP4
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                        className="sr-only"
                        disabled={uploadingVideo}
                        onChange={(e) => handleVideoFileUpload(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                  {uploadMsg && (
                    <p className="mt-2 text-[11px] font-medium text-emerald-700">{uploadMsg}</p>
                  )}
                  {uploadError && (
                    <p className="mt-2 text-[11px] font-medium text-rose-600">{uploadError}</p>
                  )}
                </div>
              )}

              <div>
                <Field
                  label={form.type === "instagram" ? "Link Instagram Reel" : "URL file video MP4"}
                  value={form.url}
                  onChange={(url) => setForm({ ...form, url })}
                  placeholder={
                    form.type === "instagram"
                      ? "https://www.instagram.com/reel/CODICE/"
                      : "https://pub-...r2.dev/videos/reels/..."
                  }
                />
                {form.url.trim() && (
                  <p
                    className={`mt-1 text-[11px] font-medium ${
                      urlCheck.valid ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {urlCheck.valid
                      ? urlCheck.shortcode
                        ? `✓ Shortcode Instagram riconosciuto: ${urlCheck.shortcode} (embed attivo)`
                        : urlCheck.reason || "✓ Sorgente video valida"
                      : urlCheck.reason}
                  </p>
                )}
              </div>

              <Field
                label="Titolo"
                value={form.title}
                onChange={(title) =>
                  setForm((prev) => ({
                    ...prev,
                    title,
                    slug:
                      !editing && (!prev.slug || prev.slug === slugifyReelTitle(prev.title))
                        ? slugifyReelTitle(title)
                        : prev.slug,
                  }))
                }
                placeholder="es. Come funziona il Check-up Salute"
              />

              <div>
                <Field
                  label="Slug URL condivisibile"
                  value={form.slug ?? ""}
                  onChange={(slug) => setForm({ ...form, slug })}
                  placeholder={effectivePreviewSlug}
                />
                <p className="mt-1 truncate font-mono text-[10px] text-teal-800/80">
                  Anteprima link: /reels/{effectivePreviewSlug}
                </p>
              </div>

              {/* Immagine Copertina / Poster OG */}
              <div>
                <span className="mb-1.5 block text-xs font-medium text-teal-900">
                  Copertina 9:16 &amp; Anteprima WhatsApp (og:image)
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="relative h-14 w-9 shrink-0 overflow-hidden rounded-lg border border-teal-200 bg-teal-50">
                    {form.poster ? (
                      <img
                        src={form.poster}
                        alt="Poster"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-teal-400">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPosterModalOpen(true)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-100 cursor-pointer"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Libreria Media
                  </button>
                  <input
                    value={form.poster ?? ""}
                    onChange={(e) => setForm({ ...form, poster: e.target.value })}
                    placeholder="https://..."
                    className="min-w-0 flex-1 rounded-xl border border-teal-200 px-3 py-2 text-xs outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-teal-900">Caption</span>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Descrizione mostrata sotto il Reel e nell'anteprima social..."
                  className="w-full rounded-xl border border-teal-200 px-3.5 py-2 text-sm outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Testo bottone CTA"
                  value={form.ctaLabel ?? ""}
                  onChange={(ctaLabel) => setForm({ ...form, ctaLabel })}
                  placeholder="Scopri di più"
                />
                <Field
                  label="Link bottone CTA"
                  value={form.ctaLink ?? ""}
                  onChange={(ctaLink) => setForm({ ...form, ctaLink })}
                  placeholder="/club"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {QUICK_CTA_LINKS.map((preset) => (
                  <button
                    key={preset.link}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        ctaLink: preset.link,
                        ctaLabel: prev.ctaLabel || `Scopri ${preset.label}`,
                      }))
                    }
                    className="rounded-full border border-teal-100 bg-teal-50/70 px-2.5 py-0.5 text-[10px] font-medium text-teal-800 hover:bg-teal-100 cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-teal-100 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                  className="h-4 w-4 accent-teal-700"
                />
                <span className="text-sm font-medium text-teal-900">Visibile sul sito</span>
              </label>

              <Button type="submit" className="w-full">
                {editing ? "Salva modifiche su Cloud" : "Aggiungi Reel su Cloud"}
              </Button>
            </div>
          </form>

          {/* Mini Anteprima Live */}
          <div className="rounded-3xl border border-teal-100 bg-[#f4f8fa] p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                Anteprima Condivisione Social
              </span>
              <span className="text-[10px] font-mono text-charcoal/60">
                /reels/{effectivePreviewSlug}
              </span>
            </div>
            <div className="flex items-center gap-3.5 rounded-2xl border border-teal-100 bg-white p-3">
              <div className="relative h-20 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-teal-700 to-dark-navy">
                {form.poster ? (
                  <img
                    src={form.poster}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/80">
                    <Play className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">
                  cocoora.vercel.app
                </p>
                <p className="truncate font-serif text-sm font-bold text-dark-navy">
                  {form.title || "Titolo del tuo Reel"} — Cocoora Reels
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-charcoal/70">
                  {form.caption || "Inserisci una caption per l'anteprima WhatsApp e Instagram."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={posterModalOpen}
        onClose={() => setPosterModalOpen(false)}
        onSelect={(url) => setForm((prev) => ({ ...prev, poster: url }))}
        currentValue={form.poster}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-teal-900">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-teal-200 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600"
      />
    </label>
  );
}
