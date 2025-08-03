import { useEffect, useState } from "react";

export default function DAORanking() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch("/api/dao/ranking").then(res => res.json()).then(setScores);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🏆 DAO Reputation Rankings</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Validator</th>
            <th className="p-2 text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2 text-center">{s.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
