"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Cpu, GraduationCap, Sparkles } from "lucide-react";
import { useCms } from "@/components/providers";
import { getDoctorsByTreatment } from "@/lib/doctors";
import { CLUB_TIERS } from "@/lib/club";
import type { Treatment } from "@/lib/types";
import { trackLead } from "@/lib/tracking";
import { formatPrice } from "@/lib/utils";
import { Badge, Button, Container, SectionLabel } from "@/components/ui";
import { Logo } from "@/components/logo";

export function TreatmentClient({ treatment }: { treatment: Treatment }) {
  const { pages } = useCms();
  const page = pages.find((p) => p.path === `/trattamenti/${treatment.slug}`);
  const canvasMode = page?.canvasMode ?? false;

  const h1 = page?.h1 ?? treatment.title;
  const h2 = page?.h2 ?? treatment.tagline;

  if (canvasMode) {
    return (
      <div className="min-h-screen bg-canvas">
        <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/80 backdrop-blur-md">
          <Container className="flex h-16 items-center justify-between">
            <Link href="/">
              <Logo variant="dark" />
            </Link>
            <Button size="sm" onClick={() => document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" })}>
              Prenota una visita
            </Button>
          </Container>
        </header>
        <CanvasContent treatment={treatment} h1={h1} h2={h2} faq={page?.faq ?? treatment.faq} />
      </div>
    );
  }

  const heroImage =
    treatment.category === "odontoiatria" ? "/images/dental-operatory.jpg" : "/images/aesthetic-skin.jpg";

  return (
    <>
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src={heroImage}
          alt={treatment.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Velo scuro leggero in alto per la leggibilità della navbar */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
      </div>

      <section className="hero-mesh relative overflow-hidden pb-16 pt-8 sm:pt-12">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto shadow-sm">
              {treatment.category === "odontoiatria" ? "Odontoiatria" : "Medicina Estetica"}
            </Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              {h1}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">{h2}</p>
            <div className="mt-9">
              <Button size="lg" onClick={() => document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" })}>
                Prenota una visita <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>
      <TreatmentBody treatment={treatment} faq={page?.faq ?? treatment.faq} />
    </>
  );
}

function TreatmentBody({
  treatment,
  faq,
}: {
  treatment: Treatment;
  faq: { q: string; a: string }[];
}) {
  return (
    <>
      <section className="bg-canvas py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel>Il Trattamento</SectionLabel>
              <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
                In cosa consiste
              </h2>
              <p className="mt-5 text-base leading-relaxed text-charcoal/75">
                {treatment.description}
              </p>
            </div>
            <div className="space-y-4">
              {treatment.steps.map((s, i) => (
                <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-white p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 font-serif text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-teal-900">{s.title}</p>
                    <p className="mt-1 text-sm text-charcoal/65">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {treatment.machines && treatment.machines.length > 0 && (
            <div className="mt-14 rounded-3xl border border-teal-100 bg-teal-50/50 p-8">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-teal-700" />
                <h3 className="font-serif text-xl font-semibold text-teal-900">Tecnologie e macchinari</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {treatment.machines.map((m) => (
                  <span key={m} className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-800">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <DoctorAndClubBox treatment={treatment} />

      <LeadSection />
      <FaqSection faq={faq} />
      <div className="bg-canvas pb-20">
        <Container>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-dark-navy">
            <ArrowLeft className="h-4 w-4" /> Torna alla home
          </Link>
        </Container>
      </div>
    </>
  );
}

function CanvasContent({
  treatment,
  h1,
  h2,
  faq,
}: {
  treatment: Treatment;
  h1: string;
  h2: string;
  faq: { q: string; a: string }[];
}) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="font-serif text-4xl font-semibold leading-tight text-dark-navy sm:text-5xl">{h1}</h1>
      <p className="mt-4 text-lg text-charcoal/75">{h2}</p>
      <p className="mt-6 text-base leading-relaxed text-charcoal/75">{treatment.description}</p>

      <h2 className="mt-10 font-serif text-2xl font-semibold text-teal-900">Come funziona</h2>
      <div className="mt-5 space-y-4">
        {treatment.steps.map((s, i) => (
          <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-teal-100 bg-white p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 font-serif text-sm font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-teal-900">{s.title}</p>
              <p className="mt-1 text-sm text-charcoal/65">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      <DoctorAndClubBox treatment={treatment} />
      <LeadSection />
      <FaqSection faq={faq} />
    </main>
  );
}

function DoctorAndClubBox({ treatment }: { treatment: Treatment }) {
  const doctors = getDoctorsByTreatment(treatment.slug);
  const doctor = doctors[0];
  const recommendedTierId = doctor?.clubTierIds.find((id) => id !== "discover");
  const recommendedTier = recommendedTierId
    ? CLUB_TIERS.find((t) => t.id === recommendedTierId)
    : undefined;

  if (!doctor && !recommendedTier) return null;

  return (
    <section className="bg-teal-50/60 py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          {doctor && (
            <Link
              href={`/medici/${doctor.slug}`}
              className="group flex items-center gap-5 rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(3,53,75,0.4)]"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                <Image src={doctor.image} alt={doctor.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-accent">
                  Specialista consigliato
                </p>
                <p className="mt-1 font-serif text-lg font-semibold leading-tight text-teal-900">
                  {doctor.name}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal/60">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0 text-slate-accent" /> {doctor.branca}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                  Vedi profilo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )}

          {recommendedTier && (
            <Link
              href={`/club/${recommendedTier.id}`}
              className="group flex items-center gap-5 rounded-3xl border border-teal-200 bg-dark-navy p-6 text-white shadow-[0_16px_40px_-28px_rgba(3,53,75,0.5)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-slate-accent">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-accent">
                  Vantaggio Cocoora Club
                </p>
                <p className="mt-1 font-serif text-lg font-semibold leading-tight">
                  Compreso o scontato con {recommendedTier.name}
                </p>
                <p className="mt-1 text-xs text-teal-200/80">
                  Da {formatPrice(recommendedTier.price)}/anno — continuità di cura senza attese
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-all group-hover:gap-2.5">
                  Scopri il pacchetto <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}

function LeadSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefono: "" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) return;
    trackLead({ email: form.email, name: form.nome });
    setSent(true);
  };

  return (
    <section id="lead" className="bg-teal-50/60 py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white bg-white/70 p-8 shadow-[0_24px_60px_-28px_rgba(3,53,75,0.4)] backdrop-blur-md sm:p-10">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-teal-900">Richiesta inviata</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Grazie {form.nome}! Ti ricontatteremo a breve per confermare la tua visita.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-semibold text-teal-900">Richiedi informazioni</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Lascia i tuoi dati e il nostro team ti ricontatterà per una valutazione medica.
              </p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Nome *"
                  className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email *"
                  className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                />
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="Telefono"
                  className="w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-600"
                />
                <Button type="submit" className="w-full" size="lg">
                  Invia richiesta
                </Button>
              </form>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  if (faq.length === 0) return null;
  return (
    <section className="bg-canvas py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>Domande Frequenti</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold text-teal-900">FAQ</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details key={f.q} className="rounded-2xl border border-teal-100 bg-white p-6">
                <summary className="cursor-pointer list-none font-medium text-teal-900">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
