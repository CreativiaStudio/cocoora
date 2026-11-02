// Motion tokens — sistema di movimento Cocoora.
// Fonte unica di verità per curve di easing, molle, durate e stagger.
// I valori sono tipizzati per essere passati direttamente alle transition di motion/react.

/** Curva di Bézier cubica nel formato accettato da motion/react. */
export type BezierEase = [number, number, number, number];

/** Token di easing condivisi da tutte le animazioni del sito. */
export const ease = {
  /** A marea: entrata decisa, assestamento morbido. Default per reveal e transizioni. */
  tide: [0.22, 1, 0.36, 1] as BezierEase,
  /** Respiro: simmetrica, per loop e movimenti continui. */
  breath: [0.65, 0, 0.35, 1] as BezierEase,
  /** Uscita: rapida e senza rimbalzo, per elementi che lasciano la scena. */
  exit: [0.55, 0, 1, 0.45] as BezierEase,
} as const;

export type EaseName = keyof typeof ease;

/** Token spring: fisica delle interazioni (hover, tap, pannelli). */
export type SpringToken = {
  type: "spring";
  stiffness: number;
  damping: number;
  mass?: number;
};

export const spring = {
  /** Superfici in vetro: movimento ampio e rallentato, mai elastico. */
  glass: {
    type: "spring",
    stiffness: 180,
    damping: 26,
    mass: 0.9,
  },
  /** Feedback tattile: risposta immediata su hover e tap. */
  touch: {
    type: "spring",
    stiffness: 420,
    damping: 32,
  },
} as const satisfies Record<string, SpringToken>;

export type SpringName = keyof typeof spring;

/** Durate in secondi, allineate alla scala del design system. */
export const dur = {
  /** Micro-interazioni: hover, focus, cambio stato. */
  micro: 0.18,
  /** Transizioni di interfaccia: dropdown, accordion, tab. */
  ui: 0.45,
  /** Reveal di sezioni e blocchi in scroll. */
  reveal: 0.9,
  /** Scene cinematografiche e transizioni di pagina. */
  scene: 1.6,
} as const;

export type DurationName = keyof typeof dur;

/** Ritardi in secondi per animazioni sequenziate. */
export const stagger = {
  /** Liste compatte e icone. */
  tight: 0.04,
  /** Default per card e gruppi di elementi. */
  base: 0.08,
  /** Composizioni editoriali con respiro ampio. */
  loose: 0.14,
} as const;

export type StaggerName = keyof typeof stagger;
