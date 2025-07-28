// src/utils/sortByGrief.ts

import { Capsule } from "../data/mockCapsules";

export function sortByGrief(capsules: Capsule[]): Capsule[] {
  return [...capsules].sort((a, b) => b.griefScore - a.griefScore);
}
