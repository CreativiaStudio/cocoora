"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Eye,
  FilePenLine,
  Globe2,
  Loader2,
  LockKeyhole,
  Pencil,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  toggleServiceStatusAction,
  updateServicePriceAction,
} from "@/app/admin/catalogo/actions";
import {
  CATALOG_AREAS,
  formatPriceCents,
  parsePriceToCents,
  type CatalogArea,
  type CatalogPriceMode,
  type CatalogService,
} from "@/lib/catalogo/csvSchema";
import { cn } from "@/lib/utils";

type ServiceTableProps = {
  services: CatalogService[];
  loading?: boolean;
  onRefresh: () => void | Promise<void>;
  onSelectService?: (service: CatalogService) => void;
  onNotify?: (message: string, tone: "success" | "error" | "info") => void;
};

type AreaFilter = "Tutte" | CatalogArea;

type ToggleField = "is_listed" | "is_bookable_online" | "is_active";

const PRICE_MODE_LABEL: Record<CatalogPriceMode, string> = {
  FISSO: "Fisso",
  DA_DEFINIRE: "Da definire",
  POST_VISITA: "Definito dopo la visita",
  SU_RICHIESTA: "Su richiesta",
};

const AREA_STYLE: Record<CatalogArea, string> = {
  "Medicina Estetica": "bg-[#1C4A5C]/8 text-[#1C4A5C] border-[#1C4A5C]/15",
  Odontoiatria: "bg-[#03354B]/8 text-[#03354B] border-[#03354B]/15",
  "Visite Specialistiche":
    "bg-[#80A1B2]/15 text-[#03354B] border-[#80A1B2]/35",
};

function ToggleSwitch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4A5C]/30",
        checked
          ? "border-[#1C4A5C] bg-[#1C4A5C]"
          : "border-[#80A1B2]/50 bg-[#E7EDF0]",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

export function ServiceTable({
  services,
  loading = false,
  onRefresh,
  onSelectService,
  onNotify,
}: ServiceTableProps) {
  const [area, setArea] = useState<AreaFilter>("Tutte");
  const [search, setSearch] = useState("");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [editing, setEditing] = useState<CatalogService | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [vatInput, setVatInput] = useState("");
  const [priceError, setPriceError] = useState<string | null>(null);
  const [savingPrice, setSavingPrice] = useState(false);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return services.filter((service) => {
      if (area !== "Tutte" && service.area !== area) return false;
      if (!needle) return true;
      return `${service.code} ${service.name} ${service.specialty} ${service.room ?? ""}`
        .toLowerCase()
        .includes(needle);
    });
  }, [area, search, services]);

  const notify = (message: string, tone: "success" | "error" | "info") => {
    onNotify?.(message, tone);
  };

  const handleToggle = async (
    service: CatalogService,
    field: ToggleField,
    value: boolean
  ) => {
    const key = `${service.id}:${field}`;
    setPendingKey(key);

    try {
      const result = await toggleServiceStatusAction(service.id, field, value);

      if (!result.ok) {
        notify(result.error ?? "Aggiornamento non riuscito.", "error");
        return;
      }

      if (result.notice) {
        notify(result.notice, "info");
      } else {
        const label =
          field === "is_listed"
            ? "Visibilità online"
            : field === "is_bookable_online"
              ? "Prenotabilità online"
              : "Stato prestazione";
        notify(`${label} aggiornata.`, "success");
      }

      await onRefresh();
    } catch (error: unknown) {
      notify(
        error instanceof Error
          ? error.message
          : "Errore di rete durante l'aggiornamento.",
        "error"
      );
    } finally {
      setPendingKey(null);
    }
  };

  const openPriceEditor = (service: CatalogService) => {
    setEditing(service);
    setPriceInput(
      service.priceCents === null
        ? ""
        : (service.priceCents / 100).toFixed(2).replace(".", ",")
    );
    setVatInput(service.vatRegime);
    setPriceError(null);
  };

  const closePriceEditor = () => {
    if (savingPrice) return;
    setEditing(null);
    setPriceError(null);
  };

  const handleSavePrice = async () => {
    if (!editing) return;

    const cents = parsePriceToCents(priceInput);
    if (cents === null) {
      setPriceError("Inserisci un importo valido, ad esempio 180,00.");
      return;
    }

    if (!vatInput.trim()) {
      setPriceError("Indica il regime fiscale della prestazione.");
      return;
    }

    setSavingPrice(true);
    setPriceError(null);

    try {
      const result = await updateServicePriceAction(
        editing.id,
        cents,
        vatInput.trim()
      );

      if (!result.ok) {
        setPriceError(result.error ?? "Salvataggio non riuscito.");
        return;
      }

      setEditing(null);
      notify(
        result.notice ??
          `Tariffa aggiornata a ${formatPriceCents(cents)}.`,
        result.notice ? "info" : "success"
      );
      await onRefresh();
    } catch (error: unknown) {
      setPriceError(
        error instanceof Error
          ? error.message
          : "Errore di rete durante il salvataggio."
      );
    } finally {
      setSavingPrice(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#80A1B2]/25 bg-white p-10">
        <div className="flex items-center justify-center gap-3 text-sm font-medium text-[#3D3D3C]/70">
          <Loader2 className="h-5 w-5 animate-spin text-[#1C4A5C]" />
          Caricamento del catalogo prestazioni…
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-[#80A1B2]/25 bg-white p-4 sm:p-5 shadow-[0_18px_40px_-32px_rgba(3,53,75,0.45)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtra per area">
            {(["Tutte", ...CATALOG_AREAS] as AreaFilter[]).map((item) => {
              const active = area === item;
              const count =
                item === "Tutte"
                  ? services.length
                  : services.filter((service) => service.area === item).length;

              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setArea(item)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                    active
                      ? "border-[#1C4A5C] bg-[#1C4A5C] text-white shadow-sm"
                      : "border-[#80A1B2]/35 bg-white text-[#03354B] hover:border-[#1C4A5C]/50 hover:bg-[#F4F8F9]"
                  )}
                >
                  {item}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#1C4A5C]/8 text-[#1C4A5C]"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="relative block w-full xl:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#80A1B2]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cerca codice, prestazione, specialità…"
              className="w-full rounded-xl border border-[#80A1B2]/35 bg-[#F8FAFB] py-2.5 pl-10 pr-9 text-sm text-[#3D3D3C] outline-none transition-colors placeholder:text-[#3D3D3C]/45 focus:border-[#1C4A5C] focus:bg-white focus:ring-2 focus:ring-[#1C4A5C]/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Cancella ricerca"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#80A1B2] hover:bg-[#E7EDF0] hover:text-[#1C4A5C]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#80A1B2]/15 pt-3 text-[11px] font-medium text-[#3D3D3C]/65">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-[#80A1B2]" />
            Visibile online
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 text-[#80A1B2]" />
            Prenotabile online
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LockKeyhole className="h-3.5 w-3.5 text-[#80A1B2]" />
            Le tariffe singole restano riservate al CRM
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#80A1B2]/25 bg-white shadow-[0_18px_40px_-32px_rgba(3,53,75,0.45)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#80A1B2]/25 bg-[#F4F8F9] text-[10px] font-bold uppercase tracking-[0.14em] text-[#03354B]/70">
                <th className="px-4 py-3.5">Codice</th>
                <th className="px-4 py-3.5">Prestazione</th>
                <th className="px-4 py-3.5">Area</th>
                <th className="px-4 py-3.5">Tariffa</th>
                <th className="px-4 py-3.5">Sala</th>
                <th className="px-4 py-3.5 text-center">Visibile</th>
                <th className="px-4 py-3.5 text-center">Prenotabile</th>
                <th className="px-4 py-3.5 text-center">Attiva</th>
                <th className="px-4 py-3.5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#80A1B2]/15">
              {filtered.map((service) => {
                const listedPending = pendingKey === `${service.id}:is_listed`;
                const bookablePending =
                  pendingKey === `${service.id}:is_bookable_online`;
                const activePending = pendingKey === `${service.id}:is_active`;

                return (
                  <tr
                    key={service.id}
                    className="align-top transition-colors hover:bg-[#F8FAFB]"
                  >
                    <td className="px-4 py-4">
                      <span className="rounded-md border border-[#80A1B2]/30 bg-[#F4F8F9] px-2 py-1 font-mono text-[11px] font-bold text-[#03354B]">
                        {service.code}
                      </span>
                    </td>
                    <td className="max-w-[330px] px-4 py-4">
                      <p className="text-sm font-semibold leading-snug text-[#03354B]">
                        {service.name}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-[#3D3D3C]/60">
                        {service.specialty} · {service.durationMinutes} min ·{" "}
                        {PRICE_MODE_LABEL[service.priceMode]}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                          AREA_STYLE[service.area]
                        )}
                      >
                        {service.area}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          service.priceCents === null
                            ? "text-amber-700"
                            : "text-[#1C4A5C]"
                        )}
                      >
                        {formatPriceCents(service.priceCents)}
                      </p>
                      <p className="mt-0.5 max-w-[190px] truncate text-[10px] text-[#3D3D3C]/55" title={service.vatRegime}>
                        {service.vatRegime}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-[#3D3D3C]">
                      {service.room ?? "Da assegnare"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        {listedPending ? (
                          <Loader2 className="h-5 w-5 animate-spin text-[#1C4A5C]" />
                        ) : (
                          <ToggleSwitch
                            checked={service.isListed}
                            disabled={service.priceCents === null || !service.isActive}
                            label={`Visibilità online di ${service.name}`}
                            onChange={(value) =>
                              handleToggle(service, "is_listed", value)
                            }
                          />
                        )}
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-[#3D3D3C]/45">
                          {service.isListed ? "Sì" : "No"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        {bookablePending ? (
                          <Loader2 className="h-5 w-5 animate-spin text-[#1C4A5C]" />
                        ) : (
                          <ToggleSwitch
                            checked={service.bookableOnline}
                            disabled={
                              service.priceCents === null ||
                              !service.isListed ||
                              !service.isActive
                            }
                            label={`Prenotabilità online di ${service.name}`}
                            onChange={(value) =>
                              handleToggle(service, "is_bookable_online", value)
                            }
                          />
                        )}
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-[#3D3D3C]/45">
                          {service.bookableOnline ? "Sì" : "No"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        {activePending ? (
                          <Loader2 className="h-5 w-5 animate-spin text-[#1C4A5C]" />
                        ) : (
                          <ToggleSwitch
                            checked={service.isActive}
                            label={`Stato attivo di ${service.name}`}
                            onChange={(value) =>
                              handleToggle(service, "is_active", value)
                            }
                          />
                        )}
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-[#3D3D3C]/45">
                          {service.isActive ? "Attiva" : "Sospesa"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openPriceEditor(service)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#80A1B2]/40 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#03354B] transition-colors hover:border-[#1C4A5C] hover:bg-[#F4F8F9]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Tariffa
                        </button>
                        {onSelectService && (
                          <button
                            type="button"
                            onClick={() => onSelectService(service)}
                            className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2 py-1.5 text-[11px] font-semibold text-[#1C4A5C] transition-colors hover:bg-[#1C4A5C]/8"
                          >
                            Step
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1C4A5C]/8 text-[#1C4A5C]">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#03354B]">
                Nessuna prestazione trovata
              </p>
              <p className="mt-1 text-xs text-[#3D3D3C]/65">
                Modifica i filtri oppure importa il catalogo unico delle
                prestazioni.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#80A1B2]/20 bg-[#F8FAFB] px-4 py-3 text-[11px] text-[#3D3D3C]/60">
          <span>
            {filtered.length} di {services.length} prestazioni visualizzate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#80A1B2]" />
            Le modifiche vengono registrate nel catalogo amministrativo
          </span>
        </div>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#03354B]/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="price-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePriceEditor();
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#80A1B2]/30 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#80A1B2]/20 bg-[#F4F8F9] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1C4A5C] text-white">
                  <FilePenLine className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    id="price-dialog-title"
                    className="text-sm font-bold text-[#03354B]"
                  >
                    Modifica tariffa
                  </h3>
                  <p className="mt-0.5 text-xs text-[#3D3D3C]/65">
                    {editing.code} · {editing.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePriceEditor}
                disabled={savingPrice}
                aria-label="Chiudi"
                className="rounded-lg p-1.5 text-[#80A1B2] transition-colors hover:bg-white hover:text-[#1C4A5C]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <label
                  htmlFor="catalog-price"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#03354B]/75"
                >
                  Tariffa (€)
                </label>
                <input
                  id="catalog-price"
                  type="text"
                  inputMode="decimal"
                  value={priceInput}
                  onChange={(event) => setPriceInput(event.target.value)}
                  placeholder="180,00"
                  autoFocus
                  className="w-full rounded-xl border border-[#80A1B2]/40 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#03354B] outline-none transition-colors focus:border-[#1C4A5C] focus:ring-2 focus:ring-[#1C4A5C]/10"
                />
                <p className="mt-1.5 text-[11px] text-[#3D3D3C]/60">
                  Inserisci 0 solo per una prestazione gratuita o non ancora
                  tariffata: verrà rimossa dalla pubblicazione online.
                </p>
              </div>

              <div>
                <label
                  htmlFor="catalog-vat"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#03354B]/75"
                >
                  Indicazione fiscale
                </label>
                <input
                  id="catalog-vat"
                  type="text"
                  list="catalog-vat-options"
                  value={vatInput}
                  onChange={(event) => setVatInput(event.target.value)}
                  className="w-full rounded-xl border border-[#80A1B2]/40 bg-white px-3.5 py-2.5 text-sm text-[#3D3D3C] outline-none transition-colors focus:border-[#1C4A5C] focus:ring-2 focus:ring-[#1C4A5C]/10"
                />
                <datalist id="catalog-vat-options">
                  <option value="ESENTE IVA art. 10, c.1, n.18 DPR 633/72" />
                  <option value="IVA 22%" />
                  <option value="IVA 10%" />
                  <option value="NON APPLICABILE" />
                </datalist>
              </div>

              {priceError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
                  {priceError}
                </div>
              )}

              <div className="rounded-xl border border-[#80A1B2]/25 bg-[#F8FAFB] px-3.5 py-3 text-[11px] leading-relaxed text-[#3D3D3C]/70">
                La tariffa delle singole visite specialistiche resta nel
                gestionale interno e non viene pubblicata sul sito. Sul sito
                pubblico sono pubblicati esclusivamente i prezzi dei Percorsi
                Salute.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#80A1B2]/20 bg-[#F8FAFB] px-5 py-3.5">
              <button
                type="button"
                onClick={closePriceEditor}
                disabled={savingPrice}
                className="rounded-xl border border-[#80A1B2]/40 bg-white px-4 py-2 text-xs font-semibold text-[#3D3D3C] transition-colors hover:bg-[#F4F8F9] disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSavePrice}
                disabled={savingPrice}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1C4A5C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#03354B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPrice ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Salva tariffa
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
