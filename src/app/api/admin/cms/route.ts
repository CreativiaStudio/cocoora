import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  readCmsKey,
  writeCmsKey,
  type PageOverrideMap,
} from "@/lib/cms-server";
import type { SeoPage, SeoRedirect, VideoItem } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.section !== "string") {
      return NextResponse.json(
        { ok: false, error: "Payload CMS non valido" },
        { status: 400 }
      );
    }

    const updatedBy =
      typeof body.updatedBy === "string" && body.updatedBy.trim()
        ? body.updatedBy.trim()
        : "Admin / SEO";
    const savedAt = new Date().toISOString();

    if (body.section === "videos") {
      if (!Array.isArray(body.videos)) {
        return NextResponse.json(
          { ok: false, error: "Lista video non valida" },
          { status: 400 }
        );
      }
      const res = await writeCmsKey<VideoItem[]>(
        "cms_videos",
        body.videos,
        updatedBy
      );
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: res.error || "Salvataggio video fallito" },
          { status: 500 }
        );
      }
      revalidateTag("cms");
      revalidatePath("/");
      revalidatePath("/sitemap.xml");
      revalidatePath("/reels/[id]", "page");
      return NextResponse.json({ ok: true, storage: res.storage, savedAt });
    }

    if (body.section === "page") {
      const page = body.page as SeoPage | undefined;
      if (!page || !page.id) {
        return NextResponse.json(
          { ok: false, error: "Oggetto pagina mancante" },
          { status: 400 }
        );
      }

      const existing = await readCmsKey<PageOverrideMap | SeoPage[]>("cms_pages", {
        fresh: true,
      });
      const map: PageOverrideMap = {};
      if (Array.isArray(existing)) {
        for (const p of existing) {
          if (p?.id) map[p.id] = p;
        }
      } else if (existing && typeof existing === "object") {
        Object.assign(map, existing);
      }
      map[page.id] = page;

      const res = await writeCmsKey<PageOverrideMap>("cms_pages", map, updatedBy);
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: res.error || "Salvataggio pagina SEO fallito" },
          { status: 500 }
        );
      }
      revalidateTag("cms");
      revalidatePath("/", "layout");
      revalidatePath("/sitemap.xml");
      if (page.path && page.path.startsWith("/")) {
        revalidatePath(page.path);
      }
      return NextResponse.json({ ok: true, storage: res.storage, savedAt });
    }

    if (body.section === "pages") {
      if (!Array.isArray(body.pages)) {
        return NextResponse.json(
          { ok: false, error: "Lista pagine non valida" },
          { status: 400 }
        );
      }
      const map: PageOverrideMap = {};
      for (const p of body.pages as SeoPage[]) {
        if (p?.id) map[p.id] = p;
      }
      const res = await writeCmsKey<PageOverrideMap>("cms_pages", map, updatedBy);
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: res.error || "Salvataggio pagine SEO fallito" },
          { status: 500 }
        );
      }
      revalidateTag("cms");
      revalidatePath("/", "layout");
      revalidatePath("/sitemap.xml");
      return NextResponse.json({ ok: true, storage: res.storage, savedAt });
    }

    if (body.section === "redirects") {
      if (!Array.isArray(body.redirects)) {
        return NextResponse.json(
          { ok: false, error: "Lista redirect non valida" },
          { status: 400 }
        );
      }
      const res = await writeCmsKey<SeoRedirect[]>(
        "seo_redirects",
        body.redirects,
        updatedBy
      );
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: res.error || "Salvataggio redirect fallito" },
          { status: 500 }
        );
      }
      revalidateTag("cms");
      return NextResponse.json({ ok: true, storage: res.storage, savedAt });
    }

    return NextResponse.json(
      { ok: false, error: `Sezione sconosciuta: ${body.section}` },
      { status: 400 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore interno CMS";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
