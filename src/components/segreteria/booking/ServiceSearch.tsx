"use client";

import React, { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  Hash,
  Loader2,
  Search,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import type { ClinicalArea, VatRegime, BillingEntity } from "@/lib/scheduling/contract";
import { cn } from "@/lib/utils";
import { searchServicesAction } from "@/app/segreteria/prenota/actions";

export type ServiceSearchResult = {
  id: string;
  code: string;
  name: string;
  area: ClinicalArea;
  specialty?: string | null;
  totalDurationMin: number;
  priceCents: number;
  vatRegime: VatRegime;
  billingEntity: BillingEntity;
  isCoveredByMembership: boolean;
  isBookableOnline: boolean;
};

export type ServiceSearchProps = {
  selectedService: ServiceSearchResult | null;
  onSelect: (service: ServiceSearchResult | null) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
};

const QUICK_SERVICES = [
  "Visita Odontoiatrica",
  "Igiene Orale",
  "Criolipolisi",
  "Visita Cardiologica",
  "Mappatura Nei",
];

const AREA_LABEL: Record<ClinicalArea, string> = {
  medicina_estetica: "Medicina Estetica",
  odontoiatria: "Odontoiatria",
  visite_specialistiche: "Visite Specialistiche",
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function ServiceSearch({
  selectedService,
  onSelect,
  autoFocus = false,
  disabled = false,
  inputRef,
}: ServiceSearchProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const fieldRef = inputRef ?? internalRef;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ServiceSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (selectedService) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);

    const timer = window.setTimeout(() => {
      searchServicesAction(trimmed)
        .then((found) => {
          if (cancelled) return;
          setResults(found);
          setActiveIndex(0);
        })
        .catch(() => {
          if (cancelled) return;
          setResults([]);
          setSearchError("Ricerca prestazioni non disponibile. Riprova.");
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, selectedService]);

  function handleSelect(service: ServiceSearchResult) {
    setQuery(service.name);
    setResults([]);
    onSelect(service);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    onSelect(null);
    window.setTimeout(() => fieldRef.current?.focus(), 40);
  }

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
    setSearchError(null);
    if (selectedService) onSelect(null);
  }

  async function handleQuickChip(label: string) {
    setQuery(label);
    setActiveIndex(0);
    setSearchError(null);
    if (selectedService) onSelect(null);

    setIsSearching(true);
    try {
      const found = await searchServicesAction(label);
      setResults(found);

      const exact = found.find((service) => {
        const name = normalize(service.name);
        const needle = normalize(label);
        return name === needle || name.includes(needle);
      });

      if (exact) {
        handleSelect(exact);
      } else {
        window.setTimeout(() => fieldRef.current?.focus(), 20);
      }
    } catch {
      setResults([]);
      setSearchError("Ricerca prestazioni non disponibile. Riprova.");
    } finally {
      setIsSearching(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      if (results.length === 0) return;
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      if (results.length === 0) return;
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + results.length) % results.length
      );
      return;
    }

    if (event.key === "Enter") {
      event.stopPropagation();
      if (results.length > 0) {
        event.preventDefault();
        handleSelect(results[activeIndex] ?? results[0]);
      }
      return;
    }

    if (event.key === "Escape") {
      if (results.length > 0) {
        event.stopPropagation();
        setResults([]);
      }
    }
  }

  if (selectedService) {
    return (
      <div className="rounded-2xl border border-[#1C4A5C]/20 bg-[#F4F8FA] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1C4A5C] text-white">
            <Stethoscope className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-[#03354B]">
                {selectedService.name}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#80A1B2]/40 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1C4A5C]">
                <Hash className="h-3 w-3" />
                {selectedService.code}
              </span>
              {selectedService.isCoveredByMembership && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <Check className="h-3 w-3" />
                  Prima visita nei Percorsi Salute
                </span>
              )}
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#3D3D3C]/70">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {selectedService.totalDurationMin} min
              </span>
              <span>{AREA_LABEL[selectedService.area]}</span>
              {selectedService.specialty && (
                <span>{selectedService.specialty}</span>
              )}
              <span className="font-semibold text-[#1C4A5C]">
                {formatEuro(selectedService.priceCents)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#80A1B2]/50 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#1C4A5C] transition hover:bg-[#EAF1F5]"
          >
            <X className="h-3.5 w-3.5" />
            Cambia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {QUICK_SERVICES.map((label) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => void handleQuickChip(label)}
            className="inline-flex items-center gap-1 rounded-full border border-[#80A1B2]/45 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1C4A5C] transition hover:border-[#1C4A5C] hover:bg-[#EAF1F5] disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3 text-[#80A1B2]" />
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#80A1B2]" />
        <input
          ref={fieldRef}
          autoFocus={autoFocus}
          disabled={disabled}
          value={query}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nome prestazione o codice COC…"
          className="h-12 w-full rounded-xl border border-[#80A1B2]/45 bg-white pl-10 pr-20 text-sm font-medium text-[#3D3D3C] outline-none transition placeholder:font-normal placeholder:text-[#80A1B2] focus:border-[#1C4A5C] focus:ring-4 focus:ring-[#1C4A5C]/10 disabled:bg-slate-100"
          aria-label="Cerca prestazione per nome o codice COC"
          aria-autocomplete="list"
          aria-expanded={results.length > 0}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#1C4A5C]" />
          ) : (
            <kbd className="rounded border border-[#80A1B2]/40 bg-[#F4F8FA] px-1.5 py-0.5 text-[10px] font-semibold text-[#1C4A5C]">
              S
            </kbd>
          )}
        </div>
      </div>

      {searchError && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{searchError}</p>
        </div>
      )}

      {results.length > 0 && (
        <div
          role="listbox"
          className="overflow-hidden rounded-xl border border-[#80A1B2]/35 bg-white shadow-sm"
        >
          {results.map((service, index) => (
            <button
              key={service.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(service)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-[#EAF1F5] px-3.5 py-3 text-left transition last:border-b-0",
                index === activeIndex
                  ? "bg-[#EAF1F5]"
                  : "bg-white hover:bg-[#F4F8FA]"
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#03354B]/10 text-[#03354B]">
                <Stethoscope className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-sm font-bold text-[#03354B]">
                    {service.name}
                  </span>
                  <span className="rounded border border-[#80A1B2]/40 bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#1C4A5C]">
                    {service.code}
                  </span>
                </div>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#3D3D3C]/70">
                  <span>{AREA_LABEL[service.area]}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.totalDurationMin} min
                  </span>
                  <span className="font-semibold text-[#1C4A5C]">
                    {formatEuro(service.priceCents)}
                  </span>
                  {service.isCoveredByMembership && (
                    <span className="font-semibold text-emerald-700">
                      Prima visita inclusa
                    </span>
                  )}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-[#80A1B2]" />
            </button>
          ))}
        </div>
      )}

      {!isSearching &&
        query.trim().length >= 1 &&
        results.length === 0 &&
        !searchError && (
          <div className="rounded-xl border border-dashed border-[#80A1B2]/50 bg-white px-3.5 py-3 text-xs text-[#3D3D3C]/75">
            Nessuna prestazione trovata per &ldquo;{query.trim()}&rdquo;. Prova
            con il codice COC o con una delle voci rapide.
          </div>
        )}
    </div>
  );
}
