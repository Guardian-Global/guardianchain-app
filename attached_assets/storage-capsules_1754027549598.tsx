// === MODULE 29 – PHOTO + VIDEO CAPSULE PRICING PAGE ===

export default function StorageCapsules() {
  const options = [
    { size: "64GB", costUSD: 4.0 },
    { size: "128GB", costUSD: 7.5 },
    { size: "256GB", costUSD: 13.0 },
    { size: "512GB", costUSD: 24.0 },
    { size: "1TB", costUSD: 46.0 },
    { size: "2TB", costUSD: 90.0 },
  ];

  return (
    <div className="p-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          📸 Secure Capsule Storage for Life
        </h1>
        <p className="text-lg max-w-2xl">
          Stop paying monthly fees for data you don't own. With GuardianChain
          Storage Capsules, your most precious photos and videos are permanently
          encrypted and sealed on-chain. Private. Sovereign. Immutable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Choose Your Capsule Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {options.map(({ size, costUSD }, i) => {
            const markup = (costUSD * 1.25).toFixed(2);
            return (
              <div key={i} className="border p-6 rounded shadow">
                <h3 className="text-xl font-semibold mb-2">{size} Capsule</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Permanent on-chain storage
                </p>
                <p className="text-lg font-bold">${markup} USD</p>
                <button className="btn mt-4">Buy & Seal</button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16 bg-indigo-50 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">
          📦 Why Choose Guardian Capsules?
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          <li>Permanent IPFS + blockchain-based storage</li>
          <li>No monthly or hidden fees — ever</li>
          <li>Private ownership, sovereign control</li>
          <li>Encrypted & immortalized for legacy</li>
          <li>Backed by Veritas Seal with time-stamped proof</li>
        </ul>
      </section>
    </div>
  );
}
