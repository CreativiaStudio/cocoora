import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
        Errore 404
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-teal-900 sm:text-5xl">
        Pagina non trovata
      </h1>
      <p className="mt-3 max-w-md text-sm text-charcoal/70">
        La pagina che stai cercando non esiste o è stata spostata. Torna alla home per esplorare i nostri servizi.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-teal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Torna alla Homepage
      </Link>
    </div>
  );
}
