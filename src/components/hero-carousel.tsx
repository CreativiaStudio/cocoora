"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui";

const SLIDES = [
  {
    src: "/images/clinic-lounge.jpg",
    alt: "Sala d'attesa premium Cocoora — lounge accogliente e moderna",
    position: "object-center",
  },
  {
    src: "/images/doctor-consultation.jpg",
    alt: "Visita medica personalizzata da un Amico Medico Cocoora",
    position: "object-top",
  },
  {
    src: "/images/aesthetic-skin.jpg",
    alt: "Medicina estetica avanzata con tecnologie di punta a Napoli",
    position: "object-center",
  },
  {
    src: "/images/invisalign-smile.jpg",
    alt: "Sorriso perfetto con Invisalign Diamond Provider — odontoiatria Cocoora",
    position: "object-center",
  },
];

const INTERVAL_MS = 6000;

export function HeroCarousel({
  h1,
  openDiscover,
}: {
  h1?: string;
  openDiscover: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [kenKey, setKenKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    setPrev(current);
    setCurrent(idx);
    setKenKey((k) => k + 1);
  };

  const next = () => goTo((current + 1) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setTimeout(next, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] w-full overflow-hidden">
      {/* ── Slides ── */}
      {SLIDES.map((slide, idx) => {
        const isActive = idx === current;
        const isPrev = idx === prev;
        return (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
            }}
            aria-hidden={!isActive}
          >
            <Image
              key={isActive ? `active-${kenKey}` : `idle-${idx}`}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={[
                "object-cover",
                slide.position,
                isActive ? "animate-ken-burns" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ willChange: "transform" }}
            />
          </div>
        );
      })}

      {/* ── Overlay gradients ── */}
      {/* Localized scrim: foto luminosa, contrasto solo dove serve */}
      {/* Velo uniforme leggerissimo */}
      <div className="absolute inset-0 z-10 bg-dark-navy/20" />
      {/* Top: stacca la navbar */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-dark-navy/50 via-transparent to-transparent" />
      {/* Bottom: appoggio per le card metriche */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-dark-navy/70" />
      {/* Centro: velo radiale soffuso dietro il blocco di testo */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 48%, rgba(3,53,75,0.38) 0%, transparent 75%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-5 text-center sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-dark-navy/60 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md animate-fade-up sm:text-xs"
            style={{
              boxShadow:
                "0 8px 24px -8px rgba(1,24,36,0.6), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-accent shadow-[0_0_8px_2px_rgba(128,161,178,0.7)]" />
            Studio Medico Polispecialistico d&apos;Eccellenza — Napoli
          </div>

          {/* H1 */}
          <h1
            className="mt-7 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-white animate-fade-up sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{
              animationDelay: "100ms",
              textShadow:
                "0 2px 14px rgba(3,53,75,0.8), 0 4px 30px rgba(0,0,0,0.5), 0 1px 2px rgba(1,24,36,0.6)",
            }}
          >
            {h1 ?? "Connessi alla tua salute."}
          </h1>

          {/* Sottotitolo */}
          <p
            className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white animate-fade-up sm:text-lg"
            style={{
              animationDelay: "200ms",
              textShadow:
                "0 1px 3px rgba(1,24,36,0.8), 0 2px 14px rgba(3,53,75,0.85), 0 4px 26px rgba(0,0,0,0.5)",
            }}
          >
            Abbiamo azzerato attese, burocrazia e complessità per permetterti di
            vivere un percorso di salute fluido, immediato e senza ostacoli.
          </p>

          {/* CTA */}
          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            <Button size="lg" onClick={openDiscover} variant="white">
              Inizia gratis con il Club <Plus className="h-4 w-4" />
            </Button>
            <ButtonLink href="/contatti" variant="outline-dark" size="lg">
              Prenota Visita
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* ── Trust Metrics overlay ── */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center px-5 sm:px-8">
        <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
          {[
            { value: "15+", label: "Specialità Mediche" },
            { value: "2 min", label: "Prenotazione" },
            { value: "0€", label: "Discover" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-white/25 bg-dark-navy/55 px-4 py-4 text-center backdrop-blur-xl"
              style={{
                WebkitBackdropFilter: "blur(20px) saturate(140%)",
                backdropFilter: "blur(20px) saturate(140%)",
                boxShadow:
                  "0 20px 40px -20px rgba(1,24,36,0.7), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <p
                className="font-serif text-2xl font-semibold text-white sm:text-3xl"
                style={{ textShadow: "0 1px 6px rgba(1,24,36,0.5)" }}
              >
                {m.value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/90 sm:text-xs">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Vai alla slide ${idx + 1}`}
            onClick={() => goTo(idx)}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: idx === current ? "2rem" : "0.375rem",
              backgroundColor: idx === current ? "white" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
