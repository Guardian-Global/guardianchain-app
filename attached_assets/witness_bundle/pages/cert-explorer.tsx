import { useEffect, useState } from "react";

export default function CertExplorer() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetch("/api/certificates").then(res => res.json()).then(setCerts);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📜 Capsule Certificate Explorer</h1>
      <div className="grid grid-cols-2 gap-4">
        {certs.map((c, i) => (
          <div key={i} className="border p-3 rounded bg-white shadow-sm">
            <p><strong>Capsule:</strong> {c.title}</p>
            <p><strong>Author:</strong> {c.author}</p>
            <p><strong>Issued:</strong> {new Date(c.timestamp).toLocaleString()}</p>
            <a href={c.url} className="text-blue-600 underline text-sm" target="_blank">View PDF</a>
          </div>
        ))}
      </div>
    </div>
  );
}
