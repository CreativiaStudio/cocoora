"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileCode2,
  Globe,
  Laptop,
  Plus,
  Route,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { cmsStore } from "@/lib/cms-store";
import {
  evaluateSeoPage,
  getSeoPageCategory,
  type SeoPageCategory,
} from "@/lib/seo-audit";
import { SITE_URL } from "@/lib/reels-utils";
import type { SeoPage, SeoRedirect, VideoItem } from "@/lib/types";

export function SerpPreviewCard({ page }: { page: SeoPage }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const title = (page.title || page.h1 || "Cocoora Centro Medico").trim();
  const displayTitle = title.length > 60 ? `${title.slice(0, 57)}...` : title;
  const desc = (
    page.metaDescription ||
    page.h2 ||
    "Cocoora Centro Medico a Napoli: visite specialistiche, medicina estetica e odontoiatria."
  ).trim();
  const displayDesc = desc.length > 158 ? `${desc.slice(0, 155)}...` : desc;
  const displayUrl = `${SITE_URL.replace(/^https?:\/\//, "")}${
    page.path === "/" ? "" : page.path.replace(/\//g, " › ")
  }`;

  return (
    <div className="rounded-2xl border border-teal-100 bg-[#fafcfd] p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-teal-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-950">
            Anteprima Live Google SERP
          </span>
        </div>

        <div className="inline-flex rounded-xl border border-teal-200 bg-white p-0.5 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition cursor-pointer ${
              device === "desktop"
                ? "bg-dark-navy text-white"
                : "text-charcoal/65 hover:text-dark-navy"
            }`}
          >
            <Laptop className="h-3 w-3" /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition cursor-pointer ${
              device === "mobile"
                ? "bg-dark-navy text-white"
                : "text-charcoal/65 hover:text-dark-navy"
            }`}
          >
            <Smartphone className="h-3 w-3" /> Mobile
          </button>
        </div>
      </div>

      <div
        className={`rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all ${
          device === "mobile" ? "mx-auto max-w-[360px]" : "w-full"
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-900 text-[10px] font-bold text-white">
            C
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-800">Cocoora Centro Medico</p>
            <p className="truncate text-[11px] text-slate-500">{displayUrl}</p>
          </div>
        </div>
        <p className="mt-1.5 text-[17px] font-medium leading-snug text-[#1a0dab]">
          {displayTitle}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#4d5156]">{displayDesc}</p>

        {page.faq.length > 0 && (
          <div className="mt-3 border-t border-slate-100 pt-2.5 space-y-1">
            {page.faq.slice(0, 2).map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[11px] text-slate-600"
              >
                <span className="truncate font-medium">▸ {f.q}</span>
                <span className="shrink-0 text-[10px] text-teal-700">FAQ Snippet</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SocialCardPreview({ page }: { page: SeoPage }) {
  const ogTitle = (page.ogTitle || page.title || page.h1 || "Cocoora Centro Medico").trim();
  const ogDesc = (page.ogDescription || page.metaDescription || page.h2 || "").trim();
  const ogImage = (
    page.ogImage ||
    page.heroImage ||
    "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-1.webp"
  ).trim();
  const host = SITE_URL.replace(/^https?:\/\//, "").toUpperCase();

  return (
    <div className="rounded-2xl border border-teal-100 bg-[#fafcfd] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-950">
          Anteprima Condivisione WhatsApp / LinkedIn / Meta
        </span>
        <span className="text-[10px] font-mono text-charcoal/55">1200 × 630px</span>
      </div>

      <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[1.91/1] w-full bg-teal-950/10">
          <img
            src={ogImage}
            alt="Anteprima OpenGraph"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="border-t border-slate-100 bg-slate-50/70 p-3.5">
          <p className="text-[10px] font-semibold tracking-wider text-slate-500">{host}</p>
          <p className="mt-0.5 line-clamp-1 text-sm font-bold text-slate-900">{ogTitle}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
            {ogDesc || "Descrizione OpenGraph della pagina condivisa."}
          </p>
        </div>
      </div>
    </div>
  );
}

type AuditFilter =
  | "all"
  | "low_score"
  | "meta_issue"
  | "title_long"
  | "no_og"
  | "policy"
  | "noindex";

const CATEGORY_BADGES: Record<SeoPageCategory, string> = {
  medicina: "Medicina Estetica",
  odontoiatria: "Odontoiatria",
  visite: "Visite Specialistiche",
  hub: "Hub & Club",
};

export function GlobalSeoAuditView({
  pages,
  onSelectPage,
}: {
  pages: SeoPage[];
  onSelectPage: (pageId: string) => void;
}) {
  const [filter, setFilter] = useState<AuditFilter>("all");

  const audited = useMemo(
    () =>
      pages.map((page) => ({
        page,
        category: getSeoPageCategory(page),
        audit: evaluateSeoPage(page),
      })),
    [pages]
  );

  const filtered = useMemo(() => {
    return audited.filter(({ page, audit }) => {
      if (filter === "low_score") return audit.score < 75;
      if (filter === "meta_issue") return audit.descLen < 100 || audit.descLen > 160;
      if (filter === "title_long") return audit.titleLen > 60 || audit.titleLen === 0;
      if (filter === "no_og") return !audit.hasOgImage;
      if (filter === "policy") return audit.policyAlerts.length > 0;
      if (filter === "noindex") return Boolean(page.noindex || page.canvasMode);
      return true;
    });
  }, [audited, filter]);

  const counts = useMemo(
    () => ({
      all: audited.length,
      low_score: audited.filter((a) => a.audit.score < 75).length,
      meta_issue: audited.filter((a) => a.audit.descLen < 100 || a.audit.descLen > 160).length,
      title_long: audited.filter((a) => a.audit.titleLen > 60 || a.audit.titleLen === 0).length,
      no_og: audited.filter((a) => !a.audit.hasOgImage).length,
      policy: audited.filter((a) => a.audit.policyAlerts.length > 0).length,
      noindex: audited.filter((a) => Boolean(a.page.noindex || a.page.canvasMode)).length,
    }),
    [audited]
  );

  const filterOptions: { id: AuditFilter; label: string; count: number }[] = [
    { id: "all", label: "Tutte le pagine", count: counts.all },
    { id: "low_score", label: "Score < 75", count: counts.low_score },
    { id: "meta_issue", label: "Meta Desc da ottimizzare", count: counts.meta_issue },
    { id: "title_long", label: "Title > 60ch", count: counts.title_long },
    { id: "no_og", label: "Senza OG Image", count: counts.no_og },
    { id: "policy", label: "Avvisi Brand Vault", count: counts.policy },
    { id: "noindex", label: "Noindex / Shield", count: counts.noindex },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-dark-navy">
              Audit Globale SEO &amp; Conformità Sanitaria
            </h3>
            <p className="text-xs text-charcoal/65">
              Scansione automatica di tutte le rotte pubbliche, lunghezza tag, OpenGraph e termini del Brand Vault.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                filter === opt.id
                  ? "bg-dark-navy text-white"
                  : "bg-teal-50 text-teal-900 hover:bg-teal-100"
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  filter === opt.id ? "bg-white/20 text-white" : "bg-white text-teal-800"
                }`}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-teal-100 bg-teal-50/70 text-[11px] font-bold uppercase tracking-wider text-teal-900">
              <tr>
                <th className="px-4 py-3">Pagina / Rotta</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Meta Desc</th>
                <th className="px-4 py-3">FAQ</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3 text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50">
              {filtered.map(({ page, category, audit }) => (
                <tr key={page.id} className="hover:bg-teal-50/25">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-teal-950">{page.label}</p>
                    <p className="font-mono text-[11px] text-charcoal/55">{page.path}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-semibold text-teal-800">
                      {CATEGORY_BADGES[category]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${
                        audit.score >= 85
                          ? "bg-emerald-50 text-emerald-700"
                          : audit.score >= 65
                          ? "bg-amber-50 text-amber-800"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {audit.score}/100
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span
                      className={
                        audit.titleLen >= 30 && audit.titleLen <= 60
                          ? "text-emerald-700"
                          : "text-amber-700 font-semibold"
                      }
                    >
                      {audit.titleLen}ch
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span
                      className={
                        audit.descLen >= 100 && audit.descLen <= 160
                          ? "text-emerald-700"
                          : "text-amber-700 font-semibold"
                      }
                    >
                      {audit.descLen}ch
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-charcoal/70">
                    {page.faq.length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {audit.policyAlerts.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                          <ShieldAlert className="h-3 w-3" /> Policy
                        </span>
                      )}
                      {page.noindex && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          noindex
                        </span>
                      )}
                      {page.canvasMode && (
                        <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                          Shield
                        </span>
                      )}
                      {audit.policyAlerts.length === 0 && !page.noindex && !page.canvasMode && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" /> OK
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectPage(page.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-100 cursor-pointer"
                    >
                      Modifica <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-xs text-charcoal/50">
                    Nessuna pagina corrisponde al filtro selezionato.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SitemapAndRedirectsView({
  pages,
  videos,
  redirects,
}: {
  pages: SeoPage[];
  videos: VideoItem[];
  redirects: SeoRedirect[];
}) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [permanent, setPermanent] = useState(true);
  const [notes, setNotes] = useState("");

  const indexedPagesCount = pages.filter((p) => !p.noindex).length;
  const indexedReelsCount = videos.filter((v) => v.visible).length;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;
    cmsStore.addRedirect({
      source: source.trim(),
      destination: destination.trim(),
      permanent,
      enabled: true,
      notes: notes.trim() || undefined,
    });
    setSource("");
    setDestination("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Stato Sitemap & Robots.txt */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FileCode2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-dark-navy">
                  Sitemap XML Dinamica
                </h3>
                <p className="text-xs text-charcoal/65">
                  Aggiornata in automatico su <code className="font-mono">/sitemap.xml</code>
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              Attiva
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-teal-50/50 p-3 border border-teal-100">
              <p className="text-charcoal/60">Pagine indicizzabili</p>
              <p className="mt-0.5 font-serif text-xl font-bold text-dark-navy">
                {indexedPagesCount}
              </p>
            </div>
            <div className="rounded-xl bg-teal-50/50 p-3 border border-teal-100">
              <p className="text-charcoal/60">Reels in Sitemap</p>
              <p className="mt-0.5 font-serif text-xl font-bold text-dark-navy">
                {indexedReelsCount}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 px-3.5 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-100"
            >
              Apri /sitemap.xml <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-dark-navy">
                  Robots.txt &amp; Protezione Aree Interne
                </h3>
                <p className="text-xs text-charcoal/65">
                  Regole crawl su <code className="font-mono">/robots.txt</code>
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              Attivo
            </span>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-charcoal/75">
            Blocca automaticamente dai motori di ricerca le aree riservate (<code className="font-mono">/admin</code>, <code className="font-mono">/segreteria</code>, <code className="font-mono">/medico</code>, <code className="font-mono">/area-paziente</code>, <code className="font-mono">/api/</code>, <code className="font-mono">/login</code>) e dichiara la sitemap ufficiale.
          </p>

          <div className="mt-4">
            <Link
              href="/robots.txt"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 px-3.5 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-100"
            >
              Apri /robots.txt <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Manager Redirect 301/302 */}
      <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 border-b border-teal-100 pb-4">
          <Route className="h-5 w-5 text-teal-700" />
          <div>
            <h3 className="font-serif text-xl font-semibold text-dark-navy">
              Redirect Manager (301 / 302)
            </h3>
            <p className="text-xs text-charcoal/65">
              Evita errori 404 su vecchi URL o campagne promozionali reindirizzando direttamente dal middleware Edge.
            </p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_170px_auto]">
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Da URL (es. /vecchia-pagina)"
            className="rounded-xl border border-teal-200 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-teal-600"
          />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="A URL (es. /trattamenti/filler-acido-ialuronico)"
            className="rounded-xl border border-teal-200 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-teal-600"
          />
          <select
            value={permanent ? "301" : "302"}
            onChange={(e) => setPermanent(e.target.value === "301")}
            className="rounded-xl border border-teal-200 bg-white px-3 py-2.5 text-xs font-semibold text-teal-950 outline-none focus:border-teal-600"
          >
            <option value="301">301 Permanente</option>
            <option value="302">302 Temporaneo</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-dark-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-900 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Aggiungi
          </button>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nota interna opzionale (es. Redirect campagna Meta Novembre)"
            className="md:col-span-4 rounded-xl border border-teal-100 bg-teal-50/30 px-3.5 py-2 text-xs outline-none focus:border-teal-600"
          />
        </form>

        <div className="mt-5 divide-y divide-teal-50 rounded-xl border border-teal-100">
          {redirects.length === 0 ? (
            <p className="p-6 text-center text-xs text-charcoal/55">
              Nessun redirect configurato. Aggiungi il primo reindirizzamento 301/302 qui sopra.
            </p>
          ) : (
            redirects.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-800">
                      {r.source}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-teal-600" />
                    <span className="rounded bg-teal-50 px-2 py-0.5 font-semibold text-teal-900">
                      {r.destination}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        r.permanent
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {r.permanent ? "301" : "302"}
                    </span>
                  </div>
                  {r.notes && (
                    <p className="mt-1 text-[11px] text-charcoal/60">{r.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cmsStore.updateRedirect(r.id, { enabled: !r.enabled })}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
                      r.enabled
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {r.enabled ? (
                      <>
                        <ToggleRight className="h-4 w-4" /> Attivo
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4" /> Sospeso
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => cmsStore.deleteRedirect(r.id)}
                    aria-label="Elimina redirect"
                    className="rounded-lg p-1.5 text-charcoal/45 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function JsonLdPreviewBox({
  jsonLd,
  pagePath,
}: {
  jsonLd: unknown;
  pagePath: string;
}) {
  const [copied, setCopied] = useState(false);
  const formatted = useMemo(() => JSON.stringify(jsonLd, null, 2), [jsonLd]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const richResultsUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(
    `${SITE_URL}${pagePath === "/" ? "" : pagePath}`
  )}`;

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h4 className="font-serif text-base font-semibold text-dark-navy">
            Anteprima Schema.org JSON-LD Live
          </h4>
          <p className="text-[11px] text-charcoal/60">
            Generato server-side per i crawler di Google e AI Search.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-100 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-700" /> Copiato!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copia JSON-LD
              </>
            )}
          </button>

          <a
            href={richResultsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-dark-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-900"
          >
            Test Rich Results <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <pre className="max-h-72 overflow-auto rounded-xl bg-[#101517] p-4 font-mono text-[11px] leading-relaxed text-teal-200">
        {formatted}
      </pre>
    </div>
  );
}

export function PolicyAlertsBanner({
  alertsCount,
}: {
  alertsCount: number;
}) {
  if (alertsCount === 0) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
      <span>
        Rilevati {alertsCount} termini non conformi al Brand Vault / policy sanitaria.
      </span>
    </div>
  );
}
