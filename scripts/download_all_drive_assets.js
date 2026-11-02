const fs = require('fs');
const path = require('path');
const https = require('https');

const survey = JSON.parse(fs.readFileSync('scratch/full_drive_survey.json', 'utf8'));

// Directories
const DIRS = {
  docs: path.resolve('scratch/documents'),
  medicinaImg: path.resolve('public/images/trattamenti/medicina-estetica'),
  odontoiatriaImg: path.resolve('public/images/trattamenti/odontoiatria'),
  visiteImg: path.resolve('public/images/visite')
};

for (const d of Object.values(DIRS)) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function downloadDriveFile(id, isDoc, destPath) {
  return new Promise((resolve, reject) => {
    let url = isDoc
      ? `https://docs.google.com/document/d/${id}/export?format=docx`
      : `https://drive.usercontent.google.com/download?id=${id}&export=download`;

    function doRequest(reqUrl, redirects = 0) {
      if (redirects > 5) return reject(new Error('Troppi redirect per ' + id));
      https.get(reqUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let loc = res.headers.location;
          if (loc.startsWith('/')) loc = 'https://docs.google.com' + loc;
          return doRequest(loc, redirects + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Status ${res.statusCode} per ${id}`));
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      }).on('error', reject);
    }

    doRequest(url);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Inizio download asset da Google Drive...');
  const queue = [];

  // 1. Odontoiatria
  for (const item of survey.ortodonzia) {
    const slug = slugify(item.name);
    for (const f of item.files) {
      const isDoc = f.mime.includes('document') || f.name.endsWith('.docx') || (!f.name.includes('.') && !f.mime.includes('image'));
      if (isDoc) {
        queue.push({
          id: f.id,
          isDoc: true,
          name: f.name,
          dest: path.join(DIRS.docs, `odontoiatria_${slug}.docx`),
          category: 'odontoiatria',
          slug
        });
      } else if (f.mime.includes('image') || f.name.match(/\.(jpg|jpeg|png)$/i)) {
        let filename = f.name;
        if (!filename.includes('.')) filename += '.jpg';
        queue.push({
          id: f.id,
          isDoc: false,
          name: filename,
          dest: path.join(DIRS.odontoiatriaImg, filename),
          category: 'odontoiatria',
          slug
        });
      }
    }
  }

  // 2. Visite Specialistiche
  for (const item of survey.visite) {
    const slug = slugify(item.name);
    for (const f of item.files) {
      const isDoc = f.mime.includes('document') || f.name.endsWith('.docx') || (!f.name.includes('.') && !f.mime.includes('image'));
      if (isDoc) {
        queue.push({
          id: f.id,
          isDoc: true,
          name: f.name,
          dest: path.join(DIRS.docs, `visite_${slug}.docx`),
          category: 'visite',
          slug
        });
      } else if (f.mime.includes('image') || f.name.match(/\.(jpg|jpeg|png)$/i)) {
        let filename = f.name;
        if (!filename.includes('.')) filename += '.jpg';
        queue.push({
          id: f.id,
          isDoc: false,
          name: filename,
          dest: path.join(DIRS.visiteImg, filename),
          category: 'visite',
          slug
        });
      }
    }
  }

  // 3. Medicina Estetica (solo docx per verifica testi, e immagini se mancanti)
  for (const item of survey.medicina) {
    const slug = slugify(item.name);
    for (const f of item.files) {
      const isDoc = f.mime.includes('document') || f.name.endsWith('.docx');
      if (isDoc) {
        queue.push({
          id: f.id,
          isDoc: true,
          name: f.name,
          dest: path.join(DIRS.docs, `medicina_${slug}.docx`),
          category: 'medicina',
          slug
        });
      } else if (f.mime.includes('image') || f.name.match(/\.(jpg|jpeg|png)$/i)) {
        let filename = f.name;
        if (!filename.includes('.')) filename += '.jpg';
        queue.push({
          id: f.id,
          isDoc: false,
          name: filename,
          dest: path.join(DIRS.medicinaImg, filename),
          category: 'medicina',
          slug
        });
      }
    }
  }

  console.log(`Totale elementi in coda di download: ${queue.length}`);
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    if (fs.existsSync(item.dest) && fs.statSync(item.dest).size > 1000) {
      // già scaricato e valido
      successCount++;
      continue;
    }
    try {
      await downloadDriveFile(item.id, item.isDoc, item.dest);
      const size = fs.statSync(item.dest).size;
      console.log(`[${i + 1}/${queue.length}] ✅ Scaricato: ${path.basename(item.dest)} (${Math.round(size / 1024)} KB)`);
      successCount++;
      await delay(120); // gentilezza rate limit
    } catch (err) {
      console.error(`[${i + 1}/${queue.length}] ❌ Errore su ${item.name} (${item.id}):`, err.message);
      errorCount++;
    }
  }

  console.log(`\n🏁 Download completato: ${successCount} riusciti, ${errorCount} falliti.`);

  // Fix nomi file Medicina Estetica con refusi o discrepanze
  fixMedicinaAliases();
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function fixMedicinaAliases() {
  const pairs = [
    { src: 'botox-napoli-1.jpg', dst: 'tossina-botulinica-napoli-1.jpg' },
    { src: 'botox-napoli-2.jpg', dst: 'tossina-botulinica-napoli-2.jpg' },
    { src: 'botox-napoli-3.jpg', dst: 'tossina-botulinica-napoli-3.jpg' },
    { src: 'bistimolazione-napoli-1.jpg', dst: 'biostimolazione-napoli-1.jpg' },
    { src: 'peeling-medicale-napoli-1.jpg', dst: 'peeling-chimico-napoli-1.jpg' },
    { src: 'peeling-medicale-napoli-2.jpg', dst: 'peeling-chimico-napoli-2.jpg' },
    { src: 'peeling-mendicale-napoli-3.jpg', dst: 'peeling-chimico-napoli-3.jpg' },
    { src: 'cfu-napoli-1.jpg', dst: 'ultrasuoni-cfu-napoli-1.jpg' },
    { src: 'cfu-napoli-2.jpg', dst: 'ultrasuoni-cfu-napoli-2.jpg' },
    { src: 'cfu-napoli-3.jpg', dst: 'ultrasuoni-cfu-napoli-3.jpg' },
  ];

  for (const { src, dst } of pairs) {
    const srcPath = path.join(DIRS.medicinaImg, src);
    const dstPath = path.join(DIRS.medicinaImg, dst);
    if (fs.existsSync(srcPath) && !fs.existsSync(dstPath)) {
      fs.copyFileSync(srcPath, dstPath);
      console.log(`🔄 Copiato alias immagine: ${src} -> ${dst}`);
    }
  }
}

run();
