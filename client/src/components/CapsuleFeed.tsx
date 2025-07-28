// src/components/CapsuleFeed.tsx

import { mockCapsules } from "../data/mockCapsules";
import { sortByGrief } from "../utils/sortByGrief";
import { CapsuleCard } from "./CapsuleCard";

export const CapsuleFeed = () => {
  const capsules = sortByGrief(mockCapsules);

  return (
    <div className="mt-6">
      {capsules.map((capsule) => (
        <CapsuleCard key={capsule.id} capsule={capsule} />
      ))}
    </div>
  );
};
