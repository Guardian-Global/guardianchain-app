// CapsuleSearch.tsx — search UI with CSV + PDF export
import { useState } from "react";
import ExportTools from "./ExportTools";
import PDFExport from "./PDFExport";

export default function CapsuleSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const res = await fetch(`/api/search-capsules?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results || []);
  }

  return (
    <div className="mb-12">
      <input
        type="text"
        placeholder="Search by keyword, grief tier, tag..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 p-2 rounded w-80"
      />
      <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Search</button>

      {results.length > 0 && (
        <>
          <ExportTools results={results} />
          <PDFExport data={results} />
        </>
      )}

      <ul className="mt-6 space-y-2">
        {results.map((r) => (
          <li key={r.id} className="border p-4 rounded shadow">
            <p><strong>ID:</strong> {r.id}</p>
            <p><strong>Grief Tier:</strong> {r.grief_tier}</p>
            <p><strong>Tags:</strong> {r.tags?.join(", ")}</p>
            <a href={`/capsule/${r.id}`} className="text-blue-500 text-sm mt-1 block">→ View Capsule</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
