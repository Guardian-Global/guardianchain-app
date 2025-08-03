import { useState } from "react";

export default function BadgeNFTMinter() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const handleMint = async () => {
    const res = await fetch("/api/validators/nft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet })
    });
    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🪙 Mint Validator Badge NFT</h1>
      <input
        type="text"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        className="p-2 border rounded w-full mb-2"
        placeholder="Enter wallet address"
      />
      <button onClick={handleMint} className="px-4 py-2 bg-indigo-600 text-white rounded">
        Mint NFT
      </button>
      {status && <p className="text-green-600 mt-4">{status}</p>}
    </div>
  );
}
