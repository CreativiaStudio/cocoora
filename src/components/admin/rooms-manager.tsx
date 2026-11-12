"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Clock,
  DoorOpen,
  Edit2,
  RefreshCw,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";

type DoctorAvailability = {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  doctors?: {
    id: string;
    full_name: string;
    title: string | null;
    is_active?: boolean;
  };
};

type Room = {
  id: string;
  slug: string;
  name: string;
  floor: string | null;
  description: string | null;
  doctor_availability?: DoctorAvailability[];
  isFallback?: boolean;
};

const WEEKDAY_NAMES: Record<number, string> = {
  1: "Lunedì",
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
};

export const ROOM_EQUIPMENT: Record<string, string[]> = {
  "studio-1": [
    "Riunito Odontoiatrico Digitale",
    "Scanner Intraorale 3D",
    "Radiologia Endorale Digitale",
  ],
  "studio-2": [
    "Carbossiterapia Medicale",
    "Criolipolisi Medicale",
    "Ultrasuoni Focalizzati CFU",
  ],
  "studio-3": [
    "Piattaforma Laser Medicale",
    "Laser CO₂ Frazionato",
    "Poltrona Operativa Medicale",
  ],
  "studio-4": [
    "Ecografo Multidisciplinare Condiviso",
    "ECG 12 Derivazioni",
    "Unità Diagnostica Oftalmologica",
  ],
  "sala-opt": [
    "Ortopantomografo Digitale 3D CBCT",
    "Teleradiografia Cranio",
  ],
  "sala-filtro": [
    "Postazione Consulenza Nutrizionale",
    "Bioimpedenziometria Clinica",
  ],
};

type OfficialRoomSpec = {
  slug: string;
  shortBadge: string;
  officialTitle: string;
  defaultFloor: string;
  defaultDescription: string;
  sharedConstraint?: string;
};

const OFFICIAL_ROOM_SPECS: OfficialRoomSpec[] = [
  {
    slug: "studio-1",
    shortBadge: "Studio 1",
    officialTitle: "Studio 1 — Odontoiatria & Ortodonzia",
    defaultFloor: "Piano 1",
    defaultDescription:
      "Ambiente odontoiatrico dedicato a prime visite, conservativa, implantologia, igiene orale e ortodonzia con allineatori trasparenti.",
  },
  {
    slug: "studio-2",
    shortBadge: "Studio 2",
    officialTitle: "Studio 2 — Medicina Estetica Corpo & Carbossiterapia",
    defaultFloor: "Piano 1",
    defaultDescription:
      "Studio dedicato ai protocolli medicali corpo, carbossiterapia medicale, criolipolisi medicale e rimodellamento con ultrasuoni focalizzati CFU.",
  },
  {
    slug: "studio-3",
    shortBadge: "Studio 3",
    officialTitle: "Studio 3 — Chirurgia Plastica, Laser & Medicina Estetica",
    defaultFloor: "Piano 1",
    defaultDescription:
      "Studio operativo per chirurgia plastica, medicina estetica viso e trattamenti avanzati con piattaforma laser medicale e Laser CO₂ frazionato.",
  },
  {
    slug: "studio-4",
    shortBadge: "Studio 4",
    officialTitle: "Studio 4 — Diagnostica, Cardiologia, Ginecologia & Oculistica",
    defaultFloor: "Piano 1",
    defaultDescription:
      "Studio multidisciplinare per diagnostica ecografica, cardiologia con ECG a 12 derivazioni, ginecologia, senologia e unità diagnostica oftalmologica.",
    sharedConstraint:
      "Vincolo Ecografo Condiviso: risorsa unica condivisa tra Cardiologia, Ginecologia, Radiodiagnostica/Ecografia e Senologia senza sovrapposizioni orarie.",
  },
  {
    slug: "sala-opt",
    shortBadge: "Sala Radiologia / OPT",
    officialTitle: "Sala Radiologia / OPT",
    defaultFloor: "Piano 1",
    defaultDescription:
      "Sala schermata per diagnostica radiologica digitale a bassa dose con Ortopantomografo Digitale 3D CBCT e Teleradiografia Cranio.",
  },
  {
    slug: "sala-filtro",
    shortBadge: "Sala Filtro / Nutrizione",
    officialTitle: "Sala Filtro / Nutrizione",
    defaultFloor: "Piano 1",
    defaultDescription:
      "Spazio dedicato a consulenze nutrizionali, bioimpedenziometria clinica e accoglienza dedicata ai Percorsi Salute Cocoora.",
  },
];

function normalizeDoctorDisplayName(rawName: string | undefined | null): string {
  if (!rawName) return "Specialista";
  if (/scorzelli/i.test(rawName)) {
    return "Patrizia Scorzelli";
  }
  return rawName;
}

function isExcludedOrInactiveDoctor(doc?: {
  full_name?: string | null;
  is_active?: boolean;
}): boolean {
  if (!doc) return false;
  if (doc.is_active === false) return true;
  const n = (doc.full_name || "").toLowerCase();
  if (n.includes("sorrentino")) return true;
  return false;
}

function clampShiftTime(timeStr: string, isEnd: boolean): string {
  const clean = (timeStr || "").slice(0, 5);
  if (!/^\d{2}:\d{2}$/.test(clean)) return isEnd ? "19:00" : "09:00";
  if (!isEnd && clean < "09:00") return "09:00";
  if (isEnd && clean > "19:00") return "19:00";
  return clean;
}

function resolveCleanDescription(room: Room, spec?: OfficialRoomSpec): string {
  const raw = (room.description || "").trim();
  if (!spec) {
    return raw || "Studio clinico dedicato a visite specialistiche e trattamenti.";
  }
  if (!raw) return spec.defaultDescription;

  const lower = raw.toLowerCase();
  // Scarta vecchie descrizioni seed invertite tra Studio 1 e Studio 2
  const hasStaleInversion =
    (room.slug === "studio-1" && (lower.includes("ecograf") || lower.includes("elettrocardio"))) ||
    (room.slug === "studio-2" && (lower.includes("riunito") || lower.includes("odontoiatr") || lower.includes("implantolog"))) ||
    (room.slug === "studio-3" && lower.includes("carbossiterapia co2"));

  return hasStaleInversion ? spec.defaultDescription : raw;
}

function mergeWithOfficialRooms(dbRooms: Room[]): Room[] {
  const result: Room[] = OFFICIAL_ROOM_SPECS.map((spec) => {
    const match = dbRooms.find(
      (r) =>
        r.slug === spec.slug ||
        (spec.slug === "sala-opt" && r.name.toLowerCase().includes("opt")) ||
        (spec.slug === "sala-filtro" && r.name.toLowerCase().includes("filtro"))
    );

    if (match) {
      return {
        ...match,
        slug: spec.slug,
      };
    }

    return {
      id: `fallback-${spec.slug}`,
      slug: spec.slug,
      name: spec.officialTitle,
      floor: spec.defaultFloor,
      description: spec.defaultDescription,
      doctor_availability: [],
      isFallback: true,
    };
  });

  const matchedIds = new Set(result.map((r) => r.id));
  for (const extra of dbRooms) {
    if (!matchedIds.has(extra.id) && !OFFICIAL_ROOM_SPECS.some((s) => s.slug === extra.slug)) {
      result.push(extra);
    }
  }

  return result;
}

export function RoomsManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/rooms");
      const data = await res.json();
      setRooms(mergeWithOfficialRooms(Array.isArray(data.rooms) ? data.rooms : []));
    } catch (e) {
      console.error("Errore caricamento stanze", e);
      setRooms(mergeWithOfficialRooms([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom || editingRoom.isFallback) return;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingRoom.id,
          name: editingRoom.name,
          floor: editingRoom.floor,
          description: editingRoom.description,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setEditingRoom(null);
          fetchRooms();
        }, 800);
      } else {
        alert("Errore salvataggio: " + (json.error || "Sconosciuto"));
      }
    } catch {
      alert("Errore di rete durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intestazione */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-accent">
            Infrastruttura Clinica Cocoora
          </p>
          <h2 className="font-serif text-2xl font-semibold text-dark-navy mt-0.5">
            Sale Cliniche &amp; Macchinari Diagnostici
          </h2>
          <p className="text-xs text-charcoal/65 mt-0.5">
            Mappa ufficiale degli Studi 1–4, Sala Radiologia / OPT e Sala Filtro / Nutrizione con dotazioni dedicate.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchRooms}
          className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-semibold text-teal-800 shadow-xs hover:bg-teal-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          Aggiorna
        </button>
      </div>

      {/* Banner Orari Ufficiali & Vincolo Condiviso Ecografo */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/60 p-4 flex items-start gap-3">
          <Clock className="h-4 w-4 text-teal-800 shrink-0 mt-0.5" />
          <div className="text-xs text-charcoal/80">
            <p className="font-semibold text-dark-navy">
              Orari Operativi Ufficiali delle Sale
            </p>
            <p className="mt-0.5">
              <strong>Lun–Ven 09:00–19:00</strong> (Mattina <strong>09:00–14:00</strong> · Pomeriggio{" "}
              <strong>14:00–19:00</strong>), <strong>Sabato chiuso</strong>.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950/85">
            <p className="font-semibold text-amber-950">
              Vincolo Condiviso Ecografo Multidisciplinare (Studio 4)
            </p>
            <p className="mt-0.5">
              L&apos;<strong>Ecografo Multidisciplinare Condiviso</strong> è ripartito senza sovrapposizioni orarie tra{" "}
              <strong>Cardiologia, Ginecologia, Radiodiagnostica/Ecografia e Senologia</strong>.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-charcoal/60">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-teal-700 mb-2" />
          Caricamento stanze dal database clinico...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => {
            const spec = OFFICIAL_ROOM_SPECS.find((s) => s.slug === room.slug);
            const equipment = ROOM_EQUIPMENT[room.slug] || [
              "Postazione Medica Digitale",
              "Accesso Cartella Clinica",
            ];
            const displayTitle = spec ? spec.officialTitle : room.name;
            const badgeLabel = spec ? spec.shortBadge : room.name;
            const description = resolveCleanDescription(room, spec);

            const activeShifts = (room.doctor_availability || []).filter(
              (av) =>
                av.weekday >= 1 &&
                av.weekday <= 5 &&
                av.is_active !== false &&
                !isExcludedOrInactiveDoctor(av.doctors)
            );

            return (
              <div
                key={room.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-teal-400"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-dark-navy px-3 py-1 text-xs font-semibold text-white">
                      <DoorOpen className="h-3.5 w-3.5 text-teal-300" />
                      {badgeLabel}
                    </span>
                    <span className="text-[11px] font-medium text-charcoal/60 bg-slate-100 rounded-full px-2.5 py-0.5">
                      {room.floor || spec?.defaultFloor || "Piano 1"}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-base font-semibold text-dark-navy leading-snug">
                    {displayTitle}
                  </h3>

                  <p className="mt-2 text-xs text-charcoal/75 leading-relaxed">
                    {description}
                  </p>

                  {spec?.sharedConstraint && (
                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] font-medium text-amber-950">
                      {spec.sharedConstraint}
                    </div>
                  )}

                  {/* Dotazione tecnologica */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-teal-700" /> Macchinari &amp; Dotazioni Ufficiali
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {equipment.map((eq, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-teal-50/80 border border-teal-100 px-2 py-1 text-[11px] font-medium text-teal-900"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Medici con Turni in questa Stanza (Lun–Ven 09:00–19:00) */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent flex items-center gap-1">
                        <Stethoscope className="h-3 w-3 text-teal-700" /> Turni Attivi ({activeShifts.length})
                      </p>
                      <span className="text-[10px] font-semibold text-teal-800">
                        Lun–Ven 09:00–19:00
                      </span>
                    </div>
                    {activeShifts.length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {activeShifts.map((av, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-[11px] bg-slate-50 rounded-lg p-2 border border-slate-100"
                          >
                            <span className="font-semibold text-dark-navy truncate max-w-[145px]">
                              {normalizeDoctorDisplayName(av.doctors?.full_name)}
                            </span>
                            <span className="text-charcoal/65 font-mono text-[10.5px] whitespace-nowrap">
                              {WEEKDAY_NAMES[av.weekday]?.slice(0, 3)}{" "}
                              {clampShiftTime(av.start_time, false)}–{clampShiftTime(av.end_time, true)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal/50 italic">
                        Allocazione su agenda clinica (Lun–Ven 09:00–19:00 · Sabato chiuso)
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10.5px] text-charcoal/55 font-medium">
                    Sabato chiuso
                  </span>
                  {!room.isFallback ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoom({
                          ...room,
                          description,
                        });
                        setSaveSuccess(false);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-dark-navy transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Modifica Stanza
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-teal-700">
                      Mappa Ufficiale Attiva
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL MODIFICA STANZA */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-navy/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100">
            <button
              type="button"
              onClick={() => setEditingRoom(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal/50 hover:bg-slate-100 hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-serif text-xl font-semibold text-dark-navy">
              Modifica: {editingRoom.name}
            </h3>
            <p className="mt-1 text-xs text-charcoal/60">
              Aggiorna nome, piano e descrizione operativa della stanza (Lun–Ven 09:00–19:00, Sabato chiuso).
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Nome Stanza *
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Piano / Livello
                </label>
                <input
                  type="text"
                  value={editingRoom.floor || ""}
                  onChange={(e) => setEditingRoom({ ...editingRoom, floor: e.target.value })}
                  placeholder="es. Piano 1, Piano Terra"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Descrizione Clinica &amp; Destinazione d&apos;Uso
                </label>
                <textarea
                  rows={3}
                  value={editingRoom.description || ""}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
                  <Check className="h-4 w-4" /> Stanza aggiornata con successo nel gestionale!
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-charcoal hover:bg-slate-50 transition-colors"
                >
                  Annulla
                </button>
                <Button type="submit" disabled={saving} size="sm">
                  {saving ? "Salvataggio..." : "Salva Modifiche"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
