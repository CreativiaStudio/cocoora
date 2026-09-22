import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { getTierDetail, computeSavings } from "@/lib/club-details";
import type { ClubTier, Doctor } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge, Container, SectionLabel } from "@/components/ui";

export function DoctorsReferenceSection({
  doctors,
  eyebrow = "I Nostri Specialisti",
  title = "Medici di riferimento",
  className = "bg-canvas",
}: {
  doctors: Doctor[];
  eyebrow?: string;
  title?: string;
  className?: string;
}) {
  if (doctors.length === 0) return null;
  return (
    <section className={`${className} py-20`}>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">
            Specialisti con convenzione universitaria e ospedaliera: visite
            immediate, senza liste d&apos;attesa.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Link
              key={doctor.slug}
              href={`/medici/${doctor.slug}`}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-teal-100 bg-white shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(3,53,75,0.4)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(min-width: 1024px) 360px, 90vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/80 via-dark-navy/10 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-800 backdrop-blur-sm">
                  <ShieldCheck className="h-3 w-3" /> Zero Attese
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-serif text-lg font-semibold text-white">{doctor.name}</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-teal-200/90">
                    {doctor.branca}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/55">
                  <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-accent" />
                  {doctor.affiliation}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                  Vedi profilo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ClubPackagesSection({
  tiers,
  className = "section-alt",
}: {
  tiers: ClubTier[];
  className?: string;
}) {
  if (tiers.length === 0) return null;
  return (
    <section className={`${className} py-20`}>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Pacchetti Dedicati</SectionLabel>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
            Il tuo percorso Cocoora Club
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">
            Include queste prestazioni in un percorso annuale e azzera la
            burocrazia: un unico profilo digitale, referti h24 e priorità di
            prenotazione grazie alle nostre convenzioni universitarie.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => {
            const detail = getTierDetail(tier.id);
            const { savingsPercent } = detail
              ? computeSavings(tier.price, detail)
              : { savingsPercent: 0 };
            return (
              <Link
                key={tier.id}
                href={`/club/${tier.id}`}
                className="group relative flex flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_20px_50px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.4)]"
              >
                {tier.badge && (
                  <Badge className="absolute -top-3 left-6 bg-teal-500 text-white">{tier.badge}</Badge>
                )}
                <h3 className="font-serif text-2xl font-semibold text-teal-900">{tier.name}</h3>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-semibold text-teal-900">
                    {tier.free ? "€0" : formatPrice(tier.price)}
                  </span>
                  <span className="text-sm text-charcoal/55">{tier.free ? "" : "/ anno"}</span>
                </p>
                {savingsPercent > 0 && (
                  <p className="mt-2 text-sm font-medium text-teal-700">
                    Fino al {savingsPercent}% di risparmio sulle prestazioni singole
                  </p>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">{tier.description}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                  Scopri il pacchetto <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
