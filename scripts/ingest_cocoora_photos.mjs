import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// 1. Cloudflare R2 Credentials (from .env.local)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "f373473b18636b9e8f351faed67280fd";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "cocoora";
const R2_ENDPOINT = process.env.R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "97425f90759bdef31d828b6ffd69b5bb";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "7b8c806e049e30f9178baa4c37e4817c72629e10e7dd3a55f8360150b8c3c60f";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev";

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const DOWNLOADS_DIR = 'C:/Users/mario/Downloads';
const TEAM_DIR = path.join(DOWNLOADS_DIR, 'COCOORA IMG TEAM');
const STRUTTURA_DIR = path.join(DOWNLOADS_DIR, 'Foto Cocoora struttura');

const PUBLIC_DOCTORS_DIR = path.resolve('public/images/doctors');

// Mapping of downloaded team photos to canonical doctor slugs
const TEAM_PHOTO_MAPPING = {
  'Elisa.jpg': {
    slug: 'elisa-russo',
    name: 'Dott.ssa Elisa Russo',
    role: 'Direttrice Sanitaria · Ortognatodonzia e Odontoiatria Pediatrica',
  },
  'Anna-Maria.jpg': {
    slug: 'anna-maria-stillo',
    name: 'Dott.ssa Anna Maria Stillo',
    role: 'Specialista in Cardiologia ed Ecografia Cardiaca',
  },
  'Giuseppe.jpg': {
    slug: 'giuseppe-buono',
    name: 'Dr. Giuseppe Buono',
    role: 'Specialista in Diagnostica per Immagini ed Ecografia Clinica',
  },
  'Jessica.jpg': {
    slug: 'jessica-de-ceglie',
    name: 'Dott.ssa Jessica De Ceglie',
    role: 'Biologa Nutrizionista Specialista in Educazione Alimentare',
  },
  'Concetta.jpg': {
    slug: 'titti-errico',
    altSlug: 'concetta-errico',
    name: 'Dott.ssa Concetta (Titti) Errico',
    role: 'Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica',
  },
  'Alessandra.jpg': {
    slug: 'alessandra-riccardi',
    name: 'Dott.ssa Alessandra Riccardi',
    role: 'Medico Estetico e Rigenerativo',
  },
  'Mirella.jpg': {
    slug: 'mirella-dandrea',
    altSlug: 'mirella',
    name: "Dott.ssa Mirella D'Andrea",
    role: 'Specialista in Dermatologia e Oncologia Cutanea',
  },
};

// All 18 doctors from src/lib/doctors.ts with gender specification
const DOCTORS_ROSTER = [
  { slug: 'elisa-russo', gender: 'F', name: 'Dott.ssa Elisa Russo', hasPhoto: true },
  { slug: 'raffaele-dalessio', gender: 'M', name: "Dr. Raffaele D'Alessio", hasPhoto: false },
  { slug: 'alessandra-riccardi', gender: 'F', name: 'Dott.ssa Alessandra Riccardi', hasPhoto: true },
  { slug: 'francesco-dandrea', gender: 'M', name: "Prof. Dr. Francesco D'Andrea", hasPhoto: false },
  { slug: 'titti-errico', gender: 'F', name: 'Dott.ssa Titti Errico', hasPhoto: true },
  { slug: 'patty-scorzelli', gender: 'F', name: 'Dott.ssa Patty Scorzelli', hasPhoto: false },
  { slug: 'anna-maria-stillo', gender: 'F', name: 'Dott.ssa Anna Maria Stillo', hasPhoto: true },
  { slug: 'giuseppe-buono', gender: 'M', name: 'Dr. Giuseppe Buono', hasPhoto: true },
  { slug: 'mario-toro', gender: 'M', name: 'Dr. Mario Toro', hasPhoto: false },
  { slug: 'alessandra-totaro', gender: 'F', name: 'Dott.ssa Alessandra Totaro', hasPhoto: false },
  { slug: 'maria-grazia-polverino', gender: 'F', name: 'Dott.ssa Maria Grazia Polverino', hasPhoto: false },
  { slug: 'jessica-de-ceglie', gender: 'F', name: 'Dott.ssa Jessica De Ceglie', hasPhoto: true },
  { slug: 'martina-pontillo', gender: 'F', name: 'Dott.ssa Martina Pontillo', hasPhoto: false },
  { slug: 'vittorio-riccio', gender: 'M', name: 'Dr. Vittorio Riccio', hasPhoto: false },
  { slug: 'rocco-spera', gender: 'M', name: 'Dr. Rocco Spera', hasPhoto: false },
  { slug: 'filippo-iaccarino', gender: 'M', name: 'Dr. Filippo Iaccarino', hasPhoto: false },
];

async function uploadBufferToR2(buffer, key, contentType = 'image/jpeg') {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  await s3.send(command);
  return { key, size: buffer.length };
}

async function main() {
  console.log('==================================================================');
  console.log('🚀 INGESTIONE FOTO STRUTTURA & ÉQUIPE MEDICA — COCOORA');
  console.log(`• Bucket R2: ${R2_BUCKET_NAME}`);
  console.log(`• Endpoint: ${R2_ENDPOINT}`);
  console.log(`• URL Pubblico R2: ${R2_PUBLIC_URL}`);
  console.log('==================================================================\n');

  if (!fs.existsSync(PUBLIC_DOCTORS_DIR)) {
    fs.mkdirSync(PUBLIC_DOCTORS_DIR, { recursive: true });
  }

  // -------------------------------------------------------------
  // FASE 1: SINCRONIZZAZIONE LOCALE MEDICI (Foto Reali + Placeholder)
  // -------------------------------------------------------------
  console.log('📋 FASE 1: Preparazione foto mediche in public/images/doctors/ ...');

  const malePlaceholderBuffer = fs.readFileSync(path.join(PUBLIC_DOCTORS_DIR, 'doctor-placeholder-male.jpg'));
  const femalePlaceholderBuffer = fs.readFileSync(path.join(PUBLIC_DOCTORS_DIR, 'doctor-placeholder-female.jpg'));

  // 1a. Copia e rinomina delle foto reali
  for (const [filename, info] of Object.entries(TEAM_PHOTO_MAPPING)) {
    const srcPath = path.join(TEAM_DIR, filename);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(PUBLIC_DOCTORS_DIR, `${info.slug}.jpg`);
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ Foto reale assegnata: ${filename} ➔ ${info.slug}.jpg (${info.name})`);

      if (info.altSlug) {
        const altDestPath = path.join(PUBLIC_DOCTORS_DIR, `${info.altSlug}.jpg`);
        fs.copyFileSync(srcPath, altDestPath);
      }
    } else {
      console.warn(`  ⚠️ File non trovato in Downloads: ${srcPath}`);
    }
  }

  // 1b. Assegnazione placeholder di genere per i medici senza foto
  let maleCount = 0;
  let femaleCount = 0;
  for (const doc of DOCTORS_ROSTER) {
    if (!doc.hasPhoto) {
      const destPath = path.join(PUBLIC_DOCTORS_DIR, `${doc.slug}.jpg`);
      if (doc.gender === 'M') {
        fs.copyFileSync(path.join(PUBLIC_DOCTORS_DIR, 'doctor-placeholder-male.jpg'), destPath);
        maleCount++;
        console.log(`  👤 Placeholder MASCHIO assegnato: ${doc.slug}.jpg (${doc.name})`);
      } else {
        fs.copyFileSync(path.join(PUBLIC_DOCTORS_DIR, 'doctor-placeholder-female.jpg'), destPath);
        femaleCount++;
        console.log(`  👤 Placeholder FEMMINA assegnata: ${doc.slug}.jpg (${doc.name})`);
      }
    }
  }

  console.log(`\n✨ Medici configurati localmente: 6 con foto ufficiale, ${maleCount + femaleCount} con placeholder di genere (${femaleCount} femmine, ${maleCount} maschi).`);

  // -------------------------------------------------------------
  // FASE 2: UPLOAD CLOUDFLARE R2
  // -------------------------------------------------------------
  console.log('\n==================================================================');
  console.log('☁️ FASE 2: Upload Cloudflare R2 (Struttura + Medici + Placeholder)');
  console.log('==================================================================');

  const uploadQueue = [];

  // 2a. Foto Struttura (nomi originali intatti, nessun rename SEO per ora)
  if (fs.existsSync(STRUTTURA_DIR)) {
    const strutturaFiles = fs.readdirSync(STRUTTURA_DIR).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png'));
    console.log(`\n🏢 Trovate ${strutturaFiles.length} foto della struttura in "Foto Cocoora struttura":`);
    for (const f of strutturaFiles) {
      const fullPath = path.join(STRUTTURA_DIR, f);
      const buffer = fs.readFileSync(fullPath);
      uploadQueue.push({
        buffer,
        key: `images/struttura/${f}`,
        desc: `Foto Struttura (images/struttura/${f})`,
      });
      uploadQueue.push({
        buffer,
        key: `struttura/${f}`,
        desc: `Foto Struttura Alias (struttura/${f})`,
      });
    }
  } else {
    console.warn(`⚠️ Cartella struttura non trovata: ${STRUTTURA_DIR}`);
  }

  // 2b. Foto Medici Ufficiali ed Alias
  for (const [filename, info] of Object.entries(TEAM_PHOTO_MAPPING)) {
    const fullPath = path.join(TEAM_DIR, filename);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      // Chiave primaria con slug
      uploadQueue.push({
        buffer,
        key: `images/doctors/${info.slug}.jpg`,
        desc: `Medico Ufficiale: ${info.name} (images/doctors/${info.slug}.jpg)`,
      });
      // Chiave grezza originale per storico
      uploadQueue.push({
        buffer,
        key: `images/doctors/raw/${filename}`,
        desc: `Medico Grezzo Originale: images/doctors/raw/${filename}`,
      });
      if (info.altSlug) {
        uploadQueue.push({
          buffer,
          key: `images/doctors/${info.altSlug}.jpg`,
          desc: `Medico Alias: images/doctors/${info.altSlug}.jpg`,
        });
      }
    }
  }

  // 2c. Placeholder Canonici
  uploadQueue.push({
    buffer: malePlaceholderBuffer,
    key: `images/doctors/doctor-placeholder-male.jpg`,
    desc: `Placeholder Maschile Canonico (images/doctors/doctor-placeholder-male.jpg)`,
  });
  uploadQueue.push({
    buffer: femalePlaceholderBuffer,
    key: `images/doctors/doctor-placeholder-female.jpg`,
    desc: `Placeholder Femminile Canonico (images/doctors/doctor-placeholder-female.jpg)`,
  });

  // 2d. Placeholder per tutti i medici senza foto
  for (const doc of DOCTORS_ROSTER) {
    if (!doc.hasPhoto) {
      const buffer = doc.gender === 'M' ? malePlaceholderBuffer : femalePlaceholderBuffer;
      uploadQueue.push({
        buffer,
        key: `images/doctors/${doc.slug}.jpg`,
        desc: `Placeholder Medico (${doc.gender}): ${doc.name} (images/doctors/${doc.slug}.jpg)`,
      });
    }
  }

  console.log(`📦 Totale file ed asset da caricare su Cloudflare R2: ${uploadQueue.length}`);

  let uploadedCount = 0;
  let totalBytes = 0;
  const concurrency = 6;
  const errors = [];

  for (let i = 0; i < uploadQueue.length; i += concurrency) {
    const batch = uploadQueue.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async item => {
        try {
          await uploadBufferToR2(item.buffer, item.key);
          uploadedCount++;
          totalBytes += item.buffer.length;
          const mb = (item.buffer.length / (1024 * 1024)).toFixed(2);
          console.log(`[${uploadedCount}/${uploadQueue.length}] ✓ ${item.key} (${mb} MB)`);
        } catch (err) {
          console.error(`❌ Errore caricamento ${item.key}:`, err.message);
          errors.push({ key: item.key, error: err.message });
        }
      })
    );
  }

  console.log('\n==================================================================');
  console.log('🎉 SINCRONIZZAZIONE R2 COMPLETATA CON SUCCESSO!');
  console.log(`• Totale oggetti caricati su R2: ${uploadedCount}/${uploadQueue.length}`);
  console.log(`• Volume complessivo trasferito: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  if (errors.length > 0) {
    console.error(`⚠️ Si sono verificati ${errors.length} errori.`);
  } else {
    console.log('✨ 100% dei file online su Cloudflare R2 senza errori.');
    console.log('\nEsempi URL pubblici Cloudflare R2:');
    console.log(`• Struttura (FOTO-1): ${R2_PUBLIC_URL}/images/struttura/FOTO-1.jpg`);
    console.log(`• Direttrice Sanitaria: ${R2_PUBLIC_URL}/images/doctors/elisa-russo.jpg`);
    console.log(`• Cardiologia (Dott.ssa Stillo): ${R2_PUBLIC_URL}/images/doctors/anna-maria-stillo.jpg`);
    console.log(`• Placeholder Maschile: ${R2_PUBLIC_URL}/images/doctors/doctor-placeholder-male.jpg`);
    console.log(`• Placeholder Femminile: ${R2_PUBLIC_URL}/images/doctors/doctor-placeholder-female.jpg`);
  }
  console.log('==================================================================');
}

main().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
