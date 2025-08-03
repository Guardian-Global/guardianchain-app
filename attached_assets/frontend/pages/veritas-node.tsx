import { useState, useEffect } from "react";

export default function VeritasNode() {
  const [nodeStatus, setNodeStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/veritas-node/status")
      .then((res) => res.json())
      .then(setNodeStatus);
  }, []);

  if (!nodeStatus) return <p className="p-6">Loading node status...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">🛰 Veritas Validator Node</h1>
      <p><strong>Node ID:</strong> {nodeStatus.nodeId}</p>
      <p><strong>Proofs Submitted:</strong> {nodeStatus.proofs}</p>
      <p><strong>Stake Held:</strong> {nodeStatus.stake}</p>
      <p><strong>Uptime:</strong> {nodeStatus.uptime}%</p>
      <p><strong>Slashing Risk:</strong> {nodeStatus.slashingRisk ? "High" : "Low"}</p>
    </div>
  );
}
