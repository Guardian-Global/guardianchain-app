// src/components/CapsuleCard.tsx

import { Capsule } from "../data/mockCapsules";

type Props = {
  capsule: Capsule;
};

export const CapsuleCard = ({ capsule }: Props) => {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white dark:bg-gray-900 mb-4">
      <h3 className="text-xl font-semibold">{capsule.title}</h3>
      <p className="text-sm text-gray-500">
        {capsule.creator} · {capsule.timestamp}
      </p>
      <p className="mt-2 text-gray-800 dark:text-gray-200">{capsule.content}</p>
      <div className="mt-4 flex justify-between text-sm">
        <span
          className={`font-bold ${
            capsule.status === "Verified" ? "text-green-600" : "text-yellow-500"
          }`}
        >
          {capsule.status}
        </span>
        <span>Grief Score: {capsule.griefScore}</span>
        <span>+{capsule.gttEarned} GTT</span>
      </div>
    </div>
  );
};
