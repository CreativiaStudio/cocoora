"use client";

import React from "react";
import { Receipt, ShieldCheck } from "lucide-react";
import type { BillingEntity, VatRegime } from "@/lib/scheduling/contract";
import { cn } from "@/lib/utils";

export type CoverageBadgeProps = {
  isCovered: boolean;
  priceCents?: number;
  vatRegime?: VatRegime;
  billingEntity?: BillingEntity;
  compact?: boolean;
  className?: string;
};

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function CoverageBadge({
  isCovered,
  priceCents = 0,
  vatRegime = "esente_art10",
  billingEntity = "cocoora_stp",
  compact = false,
  className,
}: CoverageBadgeProps) {
  const vatLabel =
    vatRegime === "iva_22" ? "IVA 22% inclusa" : "Regime IVA esente art. 10";
  const entityLabel =
    billingEntity === "cocoora_stp"
      ? "Intestazione Cocoora STP"
      : "Intestazione PrimeCare";

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
          isCovered
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-[#80A1B2]/55 bg-[#EEF6FA] text-[#1C4A5C]",
          className
        )}
      >
        {isCovered ? (
          <ShieldCheck className="h-3 w-3" />
        ) : (
          <Receipt className="h-3 w-3" />
        )}
        {isCovered ? "Incluso nel Percorso Salute" : "Tariffa Extra STP"}
        {!isCovered && priceCents > 0 && (
          <span className="font-bold">· {formatEuro(priceCents)}</span>
        )}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border px-3.5 py-3",
        isCovered
          ? "border-emerald-200 bg-emerald-50/80"
          : "border-[#80A1B2]/55 bg-[#EEF6FA]",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isCovered
              ? "bg-emerald-600 text-white"
              : "bg-[#1C4A5C] text-white"
          )}
        >
          {isCovered ? (
            <ShieldCheck className="h-4 w-4" />
          ) : (
            <Receipt className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p
              className={cn(
                "text-xs font-bold",
                isCovered ? "text-emerald-900" : "text-[#03354B]"
              )}
            >
              {isCovered
                ? "Incluso nel Percorso Salute"
                : "Tariffa Extra STP"}
            </p>
            {!isCovered && priceCents > 0 && (
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-bold text-[#1C4A5C]">
                {formatEuro(priceCents)}
              </span>
            )}
          </div>

          <p
            className={cn(
              "mt-0.5 text-[11px]",
              isCovered ? "text-emerald-800/80" : "text-[#3D3D3C]/75"
            )}
          >
            {isCovered
              ? "Nessun importo da corrispondere in cassa per questa prestazione."
              : "Prestazione fuori percorso: incasso secondo tariffario."}
          </p>

          <p
            className={cn(
              "mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium",
              isCovered ? "text-emerald-700" : "text-[#1C4A5C]/80"
            )}
          >
            <span>{vatLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{entityLabel}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
