import React, { useState } from "react";

export default function StakingDashboard() {
  // Placeholder state
  const [staked, setStaked] = useState(0);
  const [amount, setAmount] = useState(0);
  const [rewards, setRewards] = useState(0.12); // Example yield

  const handleStake = () => {
    setStaked(staked + amount);
    setAmount(0);
  };

  const handleUnstake = () => {
    setStaked(0);
  };

  const handleClaim = () => {
    setRewards(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white/90 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">GTT Staking Dashboard</h1>
      <div className="mb-6 p-4 bg-indigo-50 rounded">
        <p className="text-lg font-semibold">Staked: <span className="text-indigo-600">{staked} GTT</span></p>
        <p className="text-lg font-semibold">Rewards: <span className="text-green-600">{rewards} GTT</span></p>
      </div>
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          min="0"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="border rounded px-4 py-2 w-32"
          placeholder="Amount"
        />
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          onClick={handleStake}
        >
          Stake
        </button>
        <button
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          onClick={handleUnstake}
        >
          Unstake
        </button>
      </div>
      <button
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        onClick={handleClaim}
        disabled={rewards === 0}
      >
        Claim Rewards
      </button>
    </div>
  );
}
