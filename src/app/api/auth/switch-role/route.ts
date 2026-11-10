import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Accesso disabilitato. L'autenticazione richiede credenziali crittografiche verificate.",
    },
    { status: 403 }
  );
}
