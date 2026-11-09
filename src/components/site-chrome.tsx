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
import { DemoRoleSwitcher } from "./role-switcher/demo-role-switcher";
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

  // Se siamo nel pannello admin, nella segreteria o nell'area medico, escludiamo header e footer standard del sito
  const isBackoffice =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/segreteria") ||
    pathname.startsWith("/medico");

  if (isBackoffice) {
    return (
      <>
        <SeoHead page={page} />
        <main className="min-h-screen bg-[#f0f0f1]">{children}</main>
        <DemoRoleSwitcher />
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
      <DemoRoleSwitcher />
    </>
  );
}
