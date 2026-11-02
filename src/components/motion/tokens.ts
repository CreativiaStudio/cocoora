/**
 * Cocoora — Motion Design Tokens
 *
 * Valori condivisi da tutte le animazioni del centro (reveal, marquee, orbit,
 * scroll-thread, spotlight). Le durate sono espresse in secondi, il formato
 * nativo di `motion` e delle Web Animations API.
 *
 * Palette di riferimento: teal primario #1C4A5C, navy #03354B,
 * slate #80A1B2, antracite #3D3D3C, bianco #FFFFFF.
 */

/** Curva cubic-bezier nel formato richiesto da `motion` / WAAPI. */
export type EaseTuple = readonly [number, number, number, number];

/**
 * Easing ufficiali: ingresso morbido ed elegante, uscita rapida,
 * transizioni di stato neutre.
 */
export const EASE = {
  /** Ingresso deciso ma morbido — default per reveal e fade-up. */
  out: [0.22, 1, 0.36, 1] as EaseTuple,
  /** Uscita rapida, per elementi che lasciano la scena. */
  in: [0.4, 0, 1, 1] as EaseTuple,
  /** Simmetrica, per transizioni di stato (hover, toggle, tab). */
  inOut: [0.65, 0, 0.35, 1] as EaseTuple,
  /** Enfasi editoriale per titoli e blocchi hero. */
  emphasized: [0.16, 1, 0.3, 1] as EaseTuple,
  /** Morbida e continua, per loop, marquee e rotazioni. */
  smooth: [0.45, 0, 0.55, 1] as EaseTuple,
  /** Nessuna curva: utile per loop a velocità costante. */
  linear: [0, 0, 1, 1] as EaseTuple,
} as const;

/**
 * Durate in secondi. Scala volutamente contenuta: il tono di voce del brand
 * è autorevole e clinico, non spettacolare.
 */
export const DUR = {
  /** Micro-feedback: hover, focus, cambio colore icona. */
  instant: 0.12,
  /** Interazioni rapide: bottoni, tab, chip della matrice interattiva. */
  fast: 0.2,
  /** Default per fade e slide dei contenuti. */
  base: 0.4,
  /** Reveal di card, immagini e blocchi di testo. */
  slow: 0.6,
  /** Sezioni intere e transizioni di pagina. */
  slower: 0.9,
  /** Sequenze hero / scroll-thread lunghi. */
  cinematic: 1.2,
} as const;

/**
 * Cadenze di stagger in secondi per animazioni orchestrate.
 * `delayChildren` è il ritardo iniziale del gruppo prima del primo figlio.
 */
export const STAGGER = {
  /** Liste fitte, righe di menu, tab. */
  tight: 0.04,
  /** Default per card e griglie di contenuti. */
  base: 0.08,
  /** Card grandi, blob immagine, elementi con molta superficie. */
  loose: 0.14,
  /** Passaggio tra macro-blocchi di una sezione. */
  section: 0.2,
  /** Ritardo del primo figlio rispetto al contenitore. */
  delayChildren: 0.1,
} as const;

export type EaseName = keyof typeof EASE;
export type DurationName = keyof typeof DUR;
export type StaggerName = keyof typeof STAGGER;

/**
 * Cocoora — Harmonic Physics Tokens
 * Formulated under Hooke's Law (Damped Harmonic Oscillators)
 * Sostituiscono gli easing rigidi con dinamiche fisiche continue.
 */
export const SPRINGS = {
  /** Snappy / Critical: Micro-interazioni, pulsanti, tab, chip della matrice clinica */
  snappy: { stiffness: 240, damping: 20, mass: 0.5 },
  /** Smooth / Spatial: Card reveal, accordion blades, quinte sceniche, drawer */
  smooth: { stiffness: 120, damping: 20, mass: 0.8 },
  /** Cinematic / Pinned: Scroll pinning, espansione cinema, camera tilt */
  cinematic: { stiffness: 80, damping: 22, mass: 1.0 },
  /** Floaty / Ambient: Luce caustica di sfondo, mesh luminosa, inerzia cursore */
  ambient: { stiffness: 40, damping: 18, mass: 1.2 },
} as const;

export type SpringPreset = keyof typeof SPRINGS;

