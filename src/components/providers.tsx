"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";
import { cmsStore } from "@/lib/cms-store";
import type { ClubTier, CmsState } from "@/lib/types";

function useCmsState(): CmsState {
  return useSyncExternalStore(
    (cb) => cmsStore.subscribe(cb),
    () => cmsStore.getState(),
    () => cmsStore.getServerSnapshot()
  );
}

const CmsContext = createContext<CmsState | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const state = useCmsState();

  useEffect(() => {
    cmsStore.hydrate();
  }, []);

  return <CmsContext.Provider value={state}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsState {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms deve essere usato dentro CmsProvider");
  return ctx;
}

// ── Shop / Checkout ────────────────────────────────────────────────────

type Gender = "uomo" | "donna";

type ShopState = {
  checkoutItem: { tier: ClubTier; gender?: Gender } | null;
  discoverOpen: boolean;
  openCheckout: (tier: ClubTier, gender?: Gender) => void;
  closeCheckout: () => void;
  openDiscover: () => void;
  closeDiscover: () => void;
  bookingOpen: boolean;
  bookingSpecialty?: string;
  openBooking: (specialty?: string) => void;
  closeBooking: () => void;
};

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [checkoutItem, setCheckoutItem] = useState<ShopState["checkoutItem"]>(null);
  const [discoverOpen, setDiscoverOpen] = useState(false);

  const openCheckout = useCallback((tier: ClubTier, gender?: Gender) => {
    setCheckoutItem({ tier, gender });
  }, []);

  const closeCheckout = useCallback(() => setCheckoutItem(null), []);
  const openDiscover = useCallback(() => setDiscoverOpen(true), []);
  const closeDiscover = useCallback(() => setDiscoverOpen(false), []);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSpecialty, setBookingSpecialty] = useState<string | undefined>(undefined);

  const openBooking = useCallback((specialty?: string) => {
    setBookingSpecialty(specialty);
    setBookingOpen(true);
  }, []);
  const closeBooking = useCallback(() => {
    setBookingOpen(false);
    setBookingSpecialty(undefined);
  }, []);

  const value: ShopState = {
    bookingOpen,
    bookingSpecialty,
    openBooking,
    closeBooking,
    checkoutItem,
    discoverOpen,
    openCheckout,
    closeCheckout,
    openDiscover,
    closeDiscover,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop deve essere usato dentro ShopProvider");
  return ctx;
}
