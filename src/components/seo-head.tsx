"use client";

import { useEffect } from "react";
import type { SeoPage } from "@/lib/types";

export function SeoHead({ page }: { page?: SeoPage }) {
  useEffect(() => {
    const existingFaqScript = document.getElementById("cocoora-faq-schema");

    if (!page) {
      if (existingFaqScript) existingFaqScript.remove();
      return;
    }

    if (page.title) {
      document.title = page.title;
    }

    if (page.metaDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", page.metaDescription);
    }

    if (page.faq && page.faq.length > 0) {
      let script = existingFaqScript;
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.id = "cocoora-faq-schema";
        document.head.appendChild(script);
      }
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      };
      script.textContent = JSON.stringify(schema);
    } else if (existingFaqScript) {
      existingFaqScript.remove();
    }
  }, [page]);

  return null;
}
