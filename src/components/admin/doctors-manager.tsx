"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Edit2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";

type Slot = {
  id?: string;
  room_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes?: number;
  clinic_rooms?: { id: string; name: string };
};

type Doctor = {
  id: string;
  slug: string;
  full_name: string;
  title: string | null;
  badge: string | null;
  affiliation: string | null;
  specialty_slug: string | null;
  branch_id: string | null;
  bio: string | null;
  tariffa_visita: number;
  is_active: boolean;
  doctor_availability?: Slot[];
};

type Room = { id: string; slug: string; name: string; floor: string | null };
type Branch = { id: string; slug: string; name: string };

const WEEKDAY_NAMES: Record<number, string> = {
  1: "Lunedì",
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
  6: "Sabato",
};

export function DoctorsManager() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/doctors");
      const data = await res.json();
      if (data.doctors) setDoctors(data.doctors);
      if (data.rooms) setRooms(data.rooms);
      if (data.branches) setBranches(data.branches);
    } catch (e) {
      console.error("Errore caricamento medici", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const openNewDoctor = () => {
    setEditingDoctor({
      id: "",
      slug: "",
      full_name: "",
      title: "",
      badge: "",
      affiliation: "",
      specialty_slug: "",
      branch_id: branches[0]?.id || null,
      bio: "",
      tariffa_visita: 0,
      is_active: true,
      doctor_availability: [
        {
          room_id: rooms[0]?.id || "",
          weekday: 1,
          start_time: "09:00",
          end_time: "13:30",
          slot_minutes: 30,
        },
      ],
    });
    setIsNew(true);
    setSaveSuccess(false);
  };

  const openEditDoctor = (doc: Doctor) => {
    setEditingDoctor({
      ...doc,
      doctor_availability: (doc.doctor_availability || []).map((s) => ({
        id: s.id,
        room_id: s.room_id || rooms[0]?.id || "",
        weekday: s.weekday,
        start_time: s.start_time.slice(0, 5),
        end_time: s.end_time.slice(0, 5),
        slot_minutes: s.slot_minutes || 30,
      })),
    });
    setIsNew(false);
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingDoctor,
          slots: editingDoctor.doctor_availability,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setEditingDoctor(null);
          fetchDoctors();
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

  const addSlot = () => {
    if (!editingDoctor) return;
    setEditingDoctor({
      ...editingDoctor,
      doctor_availability: [
        ...(editingDoctor.doctor_availability || []),
        {
          room_id: rooms[0]?.id || "",
          weekday: 1,
          start_time: "09:00",
          end_time: "13:30",
          slot_minutes: 30,
        },
      ],
    });
  };

  const removeSlot = (index: number) => {
    if (!editingDoctor) return;
    const next = [...(editingDoctor.doctor_availability || [])];
    next.splice(index, 1);
    setEditingDoctor({ ...editingDoctor, doctor_availability: next });
  };

  const filtered = doctors.filter(
    (d) =>
      d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (d.title && d.title.toLowerCase().includes(search.toLowerCase())) ||
      (d.badge && d.badge.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Azioni e Filtro */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca medico, titolo, specialità..."
            className="w-full rounded-full border border-teal-200 bg-white py-2 pl-10 pr-4 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 shadow-xs focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchDoctors}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-semibold text-teal-800 shadow-xs hover:bg-teal-50 transition-colors"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            Aggiorna
          </button>
          <Button onClick={openNewDoctor} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Nuovo Medico
          </Button>
        </div>
      </div>

      {/* Griglia Medici */}
      {loading ? (
        <div className="p-12 text-center text-sm text-charcoal/60">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-teal-700 mb-2" />
          Caricamento medici da Supabase...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-200 p-12 text-center text-charcoal/60">
          Nessun medico trovato con i criteri specificati.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all hover:border-teal-400"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-dark-navy">
                      {doc.full_name}
                    </h3>
                    {doc.title && (
                      <p className="mt-0.5 text-xs text-charcoal/70 line-clamp-2">{doc.title}</p>
                    )}
                  </div>
                  {doc.badge && (
                    <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-teal-800 uppercase border border-teal-200/60">
                      {doc.badge}
                    </span>
                  )}
                </div>

                {doc.affiliation && (
                  <p className="mt-2 text-[11px] text-teal-900/80 font-medium flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 text-teal-600 shrink-0" />
                    <span className="truncate">{doc.affiliation}</span>
                  </p>
                )}

                {/* Disponibilità e Stanza */}
                <div className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
                    Presenza Settimanale &amp; Stanze:
                  </p>
                  {doc.doctor_availability && doc.doctor_availability.length > 0 ? (
                    doc.doctor_availability.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-slate-50/80 rounded-lg px-2.5 py-1 text-charcoal/80"
                      >
                        <span className="font-medium text-dark-navy flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-teal-700" />
                          {WEEKDAY_NAMES[s.weekday] || `Giorno ${s.weekday}`}
                        </span>
                        <span className="text-[11px] text-charcoal/60 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-accent" />
                          {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}
                        </span>
                        <span className="text-[11px] font-semibold text-teal-900 bg-teal-100/60 rounded px-1.5 py-0.5">
                          {s.clinic_rooms?.name || "Studio 1"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-amber-700 italic">Disponibilità da definire</span>
                  )}
                </div>
              </div>

              {/* Azioni */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    doc.is_active ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {doc.is_active ? "Attivo" : "Non attivo"}
                </span>
                <button
                  type="button"
                  onClick={() => openEditDoctor(doc)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-dark-navy transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Modifica
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL MODIFICA / NUOVO MEDICO */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-navy/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100 my-8">
            <button
              type="button"
              onClick={() => setEditingDoctor(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal/50 hover:bg-slate-100 hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <User className="h-5 w-5 text-teal-700" />
              <h2 className="font-serif text-xl font-semibold text-dark-navy">
                {isNew ? "Aggiungi Nuovo Medico" : `Modifica: ${editingDoctor.full_name}`}
              </h2>
            </div>
            <p className="mt-1 text-xs text-charcoal/60">
              Aggiorna qualifica, stanza di visita e slot settimanali su Supabase.
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-dark-navy mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.full_name}
                    onChange={(e) =>
                      setEditingDoctor({ ...editingDoctor, full_name: e.target.value })
                    }
                    placeholder="es. Dr. Mario Rossi"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark-navy mb-1">
                    Slug Identificativo URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.slug}
                    onChange={(e) =>
                      setEditingDoctor({ ...editingDoctor, slug: e.target.value })
                    }
                    placeholder="es. mario-rossi"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-dark-navy mb-1">
                    Titolo Clinico / Specializzazione
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.title || ""}
                    onChange={(e) =>
                      setEditingDoctor({ ...editingDoctor, title: e.target.value })
                    }
                    placeholder="es. Specialista in Cardiologia"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark-navy mb-1">
                    Badge in Evidenza
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.badge || ""}
                    onChange={(e) =>
                      setEditingDoctor({ ...editingDoctor, badge: e.target.value })
                    }
                    placeholder="es. Direttrice Sanitaria / Docente Universitario"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-navy mb-1">
                  Affiliazione Accademica / Ospedaliera
                </label>
                <input
                  type="text"
                  value={editingDoctor.affiliation || ""}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, affiliation: e.target.value })
                  }
                  placeholder="es. Università degli Studi di Napoli Federico II"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                />
              </div>

              {/* Slot Settimanali x Stanze */}
              <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-teal-700" />
                    Incrocio Disponibilità Settimanale &amp; Stanza
                  </span>
                  <button
                    type="button"
                    onClick={addSlot}
                    className="text-xs font-bold text-teal-800 hover:text-dark-navy inline-flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Aggiungi Giorno
                  </button>
                </div>

                {editingDoctor.doctor_availability && editingDoctor.doctor_availability.length > 0 ? (
                  editingDoctor.doctor_availability.map((s, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-xs"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal/60 mb-0.5">
                          Giorno
                        </label>
                        <select
                          value={s.weekday}
                          onChange={(e) => {
                            const next = [...(editingDoctor.doctor_availability || [])];
                            next[idx].weekday = Number(e.target.value);
                            setEditingDoctor({ ...editingDoctor, doctor_availability: next });
                          }}
                          className="w-full rounded-lg border border-slate-200 p-1.5 text-xs text-dark-navy font-semibold"
                        >
                          {Object.entries(WEEKDAY_NAMES).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-charcoal/60 mb-0.5">
                          Stanza Assegnata
                        </label>
                        <select
                          value={s.room_id}
                          onChange={(e) => {
                            const next = [...(editingDoctor.doctor_availability || [])];
                            next[idx].room_id = e.target.value;
                            setEditingDoctor({ ...editingDoctor, doctor_availability: next });
                          }}
                          className="w-full rounded-lg border border-slate-200 p-1.5 text-xs text-dark-navy font-semibold"
                        >
                          {rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-charcoal/60 mb-0.5">
                          Orario (Inizio–Fine)
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="time"
                            value={s.start_time}
                            onChange={(e) => {
                              const next = [...(editingDoctor.doctor_availability || [])];
                              next[idx].start_time = e.target.value;
                              setEditingDoctor({ ...editingDoctor, doctor_availability: next });
                            }}
                            className="w-full rounded-lg border border-slate-200 p-1 text-xs"
                          />
                          <span className="text-xs text-charcoal/50">–</span>
                          <input
                            type="time"
                            value={s.end_time}
                            onChange={(e) => {
                              const next = [...(editingDoctor.doctor_availability || [])];
                              next[idx].end_time = e.target.value;
                              setEditingDoctor({ ...editingDoctor, doctor_availability: next });
                            }}
                            className="w-full rounded-lg border border-slate-200 p-1 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => removeSlot(idx)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Rimuovi orario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-charcoal/60 italic py-2">
                    Nessun orario assegnato. Clicca &quot;Aggiungi Giorno&quot; per configurare la presenza.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="doc_active"
                  checked={editingDoctor.is_active}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, is_active: e.target.checked })
                  }
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                />
                <label htmlFor="doc_active" className="text-xs font-semibold text-dark-navy">
                  Medico attivo e visibile nelle agende cliniche
                </label>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
                  <Check className="h-4 w-4" /> Dati salvati con successo su Supabase!
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-charcoal hover:bg-slate-50 transition-colors"
                >
                  Annulla
                </button>
                <Button type="submit" disabled={saving} size="sm">
                  {saving ? "Salvataggio..." : "Salva su Supabase"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
