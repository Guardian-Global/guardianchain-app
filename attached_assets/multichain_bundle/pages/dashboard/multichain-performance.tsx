import { useEffect, useState } from "react";

export default function MultichainPerformance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/dao/multichain-performance").then(res => res.json()).then(setData);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🌐 Multichain Validator Performance</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Validator</th>
            <th className="p-2">Chain</th>
            <th className="p-2">Capsules</th>
            <th className="p-2">Reputation</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{v.name}</td>
              <td className="p-2 text-center">{v.chain}</td>
              <td className="p-2 text-center">{v.capsules}</td>
              <td className="p-2 text-center">{v.reputation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
