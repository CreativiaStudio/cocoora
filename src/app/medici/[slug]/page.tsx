import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DOCTORS, getDoctorBySlug } from "@/lib/doctors";
import { DoctorClient } from "./doctor-client";

export function generateStaticParams() {
  return DOCTORS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return {};
  return {
    title: `${doctor.name} — ${doctor.branca}`,
    description: doctor.bio,
  };
}

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) notFound();
  return <DoctorClient doctor={doctor} />;
}
