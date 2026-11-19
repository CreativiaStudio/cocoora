"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Code2,
  ExternalLink,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Loader2,
  MapPin,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { cmsStore } from "@/lib/cms-store";
import {
  buildPageJsonLd,
  evaluateSeoPage,
  getSeoPageCategory,
} from "@/lib/seo-audit";
import { useCms, useCmsSync } from "../providers";
import type {
  SeoPage,
  SeoSchemaType,
  TreatmentProblem,
  TreatmentTimelineStep,
} from "@/lib/types";
import { MediaLibraryModal } from "./media-library-modal";
import {
  GlobalSeoAuditView,
  JsonLdPreviewBox,
  SerpPreviewCard,
  SitemapAndRedirectsView,
  SocialCardPreview,
} from "./seo-subpanels";

type PageCategory = "all" | "medicina" | "odontoiatria" | "visite" | "hub";
type TopSection = "editor" | "audit" | "sitemap";
type EditorTab = "seo" | "content" | "schema" | "social";

export function SeoManager() {
  const { pages, videos, redirects = [] } = useCms();
  const sync = useCmsSync();

  const [topSection, setTopSection] = useState<TopSection>("editor");
  const [editorTab, setEditorTab] = useState<EditorTab>("seo");
  const [selectedId, setSelectedId] = useState(pages[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PageCategory>("all");
  const [onlyWarnings, setOnlyWarnings] = useState(false);

  const page = pages.find((p) => p.id === selectedId) ?? pages[0];

  const kpiSummary = useMemo(() => {
    let totalScore = 0;
    let warnCount = 0;
    let indexedCount = 0;
    for (const p of pages) {
      const a = evaluateSeoPage(p);
      totalScore += a.score;
      if (a.score < 75 || a.policyAlerts.length > 0) warnCount += 1;
      if (!p.noindex) indexedCount += 1;
    }
    const avgScore = pages.length > 0 ? Math.round(totalScore / pages.length) : 0;
    return {
      indexedCount,
      avgScore,
      warnCount,
      redirectsCount: redirects.filter((r) => r.enabled).length,
    };
  }, [pages, redirects]);

  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hit =
          p.label.toLowerCase().includes(q) ||
          p.path.toLowerCase().includes(q) ||
          (p.keywords ?? "").toLowerCase().includes(q) ||
          (p.focusKeyword ?? "").toLowerCase().includes(q);
        if (!hit) return false;
      }

      if (categoryFilter !== "all" && getSeoPageCategory(p) !== categoryFilter) {
        return false;
      }

      if (onlyWarnings) {
        const a = evaluateSeoPage(p);
        if (a.score >= 80 && a.policyAlerts.length === 0) return false;
      }

      return true;
    });
  }, [pages, searchQuery, categoryFilter, onlyWarnings]);

  const handleSelectFromAudit = (pageId: string) => {
    setSelectedId(pageId);
    setTopSection("editor");
    setEditorTab("seo");
  };

  return (
    <div className="space-y-6">
      {/* ── TOP HEADER BAR (STATICA, ZERO STICKY OVERLAP) ────────────── */}
      <div className="rounded-3xl border border-teal-100 bg-white p-5 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-dark-navy">
              SEO Studio &amp; Indicizzazione Cocoora
            </h2>
            <p className="text-xs text-charcoal/65">
              Gestione centralizzata Meta Tag SSR, Anteprima Google SERP, Schema.org, OpenGraph e Policy Shield.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sync.status === "saving" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Salvataggio Cloud...
              </span>
            ) : sync.status === "error" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">
                <AlertTriangle className="h-3.5 w-3.5" /> {sync.error || "Errore sync"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <Cloud className="h-3.5 w-3.5" /> Salvato su Supabase
              </span>
            )}
          </div>
        </div>

        {/* 4 KPI Cards Compatte */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-teal-100 bg-teal-50/40 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">
              Pagine Indicizzate
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-dark-navy">
              {kpiSummary.indexedCount}
              <span className="ml-1 text-xs font-normal text-charcoal/55">/ {pages.length}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-teal-50/40 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">
              SEO Score Medio
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-teal-900">
              {kpiSummary.avgScore}
              <span className="ml-0.5 text-xs font-normal text-charcoal/55">/100</span>
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-teal-50/40 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">
              Pagine con Avvisi
            </p>
            <p
              className={`mt-1 font-serif text-2xl font-bold ${
                kpiSummary.warnCount > 0 ? "text-amber-700" : "text-emerald-700"
              }`}
            >
              {kpiSummary.warnCount}
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-teal-50/40 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">
              Sitemap &amp; Redirect 301
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-dark-navy">
              {kpiSummary.redirectsCount}
              <span className="ml-1.5 text-xs font-normal text-emerald-700">· XML Live</span>
            </p>
          </div>
        </div>

        {/* Segmented Control Principale */}
        <div className="flex flex-wrap items-center gap-2 border-t border-teal-100 pt-4">
          {[
            { id: "editor", label: "Editor Pagina", icon: FileText },
            { id: "audit", label: "Audit Globale SEO", icon: BarChart3 },
            { id: "sitemap", label: "Sitemap, Robots & Redirect 301", icon: Code2 },
          ].map((item) => {
            const Icon = item.icon;
            const active = topSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTopSection(item.id as TopSection)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-dark-navy text-white shadow-xs"
                    : "bg-teal-50/70 text-teal-900 hover:bg-teal-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENUTO PRINCIPALE PER SEZIONE ─────────────────────────── */}
      {topSection === "audit" ? (
        <GlobalSeoAuditView pages={pages} onSelectPage={handleSelectFromAudit} />
      ) : topSection === "sitemap" ? (
        <SitemapAndRedirectsView
          pages={pages}
          videos={videos}
          redirects={redirects}
        />
      ) : (
        <div className="grid gap-7 lg:grid-cols-[310px_1fr]">
          {/* Sidebar Elenco Pagine */}
          <div className="h-fit rounded-3xl border border-teal-100 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.35)]">
            <div className="border-b border-teal-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-teal-950">
                  Pagine del Sito
                </h3>
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800">
                  {filteredPages.length}/{pages.length}
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca pagina, URL o keyword..."
                  className="w-full rounded-xl border border-teal-200 bg-teal-50/35 py-2 pl-8 pr-3 text-xs outline-none placeholder:text-charcoal/40 focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {[
                  { id: "all", label: "Tutte" },
                  { id: "medicina", label: "Medicina Estetica" },
                  { id: "odontoiatria", label: "Odontoiatria" },
                  { id: "visite", label: "Visite" },
                  { id: "hub", label: "Hub & Club" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategoryFilter(f.id as PageCategory)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition cursor-pointer ${
                      categoryFilter === f.id
                        ? "bg-dark-navy text-white"
                        : "bg-teal-50 text-teal-800 hover:bg-teal-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-[11px] font-medium text-charcoal/75 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyWarnings}
                  onChange={(e) => setOnlyWarnings(e.target.checked)}
                  className="h-3.5 w-3.5 accent-teal-700"
                />
                <span>Mostra solo pagine con avvisi (&lt;80)</span>
              </label>
            </div>

            <div className="max-h-[70vh] divide-y divide-teal-50 overflow-y-auto">
              {filteredPages.length === 0 ? (
                <p className="p-5 text-center text-xs text-charcoal/50">
                  Nessuna pagina trovata.
                </p>
              ) : (
                filteredPages.map((p) => {
                  const isSelected = p.id === (page?.id ?? "");
                  const audit = evaluateSeoPage(p);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className={`flex w-full items-center justify-between gap-2.5 px-4 py-3 text-left transition cursor-pointer ${
                        isSelected
                          ? "border-l-4 border-l-primary-teal bg-teal-50/90"
                          : "hover:bg-teal-50/35"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-semibold text-teal-950">
                            {p.label}
                          </span>
                          {audit.policyAlerts.length > 0 && (
                            <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                          )}
                          {p.canvasMode && (
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                          )}
                        </div>
                        <p className="truncate font-mono text-[10px] text-charcoal/55">
                          {p.path}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          audit.score >= 85
                            ? "bg-emerald-50 text-emerald-700"
                            : audit.score >= 65
                            ? "bg-amber-50 text-amber-800"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {audit.score}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Editor Pagina Selezionata */}
          {page && (
            <PageEditor
              key={page.id}
              page={page}
              editorTab={editorTab}
              onTabChange={setEditorTab}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PageEditor({
  page,
  editorTab,
  onTabChange,
}: {
  page: SeoPage;
  editorTab: EditorTab;
  onTabChange: (t: EditorTab) => void;
}) {
  const [savingNow, setSavingNow] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({
    b1: true,
    b2: true,
    b3: false,
    b4: false,
    b5: false,
    b6: false,
    b8: false,
  });

  const isRichTemplate =
    page.path.startsWith("/trattamenti/") || page.path.startsWith("/visite/");
  const audit = useMemo(() => evaluateSeoPage(page), [page]);
  const liveJsonLd = useMemo(() => buildPageJsonLd(page), [page]);

  const update = (patch: Partial<SeoPage>) => cmsStore.updatePage(page.id, patch);

  const handleManualSave = async () => {
    setSavingNow(true);
    const ok = await cmsStore.savePageNow(page);
    setSavingNow(false);
    if (ok) {
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  const toggleBlock = (key: string) =>
    setOpenBlocks((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      {/* TESTATA COMPATTA & NON-STICKY (RISOLVE LO STICKY BUG) */}
      <div className="rounded-3xl border border-teal-100 bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800">
                {isRichTemplate ? "Scheda Clinica / Trattamento" : "Pagina Hub / Servizio"}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  audit.score >= 85
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : audit.score >= 65
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                SEO Score: {audit.score}/100
              </span>
              {page.canvasMode && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                  <ShieldCheck className="h-3 w-3" /> Policy Shield Attivo
                </span>
              )}
              {page.noindex && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                  noindex
                </span>
              )}
            </div>

            <h3 className="mt-2 font-serif text-2xl font-semibold text-dark-navy">
              {page.label}
            </h3>
            <p className="font-mono text-xs text-charcoal/55">{page.path}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleManualSave}
              disabled={savingNow}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-800 disabled:opacity-50 cursor-pointer"
            >
              {savingNow ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : savedNotice ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{savedNotice ? "Salvato!" : "Salva su Cloud"}</span>
            </button>

            <Link
              href={page.path}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-semibold text-teal-900 transition hover:bg-teal-50"
            >
              Apri live <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Sub-Tab Interni */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-teal-100 pt-4">
          {[
            { id: "seo", label: "SEO & SERP", icon: Search },
            { id: "content", label: "Contenuti Pagina", icon: Layers },
            { id: "schema", label: `FAQ & Schema (${page.faq.length})`, icon: HelpCircle },
            { id: "social", label: "Social OG & Policy Shield", icon: Share2 },
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const active = editorTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => onTabChange(tabItem.id as EditorTab)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-teal-900 text-white shadow-2xs"
                    : "border border-teal-100 bg-teal-50/40 text-teal-900 hover:bg-teal-50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tabItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SUB-TAB 1: SEO & SERP ─────────────────────────────────────── */}
      {editorTab === "seo" && (
        <div className="space-y-6">
          <SerpPreviewCard page={page} />

          {/* Alert Brand Vault & Policy Sanitaria */}
          {audit.policyAlerts.length > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-900">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <h4 className="font-serif text-base font-bold">
                  Cocoora Brand Guard — Termini da sostituire rilevati
                </h4>
              </div>
              <div className="space-y-1.5">
                {audit.policyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-rose-200/80 bg-white/80 px-3.5 py-2 text-xs text-rose-900"
                  >
                    <span className="font-bold">{alert.field}:</span> {alert.label} →{" "}
                    <span className="font-semibold text-teal-800">{alert.replacement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campi Meta principali */}
          <Card title="Meta Tag & Parole Chiave" icon={FileText}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Focus Keyword Principale"
                value={page.focusKeyword ?? ""}
                onChange={(focusKeyword) => update({ focusKeyword })}
                placeholder="es. filler acido ialuronico Napoli"
              />
              <Field
                label="Tipo Schema.org"
                value={page.schemaType ?? "WebPage"}
                onChange={() => {}}
                customInput={
                  <select
                    value={page.schemaType ?? "WebPage"}
                    onChange={(e) =>
                      update({ schemaType: e.target.value as SeoSchemaType })
                    }
                    className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-teal-600"
                  >
                    <option value="MedicalClinic">MedicalClinic (Centro Medico)</option>
                    <option value="MedicalProcedure">MedicalProcedure (Trattamento)</option>
                    <option value="MedicalSpecialty">MedicalSpecialty (Branca / Visita)</option>
                    <option value="Physician">Physician (Équipe Medica)</option>
                    <option value="WebPage">WebPage (Pagina Informativa)</option>
                  </select>
                }
              />
            </div>

            <div>
              <Field
                label="Meta Title (<title>) — SSR Google"
                value={page.title}
                onChange={(title) => update({ title })}
                counter={{ value: page.title.length, max: 60 }}
              />
              <LengthBar current={page.title.length} min={30} max={60} />
            </div>

            <div>
              <Textarea
                label="Meta Description"
                value={page.metaDescription}
                onChange={(metaDescription) => update({ metaDescription })}
                rows={3}
                counter={{ value: page.metaDescription.length, max: 160 }}
              />
              <LengthBar current={page.metaDescription.length} min={100} max={160} />
            </div>

            <Field
              label="Keyword Secondarie & Correlate"
              value={page.keywords ?? ""}
              onChange={(keywords) => update({ keywords })}
              placeholder="Separa con ; (es. medicina estetica Napoli; trattamento viso...)"
            />
          </Card>

          {/* Checklist SEO & Controlli Tecnici */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Checklist SEO Real-Time" icon={CheckCircle2}>
              <div className="space-y-2">
                {audit.checks.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-teal-50 bg-teal-50/25 px-3.5 py-2.5 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                          c.status === "ok"
                            ? "bg-emerald-500"
                            : c.status === "warn"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      <div>
                        <p className="font-semibold text-teal-950">{c.label}</p>
                        <p className="text-[11px] text-charcoal/60">{c.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Indicizzazione & Canonical" icon={Code2}>
              <Field
                label="URL Canonical Personalizzato (opzionale)"
                value={page.canonicalUrl ?? ""}
                onChange={(canonicalUrl) => update({ canonicalUrl })}
                placeholder={`Default automatico: ${page.path}`}
              />

              <label className="flex items-start justify-between gap-4 rounded-xl border border-teal-100 bg-teal-50/30 p-3.5 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-teal-950">Escludi da Google (noindex)</p>
                  <p className="mt-0.5 text-[11px] text-charcoal/65">
                    Imposta <code className="font-mono">noindex</code> ed esclude automaticamente questa pagina da <code className="font-mono">/sitemap.xml</code>.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(page.noindex)}
                  onChange={(e) => update({ noindex: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-teal-700"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-xl border border-teal-100 bg-teal-50/30 p-3.5 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-teal-950">Non seguire link (nofollow)</p>
                  <p className="mt-0.5 text-[11px] text-charcoal/65">
                    Aggiunge la direttiva <code className="font-mono">nofollow</code> ai meta robots della pagina.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(page.nofollow)}
                  onChange={(e) => update({ nofollow: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-teal-700"
                />
              </label>
            </Card>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: CONTENUTI PAGINA ──────────────────────────────── */}
      {editorTab === "content" && (
        <div className="space-y-4">
          <CollapsibleCard
            title="Blocco 1 — Hero & Apertura Pagina"
            icon={Sparkles}
            open={openBlocks.b1}
            onToggle={() => toggleBlock("b1")}
          >
            <Field label="Titolo H1 Principale" value={page.h1} onChange={(h1) => update({ h1 })} />
            <Textarea
              label="Sottotitolo / Introduzione H2"
              value={page.h2}
              onChange={(h2) => update({ h2 })}
              rows={2}
            />
            {isRichTemplate && (
              <>
                <ImageField
                  label="Immagine Hero Principale (Mobile Image-First)"
                  value={page.heroImage ?? ""}
                  onChange={(heroImage) => update({ heroImage })}
                  helperText="Scegli un'immagine dalla Libreria Media o carica una nuova foto su R2."
                />
                <Field
                  label="Testo Pulsante CTA Hero"
                  value={page.heroCta ?? ""}
                  onChange={(heroCta) => update({ heroCta })}
                  placeholder="Iscriviti gratuitamente al Cocoora Club"
                />
              </>
            )}
          </CollapsibleCard>

          {isRichTemplate && (
            <>
              <CollapsibleCard
                title="Blocco 2 — Che cos'è e come funziona?"
                icon={Layers}
                open={openBlocks.b2}
                onToggle={() => toggleBlock("b2")}
              >
                <Field
                  label="Titolo Sezione (H2)"
                  value={page.whatIsTitle ?? ""}
                  onChange={(whatIsTitle) => update({ whatIsTitle })}
                />
                <Textarea
                  label="Descrizione Clinica (separa i paragrafi con riga vuota)"
                  value={page.whatIsDescription ?? ""}
                  onChange={(whatIsDescription) => update({ whatIsDescription })}
                  rows={5}
                />
                <Textarea
                  label="Nota Medica Evidenziata (Callout)"
                  value={page.whatIsCallout ?? ""}
                  onChange={(whatIsCallout) => update({ whatIsCallout })}
                  rows={2}
                />
                <ImageField
                  label="Immagine Laterale Sezione Clinica"
                  value={page.whatIsImage ?? ""}
                  onChange={(whatIsImage) => update({ whatIsImage })}
                />
              </CollapsibleCard>

              <CollapsibleCard
                title="Blocco 3 — A cosa serve? (4 Card)"
                icon={Check}
                open={openBlocks.b3}
                onToggle={() => toggleBlock("b3")}
              >
                <Field
                  label="Titolo Griglia (H2)"
                  value={page.problemsTitle ?? ""}
                  onChange={(problemsTitle) => update({ problemsTitle })}
                />
                <Textarea
                  label="Sottotitolo Griglia"
                  value={page.problemsSubtitle ?? ""}
                  onChange={(problemsSubtitle) => update({ problemsSubtitle })}
                  rows={2}
                />
                <div className="space-y-3 pt-2">
                  {(page.problemsGrid ?? []).map((prob, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-teal-100 bg-teal-50/35 p-4 space-y-2.5"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                        Card #{idx + 1}
                      </span>
                      <Field
                        label="Titolo Card"
                        value={prob.title}
                        onChange={(val) => {
                          const next = [...(page.problemsGrid ?? [])];
                          next[idx] = { ...prob, title: val };
                          update({ problemsGrid: next });
                        }}
                      />
                      <Textarea
                        label="Descrizione"
                        value={prob.description}
                        onChange={(val) => {
                          const next = [...(page.problemsGrid ?? [])];
                          next[idx] = { ...prob, description: val };
                          update({ problemsGrid: next });
                        }}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title="Blocco 4 — Come si svolge la seduta? (3 Step)"
                icon={Layers}
                open={openBlocks.b4}
                onToggle={() => toggleBlock("b4")}
              >
                <Field
                  label="Titolo Timeline (H2)"
                  value={page.timelineTitle ?? ""}
                  onChange={(timelineTitle) => update({ timelineTitle })}
                />
                <div className="space-y-3 pt-2">
                  {(page.timelineSteps ?? []).map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-teal-100 bg-teal-50/35 p-4 space-y-2.5"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                        Step {step.stepNumber || `0${idx + 1}`}
                      </span>
                      <Field
                        label="Titolo Fase"
                        value={step.title}
                        onChange={(val) => {
                          const next = [...(page.timelineSteps ?? [])];
                          next[idx] = { ...step, title: val };
                          update({ timelineSteps: next });
                        }}
                      />
                      <Textarea
                        label="Descrizione Fase"
                        value={step.description}
                        onChange={(val) => {
                          const next = [...(page.timelineSteps ?? [])];
                          next[idx] = { ...step, description: val };
                          update({ timelineSteps: next });
                        }}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 pt-2 sm:grid-cols-2">
                  <Field
                    label="Titolo Box Avvertenza Clinica"
                    value={page.timelineNoteTitle ?? ""}
                    onChange={(timelineNoteTitle) => update({ timelineNoteTitle })}
                  />
                  <Textarea
                    label="Testo Box Avvertenza Clinica"
                    value={page.timelineNoteText ?? ""}
                    onChange={(timelineNoteText) => update({ timelineNoteText })}
                    rows={2}
                  />
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title="Blocco 5 — Quali risultati aspettarsi?"
                icon={Sparkles}
                open={openBlocks.b5}
                onToggle={() => toggleBlock("b5")}
              >
                <Field
                  label="Titolo Risultati (H2)"
                  value={page.resultsTitle ?? ""}
                  onChange={(resultsTitle) => update({ resultsTitle })}
                />
                <Textarea
                  label="Descrizione Risultati"
                  value={page.resultsDescription ?? ""}
                  onChange={(resultsDescription) => update({ resultsDescription })}
                  rows={4}
                />
                <ImageField
                  label="Immagine Sezione Risultati"
                  value={page.resultsImage ?? ""}
                  onChange={(resultsImage) => update({ resultsImage })}
                />
              </CollapsibleCard>

              <CollapsibleCard
                title="Blocco 6 — Form Lead Dedicato"
                icon={MessageSquare}
                open={openBlocks.b6}
                onToggle={() => toggleBlock("b6")}
              >
                <Field
                  label="Titolo Form"
                  value={page.leadTitle ?? ""}
                  onChange={(leadTitle) => update({ leadTitle })}
                />
                <Textarea
                  label="Sottotitolo Form"
                  value={page.leadSubtitle ?? ""}
                  onChange={(leadSubtitle) => update({ leadSubtitle })}
                  rows={2}
                />
                <Field
                  label="Testo Pulsante Invio"
                  value={page.leadCta ?? ""}
                  onChange={(leadCta) => update({ leadCta })}
                />
              </CollapsibleCard>

              <CollapsibleCard
                title="Blocco 8 — Geo-Local SEO Napoli"
                icon={MapPin}
                open={openBlocks.b8}
                onToggle={() => toggleBlock("b8")}
              >
                <Field
                  label="Titolo Geo-Local"
                  value={page.localSeoTitle ?? ""}
                  onChange={(localSeoTitle) => update({ localSeoTitle })}
                />
                <Textarea
                  label="Testo Posizionamento Locale (Napoli & Posillipo)"
                  value={page.localSeoDescription ?? ""}
                  onChange={(localSeoDescription) => update({ localSeoDescription })}
                  rows={3}
                />
                <Field
                  label="Testo CTA Finale"
                  value={page.localSeoCta ?? ""}
                  onChange={(localSeoCta) => update({ localSeoCta })}
                />
              </CollapsibleCard>
            </>
          )}
        </div>
      )}

      {/* ── SUB-TAB 3: FAQ & SCHEMA.ORG ───────────────────────────────── */}
      {editorTab === "schema" && (
        <div className="space-y-6">
          <Card title="Domande Frequenti (FAQPage JSON-LD)" icon={HelpCircle}>
            <div className="space-y-3">
              {page.faq.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-teal-100 bg-teal-50/35 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                      FAQ #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        update({ faq: page.faq.filter((_, idx) => idx !== i) })
                      }
                      aria-label="Rimuovi FAQ"
                      className="text-charcoal/45 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    value={f.q}
                    onChange={(e) => {
                      const next = [...page.faq];
                      next[i] = { ...f, q: e.target.value };
                      update({ faq: next });
                    }}
                    placeholder="Domanda..."
                    className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-sm font-medium outline-none focus:border-teal-600"
                  />
                  <textarea
                    value={f.a}
                    onChange={(e) => {
                      const next = [...page.faq];
                      next[i] = { ...f, a: e.target.value };
                      update({ faq: next });
                    }}
                    rows={2}
                    placeholder="Risposta..."
                    className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  update({ faq: [...page.faq, { q: "Nuova domanda", a: "" }] })
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/40 px-4 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-100/60 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Aggiungi FAQ
              </button>
            </div>
          </Card>

          <JsonLdPreviewBox jsonLd={liveJsonLd} pagePath={page.path} />
        </div>
      )}

      {/* ── SUB-TAB 4: SOCIAL OG & POLICY SHIELD ──────────────────────── */}
      {editorTab === "social" && (
        <div className="space-y-6">
          <SocialCardPreview page={page} />

          <Card title="Personalizzazione OpenGraph (WhatsApp / Social)" icon={Share2}>
            <Field
              label="OG Title (lascia vuoto per usare il Meta Title)"
              value={page.ogTitle ?? ""}
              onChange={(ogTitle) => update({ ogTitle })}
              placeholder={page.title}
            />
            <Textarea
              label="OG Description (lascia vuoto per usare la Meta Description)"
              value={page.ogDescription ?? ""}
              onChange={(ogDescription) => update({ ogDescription })}
              rows={2}
            />
            <ImageField
              label="Immagine Anteprima Social (og:image)"
              value={page.ogImage ?? ""}
              onChange={(ogImage) => update({ ogImage })}
              helperText="Immagine mostrata quando la pagina viene condivisa su WhatsApp, Facebook o LinkedIn."
            />
          </Card>

          <div className="rounded-3xl border border-amber-200/80 bg-amber-50/40 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="flex items-center gap-2 font-serif text-lg font-semibold text-amber-950">
                  <ShieldCheck className="h-5 w-5 text-amber-700" />
                  Google Ads Policy Shield (Modalità Canvas No-Menu)
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-amber-900/80">
                  Nasconde la barra di navigazione globale e il footer su questa rotta: ideale per campagne Google Ads sanitarie così i crawler restano confinati nella sola landing conforme. Salvato su Supabase.
                </p>
              </div>
              <input
                type="checkbox"
                checked={page.canvasMode}
                onChange={(e) => update({ canvasMode: e.target.checked })}
                className="h-5 w-5 shrink-0 accent-amber-700 cursor-pointer"
              />
            </div>

            <div className="border-t border-amber-200/60 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-amber-900/70">
                Stato salvataggio: persistente su Supabase &amp; locale
              </span>
              <button
                type="button"
                onClick={() => cmsStore.reset()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal/55 hover:text-rose-600 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Ripristina default CMS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LengthBar({
  current,
  min,
  max,
}: {
  current: number;
  min: number;
  max: number;
}) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  const color =
    current === 0
      ? "bg-slate-200"
      : current >= min && current <= max
      ? "bg-emerald-500"
      : "bg-amber-500";
  return (
    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-2xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-teal-50 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-serif text-lg font-semibold text-dark-navy">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CollapsibleCard({
  title,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ElementType;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-teal-100 bg-white shadow-2xs overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-teal-50/30 transition cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-serif text-lg font-semibold text-dark-navy">{title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-teal-700 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="border-t border-teal-50 p-6 space-y-4">{children}</div>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  counter,
  customInput,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  counter?: { value: number; max: number };
  customInput?: React.ReactNode;
}) {
  const isOver = counter ? counter.value > counter.max : false;
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-teal-900">
        <span>{label}</span>
        {counter && (
          <span className={`font-mono ${isOver ? "text-rose-600 font-bold" : "text-charcoal/50"}`}>
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {customInput || (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-teal-600 focus:bg-teal-50/15"
        />
      )}
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows,
  counter,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
  counter?: { value: number; max: number };
}) {
  const isOver = counter ? counter.value > counter.max : false;
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-teal-900">
        <span>{label}</span>
        {counter && (
          <span className={`font-mono ${isOver ? "text-rose-600 font-bold" : "text-charcoal/50"}`}>
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-charcoal outline-none transition-colors focus:border-teal-600 focus:bg-teal-50/15"
      />
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helperText?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold text-teal-900">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-teal-200 bg-teal-50/70 shadow-inner">
          {value && !hasError ? (
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-[10px] text-charcoal/40">
              <ImageIcon className="h-4 w-4 opacity-50" />
              <span>No foto</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-teal-50 px-3.5 py-2.5 text-xs font-semibold text-teal-900 shadow-xs transition hover:border-teal-400 hover:bg-teal-100 cursor-pointer"
        >
          <ImageIcon className="h-3.5 w-3.5 text-teal-700" />
          Scegli dalla Libreria Media
        </button>

        <div className="min-w-[200px] flex-1">
          <input
            value={value}
            onChange={(e) => {
              setHasError(false);
              onChange(e.target.value);
            }}
            placeholder="/images/trattamenti/... o https://..."
            className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600 focus:bg-teal-50/20"
          />
        </div>
      </div>
      {helperText && <p className="mt-1 text-[11px] text-charcoal/55">{helperText}</p>}

      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(url) => {
          setHasError(false);
          onChange(url);
        }}
        currentValue={value}
      />
    </div>
  );
}
