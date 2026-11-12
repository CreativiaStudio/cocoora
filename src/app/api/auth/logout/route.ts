import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-session";

const COOKIE_OPTIONS = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    ...COOKIE_OPTIONS,
    value: "",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    message: "Disconnesso con successo.",
  });

  return clearSessionCookie(response);
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  return clearSessionCookie(response);
}
