/**
 * Next.js Instrumentation Hook (eseguito all'avvio del server Node)
 *
 * Problema: Node.js 22+ con il flag `--localstorage-file` (senza path valido)
 * inietta un oggetto `globalThis.localStorage` parziale nel processo Node.
 * Questo oggetto esiste (truthy) ma i suoi metodi (getItem, setItem, ecc.)
 * non sono implementati, causando `TypeError: localStorage.getItem is not a function`
 * durante il Server-Side Rendering di Next.js.
 *
 * Soluzione: rimuovere il localStorage globale rotto all'avvio del server,
 * prima che React esegua qualsiasi rendering SSR. I componenti client-side
 * che usano localStorage sono già protetti con guard `typeof window`,
 * quindi lato browser funzionano correttamente.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Verifica se localStorage è presente ma con metodi non funzionanti
    const ls = (globalThis as Record<string, unknown>).localStorage as
      | Storage
      | undefined;
    if (
      ls !== undefined &&
      typeof (ls as Storage | undefined)?.getItem !== "function"
    ) {
      // Rimuove il localStorage rotto iniettato da --localstorage-file
      delete (globalThis as Record<string, unknown>).localStorage;
    }
  }
}
