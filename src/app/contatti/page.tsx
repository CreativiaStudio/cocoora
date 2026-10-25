"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  Train,
} from "lucide-react";
import { useCms } from "@/components/providers";
import { SITE } from "@/lib/site";
import { trackLead } from "@/lib/tracking";
import { Badge, Button, Container, SectionLabel } from "@/components/ui";

const SERVICES = [
  "Odontoiatria & Ortodonzia",
  "Medicina Estetica & Rigenerativa",
  "Visite Specialistiche & Diagnostica",
  "Cocoora Club",
  "Cocoora Precision",
  "Altro / Non lo so ancora",
];

type FormState = {
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  servizio: string;
  messaggio: string;
  consenso: boolean;
};

const INITIAL_FORM: FormState = {
  nome: "",
  cognome: "",
  telefono: "",
  email: "",
  servizio: SERVICES[0],
  messaggio: "",
  consenso: false,
};

export default function ContattiPage() {
  const { pages } = useCms();
  const page = pages.find((p) => p.path === "/contatti");

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.cognome.trim() || !form.telefono.trim() || !form.email.trim()) {
      setError("Compila tutti i campi obbligatori per proseguire.");
      return;
    }
    if (!form.consenso) {
      setError("Per proseguire è necessario accettare l'informativa privacy.");
      return;
    }
    setError("");
    setSending(true);

    try {
      trackLead({ email: form.email, name: `${form.nome} ${form.cognome}`.trim() });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Errore durante l'invio della richiesta. Riprova più tardi.");
      }

      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Si è verificato un errore imprevisto. Riprova.";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSent(false);
    setError("");
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-mesh relative overflow-hidden pb-16 pt-32 sm:pt-36">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto">Contatti & Prenotazioni</Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              {page?.h1 ?? "Prenota la tua visita in meno di 2 minuti."}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Scrivici, chiamaci o compila il form: il nostro team ti risponde
              rapidamente per organizzare il tuo percorso di salute, senza attese
              e senza burocrazia.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Informazioni Cliniche + Form ─────────────────────────────── */}
      <section className="bg-canvas py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* Info Cliniche */}
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-teal-100 bg-white p-8 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)]">
                <SectionLabel>Dove Siamo</SectionLabel>
                <h2 className="font-serif text-2xl font-semibold text-teal-900">
                  Cocoora Centro Medico
                </h2>
                <ul className="mt-6 space-y-4 text-sm text-charcoal/80">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <span>{SITE.address}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-teal-800">
                      {SITE.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-900">
                        Email Istituzionali
                      </p>
                      <div className="grid gap-1">
                        <a href={`mailto:${SITE.emails.info}`} className="block hover:text-teal-800">
                          <span className="font-medium text-dark-navy">Informazioni:</span> {SITE.emails.info}
                        </a>
                        <a href={`mailto:${SITE.emails.prenotazioni}`} className="block hover:text-teal-800">
                          <span className="font-medium text-dark-navy">Prenotazioni:</span> {SITE.emails.prenotazioni}
                        </a>
                        <a href={`mailto:${SITE.emails.amministrazione}`} className="block hover:text-teal-800">
                          <span className="font-medium text-dark-navy">Amministrazione:</span> {SITE.emails.amministrazione}
                        </a>
                        <a href={`mailto:${SITE.emails.direzioneSanitaria}`} className="block hover:text-teal-800">
                          <span className="font-medium text-dark-navy">Direzione Sanitaria:</span> {SITE.emails.direzioneSanitaria}
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <span>
                      Lun–Ven · 8:00–20:00 <span className="font-medium text-teal-700">(Orario continuato)</span>
                      <br />
                      Sab · 9:00–14:00
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Train className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <span>
                      Raggiungibile comodamente con la metropolitana; parcheggi
                      convenzionati disponibili nelle vicinanze.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Emergenze & WhatsApp */}
              <div className="rounded-[2rem] border border-teal-100 bg-white p-8 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)]">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-teal-700" />
                  <h3 className="font-serif text-xl font-semibold text-teal-900">
                    Emergenze Odontoiatriche
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  In caso di dolore acuto o urgenza odontoiatrica, contattaci
                  telefonicamente: valutiamo il caso e ti riserviamo uno slot
                  prioritario in giornata, quando possibile.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-teal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-navy"
                  >
                    <Phone className="h-4 w-4" /> Chiama ora
                  </a>
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-teal-200 px-5 py-3 text-sm font-medium text-teal-800 transition-colors hover:border-teal-400 hover:bg-teal-50"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Mappa stilizzata */}
              <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-dark-navy">
                <div className="noise pointer-events-none absolute inset-0" />
                <div className="hero-mesh absolute inset-0 opacity-20" />
                <div className="relative flex flex-col items-center text-center text-white">
                  <MapPin className="h-8 w-8 text-slate-accent" />
                  <p className="mt-3 font-serif text-lg font-semibold">Cocoora Centro Medico</p>
                  <p className="mt-1 text-sm text-teal-200/80">{SITE.fullAddress}</p>
                </div>
              </div>
            </div>

            {/* Form Prenotazione */}
            <div className="rounded-[2rem] border border-teal-100 bg-white p-8 shadow-[0_20px_50px_-28px_rgba(3,53,75,0.35)] sm:p-10">
              {!sent ? (
                <>
                  <SectionLabel>Richiedi una Prenotazione</SectionLabel>
                  <h2 className="font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                    Raccontaci di cosa hai bisogno
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                    Ti ricontattiamo entro poche ore per confermare data e orario
                    più adatti al tuo percorso.
                  </p>

                  <form onSubmit={submit} className="mt-8 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Nome *"
                        value={form.nome}
                        onChange={(v) => update("nome", v)}
                        placeholder="Il tuo nome"
                      />
                      <Field
                        label="Cognome *"
                        value={form.cognome}
                        onChange={(v) => update("cognome", v)}
                        placeholder="Il tuo cognome"
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Telefono *"
                        type="tel"
                        value={form.telefono}
                        onChange={(v) => update("telefono", v)}
                        placeholder="+39 —"
                      />
                      <Field
                        label="Email *"
                        type="email"
                        value={form.email}
                        onChange={(v) => update("email", v)}
                        placeholder="nome@email.it"
                      />
                    </div>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">
                        Servizio desiderato
                      </span>
                      <select
                        value={form.servizio}
                        onChange={(e) => update("servizio", e.target.value)}
                        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-teal-600"
                      >
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-teal-900">
                        Messaggio
                      </span>
                      <textarea
                        value={form.messaggio}
                        onChange={(e) => update("messaggio", e.target.value)}
                        rows={4}
                        placeholder="Raccontaci brevemente le tue esigenze..."
                        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600"
                      />
                    </label>

                    <label className="flex items-start gap-3 text-sm text-charcoal/70">
                      <input
                        type="checkbox"
                        checked={form.consenso}
                        onChange={(e) => update("consenso", e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>
                        Ho letto l&apos;informativa privacy e acconsento al
                        trattamento dei miei dati per essere ricontattato da
                        Cocoora Centro Medico. *
                      </span>
                    </label>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" size="lg" className="w-full" disabled={sending}>
                      {sending ? "Invio in corso…" : "Invia richiesta di prenotazione"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-semibold text-teal-900">
                    Richiesta presa in carico
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/70">
                    Grazie <span className="font-medium text-teal-900">{form.nome}</span>! La tua richiesta per{" "}
                    <span className="font-medium text-teal-800">{form.servizio}</span> è stata registrata da Cocoora Centro Medico.
                    La nostra segreteria ti ricontatterà a breve ai recapiti indicati (
                    <span className="font-medium text-teal-800">{form.telefono}</span> ·{" "}
                    <span className="font-medium text-teal-800">{form.email}</span>) per concordare data e orario della visita.
                  </p>
                  <Button className="mt-7" onClick={resetForm}>
                    Invia un&apos;altra richiesta
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-teal-900">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600"
      />
    </label>
  );
}
