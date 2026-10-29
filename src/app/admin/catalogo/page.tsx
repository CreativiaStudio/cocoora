"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Database,
  Eye,
  Globe2,
  Info,
  LayoutList,
  ListOrdered,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { getAdminServicesListAction } from "./actions";
import { ServiceTable } from "@/components/admin/catalogo/ServiceTable";
import { StepEditor } from "@/components/admin/catalogo/StepEditor";
import { CsvImport } from "@/components/admin/catalogo/CsvImport";
import type { CatalogService } from "@/lib/catalogo/csvSchema";
import { cn } from "@/lib/utils";

type Tab = "catalogo" | "import" | "steps";

type Notice = {
  tone: "success" | "error" | "info";
  message: string;
};

const TABS: Array<{
  id: Tab;
  label: string;
  description: string;
  icon: typeof LayoutList;
}> = [
  {
    id: "catalogo",
    label: "Catalogo prestazioni",
    description: "Tariffe, visibilità e prenotabilità",
    icon: LayoutList,
  },
  {
    id: "import",
    label: "Importa CSV",
    description: "Anteprima differenze e applicazione",
    icon: UploadCloud,
  },
  {
    id: "steps",
    label: "Step & Sale",
    description: "Timeline operativa delle prestazioni",
    icon: ListOrdered,
  },
];

export default function AdminCatalogoPage() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<"database" | "csv" | "empty">("empty");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("catalogo");
  const [selectedService, setSelectedService] =
    useState<CatalogService | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const refresh = useCallback(async (silent: boolean = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await getAdminServicesListAction();
      setServices(result.services);
      setSource(result.source);
      setLoadError(result.error ?? null);

      setSelectedService((current) => {
        if (!current) return result.services[0] ?? null;
        return (
          result.services.find(
            (service) =>
              service.id === current.id || service.code === current.code
          ) ??
          result.services[0] ??
          null
        );
      });
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Errore di caricamento del catalogo."
      );
      setSource("empty");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    const active = services.filter((service) => service.isActive).length;
    const listed = services.filter((service) => service.isListed).length;
    const bookable = services.filter(
      (service) => service.bookableOnline
    ).length;
    const withoutPrice = services.filter(
      (service) => service.priceCents === null
    ).length;

    return {
      total: services.length,
      active,
      listed,
      bookable,
      withoutPrice,
    };
  }, [services]);

  const notify = (message: string, tone: Notice["tone"] = "info") => {
    setNotice({ message, tone });
  };

  const handleSelectService = (service: CatalogService) => {
    setSelectedService(service);
    setTab("steps");
  };

  return (
    <div className="min-h-screen bg-[#F4F8F9] text-[#3D3D3C] antialiased">
      <header className="border-b border-[#80A1B2]/25 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#3D3D3C]/60">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-[#F4F8F9] hover:text-[#1C4A5C]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Admin
              </Link>
              <span className="text-[#80A1B2]">/</span>
              <span className="text-[#1C4A5C]">Catalogo prestazioni</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
                  source === "database"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : source === "csv"
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-[#80A1B2]/30 bg-[#F4F8F9] text-[#3D3D3C]/60"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    source === "database"
                      ? "bg-emerald-500"
                      : source === "csv"
                        ? "bg-amber-500"
                        : "bg-[#80A1B2]"
                  )}
                />
                {source === "database"
                  ? "Database clinico"
                  : source === "csv"
                    ? "Anteprima CSV"
                    : "Catalogo vuoto"}
              </span>

              <button
                type="button"
                onClick={() => void refresh(true)}
                disabled={refreshing || loading}
                className="inline-flex items-center gap-2 rounded-xl border border-[#80A1B2]/40 bg-white px-3.5 py-2 text-xs font-semibold text-[#03354B] transition-colors hover:border-[#1C4A5C] hover:bg-[#F8FAFB] disabled:cursor-wait disabled:opacity-50"
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
                />
                Aggiorna
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#80A1B2]">
                Area amministrazione · Catalogo clinico
              </p>
              <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#03354B] sm:text-3xl">
                Catalogo delle prestazioni
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#3D3D3C]/70">
                Gestisci tariffa, visibilità online e prenotabilità di ogni
                prestazione. I prezzi delle singole visite restano nel backend
                CRM; sul sito pubblico vengono pubblicati esclusivamente i
                prezzi dei Percorsi Salute.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-[#1C4A5C]/15 bg-white px-3.5 py-2.5 text-[11px] font-semibold text-[#1C4A5C] shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Tariffe singole protette: nessuna pubblicazione automatica
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {notice && (
          <div
            className={cn(
              "flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-xs font-medium",
              notice.tone === "success" &&
                "border-emerald-200 bg-emerald-50 text-emerald-900",
              notice.tone === "error" &&
                "border-rose-200 bg-rose-50 text-rose-900",
              notice.tone === "info" &&
                "border-[#80A1B2]/35 bg-[#F4F8F9] text-[#03354B]"
            )}
            role="status"
          >
            <span className="flex items-start gap-2">
              {notice.tone === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : notice.tone === "error" ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              {notice.message}
            </span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Chiudi avviso"
              className="rounded-lg p-1 transition-colors hover:bg-white/70"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {loadError && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {source === "csv"
                ? "Database non raggiungibile: il pannello sta mostrando l'anteprima del catalogo CSV locale. Le modifiche restano attive in memoria finché il catalogo non viene importato nel database."
                : `Catalogo non disponibile: ${loadError}`}
            </span>
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard
            label="Prestazioni totali"
            value={stats.total}
            hint="Voci presenti nel catalogo"
            icon={<Database className="h-4 w-4" />}
          />
          <StatCard
            label="Voci attive"
            value={stats.active}
            hint="Disponibili in segreteria"
            icon={<CheckCircle2 className="h-4 w-4" />}
            tone="success"
          />
          <StatCard
            label="Visibili online"
            value={stats.listed}
            hint="Pubblicate sul sito"
            icon={<Eye className="h-4 w-4" />}
            tone="teal"
          />
          <StatCard
            label="Prenotabili online"
            value={stats.bookable}
            hint="Con tariffa e visibilità attive"
            icon={<Globe2 className="h-4 w-4" />}
            tone="navy"
          />
          <StatCard
            label="Senza tariffa"
            value={stats.withoutPrice}
            hint="Escluse dalla pubblicazione"
            icon={<CircleDollarSign className="h-4 w-4" />}
            tone="warning"
          />
        </section>

        <nav
          className="flex flex-col gap-2 rounded-2xl border border-[#80A1B2]/25 bg-white p-2 sm:flex-row"
          aria-label="Sezioni catalogo"
        >
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                  active
                    ? "bg-[#1C4A5C] text-white shadow-sm"
                    : "text-[#3D3D3C] hover:bg-[#F4F8F9]"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    active
                      ? "bg-white/15 text-white"
                      : "bg-[#1C4A5C]/8 text-[#1C4A5C]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold">{item.label}</span>
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-[10px]",
                      active ? "text-white/70" : "text-[#3D3D3C]/55"
                    )}
                  >
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        {tab === "catalogo" && (
          <ServiceTable
            services={services}
            loading={loading}
            onRefresh={() => refresh(true)}
            onSelectService={handleSelectService}
            onNotify={notify}
          />
        )}

        {tab === "import" && (
          <CsvImport
            services={services}
            onImported={() => refresh(true)}
            onNotify={notify}
          />
        )}

        {tab === "steps" && (
          <div className="space-y-4">
            <section className="flex flex-col gap-3 rounded-2xl border border-[#80A1B2]/25 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#1C4A5C]" />
                <label
                  htmlFor="step-service-select"
                  className="text-xs font-bold text-[#03354B]"
                >
                  Prestazione da analizzare
                </label>
              </div>
              <select
                id="step-service-select"
                value={selectedService?.id ?? ""}
                onChange={(event) => {
                  const next = services.find(
                    (service) => service.id === event.target.value
                  );
                  setSelectedService(next ?? null);
                }}
                className="w-full rounded-xl border border-[#80A1B2]/40 bg-[#F8FAFB] px-3 py-2 text-xs font-semibold text-[#03354B] outline-none transition-colors focus:border-[#1C4A5C] focus:bg-white focus:ring-2 focus:ring-[#1C4A5C]/10 sm:max-w-xl"
              >
                <option value="">Seleziona una prestazione…</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.code} · {service.name} · {service.area}
                  </option>
                ))}
              </select>
            </section>

            <StepEditor service={selectedService} />
          </div>
        )}

        <footer className="flex flex-col gap-3 rounded-2xl border border-[#80A1B2]/25 bg-white px-4 py-4 text-[11px] leading-relaxed text-[#3D3D3C]/65 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-start gap-2">
            <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#80A1B2]" />
            <span>
              Le tariffe delle singole visite specialistiche sono riservate al
              CRM per la fatturazione. Sul sito pubblico sono pubblicati
              esclusivamente i prezzi dei Percorsi Salute e la tabella
              comparativa delle prestazioni.
            </span>
          </span>
          <span className="shrink-0 font-semibold text-[#1C4A5C]">
            Cocoora Centro Medico
          </span>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  tone?: "default" | "success" | "teal" | "navy" | "warning";
}) {
  return (
    <div className="rounded-2xl border border-[#80A1B2]/25 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(3,53,75,0.5)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#3D3D3C]/55">
          {label}
        </p>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            tone === "default" && "bg-[#1C4A5C]/8 text-[#1C4A5C]",
            tone === "success" && "bg-emerald-50 text-emerald-700",
            tone === "teal" && "bg-[#1C4A5C]/10 text-[#1C4A5C]",
            tone === "navy" && "bg-[#03354B]/8 text-[#03354B]",
            tone === "warning" && "bg-amber-50 text-amber-700"
          )}
        >
          {icon}
        </span>
      </div>
      <p
        className={cn(
          "mt-2 text-3xl font-bold tracking-tight",
          tone === "warning" ? "text-amber-800" : "text-[#03354B]"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-medium text-[#3D3D3C]/55">{hint}</p>
    </div>
  );
}
