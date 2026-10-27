"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  MapPin,
  MessageSquare,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { cmsStore } from "@/lib/cms-store";
import { useCms } from "../providers";
import type { SeoPage, TreatmentProblem, TreatmentTimelineStep } from "@/lib/types";

type PageCategory = "all" | "medicina" | "odontoiatria" | "hub";

export function SeoManager() {
  const { pages } = useCms();
  const [selectedId, setSelectedId] = useState(pages[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PageCategory>("all");

  const page = pages.find((p) => p.id === selectedId) ?? pages[0];

  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      // Filtro ricerca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.label.toLowerCase().includes(query);
        const matchPath = p.path.toLowerCase().includes(query);
        const matchKeywords = (p.keywords ?? "").toLowerCase().includes(query);
        if (!matchTitle && !matchPath && !matchKeywords) return false;
      }

      // Filtro categoria
      if (categoryFilter === "medicina") {
        return (
          p.path.startsWith("/trattamenti/") &&
          !p.path.includes("invisalign") &&
          !p.path.includes("igiene") &&
          !p.path.includes("conservativa") &&
          !p.path.includes("endodonzia")
        );
      }
      if (categoryFilter === "odontoiatria") {
        return (
          p.path === "/servizi/odontoiatria" ||
          p.path.includes("invisalign") ||
          p.path.includes("igiene") ||
          p.path.includes("conservativa") ||
          p.path.includes("endodonzia")
        );
      }
      if (categoryFilter === "hub") {
        return !p.path.startsWith("/trattamenti/");
      }

      return true;
    });
  }, [pages, searchQuery, categoryFilter]);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* ── SIDEBAR SINISTRA ─────────────────────────────────────────── */}
      <div className="h-fit rounded-3xl border border-teal-100 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]">
        <div className="border-b border-teal-100 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-teal-900">Pagine &amp; Blocchi SEO</h2>
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
              {pages.length} pagine
            </span>
          </div>

          {/* Campo di ricerca rapida */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca pagina o trattamento..."
              className="w-full rounded-xl border border-teal-200 bg-teal-50/40 py-2 pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600 focus:bg-white"
            />
          </div>

          {/* Filtri categoria */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "Tutte" },
              { id: "medicina", label: "Medicina Estetica" },
              { id: "odontoiatria", label: "Odontoiatria" },
              { id: "hub", label: "Hub" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategoryFilter(f.id as PageCategory)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  categoryFilter === f.id
                    ? "bg-dark-navy text-white"
                    : "bg-teal-50 text-teal-800 hover:bg-teal-100/70"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Elenco Pagine */}
        <div className="max-h-[75vh] divide-y divide-teal-50 overflow-y-auto">
          {filteredPages.length === 0 ? (
            <p className="p-5 text-center text-xs text-charcoal/50">Nessuna pagina trovata.</p>
          ) : (
            filteredPages.map((p) => {
              const isSelected = p.id === (page?.id ?? "");
              const isTreatment = p.path.startsWith("/trattamenti/");
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left text-sm transition-all ${
                    isSelected
                      ? "border-l-4 border-l-primary-teal bg-teal-50/90 font-medium text-teal-950"
                      : "text-charcoal/70 hover:bg-teal-50/40"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{p.label}</span>
                      {p.canvasMode && (
                        <span
                          title="Policy Shield Attivo (No-Menu Canvas)"
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] text-amber-700"
                        >
                          🛡️
                        </span>
                      )}
                    </div>
                    <span className="mt-0.5 block truncate text-[11px] text-charcoal/50">{p.path}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-teal-700 shadow-sm">
                    {isTreatment ? "8 Blocchi" : "Hub"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── EDITOR CENTRALE ─────────────────────────────────────────── */}
      {page ? <PageEditor page={page} /> : <p className="text-sm text-charcoal/60">Seleziona una pagina.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EDITOR DI PAGINA
// ─────────────────────────────────────────────────────────────────────────

function PageEditor({ page }: { page: SeoPage }) {
  const update = (patch: Partial<SeoPage>) => cmsStore.updatePage(page.id, patch);
  const isTreatment = page.path.startsWith("/trattamenti/");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Blocco 3 Card Problemi
  const problems: TreatmentProblem[] =
    page.problemsGrid && page.problemsGrid.length > 0
      ? page.problemsGrid
      : [
          { title: "", description: "" },
          { title: "", description: "" },
          { title: "", description: "" },
          { title: "", description: "" },
        ];

  const updateProblem = (idx: number, patch: Partial<TreatmentProblem>) => {
    const next = [...problems];
    next[idx] = { ...next[idx], ...patch };
    update({ problemsGrid: next });
  };

  // Blocco 4 Steps
  const timelineSteps: TreatmentTimelineStep[] =
    page.timelineSteps && page.timelineSteps.length > 0
      ? page.timelineSteps
      : [
          { stepNumber: "01", title: "", description: "" },
          { stepNumber: "02", title: "", description: "" },
          { stepNumber: "03", title: "", description: "" },
        ];

  const updateTimelineStep = (idx: number, patch: Partial<TreatmentTimelineStep>) => {
    const next = [...timelineSteps];
    next[idx] = { ...next[idx], ...patch };
    update({ timelineSteps: next });
  };

  // Blocco 7 FAQ
  const updateFaq = (index: number, patch: Partial<{ q: string; a: string }>) => {
    const faq = page.faq.map((f, i) => (i === index ? { ...f, ...patch } : f));
    update({ faq });
  };
  const addFaq = () => update({ faq: [...page.faq, { q: "", a: "" }] });
  const removeFaq = (index: number) => update({ faq: page.faq.filter((_, i) => i !== index) });

  return (
    <div className="space-y-6">
      {/* ── TESTATA INFORMATIVA & QUICK ACTIONS ────────────────────────── */}
      <div className="sticky top-20 z-20 rounded-3xl border border-teal-200/80 bg-white/95 p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                {isTreatment ? "Scheda Trattamento Clinico" : "Pagina Istituzionale / Hub"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                <Check className="h-3.5 w-3.5" /> Salvataggio automatico attivo
              </span>
            </div>
            <h1 className="mt-1 font-serif text-2xl font-bold text-teal-950">{page.label}</h1>
            <p className="text-xs text-charcoal/60">{page.path}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={page.path}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-300 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-900 transition-colors hover:bg-teal-100"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Apri live
            </Link>
          </div>
        </div>

        {/* ── BARRA DI NAVIGAZIONE RAPIDA PER BLOCCHI (Modello Silvia) ── */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-teal-100 pt-3 text-xs">
          <span className="mr-1 py-1 text-[11px] font-bold uppercase tracking-wider text-charcoal/40">
            Salta a:
          </span>
          <JumpButton label="🏷️ Testata SEO" onClick={() => scrollTo("block-testata")} />
          <JumpButton label="🖼️ Blocco 1: Hero" onClick={() => scrollTo("block-1")} />
          {isTreatment && (
            <>
              <JumpButton label="🔬 Blocco 2: Cos'è e funziona" onClick={() => scrollTo("block-2")} />
              <JumpButton label="🎯 Blocco 3: A cosa serve (4 Card)" onClick={() => scrollTo("block-3")} />
              <JumpButton label="⏱️ Blocco 4: Come si svolge (3 Step)" onClick={() => scrollTo("block-4")} />
              <JumpButton label="✨ Blocco 5: Risultati" onClick={() => scrollTo("block-5")} />
              <JumpButton label="📩 Blocco 6: Form Contatto" onClick={() => scrollTo("block-6")} />
            </>
          )}
          <JumpButton label="❓ Blocco 7: FAQ" onClick={() => scrollTo("block-7")} />
          {isTreatment && (
            <JumpButton label="📍 Blocco 8: Geo-Local Napoli" onClick={() => scrollTo("block-8")} />
          )}
          <JumpButton label="🛡️ Policy Shield" onClick={() => scrollTo("block-shield")} />
        </div>
      </div>

      {/* ── TESTATA · SEO & METADATI ─────────────────────────────────── */}
      <Card id="block-testata" badge="TESTATA" title="SEO, Titoli & Metadati per Google" icon={FileText}>
        <p className="text-xs text-charcoal/60">
          I parametri che determinano come la pagina compare su Google, nei social network e nei motori di ricerca AI.
        </p>
        <div className="mt-4 space-y-4">
          <FieldWithCounter
            label="Title (SEO) — Tag <title> del browser"
            value={page.title}
            onChange={(title) => update({ title })}
            recommendedLength={60}
          />
          <TextAreaWithCounter
            label="Meta Description — Snippet nei risultati di ricerca Google"
            value={page.metaDescription}
            onChange={(metaDescription) => update({ metaDescription })}
            recommendedLength={155}
            rows={3}
          />
          <Field
            label="Parole Chiave / Keyword (SEO) — Principale e Secondarie (separate da punto e virgola ';')"
            value={page.keywords ?? ""}
            onChange={(keywords) => update({ keywords })}
            placeholder="es. filler viso Napoli; filler labbra; filler zigomi"
          />
        </div>
      </Card>

      {/* ── BLOCCO 1 · HERO & APERTURA ───────────────────────────────── */}
      <Card id="block-1" badge="BLOCCO 1" title="Hero & Apertura Pagina" icon={Sparkles}>
        <p className="text-xs text-charcoal/60">
          La prima sezione visibile: titolo principale H1, introduzione clinica e immagine di copertina ad alto impatto.
        </p>
        <div className="mt-4 space-y-4">
          <Field label="H1 — Titolo Principale in Pagina" value={page.h1} onChange={(h1) => update({ h1 })} />
          <TextArea
            label="Sottotitolo / Tagline Introduttiva (H2 o Paragrafo Hero)"
            value={page.h2}
            onChange={(h2) => update({ h2 })}
            rows={3}
          />
          <ImageField
            label="Immagine Hero / Copertina"
            value={page.heroImage ?? ""}
            onChange={(heroImage) => update({ heroImage })}
            helperText="Formato consigliato: JPG verticale o 4:3, rapporto proporzionato con safe area centrale."
          />
          <Field
            label="Testo Pulsante CTA (Call-to-Action)"
            value={page.heroCta ?? "Richiedi una valutazione"}
            onChange={(heroCta) => update({ heroCta })}
            placeholder="Richiedi una valutazione"
          />
        </div>
      </Card>

      {/* ── SEZIONI SPECIFICHE PER SCHEDE TRATTAMENTO (Modello Silvia) ── */}
      {isTreatment && (
        <>
          {/* ── BLOCCO 2 · CHE COS'È E COME FUNZIONA? ─────────────────── */}
          <Card
            id="block-2"
            badge="BLOCCO 2"
            title="Che cos'è e come funziona?"
            icon={Layers}
          >
            <p className="text-xs text-charcoal/60">
              Spiegazione del gesto medico, della tecnologia o del principio d&apos;azione, con box di avvertenza e personalizzazione medica.
            </p>
            <div className="mt-4 space-y-4">
              <Field
                label="Titolo Sezione (H2)"
                value={page.whatIsTitle ?? ""}
                onChange={(whatIsTitle) => update({ whatIsTitle })}
                placeholder="Che cos'è ... e come funziona?"
              />
              <TextArea
                label="Testo Descrittivo (Paragrafi separati da una riga vuota)"
                value={page.whatIsDescription ?? ""}
                onChange={(whatIsDescription) => update({ whatIsDescription })}
                rows={6}
                helperText="Inserisci i paragrafi descrittivi. Lascia una riga vuota tra un paragrafo e l'altro per creare il distanziamento corretto."
              />
              <TextArea
                label="Callout Clinico (Box Informativo Azzurro di Personalizzazione Medica)"
                value={page.whatIsCallout ?? ""}
                onChange={(whatIsCallout) => update({ whatIsCallout })}
                rows={2}
                placeholder="Le formulazioni, le concentrazioni e le modalità di applicazione vengono sempre personalizzate dal medico in base al tipo di pelle, alla storia clinica e agli obiettivi definiti durante la valutazione."
              />
              <ImageField
                label="Immagine Tecnologia / Gesto Medico (Colonna Sinistra)"
                value={page.whatIsImage ?? ""}
                onChange={(whatIsImage) => update({ whatIsImage })}
                helperText="Immagine che illustra la tecnologia o il consulto clinico."
              />
            </div>
          </Card>

          {/* ── BLOCCO 3 · A COSA SERVE? (4 CARD INESTETISMI) ─────────── */}
          <Card
            id="block-3"
            badge="BLOCCO 3"
            title="A cosa serve? (4 Card Inestetismi / Indicazioni Cliniche)"
            icon={Sparkles}
          >
            <p className="text-xs text-charcoal/60">
              Griglia 2x2 con le 4 card pensate da Silvia per chiarire i diversi bisogni e le aree di applicazione.
            </p>
            <div className="mt-4 space-y-4">
              <Field
                label="Titolo Sezione (H2)"
                value={page.problemsTitle ?? ""}
                onChange={(problemsTitle) => update({ problemsTitle })}
                placeholder="A cosa serve ...?"
              />
              <TextArea
                label="Sottotitolo Introduttivo Sezione"
                value={page.problemsSubtitle ?? ""}
                onChange={(problemsSubtitle) => update({ problemsSubtitle })}
                rows={2}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {problems.map((card, idx) => (
                  <div key={idx} className="rounded-2xl border border-teal-200/80 bg-teal-50/40 p-4">
                    <span className="mb-2 inline-block rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-bold text-teal-800">
                      Card {idx + 1}
                    </span>
                    <div className="space-y-2">
                      <Field
                        label="Titolo Card (H3)"
                        value={card.title}
                        onChange={(title) => updateProblem(idx, { title })}
                        placeholder={`Titolo Card ${idx + 1}`}
                      />
                      <TextArea
                        label="Descrizione Card"
                        value={card.description}
                        onChange={(description) => updateProblem(idx, { description })}
                        rows={3}
                        placeholder="Descrizione dell'inestetismo o indicazione..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ── BLOCCO 4 · COME SI SVOLGE UNA SEDUTA? (3 STEP) ────────── */}
          <Card
            id="block-4"
            badge="BLOCCO 4"
            title="Come si svolge una seduta? (3 Step Clinici + Box Rassicurante)"
            icon={ChevronRight}
          >
            <p className="text-xs text-charcoal/60">
              La timeline in 3 passaggi (Valutazione medica, Trattamento mirato, Indicazioni e controllo) e la nota clinica finale.
            </p>
            <div className="mt-4 space-y-4">
              <Field
                label="Titolo Sezione (H2)"
                value={page.timelineTitle ?? ""}
                onChange={(timelineTitle) => update({ timelineTitle })}
                placeholder="Come si svolge una seduta di ...?"
              />

              <div className="grid gap-4 sm:grid-cols-3">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="rounded-2xl border border-teal-200/80 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 font-serif text-xs font-bold text-teal-700">
                        {step.stepNumber || `0${idx + 1}`}
                      </span>
                      <span className="text-[11px] text-charcoal/40">Step {idx + 1}</span>
                    </div>
                    <div className="space-y-2">
                      <Field
                        label="Titolo Step (H3)"
                        value={step.title}
                        onChange={(title) => updateTimelineStep(idx, { title })}
                        placeholder={`Titolo Step ${idx + 1}`}
                      />
                      <TextArea
                        label="Descrizione Step"
                        value={step.description}
                        onChange={(description) => updateTimelineStep(idx, { description })}
                        rows={4}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Box Rassicurante Finale */}
              <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
                <span className="text-xs font-semibold text-teal-900">
                  Box Rassicurante Finale (&quot;Ogni pelle è diversa&quot; / &quot;Ogni persona è diversa&quot;)
                </span>
                <div className="mt-3 grid gap-3 sm:grid-cols-[220px_1fr]">
                  <Field
                    label="Titolo Nota"
                    value={page.timelineNoteTitle ?? ""}
                    onChange={(timelineNoteTitle) => update({ timelineNoteTitle })}
                    placeholder="Ogni pelle è diversa"
                  />
                  <Field
                    label="Testo Nota Rassicurante"
                    value={page.timelineNoteText ?? ""}
                    onChange={(timelineNoteText) => update({ timelineNoteText })}
                    placeholder="Il medico valuta la risposta della pelle e definisce..."
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* ── BLOCCO 5 · QUALI RISULTATI ASPETTARSI? ─────────────────── */}
          <Card
            id="block-5"
            badge="BLOCCO 5"
            title="Quali risultati aspettarsi?"
            icon={Sparkles}
          >
            <p className="text-xs text-charcoal/60">
              Trasparenza medica sulla variabilità individuale, tempi di assestamento e gestione delle aspettative.
            </p>
            <div className="mt-4 space-y-4">
              <Field
                label="Titolo Sezione (H2)"
                value={page.resultsTitle ?? ""}
                onChange={(resultsTitle) => update({ resultsTitle })}
                placeholder="...: quali risultati aspettarsi?"
              />
              <TextArea
                label="Testo Descrittivo Risultati (Paragrafi separati da una riga vuota)"
                value={page.resultsDescription ?? ""}
                onChange={(resultsDescription) => update({ resultsDescription })}
                rows={6}
                helperText="Lascia una riga vuota tra i paragrafi per mantenere la leggibilità a blocchi."
              />
              <ImageField
                label="Immagine Risultati / Consulto Medico"
                value={page.resultsImage ?? ""}
                onChange={(resultsImage) => update({ resultsImage })}
              />
            </div>
          </Card>

          {/* ── BLOCCO 6 · FORM LEAD & CONTATTO DEDICATO ──────────────── */}
          <Card
            id="block-6"
            badge="BLOCCO 6"
            title="Form Lead & Contatto Dedicato (#lead)"
            icon={MessageSquare}
          >
            <p className="text-xs text-charcoal/60">
              Il box di contatto dedicato al trattamento per raccogliere le richieste via WhatsApp, Email o Telefono.
            </p>
            <div className="mt-4 space-y-4">
              <Field
                label="Titolo Sezione sopra il form (H2)"
                value={page.leadTitle ?? ""}
                onChange={(leadTitle) => update({ leadTitle })}
                placeholder="Hai domande sul trattamento?"
              />
              <TextArea
                label="Sottotitolo Esplicativo"
                value={page.leadSubtitle ?? ""}
                onChange={(leadSubtitle) => update({ leadSubtitle })}
                rows={2}
                placeholder="Lasciaci i tuoi contatti. Il team Cocoora ti ricontatterà per fornirti maggiori informazioni..."
              />
              <Field
                label="Testo Pulsante Invio Form (CTA)"
                value={page.leadCta ?? "Richiedi ora"}
                onChange={(leadCta) => update({ leadCta })}
                placeholder="Richiedi ora"
              />
            </div>
          </Card>
        </>
      )}

      {/* ── BLOCCO 7 · DOMANDE FREQUENTI (FAQ) ───────────────────────── */}
      <Card id="block-7" badge="BLOCCO 7" title="Domande Frequenti (FAQ) & Schema.org" icon={HelpCircle}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-charcoal/60">
            Visibili come accordion in pagina e convertite automaticamente in FAQPage Schema.org per AI e Google GEO.
          </p>
          <button
            type="button"
            onClick={addFaq}
            className="inline-flex items-center gap-1.5 rounded-full bg-dark-navy px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-900"
          >
            <Plus className="h-3.5 w-3.5" /> Aggiungi FAQ
          </button>
        </div>

        <div className="space-y-3">
          {page.faq.length === 0 && (
            <p className="rounded-2xl border border-dashed border-teal-200 p-6 text-center text-xs text-charcoal/50">
              Nessuna FAQ presente. Clicca su &quot;Aggiungi FAQ&quot; per inserirne una.
            </p>
          )}
          {page.faq.map((f, i) => (
            <div key={i} className="rounded-2xl border border-teal-100 bg-teal-50/20 p-4 transition-all">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <input
                    value={f.q}
                    onChange={(e) => updateFaq(i, { q: e.target.value })}
                    placeholder="Domanda (H3)"
                    className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-sm font-medium outline-none focus:border-teal-600"
                  />
                  <textarea
                    value={f.a}
                    onChange={(e) => updateFaq(i, { a: e.target.value })}
                    placeholder="Risposta chiara, medica e rassicurante..."
                    rows={2}
                    className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-teal-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  title="Elimina questa FAQ"
                  className="rounded-lg p-1.5 text-charcoal/40 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── BLOCCO 8 · PRESENZA TERRITORIALE NAPOLI (GEO-LOCAL SEO) ──── */}
      {isTreatment && (
        <Card id="block-8" badge="BLOCCO 8" title="Presenza Territoriale Napoli (Geo-Local SEO)" icon={MapPin}>
          <p className="text-xs text-charcoal/60">
            Il blocco finale geolocalizzato su Napoli, Via De Bonis (Posillipo/Fuorigrotta) per rafforzare il posizionamento locale.
          </p>
          <div className="mt-4 space-y-4">
            <Field
              label="Titolo Sezione Locale (H2)"
              value={page.localSeoTitle ?? ""}
              onChange={(localSeoTitle) => update({ localSeoTitle })}
              placeholder="... a Napoli"
            />
            <TextArea
              label="Testo Descrittivo Presenza Territoriale Napoli"
              value={page.localSeoDescription ?? ""}
              onChange={(localSeoDescription) => update({ localSeoDescription })}
              rows={4}
              helperText="Includi i riferimenti al centro Cocoora, accessibilità in auto e mezzi pubblici."
            />
            <Field
              label="Testo Bottone CTA Sezione Locale"
              value={page.localSeoCta ?? "Richiedi una valutazione"}
              onChange={(localSeoCta) => update({ localSeoCta })}
              placeholder="Richiedi una valutazione"
            />
          </div>
        </Card>
      )}

      {/* ── POLICY SHIELD · GOOGLE ADS CANVAS MODE ────────────────────── */}
      <div id="block-shield" className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                  SHIELD
                </span>
                <h3 className="mt-1 font-serif text-lg font-bold text-amber-950">
                  Policy Shield · Canvas / No-Menu Mode
                </h3>
                <p className="mt-1 text-xs text-amber-800/80">
                  Quando attivato, questa pagina non renderizza l&apos;header di navigazione e il mega menu con tutti i trattamenti,
                  impedendo ai bot di Google Ads di scansionare termini sensibili non approvati.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={page.canvasMode}
                onClick={() => update({ canvasMode: !page.canvasMode })}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                  page.canvasMode ? "bg-teal-600" : "bg-charcoal/20"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    page.canvasMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTI UI RIUTILIZZABILI
// ─────────────────────────────────────────────────────────────────────────

function Card({
  id,
  badge,
  title,
  icon: Icon,
  children,
}: {
  id?: string;
  badge: string;
  title: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-48 rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(3,53,75,0.35)]"
    >
      <div className="mb-4 flex items-center gap-2.5 border-b border-teal-50 pb-3">
        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800">
          {badge}
        </span>
        <h3 className="font-serif text-lg font-bold text-teal-950">{title}</h3>
        <Icon className="ml-auto h-4 w-4 text-teal-600" />
      </div>
      {children}
    </div>
  );
}

function JumpButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-teal-200 bg-white px-2.5 py-1 text-[11px] font-medium text-teal-900 shadow-sm transition-all hover:border-teal-400 hover:bg-teal-50 active:scale-95"
    >
      {label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helperText?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-teal-900">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600 focus:bg-teal-50/20"
      />
      {helperText && <p className="mt-1 text-[11px] text-charcoal/50">{helperText}</p>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  helperText?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-teal-900">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600 focus:bg-teal-50/20"
      />
      {helperText && <p className="mt-1 text-[11px] text-charcoal/50">{helperText}</p>}
    </label>
  );
}

function FieldWithCounter({
  label,
  value,
  onChange,
  recommendedLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  recommendedLength: number;
}) {
  const count = value.length;
  const isOver = count > recommendedLength + 10;
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-teal-900">{label}</span>
        <span
          className={`text-[11px] font-medium ${
            isOver ? "text-amber-600" : "text-charcoal/50"
          }`}
        >
          {count}/{recommendedLength} caratteri
        </span>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-teal-600 focus:bg-teal-50/20"
      />
    </label>
  );
}

function TextAreaWithCounter({
  label,
  value,
  onChange,
  recommendedLength,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  recommendedLength: number;
  rows?: number;
}) {
  const count = value.length;
  const isOver = count > recommendedLength + 15;
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-teal-900">{label}</span>
        <span
          className={`text-[11px] font-medium ${
            isOver ? "text-amber-600" : "text-charcoal/50"
          }`}
        >
          {count}/{recommendedLength} caratteri
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-charcoal outline-none transition-colors focus:border-teal-600 focus:bg-teal-50/20"
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

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold text-teal-900">{label}</span>
      <div className="flex items-center gap-3">
        {/* Thumbnail Preview */}
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

        {/* Input */}
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => {
              setHasError(false);
              onChange(e.target.value);
            }}
            placeholder="/images/trattamenti/..."
            className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600 focus:bg-teal-50/20"
          />
          {helperText && <p className="mt-1 text-[11px] text-charcoal/50">{helperText}</p>}
        </div>
      </div>
    </div>
  );
}
