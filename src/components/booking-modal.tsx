"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  Clock,
  Lock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Timer,
  X,
} from "lucide-react";
import { useShop } from "./providers";
import { trackLead } from "@/lib/tracking";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

type Specialty = { id: string; label: string; doctor: string };

const SPECIALTIES: Specialty[] = [
  { id: "odontoiatria", label: "Odontoiatria & Allineatori", doctor: "Dr. Sorrentino" },
  { id: "cardiologia", label: "Cardiologia & ECG", doctor: "Dr. Esposito" },
  { id: "medicina-estetica", label: "Medicina Estetica", doctor: "Dr.ssa Del Prete" },
  { id: "ginecologia", label: "Ginecologia & Pelvica", doctor: "Dr.ssa Caputo" },
  { id: "senologia", label: "Senologia & Ecografia", doctor: "Dr.ssa Coppola" },
  { id: "ecografia", label: "Ecografia Rapida", doctor: "Dr. Iovine" },
  { id: "oculistica", label: "Oculistica", doctor: "Dr.ssa Russo" },
  { id: "pediatria", label: "Pediatria", doctor: "Dr.ssa Amato" },
];

const MORNING = ["09:30", "11:00", "12:15"];
const AFTERNOON = ["15:30", "17:00", "18:30"];

const STORAGE_KEY = "cocoora-patient-profile";

function findSpecialty(query?: string): Specialty {
  if (query) {
    const q = query.toLowerCase();
    const match = SPECIALTIES.find(
      (s) =>
        s.id === q ||
        s.label.toLowerCase().includes(q) ||
        q.includes(s.id) ||
        s.doctor.toLowerCase().includes(q)
    );
    if (match) return match;
  }
  return SPECIALTIES[0];
}

type SlotDay = { key: string; tag: string; weekday: string; long: string; date: Date };

function buildDays(): SlotDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: SlotDay[] = [];
  let offset = 1;
  while (days.length < 3) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    if (d.getDay() !== 0) {
      const tag = offset === 1 ? "Domani" : offset === 2 ? "Dopodomani" : `+${offset} giorni`;
      days.push({
        key: d.toISOString().slice(0, 10),
        tag,
        weekday: d.toLocaleDateString("it-IT", { weekday: "short" }),
        long: d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" }),
        date: d,
      });
    }
    offset += 1;
  }
  return days;
}

// Occupazione simulata e deterministica: qualche slot risulta già preso.
function isTaken(seed: string): boolean {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 5 === 0;
}

function generatePatientId(): string {
  return `CCR-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function BookingModal() {
  const { bookingOpen, bookingSpecialty, closeBooking } = useShop();
  if (!bookingOpen) return null;
  return <BookingDialog initialSpecialty={bookingSpecialty} onClose={closeBooking} />;
}

function BookingDialog({
  initialSpecialty,
  onClose,
}: {
  initialSpecialty?: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [specialty, setSpecialty] = useState<Specialty>(() => findSpecialty(initialSpecialty));
  const days = useMemo(buildDays, []);
  const [dayKey, setDayKey] = useState(days[0].key);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", telefono: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  const day = days.find((d) => d.key === dayKey) ?? days[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (step !== 2) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const pickSlot = (t: string) => {
    setTime(t);
    setSecondsLeft(15 * 60);
    setStep(2);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.telefono.trim() || !form.email.trim() || !form.password) {
      setError("Compila tutti i campi per attivare il tuo profilo.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Inserisci un indirizzo email valido.");
      return;
    }
    if (form.password.length < 8) {
      setError("La password deve contenere almeno 8 caratteri.");
      return;
    }
    setError("");

    const id = generatePatientId();
    trackLead({ email: form.email.trim(), name: form.nome.trim() });
    try {
      // La password non viene mai salvata: in questa demo serve solo a simulare l'onboarding.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          patientId: id,
          nome: form.nome.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim(),
          booking: {
            specialty: specialty.label,
            doctor: specialty.doctor,
            date: day.key,
            time,
          },
          createdAt: new Date().toISOString(),
        })
      );
    } catch {
      // localStorage non disponibile: la demo prosegue comunque.
    }
    setPatientId(id);
    setStep(3);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const firstName = form.nome.trim().split(/\s+/)[0];

  const inputCls =
    "w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-teal-600";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Prenota la tua visita"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-dark-navy/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative max-h-[94vh] w-full max-w-2xl animate-fade-up overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-9">
        <button
          type="button"
          aria-label="Chiudi"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-charcoal/50 transition-colors hover:bg-teal-50 hover:text-charcoal"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 1 && (
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Slot garantiti entro 72h a Napoli
            </span>
            <h3 className="mt-4 pr-8 font-serif text-2xl font-semibold text-dark-navy sm:text-3xl">
              Prenota la tua Visita senza Attese
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Scegli la branca, il giorno e l&apos;orario che preferisci: blocchiamo lo slot per te.
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-teal-800">
              1 · Specialità
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => {
                const active = s.id === specialty.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSpecialty(s)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-4 py-2 text-left text-xs font-medium transition-all",
                      active
                        ? "border-primary-teal bg-primary-teal text-white shadow-md"
                        : "border-teal-200 bg-white text-teal-900 hover:border-teal-400 hover:bg-teal-50"
                    )}
                  >
                    {s.label}
                    <span className={cn("ml-1 font-normal", active ? "text-teal-100" : "text-charcoal/50")}>
                      · {s.doctor}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-teal-800">
              2 · Giorno
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {days.map((d) => {
                const active = d.key === dayKey;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDayKey(d.key)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-2xl border px-3 py-3 text-center transition-all",
                      active
                        ? "border-primary-teal bg-teal-50 ring-2 ring-primary-teal/30"
                        : "border-teal-100 bg-white hover:border-teal-300"
                    )}
                  >
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-teal-700">
                      {d.tag}
                    </span>
                    <span className="mt-0.5 block font-serif text-lg font-semibold capitalize text-dark-navy">
                      {d.weekday} {d.date.getDate()}
                    </span>
                    <span className="block text-[11px] capitalize text-charcoal/55">
                      {d.date.toLocaleDateString("it-IT", { month: "short" })}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-teal-800">
              3 · Orario
            </p>
            <div className="mt-3 space-y-3">
              {[
                { label: "Mattina", slots: MORNING },
                { label: "Pomeriggio", slots: AFTERNOON },
              ].map((group) => (
                <div key={group.label} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-xs font-medium text-charcoal/60">
                    {group.label}
                  </span>
                  <div className="grid flex-1 grid-cols-3 gap-2">
                    {group.slots.map((t) => {
                      const taken = isTaken(`${specialty.id}-${dayKey}-${t}`);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={taken}
                          onClick={() => pickSlot(t)}
                          className={cn(
                            "rounded-full border py-2.5 text-sm font-semibold transition-all",
                            taken
                              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                              : "border-teal-200 bg-white text-teal-900 hover:-translate-y-0.5 hover:border-primary-teal hover:bg-primary-teal hover:text-white hover:shadow-md"
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-charcoal/55">
              <Clock className="h-3.5 w-3.5 text-teal-700" />
              Seleziona un orario per bloccare subito lo slot.
            </p>
          </div>
        )}

        {step === 2 && time && (
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-dark-navy"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Cambia slot
            </button>

            <div className="mt-4 rounded-2xl bg-teal-50 p-4 ring-1 ring-teal-100">
              <div className="flex items-start gap-3">
                <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                <div className="text-sm leading-relaxed text-dark-navy">
                  <p>
                    <span className="font-semibold">Slot selezionato:</span>{" "}
                    <span className="capitalize">{day.long}</span> alle ore{" "}
                    <span className="font-semibold">{time}</span> con {specialty.doctor}
                    <span className="text-charcoal/60"> · {specialty.label}</span>
                  </p>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <Timer className="h-3.5 w-3.5" />
                    {secondsLeft > 0
                      ? `Bloccato per 15 min · scade tra ${mm}:${ss}`
                      : "Blocco scaduto: conferma ora per verificare la disponibilità"}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="mt-6 font-serif text-2xl font-semibold text-dark-navy">
              Attiva il tuo Profilo Digitale
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
              Per confermare l&apos;appuntamento senza liste d&apos;attesa e accedere alla tua
              cartella clinica con referti h24, attiva il tuo Profilo Digitale Cocoora (Accesso
              Gratuito 0€).
            </p>

            <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-teal-900">
                  Nome e Cognome
                </span>
                <input
                  value={form.nome}
                  autoComplete="name"
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className={inputCls}
                  placeholder="Mario Rossi"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-teal-900">
                  Cellulare{" "}
                  <span className="font-normal text-charcoal/50">(promemoria WhatsApp e SMS)</span>
                </span>
                <input
                  type="tel"
                  value={form.telefono}
                  autoComplete="tel"
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className={inputCls}
                  placeholder="+39 333 123 4567"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-teal-900">Email</span>
                <input
                  type="email"
                  value={form.email}
                  autoComplete="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                  placeholder="nome@email.it"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-teal-900">
                  Password{" "}
                  <span className="font-normal text-charcoal/50">(per il tuo accesso all&apos;Area Paziente)</span>
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" />
                  <input
                    type="password"
                    value={form.password}
                    autoComplete="new-password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={cn(inputCls, "pl-11")}
                    placeholder="Almeno 8 caratteri"
                  />
                </div>
              </label>

              {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}

              <div className="sm:col-span-2">
                <Button type="submit" className="w-full" size="lg">
                  Conferma Prenotazione &amp; Crea Account (0€)
                </Button>
                <p className="mt-3 flex items-start justify-center gap-2 text-center text-[11px] leading-relaxed text-charcoal/60">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  Zero costi di attivazione · Nessun pagamento anticipato · Annullamento gratuito
                  fino a 24h prima
                </p>
              </div>
            </form>
          </div>
        )}

        {step === 3 && time && (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="flex h-20 w-20 animate-fade-up items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-dark-navy sm:text-3xl">
              Richiesta Confermata &amp; Profilo Attivo!
            </h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Benvenuto in Cocoora{firstName ? `, ${firstName}` : ""}. La tua area paziente è pronta.
            </p>

            <div className="mt-5 w-full max-w-sm rounded-2xl bg-gradient-to-br from-dark-navy to-primary-teal p-5 text-left text-white shadow-xl">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-100/80">
                <span>Tessera Sanitaria Digitale</span>
                <span>Cocoora</span>
              </div>
              <p className="mt-4 font-mono text-2xl font-semibold tracking-widest">{patientId}</p>
              <p className="mt-3 truncate text-sm font-medium">{form.nome.trim()}</p>
              <p className="truncate text-xs text-teal-100/80">{form.email.trim()}</p>
            </div>

            <div className="mt-5 w-full space-y-3 rounded-2xl bg-teal-50 p-4 text-left text-sm text-dark-navy ring-1 ring-teal-100">
              <p className="flex items-start gap-3">
                <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <span>
                  <span className="capitalize">{day.long}</span> alle ore{" "}
                  <span className="font-semibold">{time}</span> · {specialty.label} con{" "}
                  {specialty.doctor}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <span>
                  {SITE.address}, Napoli — Cocoora Studio Medico
                </span>
              </p>
              <p className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <span>
                  La segreteria ha inviato la conferma su WhatsApp ed Email. Annullamento gratuito
                  fino a 24h prima.
                </span>
              </p>
            </div>

            <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
              <Button onClick={onClose} size="md">
                Accedi alla tua Area Paziente (Demo)
              </Button>
              <Button onClick={onClose} variant="secondary" size="md">
                Chiudi
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
