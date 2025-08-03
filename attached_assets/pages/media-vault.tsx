import { useEffect, useState } from "react";

export default function MediaVault() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then(setFiles);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔐 Encrypted Capsule Media Vault</h1>
      <ul className="space-y-3 text-sm">
        {files.map((file, i) => (
          <li key={i} className="border p-3 rounded bg-gray-50">
            <p>🧾 <strong>{file.name}</strong></p>
            <p className="text-gray-600">Encrypted CID: {file.cid}</p>
            <p>Status: {file.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
