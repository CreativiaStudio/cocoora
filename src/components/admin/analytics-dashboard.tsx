"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  Eye,
  FileCode2,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import type {
  TelemetryAggregatedStats,
  TelemetryDiagnostics,
} from "@/lib/telemetry-store";
import { TrackingConfigManager } from "./tracking-config-manager";

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<TelemetryAggregatedStats | null>(null);
  const [diagnostics, setDiagnostics] = useState<TelemetryDiagnostics | null>(null);
  const [publicEndpointOk, setPublicEndpointOk] = useState<boolean | null>(null);
  const [metaCapiConfigured, setMetaCapiConfigured] = useState<boolean>(false);
  const [gscStatusLabel, setGscStatusLabel] = useState<string>("Verifica...");
  const [consentModeOk, setConsentModeOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const checkPublicEndpoint = useCallback(() => {
    fetch("/api/tracking-config", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setPublicEndpointOk(Boolean(data?.ok));
        setMetaCapiConfigured(Boolean(data?.config?.metaCapiConfigured));
        const cfg = data?.config;
        if (cfg?.gscVerificationMethod === "dns_txt") {
          setGscStatusLabel("Connesso (DNS TXT)");
        } else if (cfg?.gscVerificationTag) {
          setGscStatusLabel("Connesso (Meta SSR)");
        } else {
          setGscStatusLabel("Non configurato");
        }
      })
      .catch(() => setPublicEndpointOk(false));

    if (typeof window !== "undefined") {
      const dl = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      const hasDefault = dl.some((entry) => {
        if (!entry || typeof entry !== "object") return false;
        const arrLike = entry as ArrayLike<unknown>;
        return arrLike[0] === "consent" && arrLike[1] === "default";
      });
      setConsentModeOk(hasDefault || Boolean(window.__cocooraConsentInitialized));
    }
  }, []);

  const fetchStats = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/analytics-stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.stats) setStats(d.stats);
        if (d?.diagnostics) setDiagnostics(d.diagnostics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStats();
    checkPublicEndpoint();
  }, [fetchStats, checkPublicEndpoint]);

  const handleSendTestEvent = async () => {
    setTestingPing(true);
    setPingResult(null);
    try {
      const res = await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "page_view",
          pathname: "/",
          metadata: { source: "admin_diagnostica_live" },
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setPingResult({
          ok: false,
          message:
            data?.error ||
            `Errore HTTP ${res.status} durante la registrazione dell'evento.`,
        });
      } else {
        setPingResult({
          ok: true,
          message:
            "Evento di test registrato nel Cloud! I KPI qui sotto sono aggiornati.",
        });
        fetchStats();
      }
    } catch {
      setPingResult({
        ok: false,
        message: "Errore di rete durante l'invio dell'evento test.",
      });
    } finally {
      setTestingPing(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${remainder}s`;
    return `${mins}m ${remainder}s`;
  };

  return (
    <div className="space-y-8">
      {/* 1. Diagnostica Tag & Test Evento Live */}
      <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-teal-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-700" />
              <h3 className="font-serif text-lg font-bold text-teal-950">
                Diagnostica Connessione &amp; Test Tracciamento Live
              </h3>
            </div>
            <p className="mt-1 text-xs text-charcoal/70">
              Verifica in diretta che il Database Cloud, l&apos;endpoint pubblico dei tag, Consent Mode v2 e la Sitemap funzionino senza blocchi.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSendTestEvent}
            disabled={testingPing}
            className="inline-flex items-center gap-2 rounded-xl bg-dark-navy px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-900 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
          >
            <Zap className={`h-3.5 w-3.5 ${testingPing ? "animate-pulse" : ""}`} />
            <span>
              {testingPing ? "Invio test in corso..." : "⚡ Invia Evento Test Live"}
            </span>
          </button>
        </div>

        {pingResult && (
          <div
            className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${
              pingResult.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {pingResult.ok ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{pingResult.message}</span>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Database Cloud */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-950 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-teal-700" />
                Database Cloud
              </span>
              {diagnostics?.hasServiceRoleKey && !diagnostics?.dbError ? (
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Attivo
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Verifica Key
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-charcoal/70">
              {diagnostics?.dbError
                ? `Errore: ${diagnostics.dbError}`
                : diagnostics?.totalRawEvents
                ? `${diagnostics.totalRawEvents} eventi salvati · Ultimo: ${
                    diagnostics.lastEventAt
                      ? new Date(diagnostics.lastEventAt).toLocaleString("it-IT")
                      : "n/d"
                  }`
                : "Tabella pronta (0 eventi: invia un Test Live o visita il sito pubblico)"}
            </p>
          </div>

          {/* 2. Endpoint Pubblico Tracking */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-950 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-teal-700" />
                Endpoint Pubblico
              </span>
              {publicEndpointOk === true ? (
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  200 OK
                </span>
              ) : publicEndpointOk === false ? (
                <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                  Errore
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                  Check...
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-charcoal/70">
              <code className="font-mono">/api/tracking-config</code> accessibile senza 401 a visitatori e bot Google.
            </p>
          </div>

          {/* 3. Consent Mode v2 */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-950 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
                Consent Mode v2 &amp; CAPI
              </span>
              {consentModeOk ? (
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Verificato
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Controllo...
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-charcoal/70">
              <code className="font-mono">consent default</code> in <code className="font-mono">&lt;head&gt;</code> · Meta CAPI:{" "}
              <strong>{metaCapiConfigured ? "Attivo" : "Da attivare con Token"}</strong>.
            </p>
          </div>

          {/* 4. Sitemap, Robots & Search Console */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-950 flex items-center gap-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-teal-700" />
                Sitemap, Robots &amp; GSC
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Online
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-charcoal/70">
              Search Console: <strong>{gscStatusLabel}</strong>
            </p>
            <div className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold text-teal-800">
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="inline-flex items-center gap-1 hover:underline"
              >
                sitemap.xml <ExternalLink className="h-2.5 w-2.5" />
              </Link>
              <Link
                href="/robots.txt"
                target="_blank"
                className="inline-flex items-center gap-1 hover:underline"
              >
                robots.txt <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Box ID Tracciamento per Marco & Silvia */}
      <TrackingConfigManager onSaved={checkPublicEndpoint} />

      {/* 3. Monitoraggio Server-Side Live */}
      <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-teal-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-700" />
              <h3 className="font-serif text-lg font-bold text-teal-950">
                Monitoraggio Server-Side &amp; Metriche di Navigazione
              </h3>
            </div>
            <p className="mt-1 text-xs text-charcoal/70">
              Dati proprietari raccolti su <code className="font-mono">/api/analytics/track</code> nel pieno rispetto del GDPR (esclude /admin, /segreteria e /medico).
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStats}
            className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-xs font-semibold text-teal-800 transition hover:bg-teal-100 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Aggiorna Dati</span>
          </button>
        </div>

        {stats && (
          <div className="mt-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
                    Visite Totali
                  </span>
                  <Eye className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {stats.totalPageViews.toLocaleString("it-IT")}
                </p>
                <p className="mt-1 text-[11px] text-teal-700 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span>Pagine viste pubbliche</span>
                </p>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
                    Visitatori Unici
                  </span>
                  <Users className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {stats.uniqueVisitors.toLocaleString("it-IT")}
                </p>
                <p className="mt-1 text-[11px] text-charcoal/60">
                  Hash univoci GDPR
                </p>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
                    Permanenza Media
                  </span>
                  <Clock className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {formatSeconds(stats.avgDurationSeconds)}
                </p>
                <p className="mt-1 text-[11px] text-emerald-700">
                  Dwell time su pagina
                </p>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
                    Click su CTA
                  </span>
                  <MousePointerClick className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {stats.ctaClicks.reduce((sum, c) => sum + c.count, 0)}
                </p>
                <p className="mt-1 text-[11px] text-teal-700">
                  Club, WhatsApp, Chiamate
                </p>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
                    Lead &amp; Richieste
                  </span>
                  <UserPlus className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {stats.leadsCount}
                </p>
                <p className="mt-1 text-[11px] text-emerald-700">
                  Form contatti &amp; trattamenti
                </p>
              </div>
            </div>

            {/* Griglia Pagine, Funnel & Click CTA */}
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7 rounded-2xl border border-teal-100 bg-white p-5 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-950">
                  Pagine Più Visitate &amp; Tempo di Permanenza
                </h4>
                <div className="mt-4 divide-y divide-teal-50 overflow-hidden rounded-xl border border-teal-100 text-xs">
                  <div className="flex items-center justify-between bg-teal-50/60 p-2.5 font-semibold text-teal-900">
                    <span>Percorso Pagina</span>
                    <div className="flex items-center gap-6">
                      <span>Visualizzazioni</span>
                      <span className="w-16 text-right">Tempo</span>
                    </div>
                  </div>
                  {stats.topPages.length === 0 ? (
                    <div className="p-6 text-center text-xs text-charcoal/55">
                      Nessuna pagina pubblica registrata finora. Usa &quot;⚡ Invia Evento Test Live&quot; qui sopra o naviga sul sito pubblico.
                    </div>
                  ) : (
                    stats.topPages.map((p) => (
                      <div
                        key={p.path}
                        className="flex items-center justify-between p-2.5 hover:bg-teal-50/30 transition"
                      >
                        <span className="font-mono text-teal-900 truncate max-w-[200px] sm:max-w-[280px]">
                          {p.path}
                        </span>
                        <div className="flex items-center gap-6">
                          <span className="font-semibold text-charcoal/80">{p.views}</span>
                          <span className="w-16 text-right text-charcoal/60 font-mono">
                            {formatSeconds(p.avgDuration)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                {/* Funnel Percorsi Club */}
                <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-2xs">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-950">
                    <ShoppingBag className="h-3.5 w-3.5 text-teal-700" />
                    Funnel Percorsi Cocoora Club
                  </h4>
                  <div className="mt-3 grid grid-cols-3 gap-2.5 text-center">
                    <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3">
                      <p className="font-serif text-xl font-bold text-teal-950">
                        {stats.ecommerce.cartAdds}
                      </p>
                      <p className="text-[10px] text-charcoal/65">Carrello</p>
                    </div>
                    <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3">
                      <p className="font-serif text-xl font-bold text-teal-950">
                        {stats.ecommerce.checkouts}
                      </p>
                      <p className="text-[10px] text-charcoal/65">Checkout</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                      <p className="font-serif text-xl font-bold text-emerald-800">
                        {stats.ecommerce.purchases}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold">Acquisti</p>
                    </div>
                  </div>
                </div>

                {/* Click CTA */}
                <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-950">
                    Punti di Conversione &amp; Click
                  </h4>
                  <div className="mt-3 space-y-2">
                    {stats.ctaClicks.length === 0 ? (
                      <p className="text-center py-4 text-xs text-charcoal/50">
                        Nessun clic su CTA registrato al momento.
                      </p>
                    ) : (
                      stats.ctaClicks.map((cta) => (
                        <div
                          key={cta.id}
                          className="flex items-center justify-between rounded-xl border border-teal-50 bg-teal-50/20 p-2.5 text-xs"
                        >
                          <span className="font-medium text-teal-950 truncate max-w-[180px]">
                            {cta.label}
                          </span>
                          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 font-bold text-teal-900">
                            {cta.count} click
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Dispositivi */}
                <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-950">
                    Ripartizione Dispositivi
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3 text-center">
                      <Smartphone className="mx-auto h-4 w-4 text-teal-700" />
                      <p className="mt-1 font-bold text-teal-950">
                        {stats.deviceBreakdown.mobile}
                      </p>
                      <p className="text-[10px] text-charcoal/60">Smartphone &amp; Tablet</p>
                    </div>
                    <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3 text-center">
                      <ArrowUpRight className="mx-auto h-4 w-4 text-teal-700" />
                      <p className="mt-1 font-bold text-teal-950">
                        {stats.deviceBreakdown.desktop}
                      </p>
                      <p className="text-[10px] text-charcoal/60">Computer Desktop</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
