"use client";

import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, Check, Droplets, Sparkles } from "lucide-react";
import { useCms } from "@/components/providers";
import { getTreatmentsByCategory } from "@/lib/content";
import { DOCTORS } from "@/lib/doctors";
import { CLUB_TIERS } from "@/lib/club";
import { DoctorsReferenceSection, ClubPackagesSection } from "@/components/sections/servizi-cross-links";
import { MatriceMedicinaEstetica } from "@/components/sections/matrice-medicina";
import { Badge, ButtonLink, Container, SectionLabel } from "@/components/ui";

const ESTETICA_DOCTORS = DOCTORS.filter((d) => d.branca.includes("Medicina Estetica"));
const ESTETICA_PACKAGES = CLUB_TIERS.filter((t) => ["access", "care", "experience"].includes(t.id));

const KEY_POINTS = [
  { title: "Valutazione medica preliminare", text: "Ogni trattamento viene indicato solo dopo la valutazione di un medico specialista." },
  { title: "Risultati naturali e progressivi", text: "L'obiettivo è valorizzare, non trasformare." },
  { title: "Tecnologie selezionate", text: "Piattaforme laser, ultrasuoni focalizzati e tecnologie per il rimodellamento corporeo." },
  { title: "Protocolli combinati", text: "Quando indicato, più trattamenti integrati per lavorare su pelle, volumi, tono e profilo." },
];

export default function MedicinaEsteticaPage() {
  const { pages } = useCms();
  const page = pages.find((p) => p.path === "/servizi/medicina-estetica");
  const treatments = getTreatmentsByCategory("medicina-estetica");

  return (
    <>
      <div className="relative z-10 h-72 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-80 md:h-96">
        <Image
          src="/images/aesthetic-skin.jpg"
          alt="Medicina estetica avanzata e trattamenti rigenerativi presso Cocoora Napoli"
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
              <Badge className="lg:mx-0 mx-auto shadow-sm">Medicina Estetica Avanzata</Badge>
              <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
                {page?.h1 ?? "Medicina estetica presso Cocoora"}
              </h1>
              <p className="mt-3 font-serif text-lg italic text-teal-800">
                La tua bellezza valorizzata nella sua forma più autentica — Naturally You.
              </p>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75 lg:mx-0">
                La medicina estetica, per noi, comincia dall&apos;ascolto. Competenza medica,
                tecnologie selezionate e percorsi personalizzati per valorizzare la persona
                nel rispetto della sua armonia naturale.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-charcoal/70 lg:mx-0">
                Nel nostro centro la medicina estetica nasce da una valutazione medica attenta.
                L&apos;obiettivo non è modificare i tratti, ma accompagnare ogni paziente verso
                un miglioramento naturale e coerente con la propria identità.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <ButtonLink href="#trattamenti" size="lg">
                  Scopri i trattamenti
                </ButtonLink>
                <ButtonLink href="/contatti" variant="secondary" size="lg">
                  Prenota valutazione
                </ButtonLink>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.5rem] shadow-[0_30px_70px_-28px_rgba(3,53,75,0.4)] lg:mx-0">
              <Image
                src="/images/aesthetic-skin.jpg"
                alt="Medicina estetica rigenerativa e qualità cutanea Cocoora"
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
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionLabel>L&apos;approccio Cocoora</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900">
                {page?.h2 ?? "Un percorso estetico costruito sulla persona"}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-charcoal/75">
                Ogni pelle, ogni viso e ogni corpo hanno una storia diversa. Per questo,
                prima di proporre un trattamento, partiamo da una visita medica e dalla
                valutazione delle caratteristiche cutanee, delle proporzioni, delle
                abitudini e degli obiettivi da raggiungere.
              </p>
              <div className="mt-8 relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-[0_20px_50px_-28px_rgba(3,53,75,0.3)]">
                <Image
                  src="/images/laser-technology.jpg"
                  alt="Piattaforma laser dermatologica ad alta precisione Cocoora"
                  fill
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {KEY_POINTS.map((k) => (
                <div key={k.title} className="rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)]">
                  <Check className="h-5 w-5 text-teal-600" />
                  <p className="mt-3 font-medium text-teal-900">{k.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">{k.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Percorso guidato interattivo — Matrice Trattamenti */}
      <MatriceMedicinaEstetica />

      <section id="trattamenti" className="bg-teal-50/60 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Trattamenti</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-teal-900">
              Tecnologie e protocolli dedicati
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map((t) => (
              <Link
                key={t.slug}
                href={`/trattamenti/${t.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.4)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-teal-900">{t.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/65">{t.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                  Scopri <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Box multidisciplinare — Lipedema e Linfedema */}
      <section className="bg-canvas py-20">
        <Container>
          <div className="rounded-[2rem] border border-teal-100 bg-teal-50/60 p-8 sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <SectionLabel>Box Multidisciplinare</SectionLabel>
              <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
                Valutazione Specialistica per Lipedema e Linfedema
              </h2>
              <p className="mt-3 font-serif text-lg italic text-teal-800">
                Un percorso medico integrato e personalizzato.
              </p>
              <p className="mt-5 text-base leading-relaxed text-charcoal/75">
                Il lipedema e il linfedema sono condizioni complesse che richiedono un
                corretto inquadramento specialistico. Nel nostro centro è possibile
                effettuare una valutazione clinica dedicata, per individuare le
                caratteristiche della condizione e orientare la persona verso il percorso
                più appropriato, anche con un approccio multidisciplinare.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="flex h-full flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-teal-900">Lipedema</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/65">
                  Condizione cronica con un&apos;alterata distribuzione del tessuto adiposo,
                  prevalentemente agli arti inferiori e, in alcuni casi, agli arti superiori.
                </p>
              </div>
              <div className="flex h-full flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                  <Droplets className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-teal-900">Linfedema</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/65">
                  Accumulo di liquido linfatico nei tessuti, che può determinare gonfiore
                  persistente e aumento di volume dell&apos;area interessata.
                </p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <ButtonLink href="/contatti" size="lg">
                Richiedi una valutazione specialistica <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>

          {/* Zone trattabili corpo */}
          <div className="mt-10 rounded-3xl border border-teal-100 bg-white p-7 text-center shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-accent">
              Zone Trattabili — Corpo
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
              Addome, fianchi, culotte de cheval, interno coscia, area sottoglutea/banana
              roll e altre aree selezionate dopo valutazione medica in base
              all&apos;anatomia, alla qualità dei tessuti e alle esigenze specifiche del
              paziente.
            </p>
          </div>
        </Container>
      </section>

      <DoctorsReferenceSection doctors={ESTETICA_DOCTORS} />
      <ClubPackagesSection tiers={ESTETICA_PACKAGES} />

      <FaqSection faq={page?.faq ?? []} />
    </>
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
