import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { getAggregatedStats } from "@/lib/telemetry-store";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // 1. Statistiche Web Aggregate
    const webStats = await getAggregatedStats();

    // 2. Query ultimi 60 log crudi dalla Scatola Nera (crm_audit_log)
    const { data: rawLogs } = await supabase
      .from("crm_audit_log")
      .select("id, actor_role, table_name, record_id, action, diff, created_at")
      .order("created_at", { ascending: false })
      .limit(60);

    // 3. Calcolo metriche cliniche di attesa e durata visita
    const { data: appts } = await supabase
      .from("appointments")
      .select(`
        id,
        status,
        notes,
        starts_at,
        ends_at,
        patient_profiles ( id, patient_code, first_name, last_name ),
        doctors ( id, full_name, title, specialty_slug ),
        clinic_rooms ( id, name, slug )
      `)
      .order("starts_at", { ascending: false });

    // Estrazione tempi di attesa e durata visita da note o audit log
    const clinicalEvents: any[] = [];
    let totalWaitMin = 0;
    let countWait = 0;
    let totalDurationMin = 0;
    let countDuration = 0;

    const doctorMetricsMap: Record<
      string,
      { doctorName: string; visitsCount: number; sumWait: number; countWait: number; sumDuration: number; countDuration: number }
    > = {};

    for (const app of appts || []) {
      const notes = app.notes || "";
      const docName = (app.doctors as any)?.full_name || "Specialista Cocoora";

      if (!doctorMetricsMap[docName]) {
        doctorMetricsMap[docName] = {
          doctorName: docName,
          visitsCount: 0,
          sumWait: 0,
          countWait: 0,
          sumDuration: 0,
          countDuration: 0,
        };
      }

      const arrivoMatch = notes.match(/\[Arrivo:\s*([^\]]+)\]/);
      const inizioMatch = notes.match(/\[InizioVisita:\s*([^\]]+)\]/);
      const attesaMatch = notes.match(/\[Attesa:\s*(\d+)m\]/);
      const fineMatch = notes.match(/\[FineVisita:\s*([^\]]+)\]/);
      const durataMatch = notes.match(/\[Durata:\s*(\d+)m\]/);

      const waitMin = attesaMatch ? parseInt(attesaMatch[1], 10) : undefined;
      const durMin = durataMatch ? parseInt(durataMatch[1], 10) : undefined;

      if (waitMin !== undefined) {
        totalWaitMin += waitMin;
        countWait += 1;
        doctorMetricsMap[docName].sumWait += waitMin;
        doctorMetricsMap[docName].countWait += 1;
      }

      if (durMin !== undefined) {
        totalDurationMin += durMin;
        countDuration += 1;
        doctorMetricsMap[docName].sumDuration += durMin;
        doctorMetricsMap[docName].countDuration += 1;
        doctorMetricsMap[docName].visitsCount += 1;
      }

      if (arrivoMatch || inizioMatch || fineMatch || app.status === "in_attesa" || app.status === "in_visita" || app.status === "completato") {
        clinicalEvents.push({
          id: app.id,
          patientName: (app.patient_profiles as any)
            ? `${(app.patient_profiles as any).first_name} ${(app.patient_profiles as any).last_name}`
            : "Paziente",
          patientCode: (app.patient_profiles as any)?.patient_code || "N/A",
          doctorName: docName,
          roomName: (app.clinic_rooms as any)?.name || "Studio",
          status: app.status,
          startsAt: app.starts_at,
          arrivedAt: arrivoMatch?.[1] || (app.status === "in_attesa" ? app.starts_at : null),
          visitStartedAt: inizioMatch?.[1] || (app.status === "in_visita" ? app.starts_at : null),
          completedAt: fineMatch?.[1] || null,
          waitMinutes: waitMin,
          durationMinutes: durMin,
        });
      }
    }

    const avgWaitMinutes = countWait > 0 ? Math.round(totalWaitMin / countWait) : 0;
    const avgDurationMinutes = countDuration > 0 ? Math.round(totalDurationMin / countDuration) : 0;

    const doctorAverages = Object.values(doctorMetricsMap).map((d) => ({
      doctorName: d.doctorName,
      visitsCount: d.visitsCount,
      avgWaitMinutes: d.countWait > 0 ? Math.round(d.sumWait / d.countWait) : 0,
      avgDurationMinutes: d.countDuration > 0 ? Math.round(d.sumDuration / d.countDuration) : 0,
    }));

    // 4. Analisi Aree di Interesse (Medicina Estetica, Odontoiatria, Visite Specialistiche, Club)
    const areaInterests = {
      medicinaEstetica: 0,
      odontoiatria: 0,
      visiteSpecialistiche: 0,
      club: 0,
      precision: 0,
    };

    for (const page of webStats.topPages) {
      const p = page.path.toLowerCase();
      if (p.includes("medicina-estetica") || p.includes("viso") || p.includes("corpo")) {
        areaInterests.medicinaEstetica += page.views;
      } else if (p.includes("odontoiatria") || p.includes("ortodonzia") || p.includes("allineatori")) {
        areaInterests.odontoiatria += page.views;
      } else if (p.includes("visite") || p.includes("diagnostica") || p.includes("cardiologia")) {
        areaInterests.visiteSpecialistiche += page.views;
      } else if (p.includes("club")) {
        areaInterests.club += page.views;
      } else if (p.includes("precision")) {
        areaInterests.precision += page.views;
      }
    }

    return NextResponse.json({
      success: true,
      webStats,
      areaInterests,
      clinicalStats: {
        avgWaitMinutes,
        avgDurationMinutes,
        totalTrackedVisits: countDuration,
        doctorAverages,
        activeJourneys: clinicalEvents.slice(0, 15),
      },
      rawLogs: rawLogs || [],
    });
  } catch (err: unknown) {
    console.error("Errore fetch scatola nera:", err);
    const message = err instanceof Error ? err.message : "Errore interno scatola nera";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
