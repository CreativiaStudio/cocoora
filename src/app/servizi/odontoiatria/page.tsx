"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Check, Sparkles } from "lucide-react";
import { useCms } from "@/components/providers";
import { getTreatmentsByCategory } from "@/lib/content";
import { DOCTORS } from "@/lib/doctors";
import { CLUB_TIERS } from "@/lib/club";
import { DoctorsReferenceSection, ClubPackagesSection } from "@/components/sections/servizi-cross-links";
import { Badge, ButtonLink, Container, SectionLabel } from "@/components/ui";

const ODONTO_DOCTORS = DOCTORS.filter((d) => d.branca.includes("Odontoiatria"));
const ODONTO_PACKAGES = CLUB_TIERS.filter((t) => ["access", "care"].includes(t.id));

const FILOSOFIA_STEPS = [
  {
    title: "Ascoltare. Comprendere. Progettare.",
    text: "Una visita approfondita è il punto di partenza: valutiamo la salute orale, individuiamo eventuali necessità di cura e definiamo insieme le priorità, senza scorciatoie e senza promesse irrealistiche.",
  },
  {
    title: "Un approccio integrato",
    text: "Ortodonzia, parodontologia, odontoiatria restaurativa, protesi e altre discipline dialogano quando il caso lo richiede. Perché un sorriso armonioso è prima di tutto un sorriso seguito con attenzione.",
  },
  {
    title: "Ortodonzia: la differenza è nello specialista",
    text: "Nel nostro centro, i trattamenti ortodontici sono eseguiti esclusivamente da specialisti in ortodonzia con un elevato livello di esperienza clinica, per progettare movimenti dentali biologicamente compatibili e controllarne l'evoluzione.",
  },
];

const ALLINEATORI_HIGHLIGHTS = [
  {
    title: "Tecnologia digitale, guidata dall'esperienza",
    text: "La scansione intraorale e i software di pianificazione aiutano lo specialista a studiare la sequenza dei movimenti. La simulazione 3D mostra il progetto terapeutico: è una rappresentazione digitale, non una garanzia del risultato finale.",
  },
  {
    title: "Ogni dettaglio conta",
    text: "In alcuni casi vengono utilizzati piccoli elementi in composito, chiamati attachment, o altri ausili ortodontici per favorire determinati movimenti. Controlli periodici e possibili adattamenti del piano permettono di seguire l'andamento della terapia.",
  },
  {
    title: "Libertà nella quotidianità",
    text: "Gli allineatori possono essere rimossi per mangiare e per l'igiene orale. Per funzionare correttamente, però, devono essere indossati secondo le indicazioni dello specialista: la collaborazione del paziente è parte integrante del trattamento.",
  },
  {
    title: "Il sorriso si mantiene nel tempo",
    text: "Dopo la fase attiva, la contenzione con dispositivi fissi o rimovibili aiuta a limitare gli spostamenti indesiderati dei denti. Il mantenimento è una fase essenziale del percorso ortodontico.",
  },
];

export default function OdontoiatriaPage() {
  const { pages } = useCms();
  const page = pages.find((p) => p.path === "/servizi/odontoiatria");
  const treatments = getTreatmentsByCategory("odontoiatria");
  const allineatori = treatments.filter((t) => t.slug.startsWith("invisalign"));
  const altri = treatments.filter((t) => !t.slug.startsWith("invisalign"));

  return (
    <>
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/invisalign-smile.jpg"
          alt="Il tuo sorriso, la nostra visione — Odontoiatria e ortodonzia specialistica Cocoora Napoli"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Velo scuro leggero in alto per la leggibilità della navbar */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
      </div>

      <section className="hero-mesh relative overflow-hidden pb-16 pt-8 sm:pt-12 lg:pb-24">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="text-center lg:text-left">
              <Badge className="lg:mx-0 mx-auto shadow-sm">
                Ortodonzia Specialistica &amp; Allineatori Trasparenti
              </Badge>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">
                Odontoiatria · Ortodonzia Specialistica · Estetica del Sorriso
              </p>
              <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
                Il tuo sorriso, la nostra visione.
              </h1>
              <p className="mx-auto mt-4 max-w-xl font-serif text-xl font-medium leading-snug text-dark-navy/90 lg:mx-0">
                La bellezza si riconosce. La competenza si sente. La salute si costruisce nel tempo.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-lg italic leading-relaxed text-charcoal/80 lg:mx-0">
                Un sorriso che ti rappresenta. Un percorso di cura pensato per te.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <ButtonLink href="/contatti" size="lg">
                  Prenota una visita specialistica
                </ButtonLink>
                <ButtonLink href="#allineatori" variant="secondary" size="lg">
                  Scopri gli Allineatori Trasparenti
                </ButtonLink>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.5rem] shadow-[0_30px_70px_-28px_rgba(3,53,75,0.4)] lg:mx-0">
              <Image
                src="/images/invisalign-smile.jpg"
                alt="Odontoiatria, ortodonzia specialistica ed estetica del sorriso nel nostro centro Cocoora"
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
              <SectionLabel className="mt-5 text-teal-200/80">
                {"01 · La Filosofia Cocoora  |  02 · Il Nostro Tratto Distintivo"}
              </SectionLabel>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                La bellezza parte dalla salute.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Ogni sorriso ha una storia. Per questo, prima di proporre un trattamento,
                ascoltiamo le tue esigenze e studiamo le caratteristiche della tua bocca.
                Denti, gengive, occlusione ed estetica sono parte di una visione clinica
                d&apos;insieme. Il nostro metodo unisce prevenzione, diagnosi e competenze
                odontoiatriche diverse per definire percorsi personalizzati, con obiettivi
                chiari e scelte terapeutiche motivate.
              </p>
              <p className="mt-6 font-serif text-xl font-medium text-white">
                Ortodonzia: la differenza è nello specialista.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-teal-200/80">
                Allineare i denti non significa semplicemente indossare un dispositivo.
                Significa comprendere una malocclusione, progettare movimenti dentali
                biologicamente compatibili e controllarne l&apos;evoluzione. Nel nostro centro,
                i trattamenti ortodontici sono eseguiti esclusivamente da specialisti in
                ortodonzia con un elevato livello di esperienza clinica.
              </p>
              <div className="mt-8 space-y-4">
                {FILOSOFIA_STEPS.map((p) => (
                  <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-slate-accent" />
                    <div>
                      <p className="font-medium text-white">{p.title}</p>
                      <p className="mt-1 text-xs text-teal-200/80">{p.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm italic text-teal-200/90">
                Non cerchiamo sorrisi tutti uguali. Cerchiamo il percorso giusto per ogni persona.
              </p>
              <p className="mt-2 text-xs text-teal-200/70">
                Protocolli clinici avanzati per allineatori trasparenti supervisionati da specialisti in ortodonzia.
              </p>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]">
              <Image
                src="/images/dental-operatory.jpg"
                alt="Suite odontoiatrica digitale nel nostro centro Cocoora Napoli"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="allineatori" className="bg-teal-50/60 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>03 · Allineatori Trasparenti</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-teal-900">
              Discreti nell&apos;aspetto. Specialistici nel progetto.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/75">
              Gli allineatori trasparenti sono apparecchi ortodontici rimovibili e realizzati
              su misura, utilizzati per ottenere spostamenti dentali programmati. Una soluzione
              dall&apos;impatto visivo contenuto, da scegliere in base alla diagnosi e non
              soltanto alle preferenze estetiche.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {ALLINEATORI_HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="flex h-full flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-teal-900">{h.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/65">{h.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center font-serif text-base italic text-teal-900">
            La tecnologia è uno strumento. La competenza specialistica dà direzione al trattamento.
          </p>

          <div className="mt-16">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>04 · Ortodonzia in ogni fase della vita</SectionLabel>
              <h3 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
                Ogni età ha il suo momento.
              </h3>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {allineatori.map((t) => (
                <TreatmentCard key={t.slug} slug={t.slug} title={t.title} text={t.tagline} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="servizi" className="bg-canvas py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>05 · Cura Completa</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-teal-900">
              Molto più di un bel sorriso.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {altri.map((t) => (
              <TreatmentCard key={t.slug} slug={t.slug} title={t.title} text={t.tagline} />
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-charcoal/70">
            Nota clinica su Gnatologia e disturbi temporomandibolari: il bruxismo richiede un
            inquadramento specifico; eventuali bite possono avere una funzione protettiva o
            sintomatica, ma non rappresentano una cura universale.
          </p>
          <p className="mt-4 text-center font-serif text-base italic text-teal-900">
            COCOORA. La cura che valorizza il tuo sorriso.
          </p>
        </Container>
      </section>

      <DoctorsReferenceSection doctors={ODONTO_DOCTORS} />
      <ClubPackagesSection tiers={ODONTO_PACKAGES} />

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
