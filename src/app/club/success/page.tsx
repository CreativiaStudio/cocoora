"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";

function SuccessContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "club";
  const initialName = searchParams.get("name") || "Gentile Paziente";
  const initialCode = searchParams.get("code") || "";
  const sessionId = searchParams.get("session_id");

  const [patientCode, setPatientCode] = useState<string>(initialCode);
  const [patientName, setPatientName] = useState<string>(initialName);
  const [reconciling, setReconciling] = useState<boolean>(Boolean(sessionId && !initialCode));
  const [verified, setVerified] = useState<boolean>(Boolean(initialCode));

  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;
    async function verifyPayment() {
      try {
        setReconciling(true);
        const res = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId as string)}`);
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.verified) {
            setVerified(true);
            if (data.patientCode) setPatientCode(data.patientCode);
            if (data.patientName) setPatientName(data.patientName);
          }
        }
      } catch (err) {
        console.warn("Verifica sessione completata in background:", err);
      } finally {
        if (mounted) setReconciling(false);
      }
    }

    verifyPayment();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 sm:p-10 border border-teal-100 shadow-xl text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-12 w-12" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
            {tier === "discover" ? "Iscrizione Attiva · Cocoora Club" : "Pagamento Confermato · Cocoora Club"}
          </span>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mt-4">
            Benvenuto in Cocoora Club!
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Gentile <strong>{patientName}</strong>, grazie per aver scelto il percorso{" "}
            <strong className="text-teal-900 capitalize">{tier.replace(/-/g, " ")}</strong>. Il tuo profilo sanitario è attivo.
          </p>
        </div>

        {/* Codice Assistito Personale */}
        {patientCode ? (
          <div className="rounded-2xl bg-teal-50 border border-teal-200 p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
              Il tuo Codice Sanitario Personale
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-teal-950">
              {patientCode}
            </p>
            <p className="mt-1 text-[11px] text-charcoal/60">
              Conserva questo codice: ti servirà per accedere ai tuoi referti e appuntamenti nell&apos;Area Riservata.
            </p>
          </div>
        ) : reconciling ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
            <span>Generazione codice sanitario e sincronizzazione cartella clinica...</span>
          </div>
        ) : null}

        <div className="rounded-2xl bg-teal-50/70 p-5 border border-teal-100 text-left text-xs space-y-2.5">
          <div className="flex justify-between border-b border-teal-200/50 pb-2">
            <span className="text-slate-600">Entità Emittente:</span>
            <span className="font-semibold text-slate-900">PRIMECARE SRL</span>
          </div>
          <div className="flex justify-between border-b border-teal-200/50 pb-2">
            <span className="text-slate-600">Servizio:</span>
            <span className="font-semibold text-slate-900 capitalize">
              Percorso Salute {tier.replace(/-/g, " ")}
            </span>
          </div>
          {sessionId && (
            <div className="flex justify-between border-b border-teal-200/50 pb-2">
              <span className="text-slate-600">ID Ricevuta Digitale:</span>
              <span className="font-mono text-[11px] text-slate-800 truncate max-w-[220px]">{sessionId}</span>
            </div>
          )}
          <div className="flex justify-between pt-1">
            <span className="text-slate-600">Stato:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Attivo &amp; Registrato nel CRM
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs text-slate-600 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="font-semibold text-slate-800">Cosa succede adesso?</p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Riceverai la ricevuta digitale e il benvenuto direttamente via email.</li>
            <li>Il nostro team di segreteria ti contatterà per concordare la tua prima valutazione.</li>
            <li>Il tuo profilo è ora accessibile con il tuo codice nella tua Area Riservata.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={patientCode ? `/area-paziente?code=${patientCode}` : "/area-paziente"}
            className="w-full sm:w-auto"
          >
            <Button size="lg" className="w-full flex items-center justify-center gap-2">
              <User className="h-4 w-4" /> Vai all&apos;Area Paziente
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              Torna alla Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ClubSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-sm text-slate-500">Caricamento conferma transazione...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
