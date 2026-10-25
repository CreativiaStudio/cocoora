import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DOCTORS } from "@/lib/doctors";

export function generateStaticParams() {
  return DOCTORS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Specialisti ed Équipe Medica — Cocoora Centro Medico",
    description: "I medici e docenti universitari di Cocoora Centro Medico a Napoli.",
  };
}

export default async function DoctorPage() {
  redirect("/medici");
}
