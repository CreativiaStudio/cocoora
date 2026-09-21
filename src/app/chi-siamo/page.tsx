"use client";

import Image from "next/image";
import {
  Clock,
  HeartHandshake,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useCms, useShop } from "@/components/providers";
import { CLINIC_GALLERY, LEADERSHIP, PRINCIPLES } from "@/lib/clinic";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const iconMap: Record<string, LucideIcon> = {
  HeartHandshake,
  Clock,
  Users,
  Sparkles,
};

export default function ChiSiamoPage() {
  const { pages } = useCms();
  const { openDiscover } = useShop();
  const page = pages.find((p) => p.path === "/chi-siamo");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-36">
        <div className="absolute inset-0">
          <Image
            src="/images/clinic-lounge.jpg"
            alt="La lounge di benvenuto Cocoora"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-navy/85 via-dark-navy/70 to-dark-navy/90" />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center text-white">
            <Badge className="mx-auto bg-white/15 text-white">La Nostra Visione</Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {page?.h1 ?? "La medicina come dovrebbe essere: umana, immediata, predittiva."}
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-teal-100/90">
              Cocoora nasce per superare l&apos;idea tradizionale di visita medica:
              un unico hub multidisciplinare dove tecnologia, ambienti accoglienti
              e rapporto umano lavorano insieme per la tua salute.
            </p>
          </div>
        </Container>
      </section>

      {/* ── I 4 Principi Fondamentali ─────────────────────────────────── */}
      <section className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Il Metodo Cocoora</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              I 4 Principi Fondamentali
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => {
              const Icon = iconMap[principle.icon] ?? Sparkles;
              return (
                <div
                  key={principle.id}
                  className="group flex gap-5 rounded-3xl border border-teal-100 bg-white p-8 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.4)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-teal-900">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                      {principle.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Virtual Tour & Galleria ───────────────────────────────────── */}
      <section className="bg-teal-50/60 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Virtual Tour</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Gli spazi Cocoora
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Ambienti pensati per accogliere, rassicurare e mettere a proprio
              agio, lontano dai cliché della sanità tradizionale.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CLINIC_GALLERY.map((item, i) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-3xl shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)] ${
                  i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className={`relative w-full ${i === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    sizes="(min-width: 1024px) 480px, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/80 via-dark-navy/10 to-transparent" />
                </div>
                <p className="absolute inset-x-0 bottom-0 p-5 text-sm font-medium leading-snug text-white">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Governance & Direzione Medica ─────────────────────────────── */}
      <section className="bg-canvas py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Governance</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
              Direzione Medica & Governance
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/70">
              Una supervisione clinica costante, a garanzia di sicurezza,
              appropriatezza e qualità in ogni percorso di cura.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.id}
                className="flex gap-5 rounded-3xl border border-teal-100 bg-white p-8 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)]"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-dark-navy font-serif text-xl font-semibold text-white">
                  {leader.monogram}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-teal-900">
                    {leader.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-accent">
                    {leader.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA Finale ───────────────────────────────────────────────── */}
      <section className="bg-canvas pb-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-navy px-8 py-16 text-center text-white sm:px-16">
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-2xl">
              <HeartHandshake className="mx-auto h-9 w-9 text-slate-accent" />
              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Vieni a conoscere il tuo Amico Medico
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Prenota una consulenza orientativa o la tua prima visita: ti
                aiutiamo a scegliere il percorso più adatto a te.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={openDiscover}>
                  Consulenza orientativa gratuita
                </Button>
                <ButtonLink href="/contatti" variant="outline-dark" size="lg">
                  Prenota una visita
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
