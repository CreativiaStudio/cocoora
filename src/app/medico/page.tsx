"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  LogOut,
  Search,
  Shield,
  Stethoscope,
  User,
} from "lucide-react";
import type { UserSession } from "@/lib/auth-session";

interface DoctorAppointment {
  id: string;
  time: string;
  patientName: string;
  service: string;
  room: string;
  status: "in_attesa" | "in_corso" | "completata";
  notes?: string;
}

const DEMO_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: "app-1",
    time: "09:30",
    patientName: "Marco Esposito",
    service: "Visita Specialistica Dermatologica",
    room: "Studio 1 — Rigenerazione",
    status: "in_attesa",
    notes: "Paziente con anamnesi pregressa dermatite",
  },
  {
    id: "app-2",
    time: "10:45",
    patientName: "Chiara De Luca",
    service: "Valutazione Percorso Longevity Precision",
    room: "Studio 2 — Diagnostica",
    status: "in_attesa",
    notes: "Referto microbiota caricato",
  },
  {
    id: "app-3",
    time: "12:00",
    patientName: "Giuseppe Ferrara",
    service: "Controllo Post-Trattamento",
    room: "Studio 1 — Rigenerazione",
    status: "in_attesa",
    notes: "Valutazione a 30 giorni",
  },
];

export default function DoctorPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [appointments, setAppointments] = useState(DEMO_APPOINTMENTS);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const markStatus = (id: string, status: "in_corso" | "completata") => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-[#1c2c34] font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-teal-100 bg-white px-4 sm:px-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-teal-900 p-1.5 border border-teal-500/20">
            <Image
              src="/cocoora-symbol.png"
              alt="Cocoora"
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-teal-950 tracking-tight">
              Cocoora Centro Medico
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-teal-700/80 font-semibold">
              Cartella Clinica &amp; Studio Medico
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/50 px-3 py-1 text-xs text-teal-900">
            <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
            <span className="font-semibold">{user?.name || "Dott.ssa Elisa Russo"}</span>
            <span className="text-teal-400">·</span>
            <span className="text-[11px] text-teal-700">Medico Chirurgo</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Esci</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-teal-950">
              Agenda Pazienti di Oggi
            </h2>
            <p className="mt-1 text-xs text-charcoal/70">
              Gestione visite ambulatoriali, note cliniche e completamento refertazione.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                placeholder="Cerca paziente..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-teal-200 bg-white py-1.5 pl-8 pr-3 text-xs outline-none focus:border-teal-600"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {appointments
            .filter((a) => a.patientName.toLowerCase().includes(filter.toLowerCase()))
            .map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-4 rounded-2xl border border-teal-100 bg-white p-5 shadow-xs transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 font-mono text-sm font-bold text-teal-800">
                    {app.time}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-teal-950">{app.patientName}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          app.status === "completata"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : app.status === "in_corso"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {app.status === "completata"
                          ? "Completata"
                          : app.status === "in_corso"
                          ? "In Visita"
                          : "In Attesa"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-teal-700">{app.service}</p>
                    <p className="mt-1 text-[11px] text-charcoal/60">
                      {app.room} {app.notes && `· Note: ${app.notes}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-teal-50">
                  {app.status !== "completata" && (
                    <>
                      {app.status !== "in_corso" && (
                        <button
                          onClick={() => markStatus(app.id, "in_corso")}
                          className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700 cursor-pointer"
                        >
                          Avvia Visita
                        </button>
                      )}
                      <button
                        onClick={() => markStatus(app.id, "completata")}
                        className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer"
                      >
                        Completa
                      </button>
                    </>
                  )}
                  {app.status === "completata" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Visita Refertata
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
