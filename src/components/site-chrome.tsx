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

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const state = useCms();
  const page = state.pages.find((p) => p.path === pathname);
  const canvasMode = page?.canvasMode ?? false;

  return (
    <>
      <SeoHead page={page} />
      {!canvasMode && <Navbar />}
      <main>{children}</main>
      {!canvasMode && <Footer />}
      <CookieBanner />
      <CheckoutDrawer />
      <DiscoverModal />
      <BookingModal />
      <DemoRoleSwitcher />
    </>
  );
}
