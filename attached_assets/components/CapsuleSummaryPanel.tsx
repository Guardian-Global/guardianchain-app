import { useState } from "react";

export default function CapsuleSummaryPanel({ content }) {
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });
    const data = await res.json();
    setSummary(data.summary);
  };

  return (
    <div className="mt-6 p-4 border rounded">
      <h3 className="font-semibold">🧠 Capsule AI Summary</h3>
      <button onClick={handleSummarize} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        Generate Summary
      </button>
      {summary && <p className="mt-4 text-sm text-gray-800">{summary}</p>}
    </div>
  );
}
