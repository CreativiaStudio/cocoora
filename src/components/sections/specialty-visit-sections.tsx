"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarCheck, Check, ShieldCheck } from "lucide-react";
import { trackLead } from "@/lib/tracking";
import { Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

type PathwayOption = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  featured?: boolean;
};

export function VisitPathwaysSection({
  visitLabel,
  visitSummary,
  pathways,
}: {
  visitLabel: string;
  visitSummary: string;
  pathways: PathwayOption[];
}) {
  return (
    <section className="bg-teal-50/50 py-16">
      <Container>
        <SectionLabel>Modalità di Accesso</SectionLabel>
        <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
          Prenotazione Singola e Percorsi Salute
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/70">
          Puoi richiedere la singola prestazione su appuntamento oppure accedere
          alla specialità all&apos;interno dei Percorsi Salute annuali di
          prevenzione coordinata.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-accent">
              Prestazione Dedicata
            </p>
            <h3 className="mt-3 font-serif text-2xl font-semibold text-teal-900">
              {visitLabel}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
              {visitSummary}
            </p>
            <ButtonLink href="#lead" className="mt-6" variant="secondary">
              <CalendarCheck className="h-4 w-4" /> Prenota su Appuntamento
            </ButtonLink>
          </div>

          {pathways.map((p) => (
            <div
              key={p.title}
              className={
                p.featured
                  ? "relative flex flex-col rounded-3xl border-2 border-teal-700 bg-white p-7 shadow-[0_20px_50px_-24px_rgba(3,53,75,0.35)]"
                  : "flex flex-col rounded-3xl border border-teal-100 bg-white p-7"
              }
            >
              {p.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-teal-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  ★ Percorso Consigliato
                </span>
              )}
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-accent">
                {p.eyebrow}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-teal-900">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
                {p.description}
              </p>
              <ButtonLink
                href={p.href}
                className="mt-6"
                variant={p.featured ? "primary" : "secondary"}
              >
                <ShieldCheck className="h-4 w-4" /> {p.ctaLabel}{" "}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function VisitLeadSection({
  heading,
  subheading,
  serviceName,
}: {
  heading: string;
  subheading: string;
  serviceName: string;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    consenso: false,
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !form.nome.trim() ||
      !form.cognome.trim() ||
      !form.email.trim() ||
      !form.telefono.trim()
    ) {
      setError("Compila nome, cognome, email e telefono per proseguire.");
      return;
    }
    if (!form.consenso) {
      setError("È necessario accettare l'informativa privacy per essere ricontattati.");
      return;
    }

    setError("");
    setSending(true);
    try {
      trackLead({
        email: form.email,
        name: `${form.nome} ${form.cognome}`.trim(),
      });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          cognome: form.cognome,
          email: form.email,
          telefono: form.telefono,
          servizio: serviceName,
          messaggio: `Richiesta prenotazione dalla scheda ${serviceName}`,
          consenso: form.consenso,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Impossibile inviare la richiesta. Riprova.");
      }
      setSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Errore durante l'invio. Riprova."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="lead" className="bg-canvas py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white bg-white/85 p-8 shadow-[0_24px_60px_-28px_rgba(3,53,75,0.4)] backdrop-blur-md sm:p-10">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-teal-900">
                Richiesta presa in carico
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                Grazie {form.nome}! La segreteria di Cocoora Centro Medico ti
                ricontatterà a breve per concordare data e orario dell&apos;appuntamento.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-semibold text-teal-900">
                {heading}
              </h3>
              <p className="mt-2 text-sm text-charcoal/70">{subheading}</p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Nome *"
                    className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                  />
                  <input
                    value={form.cognome}
                    onChange={(e) =>
                      setForm({ ...form, cognome: e.target.value })
                    }
                    placeholder="Cognome *"
                    className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                    placeholder="Telefono *"
                    className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email *"
                    className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                  />
                </div>
                <label className="flex items-start gap-2.5 text-xs text-charcoal/70">
                  <input
                    type="checkbox"
                    checked={form.consenso}
                    onChange={(e) =>
                      setForm({ ...form, consenso: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-teal-300 text-teal-600"
                  />
                  <span>
                    Ho letto l&apos;informativa privacy e acconsento al trattamento
                    dei dati per essere ricontattato da Cocoora Centro Medico. *
                  </span>
                </label>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={sending}
                >
                  {sending ? "Invio in corso…" : "Invia richiesta"}
                </Button>
              </form>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
