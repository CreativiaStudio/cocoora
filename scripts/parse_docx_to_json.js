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
    heroCta: 'Richiedi una valutazione',
    whatIs: { title: '', description: '', paragraphs: [] },
    problemsTitle: 'Cosa vorresti migliorare?',
    problemsGrid: [],
    timelineTitle: 'Il percorso clinico passo dopo passo',
    timelineSteps: [],
    results: { title: '', description: '', paragraphs: [] },
    faq: [],
    localSeo: { title: '', description: '', cta: 'Richiedi una valutazione' }
  };

  let currentSection = '';
  let lastFaqQ = '';

  for (let i = 0; i < paras.length; i++) {
    const line = paras[i].text;

    // 1. Metadati SEO iniziali
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

    // 2. H1 e Tagline
    if (/^H1\s*[\·\:-]\s*/i.test(line) || (!result.title && paras[i].isHeading && !line.startsWith('H2') && !line.startsWith('H3') && !line.startsWith('Meta') && !line.startsWith('Keyword'))) {
      result.title = cleanText(line.replace(/^H1\s*[\·\:-]\s*/i, ''));
      // il paragrafo successivo è di solito la tagline
      if (i + 1 < paras.length && !paras[i + 1].text.startsWith('CTA') && !paras[i + 1].text.startsWith('H2')) {
        result.tagline = paras[i + 1].text;
      }
      continue;
    }

    // 3. CTA
    if (/^CTA\s*[\|:\-]\s*/i.test(line)) {
      const ctaVal = cleanText(line.replace(/^CTA\s*[\|:\-]\s*/i, ''));
      if (ctaVal) result.heroCta = ctaVal;
      continue;
    }

    // 4. Sezioni H2
    if (/^H2\s*[\·\:-]\s*/i.test(line)) {
      const h2Title = cleanText(line.replace(/^H2\s*[\·\:-]\s*/i, ''));
      if (/Che cos[’']è/i.test(h2Title) || /come funziona/i.test(h2Title) || /in cosa consiste/i.test(h2Title)) {
        currentSection = 'whatIs';
        result.whatIs.title = h2Title;
      } else if (/a cosa serve/i.test(h2Title) || /indicazioni/i.test(h2Title) || /quando è indicat/i.test(h2Title) || /obiettivi/i.test(h2Title)) {
        currentSection = 'problems';
        result.problemsTitle = h2Title;
      } else if (/passo dopo passo/i.test(h2Title) || /percorso clinico/i.test(h2Title) || /come si svolge/i.test(h2Title) || /fasi/i.test(h2Title)) {
        currentSection = 'timeline';
        result.timelineTitle = h2Title;
      } else if (/risultati/i.test(h2Title) || /cosa aspettarsi/i.test(h2Title) || /benefici/i.test(h2Title)) {
        currentSection = 'results';
        result.results.title = h2Title;
      } else if (/domande frequenti/i.test(h2Title) || /faq/i.test(h2Title)) {
        currentSection = 'faq';
      } else if (/a Napoli/i.test(h2Title)) {
        currentSection = 'localSeo';
        result.localSeo.title = h2Title;
      } else {
        // default fallback to whatIs se prima o results se dopo
        currentSection = result.whatIs.paragraphs.length < 2 ? 'whatIs' : 'results';
      }
      continue;
    }

    // 5. Sottosezioni H3 (es. Step timeline, card problemi o FAQ)
    if (/^H3\s*[\·\:-]\s*/i.test(line)) {
      const h3Title = cleanText(line.replace(/^H3\s*[\·\:-]\s*/i, ''));
      if (h3Title.endsWith('?')) {
        // È chiaramente una FAQ
        currentSection = 'faq';
        lastFaqQ = h3Title;
      } else if (currentSection === 'problems') {
        result.problemsGrid.push({ title: h3Title, description: '' });
      } else if (currentSection === 'timeline') {
        result.timelineSteps.push({ title: h3Title, description: '' });
      } else {
        // Se c'è un punto interrogativo o sembra domanda
        if (h3Title.includes('?')) {
          currentSection = 'faq';
          lastFaqQ = h3Title;
        } else {
          result.problemsGrid.push({ title: h3Title, description: '' });
        }
      }
      continue;
    }

    // 6. Assegnazione paragrafi in base alla sezione attiva
    if (line === result.tagline) continue;
    if (line.startsWith('VISO E') || line.startsWith('CORPO E') || line.startsWith('LASER E') || line.startsWith('ORTODONZIA') || line.startsWith('SALUTE E') || line.startsWith('CURA E') || line.startsWith('BENESSERE') || line.startsWith('DIAGNOSTICA') || line.startsWith('SPECIALISTICHE')) {
      result.eyebrow = line;
      continue;
    }

    if (currentSection === 'whatIs') {
      result.whatIs.paragraphs.push(line);
      if (!result.whatIs.description) result.whatIs.description = line;
    } else if (currentSection === 'problems') {
      if (result.problemsGrid.length > 0 && !result.problemsGrid[result.problemsGrid.length - 1].description) {
        result.problemsGrid[result.problemsGrid.length - 1].description = line;
      } else {
        result.problemsGrid.push({ title: line.split(/[:\.]/)[0], description: line });
      }
    } else if (currentSection === 'timeline') {
      if (result.timelineSteps.length > 0 && !result.timelineSteps[result.timelineSteps.length - 1].description) {
        result.timelineSteps[result.timelineSteps.length - 1].description = line;
      } else {
        result.timelineSteps.push({ title: `Fase ${result.timelineSteps.length + 1}`, description: line });
      }
    } else if (currentSection === 'results') {
      result.results.paragraphs.push(line);
      if (!result.results.description) result.results.description = line;
    } else if (currentSection === 'faq') {
      if (lastFaqQ) {
        result.faq.push({ q: lastFaqQ, a: line });
        lastFaqQ = '';
      }
    } else if (currentSection === 'localSeo') {
      result.localSeo.description = (result.localSeo.description ? result.localSeo.description + ' ' : '') + line;
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
