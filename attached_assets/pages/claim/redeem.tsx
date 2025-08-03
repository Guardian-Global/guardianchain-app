import { useState } from "react";

export default function RedeemCapsulePage() {
  const [capsuleId, setCapsuleId] = useState("");
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState(null);

  const handleRedeem = async () => {
    const res = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capsuleId, wallet })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🔓 Redeem Your Capsule</h1>
      <input
        type="text"
        placeholder="Capsule ID"
        value={capsuleId}
        onChange={(e) => setCapsuleId(e.target.value)}
        className="p-2 border rounded w-full mb-2"
      />
      <input
        type="text"
        placeholder="Your Wallet Address"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        className="p-2 border rounded w-full mb-2"
      />
      <button
        onClick={handleRedeem}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Redeem Capsule
      </button>
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50 text-sm">
          {result.success ? (
            <div>
              ✅ Redeemed at: {result.redeemedAt}<br />
              Capsule ID: {result.capsuleId}
            </div>
          ) : (
            <div>❌ {result.reason}</div>
          )}
        </div>
      )}
    </div>
  );
}
