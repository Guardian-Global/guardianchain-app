import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CapsuleReelsPage() {
  const [reelTitle, setReelTitle] = useState("");
  const [capsules, setCapsules] = useState<string[]>([]);

  const addCapsule = (id: string) => {
    if (!capsules.includes(id)) setCapsules([...capsules, id]);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">📽 Create Your Capsule Reel</h1>
      <Input value={reelTitle} onChange={(e) => setReelTitle(e.target.value)} placeholder="Reel Title" />
      <Button onClick={() => alert("Saving reel...")}>Save Reel</Button>
      <div className="border rounded p-4 mt-4">
        <p>Select capsules to include in this reel.</p>
        {/* Capsule selector placeholder */}
      </div>
      {capsules.length > 0 && (
        <div className="text-sm mt-2 text-gray-500">Capsules in this reel: {capsules.join(", ")}</div>
      )}
    </div>
  );
}
