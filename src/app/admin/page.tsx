"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, Film, LayoutList, RotateCcw } from "lucide-react";
import { cmsStore } from "@/lib/cms-store";
import { VideosManager } from "@/components/admin/videos-manager";
import { SeoManager } from "@/components/admin/seo-manager";
import { cn } from "@/lib/utils";

type Tab = "videos" | "seo";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("videos");

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
              CMS Interno
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-teal-900">
              Gestione contenuti
            </h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Area riservata per l'agenzia — Silvia &amp; Marco
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm("Ripristinare tutti i contenuti ai valori predefiniti?")) {
                  cmsStore.reset();
                }
              }}
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
            >
              <RotateCcw className="h-4 w-4" /> Ripristina
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dark-navy"
            >
              <ArrowLeft className="h-4 w-4" /> Torna al sito
            </Link>
          </div>
        </div>

        <div className="mt-8 inline-flex rounded-full border border-teal-100 bg-white p-1 shadow-sm">
          <TabButton
            active={tab === "videos"}
            onClick={() => setTab("videos")}
            icon={<Film className="h-4 w-4" />}
          >
            Video Verticali
          </TabButton>
          <TabButton
            active={tab === "seo"}
            onClick={() => setTab("seo")}
            icon={<LayoutList className="h-4 w-4" />}
          >
            SEO &amp; Pagine
          </TabButton>
        </div>

        <div className="mt-8">{tab === "videos" ? <VideosManager /> : <SeoManager />}</div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-teal-600 text-white" : "text-charcoal/60 hover:text-teal-700"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
