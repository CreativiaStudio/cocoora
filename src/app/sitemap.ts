import type { MetadataRoute } from "next";
import { getServerCmsState } from "@/lib/cms-server";
import { getReelSharePath, SITE_URL } from "@/lib/reels-utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const state = await getServerCmsState({ fresh: true });
  const now = new Date();

  const seenUrls = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of state.pages) {
    if (page.noindex) continue;
    const path = page.path.startsWith("/") ? page.path : `/${page.path}`;
    const url = `${SITE_URL}${path === "/" ? "" : path}`;
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    let priority = 0.85;
    let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly";
    if (path === "/") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (path === "/club" || path.startsWith("/servizi/") || path === "/trattamenti" || path === "/visite") {
      priority = 0.9;
    } else if (path.startsWith("/club/")) {
      priority = 0.8;
    }

    entries.push({
      url,
      lastModified: now,
      changeFrequency,
      priority,
    });
  }

  for (const video of state.videos) {
    if (!video.visible) continue;
    const sharePath = getReelSharePath(video);
    const url = `${SITE_URL}${sharePath}`;
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    entries.push({
      url,
      lastModified: video.createdAt ? new Date(video.createdAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
