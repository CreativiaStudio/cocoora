"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Droplet,
  Eye,
  GraduationCap,
  Scan,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { trackLead } from "@/lib/tracking";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const DOCTOR = {
  name: "Dr.ssa Ilaria Russo",
  title: "Specialista in Oftalmologia",
  affiliation: "Consulente oculista — A.O.U. Vanvitelli, U.O.C. Oculistica",
  image: "/images/doctors/ilaria-russo.jpg",
  slug: "/medici/ilaria-russo",
};

const INCLUDES = [
  "Esame del visus e valutazione della refrazione (miopia, astigmatismo, presbiopia)",
  "Tonometria per la misurazione della pressione intraoculare",
  "Esame del fondo oculare (fundus oculi) su indicazione",
  "Valutazione dell'equilibrio oculomotorio",
  "Prescrizione di occhiali o lenti a contatto",
  "Referto digitale entro 24h",
];

const RELATED_EXAMS = [
  { name: "OCT (Tomografia a Coerenza Ottica)", description: "Analisi ad alta definizione delle strutture retiniche.", icon: ScanLine },
  { name: "Campo Visivo", description: "Valutazione dell'ampiezza e della sensibilità del campo visivo.", icon: Eye },
  { name: "Corneal Topography", description: "Mappatura della curvatura corneale ad alta precisione.", icon: Scan },
  { name: "Esame Fondo Oculare", description: "Valutazione della retina e del nervo ottico.", icon: Eye },
  { name: "Schirmer Test", description: "Misurazione della produzione lacrimale.", icon: Droplet },
  { name: "Pressione Oculare", description: "Screening per la prevenzione del glaucoma.", icon: Sparkles },
];

const FAQ = [
  {
    q: "Con quale frequenza fare la visita oculistica?",
    a: "Si raccomanda una visita oculistica annuale per chi porta occhiali o lenti, ogni 2 anni per chi ha una vista normale, e annuale per i bambini durante la crescita.",
  },
  {
    q: "La visita è adatta anche ai bambini?",
    a: "Sì, la Dr.ssa Russo esegue screening oculistici pediatrici dalla prima infanzia. La prevenzione precoce è fondamentale per intercettare ambliopia e strabismo.",
  },
  {
    q: "Serve la midriasi (gocce)?",
    a: "L'esame del fondo oculare può richiedere l'instillazione di collirio midriatico. In tal caso si consiglia di non guidare nelle ore successive: ti verrà comunicato al momento della prenotazione.",
  },
  {
    q: "Quanto dura la visita?",
    a: "La visita oculistica completa dura 30-45 minuti. Se è previsto l'esame del fondo oculare con midriasi, calcola circa un'ora incluso il tempo di attesa dell'effetto del collirio.",
  },
  {
    q: "Serve l'impegnativa?",
    a: "No. A Cocoora prenoti in regime privato senza impegnativa del medico di base e senza lista d'attesa.",
  },
  {
    q: "La prescrizione degli occhiali è inclusa?",
    a: "Sì, se necessario la Dr.ssa Russo rilascia la prescrizione per occhiali o lenti a contatto al termine della visita.",
  },
  {
    q: "È inclusa nei Piani Salute?",
    a: "La visita oculistica è inclusa nei piani Cocoora Club Care e superiori.",
  },
];

export default function OculisticaPage() {
  return (
    <>
      {/* [A] Banner Hero */}
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/clinic-lounge.jpg"
          alt="Oculistica privata a Napoli — Cocoora"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-8">
          <Container>
            <span className="inline-block rounded-full border border-white/30 bg-dark-navy/45 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              Oculistica Privata · Napoli
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
              Oculista Privato a Napoli
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Visita oculistica completa con esame del visus, tonometria e
              fondo oculare. Per adulti e bambini, senza lista d&apos;attesa.
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
            Cosa include la visita oculistica
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
            <p className="mt-2 text-sm text-charcoal/65">Visita oculistica completa con tonometria inclusa.</p>
            <ButtonLink href="/contatti" className="mt-6" variant="secondary">
              Prenota Ora
            </ButtonLink>
          </div>

          <div className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-accent">Cocoora Club Care</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">
              €349<span className="text-base font-normal text-charcoal/50">/anno</span>
            </p>
            <p className="mt-2 text-sm text-charcoal/65">Visita oculistica inclusa.</p>
            <ButtonLink href="/club/care" className="mt-6" variant="secondary">
              Scopri Care
            </ButtonLink>
          </div>

          <div className="relative flex flex-col rounded-3xl border-2 border-teal-700 bg-white p-7 shadow-[0_20px_50px_-24px_rgba(3,53,75,0.35)]">
            <span className="absolute -top-3 left-7 rounded-full bg-teal-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              ★ Più Scelto
            </span>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-accent">Cocoora Club Experience</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">
              €649<span className="text-base font-normal text-charcoal/50">/anno</span>
            </p>
            <p className="mt-2 text-sm text-charcoal/65">Diagnostica oculistica avanzata inclusa.</p>
            <ButtonLink href="/club/experience" className="mt-6">
              Scopri Experience
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
                Grazie {form.nome}! Ti ricontatteremo a breve per confermare la tua visita oculistica.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-semibold text-teal-900">Prenota la tua visita oculistica</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Lascia i tuoi dati e il nostro team ti ricontatterà per fissare l&apos;appuntamento con la Dr.ssa Russo.
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
