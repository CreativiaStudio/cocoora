"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { trackLead } from "@/lib/tracking";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const DOCTOR = {
  name: "Dr.ssa Teresa Amato",
  title: "Specialista in Pediatria",
  affiliation: "Consulente — Policlinico Universitario \"Federico II\"",
  image: "/images/doctors/teresa-amato.jpg",
  slug: "/medici/teresa-amato",
};

const INCLUDES = [
  "Anamnesi clinica del bambino e colloquio con i genitori",
  "Visita pediatrica completa con valutazione accrescitiva",
  "Bilancio di salute per fascia d'età",
  "Valutazione nutrizionale e alimentare",
  "Certificazione per idoneità sportiva non agonistica",
  "Coordinamento con l'équipe di ortodonzia intercettiva per i più piccoli",
  "Referto digitale entro 24h",
];

const RELATED_EXAMS = [
  { name: "Bilancio di Salute 0-14 anni", description: "Percorso di controlli programmati per l'accrescimento del bambino.", icon: ClipboardList },
  { name: "Certificazione Sportiva Non Agonistica", description: "Idoneità per l'attività sportiva scolastica e amatoriale.", icon: ShieldCheck },
  { name: "Valutazione Nutrizionale Pediatrica", description: "Analisi dell'alimentazione e della crescita del bambino.", icon: Utensils },
  { name: "Screening Ortopedico", description: "Valutazione posturale e dell'apparato muscolo-scheletrico.", icon: Activity },
  { name: "Esame Urine", description: "Analisi di controllo per la valutazione dello stato di salute generale.", icon: FlaskConical },
  { name: "Emocromo di Controllo", description: "Esame ematico di base per il monitoraggio della crescita.", icon: FlaskConical },
];

const FAQ = [
  {
    q: "Quante visite pediatriche all'anno sono consigliate?",
    a: "I bilanci di salute ministeriali prevedono visite a età specifiche (1, 3, 6, 9, 12 mesi, poi annuali). Cocoora segue questo calendario con la flessibilità delle visite private.",
  },
  {
    q: "La Dr.ssa Amato segue anche gli adolescenti?",
    a: "Sì, la Dr.ssa Amato segue bambini e adolescenti fino ai 18 anni, incluse le problematiche nutrizionali e comportamentali tipiche dell'adolescenza.",
  },
  {
    q: "Fate certificazioni sportive?",
    a: "Sì, Cocoora rilascia certificati di idoneità sportiva non agonistica. Non facciamo certificati agonistici, che richiedono strutture CONI accreditate.",
  },
  {
    q: "Serve l'impegnativa del pediatra di base?",
    a: "No. Le visite private a Cocoora non richiedono impegnativa. Puoi prenotare direttamente e ottenere la visita entro 72h.",
  },
  {
    q: "La visita include anche una valutazione nutrizionale?",
    a: "Sì, la Dr.ssa Amato integra nella visita pediatrica la valutazione della crescita e dell'alimentazione, con indicazioni pratiche per i genitori.",
  },
  {
    q: "C'è coordinamento con l'ortodonzia?",
    a: "Sì. Per i bambini che potrebbero beneficiare di ortodonzia intercettiva, la Dr.ssa Amato lavora in sinergia con il Dr. Sorrentino per identificare il momento ottimale per iniziare il percorso.",
  },
  {
    q: "È inclusa nei Piani Salute?",
    a: "Le visite pediatriche sono incluse nei piani Cocoora Club Family Care Basic e Elite, pensati per le famiglie con figli fino a 18 anni.",
  },
];

export default function PediatriaPage() {
  return (
    <>
      {/* [A] Banner Hero */}
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/pediatric-family.jpg"
          alt="Pediatria privata a Napoli — Cocoora"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-8">
          <Container>
            <span className="inline-block rounded-full border border-white/30 bg-dark-navy/45 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              Pediatria Privata · Napoli
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
              Pediatra Privato a Napoli
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Visite pediatriche, bilanci di salute, certificazioni sportive e
              supporto nutrizionale per bambini e adolescenti. Prima visita
              disponibile entro 72h.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/contatti" size="lg">
                Prenota Visita
              </ButtonLink>
              <ButtonLink href="/club" variant="secondary" size="lg">
                Scopri i Piani Famiglia
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
            Cosa include la visita pediatrica
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
          Tariffa e Piani Famiglia
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-accent">Visita Singola</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">€90</p>
            <p className="mt-2 text-sm text-charcoal/65">Visita pediatrica completa con bilancio di salute.</p>
            <ButtonLink href="/contatti" className="mt-6" variant="secondary">
              Prenota Ora
            </ButtonLink>
          </div>

          <div className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-accent">Family Care Basic</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">
              €249<span className="text-base font-normal text-charcoal/50">/anno</span>
            </p>
            <p className="mt-2 text-sm text-charcoal/65">Visite pediatriche di base per bambini e ragazzi.</p>
            <ButtonLink href="/club" className="mt-6" variant="secondary">
              Scopri Family Basic
            </ButtonLink>
          </div>

          <div className="relative flex flex-col rounded-3xl border-2 border-teal-700 bg-white p-7 shadow-[0_20px_50px_-24px_rgba(3,53,75,0.35)]">
            <span className="absolute -top-3 left-7 rounded-full bg-teal-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              ★ Più Scelto
            </span>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-accent">Family Care Elite</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">
              €449<span className="text-base font-normal text-charcoal/50">/anno</span>
            </p>
            <p className="mt-2 text-sm text-charcoal/65">Bambini e ragazzi fino a 18 anni.</p>
            <ButtonLink href="/club" className="mt-6">
              Scopri Family Elite
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
                Grazie {form.nome}! Ti ricontatteremo a breve per confermare la visita pediatrica.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-semibold text-teal-900">Prenota la visita pediatrica</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Lascia i tuoi dati e il nostro team ti ricontatterà per fissare l&apos;appuntamento con la Dr.ssa Amato.
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
