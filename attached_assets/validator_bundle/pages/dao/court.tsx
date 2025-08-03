import { useState, useEffect } from "react";

export default function DAOCourt() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetch("/api/dao/court").then(res => res.json()).then(setCases);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🏛 DAO Court - Case Review</h1>
      {cases.map((c, i) => (
        <div key={i} className="border p-4 rounded mb-2 bg-white shadow-sm">
          <p><strong>Case:</strong> {c.case}</p>
          <p><strong>Filed by:</strong> {c.filedBy}</p>
          <p><strong>Status:</strong> {c.status}</p>
          <p><strong>Votes:</strong> ✅ {c.votes.yes} | ❌ {c.votes.no}</p>
        </div>
      ))}
    </div>
  );
}
