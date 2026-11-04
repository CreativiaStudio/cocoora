import fs from "node:fs";
import path from "node:path";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

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

const MIME_MAP = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

async function uploadFile(localPath, key) {
  const ext = path.extname(localPath).toLowerCase();
  const contentType = MIME_MAP[ext] || "application/octet-stream";
  const fileBuffer = fs.readFileSync(localPath);

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await s3.send(command);
  return { key, size: fileBuffer.length, contentType };
}

async function main() {
  console.log("==================================================");
  console.log("🚀 CLOUDFLARE R2 BULK UPLOAD — COCOORA");
  console.log(`• Bucket: ${R2_BUCKET_NAME}`);
  console.log(`• Endpoint: ${R2_ENDPOINT}`);
  console.log(`• Public URL: ${R2_PUBLIC_URL}`);
  console.log("==================================================");

  const publicDir = path.resolve("public");
  const targets = ["videos", "images"];
  const allFilesToUpload = [];

  for (const t of targets) {
    const targetDir = path.join(publicDir, t);
    const files = getAllFiles(targetDir);
    for (const f of files) {
      const relPath = path.relative(publicDir, f).replace(/\\/g, "/");
      allFilesToUpload.push({ local: f, key: relPath });
    }
  }

  console.log(`📦 Trovati ${allFilesToUpload.length} file da sincronizzare su R2...`);

  let uploadedCount = 0;
  let totalBytes = 0;
  const concurrency = 6;
  const errors = [];

  for (let i = 0; i < allFilesToUpload.length; i += concurrency) {
    const batch = allFilesToUpload.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async ({ local, key }) => {
        try {
          const res = await uploadFile(local, key);
          uploadedCount++;
          totalBytes += res.size;
          const mb = (res.size / (1024 * 1024)).toFixed(2);
          console.log(`[${uploadedCount}/${allFilesToUpload.length}] ✓ ${key} (${mb} MB - ${res.contentType})`);
        } catch (err) {
          console.error(`❌ Errore caricamento ${key}:`, err.message);
          errors.push({ key, error: err.message });
        }
      })
    );
  }

  console.log("\n==================================================");
  console.log(`🎉 UPLOAD COMPLETATO CON SUCCESSO!`);
  console.log(`• Totale file caricati: ${uploadedCount}/${allFilesToUpload.length}`);
  console.log(`• Volume totale: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  if (errors.length > 0) {
    console.log(`⚠️ Errori riscontrati: ${errors.length}`);
  } else {
    console.log(`✨ Zero errori! Tutti i file sono online su Cloudflare R2.`);
    console.log(`\nEsempio URL pubblico Video Desktop:`);
    console.log(`${R2_PUBLIC_URL}/videos/hero-desktop.mp4`);
    console.log(`Esempio URL pubblico Video Mobile:`);
    console.log(`${R2_PUBLIC_URL}/videos/hero-mobile.mp4`);
  }
  console.log("==================================================");
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
