"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV_NODES } from "@/lib/site";
import type { NavNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ButtonLink } from "./ui";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDesktop(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDesktop(null), 120);
  };

  const closeAll = () => {
    setOpenDesktop(null);
    setMobileOpen(false);
    setMobileAccordion(null);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || mobileOpen
          ? "glass border-b border-teal-900/10 shadow-[0_8px_40px_-20px_rgba(3,53,75,0.28)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="Cocoora — Home" onClick={closeAll} className="shrink-0">
          <Logo variant="dark" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={scheduleClose}>
          {NAV_NODES.map((node) =>
            node.children ? (
              <div key={node.label} className="relative" onMouseEnter={() => openMenu(node.label)}>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-charcoal/80 transition-colors hover:text-teal-700",
                    openDesktop === node.label && "text-teal-700"
                  )}
                  aria-expanded={openDesktop === node.label}
                >
                  {node.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300",
                      openDesktop === node.label && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "absolute left-1/2 top-full z-40 w-[min(640px,90vw)] -translate-x-1/2 pt-3 transition-all duration-200",
                    openDesktop === node.label
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-2 opacity-0"
                  )}
                >
                  <div className="grid gap-1 rounded-3xl border border-teal-900/10 bg-white/95 p-3 shadow-[0_30px_70px_-24px_rgba(3,53,75,0.35)] backdrop-blur-xl sm:grid-cols-2">
                    {node.children.map((child) => (
                      <DropdownItem key={child.href} child={child} onClick={closeAll} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={node.label}
                href={node.href ?? "#"}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-charcoal/80 transition-colors hover:text-teal-700"
              >
                {node.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/contatti" size="md">
            Prenota Visita
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-white/70 text-teal-800 backdrop-blur-sm lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Slide-Over ─────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-dark-navy/40 backdrop-blur-sm"
          onClick={closeAll}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-teal-100 px-6 py-6">
            <Logo variant="dark" />
            <button
              type="button"
              aria-label="Chiudi menu"
              onClick={closeAll}
              className="rounded-full p-2 text-charcoal/60 transition-colors hover:bg-teal-50 hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="flex flex-col gap-1">
              {NAV_NODES.map((node) =>
                node.children ? (
                  <li key={node.label} className="border-b border-teal-100/70 py-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setMobileAccordion((v) => (v === node.label ? null : node.label))
                      }
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-base font-medium text-charcoal transition-colors hover:bg-teal-50 hover:text-teal-700"
                      aria-expanded={mobileAccordion === node.label}
                    >
                      {node.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          mobileAccordion === node.label && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-300",
                        mobileAccordion === node.label
                          ? "grid-rows-[1fr] pb-2 opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="flex flex-col gap-1 overflow-hidden pl-2">
                        {node.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeAll}
                            className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal/80 transition-colors hover:bg-teal-50 hover:text-teal-700"
                          >
                            {child.label}
                            {child.description && (
                              <span className="mt-0.5 block text-xs font-normal text-charcoal/50">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={node.label} className="border-b border-teal-100/70 py-1.5">
                    <Link
                      href={node.href ?? "#"}
                      onClick={closeAll}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-charcoal transition-colors hover:bg-teal-50 hover:text-teal-700"
                    >
                      {node.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="border-t border-teal-100 px-6 py-6">
            <ButtonLink href="/contatti" className="w-full" size="lg">
              Prenota Visita
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function DropdownItem({
  child,
  onClick,
}: {
  child: NonNullable<NavNode["children"]>[number];
  onClick: () => void;
}) {
  return (
    <Link
      href={child.href}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-teal-50"
    >
      {child.image ? (
        <span className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={child.image}
            alt={child.label}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </span>
      ) : (
        <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-teal-50">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-serif text-base font-semibold leading-tight text-teal-900 transition-colors group-hover:text-dark-navy">
          {child.label}
        </span>
        {child.description && (
          <span className="mt-1 block text-xs leading-relaxed text-charcoal/60">
            {child.description}
          </span>
        )}
      </span>
    </Link>
  );
}
