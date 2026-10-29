/**
 * COCOORA CENTRO MEDICO — TIME INTERVAL UTILITIES
 *
 * Funzioni pure di manipolazione di intervalli temporali semichiusi [start, end).
 * Tutte le date sono Date UTC: la conversione verso il fuso Europe/Rome avviene
 * esclusivamente in lettura (formatRomeTime, parsing di orari "da parete" senza
 * designatore di fuso) tramite l'API Intl nativa, senza dipendenze esterne.
 *
 * Regola cardine: due intervalli che si toccano (a.end === b.start) NON si
 * sovrappongono, perché l'intervallo è semichiuso.
 */

import type { TimeInterval } from "./contract";

export const ROME_TIME_ZONE = "Europe/Rome";

const MS_PER_MINUTE = 60_000;

/**
 * Un intervallo è valido solo se start ed end sono Date finite e start < end.
 * Gli intervalli a durata zero o negativa non occupano tempo e non sono validi.
 */
export function isValidInterval(interval: TimeInterval): boolean {
  if (!interval) return false;
  if (!(interval.start instanceof Date) || !(interval.end instanceof Date)) return false;

  const start = interval.start.getTime();
  const end = interval.end.getTime();

  return Number.isFinite(start) && Number.isFinite(end) && start < end;
}

/**
 * Sovrapposizione tra due intervalli semichiusi [start, end).
 * Restituisce false per intervalli invalidi (dati sporchi non bloccano la
 * disponibilità, ma non vengono nemmeno considerati occupati).
 */
export function doIntervalsOverlap(a: TimeInterval, b: TimeInterval): boolean {
  if (!isValidInterval(a) || !isValidInterval(b)) return false;

  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}

/**
 * true quando `inner` è completamente contenuto in `outer` (estremi inclusi).
 * Viene usato per verificare che l'intervallo di uno step cada dentro un turno.
 */
export function isIntervalInside(inner: TimeInterval, outer: TimeInterval): boolean {
  if (!isValidInterval(inner) || !isValidInterval(outer)) return false;

  return inner.start.getTime() >= outer.start.getTime() && inner.end.getTime() <= outer.end.getTime();
}

/**
 * Aggiunge (o sottrae, con valori negativi) minuti a una data, restituendo una
 * nuova istanza: l'oggetto di partenza non viene mai mutato.
 */
export function addMinutes(date: Date, minutes: number): Date {
  const base = assertValidDate(date, "addMinutes");

  if (typeof minutes !== "number" || !Number.isFinite(minutes)) {
    throw new RangeError("addMinutes: il numero di minuti deve essere un valore finito.");
  }

  return new Date(base.getTime() + Math.round(minutes * MS_PER_MINUTE));
}

const romeClockFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: ROME_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const romePartsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: ROME_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/** Orario locale di Roma in formato HH:mm (24h), indipendente dal fuso della macchina. */
export function formatRomeTime(date: Date): string {
  assertValidDate(date, "formatRomeTime");

  const parts = romeClockFormatter.formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";

  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

interface RomeDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function getRomeDateParts(date: Date): RomeDateParts {
  const parts = romePartsFormatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes): number => {
    const value = parts.find((part) => part.type === type)?.value;
    return value ? Number(value) : 0;
  };

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

/** Offset (in ms) tra l'ora di Roma e UTC nell'istante indicato. */
function romeOffsetMs(date: Date): number {
  const parts = getRomeDateParts(date);
  const asIfUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  const truncatedToSecond = Math.floor(date.getTime() / 1000) * 1000;

  return asIfUtc - truncatedToSecond;
}

/**
 * Converte un orario "da parete" di Roma (es. 09:00 del 5 novembre) nell'istante
 * UTC corrispondente, gestendo CET/CEST. Per gli orari ambigui o inesistenti
 * dovuti al cambio ora legale viene scelta la prima interpretazione valida.
 */
function romeWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  source: string,
): Date {
  if (month < 1 || month > 12) {
    throw new RangeError(`parseIsoSafe: mese non valido in "${source}".`);
  }
  if (day < 1 || day > 31) {
    throw new RangeError(`parseIsoSafe: giorno non valido in "${source}".`);
  }
  if (hour > 23 || minute > 59 || second > 59 || millisecond > 999) {
    throw new RangeError(`parseIsoSafe: orario non valido in "${source}".`);
  }

  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  const calendarCheck = new Date(naiveUtc);

  if (
    calendarCheck.getUTCFullYear() !== year ||
    calendarCheck.getUTCMonth() !== month - 1 ||
    calendarCheck.getUTCDate() !== day
  ) {
    throw new RangeError(`parseIsoSafe: data inesistente sul calendario in "${source}".`);
  }

  const firstOffset = romeOffsetMs(new Date(naiveUtc));
  let timestamp = naiveUtc - firstOffset;

  const refinedOffset = romeOffsetMs(new Date(timestamp));
  if (refinedOffset !== firstOffset) {
    timestamp = naiveUtc - refinedOffset;
  }

  return new Date(timestamp);
}

const ROME_WALL_CLOCK_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/;

const ROME_DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parsing tollerante e deterministico di date ISO 8601.
 *
 * - Date: viene restituita una copia (mai lo stesso riferimento).
 * - Stringa con fuso esplicito (Z oppure ±hh:mm): parsing nativo.
 * - Stringa senza fuso con orario (es. "2026-11-05T09:00"): interpretata come
 *   ora di parete Europe/Rome.
 * - Stringa solo data (es. "2026-11-05"): mezzanotte Europe/Rome.
 *
 * Lancia RangeError/TypeError per input non interpretabili, così i chiamanti
 * non propagano mai una Date invalida al motore.
 */
export function parseIsoSafe(iso: string | Date): Date {
  if (iso instanceof Date) {
    if (Number.isNaN(iso.getTime())) {
      throw new RangeError("parseIsoSafe: ricevuta una Date invalida.");
    }
    return new Date(iso.getTime());
  }

  if (typeof iso !== "string") {
    throw new TypeError("parseIsoSafe: atteso una stringa ISO 8601 oppure una Date.");
  }

  const value = iso.trim();
  if (!value) {
    throw new RangeError("parseIsoSafe: stringa vuota.");
  }

  const dateOnly = ROME_DATE_ONLY_PATTERN.exec(value);
  if (dateOnly) {
    return romeWallTimeToUtc(
      Number(dateOnly[1]),
      Number(dateOnly[2]),
      Number(dateOnly[3]),
      0,
      0,
      0,
      0,
      value,
    );
  }

  const wallClock = ROME_WALL_CLOCK_PATTERN.exec(value);
  if (wallClock) {
    const millisecond = wallClock[7] ? Number(wallClock[7].padEnd(3, "0")) : 0;

    return romeWallTimeToUtc(
      Number(wallClock[1]),
      Number(wallClock[2]),
      Number(wallClock[3]),
      Number(wallClock[4]),
      Number(wallClock[5]),
      wallClock[6] ? Number(wallClock[6]) : 0,
      millisecond,
      value,
    );
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new RangeError(`parseIsoSafe: "${iso}" non è una data ISO 8601 valida.`);
  }

  return parsed;
}

function assertValidDate(value: Date, context: string): Date {
  if (!(value instanceof Date)) {
    throw new TypeError(`${context}: attesa una Date.`);
  }
  if (Number.isNaN(value.getTime())) {
    throw new RangeError(`${context}: ricevuta una Date invalida.`);
  }
  return value;
}
