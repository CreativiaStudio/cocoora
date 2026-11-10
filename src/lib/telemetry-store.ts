import { getServiceSupabase } from "./supabase";

export type TelemetryEventType =
  | "page_view"
  | "time_on_page"
  | "cta_click"
  | "cart_add"
  | "checkout_begin"
  | "purchase"
  | "lead_submit";

export interface TelemetryEvent {
  type: TelemetryEventType;
  pathname: string;
  durationSeconds?: number;
  ctaId?: string;
  ctaLabel?: string;
  device?: "mobile" | "desktop";
  visitorHash: string; // Hash anonimizzato a 1 via (SHA-256 IP + Data + Salt)
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface TelemetryAggregatedStats {
  totalPageViews: number;
  uniqueVisitors: number;
  avgDurationSeconds: number;
  topPages: { path: string; views: number; avgDuration: number }[];
  ctaClicks: { id: string; label: string; count: number }[];
  deviceBreakdown: { mobile: number; desktop: number };
  recentVisits: { pathname: string; timestamp: string; device: string }[];
  ecommerce: {
    cartAdds: number;
    checkouts: number;
    purchases: number;
  };
}

/**
 * Registra un evento di telemetria proprietaria nella Scatola Nera permanente (crm_audit_log su PostgreSQL).
 * 100% First-party, senza passare da server terzi, AdBlocker-proof e pienamente GDPR-compliant.
 */
export async function recordTelemetryEvent(event: TelemetryEvent): Promise<void> {
  try {
    const supabase = getServiceSupabase();
    await supabase.from("crm_audit_log").insert({
      actor_role: null,
      table_name: "internal_telemetry",
      action: event.type.toUpperCase(),
      diff: {
        pathname: event.pathname,
        durationSeconds: event.durationSeconds,
        ctaId: event.ctaId,
        ctaLabel: event.ctaLabel,
        device: event.device,
        visitorHash: event.visitorHash,
        timestamp: event.timestamp,
        ...(event.metadata || {}),
      },
    });
  } catch (err) {
    console.error("Errore scrittura telemetria interna in crm_audit_log:", err);
  }
}

/**
 * Calcola le metriche aggregate reali interrogando DIRETTAMENTE gli eventi registrati
 * nella tabella `crm_audit_log` (table_name = 'internal_telemetry').
 *
 * ZERO DATI FITTIZI / ZERO MOCK: se non ci sono eventi, i contatori valgono 0.
 */
export async function getAggregatedStats(): Promise<TelemetryAggregatedStats> {
  try {
    const supabase = getServiceSupabase();
    const { data: logs, error } = await supabase
      .from("crm_audit_log")
      .select("action, diff, created_at")
      .eq("table_name", "internal_telemetry")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error || !logs || logs.length === 0) {
      return {
        totalPageViews: 0,
        uniqueVisitors: 0,
        avgDurationSeconds: 0,
        topPages: [],
        ctaClicks: [],
        deviceBreakdown: { mobile: 0, desktop: 0 },
        recentVisits: [],
        ecommerce: {
          cartAdds: 0,
          checkouts: 0,
          purchases: 0,
        },
      };
    }

    const pageViewsByPath: Record<string, number> = {};
    const totalTimeByPath: Record<string, { totalSeconds: number; count: number }> = {};
    const uniqueVisitorsSet = new Set<string>();
    const ctaClicksRecord: Record<string, { label: string; count: number }> = {};
    const devices = { mobile: 0, desktop: 0 };
    const recentVisits: { pathname: string; timestamp: string; device: string }[] = [];
    const ecommerce = { cartAdds: 0, checkouts: 0, purchases: 0 };

    for (const log of logs) {
      const action = log.action;
      const diff = (log.diff || {}) as any;

      if (diff.visitorHash) {
        uniqueVisitorsSet.add(diff.visitorHash);
      }

      if (diff.device === "mobile") {
        devices.mobile += 1;
      } else if (diff.device === "desktop") {
        devices.desktop += 1;
      }

      if (action === "PAGE_VIEW") {
        const path = diff.pathname || "/";
        pageViewsByPath[path] = (pageViewsByPath[path] || 0) + 1;
        if (recentVisits.length < 15) {
          recentVisits.push({
            pathname: path,
            timestamp: diff.timestamp || log.created_at,
            device: diff.device || "desktop",
          });
        }
      } else if (action === "TIME_ON_PAGE") {
        const path = diff.pathname || "/";
        const dur = typeof diff.durationSeconds === "number" ? diff.durationSeconds : 0;
        if (dur > 0) {
          const entry = totalTimeByPath[path] || { totalSeconds: 0, count: 0 };
          entry.totalSeconds += dur;
          entry.count += 1;
          totalTimeByPath[path] = entry;
        }
      } else if (action === "CTA_CLICK") {
        const ctaId = diff.ctaId || "cta_sconosciuta";
        const ctaLabel = diff.ctaLabel || ctaId;
        const entry = ctaClicksRecord[ctaId] || { label: ctaLabel, count: 0 };
        entry.count += 1;
        ctaClicksRecord[ctaId] = entry;
      } else if (action === "CART_ADD") {
        ecommerce.cartAdds += 1;
      } else if (action === "CHECKOUT_BEGIN") {
        ecommerce.checkouts += 1;
      } else if (action === "PURCHASE") {
        ecommerce.purchases += 1;
      }
    }

    let totalViews = 0;
    const topPages: { path: string; views: number; avgDuration: number }[] = [];
    for (const [pathStr, views] of Object.entries(pageViewsByPath)) {
      totalViews += views;
      const timeData = totalTimeByPath[pathStr];
      const avgDuration =
        timeData && timeData.count > 0 ? Math.round(timeData.totalSeconds / timeData.count) : 0;
      topPages.push({ path: pathStr, views, avgDuration });
    }
    topPages.sort((a, b) => b.views - a.views);

    let sumSeconds = 0;
    let countRecords = 0;
    for (const item of Object.values(totalTimeByPath)) {
      sumSeconds += item.totalSeconds;
      countRecords += item.count;
    }
    const overallAvgDuration = countRecords > 0 ? Math.round(sumSeconds / countRecords) : 0;

    const ctaClicks = Object.entries(ctaClicksRecord)
      .map(([id, val]) => ({ id, label: val.label, count: val.count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalPageViews: totalViews,
      uniqueVisitors: uniqueVisitorsSet.size, // CONTEGGIO REALE DEI VISITATORI UNICI DIRETTAMENTE DAL DATABASE
      avgDurationSeconds: overallAvgDuration,
      topPages: topPages.slice(0, 10),
      ctaClicks,
      deviceBreakdown: devices,
      recentVisits,
      ecommerce,
    };
  } catch (e) {
    console.error("Errore aggregazione telemetria da Supabase crm_audit_log:", e);
    return {
      totalPageViews: 0,
      uniqueVisitors: 0,
      avgDurationSeconds: 0,
      topPages: [],
      ctaClicks: [],
      deviceBreakdown: { mobile: 0, desktop: 0 },
      recentVisits: [],
      ecommerce: { cartAdds: 0, checkouts: 0, purchases: 0 },
    };
  }
}
