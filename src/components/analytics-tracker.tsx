"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import type { TrackingConfig } from "@/lib/tracking-config";

export function AnalyticsTracker() {
  const [config, setConfig] = useState<TrackingConfig | null>(null);
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);

  useEffect(() => {
    // 1. Carica configurazione salvata per Silvia
    fetch("/api/admin/tracking-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.config) {
          setConfig(data.config);
        }
      })
      .catch(() => {});

    // 2. Verifica stato consenso memorizzato in localStorage
    const checkConsent = () => {
      try {
        const stored = localStorage.getItem("cocoora_consent_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          setHasAnalyticsConsent(parsed.analytics_storage === "granted");
        }
      } catch {}
    };

    checkConsent();

    // 3. Ascolta variazioni consenso in tempo reale dal banner
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setHasAnalyticsConsent(customEvent.detail.analytics_storage === "granted");
      }
    };

    window.addEventListener("cocoora_consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener("cocoora_consent_changed", handleConsentChange);
    };
  }, []);

  // Iniezione Meta Tag Google Search Console per Silvia
  useEffect(() => {
    if (!config?.gscVerificationTag) return;

    let verificationContent = config.gscVerificationTag.trim();
    // Se Silvia ha incollato l'intero tag <meta name="google-site-verification" content="XYZ" />
    const match = verificationContent.match(/content=["']([^"']+)["']/);
    if (match && match[1]) {
      verificationContent = match[1];
    }

    let meta = document.querySelector('meta[name="google-site-verification"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "google-site-verification");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", verificationContent);
  }, [config?.gscVerificationTag]);

  if (!config) return null;

  return (
    <>
      {/* Google Tag Manager (attivato se presente e autorizzato dal consenso) */}
      {config.gtmContainerId && hasAnalyticsConsent && (
        <Script
          id="cocoora-gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${config.gtmContainerId.trim()}');`,
          }}
        />
      )}

      {/* Google Analytics 4 (GA4 standalone se non gestito da GTM) */}
      {config.gaMeasurementId && !config.gtmContainerId && hasAnalyticsConsent && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId.trim()}`}
            strategy="afterInteractive"
          />
          <Script
            id="cocoora-ga4-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.gaMeasurementId.trim()}', {
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=Lax;Secure'
                });
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel (opzionale, se presente e autorizzato) */}
      {config.metaPixelId && hasAnalyticsConsent && (
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
              fbq('init', '${config.metaPixelId.trim()}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}
