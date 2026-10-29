const fs = require("fs");
const path = require("path");
const pg = require("C:/Users/mario/Progetti Antigravity/Global_Tools/supabase-mcp-server/node_modules/pg");
const { Client } = pg;

function splitCsvLine(line, delimiter = ",") {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
}

function parsePriceToCents(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d,.-]/g, "").trim();
  if (!cleaned) return null;
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let norm = cleaned;
  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) norm = cleaned.replace(/\./g, "").replace(",", ".");
    else norm = cleaned.replace(/,/g, "");
  } else if (lastComma !== -1) {
    const parts = cleaned.split(",");
    norm = parts.length === 2 && parts[1].length <= 2 ? `${parts[0]}.${parts[1]}` : parts.join("");
  }
  const val = Number(norm);
  if (!Number.isFinite(val) || val < 0) return null;
  return Math.round(val * 100);
}

function slugify(val) {
  return val
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

const BRANCHES = {
  "odontoiatria": "3f932861-9709-420f-a057-c8091cad2aa2",
  "medicina-estetica": "037890d1-a1e6-478b-bdb4-377a997777e8",
  "visite-specialistiche": "45c8e71c-159a-4e43-8acb-ec66c2a08bd1"
};

function resolveAreaAndCategory(specialty, name) {
  const text = `${specialty} ${name}`.toLowerCase();
  if (/(odonto|ortodon|allineator|implant|endodon|parodont|protesi|conservativa|igiene dentale|sorriso|gnatolog|bite)/.test(text)) {
    return { area: "Odontoiatria", category: "odontoiatria", branchId: BRANCHES["odontoiatria"] };
  }
  if (/(estetica|rigenerativ|plastica|filler|botulin|tossina|biorivital|biostimol|peeling|prx|criolip|carbossi|mesoterap|intralipo|laser|luce pulsata|resurfacing|ultrasuoni|cfu|epilazione|scleroterap|lipofill|acido ialuronico)/.test(text)) {
    return { area: "Medicina Estetica", category: "medicina_estetica", branchId: BRANCHES["medicina-estetica"] };
  }
  if (/(diagnost|ecograf|radiolog|tomograf|tac|rx|opt|laborator)/.test(text)) {
    return { area: "Visite Specialistiche", category: "diagnostica", branchId: BRANCHES["visite-specialistiche"] };
  }
  if (/(igiene|prevenzione)/.test(text)) {
    return { area: "Visite Specialistiche", category: "igiene_prevenzione", branchId: BRANCHES["visite-specialistiche"] };
  }
  return { area: "Visite Specialistiche", category: "visita_specialistica", branchId: BRANCHES["visite-specialistiche"] };
}

async function main() {
  const connStr = "postgresql://postgres.nrmjqpyrhcaouvjhbggx:%25Cocoora26%25@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log("Dropping NOT NULL constraint on base_price...");
  await client.query("ALTER TABLE public.medical_services ALTER COLUMN base_price DROP NOT NULL;");

  const csvPath = path.join(__dirname, "../docs/catalogo_unico_prestazioni_ottobre_2026.csv");
  const lines = fs.readFileSync(csvPath, "utf8").split(/\r?\n/);

  const headerIdx = lines.findIndex(l => l.includes("Codice") && l.includes("Prestazione"));
  if (headerIdx === -1) throw new Error("Header not found in CSV");

  const parsedRows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = splitCsvLine(line);
    const code = (cells[0] || "").trim().toUpperCase();
    if (!code.startsWith("COC-")) continue;

    const specialty = (cells[1] || "").trim();
    const name = (cells[2] || "").trim();
    const rawPrice = (cells[3] || "").trim();
    const priceCents = parsePriceToCents(rawPrice);
    const priceMode = (cells[4] || "").trim();
    const vatRegime = (cells[5] || "").trim() || "ESENTE IVA art. 10, c.1, n.18 DPR 633/72";
    const status = (cells[6] || "ATTIVA").trim().toUpperCase();
    const notes = (cells[9] || "").trim();
    const room = (cells[10] || "").trim() || null;
    const rawBookable = (cells[11] || "").trim().toLowerCase();
    const bookableOnline = ["si", "s", "yes", "true", "1"].includes(rawBookable);

    const { area, category, branchId } = resolveAreaAndCategory(specialty, name);

    parsedRows.push({
      code,
      specialty,
      name,
      basePrice: priceCents !== null ? priceCents / 100 : null,
      priceMode,
      vatRegime,
      status,
      notes,
      room,
      bookableOnline,
      area,
      category,
      branchId,
      isListed: status === "ATTIVA" && priceCents !== null,
      slug: `${slugify(name)}-${code.toLowerCase()}`
    });
  }

  console.log(`Parsed ${parsedRows.length} official COC-xxx services from CSV!`);

  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    const desc = row.notes ? `${row.specialty} — ${row.notes}` : row.specialty;

    const query = `
      INSERT INTO public.medical_services (
        code, name, category, branch_id, description,
        duration_minutes, base_price, is_active, sort_order,
        is_bookable_online, is_listed, vat_regime, room, slug, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14, NOW()
      )
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        branch_id = EXCLUDED.branch_id,
        description = EXCLUDED.description,
        duration_minutes = EXCLUDED.duration_minutes,
        base_price = EXCLUDED.base_price,
        is_active = EXCLUDED.is_active,
        sort_order = EXCLUDED.sort_order,
        is_bookable_online = EXCLUDED.is_bookable_online,
        is_listed = EXCLUDED.is_listed,
        vat_regime = EXCLUDED.vat_regime,
        room = EXCLUDED.room,
        slug = EXCLUDED.slug,
        updated_at = NOW()
      RETURNING id, (xmax = 0) AS is_insert;
    `;

    try {
      const res = await client.query(query, [
        row.code,
        row.name,
        row.category,
        row.branchId,
        desc,
        60,
        row.basePrice,
        row.status === "ATTIVA",
        i + 1,
        row.bookableOnline,
        row.isListed,
        row.vatRegime,
        row.room,
        row.slug
      ]);
      if (res.rows[0].is_insert) inserted++;
      else updated++;
    } catch (err) {
      console.error(`Error on ${row.code} (${row.name}):`, err.message);
    }
  }

  console.log(`Sync complete! Inserted: ${inserted}, Updated: ${updated}`);

  const total = await client.query("SELECT count(*) FROM medical_services;");
  const cocTotal = await client.query("SELECT count(*) FROM medical_services WHERE code LIKE 'COC-%';");
  const cocBookable = await client.query("SELECT count(*) FROM medical_services WHERE code LIKE 'COC-%' AND is_bookable_online = true;");
  console.log("Total medical_services in DB now:", total.rows[0].count);
  console.log("COC- services in DB now:", cocTotal.rows[0].count);
  console.log("COC- bookable online in DB now:", cocBookable.rows[0].count);

  await client.end();
}

main().catch(console.error);
