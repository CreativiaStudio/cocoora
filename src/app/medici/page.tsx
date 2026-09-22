"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { BRANCHE, DOCTORS } from "@/lib/doctors";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge, ButtonLink, Container, SectionLabel } from "@/components/ui";

export default function MediciPage() {
  const [filter, setFilter] = useState<string>("Tutte");

  const filtered = useMemo(() => {
    if (filter === "Tutte") return DOCTORS;
    return DOCTORS.filter((d) => d.branca === filter);
  }, [filter]);

  return (
    <>
      <section className="hero-mesh relative overflow-hidden pb-16 pt-32 sm:pt-36">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto">
              <ShieldCheck className="h-3.5 w-3.5" /> Zero Liste d&apos;Attesa — Convenzione Universitaria
            </Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              I nostri specialisti
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Una rete di medici con cattedre e convenzioni presso il Policlinico
              Federico II, l&apos;Università Vanvitelli e l&apos;A.O.R.N. Cardarelli.
              Visite immediate, senza liste d&apos;attesa, con lo stesso rigore
              clinico dell&apos;ambiente ospedaliero.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-canvas pb-24">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {["Tutte", ...BRANCHE].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setFilter(b)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-medium transition-all",
                  filter === b
                    ? "border-teal-600 bg-teal-600 text-white shadow-[0_10px_30px_-12px_rgba(28,74,92,0.55)]"
                    : "border-teal-200 bg-white text-charcoal/70 hover:border-teal-400 hover:text-teal-800"
                )}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doctor) => (
              <Link
                key={doctor.slug}
                href={`/medici/${doctor.slug}`}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-teal-100 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_70px_-24px_rgba(3,53,75,0.4)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    sizes="(min-width: 1024px) 400px, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/80 via-dark-navy/10 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-800 backdrop-blur-sm">
                    <ShieldCheck className="h-3 w-3" /> Zero Attese
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-serif text-xl font-semibold text-white">{doctor.name}</p>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-teal-200/90">
                      {doctor.branca}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/60">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                    {doctor.affiliation}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">
                    {doctor.approach}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-teal-50 pt-4">
                    <span className="text-xs text-charcoal/55">
                      Visita da <strong className="text-teal-900">{formatPrice(doctor.tariffaVisita)}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                      Scopri <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-alt py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-navy px-8 py-14 text-center text-white sm:px-16">
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-2xl">
              <SectionLabel>
                <span className="text-slate-accent">Il tuo percorso</span>
              </SectionLabel>
              <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Visite illimitate con i migliori specialisti
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Con Cocoora Club scegli il tuo percorso annuale e includi le
                visite con i tuoi specialisti di fiducia, a un prezzo più
                conveniente della singola prestazione.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href="/club" variant="white" size="lg">
                  Entra in Cocoora Club <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
