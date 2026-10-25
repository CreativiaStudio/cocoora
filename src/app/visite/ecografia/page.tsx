"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
  name: "Dr. Gennaro Iovine",
  title: "Specialista in Radiodiagnostica",
  affiliation:
    'Già Dirigente Medico — A.O.R.N. "Antonio Cardarelli", U.O.C. Radiologia',
  image: "/images/doctors/gennaro-iovine.jpg",
  slug: "/medici",
};

const INCLUDES = [
  "Ecografia dell'addome superiore e inferiore completo",
  "Valutazione di fegato, colecisti, pancreas, milza e reni",
  "Referto redatto e firmato dallo specialista in seduta",
  "Immagini digitali disponibili nell'area paziente",
  "Indicazioni cliniche per eventuali approfondimenti",
  "Consultazione diretta con il radiologo sui risultati",
];

const RELATED_EXAMS = [
  {
    name: "Ecografia Addome Completo",
    description: "Valutazione ecografica completa degli organi addominali.",
    icon: ScanLine,
  },
  {
    name: "Ecografia Tiroidea",
    description: "Studio della tiroide e delle strutture cervicali.",
    icon: Waves,
  },
  {
    name: "Ecografia Apparato Urinario",
    description: "Valutazione di reni, vescica e vie urinarie.",
    icon: ScanLine,
  },
  {
    name: "Ecografia Pelvica",
    description: "Approfondimento ecografico dell'apparato genitale.",
    icon: Waves,
  },
  {
    name: "Ecografia Muscolo-Tendinea",
    description: "Studio di muscoli, tendini e articolazioni.",
    icon: Stethoscope,
  },
  {
    name: "Ecocolordoppler TSA",
    description: "Studio dei tronchi sovraortici per la prevenzione vascolare.",
    icon: Waves,
  },
];

const FAQ = [
  {
    q: "Quanto dura un'ecografia?",
    a: "Un'ecografia dell'addome completo dura generalmente 20-30 minuti. Il Dr. Iovine dedica il tempo necessario a ogni esame per garantire la massima accuratezza diagnostica.",
  },
  {
    q: "Il referto è immediato?",
    a: "Sì, presso Cocoora il referto viene redatto e firmato dallo specialista in seduta ed è disponibile digitalmente nella tua area paziente entro la fine della giornata.",
  },
  {
    q: "Serve l'impegnativa?",
    a: "No. Puoi prenotare qualsiasi ecografia in regime privato su appuntamento concordato, senza impegnativa del medico di base.",
  },
  {
    q: "Come ci si prepara?",
    a: "Per l'ecografia dell'addome completo è necessario il digiuno di almeno 6 ore. Per altri tipi di ecografia la preparazione varia: al momento della prenotazione ti vengono fornite istruzioni specifiche.",
  },
  {
    q: "Che differenza c'è tra ecografia e altri esami radiologici?",
    a: "L'ecografia utilizza ultrasuoni (senza radiazioni ionizzanti) ed è ideale per tessuti molli, organi addominali e strutture muscolo-tendinee. Il Dr. Iovine ti orienta sull'indagine più appropriata.",
  },
  {
    q: "Quali ecografie esegue Cocoora?",
    a: "Addome completo, tiroide e paratiroide, apparato urinario e vescico-prostatico, pelvica sovrapubica, muscolo-tendinea ed Ecocolordoppler dei tronchi sovraortici.",
  },
  {
    q: "È inclusa nei Percorsi Salute?",
    a: "La diagnostica ecografica mirata rientra nei percorsi Cocoora Club Care, Experience e Signature in base al protocollo clinico annuale selezionato.",
  },
];

export default function EcografiaPage() {
  return (
    <>
      {/* [A] Banner Hero */}
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/diagnostics-lab.jpg"
          alt="Ecografia privata a Napoli — Cocoora Centro Medico"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-8">
          <Container>
            <span className="inline-block rounded-full border border-white/30 bg-dark-navy/45 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              Diagnostica Ecografica · Napoli
            </span>
          </Container>
        </div>
      </div>

      {/* [B] Hero Testuale */}
      <section className="hero-mesh relative overflow-hidden pb-16 pt-8 sm:pt-12">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto shadow-sm">
              Diagnostica Ecografica · Prenotazione su Appuntamento
            </Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              Ecografia Privata a Napoli
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Ecografie dell&apos;addome, tiroide, apparato urinario e
              muscolo-tendinee con refertazione diretta dello specialista in
              seduta e consegna digitale in giornata.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="#lead" size="lg">
                Prenota Ecografia
              </ButtonLink>
              <ButtonLink href="/club/experience" variant="secondary" size="lg">
                Scopri il Club Experience
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
            Cosa include l&apos;ecografia addome completo
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
                Specialista dedicato
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
        visitLabel="Ecografia Specialistica"
        visitSummary="Indagine ecografica mirata con colloquio clinico e refertazione immediata firmata dallo specialista."
        pathways={[
          {
            eyebrow: "Cocoora Club Care",
            title: "Prevenzione Annuale",
            description:
              "Percorso coordinato Uomo / Donna con check-up dedicato, monitoraggio digitale e continuità assistenziale.",
            href: "/club/care",
            ctaLabel: "Scopri Care",
          },
          {
            eyebrow: "Cocoora Club Experience",
            title: "Diagnostica Integrata",
            description:
              "Percorso avanzato che include la diagnostica ecografica per immagini all'interno di un check-up esteso.",
            href: "/club/experience",
            ctaLabel: "Scopri Experience",
            featured: true,
          },
        ]}
      />

      {/* [F] Lead Form collegato a /api/contact */}
      <VisitLeadSection
        heading="Prenota la tua ecografia"
        subheading="Lascia i tuoi recapiti: la segreteria di Cocoora Centro Medico ti ricontatterà per concordare l'appuntamento con il Dr. Iovine e fornirti le indicazioni di preparazione."
        serviceName="Diagnostica Ecografica"
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
