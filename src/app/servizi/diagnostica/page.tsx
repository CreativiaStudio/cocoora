"use client";

import Image from "next/image";
import {
  Activity,
  Baby,
  Check,
  Eye,
  Heart,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useCms, useShop } from "@/components/providers";
import { SPECIALTIES } from "@/lib/diagnostics";
import { DOCTORS } from "@/lib/doctors";
import { CLUB_TIERS, FAMILY_ADDONS } from "@/lib/club";
import { DoctorsReferenceSection, ClubPackagesSection } from "@/components/sections/servizi-cross-links";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const DIAGNOSTICA_DOCTORS = DOCTORS.filter((d) =>
  ["cardiologia", "senologia", "radiologia-ecografie", "oculistica", "pediatria", "ginecologia"].includes(
    d.specialtyId ?? ""
  )
);
const DIAGNOSTICA_PACKAGES = [
  ...CLUB_TIERS.filter((t) => ["care", "experience", "signature"].includes(t.id)),
  FAMILY_ADDONS[0],
];

const iconMap: Record<string, LucideIcon> = {
  Heart,
  ShieldCheck,
  Activity,
  Eye,
  Baby,
  Sparkles,
};

export default function DiagnosticaPage() {
  const { pages } = useCms();
  const { openDiscover } = useShop();
  const page = pages.find((p) => p.path === "/servizi/diagnostica");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-mesh relative overflow-hidden pb-20 pt-32 sm:pt-36">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto">Poliambulatorio Specialistico</Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              {page?.h1 ?? "Diagnostica rapida, refertazione digitale e specialisti dedicati."}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Sei specialità cliniche integrate, senza liste d&apos;attesa e con
              referti digitali disponibili h24 nella tua area riservata.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/contatti" size="lg">
                Prenota un esame diagnostico
              </ButtonLink>
              <ButtonLink href="#specialita" variant="secondary" size="lg">
                Scopri le specialità
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Le 6 Specialità ──────────────────────────────────────────── */}
      <section id="specialita" className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Le Nostre Specialità</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Un poliambulatorio, sei branche specialistiche
            </h2>
          </div>

          <div className="mt-14 space-y-6">
            {SPECIALTIES.map((s, i) => {
              const Icon = iconMap[s.icon] ?? Sparkles;
              const reverse = i % 2 === 1;
              return (
                <div
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-32 grid gap-0 overflow-hidden rounded-[2rem] border border-teal-100 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.3)] lg:grid-cols-2"
                >
                  <div
                    className={`relative aspect-[16/10] w-full lg:aspect-auto ${
                      reverse ? "lg:order-2" : ""
                    }`}
                  >
                    {s.image && (
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        sizes="(min-width: 1024px) 560px, 90vw"
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/40 via-transparent to-transparent lg:bg-gradient-to-r" />
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                      {s.description}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {s.exams.map((exam) => (
                        <li key={exam} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                          {exam}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── La Salute della Famiglia ────────────────────────────────── */}
      <section className="bg-teal-50/60 py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_30px_70px_-28px_rgba(3,53,75,0.35)]">
              <Image
                src="/images/pediatric-family.jpg"
                alt="Visita pediatrica e famiglia a Cocoora"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
            </div>
            <div>
              <SectionLabel>La Salute della Famiglia</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
                Un percorso dedicato a ogni età della vita
              </h2>
              <p className="mt-5 text-base leading-relaxed text-charcoal/75">
                Dalla pediatria alla senologia, dalla ginecologia alla cardiologia
                preventiva: Cocoora accompagna ogni componente della famiglia con
                percorsi di prevenzione su misura, in un ambiente rassicurante e
                accogliente per bambini e adulti.
              </p>
              <div className="mt-8">
                <ButtonLink href="/contatti" variant="secondary">
                  Prenota una visita per la famiglia
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA Finale ───────────────────────────────────────────────── */}
      <section className="bg-canvas pb-28 pt-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-navy px-8 py-16 text-center text-white sm:px-16">
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-2xl">
              <Badge className="bg-white/15 text-white">Zero Liste d&apos;Attesa</Badge>
              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Prenota il tuo esame diagnostico
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Visite specialistiche ed esami senza impegnativa, con referti
                digitali disponibili h24 nella tua area riservata.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={openDiscover}>
                  Inizia gratis
                </Button>
                <ButtonLink href="/contatti" variant="outline-dark" size="lg">
                  Prenota Visita
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <DoctorsReferenceSection doctors={DIAGNOSTICA_DOCTORS} />
      <ClubPackagesSection tiers={DIAGNOSTICA_PACKAGES} />

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
