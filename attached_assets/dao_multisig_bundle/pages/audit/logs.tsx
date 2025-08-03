import { useEffect, useState } from "react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/audit/logs")
      .then((res) => res.json())
      .then(setLogs);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📜 Public Audit Logs</h1>
      <ul className="space-y-2">
        {logs.map((log, i) => (
          <li key={i} className="border p-2 rounded bg-white shadow-sm text-sm">
            <strong>{log.event}</strong><br />
            <em>{log.timestamp}</em><br />
            Attested by: {log.validator}
          </li>
        ))}
      </ul>
    </div>
  );
}
