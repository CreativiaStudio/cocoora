"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

type Section = { id: string; label: string };

export function ScrollThread({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null
  );

  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!sections.length) return null;

  return (
    <nav
      aria-label="Il Filo Cocoora"
      className="fixed left-6 xl:left-10 top-1/2 -translate-y-1/2 h-[52vh] z-40 hidden lg:block"
    >
      <div className="relative h-full w-4 flex flex-col justify-between items-center">
        {/* Linea guida verticale base */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-teal-900/10 dark:bg-white/10"
        />

        {/* Linea attiva animata via scaleY, legata allo scroll di pagina */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px"
        >
          <motion.div
            style={{ scaleY }}
            className="h-full w-full bg-[#1C4A5C] origin-top will-change-transform"
          />
        </div>

        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleClick(section.id)}
              aria-label={section.label}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex items-center justify-center w-4 h-4 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80A1B2]"
            >
              {isActive ? (
                <span
                  className="relative flex items-center justify-center w-3 h-3 rounded-full ring-2 ring-white/80 transition-all duration-300"
                  style={{ backgroundColor: "#80A1B2" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: "#1C4A5C" }}
                  />
                </span>
              ) : (
                <span className="w-1 h-1 rounded-full bg-teal-900/25 dark:bg-white/35 transition-all duration-300 group-hover:scale-150 group-hover:bg-[#1C4A5C]" />
              )}

              {/* Pill label in hover */}
              <span
                className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 text-[11px] uppercase tracking-[0.2em] font-medium bg-white/95 px-3 py-1 rounded-full shadow-md text-teal-900"
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}