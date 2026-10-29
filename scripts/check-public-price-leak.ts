/**
 * Verifica automatica anti-leak prezzi — Cocoora Centro Medico
 *
 * Analizza le pagine e i componenti pubblici e segnala i riferimenti a prezzi
 * di singole visite specialistiche. La regola del Brand Vault è chiara: sul
 * sito pubblico possono comparire esclusivamente i prezzi dei Percorsi Salute
 * (e la tabella comparativa delle prestazioni), mentre le tariffe delle visite
 * singole restano nel backend CRM per la fatturazione.
 *
 * Uso:
 *   node --experimental-strip-types scripts/check-public-price-leak.ts
 *   npx tsx scripts/check-public-price-leak.ts
 *
 * Exit code:
 *   0 = nessuna violazione rilevata
 *   1 = violazioni rilevate oppure analisi non eseguibile
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs") as typeof import("node:fs");
const path = require("node:path") as typeof import("node:path");

const ROOT = process.cwd();
const SCAN_ROOTS = ["src/app", "src/components"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);

const EXCLUDED_PATH_SEGMENTS = [
  "/admin/",
  "/api/",
  "/segreteria/",
  "/area-paziente/",
  "/reception/",
  "/patient/",
  "/calendar/",
  "/role-switcher/",
  "/admin",
];

const PRICE_PATTERN = /(?:€|EUR)\s?\d[\d.,]*|\d[\d.,]*\s?(?:€|EUR\b)/gi;

const STRONG_ALLOWED_PATTERNS: RegExp[] = [
  /percors[oi]\s+salute/,
  /percors[oi]\s+cocoora/,
  /cocoora\s+club/,
  /\bclub\b/,
  /\baccess\b/,
  /\bcare\s*plus\b/,
  /\bexperience\b/,
  /\bsignature\b/,
  /\bdiscover\b/,
  /\bprecision\b/,
  /\bmembership\b/,
  /quota\s+(?:annuale|di\s+iscrizione|associativa)/,
  /iscrizione\s+annuale/,
  /gratuito/,
  /\bfree\b/,
  /€\s?0(?:\D|$)/,
  /(?:^|\D)0\s?€/,
];

const FORBIDDEN_CONTEXT_PATTERNS: RegExp[] = [
  /\bvisita\b/,
  /\bvisite\b/,
  /specialistic/,
  /dermatolog/,
  /cardiolog/,
  /ginecolog/,
  /pediatr/,
  /oculist/,
  /diabetolog/,
  /oncolog/,
  /odontoiatr/,
  /igiene/,
  /consulenza/,
  /prestazione/,
  /tariffa/,
  /listino/,
  /check-?up/,
  /ecograf/,
  /\besame\b/,
];

const DIRECT_LEAK_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  {
    pattern:
      /\bvisita(?:\s+(?:specialistica|medica|odontoiatrica|dermatologica|cardiologica|ginecologica|pediatrica|oculistica|diabetologica|oncologica))?\s*(?:da|a\s+partire\s+da|:)?\s*(?:€|EUR)\s?\d/i,
    label: "Prezzo di una visita indicato direttamente",
  },
  {
    pattern:
      /(?:€|EUR)\s?\d[\d.,]*\s*(?:per|a)\s+visita\b/i,
    label: "Prezzo associato a 'per visita'",
  },
  {
    pattern: /\btariffa\s+(?:della\s+)?visita\b/i,
    label: "Riferimento esplicito alla tariffa della visita",
  },
  {
    pattern: /\bprezzo\s+(?:della\s+)?visita\b/i,
    label: "Riferimento esplicito al prezzo della visita",
  },
  {
    pattern: /\blistino\s+visite\b/i,
    label: "Riferimento al listino visite",
  },
  {
    pattern:
      /\bvisite?\s+(?:specialistiche?|mediche?)\s+(?:a|da)\s+(?:€|EUR)\s?\d/i,
    label: "Prezzo di visite specialistiche",
  },
  {
    pattern:
      /\b(?:prima\s+)?visita\b[^\n]{0,50}(?:€|EUR)\s?\d/i,
    label: "Prezzo affiancato alla voce visita",
  },
  {
    pattern:
      /(?:€|EUR)\s?\d[\d.,]*[^\n]{0,40}\bvisita\b/i,
    label: "Importo affiancato alla voce visita",
  },
];

type Finding = {
  file: string;
  line: number;
  severity: "violation" | "warning";
  message: string;
  excerpt: string;
};

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function isExcluded(relativePath: string): boolean {
  const normalized = `/${toPosix(relativePath)}`;
  return EXCLUDED_PATH_SEGMENTS.some((segment) =>
    normalized.includes(segment)
  );
}

function walk(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  const files: string[] = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(absolute));
      continue;
    }

    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (!SOURCE_EXTENSIONS.has(extension)) continue;

    files.push(absolute);
  }

  return files;
}

function isCommentLine(trimmed: string): boolean {
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("{/*") ||
    trimmed.startsWith("<!--")
  );
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function excerptOf(lines: string[], lineIndex: number): string {
  const start = Math.max(0, lineIndex - 1);
  const end = Math.min(lines.length - 1, lineIndex + 1);

  return lines
    .slice(start, end + 1)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .slice(0, 240);
}

function inspectFile(absoluteFile: string): Finding[] {
  const relative = toPosix(path.relative(ROOT, absoluteFile));
  if (isExcluded(relative)) return [];

  const content = fs.readFileSync(absoluteFile, "utf8");
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const findings: Finding[] = [];
  const reportedLines = new Set<number>();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed || isCommentLine(trimmed)) continue;

    PRICE_PATTERN.lastIndex = 0;
    if (!PRICE_PATTERN.test(line)) continue;

    if (reportedLines.has(index)) continue;

    const windowStart = Math.max(0, index - 3);
    const windowEnd = Math.min(lines.length - 1, index + 3);
    const windowText = normalize(
      lines.slice(windowStart, windowEnd + 1).join(" ")
    );
    const lineText = normalize(line);

    const directLeak = DIRECT_LEAK_PATTERNS.find((entry) =>
      entry.pattern.test(lineText)
    );

    if (directLeak) {
      findings.push({
        file: relative,
        line: index + 1,
        severity: "violation",
        message: directLeak.label,
        excerpt: excerptOf(lines, index),
      });
      reportedLines.add(index);
      continue;
    }

    const allowed = STRONG_ALLOWED_PATTERNS.some((pattern) =>
      pattern.test(windowText)
    );

    if (allowed) continue;

    const forbidden = FORBIDDEN_CONTEXT_PATTERNS.some((pattern) =>
      pattern.test(windowText)
    );

    if (forbidden) {
      findings.push({
        file: relative,
        line: index + 1,
        severity: "violation",
        message:
          "Prezzo pubblicato vicino a una prestazione singola: verifica che non sia una tariffa di visita",
        excerpt: excerptOf(lines, index),
      });
      reportedLines.add(index);
      continue;
    }

    findings.push({
      file: relative,
      line: index + 1,
      severity: "warning",
      message:
        "Prezzo non classificato: verifica manualmente che appartenga a un Percorso Salute",
      excerpt: excerptOf(lines, index),
    });
    reportedLines.add(index);
  }

  return findings;
}

function main(): number {
  const files = SCAN_ROOTS.flatMap((root) => walk(path.join(ROOT, root)));

  if (files.length === 0) {
    console.error(
      "❌ Nessun file pubblico trovato. Esegui lo script dalla root del progetto Cocoora."
    );
    return 1;
  }

  const findings = files.flatMap(inspectFile);
  const violations = findings.filter(
    (finding) => finding.severity === "violation"
  );
  const warnings = findings.filter(
    (finding) => finding.severity === "warning"
  );

  console.log("");
  console.log("🛡️  COCOORA — Verifica anti-leak prezzi visite singole");
  console.log("──────────────────────────────────────────────────────────");
  console.log(`File pubblici analizzati : ${files.length}`);
  console.log(`Segnalazioni totali      : ${findings.length}`);
  console.log(`Violazioni               : ${violations.length}`);
  console.log(`Avvisi da verificare     : ${warnings.length}`);
  console.log("");

  if (violations.length > 0) {
    console.log("❌ VIOLAZIONI RILEVATE");
    for (const finding of violations) {
      console.log(
        `   ${finding.file}:${finding.line} — ${finding.message}`
      );
      console.log(`      ${finding.excerpt}`);
    }
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("⚠️  AVVISI (non bloccanti)");
    for (const finding of warnings) {
      console.log(
        `   ${finding.file}:${finding.line} — ${finding.message}`
      );
      console.log(`      ${finding.excerpt}`);
    }
    console.log("");
  }

  if (violations.length === 0) {
    console.log(
      "✅ Conforme al Brand Vault: nessun prezzo di visite singole pubblicato."
    );
    console.log(
      "   Prezzi ammessi: Percorsi Salute, Cocoora Club e tabella comparativa delle prestazioni."
    );
    console.log("");
    return 0;
  }

  console.log(
    "   Rimuovi i prezzi delle visite singole dalle pagine pubbliche e mantienili nel backend CRM."
  );
  console.log("");
  return 1;
}

process.exitCode = main();
