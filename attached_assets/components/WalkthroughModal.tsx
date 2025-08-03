// WalkthroughModal.tsx — Basic Step Modal (can extend with react-joyride)
import { useState } from "react";

const steps = [
  { title: "Step 1", text: "Create a Capsule to begin your truth." },
  { title: "Step 2", text: "Replay or mint capsules into NFTs." },
  { title: "Step 3", text: "Claim GTT yield based on grief." },
  { title: "Step 4", text: "View your SMRI Score & Lineage." },
];

export default function WalkthroughModal() {
  const [step, setStep] = useState(0);
  if (step >= steps.length) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold">{steps[step].title}</h2>
        <p>{steps[step].text}</p>
        <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
