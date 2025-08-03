import { useState } from "react";

export default function TruthMarket() {
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    const res = await fetch("/api/market/offers");
    const data = await res.json();
    setOffers(data.offers);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🪙 Truth Market</h1>
      <button onClick={fetchOffers} className="bg-purple-600 text-white px-4 py-2 rounded">Refresh Offers</button>
      <ul className="mt-4 space-y-2">
        {offers.map((o, i) => (
          <li key={i} className="border p-3 rounded bg-white/70 shadow">
            Capsule: {o.title} | Bid: {o.amount} GTT
          </li>
        ))}
      </ul>
    </div>
  );
}
