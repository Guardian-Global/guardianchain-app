import React from "react";

// Placeholder data for capsules
const capsules = [
  {
    id: "1",
    title: "Genesis Capsule",
    price: "0.5 GTT",
    image: "/assets/logo.png",
    owner: "0x123...abcd",
    description: "The very first memory capsule minted on GuardianChain."
  },
  {
    id: "2",
    title: "Memory of Hope",
    price: "1.2 GTT",
    image: "/assets/logo.png",
    owner: "0x456...efgh",
    description: "A capsule representing hope and new beginnings."
  }
];

export default function Marketplace() {
  return (
    <div className="max-w-5xl mx-auto p-8 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Capsule NFT Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {capsules.map((capsule) => (
          <div key={capsule.id} className="bg-white/90 rounded-xl shadow-lg p-6 flex flex-col">
            <img src={capsule.image} alt={capsule.title} className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-xl font-semibold mb-2">{capsule.title}</h2>
            <p className="text-gray-600 mb-2">{capsule.description}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-indigo-600 font-bold">{capsule.price}</span>
              <span className="text-xs text-gray-400">Owner: {capsule.owner}</span>
            </div>
            <button className="mt-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Buy Capsule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
