import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CmsProvider, ShopProvider } from "@/components/providers";
import { SiteChrome } from "@/components/site-chrome";
import { getServerSeoPage } from "@/lib/cms-server";
import {
  getTrackingConfig,
  normalizeAdsId,
  normalizeGaId,
  normalizeGtmId,
} from "@/lib/tracking-config";
import { SITE_URL } from "@/lib/reels-utils";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const DEFAULT_OG_IMAGE =
  "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-1.webp";

function parseGscToken(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const metaMatch = trimmed.match(/content=["']([^"']+)["']/i);
  if (metaMatch?.[1]) return metaMatch[1].trim();
  if (trimmed.startsWith("google-site-verification=")) {
    return trimmed.slice("google-site-verification=".length).trim();
  }
  return trimmed;
}

export async function generateMetadata(): Promise<Metadata> {
  const [homeSeo, tracking] = await Promise.all([
    getServerSeoPage("/").catch(() => undefined),
    getTrackingConfig().catch(() => null),
  ]);

  const defaultTitle =
    homeSeo?.title || "Cocoora — Centro Medico | Connessi alla tua salute";
  const defaultDesc =
    homeSeo?.metaDescription ||
    "Cocoora è il centro medico a Napoli che azzera attese, burocrazia e complessità. Prenota in meno di 2 minuti, consulta referti 24/7 e vivi un percorso di salute fluido.";
  const ogImage = homeSeo?.ogImage || homeSeo?.heroImage || DEFAULT_OG_IMAGE;
  const gscCode =
    tracking?.gscVerificationMethod === "dns_txt"
      ? undefined
      : parseGscToken(tracking?.gscVerificationTag);

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "Cocoora",
    title: {
      default: defaultTitle,
      template: "%s | Cocoora",
    },
    description: defaultDesc,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Cocoora",
    },
    icons: {
      icon: "/apple-touch-icon.png",
      shortcut: "/apple-touch-icon.png",
      apple: "/apple-touch-icon.png",
    },
    ...(gscCode ? { verification: { google: gscCode } } : {}),
    robots: {
      index: !(homeSeo?.noindex ?? false),
      follow: !(homeSeo?.nofollow ?? false),
    },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: "Cocoora",
      url: SITE_URL,
      title: homeSeo?.ogTitle || defaultTitle,
      description: homeSeo?.ogDescription || defaultDesc,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Cocoora Centro Medico Napoli",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homeSeo?.ogTitle || defaultTitle,
      description: homeSeo?.ogDescription || defaultDesc,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1C4A5C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const CLINIC_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Cocoora Centro Medico",
  url: SITE_URL,
  image: DEFAULT_OG_IMAGE,
  telephone: "+39 081 1818 2091",
  email: "info@cocoora.it",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Generale Giovanni De Bonis 81",
    addressLocality: "Napoli",
    postalCode: "80123",
    addressCountry: "IT",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  medicalSpecialty: [
    "Dentistry",
    "Dermatology",
    "Cardiology",
    "Gynecology",
    "Pediatrics",
    "Nutrition",
  ],
};

const CONSENT_DEFAULT_SCRIPT = `(function(){
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
  }
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
  window.gtag('set', 'url_passthrough', true);
  window.gtag('set', 'ads_data_redaction', true);
  try {
    var raw = window.localStorage.getItem('cocoora_consent_v1');
    if (raw) {
      var stored = JSON.parse(raw);
      if (stored && (stored.analytics_storage || stored.ad_storage)) {
        var adGranted = stored.ad_storage === 'granted' ? 'granted' : 'denied';
        window.gtag('consent', 'update', {
          ad_storage: adGranted,
          analytics_storage: stored.analytics_storage === 'granted' ? 'granted' : 'denied',
          ad_user_data: (stored.ad_user_data || adGranted) === 'granted' ? 'granted' : 'denied',
          ad_personalization: (stored.ad_personalization || adGranted) === 'granted' ? 'granted' : 'denied',
          functionality_storage: stored.functionality_storage === 'granted' ? 'granted' : 'denied',
          personalization_storage: stored.personalization_storage === 'granted' ? 'granted' : 'denied',
          security_storage: 'granted'
        });
        window.__cocooraConsentUpdatedFromStorage = true;
      }
    }
  } catch (e) {}
  window.__cocooraConsentInitialized = true;
})();`;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tracking = await getTrackingConfig().catch(() => null);
  const rawGtm = normalizeGtmId(
    tracking?.gtmContainerId || process.env.NEXT_PUBLIC_GTM_ID || ""
  );
  const gtmId = /^GTM-[A-Z0-9]+$/i.test(rawGtm) ? rawGtm : "";

  const rawGa = normalizeGaId(tracking?.gaMeasurementId || "");
  const gaId = /^G-[A-Z0-9]+$/i.test(rawGa) ? rawGa : "";
  const rawAds = normalizeAdsId(tracking?.googleAdsId || "");
  const adsId = /^AW-[0-9]+$/i.test(rawAds) ? rawAds : "";
  const gtagSrcId = gaId || adsId;
  const gtagKey = [gaId, adsId].filter(Boolean).join("|");

  return (
    <html lang="it" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          id="cocoora-consent-default"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
        />
        {gtmId && (
          <script
            id="cocoora-gtm-head"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){if(/^\\/(admin|segreteria|medico|accesso-|login|lab)(\\/|$)/.test(w.location.pathname))return;if(w.__cocooraGtmLoaded===i)return;w.__cocooraGtmLoaded=i;w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`,
            }}
          />
        )}
        {gtagSrcId && (
          <script
            id="cocoora-gtag-head"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,id,key){if(/^\\/(admin|segreteria|medico|accesso-|login|lab)(\\/|$)/.test(w.location.pathname))return;if(w.__cocooraGtagLoaded===key)return;w.__cocooraGtagLoaded=key;w.dataLayer=w.dataLayer||[];if(typeof w.gtag!=='function'){w.gtag=function(){w.dataLayer.push(arguments);};}if(!d.querySelector('script[src*="googletagmanager.com/gtag/js"]')){var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);d.head.appendChild(s);}w.gtag('js',new Date());${gaId ? `w.gtag('config',${JSON.stringify(gaId)},{anonymize_ip:true,cookie_flags:'SameSite=Lax;Secure'});` : ""}${adsId ? `w.gtag('config',${JSON.stringify(adsId)});` : ""}})(window,document,${JSON.stringify(gtagSrcId)},${JSON.stringify(gtagKey)});`,
            }}
          />
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm-noscript"
            />
          </noscript>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(CLINIC_JSON_LD) }}
        />
        <CmsProvider>
          <ShopProvider>
            <SiteChrome>{children}</SiteChrome>
          </ShopProvider>
        </CmsProvider>
      </body>
    </html>
  );
}
