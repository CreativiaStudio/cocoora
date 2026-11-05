const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Carica credenziali da .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (m) {
    let val = m[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[m[1]] = val.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log("🚀 Sincronizzazione Database Calendario e Medici Cocoora...");

  // 1. Assicura che le sale siano presenti (incluse le 5 stanze + Sala Filtro)
  const roomsToAdd = [
    { slug: 'sala-filtro', name: 'Sala Filtro', floor: 'Piano 1' }
  ];

  for (const r of roomsToAdd) {
    const { data: existing } = await supabase.from('clinic_rooms').select('id').eq('slug', r.slug).maybeSingle();
    if (!existing) {
      const { error } = await supabase.from('clinic_rooms').insert(r);
      if (error) console.warn("Errore inserimento sala-filtro:", error.message);
      else console.log("✅ Sala Filtro aggiunta a clinic_rooms");
    }
  }

  const { data: allRooms } = await supabase.from('clinic_rooms').select('id, slug, name');
  const roomMap = {};
  allRooms.forEach(r => { roomMap[r.slug] = r.id; });
  console.log("📍 Mappa Sale:", roomMap);

  // 2. Anagrafica Medici Ufficiali dal Calendario
  const doctorsData = [
    {
      slug: 'patty-scorzelli',
      full_name: 'Dott.ssa Patty Scorzelli',
      title: 'Specialista in Carbossiterapia e Medicina Rigenerativa',
      specialty_slug: 'carbossiterapia',
      is_active: true
    },
    {
      slug: 'francesco-dandrea',
      full_name: "Prof. Dr. Francesco D'Andrea",
      title: 'Professore Ordinario di Chirurgia Plastica, Ricostruttiva ed Estetica',
      specialty_slug: 'chirurgia-plastica',
      is_active: true
    },
    {
      slug: 'titti-errico',
      full_name: 'Dott.ssa Titti Errico',
      title: 'Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica',
      specialty_slug: 'chirurgia-plastica',
      is_active: true
    },
    {
      slug: 'alessandra-totaro',
      full_name: 'Dott.ssa Alessandra Totaro',
      title: 'Psicologa Clinica e Psicoterapeuta',
      specialty_slug: 'psicologia',
      is_active: true
    },
    {
      slug: 'anna-maria-stillo',
      full_name: 'Dott.ssa Anna Maria Stillo',
      title: 'Specialista in Cardiologia ed Ecografia Cardiaca',
      specialty_slug: 'cardiologia',
      is_active: true
    },
    {
      slug: 'elisa-russo',
      full_name: 'Dott.ssa Elisa Russo',
      title: 'Specialista in Ortognatodonzia e Odontoiatria Pediatrica',
      specialty_slug: 'odontoiatria',
      is_active: true
    },
    {
      slug: 'raffaele-dalessio',
      full_name: "Dr. Raffaele D'Alessio",
      title: 'Chirurgo Orale e Implantologo',
      specialty_slug: 'odontoiatria',
      is_active: true
    },
    {
      slug: 'alessandra-riccardi',
      full_name: 'Dott.ssa Alessandra Riccardi',
      title: 'Medico Estetico e Rigenerativo',
      specialty_slug: 'medicina-estetica',
      is_active: true
    },
    {
      slug: 'giuseppe-buono',
      full_name: 'Dr. Giuseppe Buono',
      title: 'Specialista in Diagnostica per Immagini ed Ecografia Clinica',
      specialty_slug: 'ecografia',
      is_active: true
    },
    {
      slug: 'maria-grazia-polverino',
      full_name: 'Dott.ssa Maria Grazia Polverino',
      title: 'Biologa Nutrizionista Specialista in Nutrizione Clinica',
      specialty_slug: 'nutrizione',
      is_active: true
    },
    {
      slug: 'jessica-de-ceglie',
      full_name: 'Dott.ssa Jessica De Ceglie',
      title: 'Biologa Nutrizionista Specialista in Nutrizione e Alimentazione',
      specialty_slug: 'nutrizione',
      is_active: true
    },
    {
      slug: 'raffaella-poppiti',
      full_name: 'Dott.ssa Raffaella Poppiti',
      title: 'Specialista in Ginecologia, Ostetricia ed Ecografia Pelvica',
      specialty_slug: 'ginecologia',
      is_active: true
    },
    {
      slug: 'mario-toro',
      full_name: 'Dr. Mario Toro',
      title: 'Specialista in Oculistica e Chirurgia Refrattiva',
      specialty_slug: 'oculistica',
      is_active: true
    },
    {
      slug: 'martina-pontillo',
      full_name: 'Dott.ssa Martina Pontillo',
      title: 'Specialista in Senologia ed Ecografia Mammaria',
      specialty_slug: 'senologia',
      is_active: true
    },
    {
      slug: 'vittorio-riccio',
      full_name: 'Dr. Vittorio Riccio',
      title: 'Specialista in Oncologia Medica e Prevenzione',
      specialty_slug: 'oncologia',
      is_active: true
    },
    {
      slug: 'guido-ciorra',
      full_name: 'Dr. Guido Ciorra',
      title: 'Specialista in Chirurgia Generale e Ambulatoriale Mininvasiva',
      specialty_slug: 'chirurgia-generale',
      is_active: true
    },
    {
      slug: 'rocco-spera',
      full_name: 'Dr. Rocco Spera',
      title: 'Specialista in Medicina dello Sport e Valutazione Funzionale',
      specialty_slug: 'medicina-sport',
      is_active: true
    },
    {
      slug: 'filippo-iaccarino',
      full_name: 'Dr. Filippo Iaccarino',
      title: 'Specialista in Pediatria e Cura dell’Accrescimento',
      specialty_slug: 'pediatria',
      is_active: true
    }
  ];

  const doctorMap = {};

  for (const doc of doctorsData) {
    const { data: existing } = await supabase.from('doctors').select('id, slug').eq('slug', doc.slug).maybeSingle();
    if (existing) {
      const { error } = await supabase.from('doctors').update(doc).eq('id', existing.id);
      if (error) console.error(`Errore aggiornamento medico ${doc.slug}:`, error.message);
      doctorMap[doc.slug] = existing.id;
      console.log(`🔄 Medico aggiornato: ${doc.full_name} (${existing.id})`);
    } else {
      const { data: inserted, error } = await supabase.from('doctors').insert(doc).select('id').single();
      if (error) console.error(`Errore inserimento medico ${doc.slug}:`, error.message);
      else {
        doctorMap[doc.slug] = inserted.id;
        console.log(`➕ Nuovo medico inserito: ${doc.full_name} (${inserted.id})`);
      }
    }
  }

  // 3. Configurazione Disponibilità Settimanali da Calendario
  // Chiave di lettura:
  // - slot_minutes: 60 (30 min visita clinica + 30 min pulizia/sanificazione e buffer)
  // - Mattina: 09:00 - 13:00 (4 slot: 09:00, 10:00, 11:00, 12:00)
  // - Pomeriggio: 15:00 - 19:00 (4 slot: 15:00, 16:00, 17:00, 18:00)
  // - Giorno intero: 09:00 - 13:00 e 15:00 - 19:00
  // Weekday: 1=Lun, 2=Mar, 3=Mer, 4=Gio, 5=Ven, 6=Sab, 7=Dom

  const availabilities = [
    // Lunedì (1)
    // Patty Scorzelli - Carbossiterapia - Studio 2 (09:00 - 13:00)
    { docSlug: 'patty-scorzelli', roomSlug: 'studio-2', weekday: 1, start: '09:00:00', end: '13:00:00' },
    // D'Andrea + Errico - Chirurgia plastica ed estetica - Studio 3 (09:00 - 13:00)
    { docSlug: 'francesco-dandrea', roomSlug: 'studio-3', weekday: 1, start: '09:00:00', end: '13:00:00' },
    { docSlug: 'titti-errico', roomSlug: 'studio-3', weekday: 1, start: '09:00:00', end: '13:00:00' },
    // Alessandra Totaro - Psicologia - Studio 4 (Lunedì tutto il giorno: 09:00 - 13:00 e 15:00 - 19:00)
    { docSlug: 'alessandra-totaro', roomSlug: 'studio-4', weekday: 1, start: '09:00:00', end: '13:00:00' },
    { docSlug: 'alessandra-totaro', roomSlug: 'studio-4', weekday: 1, start: '15:00:00', end: '19:00:00' },

    // Martedì (2)
    // Anna Maria Stillo - Cardiologia ed ecografia cardiaca - Studio 4 (Martedì tutto il giorno: 09:00 - 13:00 e 15:00 - 19:00)
    { docSlug: 'anna-maria-stillo', roomSlug: 'studio-4', weekday: 2, start: '09:00:00', end: '13:00:00' },
    { docSlug: 'anna-maria-stillo', roomSlug: 'studio-4', weekday: 2, start: '15:00:00', end: '19:00:00' },

    // Mercoledì (3)
    // Elisa Russo - Odontoiatria - Studio 1 (Mercoledì tutto il giorno: 09:00 - 13:00 e 15:00 - 19:00)
    { docSlug: 'elisa-russo', roomSlug: 'studio-1', weekday: 3, start: '09:00:00', end: '13:00:00' },
    { docSlug: 'elisa-russo', roomSlug: 'studio-1', weekday: 3, start: '15:00:00', end: '19:00:00' },
    // Raffaele D'Alessio - Chirurgia/Implantologia - Studio 1 (Mercoledì pomeriggio: 15:00 - 19:00)
    { docSlug: 'raffaele-dalessio', roomSlug: 'studio-1', weekday: 3, start: '15:00:00', end: '19:00:00' },
    // Alessandra Riccardi - Medicina Estetica - Studio 3 (Mercoledì pomeriggio: 15:00 - 19:00)
    { docSlug: 'alessandra-riccardi', roomSlug: 'studio-3', weekday: 3, start: '15:00:00', end: '19:00:00' },
    // Giuseppe Buono - Ecografia Clinica - Studio 4 (Mercoledì pomeriggio: 15:00 - 19:00)
    { docSlug: 'giuseppe-buono', roomSlug: 'studio-4', weekday: 3, start: '15:00:00', end: '19:00:00' },
    // Maria Grazia Polverino - Nutrizione - Sala Filtro (Mercoledì pomeriggio: 15:00 - 19:00)
    { docSlug: 'maria-grazia-polverino', roomSlug: 'sala-filtro', weekday: 3, start: '15:00:00', end: '19:00:00' },

    // Giovedì (4)
    // Patty Scorzelli - Carbossiterapia - Studio 2 (09:00 - 13:00)
    { docSlug: 'patty-scorzelli', roomSlug: 'studio-2', weekday: 4, start: '09:00:00', end: '13:00:00' },
    // D'Andrea + Errico - Chirurgia Plastica ed Estetica - Studio 3 (Giovedì tutto il giorno: 09:00 - 13:00 e 15:00 - 19:00)
    { docSlug: 'francesco-dandrea', roomSlug: 'studio-3', weekday: 4, start: '09:00:00', end: '13:00:00' },
    { docSlug: 'francesco-dandrea', roomSlug: 'studio-3', weekday: 4, start: '15:00:00', end: '19:00:00' },
    { docSlug: 'titti-errico', roomSlug: 'studio-3', weekday: 4, start: '09:00:00', end: '13:00:00' },
    { docSlug: 'titti-errico', roomSlug: 'studio-3', weekday: 4, start: '15:00:00', end: '19:00:00' },
    // Raffaella Poppiti - Ginecologia - Studio 4 (Giovedì pomeriggio: 15:00 - 19:00)
    { docSlug: 'raffaella-poppiti', roomSlug: 'studio-4', weekday: 4, start: '15:00:00', end: '19:00:00' },
    // Anna Maria Stillo - Cardiologia (opzione Giovedì pomeriggio: 15:00 - 19:00 se presente in calendario 1)
    // Jessica De Ceglie - Nutrizione - Sala Filtro (Giovedì pomeriggio: 15:00 - 19:00)
    { docSlug: 'jessica-de-ceglie', roomSlug: 'sala-filtro', weekday: 4, start: '15:00:00', end: '19:00:00' },

    // Venerdì (5)
    // Elisa Russo - Odontoiatria - Studio 1 (Venerdì mattina: 09:00 - 13:00)
    { docSlug: 'elisa-russo', roomSlug: 'studio-1', weekday: 5, start: '09:00:00', end: '13:00:00' },
    // Patty Scorzelli - Carbossiterapia - Studio 2 (Venerdì tutto il giorno: 09:00 - 13:00 e 15:00 - 19:00)
    { docSlug: 'patty-scorzelli', roomSlug: 'studio-2', weekday: 5, start: '09:00:00', end: '13:00:00' },
    { docSlug: 'patty-scorzelli', roomSlug: 'studio-2', weekday: 5, start: '15:00:00', end: '19:00:00' },
    // Mario Toro - Oculistica - Studio 4 (Venerdì tutto il giorno: 09:00 - 13:00 e 15:00 - 19:00)
    { docSlug: 'mario-toro', roomSlug: 'studio-4', weekday: 5, start: '09:00:00', end: '13:00:00' },
    { docSlug: 'mario-toro', roomSlug: 'studio-4', weekday: 5, start: '15:00:00', end: '19:00:00' }
  ];

  // Disattiviamo vecchie disponibilità e inseriamo quelle conformi
  console.log("🧹 Aggiornamento tabella doctor_availability...");
  await supabase.from('doctor_availability').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');

  const rowsToInsert = [];
  for (const a of availabilities) {
    const docId = doctorMap[a.docSlug];
    const roomId = roomMap[a.roomSlug] || null;
    if (!docId) {
      console.warn(`Attenzione: medico ${a.docSlug} non trovato in mappa.`);
      continue;
    }
    rowsToInsert.push({
      doctor_id: docId,
      room_id: roomId,
      weekday: a.weekday,
      start_time: a.start,
      end_time: a.end,
      slot_minutes: 60, // 30 min visita + 30 min pulizia/sanificazione
      is_active: true
    });
  }

  const { error: insErr } = await supabase.from('doctor_availability').insert(rowsToInsert);
  if (insErr) {
    console.error("❌ Errore inserimento disponibilità:", insErr.message);
  } else {
    console.log(`✅ Inserite con successo ${rowsToInsert.length} fasce orarie conformi con slot_minutes: 60!`);
  }

  console.log("🎉 Sincronizzazione Database completata!");
}

sync().catch(console.error);
