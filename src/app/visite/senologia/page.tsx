"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dna,
  FlaskConical,
  GraduationCap,
  ScanLine,
  Stethoscope,
  Waves,
} from "lucide-react";
import { Badge, ButtonLink, Container, SectionLabel } from "@/components/ui";
import {
  VisitLeadSection,
  VisitPathwaysSection,
} from "@/components/sections/specialty-visit-sections";

const DOCTOR = {
  name: "Dr.ssa Marianna Coppola",
  title: "Specialista in Senologia",
  affiliation: 'Consulente — Policlinico Universitario "Federico II"',
  image: "/images/doctors/marianna-coppola.jpg",
  slug: "/medici",
};

const INCLUDES = [
  "Visita clinica senologica con palpazione bilaterale",
  "Ecografia mammaria ad alta risoluzione inclusa",
  "Valutazione della familiarità e profilo di rischio individuale",
  "Anamnesi riproduttiva e ormonale",
  "Indicazioni cliniche per eventuali approfondimenti diagnostici di secondo livello",
  "Referto digitale entro 24h nell'area paziente",
];

const RELATED_EXAMS = [
  {
    name: "Follow-up Ecografico Periodico",
    description:
      "Controlli senologici programmati per il monitoraggio clinico nel tempo.",
    icon: ScanLine,
  },
  {
    name: "Ecografia Mammaria Dedicata",
    description:
      "Approfondimento ecografico ad alta risoluzione del tessuto mammario.",
    icon: Waves,
  },
  {
    name: "Valutazione Citologica / Bioptica Mirata",
    description:
      "Inquadramento specialistico e orientamento per approfondimenti mirati su noduli sospetti.",
    icon: Stethoscope,
  },
  {
    name: "Test BRCA su indicazione",
    description: "Analisi genetica per la valutazione del rischio ereditario.",
    icon: Dna,
  },
  {
    name: "Valutazione ormonale",
    description: "Profilo ormonale a supporto della diagnosi senologica.",
    icon: FlaskConical,
  },
  {
    name: "Elastosonografia",
    description:
      "Studio della consistenza tissutale per caratterizzare i noduli mammari.",
    icon: ScanLine,
  },
];

const FAQ = [
  {
    q: "Quando fare una visita senologica?",
    a: "Si raccomanda una visita senologica annuale a partire dai 30 anni, o prima in presenza di familiarità per patologie mammarie, noduli palpabili, dolore o secrezioni.",
  },
  {
    q: "La visita include l'ecografia?",
    a: "Sì, nel nostro centro l'ecografia mammaria bilaterale ad alta risoluzione è sempre parte integrante della visita senologica.",
  },
  {
    q: "Quali esami strumentali eseguite in sede durante la visita?",
    a: "In sede eseguiamo la visita clinica senologica completa di ecografia mammaria bilaterale ad alta risoluzione, particolarmente indicata per lo studio del tessuto ghiandolare. Qualora siano necessari approfondimenti radiologici esterni di secondo livello, la Dr.ssa Coppola fornisce tutte le indicazioni cliniche mirate.",
  },
  {
    q: "Serve l'impegnativa?",
    a: "No. Presso Cocoora prenoti in regime privato su appuntamento dedicato, senza impegnativa del medico di base.",
  },
  {
    q: "Quanto dura la visita?",
    a: "La visita senologica dura circa 30-40 minuti. Include anamnesi, visita clinica, ecografia e spiegazione dettagliata dei risultati.",
  },
  {
    q: "Quando arriva il referto?",
    a: "Il referto digitale è disponibile entro 24 ore nella tua area paziente personale, accessibile da smartphone.",
  },
  {
    q: "È inclusa nei Percorsi Salute?",
    a: "La prevenzione senologica rientra nei percorsi dedicati alla salute femminile di Cocoora Club Care Donna e superiori, oltre che in Donna Precision.",
  },
];

export default function SenologiaPage() {
  return (
    <>
      {/* [A] Banner Hero */}
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/doctor-consultation.jpg"
          alt="Senologia privata a Napoli — Cocoora Centro Medico"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-8">
          <Container>
            <span className="inline-block rounded-full border border-white/30 bg-dark-navy/45 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              Senologia Privata · Napoli
            </span>
          </Container>
        </div>
      </div>

      {/* [B] Hero Testuale */}
      <section className="hero-mesh relative overflow-hidden pb-16 pt-8 sm:pt-12">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto shadow-sm">
              Prevenzione Senologica · Prenotazione su Appuntamento
            </Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              Senologo Privato a Napoli
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Visita senologica completa con ecografia mammaria ad alta
              risoluzione, valutazione del profilo di rischio individuale e
              referto digitale entro 24 ore.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="#lead" size="lg">
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
            Cosa include la visita senologica
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
                <Image
                  src={DOCTOR.image}
                  alt={DOCTOR.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-accent">
                Specialista dedicata
              </p>
              <p className="mt-1 font-serif text-xl font-semibold leading-tight text-teal-900">
                {DOCTOR.name}
              </p>
              <p className="mt-1 text-sm text-charcoal/70">{DOCTOR.title}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal/60">
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-slate-accent" />{" "}
                {DOCTOR.affiliation}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                Vedi l&apos;équipe medica{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

      {/* [E] Modalità di accesso e Percorsi Salute */}
      <VisitPathwaysSection
        visitLabel="Visita Senologica + Ecografia"
        visitSummary="Esame clinico senologico con ecografia mammaria bilaterale ad alta risoluzione e referto digitale dedicato."
        pathways={[
          {
            eyebrow: "Cocoora Club Care Donna",
            title: "Prevenzione Senologica Annuale",
            description:
              "Percorso annuale coordinato dedicato alla salute femminile con check-up e consulenze specialistiche.",
            href: "/club/care",
            ctaLabel: "Scopri Care",
            featured: true,
          },
          {
            eyebrow: "Cocoora Precision",
            title: "Donna Precision",
            description:
              "Screening mirati e valutazione personalizzata dei fattori di rischio femminili con équipe dedicata.",
            href: "/club",
            ctaLabel: "Scopri Donna Precision",
          },
        ]}
      />

      {/* [F] Lead Form collegato a /api/contact */}
      <VisitLeadSection
        heading="Prenota la tua visita senologica"
        subheading="Lascia i tuoi recapiti: la segreteria di Cocoora Centro Medico ti ricontatterà per concordare l'appuntamento con la Dr.ssa Coppola."
        serviceName="Visita Senologica"
      />

      {/* [G] FAQ */}
      <FaqSection faq={FAQ} />

      {/* [H] Breadcrumb + Cross-link */}
      <section className="bg-canvas pb-16">
        <Container>
          <Link
            href="/visite"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-dark-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Tutte le Visite Specialistiche
          </Link>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Link
              href="/medici"
              className="group flex items-center justify-between rounded-2xl border border-teal-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)]"
            >
              <span className="font-serif text-lg font-semibold text-teal-900">
                I Medici di Cocoora
              </span>
              <ArrowRight className="h-4 w-4 text-teal-700 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/club"
              className="group flex items-center justify-between rounded-2xl border border-teal-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)]"
            >
              <span className="font-serif text-lg font-semibold text-teal-900">
                Percorsi Salute
              </span>
              <ArrowRight className="h-4 w-4 text-teal-700 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </section>
    </>
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
                <summary className="cursor-pointer list-none font-medium text-teal-900">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
