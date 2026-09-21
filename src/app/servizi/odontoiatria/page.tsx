"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Check, Sparkles } from "lucide-react";
import { useCms } from "@/components/providers";
import { getTreatmentsByCategory } from "@/lib/content";
import { Badge, ButtonLink, Container, SectionLabel } from "@/components/ui";

const PILLARS = [
  { title: "Diagnosi prima del trattamento", text: "Valutiamo denti, gengive, occlusione, profilo del sorriso e obiettivi." },
  { title: "Piano clinico digitale", text: "Percorso progettato, seguito e controllato con tecnologia 3D." },
  { title: "Accompagnamento completo", text: "Dalla diagnosi alla pianificazione, fino alla fase di mantenimento." },
];

export default function OdontoiatriaPage() {
  const { pages } = useCms();
  const page = pages.find((p) => p.path === "/servizi/odontoiatria");
  const treatments = getTreatmentsByCategory("odontoiatria");
  const invisalign = treatments.filter((t) => t.slug.startsWith("invisalign"));
  const altri = treatments.filter((t) => !t.slug.startsWith("invisalign"));

  return (
    <>
      <section className="hero-mesh relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="text-center lg:text-left">
              <Badge className="lg:mx-0 mx-auto">Invisalign Diamond Provider</Badge>
              <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
                {page?.h1 ?? "Odontoiatria e ortodonzia a Cocoora"}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75 lg:mx-0">
                Cura, prevenzione e allineamento del sorriso con un approccio digitale.
                A Cocoora ci prendiamo cura del sorriso partendo da ciò che conta
                davvero: salute orale, funzione, estetica e stabilità nel tempo.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <ButtonLink href="#invisalign" size="lg">
                  Percorsi Invisalign
                </ButtonLink>
                <ButtonLink href="/contatti" variant="secondary" size="lg">
                  Prenota visita
                </ButtonLink>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.5rem] shadow-[0_30px_70px_-28px_rgba(3,53,75,0.4)] lg:mx-0">
              <Image
                src="/images/invisalign-smile.jpg"
                alt="Sorriso radioso odontoiatria Invisalign Cocoora"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/30 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-20">
        <Container>
          <div className="grid gap-10 rounded-[2.5rem] bg-dark-navy p-8 text-white sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-slate-accent">
                <Award className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-serif text-3xl font-semibold sm:text-4xl">
                {page?.h2 ?? "Cocoora è Invisalign Diamond Provider"}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Un riconoscimento che valorizza l'esperienza maturata con il sistema
                Invisalign e che per il paziente rappresenta un elemento di fiducia
                nella gestione del percorso. La differenza non è solo nella tecnologia,
                ma nel modo in cui il percorso viene progettato, seguito e controllato.
              </p>
              <div className="mt-8 space-y-4">
                {PILLARS.map((p) => (
                  <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-slate-accent" />
                    <div>
                      <p className="font-medium text-white">{p.title}</p>
                      <p className="mt-1 text-xs text-teal-200/80">{p.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]">
              <Image
                src="/images/dental-operatory.jpg"
                alt="Suite odontoiatrica digitale Cocoora Milano"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="invisalign" className="bg-teal-50/60 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Percorsi Invisalign</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-teal-900">
              Un percorso per ogni età
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {invisalign.map((t) => (
              <TreatmentCard key={t.slug} slug={t.slug} title={t.title} text={t.tagline} />
            ))}
          </div>
        </Container>
      </section>

      <section id="servizi" className="bg-canvas py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>I Nostri Servizi</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-teal-900">
              Cura completa del tuo sorriso
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {altri.map((t) => (
              <TreatmentCard key={t.slug} slug={t.slug} title={t.title} text={t.tagline} />
            ))}
          </div>
        </Container>
      </section>

      <FaqSection faq={page?.faq ?? []} />
    </>
  );
}

function TreatmentCard({ slug, title, text }: { slug: string; title: string; text: string }) {
  return (
    <Link
      href={`/trattamenti/${slug}`}
      className="group flex h-full flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.4)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-serif text-xl font-semibold text-teal-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/65">{text}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
        Scopri <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  if (faq.length === 0) return null;
  return (
    <section className="bg-canvas pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>Domande Frequenti</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold text-teal-900">FAQ</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-teal-100 bg-white p-6">
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
