import { useEffect, useState } from "react";

export default function ClaimsVault() {
  const [wallet, setWallet] = useState("");
  const [capsules, setCapsules] = useState([]);

  const fetchClaims = async () => {
    const res = await fetch(`/api/claims?wallet=${wallet}`);
    const data = await res.json();
    setCapsules(data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📁 Legacy Capsule Claims</h1>
      <div className="mb-4">
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter your wallet address"
          className="p-2 border rounded w-full"
        />
        <button onClick={fetchClaims} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Check Claims
        </button>
      </div>
      <ul className="space-y-3 text-sm">
        {capsules.map((cap, i) => (
          <li key={i} className="border p-3 rounded bg-gray-50">
            <strong>{cap.title}</strong><br />
            GriefScore: {cap.griefScore} — Unlock: {cap.unlockDate}<br />
            {cap.isUnlocked ? (
              <span className="text-green-700 font-semibold">✅ Claim Now</span>
            ) : (
              <span className="text-red-600">🔒 Locked</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
