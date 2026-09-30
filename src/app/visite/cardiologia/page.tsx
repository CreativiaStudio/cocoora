"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  Gauge,
  GraduationCap,
  HeartPulse,
  Stethoscope,
  Timer,
} from "lucide-react";
import { trackLead } from "@/lib/tracking";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const DOCTOR = {
  name: "Dr. Ferdinando Esposito",
  title: "Specialista in Cardiologia e Diagnostica Vascolare",
  affiliation: "Già Dirigente Medico I livello — A.O.R.N. \"Antonio Cardarelli\", U.O.C. Cardiologia",
  image: "/images/doctors/ferdinando-esposito.jpg",
  slug: "/medici/ferdinando-esposito",
};

const INCLUDES = [
  "Anamnesi cardiovascolare completa e valutazione del rischio",
  "Elettrocardiogramma (ECG) a riposo incluso",
  "Misurazione pressione arteriosa e auscultazione",
  "Valutazione profilo lipidico e fattori di rischio",
  "Referto digitale disponibile nell'area paziente entro 24h",
  "Indicazioni per eventuali approfondimenti (Holter, Ecocardiogramma)",
];

const RELATED_EXAMS = [
  { name: "Ecocardiogramma Color-Doppler", description: "Valutazione ecografica della struttura e della funzione cardiaca.", icon: HeartPulse },
  { name: "Holter ECG 24h", description: "Monitoraggio continuo del ritmo cardiaco nell'arco della giornata.", icon: Timer },
  { name: "Ecocolordoppler TSA", description: "Studio dei tronchi sovraortici per la prevenzione vascolare.", icon: Activity },
  { name: "Test da Sforzo", description: "Valutazione della risposta cardiovascolare sotto sforzo controllato.", icon: Gauge },
  { name: "Profilo Lipidico Completo", description: "Analisi dei valori di colesterolo e trigliceridi.", icon: Stethoscope },
  { name: "Monitoraggio Pressorio 24h", description: "Rilevazione della pressione arteriosa nelle 24 ore.", icon: Gauge },
];

const FAQ = [
  {
    q: "Quando fare una visita cardiologica?",
    a: "Si consiglia una visita cardiologica preventiva dai 40 anni in poi, o prima in presenza di familiarità cardiovascolare, ipertensione, colesterolo alto, fumo, diabete o stile di vita sedentario.",
  },
  {
    q: "La visita include l'ECG?",
    a: "Sì, l'elettrocardiogramma a riposo è sempre incluso nella visita cardiologica a Cocoora, senza costi aggiuntivi.",
  },
  {
    q: "Quanto dura la visita?",
    a: "La visita cardiologica a Cocoora dura mediamente 30-40 minuti, con tempo dedicato all'anamnesi, all'esame obiettivo, all'ECG e alla spiegazione del referto.",
  },
  {
    q: "Serve l'impegnativa del medico di base?",
    a: "No. A Cocoora puoi prenotare la visita cardiologica in regime privato senza impegnativa, senza lista d'attesa e senza passare dal SSN.",
  },
  {
    q: "Quando arriva il referto?",
    a: "Il referto digitale è disponibile entro 24 ore nella tua area paziente personale, accessibile da smartphone.",
  },
  {
    q: "Il cardiologo segue anche in follow-up?",
    a: "Sì. Il Dr. Esposito garantisce continuità di cura: dopo la prima visita puoi prenotare controlli periodici o approfondimenti direttamente con lui.",
  },
  {
    q: "È inclusa nei Piani Salute?",
    a: "La visita cardiologica è inclusa nel piano Cocoora Club Care e superiori. Con Access hai uno sconto prioritario sulla tariffa privata.",
  },
];

export default function CardiologiaPage() {
  return (
    <>
      {/* [A] Banner Hero */}
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/diagnostics-lab.jpg"
          alt="Cardiologia privata a Napoli — Cocoora"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-8">
          <Container>
            <span className="inline-block rounded-full border border-white/30 bg-dark-navy/45 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              Cardiologia Privata · Napoli
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
              Cardiologo Privato a Napoli
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Visita cardiologica completa con ECG, valutazione del rischio
              cardiovascolare e referto digitale disponibile entro 24h. Senza
              attese, senza burocrazia.
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
            Cosa include la visita cardiologica
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
                Specialista dedicato
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
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">€130</p>
            <p className="mt-2 text-sm text-charcoal/65">Visita cardiologica completa con ECG incluso.</p>
            <ButtonLink href="/contatti" className="mt-6" variant="secondary">
              Prenota Ora
            </ButtonLink>
          </div>

          <div className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-accent">Cocoora Club Access</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-teal-900">
              €99<span className="text-base font-normal text-charcoal/50">/anno</span>
            </p>
            <p className="mt-2 text-sm text-charcoal/65">Visita cardiologica inclusa.</p>
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
                Grazie {form.nome}! Ti ricontatteremo a breve per confermare la tua visita cardiologica.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-semibold text-teal-900">Prenota la tua visita cardiologica</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Lascia i tuoi dati e il nostro team ti ricontatterà per fissare l&apos;appuntamento con il Dr. Esposito.
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
