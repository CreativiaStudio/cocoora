"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Microscope,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { trackLead } from "@/lib/tracking";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const DOCTOR = {
  name: "Dr.ssa Federica Caputo",
  title: "Specialista in Ginecologia e Ostetricia",
  affiliation: "Consulente ginecologa — A.O.U. Vanvitelli, U.O.C. Ginecologia e Ostetricia",
  image: "/images/doctors/federica-caputo.jpg",
  slug: "/medici/federica-caputo",
};

const INCLUDES = [
  "Colloquio anamnestico approfondito",
  "Esame ginecologico completo",
  "Ecografia pelvica transvaginale/sovrapubica inclusa",
  "Pap test e tampone su indicazione clinica",
  "Valutazione del ciclo mestruale e dell'equilibrio ormonale",
  "Referto digitale entro 24h nell'area paziente",
];

const RELATED_EXAMS = [
  { name: "Ecografia Pelvica Dedicata", description: "Approfondimento ecografico dell'apparato genitale femminile.", icon: ScanLine },
  { name: "Colposcopia", description: "Esame diagnostico approfondito del collo dell'utero.", icon: Microscope },
  { name: "Valutazione Menopausa e Climaterio", description: "Percorso dedicato all'equilibrio ormonale nella menopausa.", icon: HeartPulse },
  { name: "Test Microbiota Vaginale", description: "Analisi della flora batterica vaginale integrata con Donna Precision.", icon: FlaskConical },
  { name: "Ecografia Transvaginale", description: "Valutazione ad alta definizione di utero e ovaie.", icon: ScanLine },
  { name: "Vaginoscopia", description: "Esame endoscopico dedicato per approfondimenti clinici specifici.", icon: Sparkles },
];

const FAQ = [
  {
    q: "Con quale frequenza fare la visita ginecologica?",
    a: "Si raccomanda una visita ginecologica annuale a partire dall'inizio dell'attività sessuale o dai 18 anni, anche in assenza di sintomi.",
  },
  {
    q: "La visita include l'ecografia?",
    a: "Sì, a Cocoora la visita ginecologica include sempre l'ecografia pelvica (transvaginale o sovrapubica), senza costi aggiuntivi.",
  },
  {
    q: "Quanto dura la visita?",
    a: "La visita ginecologica dura circa 30-45 minuti. Dedichiamo tempo all'anamnesi, all'esame, all'ecografia e alla spiegazione dei risultati.",
  },
  {
    q: "Serve l'impegnativa?",
    a: "No, a Cocoora si prenota in regime privato, senza impegnativa e senza lista d'attesa.",
  },
  {
    q: "Si può fare anche in gravidanza?",
    a: "Sì, la Dr.ssa Caputo segue anche le gravidanze fisiologiche con controlli periodici.",
  },
  {
    q: "Come funziona il referto?",
    a: "Il referto è disponibile digitalmente nella tua area personale entro 24 ore dalla visita.",
  },
  {
    q: "È inclusa nei Piani Salute?",
    a: "La visita ginecologica è inclusa nel piano Cocoora Club Care e superiori, con ecografia inclusa. Con il piano Donna Precision hai anche il test del microbiota vaginale.",
  },
];

export default function GinecologiaPage() {
  return (
    <>
      {/* [A] Banner Hero */}
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/doctor-consultation.jpg"
          alt="Ginecologia privata a Napoli — Cocoora"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-8">
          <Container>
            <span className="inline-block rounded-full border border-white/30 bg-dark-navy/45 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              Ginecologia Privata · Napoli
            </span>
          </Container>
        </div>
      </div>

      {/* [B] Hero Testuale */}
      <section className="hero-mesh relative overflow-hidden pb-16 pt-8 sm:pt-12">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto shadow-sm">Prima Visita Entro 72h · Zero Lista d&apos;Attesa</Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              Ginecologa Privata a Napoli
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Visita ginecologica completa con ecografia pelvica, pap test e
              consulenza personalizzata. Prima visita disponibile entro 72h, in un
              ambiente riservato e professionale.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/contatti" size="lg">
                Prenota Visita
              </ButtonLink>
              <ButtonLink href="/club/care" variant="secondary" size="lg">
                Scopri il Club Care
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* [C] Cosa include la visita */}
      <section className="bg-canvas py-16">
        <Container>
          <SectionLabel>Il Percorso Clinico</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
            Cosa include la visita ginecologica
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <ul className="space-y-4">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-charcoal/80">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href={DOCTOR.slug}
              className="group flex flex-col items-center rounded-3xl border border-teal-100 bg-white p-8 text-center shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(3,53,75,0.4)]"
            >
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
                <Image src={DOCTOR.image} alt={DOCTOR.name} fill sizes="112px" className="object-cover" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-accent">
                Specialista dedicata
              </p>
              <p className="mt-1 font-serif text-xl font-semibold leading-tight text-teal-900">
                {DOCTOR.name}
              </p>
              <p className="mt-1 text-sm text-charcoal/70">{DOCTOR.title}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal/60">
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-slate-accent" /> {DOCTOR.affiliation}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                Vedi profilo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* [D] Esami correlati */}
      <section className="bg-white py-14">
        <Container>
          <SectionLabel>Approfondimenti</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
            Approfondimenti disponibili
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {RELATED_EXAMS.map((exam) => {
              const Icon = exam.icon;
              return (
                <div key={exam.name} className="rounded-2xl border border-teal-100 bg-canvas p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 font-medium text-teal-900">{exam.name}</p>
                  <p className="mt-1.5 text-sm text-charcoal/65">{exam.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* [E] Prezzi & Piani */}
      <PricingSection />

      {/* [F] Lead Form */}
      <LeadSection />

      {/* [G] FAQ */}
      <FaqSection faq={FAQ} />

      {/* [H] Breadcrumb + Cross-link */}
      <section className="bg-canvas pb-16">
        <Container>
          <Link href="/visite" className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-dark-navy">
            <ArrowLeft className="h-4 w-4" /> Tutte le Visite Specialistiche
          </Link>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Link
              href="/medici"
              className="group flex items-center justify-between rounded-2xl border border-teal-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)]"
            >
              <span className="font-serif text-lg font-semibold text-teal-900">I Medici di Cocoora</span>
              <ArrowRight className="h-4 w-4 text-teal-700 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/club"
              className="group flex items-center justify-between rounded-2xl border border-teal-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)]"
            >
              <span className="font-serif text-lg font-semibold text-teal-900">Piani Salute</span>
              <ArrowRight className="h-4 w-4 text-teal-700 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function PricingSection() {
  return (
    <section className="bg-teal-50/50 py-16">
      <Container>
        <SectionLabel>Tariffe</SectionLabel>
        <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
          Tariffa e Piani Salute
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-accent">Visita Singola</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">€110</p>
            <p className="mt-2 text-sm text-charcoal/65">Visita ginecologica completa con ecografia pelvica inclusa.</p>
            <ButtonLink href="/contatti" className="mt-6" variant="secondary">
              Prenota Ora
            </ButtonLink>
          </div>

          <div className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-accent">Cocoora Club Access</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">
              €99<span className="text-base font-normal text-charcoal/50">/anno</span>
            </p>
            <p className="mt-2 text-sm text-charcoal/65">Visita ginecologica inclusa.</p>
            <ButtonLink href="/club/access" className="mt-6" variant="secondary">
              Scopri Access
            </ButtonLink>
          </div>

          <div className="relative flex flex-col rounded-3xl border-2 border-teal-700 bg-white p-7 shadow-[0_20px_50px_-24px_rgba(3,53,75,0.35)]">
            <span className="absolute -top-3 left-7 rounded-full bg-teal-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              ★ Più Scelto
            </span>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-accent">Cocoora Club Care</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">
              €349<span className="text-base font-normal text-charcoal/50">/anno</span>
            </p>
            <p className="mt-2 text-sm text-charcoal/65">Visite specialistiche illimitate*.</p>
            <ButtonLink href="/club/care" className="mt-6">
              Scopri Care
            </ButtonLink>
          </div>
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
    <section id="lead" className="bg-canvas py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white bg-white/70 p-8 shadow-[0_24px_60px_-28px_rgba(3,53,75,0.4)] backdrop-blur-md sm:p-10">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-teal-900">Richiesta inviata</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Grazie {form.nome}! Ti ricontatteremo a breve per confermare la tua visita ginecologica.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-semibold text-teal-900">Prenota la tua visita ginecologica</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Lascia i tuoi dati e il nostro team ti ricontatterà per fissare l&apos;appuntamento con la Dr.ssa Caputo.
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
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>Domande Frequenti</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold text-teal-900">FAQ</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details key={f.q} className="rounded-2xl border border-teal-100 bg-canvas p-6">
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
