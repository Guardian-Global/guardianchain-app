import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CapsuleReplay from "@/components/CapsuleReplay";
import TruthLineageGraph from "@/components/TruthLineageGraph";

export default function CapsulePage() {
  const router = useRouter();
  const { id } = router.query;
  const [capsule, setCapsule] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/capsules/${id}`)
        .then((res) => res.json())
        .then(setCapsule);
    }
  }, [id]);

  if (!capsule) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{capsule.name}</h1>
      <p className="text-gray-600">{capsule.description}</p>
      <p className="text-sm">GriefScore: {capsule.grief_score}</p>
      <p className="text-sm">Chain: {capsule.chain}</p>
      <p className="text-sm">Owner: {capsule.owner}</p>
      <a
        className="text-blue-600 underline text-sm"
        href={`https://ipfs.io/ipfs/${capsule.veritas_certificate}`}
        target="_blank"
      >
        View Veritas Certificate
      </a>
      <CapsuleReplay capsuleId={id} />
      <TruthLineageGraph />
    </div>
  );
}
