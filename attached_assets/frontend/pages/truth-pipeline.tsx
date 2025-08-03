import { useEffect, useState } from "react";

export default function TruthPipeline() {
  const [capsule, setCapsule] = useState<any>(null);

  useEffect(() => {
    fetch("/api/truth-pipeline/status?id=22")
      .then((res) => res.json())
      .then(setCapsule);
  }, []);

  if (!capsule) return <p className="p-6">Loading pipeline...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">🔁 Truth Capsule Pipeline</h1>
      <p><strong>Capsule Status:</strong> {capsule.status}</p>
      <p><strong>Current Step:</strong> {capsule.currentStep}</p>
      <p><strong>AI Analysis Status:</strong> {capsule.aiAnalysis}</p>
      <p><strong>Yield Status:</strong> {capsule.yieldStatus}</p>
      <p><strong>IPFS Pinning:</strong> {capsule.ipfsPinned ? "Pinned" : "Pending"}</p>
    </div>
  );
}
