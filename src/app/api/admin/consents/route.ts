import { NextRequest, NextResponse } from "next/server";
import {
  getConsents,
  getConsentStats,
  exportConsentsCsv,
} from "@/lib/consent-ledger";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const channel = searchParams.get("channel") || "all";
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const format = searchParams.get("format"); // "csv" | "json" | undefined

    // Se richiesto l'export CSV ufficiale per il Garante Privacy
    if (format === "csv") {
      const csv = await exportConsentsCsv({ channel, status, search });
      const filename = `registro-consensi-gdpr-cocoora-${new Date().toISOString().slice(0, 10)}.csv`;

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // Se richiesto l'export JSON per audit di sicurezza
    if (format === "json") {
      const records = await getConsents({ channel, status, search });
      const filename = `registro-consensi-gdpr-cocoora-${new Date().toISOString().slice(0, 10)}.json`;

      return new NextResponse(JSON.stringify(records, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // Lettura standard con statistiche per il pannello gestionale
    const [records, stats] = await Promise.all([
      getConsents({ channel, status, search }),
      getConsentStats(),
    ]);

    return NextResponse.json({
      success: true,
      records,
      stats,
    });
  } catch (err: any) {
    console.error("Errore lettura registro consensi admin:", err);
    return NextResponse.json(
      { error: "Errore durante il recupero dei consensi", details: err?.message },
      { status: 500 }
    );
  }
}
