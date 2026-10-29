/**
 * COCOORA CENTRO MEDICO — SLOT ENGINE (PURE)
 *
 * Motore di calcolo disponibilità a funzione pura: non legge database, non usa
 * l'orologio di sistema, non muta gli input. Restituisce l'elenco deterministico
 * degli SlotCandidate per un servizio multi-step (es. OPT + visita, posa crema
 * + laser, device mobile Laser Acta).
 *
 * Regole applicate:
 *  - Il medico deve essere attivo, abilitato al servizio e coperto da un turno
 *    (ResourceShift) non bloccato che contenga l'intervallo dello step.
 *  - Stanze e device devono essere attivi, avere la capability richiesta e non
 *    avere collisioni con prenotazioni esistenti o con altri step della stessa
 *    proposta. Per stanze e device i turni sono vincolanti solo se configurati.
 *  - Gli stati di prenotazione annullati/no-show non occupano tempo.
 *  - Gli intervalli sono semichiusi: 09:00–09:30 e 09:30–10:00 non collidono.
 */

import type {
  BookingStatus,
  FindSlotsInput,
  Resource,
  ResourceBooking,
  ResourceShift,
  Service,
  ServiceStep,
  SlotCandidate,
  TimeInterval,
} from "./contract";
import { addMinutes, doIntervalsOverlap, isIntervalInside, isValidInterval } from "./intervals";

export const DEFAULT_SLOT_GRANULARITY_MIN = 15;

const MS_PER_MINUTE = 60_000;

/** Stati che occupano realmente l'agenda; cancelled e no_show liberano lo slot. */
const BLOCKING_BOOKING_STATUSES: ReadonlySet<BookingStatus> = new Set<BookingStatus>([
  "held",
  "confirmed",
  "checked_in",
  "in_progress",
  "completed",
]);

/** Limite di sicurezza per evitare loop enormi su finestre di ricerca abnormi. */
const MAX_SEARCH_ITERATIONS = 100_000;

type ShiftRequirement = "required" | "when-defined";

interface DoctorChoice {
  resource: Resource;
  doctorKey: string;
}

interface StepAssignment {
  step: ServiceStep;
  interval: TimeInterval;
  room: Resource | null;
  device: Resource | null;
}

interface AllocationContext {
  slotStart: Date;
  shifts: ResourceShift[];
  bookings: ResourceBooking[];
  resources: Resource[];
}

/**
 * Restituisce gli step del servizio ordinati, oppure uno step sintetico unico
 * quando il servizio non ha una sequenza esplicita configurata.
 */
function resolveSteps(service: Service): ServiceStep[] {
  const configured = Array.isArray(service.steps) ? [...service.steps] : [];

  if (configured.length > 0) {
    return configured.sort(
      (a, b) => a.stepOrder - b.stepOrder || a.offsetMin - b.offsetMin || a.id.localeCompare(b.id),
    );
  }

  const duration = service.totalDurationMin;
  if (!(duration > 0)) return [];

  return [
    {
      id: `${service.id}-main`,
      serviceId: service.id,
      stepOrder: 1,
      label: service.name,
      offsetMin: 0,
      durationMin: duration,
      needsDoctor: true,
      roomCapability: null,
      deviceCapability: null,
    },
  ];
}

/** Durata complessiva dello slot: copre sia gli step sia la durata dichiarata. */
function resolveSlotDurationMin(service: Service, steps: ServiceStep[]): number {
  const stepsSpan = steps.reduce(
    (max, step) => Math.max(max, step.offsetMin + Math.max(step.durationMin, 0)),
    0,
  );

  return Math.max(stepsSpan, service.totalDurationMin ?? 0, 0);
}

function intervalForStep(slotStart: Date, step: ServiceStep): TimeInterval {
  const start = addMinutes(slotStart, step.offsetMin);
  return { start, end: addMinutes(start, step.durationMin) };
}

function normalizeGranularity(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return DEFAULT_SLOT_GRANULARITY_MIN;
  }
  return value;
}

function hasShiftCoverage(
  resourceId: string,
  interval: TimeInterval,
  shifts: ResourceShift[],
  requirement: ShiftRequirement,
): boolean {
  const ownShifts = shifts.filter((shift) => shift.resourceId === resourceId);

  // Un turno bloccato (ferie, chiusura, manutenzione) che tocca l'intervallo
  // rende la risorsa indisponibile anche se esiste un altro turno contenitivo.
  const blockedOverlap = ownShifts.some(
    (shift) => shift.isBlocked && doIntervalsOverlap(interval, { start: shift.start, end: shift.end }),
  );
  if (blockedOverlap) return false;

  const openShifts = ownShifts.filter((shift) => !shift.isBlocked);
  const covered = openShifts.some((shift) => isIntervalInside(interval, { start: shift.start, end: shift.end }));
  if (covered) return true;

  // Stanze e device senza turni configurati sono considerati sempre disponibili;
  // appena viene configurato un turno, questo diventa vincolante.
  return requirement === "when-defined" && openShifts.length === 0;
}

function isResourceBooked(
  resourceId: string,
  interval: TimeInterval,
  bookings: ResourceBooking[],
): boolean {
  return bookings.some(
    (booking) =>
      booking.resourceId === resourceId &&
      BLOCKING_BOOKING_STATUSES.has(booking.status) &&
      doIntervalsOverlap(interval, { start: booking.start, end: booking.end }),
  );
}

/**
 * Aggiunge l'intervallo alla risorsa restituendo una nuova mappa (copia), così
 * il backtracking non lascia stato sporco tra un tentativo e l'altro.
 * Restituisce null se la risorsa è già impegnata da un altro step della stessa
 * proposta nello stesso istante (es. unico device richiesto da due step).
 */
function claimResource(
  occupied: Map<string, TimeInterval[]>,
  resourceId: string,
  interval: TimeInterval,
): Map<string, TimeInterval[]> | null {
  const current = occupied.get(resourceId) ?? [];

  if (current.some((used) => doIntervalsOverlap(used, interval))) {
    return null;
  }

  const next = new Map(occupied);
  next.set(resourceId, [...current, interval]);
  return next;
}

function eligibleResources(
  resources: Resource[],
  kind: Resource["kind"],
  capability: string,
): Resource[] {
  return resources
    .filter(
      (resource) =>
        resource.isActive &&
        resource.kind === kind &&
        resource.capabilities.includes(capability),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Backtracking sugli step: prova le combinazioni stanza/device disponibili e
 * restituisce la prima allocazione completa e valida, oppure null.
 */
function tryAllocateSteps(
  steps: ServiceStep[],
  index: number,
  context: AllocationContext,
  doctor: Resource | null,
  occupied: Map<string, TimeInterval[]>,
  assignments: StepAssignment[],
): StepAssignment[] | null {
  if (index >= steps.length) return assignments;

  const step = steps[index];
  const interval = intervalForStep(context.slotStart, step);

  // Uno step a durata non positiva non occupa tempo: viene registrato senza claim.
  if (!isValidInterval(interval)) {
    return tryAllocateSteps(
      steps,
      index + 1,
      context,
      doctor,
      occupied,
      [...assignments, { step, interval, room: null, device: null }],
    );
  }

  let occupiedAfterDoctor = occupied;

  if (step.needsDoctor) {
    if (!doctor) return null;
    if (!hasShiftCoverage(doctor.id, interval, context.shifts, "required")) return null;
    if (isResourceBooked(doctor.id, interval, context.bookings)) return null;

    const claimed = claimResource(occupiedAfterDoctor, doctor.id, interval);
    if (!claimed) return null;
    occupiedAfterDoctor = claimed;
  }

  const roomOptions: Array<Resource | null> = step.roomCapability
    ? eligibleResources(context.resources, "room", step.roomCapability)
    : [null];

  const deviceOptions: Array<Resource | null> = step.deviceCapability
    ? eligibleResources(context.resources, "device", step.deviceCapability)
    : [null];

  for (const room of roomOptions) {
    let occupiedAfterRoom = occupiedAfterDoctor;

    if (room) {
      if (isResourceBooked(room.id, interval, context.bookings)) continue;
      if (!hasShiftCoverage(room.id, interval, context.shifts, "when-defined")) continue;

      const claimed = claimResource(occupiedAfterRoom, room.id, interval);
      if (!claimed) continue;
      occupiedAfterRoom = claimed;
    }

    for (const device of deviceOptions) {
      let occupiedAfterDevice = occupiedAfterRoom;

      if (device) {
        if (isResourceBooked(device.id, interval, context.bookings)) continue;
        if (!hasShiftCoverage(device.id, interval, context.shifts, "when-defined")) continue;

        const claimed = claimResource(occupiedAfterDevice, device.id, interval);
        if (!claimed) continue;
        occupiedAfterDevice = claimed;
      }

      const result = tryAllocateSteps(
        steps,
        index + 1,
        context,
        doctor,
        occupiedAfterDevice,
        [...assignments, { step, interval, room, device }],
      );

      if (result) return result;
    }
  }

  return null;
}

function resolveDoctorChoices(
  resources: Resource[],
  activeDoctorIdsForService: string[],
  preferredDoctorId?: string,
): DoctorChoice[] {
  const activeIds = new Set(activeDoctorIdsForService);

  return resources
    .filter((resource) => resource.kind === "doctor" && resource.isActive)
    .map((resource) => ({ resource, doctorKey: resource.doctorId ?? resource.id }))
    .filter(({ resource, doctorKey }) => activeIds.has(doctorKey) || activeIds.has(resource.id))
    .filter(
      ({ resource, doctorKey }) =>
        !preferredDoctorId ||
        doctorKey === preferredDoctorId ||
        resource.id === preferredDoctorId,
    )
    .sort(
      (a, b) =>
        a.doctorKey.localeCompare(b.doctorKey) || a.resource.id.localeCompare(b.resource.id),
    );
}

function buildCandidate(
  slotStart: Date,
  slotDurationMin: number,
  doctor: DoctorChoice | null,
  assignments: StepAssignment[],
): SlotCandidate {
  const roomStep =
    [...assignments].reverse().find((assignment) => assignment.step.needsDoctor && assignment.room) ??
    [...assignments].reverse().find((assignment) => assignment.room);

  const room = roomStep?.room ?? null;

  const deviceIds = Array.from(
    new Set(
      assignments.flatMap((assignment) => (assignment.device ? [assignment.device.id] : [])),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const candidate: SlotCandidate = {
    start: slotStart.toISOString(),
    end: addMinutes(slotStart, slotDurationMin).toISOString(),
  };

  if (doctor) {
    candidate.doctorId = doctor.doctorKey;
    candidate.doctorName = doctor.resource.name;
  }
  if (room) {
    candidate.roomId = room.id;
    candidate.roomName = room.name;
  }
  if (deviceIds.length > 0) {
    candidate.deviceIds = deviceIds;
  }

  return candidate;
}

function candidateKey(candidate: SlotCandidate): string {
  return [
    candidate.start,
    candidate.end,
    candidate.doctorId ?? "",
    candidate.roomId ?? "",
    (candidate.deviceIds ?? []).join(","),
  ].join("|");
}

function compareCandidates(a: SlotCandidate, b: SlotCandidate): number {
  return (
    a.start.localeCompare(b.start) ||
    a.end.localeCompare(b.end) ||
    (a.doctorId ?? "").localeCompare(b.doctorId ?? "") ||
    (a.doctorName ?? "").localeCompare(b.doctorName ?? "") ||
    (a.roomId ?? "").localeCompare(b.roomId ?? "") ||
    (a.deviceIds ?? []).join(",").localeCompare((b.deviceIds ?? []).join(","))
  );
}

/**
 * Calcola gli slot prenotabili per il servizio richiesto.
 *
 * Campiona ogni `granularityMin` (default 15) da `from` a `to`, verificando per
 * ogni medico eleggibile che tutti gli step siano contemporaneamente allocabili
 * (medico + stanza + device) senza collisioni. Lo slot è valido solo se termina
 * entro la finestra richiesta.
 */
export function findSlots(input: FindSlotsInput): SlotCandidate[] {
  const { service, from, to, preferredDoctorId } = input;

  if (!service || !(from instanceof Date) || !(to instanceof Date)) return [];

  const windowStartMs = from.getTime();
  const windowEndMs = to.getTime();

  if (!Number.isFinite(windowStartMs) || !Number.isFinite(windowEndMs) || windowEndMs <= windowStartMs) {
    return [];
  }

  const resources = input.resources ?? [];
  const shifts = input.shifts ?? [];
  const bookings = input.bookings ?? [];
  const activeDoctorIds = input.activeDoctorIdsForService ?? [];

  const granularityMin = normalizeGranularity(input.granularityMin);
  const granularityMs = granularityMin * MS_PER_MINUTE;

  const steps = resolveSteps(service);
  if (steps.length === 0) return [];

  const slotDurationMin = resolveSlotDurationMin(service, steps);
  if (!(slotDurationMin > 0)) return [];

  const slotDurationMs = slotDurationMin * MS_PER_MINUTE;

  const needsDoctor = steps.some((step) => step.needsDoctor);
  const doctorChoices: Array<DoctorChoice | null> = needsDoctor
    ? resolveDoctorChoices(resources, activeDoctorIds, preferredDoctorId)
    : [null];

  if (doctorChoices.length === 0) return [];

  const results: SlotCandidate[] = [];
  const seen = new Set<string>();

  let iterations = 0;

  for (
    let cursor = windowStartMs;
    cursor + slotDurationMs <= windowEndMs;
    cursor += granularityMs
  ) {
    iterations += 1;
    if (iterations > MAX_SEARCH_ITERATIONS) break;

    const slotStart = new Date(cursor);

    for (const doctor of doctorChoices) {
      const context: AllocationContext = {
        slotStart,
        shifts,
        bookings,
        resources,
      };

      const assignments = tryAllocateSteps(steps, 0, context, doctor?.resource ?? null, new Map(), []);
      if (!assignments) continue;

      const candidate = buildCandidate(slotStart, slotDurationMin, doctor, assignments);
      const key = candidateKey(candidate);

      if (seen.has(key)) continue;
      seen.add(key);
      results.push(candidate);
    }
  }

  results.sort(compareCandidates);

  return results;
}
