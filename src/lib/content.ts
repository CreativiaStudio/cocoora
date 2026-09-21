import { MEDICINA_ESTETICA_TREATMENTS } from "./treatments-medicina";
import { ODONTOIATRIA_TREATMENTS } from "./treatments-odontoiatria";
import type { Treatment, TreatmentCategory } from "./types";

export const TREATMENTS: Treatment[] = [
  ...ODONTOIATRIA_TREATMENTS,
  ...MEDICINA_ESTETICA_TREATMENTS,
];

export function getTreatmentsByCategory(category: TreatmentCategory): Treatment[] {
  return TREATMENTS.filter((t) => t.category === category);
}

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return TREATMENTS.find((t) => t.slug === slug);
}

export * from "./site";
export * from "./club";
export * from "./types";
