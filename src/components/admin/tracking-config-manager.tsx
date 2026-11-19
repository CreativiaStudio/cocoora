"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cloud,
  ExternalLink,
  Globe,
  Megaphone,
  Save,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { TrackingConfig } from "@/lib/tracking-config";

function validateTagFormat(
  kind: "ga" | "gtm" | "ads" | "pixel" | "gsc",
  value: string
): { state: "empty" | "valid" | "warn"; message: string } {
  const v = (value || "").trim();
  if (!v) return { state: "empty", message: "Non configurato" };
  if (kind === "ga") {
    return /^G-[A-Z0-9]{6,}$/i.test(v)
      ? { state: "valid", message: "Formato GA4 valido" }
      : { state: "warn", message: "Atteso formato G-XXXXXXXXXX" };
  }
  if (kind === "gtm") {
    return /^GTM-[A-Z0-9]{5,}$/i.test(v)
      ? { state: "valid", message: "Formato GTM valido" }
      : { state: "warn", message: "Atteso formato GTM-XXXXXXX" };
  }
  if (kind === "ads") {
    return /^AW-[0-9]{6,}$/i.test(v)
      ? { state: "valid", message: "Formato Google Ads valido" }
      : { state: "warn", message: "Atteso formato AW-123456789" };
  }
  if (kind === "pixel") {
    return /^[0-9]{10,20}$/.test(v)
      ? { state: "valid", message: "ID numerico valido" }
      : { state: "warn", message: "Inserisci solo le cifre dell'ID Pixel" };
  }
  return { state: "valid", message: "Token GSC rilevato (iniettato SSR)" };
}

export function TrackingConfigManager({
  onSaved,
}: {
  onSaved?: () => void;
}) {
  const [config, setConfig] = useState<TrackingConfig>({
    gaMeasurementId: "",
    gtmContainerId: "",
    gscVerificationTag: "",
    metaPixelId: "",
    googleAdsId: "",
    metaCapiAccessToken: "",
    metaCapiTestEventCode: "",
    serverTelemetryEnabled: true,
    updatedAt: "",
    updatedBy: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [storageLabel, setStorageLabel] = useState("Supabase Cloud");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/tracking-config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.config) {
          setConfig((prev) => ({ ...prev, ...d.config }));
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
          updatedBy: "Marco & Silvia / Agenzia SEO",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Errore nel salvataggio della configurazione.");
      } else {
        setConfig((prev) => ({ ...prev, ...data.config }));
        setStorageLabel(
          data.storage === "site_cms_config"
            ? "Supabase (site_cms_config)"
            : "Supabase Cloud"
        );
        setSavedSuccess(true);
        onSaved?.();
        setTimeout(() => setSavedSuccess(false), 4500);
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
        Caricamento impostazioni tracciamento da Supabase...
      </div>
    );
  }

  const gscStatus = validateTagFormat("gsc", config.gscVerificationTag);
  const gaStatus = validateTagFormat("ga", config.gaMeasurementId);
  const gtmStatus = validateTagFormat("gtm", config.gtmContainerId);
  const adsStatus = validateTagFormat("ads", config.googleAdsId);
  const pixelStatus = validateTagFormat("pixel", config.metaPixelId);

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-teal-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Search className="h-5 w-5 text-teal-700" />
            <h3 className="font-serif text-lg font-bold text-teal-950">
              Impostazioni SEO &amp; ID Tracciamento Agenzia
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
              <Cloud className="h-3 w-3" /> Persistenza {storageLabel}
            </span>
          </div>
          <p className="mt-1 text-xs text-charcoal/70">
            Pannello condiviso per Marco e Silvia: gli ID salvati vengono serviti pubblicamente senza 401 e rispettano Google Consent Mode v2.
          </p>
        </div>

        {config.updatedAt && (
          <span className="text-[11px] text-charcoal/55 font-mono">
            Aggiornato: {new Date(config.updatedAt).toLocaleString("it-IT")} (
            {config.updatedBy || "Silvia"})
          </span>
        )}
      </div>

      {savedSuccess && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>
            Configurazione salvata su Supabase e propagata istantaneamente sul sito pubblico!
          </span>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Google Search Console */}
          <div className="sm:col-span-2 rounded-xl border border-teal-100 bg-teal-50/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-teal-700" />
                Google Search Console — Verifica Proprietà Sito
              </label>
              <div className="flex items-center gap-3">
                <FormatBadge status={gscStatus} />
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
            </div>
            <p className="mt-1 text-[11px] text-charcoal/70 leading-relaxed">
              Incolla il token o l&apos;intero tag{" "}
              <code>&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code>.
              Viene iniettato <strong>direttamente lato server (SSR)</strong> nell&apos;HTML di tutte le pagine.
            </p>
            <input
              type="text"
              value={config.gscVerificationTag}
              onChange={(e) => setConfig({ ...config, gscVerificationTag: e.target.value })}
              placeholder="es. a1b2c3d4e5f6g7h8..."
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/35 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Google Analytics 4 */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/20 p-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-teal-700" />
                Google Analytics 4 (Measurement ID)
              </label>
              <FormatBadge status={gaStatus} />
            </div>
            <p className="mt-1 text-[11px] text-charcoal/70">
              Formato <code>G-XXXXXXXXXX</code>. Legato al consenso <strong>Statistiche</strong> (<code>analytics_storage</code>) e traccia anche i cambi pagina SPA.
            </p>
            <input
              type="text"
              value={config.gaMeasurementId}
              onChange={(e) => setConfig({ ...config, gaMeasurementId: e.target.value })}
              placeholder="es. G-ABC123XYZ"
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/35 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Google Tag Manager */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/20 p-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-700" />
                Google Tag Manager (Container ID)
              </label>
              <FormatBadge status={gtmStatus} />
            </div>
            <p className="mt-1 text-[11px] text-charcoal/70">
              Formato <code>GTM-XXXXXXX</code>. Inizializza automaticamente Consent Mode v2 (<code>default: denied</code> → <code>update</code>).
            </p>
            <input
              type="text"
              value={config.gtmContainerId}
              onChange={(e) => setConfig({ ...config, gtmContainerId: e.target.value })}
              placeholder="es. GTM-N5L3K9P"
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/35 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Google Ads */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/20 p-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <Megaphone className="h-4 w-4 text-teal-700" />
                Google Ads Conversion ID
              </label>
              <FormatBadge status={adsStatus} />
            </div>
            <p className="mt-1 text-[11px] text-charcoal/70">
              Formato <code>AW-XXXXXXXXX</code>. Attivo solo con consenso <strong>Marketing</strong> (<code>ad_storage</code>) se non gestito via GTM.
            </p>
            <input
              type="text"
              value={config.googleAdsId}
              onChange={(e) => setConfig({ ...config, googleAdsId: e.target.value })}
              placeholder="es. AW-1122334455"
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/35 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Meta Pixel */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/20 p-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-teal-950">
                Meta Pixel ID (Instagram / Facebook)
              </label>
              <FormatBadge status={pixelStatus} />
            </div>
            <p className="mt-1 text-[11px] text-charcoal/70">
              Solo cifre (es. <code>123456789012345</code>). Rispetta <code>ad_storage = granted</code> e invia <code>PageView</code> su ogni rotta.
            </p>
            <input
              type="text"
              value={config.metaPixelId}
              onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
              placeholder="es. 987654321012345"
              className="mt-2.5 w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/35 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Meta Conversions API (CAPI Server-Side · Deduplicazione event_id) */}
          <div className="sm:col-span-2 rounded-xl border border-teal-200/80 bg-teal-50/35 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-700" />
                Meta Conversions API (CAPI Server-Side · Deduplicazione event_id)
              </label>
              {config.metaCapiAccessToken ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Token CAPI attivo
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  Opzionale (consigliato per iOS/AdBlocker)
                </span>
              )}
            </div>
            <p className="text-[11px] text-charcoal/70 leading-relaxed">
              Invia lato server tramite <code className="font-mono">/api/tracking/capi</code> gli eventi <code className="font-mono">Lead</code>, <code className="font-mono">ViewContent</code>, <code className="font-mono">AddToCart</code>, <code className="font-mono">InitiateCheckout</code> e <code className="font-mono">Purchase</code> con hash SHA-256 e lo stesso <code className="font-mono">event_id</code> del DataLayer. Mai esposto sulle API pubbliche.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <span className="mb-1 block text-[11px] font-semibold text-teal-900">
                  Meta CAPI Access Token (System User Token)
                </span>
                <input
                  type="password"
                  value={config.metaCapiAccessToken ?? ""}
                  onChange={(e) =>
                    setConfig({ ...config, metaCapiAccessToken: e.target.value })
                  }
                  placeholder="EAA..."
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/35 focus:border-teal-600 focus:outline-none"
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-semibold text-teal-900">
                  Test Event Code (opzionale per Events Manager)
                </span>
                <input
                  type="text"
                  value={config.metaCapiTestEventCode ?? ""}
                  onChange={(e) =>
                    setConfig({ ...config, metaCapiTestEventCode: e.target.value })
                  }
                  placeholder="es. TEST12345 (lascia vuoto in produzione)"
                  className="w-full rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-mono text-teal-950 placeholder-charcoal/35 focus:border-teal-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Consent Mode Info */}
        <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3.5 text-[11px] leading-relaxed text-sky-950">
          <strong>Nota Consent Mode v2 &amp; GTM:</strong> se inserisci sia GTM che GA4/Ads, GTM prende la regia di <code>gtag</code> evitando doppi conteggi, mentre il Meta Pixel può restare gestito direttamente qui (o dentro GTM lasciando vuoto questo campo).
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-teal-100 pt-4">
          <span className="text-[11px] text-teal-800/80">
            Gli ID vengono serviti subito via <code className="font-mono">/api/tracking-config</code> e SSR <code className="font-mono">&lt;head&gt;</code>.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Salvataggio su Supabase..." : "Salva Configurazione"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

function FormatBadge({
  status,
}: {
  status: { state: "empty" | "valid" | "warn"; message: string };
}) {
  if (status.state === "empty") {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
        {status.message}
      </span>
    );
  }
  if (status.state === "warn") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
        <AlertTriangle className="h-2.5 w-2.5" />
        {status.message}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
      <CheckCircle2 className="h-2.5 w-2.5" />
      {status.message}
    </span>
  );
}
