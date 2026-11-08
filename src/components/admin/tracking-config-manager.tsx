"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  ExternalLink,
  Globe,
  HelpCircle,
  Save,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { TrackingConfig } from "@/lib/tracking-config";

export function TrackingConfigManager() {
  const [config, setConfig] = useState<TrackingConfig>({
    gaMeasurementId: "",
    gtmContainerId: "",
    gscVerificationTag: "",
    metaPixelId: "",
    serverTelemetryEnabled: true,
    updatedAt: "",
    updatedBy: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/tracking-config")
      .then((r) => r.json())
      .then((d) => {
        if (d?.config) {
          setConfig(d.config);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/tracking-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          updatedBy: "Silvia / Agenzia SEO",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Errore nel salvataggio della configurazione.");
      } else {
        setConfig(data.config);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch {
      setError("Errore di rete durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-xs text-xs text-charcoal/60">
        Caricamento impostazioni tracciamento in corso...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-teal-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-teal-700" />
            <h3 className="font-serif text-lg font-bold text-teal-950">
              Impostazioni SEO &amp; ID Tracciamento Agenzia
            </h3>
          </div>
          <p className="mt-1 text-xs text-charcoal/70">
            Pannello riservato a Silvia e all&apos;agenzia per inserire gli identificatori di Google
            Search Console, Analytics 4 e Google Tag Manager.
          </p>
        </div>

        {config.updatedAt && (
          <span className="text-[11px] text-charcoal/50 font-mono">
            Ultima modifica: {new Date(config.updatedAt).toLocaleDateString("it-IT")} (
            {config.updatedBy || "Silvia"})
          </span>
        )}
      </div>

      {savedSuccess && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Configurazione salvata con successo e attiva sul sito pubblico!</span>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Google Search Console */}
          <div className="sm:col-span-2 rounded-xl border border-teal-50 bg-teal-50/30 p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-teal-700" />
                Google Search Console — Verifica Proprietà Sito
              </label>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-teal-700 hover:underline"
              >
                <span>Apri Search Console</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="mt-1 text-[11px] text-charcoal/70 leading-relaxed">
              Incolla il codice di verifica HTML o l&apos;intero tag meta (es.{" "}
              <code>google-site-verification=...</code> oppure <code>&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code>).
              Verrà iniettato automaticamente nel <code>&lt;head&gt;</code> di tutte le pagine.
            </p>
            <input
              type="text"
              value={config.gscVerificationTag}
              onChange={(e) => setConfig({ ...config, gscVerificationTag: e.target.value })}
              placeholder="es. a1b2c3d4e5f6g7h8..."
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/30 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Google Analytics 4 */}
          <div className="rounded-xl border border-teal-50 bg-teal-50/20 p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-teal-700" />
                Google Analytics 4 (Measurement ID)
              </label>
            </div>
            <p className="mt-1 text-[11px] text-charcoal/70">
              Formato standard <code>G-XXXXXXXXXX</code>. Verrà eseguito nel rispetto di Google Consent Mode v2.
            </p>
            <input
              type="text"
              value={config.gaMeasurementId}
              onChange={(e) => setConfig({ ...config, gaMeasurementId: e.target.value })}
              placeholder="es. G-ABC123XYZ"
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/30 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Google Tag Manager */}
          <div className="rounded-xl border border-teal-50 bg-teal-50/20 p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-700" />
                Google Tag Manager (Container ID)
              </label>
            </div>
            <p className="mt-1 text-[11px] text-charcoal/70">
              Formato standard <code>GTM-XXXXXXX</code>. Permette a Silvia di gestire tag personalizzati.
            </p>
            <input
              type="text"
              value={config.gtmContainerId}
              onChange={(e) => setConfig({ ...config, gtmContainerId: e.target.value })}
              placeholder="es. GTM-N5L3K9P"
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/30 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Meta Pixel (Opzionale) */}
          <div className="sm:col-span-2 rounded-xl border border-teal-50 bg-teal-50/20 p-4">
            <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
              <span>Meta Pixel ID (Opzionale)</span>
            </label>
            <p className="mt-1 text-[11px] text-charcoal/70">
              ID numerico del Pixel Meta (es. <code>123456789012345</code>) per tracciare campagne Instagram.
            </p>
            <input
              type="text"
              value={config.metaPixelId}
              onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
              placeholder="es. 987654321012345"
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/30 focus:border-teal-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between border-t border-teal-100 pt-4">
          <span className="text-[11px] text-teal-800/80">
            Gli ID inseriti si sincronizzano istantaneamente con il sito e rispettano il banner cookie.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Salvataggio..." : "Salva Configurazione"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
