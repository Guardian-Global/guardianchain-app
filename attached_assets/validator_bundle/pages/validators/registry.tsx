import { useEffect, useState } from "react";

export default function ValidatorRegistry() {
  const [validators, setValidators] = useState([]);

  useEffect(() => {
    fetch("/api/validators").then(res => res.json()).then(setValidators);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📇 Capsule Validator Registry</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2">Capsules Verified</th>
            <th className="p-2">Reputation</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {validators.map((v, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{v.name}</td>
              <td className="p-2 text-center">{v.capsules}</td>
              <td className="p-2 text-center">{v.rep}</td>
              <td className="p-2 text-center">{v.active ? "✅ Active" : "❌ Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
