import { NextResponse } from "next/server";
import {
  authenticateUser,
  authenticateDoctorByPin,
  createSessionToken,
  isAccessRole,
  SESSION_COOKIE_NAME,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  type AccessRole,
} from "@/lib/auth-session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Dati richiesta mancanti." },
        { status: 400 }
      );
    }

    // Ruolo richiesto dal selettore di accesso (opzionale per i vecchi portali).
    let requestedRole: AccessRole | undefined;
    if (body.role !== undefined) {
      if (!isAccessRole(body.role)) {
        return NextResponse.json(
          { ok: false, error: "Tipo di accesso non valido." },
          { status: 400 }
        );
      }
      requestedRole = body.role;
    }

    // Identificatore per il Rate Limiting (IP + Target)
    const forwardedFor = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const clientIp = forwardedFor.split(",")[0].trim();
    const targetIdentifier = body.doctorSlug || body.email || "generic";
    const rateLimitKey = `${clientIp}::${targetIdentifier}`;

    // 1. Verifica preventiva Rate Limit
    const rateStatus = checkRateLimit(rateLimitKey);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Accesso temporaneamente sospeso per troppi tentativi falliti. Riprova tra ${rateStatus.waitMinutes} minuti (Protezione Anti-Brute Force attiva).`,
          locked: true,
          waitMinutes: rateStatus.waitMinutes,
        },
        { status: 429 }
      );
    }

    let user = null;

    // Smart Login Medico con PIN Rapido Personale Ambulatorio
    if (typeof body.doctorSlug === "string" && typeof body.pin === "string") {
      user = authenticateDoctorByPin(body.doctorSlug, body.pin);
      if (!user) {
        const failure = recordFailedAttempt(rateLimitKey);
        return NextResponse.json(
          {
            ok: false,
            error: failure.locked
              ? "Troppi tentativi errati consecutivi. Accesso bloccato per 15 minuti."
              : `PIN non corretto. Hai ancora ${failure.remainingAttempts} tentativi prima del blocco di sicurezza.`,
            remainingAttempts: failure.remainingAttempts,
          },
          { status: 401 }
        );
      }
    } else if (typeof body.email === "string" && typeof body.password === "string") {
      user = await authenticateUser(body.email, body.password, requestedRole);
      if (!user) {
        const failure = recordFailedAttempt(rateLimitKey);
        return NextResponse.json(
          {
            ok: false,
            error: failure.locked
              ? "Troppi tentativi errati consecutivi. Accesso bloccato per 15 minuti."
              : `Credenziali non corrette. Hai ancora ${failure.remainingAttempts} tentativi prima del blocco di sicurezza.`,
            remainingAttempts: failure.remainingAttempts,
          },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { ok: false, error: "Fornisci email/password oppure seleziona medico con PIN." },
        { status: 400 }
      );
    }

    // Successo: resetta i tentativi falliti per questo IP/account
    resetRateLimit(rateLimitKey);

    // Sessione unica di 7 giorni per tutti i profili (requisito di sicurezza).
    const validityDays = 7;
    const token = await createSessionToken(user, validityDays);

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      ok: true,
      user,
      redirectUrl:
        user.role === "admin" || user.role === "agenzia"
          ? "/admin"
          : user.role === "segreteria"
          ? "/segreteria"
          : user.role === "medico"
          ? "/medico"
          : "/area-paziente",
    });

    response.headers.set("Cache-Control", "no-store");

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: Math.round(validityDays * 24 * 60 * 60),
    });

    return response;
  } catch (error) {
    console.error("Errore login API:", error);
    return NextResponse.json(
      { ok: false, error: "Errore interno durante il login." },
      { status: 500 }
    );
  }
}
