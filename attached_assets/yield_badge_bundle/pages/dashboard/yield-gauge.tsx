import { useEffect, useState } from "react";

export default function YieldGauge() {
  const [yields, setYields] = useState([]);

  useEffect(() => {
    fetch("/api/dao/yields").then(res => res.json()).then(setYields);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📈 Validator Yield Gauge</h1>
      <ul className="space-y-2 text-sm">
        {yields.map((y, i) => (
          <li key={i} className="border p-3 rounded bg-white shadow-sm">
            <strong>{y.name}</strong><br />
            GTT Yield: {y.yield} GTT<br />
            Capsules Verified: {y.capsules}
          </li>
        ))}
      </ul>
    </div>
  );
}
