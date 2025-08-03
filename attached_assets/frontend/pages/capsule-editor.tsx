import { useState, useEffect } from "react";

export default function CapsuleEditor() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Draft");

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/editor/autosave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      setStatus("Saving...");
    }, 3000);

    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Capsule Editor</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        placeholder="Write your eternal truth..."
        className="w-full p-4 border rounded text-sm"
      />
      <p className="text-right text-xs text-gray-500 mt-2">{status}</p>
    </div>
  );
}
