import { useState } from "react";

export default function BadgeMint() {
  const [wallet, setWallet] = useState("");
  const [badge, setBadge] = useState("");

  const handleMint = async () => {
    const res = await fetch("/api/validators/mint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet })
    });
    const data = await res.json();
    setBadge(data.badge);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🏅 Mint Validator Badge</h1>
      <input
        type="text"
        placeholder="Wallet Address"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        className="p-2 border w-full mb-2 rounded"
      />
      <button onClick={handleMint} className="px-4 py-2 bg-blue-600 text-white rounded">
        Mint Badge
      </button>
      {badge && (
        <p className="mt-4 text-sm text-green-600">✅ Badge minted: {badge}</p>
      )}
    </div>
  );
}
