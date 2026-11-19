import { createClient } from "@supabase/supabase-js";
import { buildInitialState } from "./cms-store";
import { slugifyReelTitle } from "./reels-utils";
import type { CmsState, SeoPage, SeoRedirect, VideoItem } from "./types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nrmjqpyrhcaouvjhbggx.supabase.co";
const DEFAULT_ANON_KEY = "sb_publishable_R34k4r3vgE_zDrnyQCQDUg_TWhEY7mf";

type CacheEntry<T> = {
  value: T | null;
  expiresAt: number;
};

const CACHE_TTL_MS = 5000;
const keyCache = new Map<string, CacheEntry<unknown>>();

function getCmsSupabase(mode: "cached" | "fresh" | "write" = "fresh") {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_ANON_KEY;

  const customFetch: typeof fetch = (input, init) => {
    const method = (init?.method || "GET").toUpperCase();
    if (mode === "cached" && method === "GET") {
      return fetch(input, {
        ...init,
        next: { revalidate: 30, tags: ["cms"] },
      } as RequestInit);
    }
    return fetch(input, {
      ...init,
      cache: "no-store",
    });
  };

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: customFetch,
    },
  });
}

function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = error.code || "";
  const msg = (error.message || "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    msg.includes("site_cms_config") ||
    msg.includes("schema cache")
  );
}

export function invalidateCmsServerCache(key?: string) {
  if (key) {
    keyCache.delete(key);
  } else {
    keyCache.clear();
  }
}

export async function readCmsKey<T>(
  key: string,
  options?: { fresh?: boolean }
): Promise<T | null> {
  const fresh = Boolean(options?.fresh);
  if (!fresh) {
    const hit = keyCache.get(key) as CacheEntry<T> | undefined;
    if (hit && hit.expiresAt > Date.now()) {
      return hit.value;
    }
  }

  try {
    const supabase = getCmsSupabase(fresh ? "fresh" : "cached");
    const { data, error } = await supabase
      .from("site_cms_config")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (!error && data && data.value !== undefined) {
      const val = data.value as T;
      keyCache.set(key, { value: val, expiresAt: Date.now() + CACHE_TTL_MS });
      return val;
    }

    // Fallback trasparente su crm_audit_log se la tabella dedicata non è ancora stata creata
    // oppure se i dati erano stati scritti sul fallback prima della migrazione.
    if (!error || isMissingTableError(error)) {
      const { data: auditRow, error: auditErr } = await supabase
        .from("crm_audit_log")
        .select("diff")
        .eq("table_name", "site_cms_config")
        .eq("action", key)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!auditErr && auditRow?.diff) {
        const diffObj = auditRow.diff as { value?: T };
        if (diffObj && diffObj.value !== undefined) {
          keyCache.set(key, { value: diffObj.value, expiresAt: Date.now() + CACHE_TTL_MS });
          return diffObj.value;
        }
      }
    }
  } catch (err) {
    console.error(`[cms-server] Errore lettura chiave "${key}":`, err);
  }

  return null;
}

export async function writeCmsKey<T>(
  key: string,
  value: T,
  updatedBy = "Admin"
): Promise<{ ok: boolean; storage: "site_cms_config" | "crm_audit_log"; error?: string }> {
  invalidateCmsServerCache(key);

  try {
    const supabase = getCmsSupabase("write");
    const now = new Date().toISOString();

    const { error } = await supabase.from("site_cms_config").upsert(
      {
        key,
        value,
        updated_at: now,
        updated_by: updatedBy,
      },
      { onConflict: "key" }
    );

    if (!error) {
      keyCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
      return { ok: true, storage: "site_cms_config" };
    }

    if (isMissingTableError(error)) {
      const { error: auditErr } = await supabase.from("crm_audit_log").insert({
        actor_role: null,
        table_name: "site_cms_config",
        action: key,
        diff: {
          value,
          updatedBy,
          updatedAt: now,
        },
      });

      if (!auditErr) {
        keyCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
        return { ok: true, storage: "crm_audit_log" };
      }

      return { ok: false, storage: "crm_audit_log", error: auditErr.message };
    }

    return { ok: false, storage: "site_cms_config", error: error.message };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore sconosciuto scrittura CMS";
    return { ok: false, storage: "site_cms_config", error: msg };
  }
}

export type PageOverrideMap = Record<string, Partial<SeoPage>>;

export function mergeSeoPagesWithOverrides(
  defaultPages: SeoPage[],
  stored: PageOverrideMap | SeoPage[] | null
): SeoPage[] {
  if (!stored) return defaultPages;

  if (Array.isArray(stored)) {
    return defaultPages.map((base) => {
      const match = stored.find((p) => p.id === base.id || p.path === base.path);
      return match ? { ...base, ...match } : base;
    });
  }

  return defaultPages.map((base) => {
    const override = stored[base.id];
    return override ? { ...base, ...override } : base;
  });
}

export async function getServerCmsState(options?: { fresh?: boolean }): Promise<CmsState> {
  const initial = buildInitialState();

  const [storedVideos, storedPages, storedRedirects] = await Promise.all([
    readCmsKey<VideoItem[]>("cms_videos", options),
    readCmsKey<PageOverrideMap | SeoPage[]>("cms_pages", options),
    readCmsKey<SeoRedirect[]>("seo_redirects", options),
  ]);

  const videos =
    Array.isArray(storedVideos) && storedVideos.length > 0
      ? storedVideos.map((v) => ({
          ...v,
          slug: v.slug || slugifyReelTitle(v.title || v.id),
        }))
      : initial.videos;

  const pages = mergeSeoPagesWithOverrides(initial.pages, storedPages);
  const redirects = Array.isArray(storedRedirects) ? storedRedirects : [];

  return {
    videos,
    pages,
    redirects,
  };
}

export async function getServerSeoPage(
  pathname: string,
  options?: { fresh?: boolean }
): Promise<SeoPage | undefined> {
  const state = await getServerCmsState(options);
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return state.pages.find((p) => p.path === normalized);
}

export async function getServerVideoByIdOrSlug(
  idOrSlug: string
): Promise<VideoItem | undefined> {
  const decoded = decodeURIComponent(idOrSlug).trim();
  const state = await getServerCmsState({ fresh: true });
  return state.videos.find(
    (v) =>
      v.id === decoded ||
      v.slug === decoded ||
      slugifyReelTitle(v.title || "") === decoded
  );
}

export async function getServerRedirects(options?: {
  fresh?: boolean;
}): Promise<SeoRedirect[]> {
  const stored = await readCmsKey<SeoRedirect[]>("seo_redirects", options);
  return Array.isArray(stored) ? stored : [];
}
