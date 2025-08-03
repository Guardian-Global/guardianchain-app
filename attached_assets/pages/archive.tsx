import { useEffect, useState } from "react";

export default function CapsuleArchive() {
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    fetch("/api/capsules/archive")
      .then((res) => res.json())
      .then(setCapsules);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🗂 Capsule Archive Viewer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capsules.map((cap, i) => (
          <div key={i} className="border p-4 rounded bg-white shadow">
            <h3 className="font-semibold">{cap.title}</h3>
            <p className="text-xs text-gray-600">{cap.date}</p>
            <p className="text-sm">{cap.description}</p>
            <p className="text-xs mt-1">Chain: {cap.chain} | Score: {cap.griefScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
