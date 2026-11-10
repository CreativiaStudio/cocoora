"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCms } from "./providers";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CookieBanner } from "./cookie-banner";
import { CheckoutDrawer } from "./checkout-drawer";
import { DiscoverModal } from "./discover-modal";
import { BookingModal } from "./booking-modal";
import { SeoHead } from "./seo-head";
import { TelemetryProvider } from "./telemetry-provider";
import { AnalyticsTracker } from "./analytics-tracker";
import { PwaInstallPrompt } from "./pwa-install-prompt";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const state = useCms();
  const page = state.pages.find((p) => p.path === pathname);
  const canvasMode = page?.canvasMode ?? false;

  // Se siamo nel lab sperimentale, escludiamo header e footer standard per evitare duplicazioni
  const isLab = pathname.startsWith("/lab");
  if (isLab) {
    return <main>{children}</main>;
  }

  // Se siamo nel pannello admin, nella segreteria, nell'area medico o nelle pagine di autenticazione/accesso dedicate, escludiamo header e footer standard del sito
  const isBackofficeOrAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/segreteria") ||
    pathname.startsWith("/medico") ||
    pathname.startsWith("/accesso-") ||
    pathname === "/login";

  if (isBackofficeOrAuth) {
    return (
      <>
        <SeoHead page={page} />
        <main className="min-h-screen">{children}</main>
      </>
    );
  }

  return (
    <>
      <SeoHead page={page} />
      <AnalyticsTracker />
      <TelemetryProvider />
      {!canvasMode && <Navbar />}
      <main>{children}</main>
      {!canvasMode && <Footer />}
      <CookieBanner />
      <CheckoutDrawer />
      <DiscoverModal />
      <BookingModal />
      <PwaInstallPrompt />
    </>
  );
}
