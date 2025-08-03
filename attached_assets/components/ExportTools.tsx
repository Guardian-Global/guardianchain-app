// ExportTools.tsx — CSV + PDF export for GuardianMap results
import { useState } from "react";

export default function ExportTools({ results }) {
  function downloadCSV() {
    const headers = Object.keys(results[0]);
    const csv = [
      headers.join(","),
      ...results.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "guardianmap_results.csv";
    link.click();
  }

  return (
    <div className="mt-4">
      <button onClick={downloadCSV} className="px-3 py-1 bg-green-600 text-white rounded">
        ⬇️ Export CSV
      </button>
    </div>
  );
}
