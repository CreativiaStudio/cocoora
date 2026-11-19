import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/reels-utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/segreteria",
          "/medico",
          "/api/",
          "/login",
          "/accesso-direzione",
          "/accesso-marketing",
          "/accesso-medici",
          "/accesso-reception",
          "/area-paziente",
          "/lab",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
