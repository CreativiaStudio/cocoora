"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { TrackingConfig } from "@/lib/tracking-config";
import { initConsentDefault, pushConsentUpdate } from "@/lib/tracking";
import type { ConsentState } from "@/lib/types";

declare global {
  interface Window {
    __cocooraGtmLoaded?: string;
    __cocooraGtagLoaded?: string;
    __cocooraMetaPixelLoaded?: string;
    __cocooraConsentUpdatedFromStorage?: boolean;
    _fbq?: unknown;
  }
}

type PublicTrackingConfig = Pick<
  TrackingConfig,
  | "gaMeasurementId"
  | "gtmContainerId"
  | "gscVerificationTag"
  | "gscVerificationMethod"
  | "metaPixelId"
  | "googleAdsId"
  | "serverTelemetryEnabled"
>;

function extractGtmId(raw?: string): string {
  const trimmed = (raw || "").trim();
  const match = trimmed.match(/GTM-[A-Z0-9]+/i);
  return match ? match[0].toUpperCase() : "";
}

function extractGaId(raw?: string): string {
  const trimmed = (raw || "").trim();
  const match = trimmed.match(/G-[A-Z0-9]+/i);
  return match ? match[0].toUpperCase() : "";
}

function extractAdsId(raw?: string): string {
  const trimmed = (raw || "").trim();
  const match = trimmed.match(/AW-[0-9]+/i);
  return match ? match[0].toUpperCase() : "";
}

function extractPixelId(raw?: string): string {
  const cleaned = (raw || "").replace(/\s+/g, "").trim();
  return /^[0-9]{5,25}$/.test(cleaned) ? cleaned : "";
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const [config, setConfig] = useState<PublicTrackingConfig | null>(null);
  const [hasMarketingConsent, setHasMarketingConsent] = useState(false);

  useEffect(() => {
    let initialConsent: Partial<ConsentState> | undefined;
    try {
      const stored = localStorage.getItem("cocoora_consent_v1");
      if (stored) {
        const parsed = JSON.parse(stored) as ConsentState;
        initialConsent = parsed;
        setHasMarketingConsent(parsed.ad_storage === "granted");
      }
    } catch {}

    // Fallback nel caso <head> non sia ancora inizializzato
    initConsentDefault(initialConsent);
    if (
      initialConsent &&
      initialConsent.analytics_storage &&
      initialConsent.ad_storage &&
      !window.__cocooraConsentUpdatedFromStorage
    ) {
      pushConsentUpdate(initialConsent as ConsentState);
    }

    fetch("/api/tracking-config", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.config) {
          setConfig(data.config);
        }
      })
      .catch(() => {});

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentState>;
      if (customEvent.detail) {
        const marketingGranted = customEvent.detail.ad_storage === "granted";
        setHasMarketingConsent(marketingGranted);
        if (typeof window !== "undefined" && typeof window.fbq === "function") {
          window.fbq("consent", marketingGranted ? "grant" : "revoke");
        }
      }
    };

    window.addEventListener("cocoora_consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener("cocoora_consent_changed", handleConsentChange);
    };
  }, []);

  // Fallback client-side per Google Search Console (affiancato a quello SSR in layout.tsx)
  useEffect(() => {
    if (config?.gscVerificationMethod === "dns_txt") return;
    if (!config?.gscVerificationTag) return;

    let verificationContent = config.gscVerificationTag.trim();
    const match = verificationContent.match(/content=["']([^"']+)["']/);
    if (match?.[1]) {
      verificationContent = match[1];
    } else if (verificationContent.startsWith("google-site-verification=")) {
      verificationContent = verificationContent.slice("google-site-verification=".length).trim();
    }

    if (!verificationContent) return;

    let meta = document.querySelector('meta[name="google-site-verification"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "google-site-verification");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", verificationContent);
  }, [config?.gscVerificationTag]);

  // Iniezione DOM nativa di Google Tag Manager / GA4 / Google Ads in <head>
  useEffect(() => {
    if (!config || typeof window === "undefined" || typeof document === "undefined") return;

    const gtmId = extractGtmId(config.gtmContainerId);
    const gaId = extractGaId(config.gaMeasurementId);
    const adsId = extractAdsId(config.googleAdsId);

    if (gtmId) {
      const scriptUrl = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      const alreadyInDom = Boolean(
        document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`)
      );
      if (window.__cocooraGtmLoaded !== gtmId && !alreadyInDom) {
        window.__cocooraGtmLoaded = gtmId;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

        const s = document.createElement("script");
        s.async = true;
        s.src = scriptUrl;
        s.dataset.cocooraGtm = gtmId;
        document.head.appendChild(s);
      }
    }

    const activeGaId = gaId || "";
    const activeAdsId = adsId || "";
    const gtagSrcId = activeGaId || activeAdsId;
    const gtagKey = [activeGaId, activeAdsId].filter(Boolean).join("|");

    if (gtagSrcId && window.__cocooraGtagLoaded !== gtagKey) {
      window.__cocooraGtagLoaded = gtagKey;
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== "function") {
        window.gtag = function gtag() {
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer!.push(arguments);
        };
      }

      const alreadyInDom = Boolean(
        document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
      );
      if (!alreadyInDom) {
        const s = document.createElement("script");
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagSrcId)}`;
        s.dataset.cocooraGtag = gtagSrcId;
        document.head.appendChild(s);
      }

      window.gtag("js", new Date());
      if (activeGaId) {
        window.gtag("config", activeGaId, {
          anonymize_ip: true,
          cookie_flags: "SameSite=Lax;Secure",
        });
      }
      if (activeAdsId) {
        window.gtag("config", activeAdsId);
      }
    }
  }, [config]);

  // Meta Pixel (attivato esclusivamente con consenso Marketing ad_storage = granted)
  useEffect(() => {
    if (
      !config ||
      !hasMarketingConsent ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return;
    }

    const pixelId = extractPixelId(config.metaPixelId);
    if (!pixelId || window.__cocooraMetaPixelLoaded === pixelId) return;

    window.__cocooraMetaPixelLoaded = pixelId;

    if (typeof window.fbq !== "function") {
      type FbqQueueFn = ((...args: unknown[]) => void) & {
        callMethod?: (...args: unknown[]) => void;
        push?: (...args: unknown[]) => void;
        loaded?: boolean;
        version?: string;
        queue?: unknown[];
      };
      const fbqStub: FbqQueueFn = function fbqStubImpl() {
        if (fbqStub.callMethod) {
          // eslint-disable-next-line prefer-rest-params
          fbqStub.callMethod.apply(fbqStub, arguments as unknown as unknown[]);
        } else {
          // eslint-disable-next-line prefer-rest-params
          fbqStub.queue?.push(arguments);
        }
      };
      fbqStub.push = fbqStub;
      fbqStub.loaded = true;
      fbqStub.version = "2.0";
      fbqStub.queue = [];
      window.fbq = fbqStub;
      if (!window._fbq) {
        window._fbq = fbqStub;
      }
    }

    if (!document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')) {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://connect.facebook.net/en_US/fbevents.js";
      s.dataset.cocooraMetaPixel = pixelId;
      document.head.appendChild(s);
    }

    window.fbq("consent", "grant");
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }, [config, hasMarketingConsent]);

  // SPA Route-Change tracking (Google Consent Mode v2 gestisce redaction/cookie automaticamente)
  useEffect(() => {
    if (!config) return;
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return;
    }
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    const gtmId = extractGtmId(config.gtmContainerId);
    const gaId = extractGaId(config.gaMeasurementId);
    const pixelId = extractPixelId(config.metaPixelId);

    if (gtmId && typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "virtual_page_view",
        page_path: pathname,
        page_location: window.location.href,
        page_title: typeof document !== "undefined" ? document.title : "",
      });
    }

    if (gaId) {
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: typeof window !== "undefined" ? window.location.href : pathname,
      });
    }

    if (pixelId && hasMarketingConsent) {
      window.fbq?.("track", "PageView");
    }
  }, [pathname, config, hasMarketingConsent]);

  return null;
}
