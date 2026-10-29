/**
 * COCOORA CENTRO MEDICO — TEST SUITE MOTORE SLOT (VITEST)
 *
 * Le date sono costruite con l'offset CET (+01:00) per rendere i test
 * deterministici su qualunque macchina, indipendentemente dal fuso locale.
 */

import { describe, expect, it } from "vitest";

import type {
  BookingStatus,
  Resource,
  ResourceBooking,
  ResourceShift,
  Service,
  ServiceStep,
} from "../contract";
import { findSlots } from "../engine";
import {
  addMinutes,
  doIntervalsOverlap,
  formatRomeTime,
  isIntervalInside,
  parseIsoSafe,
} from "../intervals";

const THU = "2026-11-05";
const FRI = "2026-11-06";
const SAT = "2026-11-07";

let idSequence = 0;

function nextId(prefix: string): string {
  idSequence += 1;
  return `${prefix}-${idSequence}`;
}

/** Istante UTC corrispondente a un orario di Roma (CET, +01:00). */
function romeInstant(dateKey: string, time: string): Date {
  return new Date(`${dateKey}T${time}:00+01:00`);
}

function romeIso(dateKey: string, time: string): string {
  return romeInstant(dateKey, time).toISOString();
}

function doctorResource(id: string, name: string, capabilities: string[] = []): Resource {
  return {
    id,
    kind: "doctor",
    name,
    doctorId: id,
    capabilities,
    isActive: true,
  };
}

function roomResource(id: string, name: string, capabilities: string[]): Resource {
  return {
    id,
    kind: "room",
    name,
    doctorId: null,
    capabilities,
    isActive: true,
  };
}

function deviceResource(id: string, name: string, capabilities: string[], isActive = true): Resource {
  return {
    id,
    kind: "device",
    name,
    doctorId: null,
    capabilities,
    isActive,
  };
}

function openShift(
  resourceId: string,
  dateKey: string,
  start: string,
  end: string,
): ResourceShift {
  return {
    id: nextId(`shift-${resourceId}`),
    resourceId,
    start: romeInstant(dateKey, start),
    end: romeInstant(dateKey, end),
    isBlocked: false,
    note: null,
  };
}

function blockedShift(
  resourceId: string,
  dateKey: string,
  start: string,
  end: string,
  note = "Ferie",
): ResourceShift {
  return {
    id: nextId(`blocked-${resourceId}`),
    resourceId,
    start: romeInstant(dateKey, start),
    end: romeInstant(dateKey, end),
    isBlocked: true,
    note,
  };
}

function booking(
  resourceId: string,
  dateKey: string,
  start: string,
  end: string,
  status: BookingStatus = "confirmed",
): ResourceBooking {
  return {
    id: nextId("booking"),
    appointmentId: nextId("appointment"),
    stepOrder: 1,
    resourceId,
    start: romeInstant(dateKey, start),
    end: romeInstant(dateKey, end),
    status,
  };
}

type StepDefinition = Omit<ServiceStep, "id" | "serviceId">;

function stepDef(
  stepOrder: number,
  offsetMin: number,
  durationMin: number,
  options: Partial<Pick<ServiceStep, "needsDoctor" | "roomCapability" | "deviceCapability">> = {},
): StepDefinition {
  return {
    stepOrder,
    label: `Step ${stepOrder}`,
    offsetMin,
    durationMin,
    needsDoctor: options.needsDoctor ?? false,
    roomCapability: options.roomCapability ?? null,
    deviceCapability: options.deviceCapability ?? null,
  };
}

function buildService(
  id: string,
  name: string,
  totalDurationMin: number,
  stepDefinitions: StepDefinition[],
): Service {
  return {
    id,
    code: id.toUpperCase(),
    name,
    area: "odontoiatria",
    specialty: null,
    patientPrepNotes: null,
    totalDurationMin,
    isListed: true,
    isBookableOnline: true,
    isActive: true,
    steps: stepDefinitions.map((definition, index) => ({
      ...definition,
      id: `${id}-step-${index + 1}`,
      serviceId: id,
    })),
  };
}

function slotTimes(slots: Array<{ start: string }>): string[] {
  return slots.map((slot) => formatRomeTime(parseIsoSafe(slot.start)));
}

describe("intervals", () => {
  it("considera semichiusi gli intervalli: 09:00–09:30 e 09:30–10:00 non si sovrappongono", () => {
    const first = { start: romeInstant(THU, "09:00"), end: romeInstant(THU, "09:30") };
    const second = { start: romeInstant(THU, "09:30"), end: romeInstant(THU, "10:00") };
    const overlapping = { start: romeInstant(THU, "09:15"), end: romeInstant(THU, "09:45") };

    expect(doIntervalsOverlap(first, second)).toBe(false);
    expect(doIntervalsOverlap(first, overlapping)).toBe(true);
    expect(isIntervalInside(overlapping, { start: romeInstant(THU, "09:00"), end: romeInstant(THU, "10:00") })).toBe(true);
    expect(isIntervalInside(overlapping, first)).toBe(false);
  });

  it("addMinutes non muta la data originale e gestisce i valori negativi", () => {
    const start = romeInstant(THU, "09:00");
    const original = start.toISOString();

    expect(addMinutes(start, 45).toISOString()).toBe(romeIso(THU, "09:45"));
    expect(addMinutes(start, -30).toISOString()).toBe(romeIso(THU, "08:30"));
    expect(start.toISOString()).toBe(original);
  });

  it("formatta l'orario di Roma in HH:mm sia in ora solare sia in ora legale", () => {
    expect(formatRomeTime(romeInstant(THU, "09:05"))).toBe("09:05");
    expect(formatRomeTime(new Date("2026-07-15T07:05:00Z"))).toBe("09:05");
    expect(formatRomeTime(new Date("2026-11-05T00:00:00Z"))).toBe("01:00");
  });

  it("parseIsoSafe interpreta le stringhe senza fuso come ora di Roma e rifiuta input invalidi", () => {
    expect(parseIsoSafe("2026-11-05T09:00").toISOString()).toBe("2026-11-05T08:00:00.000Z");
    expect(parseIsoSafe("2026-11-05T09:00:00+01:00").toISOString()).toBe("2026-11-05T08:00:00.000Z");
    expect(parseIsoSafe("2026-11-05").toISOString()).toBe("2026-11-04T23:00:00.000Z");

    const source = romeInstant(THU, "09:00");
    const parsed = parseIsoSafe(source);
    expect(parsed.toISOString()).toBe(source.toISOString());
    expect(parsed).not.toBe(source);

    expect(() => parseIsoSafe("non-una-data")).toThrow(RangeError);
    expect(() => parseIsoSafe("")).toThrow(RangeError);
  });
});

describe("findSlots", () => {
  it("Test 1 — trova gli slot di una visita semplice con stanza singola e medico libero", () => {
    const doctor = doctorResource("doc-elisa", "Dott.ssa Elisa Russo");
    const room = roomResource("room-studio-1", "Studio 1", ["studio_odontoiatrico"]);

    const service = buildService("svc-visita", "Visita odontoiatrica", 30, [
      stepDef(1, 0, 30, { needsDoctor: true, roomCapability: "studio_odontoiatrico" }),
    ]);

    const slots = findSlots({
      service,
      from: romeInstant(THU, "09:00"),
      to: romeInstant(THU, "12:00"),
      resources: [doctor, room],
      shifts: [
        openShift(doctor.id, THU, "09:00", "13:00"),
        openShift(room.id, THU, "09:00", "13:00"),
      ],
      bookings: [],
      activeDoctorIdsForService: [doctor.id],
    });

    // Cadenza default 15 minuti, servizio 30 minuti, finestra 09:00–12:00.
    expect(slots).toHaveLength(11);
    expect(slotTimes(slots).slice(0, 3)).toEqual(["09:00", "09:15", "09:30"]);
    expect(slots[0]).toMatchObject({
      start: romeIso(THU, "09:00"),
      end: romeIso(THU, "09:30"),
      doctorId: "doc-elisa",
      doctorName: "Dott.ssa Elisa Russo",
      roomId: "room-studio-1",
      roomName: "Studio 1",
    });
    expect(slots[0].deviceIds).toBeUndefined();
  });

  it("Test 2 — rifiuta gli slot in cui il medico è occupato in un altro booking", () => {
    const doctor = doctorResource("doc-elisa", "Dott.ssa Elisa Russo");
    const room = roomResource("room-studio-1", "Studio 1", ["studio_odontoiatrico"]);

    const service = buildService("svc-visita", "Visita odontoiatrica", 30, [
      stepDef(1, 0, 30, { needsDoctor: true, roomCapability: "studio_odontoiatrico" }),
    ]);

    const slots = findSlots({
      service,
      from: romeInstant(THU, "09:00"),
      to: romeInstant(THU, "11:00"),
      resources: [doctor, room],
      shifts: [
        openShift(doctor.id, THU, "09:00", "13:00"),
        openShift(room.id, THU, "09:00", "13:00"),
      ],
      bookings: [booking(doctor.id, THU, "09:15", "09:45")],
      activeDoctorIdsForService: [doctor.id],
    });

    const times = slotTimes(slots);
    expect(times).toContain("10:00");
    expect(times).not.toContain("09:00");
    expect(times).not.toContain("09:15");
    expect(times).not.toContain("09:30");
    // 09:45–10:15 tocca la fine del booking (09:45): intervallo semichiuso, slot valido.
    expect(times).toContain("09:45");
  });

  it("Test 3 — rifiuta gli slot in cui la stanza è occupata da un altro medico", () => {
    const ourDoctor = doctorResource("doc-elisa", "Dott.ssa Elisa Russo");
    const otherDoctor = doctorResource("doc-marco", "Dott. Marco De Luca");
    const room = roomResource("room-studio-1", "Studio 1", ["studio_odontoiatrico"]);

    const service = buildService("svc-visita", "Visita odontoiatrica", 30, [
      stepDef(1, 0, 30, { needsDoctor: true, roomCapability: "studio_odontoiatrico" }),
    ]);

    const slots = findSlots({
      service,
      from: romeInstant(THU, "09:00"),
      to: romeInstant(THU, "11:00"),
      resources: [ourDoctor, otherDoctor, room],
      shifts: [
        openShift(ourDoctor.id, THU, "09:00", "13:00"),
        openShift(otherDoctor.id, THU, "09:00", "13:00"),
        openShift(room.id, THU, "09:00", "13:00"),
      ],
      bookings: [booking(room.id, THU, "10:00", "10:30")],
      activeDoctorIdsForService: [ourDoctor.id],
    });

    const times = slotTimes(slots);
    expect(times).toContain("09:00");
    expect(times).not.toContain("10:00");
    expect(times).not.toContain("10:15");
    expect(times).toContain("10:30");
  });

  it("Test 4 — prestazione a 2 step (OPT 10 min + visita 50 min): Sala OPT prima, Studio 1 poi", () => {
    const doctor = doctorResource("doc-elisa", "Dott.ssa Elisa Russo");
    const optRoom = roomResource("room-sala-opt", "Sala OPT", ["opt"]);
    const studio1 = roomResource("room-studio-1", "Studio 1", ["studio_odontoiatrico"]);

    const service = buildService("svc-opt-visita", "Visita odontoiatrica con OPT", 60, [
      stepDef(1, 0, 10, { roomCapability: "opt" }),
      stepDef(2, 10, 50, { needsDoctor: true, roomCapability: "studio_odontoiatrico" }),
    ]);

    const baseInput = {
      service,
      from: romeInstant(THU, "09:00"),
      to: romeInstant(THU, "11:00"),
      resources: [doctor, optRoom, studio1],
      shifts: [
        openShift(doctor.id, THU, "09:00", "13:00"),
        openShift(optRoom.id, THU, "09:00", "13:00"),
        openShift(studio1.id, THU, "09:00", "13:00"),
      ],
      activeDoctorIdsForService: [doctor.id],
    };

    const freeSlots = findSlots({ ...baseInput, bookings: [] });

    expect(slotTimes(freeSlots)).toContain("09:00");
    const firstSlot = freeSlots[0];
    expect(firstSlot.start).toBe(romeIso(THU, "09:00"));
    expect(firstSlot.end).toBe(romeIso(THU, "10:00"));
    // La stanza riportata è quella dello step clinico principale (Studio 1).
    expect(firstSlot.roomId).toBe("room-studio-1");

    // Se la Sala OPT è occupata 09:00–09:10, lo slot delle 09:00 non è più valido
    // mentre quello delle 09:15 (OPT 09:15–09:25) resta disponibile.
    const busyOptSlots = findSlots({
      ...baseInput,
      bookings: [booking(optRoom.id, THU, "09:00", "09:10")],
    });

    const times = slotTimes(busyOptSlots);
    expect(times).not.toContain("09:00");
    expect(times).toContain("09:15");
  });

  it("Test 5 — laser con posa crema: il medico è libero durante lo step 1 senza medico", () => {
    const doctor = doctorResource("doc-giulia", "Dott.ssa Giulia Ferrara");
    const cabin = roomResource("room-cabina-laser", "Cabina Laser", ["cabina_laser"]);

    const service = buildService("svc-laser-viso", "Laser viso", 60, [
      stepDef(1, 0, 30, { roomCapability: "cabina_laser" }), // posa crema anestetica
      stepDef(2, 30, 30, { needsDoctor: true }), // trattamento laser
    ]);

    const baseInput = {
      service,
      from: romeInstant(THU, "09:00"),
      to: romeInstant(THU, "11:00"),
      resources: [doctor, cabin],
      shifts: [
        openShift(doctor.id, THU, "09:00", "13:00"),
        openShift(cabin.id, THU, "09:00", "13:00"),
      ],
      activeDoctorIdsForService: [doctor.id],
    };

    // Il medico è impegnato altrove 09:00–09:30: lo step 1 non lo richiede,
    // quindi il percorso può iniziare comunque alle 09:00.
    const doctorBusyDuringCream = findSlots({
      ...baseInput,
      bookings: [booking(doctor.id, THU, "09:00", "09:30")],
    });
    expect(slotTimes(doctorBusyDuringCream)).toContain("09:00");

    // Se invece il medico è occupato durante lo step laser (09:30–10:00),
    // lo slot delle 09:00 deve essere rifiutato.
    const doctorBusyDuringLaser = findSlots({
      ...baseInput,
      bookings: [booking(doctor.id, THU, "09:30", "10:00")],
    });
    expect(slotTimes(doctorBusyDuringLaser)).not.toContain("09:00");
  });

  it("Test 6 — device mobile Laser Acta: rifiuta se il device è occupato in un'altra stanza", () => {
    const doctor = doctorResource("doc-giulia", "Dott.ssa Giulia Ferrara");
    const cabin = roomResource("room-cabina-1", "Studio 2", ["cabina_estetica"]);
    const laserActa = deviceResource("dev-laser-acta", "Laser Acta", ["laser_acta"]);

    const service = buildService("svc-laser-acta", "Laser Acta", 30, [
      stepDef(1, 0, 30, {
        needsDoctor: true,
        roomCapability: "cabina_estetica",
        deviceCapability: "laser_acta",
      }),
    ]);

    const slots = findSlots({
      service,
      from: romeInstant(THU, "09:00"),
      to: romeInstant(THU, "11:00"),
      resources: [doctor, cabin, laserActa],
      shifts: [
        openShift(doctor.id, THU, "09:00", "13:00"),
        openShift(cabin.id, THU, "09:00", "13:00"),
      ],
      // Il Laser Acta è in uso nello Studio 4 dalle 09:00 alle 09:30.
      bookings: [booking(laserActa.id, THU, "09:00", "09:30")],
      activeDoctorIdsForService: [doctor.id],
    });

    const times = slotTimes(slots);
    expect(times).not.toContain("09:00");
    expect(times).not.toContain("09:15");
    expect(times).toContain("09:30");
    expect(slots[0].deviceIds).toEqual(["dev-laser-acta"]);

    const withInactiveDevice = findSlots({
      service,
      from: romeInstant(THU, "09:00"),
      to: romeInstant(THU, "11:00"),
      resources: [doctor, cabin, deviceResource("dev-laser-acta", "Laser Acta", ["laser_acta"], false)],
      shifts: [
        openShift(doctor.id, THU, "09:00", "13:00"),
        openShift(cabin.id, THU, "09:00", "13:00"),
      ],
      bookings: [],
      activeDoctorIdsForService: [doctor.id],
    });
    expect(withInactiveDevice).toHaveLength(0);
  });

  it("Test 7 — rispetta i turni di availability_rules / shifts", () => {
    const doctor = doctorResource("doc-elisa", "Dott.ssa Elisa Russo");
    const room = roomResource("room-studio-1", "Studio 1", ["studio_odontoiatrico"]);

    const service = buildService("svc-visita", "Visita odontoiatrica", 30, [
      stepDef(1, 0, 30, { needsDoctor: true, roomCapability: "studio_odontoiatrico" }),
    ]);

    const slots = findSlots({
      service,
      from: romeInstant(THU, "08:00"),
      to: romeInstant(THU, "12:00"),
      resources: [doctor, room],
      shifts: [
        openShift(doctor.id, THU, "09:00", "10:00"),
        openShift(room.id, THU, "09:00", "10:00"),
      ],
      bookings: [],
      activeDoctorIdsForService: [doctor.id],
    });

    expect(slotTimes(slots)).toEqual(["09:00", "09:15", "09:30"]);

    // Turno spezzato: pausa pranzo tra 10:00 e 11:00.
    const splitShiftSlots = findSlots({
      service,
      from: romeInstant(THU, "08:00"),
      to: romeInstant(THU, "12:00"),
      resources: [doctor, room],
      shifts: [
        openShift(doctor.id, THU, "09:00", "10:00"),
        openShift(doctor.id, THU, "11:00", "12:00"),
        openShift(room.id, THU, "09:00", "12:00"),
      ],
      bookings: [],
      activeDoctorIdsForService: [doctor.id],
    });

    expect(slotTimes(splitShiftSlots)).toEqual(["09:00", "09:15", "09:30", "11:00", "11:15", "11:30"]);

    // Medico non abilitato al servizio: nessuno slot.
    const wrongDoctorSlots = findSlots({
      service,
      from: romeInstant(THU, "08:00"),
      to: romeInstant(THU, "12:00"),
      resources: [doctor, room],
      shifts: [
        openShift(doctor.id, THU, "09:00", "10:00"),
        openShift(room.id, THU, "09:00", "10:00"),
      ],
      bookings: [],
      activeDoctorIdsForService: ["doc-inesistente"],
    });

    expect(wrongDoctorSlots).toHaveLength(0);
  });

  it("Test 8 — salta i festivi e i turni bloccati (ferie)", () => {
    const doctor = doctorResource("doc-elisa", "Dott.ssa Elisa Russo");
    const room = roomResource("room-studio-1", "Studio 1", ["studio_odontoiatrico"]);

    const service = buildService("svc-visita", "Visita odontoiatrica", 30, [
      stepDef(1, 0, 30, { needsDoctor: true, roomCapability: "studio_odontoiatrico" }),
    ]);

    const shifts: ResourceShift[] = [
      openShift(doctor.id, THU, "09:00", "13:00"),
      blockedShift(doctor.id, THU, "00:00", "23:59"),
      openShift(room.id, THU, "09:00", "13:00"),
      openShift(doctor.id, FRI, "09:00", "13:00"),
      openShift(room.id, FRI, "09:00", "13:00"),
    ];

    const holidays = findSlots({
      service,
      from: romeInstant(THU, "09:00"),
      to: romeInstant(THU, "13:00"),
      resources: [doctor, room],
      shifts,
      bookings: [],
      activeDoctorIdsForService: [doctor.id],
    });

    expect(holidays).toHaveLength(0);

    const nextWorkingDay = findSlots({
      service,
      from: romeInstant(FRI, "09:00"),
      to: romeInstant(FRI, "13:00"),
      resources: [doctor, room],
      shifts,
      bookings: [],
      activeDoctorIdsForService: [doctor.id],
    });

    expect(slotTimes(nextWorkingDay)[0]).toBe("09:00");
    expect(nextWorkingDay.length).toBeGreaterThan(0);

    // Giorno senza alcun turno configurato per il medico: nessuno slot.
    const noShiftDay = findSlots({
      service,
      from: romeInstant(SAT, "09:00"),
      to: romeInstant(SAT, "13:00"),
      resources: [doctor, room],
      shifts: [openShift(room.id, SAT, "09:00", "13:00")],
      bookings: [],
      activeDoctorIdsForService: [doctor.id],
    });

    expect(noShiftDay).toHaveLength(0);
  });
});
