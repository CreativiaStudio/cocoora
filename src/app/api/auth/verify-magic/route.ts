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

  // Sessione medica allineata alla durata unica di 7 giorni.
  const sessionToken = await createSessionToken(user, 7);

  const response = NextResponse.redirect(new URL("/medico", request.url));
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 giorni
  });

  return response;
}
