import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CmsProvider, ShopProvider } from "@/components/providers";
import { SiteChrome } from "@/components/site-chrome";
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
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Cocoora",
  title: {
    default: "Cocoora — Centro Medico | Connessi alla tua salute",
    template: "%s | Cocoora",
  },
  description:
    "Cocoora è il centro medico che azzera attese, burocrazia e complessità. Prenota in meno di 2 minuti, consulta referti 24/7 e vivi un percorso di salute fluido.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cocoora",
  },
  icons: {
    icon: "/cocoora-symbol.png",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Cocoora",
    title: "Cocoora — Centro Medico",
    description:
      "Connessi alla tua salute. Il tuo benessere senza ostacoli, in un unico hub multidisciplinare.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1C4A5C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="it" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <CmsProvider>
          <ShopProvider>
            <SiteChrome>{children}</SiteChrome>
          </ShopProvider>
        </CmsProvider>
      </body>
    </html>
  );
}
