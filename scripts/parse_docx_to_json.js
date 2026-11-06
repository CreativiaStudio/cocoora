const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_DIR = path.resolve('scratch/documents');
const OUT_DIR = path.resolve('scratch/parsed_data');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

function parseXmlToParagraphs(xml) {
  const paragraphs = [];
  // match each w:p
  const pRegex = /<w:p\b[^>]*>(.*?)<\/w:p>/gs;
  let pMatch;
  while ((pMatch = pRegex.exec(xml)) !== null) {
    const pContent = pMatch[1];
    // extract all w:t
    const tRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/gs;
    let tMatch;
    let pText = '';
    while ((tMatch = tRegex.exec(pContent)) !== null) {
      pText += tMatch[1];
    }
    const cleaned = cleanText(pText);
    if (cleaned) {
      // detect style or heading if any
      const isHeading = pContent.includes('Heading') || pContent.includes('Title');
      paragraphs.push({ text: cleaned, isHeading });
    }
  }
  return paragraphs;
}

function parseDocument(docPath) {
  const filename = path.basename(docPath, '.docx');
  const xml = execSync(`powershell -ExecutionPolicy Bypass -File scratch/read_docx.ps1 -docxPath "${docPath}"`, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });

  const paras = parseXmlToParagraphs(xml);
  const result = {
    sourceFile: filename,
    keywordMain: '',
    keywordSec: '',
    metaTitle: '',
    metaDescription: '',
    eyebrow: '',
    title: '',
    tagline: '',
    heroCta: 'Iscriviti gratuitamente al Cocoora Club',
    whatIs: { title: '', description: '', paragraphs: [] },
    problemsTitle: '',
    problemsSubtitle: '',
    problemsGrid: [],
    timelineTitle: '',
    timelineSteps: [],
    results: { title: '', description: '', paragraphs: [] },
    leadForm: { title: '', subtitle: '', cta: 'Richiedi ora' },
    faq: [],
    localSeo: { title: '', description: '', paragraphs: [], cta: 'Iscriviti gratuitamente al Cocoora Club' }
  };

  let currentSection = '';
  let lastFaqQ = '';

  const categoryPrefixes = ['VISO E', 'CORPO E', 'LASER E', 'PERCORSI', 'ORTODONZIA', 'SALUTE E', 'CURA E', 'BENESSERE', 'DIAGNOSTICA', 'SPECIALISTICHE'];
  const normalizedFilename = filename.replace(/^(odontoiatria|visite|medicina)_/, '').replace(/-/g, ' ').toUpperCase();

  for (let i = 0; i < paras.length; i++) {
    const line = paras[i].text;

    // 1. Blocco immediato Note Redazionali: scarta tutte le note interne di fine documento
    if (/NOTE E FONTI\s*[-–—]?\s*NON PUBBLICARE/i.test(line) || /NON PUBBLICARE COME TESTO DELLA PAGINA/i.test(line)) {
      break;
    }

    // 2. Metadati SEO iniziali
    if (/^Keyword principale(?:\s*proposta)?\s*[:\.]/i.test(line)) {
      result.keywordMain = cleanText(line.replace(/^Keyword principale(?:\s*proposta)?\s*[:\.]/i, ''));
      continue;
    }
    if (/^Keyword secondarie(?:\s*proposte)?\s*[:\.]/i.test(line)) {
      result.keywordSec = cleanText(line.replace(/^Keyword secondarie(?:\s*proposte)?\s*[:\.]/i, ''));
      continue;
    }
    if (/^Meta title\s*[:\.]/i.test(line)) {
      result.metaTitle = cleanText(line.replace(/^Meta title\s*[:\.]/i, ''));
      continue;
    }
    if (/^Meta description\s*[:\.]/i.test(line)) {
      result.metaDescription = cleanText(line.replace(/^Meta description\s*[:\.]/i, ''));
      continue;
    }

    // 3. H1 riconosciuto esclusivamente dal prefisso esplicito (ignora [Title] maiuscoli)
    if (/^H1\s*[\·\:\-–—]\s*/i.test(line)) {
      result.title = cleanText(line.replace(/^H1\s*[\·\:\-–—]\s*/i, ''));
      // il paragrafo successivo è di solito la tagline
      if (i + 1 < paras.length && !paras[i + 1].text.startsWith('CTA') && !paras[i + 1].text.startsWith('H2')) {
        result.tagline = paras[i + 1].text;
      }
      continue;
    }

    // 4. CTA
    if (/^CTA\s*[\|:\-–—]\s*/i.test(line)) {
      const ctaVal = cleanText(line.replace(/^CTA\s*[\|:\-–—]\s*/i, ''));
      if (currentSection === 'leadForm') {
        result.leadForm.cta = /richiedi ora/i.test(ctaVal) ? 'Richiedi ora' : 'Iscriviti gratuitamente al Cocoora Club';
      } else {
        result.heroCta = 'Iscriviti gratuitamente al Cocoora Club';
      }
      continue;
    }

    // 5. Sezioni H2
    if (/^H2\s*[\·\:\-–—]\s*/i.test(line)) {
      const h2Title = cleanText(line.replace(/^H2\s*[\·\:\-–—]\s*/i, ''));
      if (/NOTE E FONTI|NON PUBBLICARE/i.test(h2Title)) {
        break;
      }
      if (/che cos[’']è|come funziona|in cosa consiste/i.test(h2Title)) {
        currentSection = 'whatIs';
        result.whatIs.title = h2Title;
      } else if (/a cosa serv(?:e|ono)|quando (?:è|può essere) (?:utile|indicat)|quando può servire|quando rivolgersi|per quali esigenze|indicazioni|obiettivi/i.test(h2Title)) {
        currentSection = 'problems';
        result.problemsTitle = h2Title;
      } else if (/passo dopo passo|percorso clinico|come si svolge|fasi/i.test(h2Title)) {
        currentSection = 'timeline';
        result.timelineTitle = h2Title;
      } else if (/domande frequenti|\bfaq\b/i.test(h2Title)) {
        currentSection = 'faq';
      } else if (/a Napoli\??$/i.test(h2Title)) {
        currentSection = 'localSeo';
        result.localSeo.title = h2Title;
      } else if (/risultati|cosa aspettarsi|quali informazioni|benefici/i.test(h2Title) && !result.results.title) {
        currentSection = 'results';
        result.results.title = h2Title;
      } else {
        // Blocco 6: form contatti / lead
        currentSection = 'leadForm';
        result.leadForm.title = h2Title;
      }
      continue;
    }

    // 6. Sottosezioni H3 (card problemi, step timeline, FAQ)
    if (/^H3\s*[\·\:\-–—]\s*/i.test(line)) {
      const h3Title = cleanText(line.replace(/^H3\s*[\·\:\-–—]\s*/i, ''));
      if (currentSection === 'problems') {
        result.problemsGrid.push({ title: h3Title, description: '' });
      } else if (currentSection === 'timeline') {
        const stepTitle = cleanText(h3Title.replace(/^0?\d+\s*[\.\·\-–—:]\s*/, ''));
        result.timelineSteps.push({ title: stepTitle || h3Title, description: '' });
      } else if (currentSection === 'faq' || h3Title.endsWith('?')) {
        currentSection = 'faq';
        lastFaqQ = h3Title;
      }
      continue;
    }

    // 7. Eyebrow pre-H1 (solo righe tutto maiuscolo o categorie di menu)
    if (!currentSection && line !== result.tagline && !result.title) {
      const isAllUpper = line === line.toUpperCase() && /[A-ZÀ-ÖØ-Þ]/.test(line);
      const isCategory = categoryPrefixes.some(prefix => line.toUpperCase().startsWith(prefix));
      if (isAllUpper || isCategory) {
        if (line.toUpperCase() !== normalizedFilename) {
          result.eyebrow = line;
        }
        continue;
      }
    }

    // 8. Assegnazione paragrafi in base alla sezione attiva
    if (currentSection === 'whatIs') {
      result.whatIs.paragraphs.push(line);
      result.whatIs.description = result.whatIs.paragraphs.join('\n\n');
    } else if (currentSection === 'problems') {
      if (result.problemsGrid.length === 0) {
        result.problemsSubtitle = result.problemsSubtitle ? result.problemsSubtitle + ' ' + line : line;
      } else {
        const last = result.problemsGrid[result.problemsGrid.length - 1];
        last.description = last.description ? last.description + ' ' + line : line;
      }
    } else if (currentSection === 'timeline') {
      if (result.timelineSteps.length > 0) {
        const last = result.timelineSteps[result.timelineSteps.length - 1];
        last.description = last.description ? last.description + '\n\n' + line : line;
      }
    } else if (currentSection === 'results') {
      result.results.paragraphs.push(line);
      result.results.description = result.results.paragraphs.join('\n\n');
    } else if (currentSection === 'leadForm') {
      result.leadForm.subtitle = result.leadForm.subtitle ? result.leadForm.subtitle + ' ' + line : line;
    } else if (currentSection === 'faq') {
      if (lastFaqQ) {
        result.faq.push({ q: lastFaqQ, a: line });
        lastFaqQ = '';
      } else if (result.faq.length > 0) {
        const last = result.faq[result.faq.length - 1];
        last.a = last.a ? last.a + ' ' + line : line;
      }
    } else if (currentSection === 'localSeo') {
      result.localSeo.paragraphs.push(line);
      result.localSeo.description = result.localSeo.paragraphs.join('\n\n');
    }
  }

  // Fallbacks minimi di sicurezza
  if (!result.title) result.title = filename.replace(/^(odontoiatria|visite|medicina)_/, '').replace(/-/g, ' ');
  if (!result.tagline && result.whatIs.description) result.tagline = result.whatIs.description.slice(0, 150) + '...';
  if (!result.whatIs.description) result.whatIs.description = result.tagline;

  return result;
}

const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.docx'));
console.log(`Trovati ${files.length} file .docx da analizzare.`);

const allParsed = {};
for (const f of files) {
  try {
    const data = parseDocument(path.join(DOCS_DIR, f));
    allParsed[f] = data;
    console.log(`✅ Parsato con successo: ${f} -> Titolo: "${data.title}" | FAQ: ${data.faq.length} | Step: ${data.timelineSteps.length}`);
  } catch (err) {
    console.error(`❌ Errore nel parsing di ${f}:`, err.message);
  }
}

fs.writeFileSync(path.join(OUT_DIR, 'all_parsed_treatments.json'), JSON.stringify(allParsed, null, 2), 'utf8');
console.log(`\n🎉 Salvati ${Object.keys(allParsed).length} trattamenti analizzati in scratch/parsed_data/all_parsed_treatments.json`);
