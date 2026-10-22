import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { PatientPortal } from "@/components/patient/patient-portal";
import { Container, SectionLabel } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Area Paziente — Fascicolo Digitale, Referti & Calendario | Cocoora Centro Medico",
  description:
    "Accedi al tuo fascicolo sanitario digitale Cocoora: consulta e scarica referti clinici, verifica gli appuntamenti, monitora i piani terapeutici e prenota visite in tempo reale.",
};

export default function AreaPazientePage() {
  return (
    <main className="min-h-screen bg-slate-50/70 pt-24 sm:pt-28 pb-20">
      <Container>
        <div className="mx-auto max-w-6xl">
          <PatientPortal />
        </div>
      </Container>
    </main>
  );
}
