"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Check,
  Clock,
  DoorOpen,
  Edit2,
  Layers,
  MapPin,
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
  doctors?: {
    id: string;
    full_name: string;
    title: string | null;
  };
};

type Room = {
  id: string;
  slug: string;
  name: string;
  floor: string | null;
  description: string | null;
  doctor_availability?: DoctorAvailability[];
};

const WEEKDAY_NAMES: Record<number, string> = {
  1: "Lunedì",
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
  6: "Sabato",
};

const ROOM_EQUIPMENT: Record<string, string[]> = {
  "studio-1": [
    "Ecografo HD Multidisciplinare",
    "Elettrocardiografo Digitale",
    "Postazione Visite Specialistiche",
    "Refertazione Digitale h24",
  ],
  "studio-2": [
    "Riunito Odontoiatrico Digitale",
    "Scanner Ottico 3D",
    "Aspirazione Chirurgica",
    "Kit Allineatori & Implantologia",
  ],
  "studio-3": [
    "Piattaforma Laser Medicale Quadri-Manipolo",
    "Cryoliposculpt Medicale",
    "Ultrasuoni Focalizzati CFU",
    "Carbossiterapia CO2 Medicale",
  ],
};

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
      if (data.rooms) setRooms(data.rooms);
    } catch (e) {
      console.error("Errore caricamento stanze", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

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
    } catch (err: unknown) {
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
          <p className="text-xs text-charcoal/60 mt-0.5">
            Gestisci la destinazione d&apos;uso e i turni medici assegnati a ciascun ambiente.
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

      {loading ? (
        <div className="p-12 text-center text-sm text-charcoal/60">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-teal-700 mb-2" />
          Caricamento stanze dal database clinico...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {rooms.map((room) => {
            const equipment = ROOM_EQUIPMENT[room.slug] || [
              "Postazione Medica Digitale",
              "Accesso Cartella Clinica",
            ];
            const activeDoctors = room.doctor_availability || [];

            return (
              <div
                key={room.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-teal-400"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-dark-navy px-3 py-1 text-xs font-semibold text-white">
                      <DoorOpen className="h-3.5 w-3.5 text-teal-300" />
                      {room.name}
                    </span>
                    <span className="text-[11px] font-medium text-charcoal/60 bg-slate-100 rounded-full px-2.5 py-0.5">
                      {room.floor || "Piano 1"}
                    </span>
                  </div>

                  <p className="mt-3.5 text-xs text-charcoal/75 leading-relaxed">
                    {room.description || "Ambulatorio clinico dedicato alle visite e trattamenti."}
                  </p>

                  {/* Dotazione tecnologica */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-teal-700" /> Macchinari &amp; Dotazioni
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

                  {/* Medici con Turni in questa Stanza */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent mb-2 flex items-center gap-1">
                      <Stethoscope className="h-3 w-3 text-teal-700" /> Medici Assegnati ({activeDoctors.length} turni)
                    </p>
                    {activeDoctors.length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {activeDoctors.map((av, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-[11px] bg-slate-50 rounded-lg p-2 border border-slate-100"
                          >
                            <span className="font-semibold text-dark-navy truncate max-w-[130px]">
                              {av.doctors?.full_name || "Medico"}
                            </span>
                            <span className="text-charcoal/60 whitespace-nowrap">
                              {WEEKDAY_NAMES[av.weekday]?.slice(0, 3)} {av.start_time.slice(0, 5)}–{av.end_time.slice(0, 5)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal/50 italic">Nessun medico programmato</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRoom(room);
                      setSaveSuccess(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-dark-navy transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Modifica Stanza
                  </button>
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
              Aggiorna nome, piano e descrizione operativa della stanza.
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
