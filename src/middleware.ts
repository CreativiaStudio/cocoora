import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth-session";
import type { SeoRedirect } from "@/lib/types";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nrmjqpyrhcaouvjhbggx.supabase.co";
const DEFAULT_ANON_KEY = "sb_publishable_R34k4r3vgE_zDrnyQCQDUg_TWhEY7mf";

let redirectCache: { items: SeoRedirect[]; expiresAt: number } | null = null;
const REDIRECT_CACHE_TTL_MS = 10_000;

async function fetchEdgeRedirects(): Promise<SeoRedirect[]> {
  if (redirectCache && redirectCache.expiresAt > Date.now()) {
    return redirectCache.items;
  }

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_ANON_KEY;

  if (!key) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 600);

  try {
    const headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
    };

    const primaryRes = await fetch(
      `${SUPABASE_URL}/rest/v1/site_cms_config?key=eq.seo_redirects&select=value&limit=1`,
      { headers, signal: controller.signal, cache: "no-store" }
    );

    if (primaryRes.ok) {
      const rows = (await primaryRes.json()) as { value?: SeoRedirect[] }[];
      const items = Array.isArray(rows?.[0]?.value) ? rows[0].value : [];
      if (items.length > 0) {
        redirectCache = { items, expiresAt: Date.now() + REDIRECT_CACHE_TTL_MS };
        return items;
      }
    }

    // Fallback su crm_audit_log se site_cms_config non è ancora stata migrata o non ha righe
    const fallbackRes = await fetch(
      `${SUPABASE_URL}/rest/v1/crm_audit_log?table_name=eq.site_cms_config&action=eq.seo_redirects&select=diff&order=created_at.desc&limit=1`,
      { headers, signal: controller.signal, cache: "no-store" }
    );

    if (fallbackRes.ok) {
      const rows = (await fallbackRes.json()) as { diff?: { value?: SeoRedirect[] } }[];
      const items = Array.isArray(rows?.[0]?.diff?.value) ? rows[0].diff.value : [];
      redirectCache = { items, expiresAt: Date.now() + REDIRECT_CACHE_TTL_MS };
      return items;
    }
  } catch {
    // Fail-open se Supabase timeout/non raggiungibile in Edge
  } finally {
    clearTimeout(timeout);
  }

  return redirectCache?.items ?? [];
}

function normalizeRoutePath(p: string): string {
  if (!p || p === "/") return "/";
  return p.replace(/\/+$/, "") || "/";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotte protette
  const isAdminRoute = pathname.startsWith("/admin");
  const isSegreteriaRoute = pathname.startsWith("/segreteria");
  const isMedicoRoute = pathname.startsWith("/medico");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isReceptionApi = pathname.startsWith("/api/reception");

  if (!isAdminRoute && !isSegreteriaRoute && !isMedicoRoute && !isAdminApi && !isReceptionApi) {
    // Gestione Redirect SEO 301/302 solo su rotte pubbliche (mai su API/auth/risorse)
    const skipRedirectCheck =
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/accesso-") ||
      pathname.startsWith("/area-paziente") ||
      pathname.startsWith("/lab");

    if (!skipRedirectCheck && request.method === "GET") {
      const normalized = normalizeRoutePath(pathname);
      const redirects = await fetchEdgeRedirects();
      const match = redirects.find(
        (r) =>
          r.enabled &&
          normalizeRoutePath(r.source) === normalized &&
          normalizeRoutePath(r.destination) !== normalized
      );

      if (match) {
        const dest = match.destination.startsWith("http")
          ? match.destination
          : new URL(match.destination, request.url).toString();
        return NextResponse.redirect(dest, {
          status: match.permanent ? 301 : 302,
        });
      }
    }

    return NextResponse.next();
  }

  // Estrai token di sessione dal cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = sessionToken ? await verifySessionToken(sessionToken) : null;

  // Se è una route API e l'utente non è autenticato
  if (isAdminApi || isReceptionApi) {
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Accesso non autorizzato. Autenticazione richiesta." },
        { status: 401 }
      );
    }

    if (isAdminApi && user.role !== "admin" && user.role !== "agenzia") {
      return NextResponse.json(
        { ok: false, error: "Accesso negato. Permessi di amministrazione o agenzia richiesti." },
        { status: 403 }
      );
    }

    if (isReceptionApi && user.role !== "admin" && user.role !== "segreteria") {
      return NextResponse.json(
        { ok: false, error: "Accesso negato. Permessi di segreteria richiesti." },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // Se è una route pagina protetta e non c'è utente
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Controllo autorizzazioni per pagina
  if (isAdminRoute && user.role !== "admin" && user.role !== "agenzia") {
    const dest =
      user.role === "segreteria"
        ? "/segreteria"
        : user.role === "medico"
        ? "/medico"
        : "/area-paziente";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isSegreteriaRoute && user.role !== "admin" && user.role !== "segreteria") {
    const dest =
      user.role === "agenzia"
        ? "/admin"
        : user.role === "medico"
        ? "/medico"
        : "/area-paziente";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isMedicoRoute && user.role !== "admin" && user.role !== "medico") {
    const dest =
      user.role === "agenzia"
        ? "/admin"
        : user.role === "segreteria"
        ? "/segreteria"
        : "/area-paziente";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|json|mp4|webm|woff2?)$).*)",
  ],
};
