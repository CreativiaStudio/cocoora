import { NextResponse } from "next/server";
import { createDoctorMagicToken, SMART_DOCTORS } from "@/lib/auth-session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.doctorSlug !== "string") {
      return NextResponse.json({ ok: false, error: "Medico non specificato." }, { status: 400 });
    }

    const doctor = SMART_DOCTORS.find((d) => d.slug === body.doctorSlug);
    if (!doctor) {
      return NextResponse.json({ ok: false, error: "Specialista non trovato." }, { status: 404 });
    }

    const token = await createDoctorMagicToken(doctor.slug);

    // Costruisce l'URL di autenticazione 1-Tap sicuro
    const url = new URL(request.url);
    const magicLinkUrl = `${url.origin}/api/auth/verify-magic?token=${encodeURIComponent(token)}`;

    return NextResponse.json({
      ok: true,
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      magicLinkUrl,
      expiresInMinutes: 15,
      message: `Magic Link 1-Tap generato con successo per ${doctor.name}. Valido 15 minuti a uso singolo.`,
    });
  } catch (err) {
    console.error("Errore generazione magic link:", err);
    return NextResponse.json({ ok: false, error: "Errore interno." }, { status: 500 });
  }
}
