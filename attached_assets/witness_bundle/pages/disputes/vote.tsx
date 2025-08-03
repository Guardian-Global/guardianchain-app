import { useEffect, useState } from "react";

export default function VotePage() {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetch("/api/disputes/open").then(res => res.json()).then(setProposals);
  }, []);

  const vote = async (id, vote) => {
    await fetch("/api/disputes/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, vote })
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🗳 Dispute Voting</h1>
      {proposals.map((p, i) => (
        <div key={i} className="border p-4 rounded mb-2">
          <p>{p.issue}</p>
          <div className="mt-2 flex space-x-2">
            <button onClick={() => vote(p.id, "yes")} className="px-4 py-1 bg-green-600 text-white rounded">Yes</button>
            <button onClick={() => vote(p.id, "no")} className="px-4 py-1 bg-red-600 text-white rounded">No</button>
          </div>
        </div>
      ))}
    </div>
  );
}
