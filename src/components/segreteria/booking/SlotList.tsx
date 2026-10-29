"use client";

import React, { useMemo } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Clock,
  DoorOpen,
  RefreshCw,
  Stethoscope,
} from "lucide-react";
import type { SlotCandidate } from "@/lib/scheduling/contract";
import { cn } from "@/lib/utils";
import { CoverageBadge } from "@/components/segreteria/booking/CoverageBadge";

export type SlotListProps = {
  slots: SlotCandidate[];
  selectedSlot: SlotCandidate | null;
  onSelect: (slot: SlotCandidate) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  coverageOverride?: boolean;
  emptyMessage?: string;
};

const timeFormatter = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
});

const dayFormatter = new Intl.DateTimeFormat("it-IT", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  timeZone: "Europe/Rome",
});

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--:--";
  return timeFormatter.format(date);
}

function formatDay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Data da definire";
  return dayFormatter.format(date);
}

export function SlotList({
  slots,
  selectedSlot,
  onSelect,
  isLoading = false,
  error = null,
  onRefresh,
  coverageOverride,
  emptyMessage = "Nessuno slot libero per la data selezionata. Prova un altro giorno.",
}: SlotListProps) {
  const groups = useMemo(() => {
    const map = new Map<string, SlotCandidate[]>();

    for (const slot of slots) {
      const key = slot.start.slice(0, 10);
      const current = map.get(key) ?? [];
      current.push(slot);
      map.set(key, current);
    }

    return Array.from(map.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, items]) => ({
        key,
        items: items.sort(
          (left, right) =>
            new Date(left.start).getTime() - new Date(right.start).getTime()
        ),
      }));
  }, [slots]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4A5C]">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Ricerca degli orari liberi in corso…
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[104px] animate-pulse rounded-xl border border-[#EAF1F5] bg-[#F4F8FA]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-amber-900">
              Impossibile caricare gli slot
            </p>
            <p className="mt-0.5 text-[11px] text-amber-800">{error}</p>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              <RefreshCw className="h-3 w-3" />
              Riprova
            </button>
          )}
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#80A1B2]/55 bg-white px-4 py-8 text-center">
        <CalendarDays className="mx-auto h-8 w-8 text-[#80A1B2]" />
        <p className="mt-2 text-sm font-bold text-[#03354B]">
          Nessuna disponibilità
        </p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-[#3D3D3C]/70">
          {emptyMessage}
        </p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#1C4A5C] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#03354B]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Aggiorna slot
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold text-[#3D3D3C]/70">
          {slots.length} slot liberi · durata standard 1 ora
        </p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#80A1B2]/50 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#1C4A5C] transition hover:bg-[#EAF1F5]"
          >
            <RefreshCw className="h-3 w-3" />
            Aggiorna
          </button>
        )}
      </div>

      {groups.map((group) => (
        <section key={group.key} className="space-y-2.5">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#1C4A5C]">
            {formatDay(group.items[0].start)}
          </h5>

          <div className="grid gap-2 sm:grid-cols-2">
            {group.items.map((slot) => {
              const selected =
                selectedSlot?.start === slot.start &&
                selectedSlot?.doctorId === slot.doctorId;
              const isCovered =
                coverageOverride ?? Boolean(slot.isCoveredByMembership);

              return (
                <button
                  key={`${slot.start}-${slot.doctorId ?? "any"}-${
                    slot.roomId ?? "room"
                  }`}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    onSelect(slot);
                    (document.activeElement as HTMLElement | null)?.blur();
                  }}
                  className={cn(
                    "group flex w-full flex-col gap-2 rounded-xl border p-3 text-left transition",
                    selected
                      ? "border-[#1C4A5C] bg-[#EAF1F5] ring-2 ring-[#1C4A5C]/20"
                      : "border-[#80A1B2]/35 bg-white hover:border-[#1C4A5C]/50 hover:bg-[#F4F8FA]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="flex items-baseline gap-1 text-lg font-bold leading-none text-[#03354B]">
                        {formatTime(slot.start)}
                        <span className="text-[10px] font-medium text-[#3D3D3C]/55">
                          → {formatTime(slot.end)}
                        </span>
                      </p>
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#1C4A5C]">
                        <Stethoscope className="h-3 w-3 text-[#80A1B2]" />
                        {slot.doctorName ?? "Specialista Cocoora"}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                        selected
                          ? "border-[#1C4A5C] bg-[#1C4A5C] text-white"
                          : "border-[#80A1B2]/50 bg-white text-transparent group-hover:text-[#80A1B2]"
                      )}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#03354B]/5 px-1.5 py-0.5 text-[10px] font-semibold text-[#03354B]">
                      <DoorOpen className="h-3 w-3" />
                      {slot.roomName ?? "Stanza da assegnare"}
                    </span>
                    <CoverageBadge
                      compact
                      isCovered={isCovered}
                      priceCents={slot.priceCents}
                      vatRegime={slot.vatRegime}
                      billingEntity={slot.billingEntity}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <p className="flex items-center gap-1.5 text-[10px] text-[#3D3D3C]/55">
        <Clock className="h-3 w-3" />
        Orari ufficiali: Lun–Ven 8:00–20:00 (orario continuato), Sab 9:00–14:00.
      </p>
    </div>
  );
}
