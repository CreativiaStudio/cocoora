"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import {
  formatPriceCents,
  parseServiceCatalogCsv,
  SERVICE_CATALOG_CSV_HEADERS,
  SERVICE_CATALOG_CSV_SAMPLE_ROW,
  type CatalogCsvParseResult,
  type CatalogService,
} from "@/lib/catalogo/csvSchema";
import {
  importServicesCsvAction,
  type ImportServicesResult,
} from "@/app/admin/catalogo/actions";
import { cn } from "@/lib/utils";

type CsvImportProps = {
  services: CatalogService[];
  onImported: () => void | Promise<void>;
  onNotify: (message: string, tone: "success" | "error" | "info") => void;
};

type DiffKind = "new" | "update" | "unchanged";

const DIFF_LABEL: Record<DiffKind, string> = {
  new: "Nuova",
  update: "Aggiorna",
  unchanged: "Invariata",
};

const DIFF_STYLE: Record<DiffKind, string> = {
  new: "border-emerald-200 bg-emerald-50 text-emerald-800",
  update: "border-amber-200 bg-amber-50 text-amber-800",
  unchanged: "border-[#80A1B2]/30 bg-[#F4F8F9] text-[#3D3D3C]/65",
};

const MAX_FILE_SIZE = 5_000_000;

function escapeCsvCell(value: string): string {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function CsvImport({
  services,
  onImported,
  onNotify,
}: CsvImportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvContent, setCsvContent] = useState("");
  const [preview, setPreview] = useState<CatalogCsvParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<ImportServicesResult | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const diff = useMemo(() => {
    if (!preview) return [];

    const existingByCode = new Map(
      services.map((service) => [service.code.toUpperCase(), service])
    );

    return preview.rows.map((row) => {
      const existing = existingByCode.get(row.code);

      if (!existing) {
        return { kind: "new" as DiffKind, row, existing: null };
      }

      const changed =
        existing.name !== row.name ||
        existing.specialty !== row.specialty ||
        existing.area !== row.area ||
        existing.priceCents !== row.priceCents ||
        existing.priceMode !== row.priceMode ||
        existing.room !== row.room ||
        existing.bookableOnline !== row.bookableOnline;

      return {
        kind: (changed ? "update" : "unchanged") as DiffKind,
        row,
        existing,
      };
    });
  }, [preview, services]);

  const counts = useMemo(
    () => ({
      total: preview?.totalRows ?? 0,
      valid: preview?.rows.length ?? 0,
      invalid: preview?.errors.length ?? 0,
      new: diff.filter((item) => item.kind === "new").length,
      update: diff.filter((item) => item.kind === "update").length,
      unchanged: diff.filter((item) => item.kind === "unchanged").length,
    }),
    [diff, preview]
  );

  const reset = () => {
    setFileName(null);
    setCsvContent("");
    setPreview(null);
    setError(null);
    setConfirmed(false);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const readFile = async (file: File) => {
    setError(null);
    setResult(null);
    setConfirmed(false);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Formato non supportato: carica un file .csv.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Il file supera il limite di 5 MB consentito dal pannello.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseServiceCatalogCsv(text);

      setFileName(file.name);
      setCsvContent(text);
      setPreview(parsed);

      if (parsed.rows.length === 0) {
        setError(
          parsed.errors[0]?.message ??
            "Nessuna riga valida trovata nel file CSV."
        );
      }
    } catch (readError: unknown) {
      setError(
        readError instanceof Error
          ? readError.message
          : "Impossibile leggere il file CSV."
      );
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) await readFile(file);
  };

  const handleApply = async () => {
    if (!preview || preview.rows.length === 0 || !confirmed || applying) return;

    setApplying(true);
    setError(null);

    try {
      const response = await importServicesCsvAction(csvContent);
      setResult(response);
      onNotify(
        response.message,
        response.ok ? "success" : response.persisted ? "info" : "error"
      );

      if (response.ok) {
        await onImported();
      }
    } catch (applyError: unknown) {
      const message =
        applyError instanceof Error
          ? applyError.message
          : "Errore di rete durante l'importazione.";
      setError(message);
      onNotify(message, "error");
    } finally {
      setApplying(false);
    }
  };

  const downloadTemplate = () => {
    const rows = [
      SERVICE_CATALOG_CSV_HEADERS.map(escapeCsvCell).join(","),
      SERVICE_CATALOG_CSV_SAMPLE_ROW.map(escapeCsvCell).join(","),
    ].join("\n");

    const blob = new Blob([`\uFEFF${rows}\n`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "modello_catalogo_prestazioni_cocoora.csv";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#80A1B2]/25 bg-white p-5 shadow-[0_18px_40px_-32px_rgba(3,53,75,0.45)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80A1B2]">
              Importazione sicura
            </p>
            <h2 className="mt-1 text-base font-bold text-[#03354B]">
              Catalogo unico delle prestazioni
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#3D3D3C]/65">
              Carica il file{" "}
              <span className="font-semibold text-[#1C4A5C]">
                catalogo_unico_prestazioni_ottobre_2026.csv
              </span>
              . Il sistema mostra l&apos;anteprima delle differenze prima di
              applicare qualsiasi modifica.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#80A1B2]/40 bg-white px-3.5 py-2 text-xs font-semibold text-[#03354B] transition-colors hover:border-[#1C4A5C] hover:bg-[#F4F8F9]"
          >
            <Download className="h-3.5 w-3.5" />
            Scarica modello
          </button>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all",
            isDragging
              ? "border-[#1C4A5C] bg-[#1C4A5C]/6"
              : "border-[#80A1B2]/45 bg-[#F8FAFB] hover:border-[#1C4A5C]/60 hover:bg-[#F4F8F9]"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
              isDragging
                ? "bg-[#1C4A5C] text-white"
                : "bg-[#1C4A5C]/8 text-[#1C4A5C]"
            )}
          >
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-bold text-[#03354B]">
            Trascina qui il CSV oppure clicca per selezionarlo
          </p>
          <p className="mt-1 text-[11px] text-[#3D3D3C]/60">
            Formato .csv · dimensione massima 5 MB · codici COC-xxx
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) await readFile(file);
            }}
          />
        </div>

        {fileName && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#80A1B2]/25 bg-[#F4F8F9] px-3.5 py-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#03354B]">
              <FileSpreadsheet className="h-4 w-4 text-[#1C4A5C]" />
              {fileName}
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                reset();
              }}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#3D3D3C]/60 transition-colors hover:bg-white hover:text-[#1C4A5C]"
            >
              <RefreshCw className="h-3 w-3" />
              Cambia file
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {preview && (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              { label: "Righe file", value: counts.total, tone: "neutral" },
              { label: "Valide", value: counts.valid, tone: "success" },
              { label: "Nuove", value: counts.new, tone: "success" },
              { label: "Da aggiornare", value: counts.update, tone: "warning" },
              { label: "Invariate", value: counts.unchanged, tone: "neutral" },
              { label: "Errori", value: counts.invalid, tone: "error" },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-xl border bg-white px-3.5 py-3",
                  item.tone === "success" && "border-emerald-200",
                  item.tone === "warning" && "border-amber-200",
                  item.tone === "error" && "border-rose-200",
                  item.tone === "neutral" && "border-[#80A1B2]/25"
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#3D3D3C]/55">
                  {item.label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-bold",
                    item.tone === "success" && "text-emerald-800",
                    item.tone === "warning" && "text-amber-800",
                    item.tone === "error" && "text-rose-800",
                    item.tone === "neutral" && "text-[#03354B]"
                  )}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#80A1B2]/25 bg-white shadow-[0_18px_40px_-32px_rgba(3,53,75,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#80A1B2]/20 bg-[#F4F8F9] px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-[#03354B]">
                  Anteprima differenze
                </h3>
                <p className="text-[11px] text-[#3D3D3C]/60">
                  Le prime 30 righe del file, confrontate con il catalogo
                  attuale.
                </p>
              </div>
              <span className="rounded-full border border-[#80A1B2]/30 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3D3D3C]/60">
                Delimitatore {preview.delimiter === ";" ? "punto e virgola" : "virgola"}
              </span>
            </div>

            <div className="max-h-[420px] overflow-auto">
              <table className="min-w-[760px] w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_rgba(128,161,178,0.25)]">
                  <tr className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#03354B]/65">
                    <th className="px-4 py-3">Esito</th>
                    <th className="px-4 py-3">Codice</th>
                    <th className="px-4 py-3">Prestazione</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Tariffa</th>
                    <th className="px-4 py-3">Sala</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#80A1B2]/15">
                  {diff.slice(0, 30).map((item) => (
                    <tr key={`${item.row.code}-${item.row.lineNumber}`}>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                            DIFF_STYLE[item.kind]
                          )}
                        >
                          {DIFF_LABEL[item.kind]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-[#03354B]">
                        {item.row.code}
                      </td>
                      <td className="max-w-[300px] px-4 py-3">
                        <p className="truncate text-xs font-semibold text-[#03354B]">
                          {item.row.name}
                        </p>
                        <p className="text-[10px] text-[#3D3D3C]/55">
                          {item.row.specialty}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-medium text-[#3D3D3C]/70">
                        {item.row.area}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-[#1C4A5C]">
                        {formatPriceCents(item.row.priceCents)}
                      </td>
                      <td className="px-4 py-3 text-[11px] font-medium text-[#3D3D3C]/70">
                        {item.row.room ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {diff.length > 30 && (
              <p className="border-t border-[#80A1B2]/20 bg-[#F8FAFB] px-4 py-2.5 text-[11px] text-[#3D3D3C]/60">
                Mostrate 30 righe su {diff.length}. L&apos;importazione applica
                l&apos;intero file.
              </p>
            )}
          </section>

          {(preview.errors.length > 0 || preview.warnings.length > 0) && (
            <div className="grid gap-3 lg:grid-cols-2">
              {preview.errors.length > 0 && (
                <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-rose-800">
                    <AlertTriangle className="h-4 w-4" />
                    Righe scartate ({preview.errors.length})
                  </h3>
                  <ul className="mt-2 max-h-40 space-y-1.5 overflow-auto text-[11px] leading-relaxed text-rose-800/90">
                    {preview.errors.slice(0, 12).map((item, index) => (
                      <li key={`${item.line}-${index}`}>
                        <span className="font-bold">Riga {item.line}</span>
                        {item.code ? ` · ${item.code}` : ""}: {item.message}
                      </li>
                    ))}
                  </ul>
                  {preview.errors.length > 12 && (
                    <p className="mt-2 text-[10px] font-semibold text-rose-700">
                      … e altre {preview.errors.length - 12} segnalazioni.
                    </p>
                  )}
                </section>
              )}

              {preview.warnings.length > 0 && (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-800">
                    <Info className="h-4 w-4" />
                    Avvisi ({preview.warnings.length})
                  </h3>
                  <ul className="mt-2 max-h-40 space-y-1.5 overflow-auto text-[11px] leading-relaxed text-amber-800/90">
                    {preview.warnings.slice(0, 10).map((warning, index) => (
                      <li key={`${warning}-${index}`}>{warning}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          <section className="rounded-2xl border border-[#1C4A5C]/20 bg-white p-5 shadow-[0_18px_40px_-32px_rgba(3,53,75,0.45)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#80A1B2] text-[#1C4A5C] focus:ring-[#1C4A5C]"
                />
                <span className="text-xs leading-relaxed text-[#3D3D3C]/75">
                  Ho verificato l&apos;anteprima e confermo l&apos;importazione
                  nel catalogo. Le prestazioni senza prezzo resteranno escluse
                  dalla pubblicazione online.
                </span>
              </label>

              <button
                type="button"
                onClick={handleApply}
                disabled={
                  !confirmed ||
                  applying ||
                  counts.valid === 0 ||
                  result?.ok === true
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1C4A5C] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#03354B] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {applying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {applying ? "Applicazione in corso…" : "Applica importazione"}
              </button>
            </div>

            {result && (
              <div
                className={cn(
                  "mt-4 rounded-xl border px-4 py-3",
                  result.ok
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-rose-200 bg-rose-50"
                )}
              >
                <div className="flex items-start gap-2">
                  {result.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "text-xs font-bold",
                        result.ok ? "text-emerald-900" : "text-rose-900"
                      )}
                    >
                      {result.message}
                    </p>
                    <p className="mt-1 text-[11px] text-[#3D3D3C]/65">
                      {result.inserted} inserite · {result.updated} aggiornate ·{" "}
                      {result.skipped} scartate · {result.invalidRows} righe non
                      valide
                    </p>
                    {result.errors.length > 0 && (
                      <ul className="mt-2 max-h-32 space-y-1 overflow-auto text-[10px] text-rose-800/90">
                        {result.errors.slice(0, 10).map((item, index) => (
                          <li key={`${item.line}-${index}`}>
                            {item.code ? `${item.code}: ` : ""}
                            {item.message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
