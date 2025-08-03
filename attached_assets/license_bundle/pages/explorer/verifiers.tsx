import { useEffect, useState } from "react";

export default function VerifierExplorer() {
  const [verifiers, setVerifiers] = useState([]);

  useEffect(() => {
    fetch("/api/explorer/verifiers")
      .then(res => res.json())
      .then(setVerifiers);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🧠 Live Capsule Verifiers</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Validator</th>
            <th className="p-2">Capsules Verified</th>
            <th className="p-2">Disputes Handled</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {verifiers.map((v, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{v.name}</td>
              <td className="p-2 text-center">{v.verified}</td>
              <td className="p-2 text-center">{v.disputes}</td>
              <td className="p-2 text-center">{v.active ? "✅ Active" : "❌ Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
