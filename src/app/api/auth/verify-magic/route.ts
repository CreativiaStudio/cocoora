import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  verifyDoctorMagicToken,
} from "@/lib/auth-session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    const errorUrl = new URL("/login", request.url);
    errorUrl.searchParams.set("error", "Token mancante.");
    return NextResponse.redirect(errorUrl);
  }

  const user = await verifyDoctorMagicToken(token);

  if (!user) {
    const errorUrl = new URL("/login", request.url);
    errorUrl.searchParams.set(
      "error",
      "Il Magic Link è scaduto o è già stato utilizzato. Richiedine uno nuovo."
    );
    return NextResponse.redirect(errorUrl);
  }

  // Sessione clinica del medico limitata a 12 ore (0.5 giorni) a tutela dei dati sanitari
  const sessionToken = await createSessionToken(user, 0.5);

  const response = NextResponse.redirect(new URL("/medico", request.url));
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60, // 12 ore
  });

  return response;
}
