"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import type { TrackingConfig } from "@/lib/tracking-config";
import { initConsentDefault, pushConsentUpdate } from "@/lib/tracking";
import type { ConsentState } from "@/lib/types";

type PublicTrackingConfig = Pick<
  TrackingConfig,
  | "gaMeasurementId"
  | "gtmContainerId"
  | "gscVerificationTag"
  | "metaPixelId"
  | "googleAdsId"
  | "serverTelemetryEnabled"
>;

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
    if (initialConsent && initialConsent.analytics_storage && initialConsent.ad_storage) {
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

  // SPA Route-Change tracking (Google Consent Mode v2 gestisce redaction/cookie automaticamente)
  useEffect(() => {
    if (!config) return;
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return;
    }
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    if (!config.gtmContainerId && config.gaMeasurementId) {
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: typeof window !== "undefined" ? window.location.href : pathname,
      });
    }

    if (config.metaPixelId && hasMarketingConsent) {
      window.fbq?.("track", "PageView");
    }
  }, [pathname, config, hasMarketingConsent]);

  if (!config) return null;

  const gtmId = config.gtmContainerId?.trim();
  const gaId = config.gaMeasurementId?.trim();
  const adsId = config.googleAdsId?.trim();
  const pixelId = config.metaPixelId?.trim();

  // Google Consent Mode v2 Avanzato: se GTM non è configurato, gtag.js carica subito rispettando `consent default: denied`
  const activeGaId = !gtmId && gaId ? gaId : "";
  const activeAdsId = !gtmId && adsId ? adsId : "";
  const gtagSrcId = activeGaId || activeAdsId;

  return (
    <>
      {/* Google Tag Manager (Consent Mode v2 default già impostato sincrono in <head>) */}
      {gtmId && (
        <>
          <Script
            id="cocoora-gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm-noscript"
            />
          </noscript>
        </>
      )}

      {/* GA4 & Google Ads Standalone con Consent Mode v2 Avanzato (quando GTM è vuoto) */}
      {gtagSrcId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagSrcId)}`}
            strategy="afterInteractive"
          />
          <Script
            id="cocoora-gtag-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                ${
                  activeGaId
                    ? `gtag('config', '${activeGaId}', { anonymize_ip: true, cookie_flags: 'SameSite=Lax;Secure' });`
                    : ""
                }
                ${activeAdsId ? `gtag('config', '${activeAdsId}');` : ""}
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel (attivato esclusivamente con consenso Marketing ad_storage = granted) */}
      {pixelId && hasMarketingConsent && (
        <Script
          id="cocoora-meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('consent', 'grant');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}
