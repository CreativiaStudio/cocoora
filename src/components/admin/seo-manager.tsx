"use client";

import { useState } from "react";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { cmsStore } from "@/lib/cms-store";
import { useCms } from "../providers";
import type { SeoPage } from "@/lib/types";

export function SeoManager() {
  const { pages } = useCms();
  const [selectedId, setSelectedId] = useState(pages[0]?.id ?? "");
  const page = pages.find((p) => p.id === selectedId);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="h-fit overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]">
        <div className="border-b border-teal-100 px-5 py-4">
          <h2 className="font-serif text-lg font-semibold text-teal-900">Pagine</h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {pages.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`flex w-full items-center justify-between gap-2 px-5 py-3 text-left text-sm transition-colors ${
                p.id === selectedId ? "bg-teal-50 text-teal-900" : "text-charcoal/70 hover:bg-teal-50/50"
              }`}
            >
              <span className="truncate">{p.label}</span>
              {p.canvasMode && <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />}
            </button>
          ))}
        </div>
      </div>

      {page ? <PageEditor page={page} /> : <p className="text-sm text-charcoal/60">Seleziona una pagina.</p>}
    </div>
  );
}

function PageEditor({ page }: { page: SeoPage }) {
  const update = (patch: Partial<SeoPage>) => cmsStore.updatePage(page.id, patch);

  const updateFaq = (index: number, patch: Partial<{ q: string; a: string }>) => {
    const faq = page.faq.map((f, i) => (i === index ? { ...f, ...patch } : f));
    update({ faq });
  };

  const addFaq = () => update({ faq: [...page.faq, { q: "", a: "" }] });
  const removeFaq = (index: number) =>
    update({ faq: page.faq.filter((_, i) => i !== index) });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-teal-900">{page.label}</h2>
            <p className="text-xs text-charcoal/55">{page.path}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Field label="Title (SEO)" value={page.title} onChange={(title) => update({ title })} />
          <TextArea
            label="Meta Description"
            value={page.metaDescription}
            onChange={(metaDescription) => update({ metaDescription })}
          />
          <Field
            label="Parole Chiave / Keyword (SEO)"
            value={page.keywords ?? ""}
            onChange={(keywords) => update({ keywords })}
          />
          <Field
            label="Immagine Hero / Copertina (Percorso o URL)"
            value={page.heroImage ?? ""}
            onChange={(heroImage) => update({ heroImage })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="H1" value={page.h1} onChange={(h1) => update({ h1 })} />
            <Field label="H2" value={page.h2} onChange={(h2) => update({ h2 })} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-amber-900">Policy Shield · Canvas / No-Menu Mode</h3>
                <p className="mt-1 text-sm text-amber-800/80">
                  Quando attivo, la pagina non renderizza l&apos;header e il menu principale,
                  così i crawler di Google Ads non leggono parole sensibili presenti nel menu.
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

      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-teal-900">FAQ</h3>
            <p className="text-xs text-charcoal/55">
              Visibili in pagina e generate come FAQ Schema.org per AI / GEO.
            </p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-teal px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-dark-navy"
          >
            <Plus className="h-4 w-4" /> Aggiungi
          </button>
        </div>

        <div className="space-y-3">
          {page.faq.length === 0 && (
            <p className="text-sm text-charcoal/60">Nessuna FAQ. Aggiungine una.</p>
          )}
          {page.faq.map((f, i) => (
            <div key={i} className="rounded-2xl border border-teal-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    value={f.q}
                    onChange={(e) => updateFaq(i, { q: e.target.value })}
                    placeholder="Domanda"
                    className="w-full rounded-lg border border-teal-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  />
                  <textarea
                    value={f.a}
                    onChange={(e) => updateFaq(i, { a: e.target.value })}
                    placeholder="Risposta"
                    rows={2}
                    className="w-full rounded-lg border border-teal-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="text-charcoal/40 transition-colors hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-teal-900">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-teal-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-600"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-teal-900">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-teal-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-600"
      />
    </label>
  );
}
