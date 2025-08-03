import { useEffect, useState } from "react";

export default function AttestationSync() {
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    fetch("/api/sync/attestations").then(res => res.json()).then(setCapsules);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🔁 Global Attestation Sync</h1>
      <ul className="space-y-3 text-sm">
        {capsules.map((c, i) => (
          <li key={i} className="border p-3 rounded bg-white shadow-sm">
            <strong>{c.capsuleId}</strong><br />
            Attested on: {c.chains.join(", ")}<br />
            Validator: {c.validator}
          </li>
        ))}
      </ul>
    </div>
  );
}
