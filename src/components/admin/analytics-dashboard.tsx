"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Clock,
  Eye,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";
import type { TelemetryAggregatedStats } from "@/lib/telemetry-store";
import { TrackingConfigManager } from "./tracking-config-manager";

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<TelemetryAggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch("/api/admin/analytics-stats")
      .then((r) => r.json())
      .then((d) => {
        if (d?.stats) setStats(d.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${remainder}s`;
    return `${mins}m ${remainder}s`;
  };

  return (
    <div className="space-y-8">
      {/* 1. Box ID Tracciamento per Silvia */}
      <TrackingConfigManager />

      {/* 2. Monitoraggio Server-Side Live */}
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
              Dati raccolti server-side nel pieno rispetto del GDPR (IP anonimizzato, nessun tracciamento di dati sanitari).
            </p>
          </div>

          <button
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Visite Totali */}
              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Visite Totali
                  </span>
                  <Eye className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {stats.totalPageViews.toLocaleString("it-IT")}
                </p>
                <p className="mt-1 text-[11px] text-teal-700 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span>Pagine viste complessive</span>
                </p>
              </div>

              {/* Visitatori Unici */}
              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Visitatori Unici
                  </span>
                  <Users className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {stats.uniqueVisitors.toLocaleString("it-IT")}
                </p>
                <p className="mt-1 text-[11px] text-charcoal/60">
                  Hash univoci reali (GDPR)
                </p>
              </div>

              {/* Tempo Medio Permanenza */}
              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Permanenza Media
                  </span>
                  <Clock className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {formatSeconds(stats.avgDurationSeconds)}
                </p>
                <p className="mt-1 text-[11px] text-emerald-700">
                  Dwell time medio su pagina
                </p>
              </div>

              {/* Click su CTA */}
              <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Click su CTA
                  </span>
                  <MousePointerClick className="h-4 w-4" />
                </div>
                <p className="mt-2 font-serif text-2xl font-bold text-teal-950">
                  {stats.ctaClicks.reduce((sum, c) => sum + c.count, 0)}
                </p>
                <p className="mt-1 text-[11px] text-teal-700">
                  Prenotazioni, WhatsApp, Chiamate
                </p>
              </div>
            </div>

            {/* Griglia Pagine & Click CTA */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Pagine Più Visitate (7 cols) */}
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
                    <div className="p-6 text-center text-xs text-charcoal/50">
                      Nessuna pagina registrata finora. La telemetria interna è attiva e registrerà le visite non appena gli utenti navigano sul sito.
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

              {/* Click su CTA e Dispositivi (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
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
                      <p className="mt-1 font-bold text-teal-950">{stats.deviceBreakdown.mobile}</p>
                      <p className="text-[10px] text-charcoal/60">Smartphone &amp; Tablet</p>
                    </div>
                    <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3 text-center">
                      <ArrowUpRight className="mx-auto h-4 w-4 text-teal-700" />
                      <p className="mt-1 font-bold text-teal-950">{stats.deviceBreakdown.desktop}</p>
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
