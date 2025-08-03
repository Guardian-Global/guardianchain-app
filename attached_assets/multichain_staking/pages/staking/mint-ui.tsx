import { useState } from "react";

export default function StakingMintUI() {
  const [wallet, setWallet] = useState("");
  const [staked, setStaked] = useState(0);
  const [message, setMessage] = useState("");

  const handleMint = async () => {
    const res = await fetch("/api/staking/mint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, staked })
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🪙 Mint GTT Staking Capsule</h1>
      <input
        type="text"
        placeholder="Wallet address"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        className="p-2 border w-full rounded mb-2"
      />
      <input
        type="number"
        placeholder="Amount to stake"
        value={staked}
        onChange={(e) => setStaked(Number(e.target.value))}
        className="p-2 border w-full rounded mb-2"
      />
      <button
        onClick={handleMint}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Mint
      </button>
      {message && <p className="mt-3 text-green-500 text-sm">{message}</p>}
    </div>
  );
}
