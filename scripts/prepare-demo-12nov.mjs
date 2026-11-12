import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error("File .env.local non trovato nella root del progetto.");
  }
  const env = {};
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    let val = (match[2] || "").trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[match[1]] = val;
  }
  return env;
}

async function main() {
  const env = loadEnvLocal();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Variabili NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti in .env.local"
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("=== Preparazione Database Demo Giovedì 12 Novembre 2026 ===");

  // ─────────────────────────────────────────────────────────────────────────
  // 0. Verifica sale cliniche e branche
  // ─────────────────────────────────────────────────────────────────────────
  const requiredRooms = [
    { slug: "studio-1", name: "Studio 1", floor: "Piano 1", is_active: true },
    { slug: "studio-2", name: "Studio 2", floor: "Piano 1", is_active: true },
    { slug: "studio-3", name: "Studio 3", floor: "Piano 1", is_active: true },
    { slug: "studio-4", name: "Studio 4", floor: "Piano 1", is_active: true },
    { slug: "sala-opt", name: "Sala OPT", floor: "Piano 1", is_active: true },
    { slug: "sala-filtro", name: "Sala Filtro", floor: "Piano 1", is_active: true },
  ];

  for (const r of requiredRooms) {
    const { error } = await supabase
      .from("clinic_rooms")
      .upsert(r, { onConflict: "slug" });
    if (error) throw new Error(`Errore upsert stanza ${r.slug}: ${error.message}`);
  }

  const { data: allRooms, error: roomsErr } = await supabase
    .from("clinic_rooms")
    .select("id, slug, name");
  if (roomsErr) throw roomsErr;
  const roomBySlug = Object.fromEntries(allRooms.map((r) => [r.slug, r.id]));

  const { data: branches } = await supabase.from("branches").select("id, slug");
  const branchBySlug = Object.fromEntries(
    (branches || []).map((b) => [b.slug, b.id])
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 2a. Aggiornamento Medici Ufficiali su tabella `doctors`
  // ─────────────────────────────────────────────────────────────────────────
  const officialDoctors = [
    {
      slug: "patty-scorzelli",
      full_name: "Patrizia Scorzelli",
      title: "Operatrice Estetica",
      affiliation: "Operatrice Estetica",
      specialty_slug: "carbossiterapia",
      branch_id: branchBySlug["medicina-estetica"] || null,
      is_active: true,
    },
    {
      slug: "titti-errico",
      full_name: "Dott.ssa Concetta (Titti) Errico",
      title: "Medico Chirurgo – Chirurgia Plastica e Ricostruttiva",
      affiliation: "Medico Chirurgo – Chirurgia Plastica e Ricostruttiva",
      specialty_slug: "chirurgia-plastica",
      branch_id: branchBySlug["medicina-estetica"] || null,
      is_active: true,
    },
    {
      slug: "alessandra-totaro",
      full_name: "Dott.ssa Alessandra Totaro",
      title: "Psicologa, Psicoterapeuta",
      affiliation: "Psicologa, Psicoterapeuta",
      specialty_slug: "psicologia",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "alessandra-riccardi",
      full_name: "Dott.ssa Alessandra Riccardi",
      title: "Medico Chirurgo – Medicina Estetica",
      affiliation: "Medico Chirurgo – Medicina Estetica",
      specialty_slug: "medicina-estetica",
      branch_id: branchBySlug["medicina-estetica"] || null,
      is_active: true,
    },
    {
      slug: "elisa-russo",
      full_name: "Dott.ssa Elisa Russo",
      title:
        "Odontoiatra, Specialista in Ortognatodonzia (Direttrice Sanitaria)",
      affiliation:
        "Odontoiatra, Specialista in Ortognatodonzia (Direttrice Sanitaria)",
      specialty_slug: "odontoiatria",
      branch_id: branchBySlug["odontoiatria"] || null,
      is_active: true,
    },
    {
      slug: "raffaella-poppiti",
      full_name: "Dott.ssa Raffaella Poppiti",
      title: "Medico Chirurgo Specialista in Ginecologia ed Ostetricia",
      affiliation: "Medico Chirurgo Specialista in Ginecologia ed Ostetricia",
      specialty_slug: "ginecologia",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "mirella-dandrea",
      full_name: "Dott.ssa Mirella D'Andrea",
      title: "Medico Chirurgo, Specialista in Dermatologia e Venereologia",
      affiliation: "Medico Chirurgo, Specialista in Dermatologia e Venereologia",
      specialty_slug: "dermatologia",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "guido-ciorra",
      full_name: "Dr. Guido Ciorra",
      title: "Medico Chirurgo Specialista in Chirurgia Generale",
      affiliation: "Medico Chirurgo Specialista in Chirurgia Generale",
      specialty_slug: "chirurgia-generale",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    // Altri medici ufficiali attivi in calendario
    {
      slug: "anna-maria-stillo",
      full_name: "Dott.ssa Anna Maria Stillo",
      title:
        "Medico Chirurgo Specialista in Malattie dell’Apparato Cardiovascolare",
      specialty_slug: "cardiologia",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "giuseppe-buono",
      full_name: "Dr. Giuseppe Buono",
      title: "Medico Chirurgo Specialista in Radiodiagnostica",
      specialty_slug: "ecografia",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "jessica-de-ceglie",
      full_name: "Dott.ssa Jessica De Ceglie",
      title: "Biologa, Nutrizionista",
      specialty_slug: "nutrizione",
      branch_id: branchBySlug["nutrizione"] || null,
      is_active: true,
    },
    {
      slug: "martina-pontillo",
      full_name: "Dott.ssa Martina Pontillo",
      title: "Medico Chirurgo – Senologia e Chirurgia Senologica",
      specialty_slug: "senologia",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "mario-toro",
      full_name: "Dr. Mario Toro",
      title:
        "Medico Chirurgo Specialista in Oftalmologia e Chirurgia Vitreo-Retinica",
      specialty_slug: "oculistica",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "raffaele-dalessio",
      full_name: "Dr. Raffaele D'Alessio",
      title: "Odontoiatria, Chirurgia e Implantologia",
      specialty_slug: "odontoiatria",
      branch_id: branchBySlug["odontoiatria"] || null,
      is_active: true,
    },
    {
      slug: "filippo-iaccarino",
      full_name: "Dr. Filippo Iaccarino",
      title: "Medico Chirurgo Specialista in Pediatria e Neonatologia",
      specialty_slug: "pediatria",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "vittorio-riccio",
      full_name: "Dr. Vittorio Riccio",
      title: "Medico Chirurgo – Oncologia Medica",
      specialty_slug: "oncologia",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "rocco-spera",
      full_name: "Dr. Rocco Spera",
      title: "Medico Chirurgo Specialista in Medicina dello Sport",
      specialty_slug: "medicina-sport",
      branch_id: branchBySlug["visite-specialistiche"] || null,
      is_active: true,
    },
    {
      slug: "francesco-dandrea",
      full_name: "Prof. Dr. Francesco D'Andrea",
      title:
        "Professore Ordinario di Chirurgia Plastica, Ricostruttiva ed Estetica",
      specialty_slug: "chirurgia-plastica",
      branch_id: branchBySlug["medicina-estetica"] || null,
      is_active: true,
    },
  ];

  for (const doc of officialDoctors) {
    const { error } = await supabase
      .from("doctors")
      .upsert(doc, { onConflict: "slug" });
    if (error) {
      throw new Error(`Errore upsert medico ${doc.slug}: ${error.message}`);
    }
  }

  const obsoleteDoctorSlugs = [
    "antonio-sorrentino",
    "rodolfo-nasti",
    "silvio-de-lucia",
    "nicola-rocco",
    "francesco-sasso",
    "gianluigi-califano",
    "vincenzo-pasquarelli",
    "maria-grazia-polverino",
  ];

  const { error: deactErr } = await supabase
    .from("doctors")
    .update({ is_active: false })
    .in("slug", obsoleteDoctorSlugs);
  if (deactErr) {
    throw new Error(`Errore disattivazione medici superati: ${deactErr.message}`);
  }

  const { data: allDoctors, error: docsErr } = await supabase
    .from("doctors")
    .select("id, slug, full_name, title, is_active");
  if (docsErr) throw docsErr;

  const docBySlug = Object.fromEntries(allDoctors.map((d) => [d.slug, d.id]));
  console.log(
    `[OK] Medici ufficiali attivi: ${allDoctors.filter((d) => d.is_active).length} | Disattivati: ${allDoctors.filter((d) => !d.is_active).length}`
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 2b. Aggiornamento Orari `doctor_availability`
  //     Lun–Ven 09:00–19:00, fasce 09:00–14:00 e 14:00–19:00, slot 60 min, ZERO Sabato
  // ─────────────────────────────────────────────────────────────────────────
  const { error: delAvailErr } = await supabase
    .from("doctor_availability")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delAvailErr) {
    throw new Error(
      `Errore pulizia doctor_availability: ${delAvailErr.message}`
    );
  }

  // Rimuovi eventuali regole Sabato/Domenica anche su availability_rules se presente
  await supabase.from("availability_rules").delete().gte("weekday", 6);

  const officialAvailability = [
    // Lunedì (1)
    { doc: "patty-scorzelli", room: "studio-2", weekday: 1, start: "09:00:00", end: "14:00:00" },
    { doc: "francesco-dandrea", room: "studio-3", weekday: 1, start: "09:00:00", end: "14:00:00" },
    { doc: "titti-errico", room: "studio-3", weekday: 1, start: "09:00:00", end: "14:00:00" },
    { doc: "alessandra-totaro", room: "studio-2", weekday: 1, start: "14:00:00", end: "19:00:00" },
    { doc: "martina-pontillo", room: "studio-4", weekday: 1, start: "17:00:00", end: "19:00:00" },

    // Martedì (2)
    { doc: "anna-maria-stillo", room: "studio-4", weekday: 2, start: "09:00:00", end: "14:00:00" },
    { doc: "mirella-dandrea", room: "studio-2", weekday: 2, start: "09:00:00", end: "14:00:00" },
    { doc: "guido-ciorra", room: "studio-3", weekday: 2, start: "14:00:00", end: "19:00:00" },
    { doc: "filippo-iaccarino", room: "studio-4", weekday: 2, start: "14:00:00", end: "19:00:00" },

    // Mercoledì (3)
    { doc: "elisa-russo", room: "studio-1", weekday: 3, start: "09:00:00", end: "14:00:00" },
    { doc: "elisa-russo", room: "studio-1", weekday: 3, start: "14:00:00", end: "19:00:00" },
    { doc: "raffaele-dalessio", room: "studio-2", weekday: 3, start: "14:00:00", end: "19:00:00" },
    { doc: "alessandra-riccardi", room: "studio-3", weekday: 3, start: "14:00:00", end: "19:00:00" },
    { doc: "giuseppe-buono", room: "studio-4", weekday: 3, start: "14:00:00", end: "17:00:00" },
    { doc: "martina-pontillo", room: "studio-4", weekday: 3, start: "17:00:00", end: "19:00:00" },

    // Giovedì (4) — Giornata Demo 12 Novembre 2026
    { doc: "elisa-russo", room: "studio-1", weekday: 4, start: "09:00:00", end: "14:00:00" },
    { doc: "patty-scorzelli", room: "studio-2", weekday: 4, start: "09:00:00", end: "14:00:00" },
    { doc: "titti-errico", room: "studio-3", weekday: 4, start: "09:00:00", end: "14:00:00" },
    { doc: "titti-errico", room: "studio-3", weekday: 4, start: "14:00:00", end: "19:00:00" },
    { doc: "raffaella-poppiti", room: "studio-4", weekday: 4, start: "14:00:00", end: "19:00:00" },
    { doc: "jessica-de-ceglie", room: "sala-filtro", weekday: 4, start: "14:00:00", end: "19:00:00" },

    // Venerdì (5)
    { doc: "elisa-russo", room: "studio-1", weekday: 5, start: "09:00:00", end: "14:00:00" },
    { doc: "patty-scorzelli", room: "studio-2", weekday: 5, start: "09:00:00", end: "14:00:00" },
    { doc: "patty-scorzelli", room: "studio-2", weekday: 5, start: "14:00:00", end: "19:00:00" },
    { doc: "rocco-spera", room: "studio-3", weekday: 5, start: "09:00:00", end: "14:00:00" },
    { doc: "vittorio-riccio", room: "studio-3", weekday: 5, start: "14:00:00", end: "19:00:00" },
    { doc: "mario-toro", room: "studio-4", weekday: 5, start: "14:00:00", end: "19:00:00" },
  ];

  const availabilityRows = officialAvailability.map((a) => ({
    doctor_id: docBySlug[a.doc],
    room_id: roomBySlug[a.room],
    weekday: a.weekday,
    start_time: a.start,
    end_time: a.end,
    slot_minutes: 60,
    is_active: true,
  }));

  const { error: insAvailErr } = await supabase
    .from("doctor_availability")
    .insert(availabilityRows);
  if (insAvailErr) {
    throw new Error(
      `Errore inserimento doctor_availability: ${insAvailErr.message}`
    );
  }
  console.log(
    `[OK] Orari doctor_availability aggiornati: ${availabilityRows.length} fasce Lun–Ven 09:00–19:00 (slot 60m, 0 Sabato)`
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 2d. Allineamento Anagrafiche Pazienti Demo, Piani e Rate
  // ─────────────────────────────────────────────────────────────────────────
  const { data: healthPaths } = await supabase
    .from("health_paths")
    .select("id, slug");
  const pathBySlug = Object.fromEntries(
    (healthPaths || []).map((hp) => [hp.slug, hp.id])
  );

  // Marco De Luca (COC-2026-01001) — Club Care + Percorso Allineatori saldato
  await supabase
    .from("patient_profiles")
    .update({
      health_path_id: pathBySlug["care"] || null,
      health_path_started_on: "2026-06-01",
      health_path_expires_on: "2027-06-01",
      notes:
        "[PAZIENTE DEMO TEST] Membro Percorso Salute Cocoora Club Care attivo. In trattamento ortodontico con allineatori trasparenti.",
    })
    .eq("patient_code", "COC-2026-01001");

  // Elena Caputo (COC-2026-01005) — Club Experience attivo
  await supabase
    .from("patient_profiles")
    .update({
      health_path_id: pathBySlug["experience"] || null,
      health_path_started_on: "2026-09-01",
      health_path_expires_on: "2027-09-01",
      notes:
        "[PAZIENTE DEMO TEST] Membro Percorso Salute Cocoora Club Experience attivo.",
    })
    .eq("patient_code", "COC-2026-01005");

  // Matteo Rossi (COC-2026-01004) — Prima visita nutrizionale singola
  await supabase
    .from("patient_profiles")
    .update({
      notes:
        "[PAZIENTE DEMO TEST] Prima consulenza nutrizionale e valutazione composizione corporea.",
    })
    .eq("patient_code", "COC-2026-01004");

  // Chiara De Rosa (demo) (COC-2026-01006) — Prima visita ginecologica singola
  const { error: chiaraErr } = await supabase.from("patient_profiles").upsert(
    {
      patient_code: "COC-2026-01006",
      first_name: "Chiara",
      last_name: "De Rosa (demo)",
      email: "chiara.derosa@example.com",
      phone: "+39 339 4455667",
      birth_date: "1992-04-18",
      gender: "donna",
      city: "Napoli",
      province: "NA",
      country: "IT",
      is_account_holder: true,
      is_active: true,
      notes:
        "[PAZIENTE DEMO TEST] Prima visita specialistica ginecologica con ecografia.",
    },
    { onConflict: "patient_code" }
  );
  if (chiaraErr) {
    throw new Error(`Errore upsert Chiara De Rosa: ${chiaraErr.message}`);
  }

  const { data: patients, error: patErr } = await supabase
    .from("patient_profiles")
    .select("id, patient_code, first_name, last_name");
  if (patErr) throw patErr;
  const patientByCode = Object.fromEntries(
    patients.map((p) => [p.patient_code, p.id])
  );

  // Pulizia piani e rate demo per coerenza contabile al centesimo
  // 1) Piano Marco De Luca PT-2026-0042 -> saldato €2.500 (5 rate da €500 pagate, zero rate scadute residue)
  const { data: planMarco } = await supabase
    .from("patient_treatment_plans")
    .select("id")
    .eq("plan_code", "PT-2026-0042")
    .maybeSingle();

  if (planMarco) {
    await supabase
      .from("treatment_installments")
      .delete()
      .eq("plan_id", planMarco.id)
      .gt("installment_number", 5);

    await supabase
      .from("treatment_installments")
      .update({
        amount: 500,
        status: "pagato",
        payment_method: "pos",
        paid_at: "2026-10-15T10:00:00.000Z",
      })
      .eq("plan_id", planMarco.id)
      .lte("installment_number", 5);

    await supabase
      .from("patient_treatment_plans")
      .update({
        doctor_id: docBySlug["elisa-russo"],
        total_amount: 2800,
        discount_amount: 300,
        net_total: 2500,
        paid_total: 2500,
        balance_due: 0,
        status: "completato",
        payment_status: "saldato",
      })
      .eq("id", planMarco.id);
  }

  // 2) Piano Laura Ferri PT-2026-0058 -> €1.400 totale, €800 versati, €600 residuo (con Dott.ssa Titti Errico)
  const { data: planLaura } = await supabase
    .from("patient_treatment_plans")
    .select("id")
    .eq("plan_code", "PT-2026-0058")
    .maybeSingle();

  if (planLaura) {
    await supabase
      .from("fatture_in_cloud_sync")
      .delete()
      .eq("plan_id", planLaura.id);

    await supabase
      .from("treatment_installments")
      .delete()
      .eq("plan_id", planLaura.id)
      .gt("installment_number", 3);

    await supabase
      .from("treatment_installments")
      .update({
        amount: 600,
        due_date: "2026-11-15",
        status: "previsto",
        payment_method: null,
        paid_at: null,
        receipt_number: null,
        notes: null,
      })
      .eq("plan_id", planLaura.id)
      .eq("installment_number", 3);

    await supabase
      .from("patient_treatment_plans")
      .update({
        doctor_id: docBySlug["titti-errico"],
        total_amount: 1400,
        discount_amount: 0,
        net_total: 1400,
        paid_total: 800,
        balance_due: 600,
        status: "attivo",
        payment_status: "parzialmente_pagato",
      })
      .eq("id", planLaura.id);
  }

  // 3) Piano Giulia Esposito PT-2026-0064 -> €1.800 totale, €600 versati, €1.200 residuo
  const { data: planGiulia } = await supabase
    .from("patient_treatment_plans")
    .select("id")
    .eq("plan_code", "PT-2026-0064")
    .maybeSingle();

  if (planGiulia) {
    await supabase
      .from("patient_treatment_plans")
      .update({
        doctor_id: docBySlug["elisa-russo"],
        total_amount: 1800,
        discount_amount: 0,
        net_total: 1800,
        paid_total: 600,
        balance_due: 1200,
        status: "attivo",
        payment_status: "parzialmente_pagato",
      })
      .eq("id", planGiulia.id);
  }

  const { data: allPlans } = await supabase
    .from("patient_treatment_plans")
    .select("id, plan_code");
  const planByCode = Object.fromEntries(
    (allPlans || []).map((p) => [p.plan_code, p.id])
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Rimozione vecchi appuntamenti demo e inserimento scaletta 2026-11-12
  // ─────────────────────────────────────────────────────────────────────────
  const { error: delAppsErr } = await supabase
    .from("appointments")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delAppsErr) {
    throw new Error(
      `Errore pulizia vecchi appuntamenti: ${delAppsErr.message}`
    );
  }

  const demoAppointments = [
    {
      patient_id: patientByCode["COC-2026-01001"],
      doctor_id: docBySlug["elisa-russo"],
      room_id: roomBySlug["studio-1"],
      treatment_plan_id: planByCode["PT-2026-0042"] || null,
      starts_at: "2026-11-12T09:00:00+01:00",
      ends_at: "2026-11-12T10:00:00+01:00",
      status: "completato",
      is_first_visit: false,
      notes:
        "Controllo periodico allineatori trasparenti. [Reminder1h: 08:00 via WhatsApp] [Arrivo: 2026-11-12T08:54:00.000Z] [InizioVisita: 2026-11-12T09:00:00.000Z] [Attesa: 6m] [FineVisita: 2026-11-12T09:48:00.000Z] [Durata: 48m] [Incasso: Inclusa in Percorso]",
    },
    {
      patient_id: patientByCode["COC-2026-01005"],
      doctor_id: docBySlug["patty-scorzelli"],
      room_id: roomBySlug["studio-2"],
      treatment_plan_id: null,
      starts_at: "2026-11-12T10:30:00+01:00",
      ends_at: "2026-11-12T11:30:00+01:00",
      status: "confermato",
      is_first_visit: false,
      notes:
        "Seduta Carbossiterapia Medicale corpo. [Reminder1h: 09:30 via WhatsApp] [Arrivo: 2026-11-12T09:22:00.000Z]",
    },
    {
      patient_id: patientByCode["COC-2026-01002"],
      doctor_id: docBySlug["titti-errico"],
      room_id: roomBySlug["studio-3"],
      treatment_plan_id: planByCode["PT-2026-0058"] || null,
      starts_at: "2026-11-12T11:30:00+01:00",
      ends_at: "2026-11-12T12:30:00+01:00",
      status: "confermato",
      is_first_visit: false,
      notes: "Seduta protocollo rigenerativo viso e laserterapia medicale.",
    },
    {
      patient_id: patientByCode["COC-2026-01003"],
      doctor_id: docBySlug["elisa-russo"],
      room_id: roomBySlug["studio-1"],
      treatment_plan_id: planByCode["PT-2026-0064"] || null,
      starts_at: "2026-11-12T14:00:00+01:00",
      ends_at: "2026-11-12T15:00:00+01:00",
      status: "confermato",
      is_first_visit: false,
      notes:
        "Controllo ortodonzia intercettiva pediatrica (accompagnata da entrambi i genitori).",
    },
    {
      patient_id: patientByCode["COC-2026-01004"],
      doctor_id: docBySlug["jessica-de-ceglie"],
      room_id: roomBySlug["sala-filtro"],
      treatment_plan_id: null,
      starts_at: "2026-11-12T15:00:00+01:00",
      ends_at: "2026-11-12T16:00:00+01:00",
      status: "confermato",
      is_first_visit: true,
      notes:
        "Prima consulenza nutrizionale e valutazione composizione corporea.",
    },
    {
      patient_id: patientByCode["COC-2026-01006"],
      doctor_id: docBySlug["raffaella-poppiti"],
      room_id: roomBySlug["studio-4"],
      treatment_plan_id: null,
      starts_at: "2026-11-12T16:30:00+01:00",
      ends_at: "2026-11-12T17:30:00+01:00",
      status: "confermato",
      is_first_visit: true,
      notes: "Prima visita specialistica ginecologica con ecografia.",
    },
  ];

  const { data: insertedApps, error: insAppErr } = await supabase
    .from("appointments")
    .insert(demoAppointments)
    .select(
      `
      id,
      starts_at,
      ends_at,
      status,
      is_first_visit,
      notes,
      patient_profiles ( patient_code, first_name, last_name ),
      doctors ( slug, full_name ),
      clinic_rooms ( slug, name )
    `
    )
    .order("starts_at", { ascending: true });

  if (insAppErr) {
    throw new Error(
      `Errore inserimento appuntamenti demo 12/11/2026: ${insAppErr.message}`
    );
  }

  console.log(
    `[OK] Inseriti ${insertedApps.length} appuntamenti demo per Giovedì 12/11/2026:`
  );
  for (const a of insertedApps) {
    const startRome = new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(a.starts_at));
    const endRome = new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(a.ends_at));
    console.log(
      `  • ${a.id} | ${startRome}-${endRome} | ${a.patient_profiles.first_name} ${a.patient_profiles.last_name} (${a.patient_profiles.patient_code}) -> ${a.doctors.full_name} [${a.clinic_rooms.name}] | DB:${a.status}`
    );
  }

  console.log("=== Allineamento Demo 12 Novembre 2026 completato con successo ===");
}

main().catch((err) => {
  console.error("ERRORE SCRIPT DEMO:", err.message || err);
  process.exit(1);
});
