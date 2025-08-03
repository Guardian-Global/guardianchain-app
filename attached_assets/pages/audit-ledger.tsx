import { useEffect, useState } from "react";

export default function AuditLedger() {
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    fetch("/api/audit")
      .then((res) => res.json())
      .then(setLedger);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">⚖️ GriefScore Audit Ledger</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Capsule</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Chain</th>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Validator</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((entry, i) => (
            <tr key={i}>
              <td className="border p-2">{entry.title}</td>
              <td className="border p-2">{entry.score}</td>
              <td className="border p-2">{entry.chain}</td>
              <td className="border p-2">{entry.timestamp}</td>
              <td className="border p-2">{entry.validator}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
