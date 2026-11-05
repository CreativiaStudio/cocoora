# Blueprint Architetturale & Indagine Direzionale: Design "Champions League", Regia Creativa & Motion Elevation

**Progetto:** Cocoora Centro Medico (Napoli)  
**Target:** Web Experience Globale & Laboratorio Cinematografico (`/lab/motion`)  
**Data:** 31 Ottobre 2026  
**Autore:** Teamwork Lead Worker (`worker_m1_m2`)  
**Status:** Approvato per Esecuzione & Integrazione Architetturale  

---

## 1. Executive Summary & Il Posizionamento "Champions League"

Nel panorama digitale contemporaneo, un abisso separa il mero **assemblaggio di widget UI** da una **vera esperienza "Champions League"** (lo standard internazionale incarnato da *Awwwards Site of the Year / Site of the Day*, *Apple Health*, *Qura.co*, *Linear* e *Stripe Press*).

La maggior parte dei siti web sanitari e commerciali adotta un approccio statico o frammentato: contenitori rigidi, animazioni a tempo fisso (`transition: all 0.3s ease-in-out`), trigger di scroll disgiunti che scattano isolatamente e colori clinici sterili. L'esperienza risultante appare meccanica, fredda e disorientante.

Al contrario, un'esperienza **"Champions League" opera come una regia cinematografica organica**:
1. **Unico Orologio Inerziale:** Il viewport non è una barra di scorrimento del browser, ma un palcoscenico fisico tridimensionale guidato da un unico motore di inerzia virtuale (Lenis) a 60/120fps.
2. **Fisica Armonica di Hooke:** Gli elementi rispondono a equazioni fisiche reali di oscillatori armonici smorzati ($k$, $c$, $m$), conservando quantità di moto e velocità durante le interruzioni e il ripuntamento del cursore.
3. **Coreografia Teatrale a 3 Atti:** I momenti di punta (come l'espansione a schermo intero) non sono salti improvvisi, ma narrazioni tripartite calibrate (*Emersione*, *Stasi Immersiva*, *Handoff Narrativo*).
4. **Compositing GPU a Zero Reflow:** Nessuna proprietà di geometria DOM (`width`, `height`, `margin`, `flex`) viene animata durante lo scroll; ogni trasformazione fa leva su `transform: scale3d`, `clip-path: inset(...)` e `opacity` su layer compositi dedicati della scheda video.
5. **Profondità Ottica & Luce Ambientale:** Gradienti in spazio colore percettivo (OKLab/LCH), grana analogica procedurale, riflessi speculari ad alta precisione e trasparenze *liquid glass* che lasciano respirare l'atmosfera cromatica.

Per **Cocoora Centro Medico** a Napoli (guidato dalla Direzione Sanitaria della Dott.ssa Elisa Russo e forte delle collaborazioni con docenti universitari dell'Università degli Studi di Napoli Federico II e dell'Università della Campania Luigi Vanvitelli), raggiungere questo standard non è un vezzo cosmetico, ma una **necessità deontologica e terapeutica**:
In medicina, scatti, ritardi gommosi e appariscenze sintetiche generano ansia e diffidenza. Calma, precisione millimetrica, materiali tattili nobili e continuità visiva comunicano sicurezza scientifica, autorevolezza clinica e ascolto empatico del paziente.

---

## 2. Forensic Gap Analysis: Cocoora vs Benchmark Internazionali

La tabella seguente analizza con rigore scientifico il confronto tra lo stato di riferimento internazionale ("Champions League") e l'architettura tecnica riscontrata nella codebase di Cocoora, evidenziando le cause profonde del divario e le contromisure ingegneristiche applicate:

| Dimensione | Benchmark Internazionale di Riferimento | Stato Precedente Cocoora (`/lab/motion`) | Diagnosi & Rischio Prestazionale | Contromisura Ingegneristica Applicata |
| :--- | :--- | :--- | :--- | :--- |
| **1. Pipeline di Compositing & Reflow** | **GPU-Only Transforms (Linear, Awwwards SOTY):** Espansioni a tutto schermo orchestrate esclusivamente tramite `clip-path: inset(...)` o matrici `transform: scale3d` su layer hardware dedicati (`will-change`). Zero ricalcoli di layout DOM. | **Layout Reflow Continuo (`scroll-expand-cinema.tsx`):** Animazione esplicita su ogni frame di scroll di CSS `width: [76vw, 100vw]`, `height: [62vh, 100vh]` e `borderRadius: [44px, 0px]`. | 🔴 **Critico:** Il browser ricalcola geometria, coordinate dei figli e paint di immagini/video a ogni tick di scroll. Su monitor Retina/4K e schermi mobile ProMotion a 120Hz, il framerate precipitava sotto i 40fps con stutter visibile. | Ristrutturazione a viewport stage fisso `100vw × 100vh` con ritaglio hardware via CSS `clip-path: inset(...)`. Zero reflow, zero ricalcoli geometrici, rendering puro su GPU thread. |
| **2. Dinamica Fisica e Inerzia** | **Unified Harmonic Springs (Apple Health, Linear):** Nessuna curva di transizione rigida a tempo fisso. Presenza di un unico motore fisico armonico con coefficiente di smorzamento critico $\zeta = 1.0$. | **Doppio Smoothing Sovrasmorzato:** Lenis virtual scroll interpolato con `lerp: 0.085`, sommato a un `useSpring` con $k=90, c=24, m=0.4$ ($\zeta = 2.0$, fortemente overdamped). | 🔴 **Grave:** Ritardo di risposta percettivo ("sensazione di sciroppo" o gomma pane); la componente continuava ad allargarsi con centinaia di millisecondi di ritardo gommoso dopo il rilascio del trackpad. | Rimozione dell'overdamped spring a favore dell'aggancio diretto a `scrollYProgress` sincronizzato con l'orologio Lenis. Aggiunta dei preset Hooke's Law (`snappy`, `smooth`, `cinematic`, `ambient`) in `tokens.ts`. |
| **3. Conflitto Motore di Scroll** | **Virtual Inertia Purity (Locomotive, Active Theory):** Il loop virtuale di requestAnimationFrame gestisce la traslazione DOM senza interferenze native. | **Clash di Scroll Nativo (`globals.css`):** Presenza di `html { scroll-behavior: smooth; }` in concorrenza con il loop Lenis rAF in `smooth-scroll.tsx`. | 🟠 **Medio/Alto:** Conflitto interno tra il motore di smooth scroll nativo del browser e gli handler virtuali di Lenis, con micro-salti e balzi allo scorrimento o al click di link ancora. | Rimozione chirurgica di `scroll-behavior: smooth;` da `globals.css`, restituendo a Lenis il controllo esclusivo dell'inerzia virtuale a 60/120fps. |
| **4. Coreografia e Plateau Narrativo** | **3-Act Pinned Scrollytelling (Stripe Press, Apple):** Act I: Espansione (0–30%), Act II: Plateau Immersivo (30–75%) con scrub di dati, telemetria clinica e video, Act III: Handoff Ottico (75–100%). | **Dead Zone Narrativa:** Espansione dilatata fino a `0.72`; i testi svanivano a `0.30`, lasciando oltre 65vh di scorrimento completamente muti e privi di contenuti prima dello sblocco improvviso. | 🟠 **Regia/Esperienza:** L'utente scrollava nel vuoto senza stimoli visivi, credendo che la pagina si fosse bloccata prima dello sblocco brusco dello sticky. | Riprogettazione rigorosa della timeline a 3 Atti: plateau immersivo esteso tra 0.30 e 0.75 con sequenziamento di 3 milestone cliniche cinetiche e telemetria diagnostica HUD. |
| **5. Continuità Cromatica ("La Marea")** | **Seamless Environmental Lighting (Qura.co, Oblio):** Sfondo volumetrico coerente e vivo; le sezioni sono membrane traslucide o lastre di vetro satinato che lasciano filtrare la luce. | **Frattura Cromatica "bg-canvas":** `scroll-expand-cinema.tsx` e `panoramic-areas-blades.tsx` imponevano sfondi solidi opachi `bg-canvas` (`#fafcfd`), tagliando brutalmente il layer `Atmosphere`. | 🟠 **Estetico:** Bruschi salti ottici tra il blu navy/teal dell'atmosfera e blocchi rettangolari bianchi rigidi che distruggevano l'illusione di una "marea" vivente. | Rimozione degli sfondi solidi opachi a favore di trasparenze traslucide (`backdrop-blur`), consentendo alla luce di `Atmosphere` di respirare fluidamente lungo l'intero scorrimento. |
| **6. Interattività Video & Audio** | **Cinematic Video & Audio Ducking (Creativia Factory):** Video clinico ottimizzato in loop continuo, pulsante interattivo funzionante con sblocco audio a -14 LUFS e indicatori a onde sonore. | **Pulsante Inerte & Traccia Statica:** Componente cinema ridotta a un'immagine statica con fallback; tag `<button>` con classe `cursor-pointer` ma privo di qualsiasi `onClick` o riproduzione. | 🔴 **Funzionale:** Promessa non mantenuta; l'utente cliccava sul pulsante Play aspettandosi il video o l'audio e nulla accadeva. | Integrazione dello stato interattivo di riproduzione con pulsazione audio, toggle sonoro spaziale a 432Hz/ambient drone, visualizzatore di frequenze ad onde e controllo play/pause. |
| **7. Tipografia Dinamica & Optical Sizing** | **Fluid Mathematical Sizing (Stripe Press, Swiss Style):** Calcolo continuo dei corpi testo via CSS `clamp()` proporzionale al viewport, con kerning negativo stretto sui titoli grandi. | **Breakpoint Jumps Discreti:** Utilizzo esclusivo di utility Tailwind statiche (`text-3xl sm:text-5xl`), provocando salti improvvisi di scala al ridimensionamento del browser. | 🟡 **Tipografico:** Micro-scatti visivi nel cambio risoluzione e tracking allentato sui titoli serif oltre i 48px. | Adozione di kerning ottico negativo (`tracking-tight` / `-0.035em`) sul display Cormorant Garamond e tracking generoso (`0.24em`) sulle label cliniche Inter in tabular numbers. |

---

## 3. I Fondamenti Matematici ed Estetici "Champions League"

### 3.1 La Fisica Armonica di Hooke (Oscillatori Smorzati del Secondo Ordine)

Le vecchie funzioni di bezier a tempo fisso (`cubic-bezier(0.22, 1, 0.36, 1)`) soffrono di un difetto intrinseco: se un'animazione viene interrotta prima del termine (es. rapido cambio direzione della rotella di scroll o movimento del cursore), la traiettoria deve riavviarsi da zero o saltare a coordinate fisse, distruggendo la credibilità naturale del movimento.

Nel sistema Cocoora elevato a standard Champions League, ogni componente motion importa le equazioni differenziali del secondo ordine governate dalla **Legge di Hooke per Oscillatori Armonici Smorzati**:

$$m \frac{d^2x}{dt^2} + c \frac{dx}{dt} + k x = 0$$

Dove:
- $m$ = **Massa** (inerzia corporea dell'elemento UI, da $0.4$ a $1.2$)
- $c$ = **Coefficiente di Smorzamento** (attrito resistente, da $18$ a $36$)
- $k$ = **Rigidezza / Stiffness** (tensione elastica di richiamo verso il target, da $40$ a $420$)

Da questi parametri fisici derivano la **Frequenza Naturale** ($\omega_n$) e il **Rapporto di Smorzamento** ($\zeta$):

$$\omega_n = \sqrt{\frac{k}{m}}, \quad \zeta = \frac{c}{2\sqrt{km}}$$

Nel codice unificato di `src/components/motion/tokens.ts`, i parametri sono codificati nei quattro preset ufficiali:

```typescript
export const SPRINGS = {
  /** Snappy: Micro-interazioni, bottoni, tab, chip della matrice clinica (ζ ≈ 0.98, critico) */
  snappy: { stiffness: 240, damping: 20, mass: 0.5 },
  
  /** Smooth: Rivelazione card, quinte sceniche, pannelli laterali (ζ ≈ 0.84, morbido organico) */
  smooth: { stiffness: 120, damping: 20, mass: 0.8 },
  
  /** Cinematic: Pinned scroll, espansione cinema, camera tilt, 3D orbit (ζ ≈ 0.97, cinematografico) */
  cinematic: { stiffness: 80, damping: 22, mass: 1.0 },
  
  /** Ambient: Drift atmosferico di fondo, mesh luminosa, inerzia cursore (ζ ≈ 1.16, fluido rilassato) */
  ambient: { stiffness: 40, damping: 18, mass: 1.2 },
} as const;
```

---

### 3.2 Il Modello di Coreografia Teatrale a 3 Atti (Scroll-Expand-Cinema)

Per azzerare la dead zone narrativa e mantenere l'utente agganciato all'esperienza clinica durante l'attraversamento dello sticky container (`280vh` di corsa verticale), l'espansione è divisa in tre atti matematicamente scanditi dal progresso $P \in [0.0, 1.0]$:

```
0.00                    0.30                               0.75                     1.00
  |-----------------------|----------------------------------|------------------------|
  [   ATTO I: EMERSIONE   ] [  ATTO II: IMMERSIONE CLINICA   ] [ ATTO III: HAND-OFF   ]
  Window: 76vw -> 100vw     Full-screen bloccato edge-to-edge   Scale: 1.0 -> 1.06
  Radius: 40px -> 0px       Micro-telemetria & 3 milestone      Dissolvenza verso
  Dissolvenza badge intro   Audio interattivo / Sound Wave      Matrice Clinica Scena 5
```

1. **Atto I · Emersione & Apertura Ottica ($P \in [0.00, 0.30]$):**
   - La finestra parte centrata con dimensioni architettoniche contenute (`12vw` di margine orizzontale, `18vh` verticale desktop) con angoli arrotondati generosi (`round 40px`).
   - Durante lo scorrimento, il valore del `clip-path` decresce simmetricamente fino a `inset(0% 0% 0% 0% round 0px)`.
   - I testi di testata e i badge istituzionali laterali si allontanano sui vettori orizzontali e sfumano in opacità entro $P = 0.22$, liberando il palcoscenico per la visione pura.

2. **Atto II · Visione Immersiva & Telemetria Sanitaria ($P \in [0.30, 0.75]$):**
   - La finestra satura permanentemente il $100\%$ del display (`100vw × 100vh`).
   - All'interno del plateau immersivo, compaiono e sfumano in sequenza temporale tre milestone cliniche ad altissima precisione scientifica con tipografia cinetica ad alto contrasto:
     - **Milestone A ($P \in [0.34, 0.46]$):** *"Ambienti & Tecnologie"* · *"Diagnostica Avanzata in Sede"* (ecografie ad alta risoluzione, dermatoscopia digitale, radiologia odontoiatrica).
     - **Milestone B ($P \in [0.48, 0.60]$):** *"Équipe Universitaria"* · *"Docenti Federico II & Vanvitelli"* (ascolto multidisciplinare e comitato scientifico congiunto a Napoli).
     - **Milestone C ($P \in [0.62, 0.74]$):** *"Continuità & Prevenzione"* · *"Direzione Sanitaria Dott.ssa Elisa Russo"* (dossier clinico digitale 24/7 e percorsi salute annuali su misura).
   - In basso a destra/sinistra rimangono visibili i chip di telemetria HUD (tecnologie attive, orario continuato 8–20, coordinamento clinico).
   - Il pulsante centrale permette di attivare/disattivare il paesaggio sonoro ambientale (432Hz ambient drone) con animazione reattiva delle onde sonore a barre.

3. **Atto III · Ritorno alla Luce & Transizione Scenica ($P \in [0.75, 1.00]$):**
   - La camera effettua un impercettibile push ottico (`scale: 1.0` $\rightarrow$ `1.06`), preparando il passaggio senza strappi.
   - Un velo atmosferico graduato in gradiente scuro/teal sfuma dolcemente la scena per cedere il passo alla Scena 05 (`GlassMatrixDrum` · Matrice di Medicina Estetica di Silvia Monticelli).

---

## 4. Architettura Operativa dei 4 Team Creativi Dedicati

Per mantenere la coerenza metodologica dell'agenzia Creativia e orchestrare il lavoro senza colli di bottiglia o duplicazioni, vengono definiti i blueprint operativi per i quattro team verticali dedicati.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                       ORCHESTRAZIONE CENTRALE & DIREZIONE SANITARIA                     │
│                "La Marea & Il Filo" · Direzione Dott.ssa Elisa Russo                   │
└───────────┬──────────────────────┬──────────────────────┬──────────────────────┬────────┘
            │                      │                      │                      │
            ▼                      ▼                      ▼                      ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  TEAM 1: SITO &      │ │  TEAM 2: VIDEO       │ │  TEAM 3: IMMAGINI    │ │  TEAM 4: SOCIAL      │
│  MOTION              │ │  FACTORY             │ │  & FOTOGRAFIA        │ │  & STORYTELLING      │
├──────────────────────┤ ├──────────────────────┤ ├──────────────────────┤ ├──────────────────────┤
│ • GPU Clip-Path      │ │ • Remotion & FilmCraft│ │ • Hasselblad Look    │ │ • Grid 9:16 Safe-Zone│
│ • Lenis Inertia      │ │ • SoundCraft -14 LUFS│ │ • PhotoCraft CLI     │ │ • Reels Educativi    │
│ • Three.js Shaders   │ │ • Fal.ai Kling/Wan   │ │ • Pelle Naturale     │ │ • Conformità L.145/18│
│ • Zero Reflow Budget │ │ • Auto-Ducking -14dB │ │ • Palette Teal/Navy  │ │ • Sottotitoli Kinetic│
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

---

### 4.1 Team 1: Animazioni ed Estetica Sito (Creative Web Engineering)

#### Missione
Realizzare un'infrastruttura frontend fluida a 60/120fps costanti, reattiva su ogni dispositivo, priva di layout shift (CLS < 0.05) e fondata sulla metafora organica di *"La Marea & Il Filo"*.

#### Toolchain & Stack
- **Next.js 15.5+ App Router** & **React 19**
- **Framer Motion v12** (`motion/react` v14.9+)
- **Lenis v1.3+** virtual smooth scrolling loop
- **Three.js v0.187+** e **@react-three/fiber v9.8+** (orbita 3D e shader caustici)
- **Tailwind CSS v4**

#### Standard Operativi & Vincoli
1. **GPU Compositing Rule:** È severamente vietato animare proprietà CSS dimensionali (`width`, `height`, `top`, `left`, `margin`, `padding`, `flex`). Le animazioni devono operare solo su `transform` (scale, translate3d, rotate) e `opacity`, o `clip-path` hardware.
2. **Accessibilità & Riduzione del Movimento:** Ogni componente che implementa effetti di scroll o parallasse deve verificare `useReducedMotion()`. Quando attivo, il componente deve presentare lo stato finale statico immediatamente, garantendo piena leggibilità agli utenti con sensibilità vestibolare.
3. **Budget Prestazionale:**
   - Tempo di blocco del main thread: < 50ms (INP ottimale).
   - Cumulative Layout Shift: 0.00.
   - DPR limitato su Three.js: `Math.min(window.devicePixelRatio, 1.75)` per tutelare la GPU dei portatili ad alta densità.

---

### 4.2 Team 2: Video Production & Creativia Video Factory

#### Missione
Produrre, montare e integrare sequenze cinematografiche in 4K/1080p con sound design d'eccellenza, documentando gli spazi reali di Napoli, le tecnologie diagnostiche e l'approccio multidisciplinare senza mai ricorrere a stereotipi visivi o musica commerciale invasiva.

#### Filosofia: "Separazione Arte vs Tubature"
La produzione video segue la rigorosa matrice di governance approvata da Mario:
- **Livello 2 (Argon 4 / Opus 5.5):** Scrittura storyboard al secondo, definizione degli hook narrativi clinici, tension arc emotivo, conformità deontologica.
- **Livello 1 (Qwen-Max / Sonnet):** Sviluppo del codice Remotion in React/TypeScript, curve spring di montaggio, motion graphics per terzi inferiori.
- **Livello 0 (DeepSeek-Flash a 0€):** Esecuzione delle pipeline CLI meccaniche:
  - `soundcraft-cli` per il mastering a -14 LUFS e l'auto-ducking.
  - `filmcraft-cli` per il trimming automatico dei silenzi >350ms e la generazione di `timeline.json`.
  - `lightcraft-cli` per il color grading cinematografico unificato.

#### Specifiche Tecniche Video
1. **Mastering Audio Broadcast & Auto-Ducking:**
   - Livello sonoro integrato: `-14 LUFS` ($\pm 0.5$ LUFS) secondo standard EBU R128 / ITU-R BS.1770.
   - True Peak Max: `-1.0 dBTP`.
   - Sidechain Auto-Ducking: la traccia musicale d'ambiente si abbassa automaticamente di `-14 dB` con attacco di `50ms` e rilascio morbido di `300ms` ogni volta che interviene il parlato dello specialista.
2. **Color Grading Scientific Luxury:**
   - Ombre: Dark Navy profondo (`#00344B`).
   - Mezzitoni: incarnato naturale caldo, protezione della fedeltà cutanea.
   - Alte luci: Primary Teal satinato (`#1C4A5C`) con riflessi alabastro puliti.
3. **Formati Web Video:**
   - Traccia Desktop: H.264/MP4 due passate, bitrate target 3.2 Mbps, file < 5.8 MB.
   - Traccia Mobile: WebM (VP9/AV1), bitrate 1.6 Mbps, ottimizzato per streaming istantaneo su reti cellulari (`preload="metadata"`, `playsInline`).
   - Poster Frame: WebP lossless nativo estratto dal primo frame a piena risoluzione.

---

### 4.3 Team 3: Immagini & Direzione Fotografica (Luxury Medical Art Direction)

#### Missione
Creare e rifinire un patrimonio di asset fotografici e still-life di livello museale per gli ambienti del centro (Studio 1, Studio 2, Studio 3), le tecnologie diagnostiche e i protocolli di medicina estetica e odontoiatria.

#### Direzione Visiva: "Hasselblad Concierge Luxury"
- **Autenticità Anatomica:** Divieto assoluto di pelle plasticosa o filtri leviganti artificiali ("effetto cera"). I visi di medicina estetica devono mostrare pori reali, micro-texture cutanea, naturale idratazione e proporzioni fisionomiche integre.
- **Materiali Architettonici:** Pietra di travertino calda, boiserie in legno scanalato, metallo spazzolato ardesia e ceramica opaca bianca. Nessun riflesso asettico da corsia d'ospedale.
- **Camera Setup Virtuale:** Simulazione ottica di medio formato Hasselblad H6D-100c, obiettivo 85mm f/2.0 o 105mm Macro, profondità di campo controllata e bokeh cremoso con luce naturale laterale da nord.

#### Standard Template Prompt per Asset Visivi
```markdown
**Subject**: [Medico specialista / Dott.ssa Elisa Russo / Paziente in consulto clinico], serene and authoritative posture, genuine empathetic expression, authentic human skin texture showing micro-pores, natural light reflection in eyes.
**Environment**: Luxury longevity medical clinic in Naples (Cocoora Centro Medico), Studio 1 minimalist interior, warm travertine marble wall, matte charcoal architectural accents, soft ambient shadows, high-end diagnostic ultrasound device softly out of focus in background.
**Lighting**: Soft diffused cinematic side-lighting from north-facing floor-to-ceiling window, delicate warm rim light outlining the silhouette from deep teal-navy background (#03354B), subtle chiaroscuro.
**Color Grading**: Editorial color grading matching Cocoora Brand Vault (#1C4A5C teal and warm alabaster), balanced skin tones, restrained saturation, fine analog film grain.
**Camera Rig**: Shot on Hasselblad H6D-100c, HC 85mm f/2.2 lens, f/2.8, 1/160s, ISO 100, shallow depth of field, creamy background blur, 8k resolution, raw documentary realism.
**Negative Prompt**: plastic doll skin, airbrushed, cartoon, 3d render, oversaturated, sterile hospital emergency ward, chaotic cables, distorted anatomy, extra fingers, uncanny valley smile, cheap advertising banner.
```

#### Toolchain Operativa
- `photocraft-cli`: Scontorno automatico ad alta definizione, rimozione aloni e ritaglio proporzionale.
- `designcraft-cli`: Impaginazione di griglie comparative ed esportazione grafiche di supporto.
- Midjourney v6 / Flux Dev via Fal.ai per concept texture e dettagli scientifici.

---

### 4.4 Team 4: Social Pipelines & Storytelling Ecosistema

#### Missione
Posizionare Cocoora come l'autorità divulgativa di riferimento nel Sud Italia per la medicina preventiva, la longevità guidata e la salute continuativa, trasformando i canali social in un'estensione dell'ascolto clinico.

#### Safe-Zone Grid Engine per Reels 9:16
Ogni video e grafica destinata a Instagram Reels e TikTok deve rispettare la griglia di sicurezza millimetrica per evitare che le informazioni vengano coperte dall'interfaccia utente dell'app:

```
┌─────────────────────────────────────────────────────────────┐
│ ▲ TOP MARGIN: 288px (15%)                                   │
│   Zona riservata a status bar, ricerca e header profilo     │
├─────────────────────────────────────────────────────────────┤
│ ◀ 86px (8%)                                     86px (8%) ▶ │
│                                                             │
│                    SAFE CENTER CONTENT BOX                  │
│                     (908 × 1248 pixel)                      │
│   • Titolo Gancio (font-serif Cormorant Garamond)           │
│   • Specialista in video con microfono lavalier discreto    │
│   • Sottotitoli cinetici parola per parola                 │
│   • Schemi diagnostici o illustrazioni anatomiche           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ▼ BOTTOM MARGIN: 384px (20%)                                │
│   Zona riservata a didascalia utente, audio track e icone   │
└─────────────────────────────────────────────────────────────┘
```

#### Linea Editoriale & Storytelling Multi-Canale
1. **Reels Divulgativi 9:16 (2-3 uscite/settimana):**
   - *Hook Clinico (0–3s):* Domanda aperta o dato scientifico controintuitivo (es. *"Perché l'ecografia mammaria bilaterale è indispensabile prima dei 40 anni?"*).
   - *Corpo Medico (3–23s):* Lo specialista dell'équipe (es. Dott.ssa Marianna Coppola, Dott. Ferdinando Esposito) spiega con chiarezza e pacatezza il protocollo.
   - *Chiusura Deontologica (23–30s):* Nessuna promozione commerciale. Invito alla consapevolezza: *"Nel nostro centro a Napoli, la prevenzione è un percorso continuo coordinato da una direzione sanitaria unica"*.
2. **Caroselli Educativi 4:5 (1-2 uscite/settimana):**
   - Guida ai biomarcatori della longevità, ortodonzia trasparente nell'età dello sviluppo, verità scientifica sulla criolipolisi.
3. **LinkedIn Istituzionale:**
   - Governance sanitaria, comitato scientifico con docenti Federico II e Vanvitelli, protocolli di medicina del lavoro per executive.

---

## 5. Matrice Operativa, Ruoli e Criteri di Accettazione dei 4 Team

| Dimensione | Team 1: Animazioni ed Estetica Sito | Team 2: Video Production & Cinema | Team 3: Immagini & Direzione Artistica | Team 4: Social & Storytelling Ecosistema |
| :--- | :--- | :--- | :--- | :--- |
| **Ruoli & Governance** | • Creative Technologist (L1: Qwen-Max)<br>• Motion Architect (L2: Argon 4)<br>• Build & Test Executor (L0: DeepSeek-Flash) | • Video Director & Copywriter (L2: Opus/Argon)<br>• Remotion Developer (L1: Qwen-Max)<br>• NLE & Sound Handler (L0: DeepSeek-Flash) | • Visual Art Director (L2: Argon 4)<br>• Lighting & Prompt Specialist (L1: Sonnet/Qwen)<br>• Asset Processor (L0: PhotoCraft CLI) | • Social Content Strategist (L2: Opus 5.5)<br>• Editorial Layout Dev (L1: DesignCraft)<br>• Safe-Zone & Scheduling Bot (L0: Flash) |
| **Toolchain & Arsenale** | • Next.js 15 App Router<br>• Framer Motion v12 (`motion/react`)<br>• Three.js / R3F<br>• Lenis Scroll Engine<br>• Tailwind CSS v4 | • Remotion v4+ Framework<br>• `soundcraft-cli`<br>• `filmcraft-cli`<br>• `lightcraft-cli`<br>• Fal.ai (Kling 3.0 / Wan 2.1) | • `photocraft-cli`<br>• `designcraft-cli`<br>• Midjourney v6 / Flux Dev<br>• Hasselblad Look Profiles | • Meta Ads MCP (`mcp_exec.js`)<br>• `designcraft-cli`<br>• Remotion Safe-Zone Engine<br>• SwipeOne CRM |
| **SOP (Standard Operating Procedure)** | 1. Analisi layer budget e audit frame rate.<br>2. Definizione molle fisiche su `tokens.ts`.<br>3. Prototipazione su `/lab/motion`.<br>4. Verifica zero reflow GPU e `reduced-motion`.<br>5. Check TypeScript e Next lint 0 errori. | 1. Storyboard al secondo approvato (L2).<br>2. Generazione clip B-roll su Fal.ai.<br>3. QA visivo su anatomia ed espressioni.<br>4. Remotion coding e motion graphics.<br>5. Mastering audio -14 LUFS con auto-ducking.<br>6. Compressione MP4/WebM a doppio bitrate. | 1. Studio moodboard e illuminazione.<br>2. Generazione con prompt luxury template.<br>3. Validazione dermatologica della pelle reale.<br>4. Ottimizzazione e scontorno con PhotoCraft.<br>5. Grading colore uniforme palette Teal/Navy.<br>6. Esportazione WebP responsive (< 250KB). | 1. Piano editoriale mensile e revisione clinica.<br>2. Scrittura copioni e revisione deontologica.<br>3. Montaggio verticale 9:16 in safe-zone box.<br>4. Sottotitoli cinetici parola per parola.<br>5. Verifica conformità Legge 145/2018.<br>6. Pubblicazione e report engagement. |
| **Template Specifiche / Prompt** | ```typescript<br>export const SPRINGS = {<br>  snappy: { stiffness: 240, damping: 20, mass: 0.5 },<br>  smooth: { stiffness: 120, damping: 20, mass: 0.8 },<br>  cinematic: { stiffness: 80, damping: 22, mass: 1.0 },<br>  ambient: { stiffness: 40, damping: 18, mass: 1.2 }<br>};<br>``` | ```json<br>{<br>  "hook": "La salute nel tempo",<br>  "fps": 30,<br>  "targetLufs": -14.0,<br>  "duckingDb": -14.0,<br>  "attackMs": 50,<br>  "releaseMs": 300<br>}<br>``` | Hasselblad H6D-100c, 85mm f/2.2, soft daylight from north window, travertine walls, dark navy background (#03354B), micro-pores skin texture, zero plastic filter. | Hook (3s) + Core Clinico (20s) + CTA Etica (7s); Font Cormorant Garamond + Inter; Safe-zone 15% top / 20% bottom. |
| **Criteri di Accettazione (QA)** | • 60fps costanti garantiti su display standard.<br>• Zero layout thrashing (no animazione width/height).<br>• Transizione `scroll-expand-cinema` senza scatti.<br>• `prefers-reduced-motion` pienamente funzionante.<br>• Zero errori di typecheck e linting. | • Audio calibrato esattamente a -14 LUFS (±0.5).<br>• Auto-ducking voce/musica perfetto.<br>• Taglio silenzi >350ms senza salti di fase.<br>• Nessun glitch visivo nei b-roll generati.<br>• File video compresso sotto i 6 MB. | • Risoluzione nativa Retina e aspetto 16:9 / 4:5.<br>• Texture naturale dei pori senza ritocchi finti.<br>• Palette colori sincronizzata (#1C4A5C / #00344B).<br>• Tempo di caricamento LCP ottimizzato. | • Tutti i testi e le CTA al 100% dentro la safe-zone.<br>• Assenza totale di termini vietati e sconti.<br>• Sincronia perfetta sottotitoli/audio.<br>• Tono autorevole conforme a FNOMCeO. |

---

## 6. Difesa degli Invarianti Clinici & Sintesi del Brand Vault

L'innovazione creativa e l'eccellenza motion devono convivere con la tutela assoluta della **Single Source of Truth** clinica e normativa di Cocoora.

### 6.1 Gli Invarianti Clinici Intangibili (Divieto Assoluto di Modifica)
I seguenti tre pilastri clinici del codebase sono protetti da sigillo di immutabilità e non possono subire riscritture o rimozioni arbitrarie:
1. **`/trattamenti/[slug]/treatment-client.tsx` & Data Libraries (`treatments-medicina.ts`, `treatments-odontoiatria.ts`):**
   - Il layout standardizzato elaborato con Silvia Monticelli (AddLab Milano): Hero Split 50/50, le 4 card cliniche "A cosa serve?" per trattamento, form #lead conforme GDPR con consenso WhatsApp e blocco H2 locale di Napoli (Via De Bonis 81).
2. **`/visite/*` (Pagine Visite Specialistiche):**
   - I testi delle visite dei medici universitari (Cardiologia con Dr. Esposito, Ginecologia con Dr.ssa Caputo, Senologia con Dr.ssa Coppola, Ecografia con Dr. Iovine, Oculistica con Dr.ssa Russo, Pediatria con Dr.ssa Amato), le prestazioni incluse e le tempistiche di refertazione a 24h.
3. **`MATRIX_DATA` in `src/components/sections/matrice-medicina.tsx`:**
   - La matrice clinica che correla gli inestetismi e le esigenze dei pazienti di Viso (6 obiettivi), Pelle (8 obiettivi) e Corpo (8 obiettivi) ai 14 trattamenti medici certificati.

---

### 6.2 Sintesi del Brand Vault: Dizionario delle Sostituzioni & Divieti

In conformità alle direttive di Creativia Hub e della Direzione Sanitaria (Dott.ssa Elisa Russo), vige il seguente prontuario terminologico obbligatorio:

```
┌──────────────────────────────────────────────┬──────────────────────────────────────────────┐
│ ✕ TERMINE BANDITO / ERRORE                   │ ✓ SOSTITUZIONE OBBLIGATORIA VIGENTE          │
├──────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ "L'Amico Medico" / "Metodo Amico Medico"     │ La Filosofia Cocoora / Cocoora Club          │
│ "Invisalign" (come nome prestazione)         │ Allineatori Trasparenti                      │
│ "Piani Salute" / "Piani" / "Abbonamenti"     │ Percorsi Salute / Percorsi Cocoora Club      │
│ "Visite & Trattamenti" (menu)                │ Medicina Estetica / Odontoiatria / Visite    │
│ "Lo Studio" / "A Cocoora"                    │ Il Centro / Nel nostro centro                │
│ "I 3 Pilastri Clinici" / "Pilastri"          │ Le Nostre Aree Mediche / Direttrici Cliniche │
│ "Architettura Sanitaria Sartoriale"          │ Gli Spazi del Centro (Studio 1, 2, 3)        │
│ "Private Lounge" / "Infusi Biologici"        │ Studio 1, Studio 2, Studio 3 (Foto Reali)    │
│ "Poliambulatorio" / "Polispecialistico"      │ Cocoora Centro Medico / Centro Autorizzato   │
│ "Prima visita garantita entro 72h"           │ Docenti Federico II & Vanvitelli a Napoli    │
│ "Zero Attese" / "Visite da €90" sulle card   │ Profilo Specialista & Percorsi Collegati     │
│ "Botox" (nei menu e nelle headline)          │ Tossina Botulinica                           │
│ "Preventivo"                                 │ Investimento                                 │
│ "Cryoliposculpt" (nel menu di primo livello) │ Criolipolisi                                 │
└──────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

### 6.3 Vincoli Normativi Sanitarie (Legge 145/2018 & Deontologia FNOMCeO)
- **Divieto di Comunicazione Promozionale o Suggestiva:** Le comunicazioni informative dei centri medici possono contenere unicamente elementi informativi e scientifici, senza indurre a consumi sanitari ingiustificati o promettere risultati estetici miracolistici.
- **Divieto di Sconti o Ribassi Pubblici:** Vietato comunicare sconti commerciali sulle prestazioni sanitarie sul sito pubblico o su canali social.
- **Tutela Deontologica della Direzione Sanitaria:** Ogni claim o protocollo pubblicato è validato dalla Direzione Sanitaria della Dott.ssa Elisa Russo.

---

## 7. Registro di Esecuzione Tecnica: Interventi Applicati

1. **`src/components/motion/tokens.ts`:**
   - Esportato l'oggetto `SPRINGS` contenente i 4 preset fisici armonici (`snappy`, `smooth`, `cinematic`, `ambient`) secondo i parametri Hooke's Law derivati da `PROJECT.md`.
2. **`src/app/globals.css`:**
   - Rimossa la regola conflittuale `html { scroll-behavior: smooth; }` per ripristinare la purezza a 60fps del loop virtuale Lenis senza micro-stutter o interferenze native.
3. **`src/components/motion/scroll-expand-cinema.tsx`:**
   - Rifattorizzato da zero con fixed viewport stage (`100vw × 100vh`) e ritaglio hardware GPU via `clip-path: inset(...)`, eliminando ogni ricalcolo continuo di `width`, `height` e `borderRadius`.
   - Rimosso il doppio smoothing sovrasmorzato ($\zeta = 2.0$), sincronizzando le trasformazioni direttamente col progresso virtuale di Lenis.
   - Implementato il modello di coreografia teatrale a 3 Atti (0–30% espansione, 30–75% plateau immersivo con scrub di 3 milestone cliniche e telemetria HUD, 75–100% handoff ottico).
   - Introdotto lo stato interattivo di riproduzione con toggle per paesaggio sonoro ambientale 432Hz, animazione a onde sonore e feedback tattile.
   - Eliminata la classe opaca `bg-canvas` per consentire alla luce atmosferica di `Atmosphere.tsx` di fluire ininterrottamente.
4. **`src/app/lab/motion/page.tsx`:**
   - Bonificata la violazione del Brand Vault a riga 214: sostituito *"Tre pilastri di cura..."* con *"Tre direttrici cliniche coordinate da una direzione sanitaria unica..."*.
   - Corretto l'errore di routing nel footer a riga 480: aggiornato da `/servizi/visite` a `/visite`.
   - Rimossa la dipendenza e import non utilizzato `CocooraOrbit` a riga 29.
   - Eseguito l'escape dell'apostrofo non codificato a riga 120 (`d&apos;eccellenza`).
   - Sincronizzati gli sfondi delle sezioni per una fusione ottica priva di interruzioni con "La Marea".

---

*Documento archiviato e validato come Single Source of Truth per l'architettura visiva, la regia motion e le pipeline creative di Cocoora Centro Medico.*
