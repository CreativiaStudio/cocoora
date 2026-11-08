import { NextResponse } from "next/server";
import {
  createSessionToken,
  DEMO_CREDENTIALS,
  SMART_DOCTORS,
  SESSION_COOKIE_NAME,
  type AppRole,
  type UserSession,
} from "@/lib/auth-session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.targetRole !== "string") {
      return NextResponse.json({ ok: false, error: "Ruolo non valido." }, { status: 400 });
    }

    const role = body.targetRole as AppRole;
    let user: Omit<UserSession, "expiresAt">;

    if (role === "admin") {
      user = DEMO_CREDENTIALS["admin@cocoora.it"].user;
    } else if (role === "agenzia") {
      user = DEMO_CREDENTIALS["silvia@agenzia.it"].user;
    } else if (role === "segreteria") {
      user = DEMO_CREDENTIALS["segreteria@cocoora.it"].user;
    } else if (role === "medico") {
      const docSlug = body.doctorSlug || "elisa-russo";
      const doc = SMART_DOCTORS.find((d) => d.slug === docSlug) || SMART_DOCTORS[0];
      user = {
        userId: `doctor-${doc.slug}`,
        email: doc.email,
        name: doc.name,
        role: "medico",
        doctorSlug: doc.slug,
      };
    } else if (role === "paziente") {
      user = DEMO_CREDENTIALS["paziente@cocoora.it"].user;
    } else {
      return NextResponse.json({ ok: false, error: "Ruolo sconosciuto." }, { status: 400 });
    }

    const validityDays = role === "medico" ? 0.5 : 7;
    const sessionToken = await createSessionToken(user, validityDays);

    const redirectUrl =
      role === "admin" || role === "agenzia"
        ? "/admin"
        : role === "segreteria"
        ? "/segreteria"
        : role === "medico"
        ? "/medico"
        : "/area-paziente";

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      ok: true,
      user,
      redirectUrl,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: Math.round(validityDays * 24 * 60 * 60),
    });

    return response;
  } catch (err) {
    console.error("Errore switch-role:", err);
    return NextResponse.json({ ok: false, error: "Errore durante il cambio ruolo." }, { status: 500 });
  }
}
