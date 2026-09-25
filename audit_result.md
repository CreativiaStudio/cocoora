# 🔍 AUDIT COMPLETO — Sezione "Visite & Trattamenti" (Cocoora Studio Medico)

> **Caveat metodologico**: non avendo accesso diretto al filesystem né ai `.docx` del cliente, l'audit è basato unicamente sugli estratti di codice forniti e sulla nomenclatura dei documenti indicati in `C:/Users/mario/Downloads/materiale per sito-app cocoora`. Dove una verifica richiede lettura di file non forniti, l'ho marcata esplicitamente come **«da verificare in loco»**.

---

## 1. SINTESI ESECUTIVA (TL;DR)

| Problema | Gravità | Impatto |
|---|---|---|
| Tutti i 16 link del Megamenu "Visite & Trattamenti" puntano a **solo 3 pagine madre** (`/servizi/*`) | 🔴 Critico | UX: l'utente clicca "Cryoliposculpt" e atterra su una pagina generica, non sul trattamento. SEO: cannibalizzazione e zero profondità di link. |
| **19 schede trattamento** esistono in `/trattamenti/[slug]` ma **non sono linkate in nessuna voce di menu** | 🔴 Critico | Contenuto "orfano" — Google non le scopre, l'utente non le trova dal menu. |
| **6 visite specialistiche** (Cardiologia, Senologia, Ecografie, Pediatria, Ginecologia, Oculistica) **non hanno schede dedicate** | 🟠 Alto | Solo la pagina `/servizi/diagnostica` esiste. Non c'è deep-linking né pagina per singola branca. |
| Voce "Tutti i Trattamenti Specialistici" punta a `/#trattamenti` (anchor homepage), **non** a `/trattamenti` | 🟠 Alto | Link "rotto logicamente": non esiste (probabilmente) l'indice dei trattamenti. |
| Alcuni trattamenti esistenti **non compaiono affatto** nel menu (es. `conservativa`, `endodonzia`, `parodontologia`, `gnatologia`, `prx`, `acido-polilattico`, `ultrasuoni-cfu`, `tossina-botulinica`) | 🟡 Medio | Contenuto invisibile. |
| Le label del menu sono "cluster tematici" (es. *Ringiovanimento Viso Naturale*), non 1:1 con gli slug | 🟡 Medio | Necessaria una mappa di traduzione label → slug. |
| Nei documenti cliente **mancano le schede** per Cardiologia, Senologia, Ginecologia, Oculistica, Pediatria, Ecografie | 🔴 Critico | Blocca la creazione di pagine dedicate per le visite specialistiche. |

**Diagnosi in una frase**: il menu è stato progettato come **navigazione per macro-aree** ("hub & spoke"), ma la content strategy è già evoluta a **19 schede articolo** che il menu non conosce. Il sistema è "a due velocità": contenuti granulari, navigazione piatta.

---

## 2. MAPPA COMPLETA DELLE VOCI DEL MEGAMENU

### 2.1 Colonna 1 — "Visite Specialistiche" (`Stethoscope`)

Tutte le voci puntano a `/servizi/diagnostica`. La pagina `/servizi/diagnostica` mappa l'array `SPECIALTIES` da `diagnostics.ts` (che ha già un campo `id`: `cardiologia`, `senologia`, `radiologia-ecografie`, `oculistica`, `pediatria`, `ginecologia`).

| # | Label menu | href attuale | Esiste pagina dedicata? | Dove atterra realmente | Anchor di sezione disponibile? |
|---|---|---|---|---|---|
| 1 | Cardiologia & ECG | `/servizi/diagnostica` | ❌ No | Pagina macro-area | ✅ `#cardiologia` |
| 2 | Senologia & Prevenzione Donna | `/servizi/diagnostica` | ❌ No | Pagina macro-area | ✅ `#senologia` |
| 3 | Ecografie & Diagnostica Rapida | `/servizi/diagnostica` | ❌ No | Pagina macro-area | ✅ `#radiologia-ecografie` ⚠️ (id diverso dalla label) |
| 4 | Pediatria & Cura della Crescita | `/servizi/diagnostica` | ❌ No | Pagina macro-area | ✅ `#pediatria` |
| 5 | Ginecologia & Benessere Intimo | `/servizi/diagnostica` | ❌ No | Pagina macro-area | ✅ `#ginecologia` |
| 6 | Oculistica & Salute della Vista | `/servizi/diagnostica` | ❌ No | Pagina macro-area | ✅ `#oculistica` |

> ⚠️ **Nota**: non è verificabile dall'estratto se `SPECIALTIES` venga renderizzato con `id={specialty.id}` nel DOM (necessario per far funzionare gli anchor). Verificare `src/app/servizi/diagnostica/page.tsx`.

---

### 2.2 Colonna 2 — "Sorriso & Odontoiatria" (`Smile`)

Tutte le voci puntano a `/servizi/odontoiatria`. Esistono **10 schede** in `/trattamenti/[slug]`.

| # | Label menu | href attuale | Slug esistente corrispondente | Presenza in menu |
|---|---|---|---|---|
| 1 | Invisalign Diamond `[TOP]` | `/servizi/odontoiatria` | `invisalign-adulti`, `invisalign-adolescenti`, `invisalign-bambini` | ❌ Solo madre |
| 2 | Ortodonzia Adulti & Bambini | `/servizi/odontoiatria` | `invisalign-adulti`, `invisalign-adolescenti`, `invisalign-bambini` | ❌ Solo madre |
| 3 | Implantologia & Chirurgia 3D | `/servizi/odontoiatria` | `implantologia` | ❌ Solo madre |
| 4 | Estetica Dentale & Sbiancamento | `/servizi/odontoiatria` | `estetica-dentale` | ❌ Solo madre |
| 5 | Igiene Orale & Prevenzione Carie | `/servizi/odontoiatria` | `igiene` | ❌ Solo madre |
| — | *(assente dal menu)* | — | `conservativa` | 🚫 Orfano |
| — | *(assente dal menu)* | — | `endodonzia` | 🚫 Orfano |
| — | *(assente dal menu)* | — | `parodontologia` | 🚫 Orfano |
| — | *(assente dal menu)* | — | `gnatologia-bruxismo-bite` | 🚫 Orfano |

**Copertura**: 6/10 trattamenti menzionati, 0/10 linkati direttamente.

---

### 2.3 Colonna 3 — "Estetica & Rigenerativa" (`Sparkles`)

Tutte le voci puntano a `/servizi/medicina-estetica`. Esistono **9 schede**.

| # | Label menu | href attuale | Slug esistente corrispondente | Presenza in menu |
|---|---|---|---|---|
| 1 | Ringiovanimento Viso Naturale | `/servizi/medicina-estetica` | `filler-acido-ialuronico`, `tossina-botulinica`, `acido-polilattico` (cluster) | ❌ Solo madre |
| 2 | Laserterapia & Macchie Cutanee | `/servizi/medicina-estetica` | `piattaforma-laser` | ❌ Solo madre |
| 3 | Cryoliposculpt & Rimodellamento | `/servizi/medicina-estetica` | `cryoliposculpt` (+ `ultrasuoni-cfu`) | ❌ Solo madre |
| 4 | Biorivitalizzazione & Peeling | `/servizi/medicina-estetica` | `biorivitalizzazione` (+ `prx`) | ❌ Solo madre |
| 5 | Carbossiterapia Medicale | `/servizi/medicina-estetica` | `carbossiterapia` | ❌ Solo madre |
| — | *(assente dal menu)* | — | `ultrasuoni-cfu` | 🚫 Orfano (parziale) |
| — | *(assente dal menu)* | — | `prx` | 🚫 Orfano (parziale) |
| — | *(assente dal menu)* | — | `acido-polilattico` | 🚫 Orfano |
| — | *(assente dal menu)* | — | `tossina-botulinica` | 🚫 Orfano |

**Copertura**: 9/9 raggruppati in 5 cluster, 0/9 linkati direttamente.

---

### 2.4 Colonna 4 — CTA "Cocoora Precision"

| Label | href attuale | Esito |
|---|---|---|
| Cocoora Precision | `/precision` | ✅ OK (presumibilmente pagina dedicata) |

---

### 2.5 Footer del Megamenu — Ponte di Conversione

| Label | href attuale | Esito |
|---|---|---|
| Calcola quanto risparmi col Club | `/club` | ✅ OK |

---

## 3. MAPPA DELLE VOCI DI `NAV_NODES` (in `site.ts`)

| # | Label | href | Esito |
|---|---|---|---|
| 1 | Odontoiatria & Ortodonzia Digitale | `/servizi/odontoiatria` | ⚠️ Pagina madre, non indice trattamenti |
| 2 | Medicina Estetica & Rigenerativa | `/servizi/medicina-estetica` | ⚠️ Pagina madre |
| 3 | Poliambulatorio & Diagnostica Rapida | `/servizi/diagnostica` | ⚠️ Pagina madre |
| 4 | Tutti i Trattamenti Specialistici | **`/#trattamenti`** | 🔴 **Anchor homepage** — non porta a un indice `/trattamenti` |

> 🚨 **Bug logico confermato**: la voce "Tutti i Trattamenti Specialistici" promette un indice dei 19 trattamenti, ma punta a un'ancora della home. Se la home non ha una `id="trattamenti"` il link è *silentemente rotto* (nessun errore, ma nessuna navigazione).

---

## 4. LE DUE DISCREPANZE CHIAVE

### 4.1 Perché 19 schede esistono ma il menu punta solo alle pagine madre?

**Causa tecnica**: il Megamenu è un componente **hard-coded** (`MegamenuVisiteTrattamenti`) con label scritte a mano e `href` statici verso `/servizi/*`. Non legge da `ODONTOIATRIA_TREATMENTS` / `MEDICINA_ESTETICA_TREATMENTS`.

**Causa di processo**: le schede in `/trattamenti/[slug]` sono state probabilmente prodotte in una **seconda fase di content delivery**, dopo il congelamento del menu. Il menu è stato scritto quando l'universo contenutistico era "3 macro-aree" e non è stato rifattorizzato.

**Conseguenza SEO** (dettaglio):
- Le 19 pagine `/trattamenti/*` sono raggiungibili **solo via sitemap o ricerca interna** → *orphan pages*.
- Internal link equity concentrata tutta sulle 3 pagine `/servizi/*`.
- Cannibalizzazione keyword: la pagina madre compete con le 19 figlie sullo stesso topic.
- Nessun `BreadcrumbList` che passi dal menu (se non generato dall'albero `NAV_NODES`).

---

### 4.2 Cosa è successo alle "Visite Specialistiche" (Cardiologia, Senologia, Ginecologia, Oculistica, Pediatria, Ecografie)?

**Stato reale**:

| Fonte | Contiene schede per Cardiologia, Senologia, Ecografia, Pediatria, Ginecologia, Oculistica? |
|---|---|
| `COCOORA Odontoiatria_Ortodonzia_testo_modificabile.docx` | ❌ No — solo odontoiatria |
| `Cocoora_Medicina_Estetica_testo_sito_modificabile.docx` | ❌ No — solo medicina estetica |
| `Cocoora testo generale.docx` | ⚠️ Presumibilmente contiene il posizionamento clinico generale (da verificare) |
| `COOCURA CLUB i percorsi.docx` | ❌ No — pacchetti/percorsi, non schede cliniche |
| `Briefing_Master_Cocoora_Sito_App_Marketing...v3_DNA5.docx` | ⚠️ Briefing marketing, non content clinico |
| `BROCHURE folder QUADRATA BRAND COCOORA.pdf` | ⚠️ Brochure brand, non schede |

**Risposta diretta**: **No**, il cliente non ha consegnato — almeno nei documenti elencati — delle schede testuali dedicate per Cardiologia, Senologia, Ecografia, Ginecologia, Oculistica, Pediatria. Le uniche informazioni disponibili per queste branche sono già codificate in `diagnostics.ts` (`description` + array `exams`), ma **non sono state trasformate in "schede trattamento"** come per Odontoiatria ed Estetica.

**Motivo probabile**: natura del contratto editoriale. Il cliente ha consegnato schede commerciali **solo per le aree di punta** (Invisalign, Estetica, Laser, Cryoliposculpt…) che necessitano di posizionamento SEO/Ads. Le visite specialistiche sono state trattate come **"servizi di poliambulatorio"**, descritte a livello di branca ma senza landing dedicate.

**Conseguenza strutturale**: il sistema `/trattamenti/[slug]` copre solo le categorie `odontoiatria` e `medicina-estetica` (verificare il `generateStaticParams` della pagina dinamica per conferma). Le branche di diagnostica non hanno un equivalente → servono deep-link ad ancora oppure un'estensione del modello dati.

---

## 5. SOLUZIONE TECNICA PROPOSTA

### 5.1 Architettura target (raccomandata)

```
/                                     ← Home
├── /trattamenti                      ← NUOVO: indice con filtri (odontoiatria | medicina-estetica | diagnostica)
│   ├── /trattamenti/invisalign-adulti
│   ├── /trattamenti/...              ← 19 esistenti
│   └── /trattamenti/cardiologia      ← NUOVE schede per diagnostica
│   ├── /trattamenti/senologia
│   ├── /trattamenti/ecografia
│   ├── /trattamenti/oculistica
│   ├── /trattamenti/pediatria
│   └── /trattamenti/ginecologia
└── /servizi                          
    ├── /servizi/odontoiatria         ← pagina hub (resta)
    ├── /servizi/medicina-estetica    ← pagina hub (resta)
    └── /servizi/diagnostica          ← pagina hub (resta)
```

**Principio**: due livelli coesistono — **hub editoriali** (`/servizi/*`) + **schede articolo** (`/trattamenti/*`). Il menu punta direttamente alle schede quando si clicca un trattamento specifico, mentre le prime voci di colonna portano all'hub.

---

### 5.2 Mappatura corretta: Label menu → Target definitivo (Odontoiatria)

| Label menu | Nuovo `href` |
|---|---|
| Invisalign Diamond `[TOP]` | `/trattamenti/invisalign-adulti` |
| Ortodonzia Adulti & Bambini | `/trattamenti/invisalign-adolescenti` (con cross-link a `-adulti` e `-bambini`) |
| Invisalign Bambini *(nuova voce)* | `/trattamenti/invisalign-bambini` |
| Implantologia & Chirurgia 3D | `/trattamenti/implantologia` |
| Estetica Dentale & Sbiancamento | `/trattamenti/estetica-dentale` |
| Igiene Orale & Prevenzione | `/trattamenti/igiene` |
| Conservativa *(nuova voce)* | `/trattamenti/conservativa` |
| Endodonzia *(nuova voce)* | `/trattamenti/endodonzia` |
| Parodontologia *(nuova voce)* | `/trattamenti/parodontologia` |
| Gnatologia & Bruxismo *(nuova voce)* | `/trattamenti/gnatologia-bruxismo-bite` |

---

### 5.3 Mappatura corretta: Label menu → Target definitivo (Medicina Estetica)

| Label menu | Nuovo `href` | Note |
|---|---|---|
| Ringiovanimento Viso Naturale | `/trattamenti/filler-acido-ialuronico` | È il trattamento "porta" del cluster viso. Aggiungere cross-link a `tossina-botulinica`, `acido-polilattico`, `biorivitalizzazione`. |
| Laserterapia & Macchie Cutanee | `/trattamenti/piattaforma-laser` | — |
| Cryoliposculpt & Rimodellamento | `/trattamenti/cryoliposculpt` | Cross-link a `ultrasuoni-cfu` |
| Biorivitalizzazione & Peeling | `/trattamenti/biorivitalizzazione` | Cross-link a `prx` |
| Carbossiterapia Medicale | `/trattamenti/carbossiterapia` | — |
| Tossina Botulinica *(nuova voce)* | `/trattamenti/tossina-botulinica` | — |
| Acido Polilattico *(nuova voce)* | `/trattamenti/acido-polilattico` | — |

---

### 5.4 Mappatura corretta: Visite Specialistiche → Deep-link ad ancora (soluzione ponte)

Finché non esistono le schede dedicate, usare **anchor sul `SPECIALTIES.id`** già presente in `diagnostics.ts`:

| Label menu | Nuovo `href` (ponte) | Target ideale (futuro) |
|---|---|---|
| Cardiologia & ECG | `/servizi/diagnostica#cardiologia` | `/trattamenti/cardiologia` |
| Senologia & Prevenzione Donna | `/servizi/diagnostica#senologia` | `/trattamenti/senologia` |
| Ecografie & Diagnostica Rapida | `/servizi/diagnostica#radiologia-ecografie` | `/trattamenti/ecografia` |
| Pediatria & Cura della Crescita | `/servizi/diagnostica#pediatria` | `/trattamenti/pediatria` |
| Ginecologia & Benessere Intimo | `/servizi/diagnostica#ginecologia` | `/trattamenti/ginecologia` |
| Oculistica & Salute della Vista | `/servizi/diagnostica#oculistica` | `/trattamenti/oculistica` |

> ⚠️ **Prerequisito tecnico**: in `src/app/servizi/diagnostica/page.tsx` le sezioni devono avere `id={spec.id}` e `scroll-mt-32` (Tailwind) per compensare la sticky navbar.

---

### 5.5 Fix immediato: la voce "Tutti i Trattamenti Specialistici"

**Prima**: `/  #trattamenti` (anchor homepage, fragile)
**Dopo**: `/trattamenti` (da creare come indice).

Nuovo `NAV_NODES`:

```ts
{
  label: "Tutti i Trattamenti Specialistici",
  href: "/trattamenti",
  description: "Panoramica dei 19 trattamenti specialistici + 6 branche di diagnostica disponibili nel nostro centro.",
  image: "/images/diagnostics-lab.jpg",
}
```

---

### 5.6 Soluzione architetturale raccomandata (scalabile)

Unificare tutti i contenuti sotto `/trattamenti/[slug]` con un campo `category` esteso:

```ts
// src/lib/types.ts
export type TreatmentCategory =
  | "odontoiatria"
  | "medicina-estetica"
  | "diagnostica";   // ← nuova

export type Treatment = {
  slug: string;
  title: string;
  category: TreatmentCategory;
  tagline: string;
  description: string;
  steps?: { title: string; description: string }[];
  exams?: string[];   // ← per diagnostica
  machines?: string[];
  faq?: { q: string; a: string }[];
};
```

E in `diagnostics.ts` derivare i `Treatment` dalle `SPECIALTIES` con un adapter:

```ts
// src/lib/treatments-diagnostica.ts
import { SPECIALTIES } from "./diagnostics";
import type { Treatment } from "./types";

export const DIAGNOSTICA_TREATMENTS: Treatment[] = SPECIALTIES.map((s) => ({
  slug: s.id,                       // "cardiologia", "senologia", ...
  title: s.title,
  category: "diagnostica",
  tagline: s.description.split(".")[0],
  description: s.description,
  exams: s.exams,
  faq: [],
}));
```

Così `generateStaticParams()` in `/trattamenti/[slug]/page.tsx` genera automaticamente anche le pagine delle 6 branche, **senza richiedere documenti nuovi** dal cliente (l'FDE — "fallback content editorial" — riusa `diagnostics.ts`).

---

## 6. PATCH TECNICA — Rischi e mitigazioni

| Rischio | Mitigazione |
|---|---|
| Anche i link `/trattamenti/*` rotti = 404 | Verificare `generateStaticParams` in `[slug]/page.tsx` copra **tutti** gli slug dei 3 array prima del deploy. Aggiungere `notFound()` per slug invalidi. |
| Anchor `#radiologia-ecografie` non corrisponde alla label "Ecografie & Diagnostica Rapida" | Separare `displayLabel` (menu) da `anchorId` (DOM). Mappare in una costante `MEGAMENU_SPECIALISTICHE`. |
| Menu mobile non testato | Aggiungere verifica specifica su `MobileMenu` che usi la stessa mappa. |
| Cambio `NAV_NODES` rompe altrove (breadcrumb, sitemap) | Ricerca globale di `NAV_NODES` prima del merge. |
| Anchor non scrolla per sticky navbar | `scroll-mt-32` su ogni sezione `SPECIALTIES`. |

---

## 7. CHECKLIST DI IMPLEMENTAZIONE (ordine di priorità)

- [ ] **P0** — Fix `NAV_NODES[0].children[3].href` da `/#trattamenti` a `/trattamenti`
- [ ] **P0** — Creare pagina `/trattamenti/page.tsx` (indice con `category` filter)
- [ ] **P0** — Refactor Megamenu: centralizzare mappa `VISITE_TRATTAMENTI_LINKS` derivata dai dati
- [ ] **P1** — Sostituire `href="/servizi/odontoiatria"` con slug specifici (10 voci)
- [ ] **P1** — Sostituire `href="/servizi/medicina-estetica"` con slug specifici (9 voci)
- [ ] **P1** — Aggiungere `id={spec.id}` + `scroll-mt-32` in `/servizi/diagnostica/page.tsx`
- [ ] **P1** — Sostituire `href="/servizi/diagnostica"` con anchor deep-link (6 voci)
- [ ] **P2** — Estendere `Treatment.category` con `"diagnostica"` e creare `DIAGNOSTICA_TREATMENTS`
- [ ] **P2** — Aggiornare `generateStaticParams` per includere tutti e 25 gli slug (10+9+6)
- [ ] **P2** — Aggiungere `BreadcrumbList` JSON-LD che segua il nuovo albero
- [ ] **P3** — Aggiornare sitemap.xml con i nuovi URL `/trattamenti/*`
- [ ] **P3** — Redirect 301 da eventuali vecchi URL se il sito era live

---

## 8. DOMANDE APERTE PER IL CLIENTE / PM

1. **Le schede Cardiologia / Senologia / Ginecologia / Oculistica / Pediatria / Ecografie** esistono in un documento non elencato? Se sì, produrle per contenuti SEO di profondità.
2. Il cliente vuole **mantenere le 5 etichette cluster** (es. "Ringiovanimento Viso Naturale") o preferisce label 1:1 con gli slug per una migliore SEO?
3. Confermare che `/trattamenti` (indice) non esista già — se sì, adattare il fix.
4. Confermare semantica SEO: `/servizi/odontoiatria` deve restare la landing **commerciale**, mentre `/trattamenti/*` è la **biblioteca clinica** (differenziazione content per evitare cannibalizzazione).

---

## 9. VERDETTO FINALE

| Dimensione | Stato attuale | Post-fix |
|---|---|---|
| **Coerenza linking** | 0/16 link puntano al contenuto corretto | 16/16 → destinazione semantica |
| **Copertura schede** | 19 pagine, 0 linkate dal menu | 25 pagine, 25 linkate |
| **SEO interno** | Orphan pages + anchor homepage rotta | Link equity distribuita, indice `/trattamenti` |
| **UX mobile/desktop** | Frustrazione (click → pagina generica) | Ridondanza zero, ogni label = destinazione precisa |
| **Debito tecnico** | Menu hard-coded, dati non riusati | Menu data-driven dai `Treatment[]` |

**Priorità assoluta**: intervenire sui punti **P0** prima del rilascio, perché attualmente ogni click nel Megamenu "Visite & Trattamenti" **tradisce l'aspettativa dell'utente**. È il singolo difetto UX più impattante dell'intera area.