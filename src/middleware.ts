import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotte protette
  const isAdminRoute = pathname.startsWith("/admin");
  const isSegreteriaRoute = pathname.startsWith("/segreteria");
  const isMedicoRoute = pathname.startsWith("/medico");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isReceptionApi = pathname.startsWith("/api/reception");

  if (!isAdminRoute && !isSegreteriaRoute && !isMedicoRoute && !isAdminApi && !isReceptionApi) {
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
    let targetLogin = "/login";
    if (isAdminRoute) {
      targetLogin = "/accesso-direzione";
    } else if (isSegreteriaRoute) {
      targetLogin = "/accesso-reception";
    } else if (isMedicoRoute) {
      targetLogin = "/accesso-medici";
    }

    const loginUrl = new URL(targetLogin, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Controllo autorizzazioni per pagina
  if (isAdminRoute && user.role !== "admin" && user.role !== "agenzia") {
    // Reindirizza l'utente alla propria area
    const dest =
      user.role === "segreteria"
        ? "/segreteria"
        : user.role === "medico"
        ? "/medico"
        : "/area-paziente";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isSegreteriaRoute && user.role !== "admin" && user.role !== "segreteria") {
    const dest = user.role === "medico" ? "/medico" : "/area-paziente";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isMedicoRoute && user.role !== "admin" && user.role !== "medico") {
    const dest = user.role === "segreteria" ? "/segreteria" : "/area-paziente";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/segreteria/:path*",
    "/medico/:path*",
    "/api/admin/:path*",
    "/api/reception/:path*",
  ],
};
