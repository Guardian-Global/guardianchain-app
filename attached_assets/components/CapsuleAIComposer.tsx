import { useState } from "react";

export default function CapsuleAIComposer() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = async () => {
    const res = await fetch("/api/ai/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setOutput(data.result);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">🧠 AI Text Composer</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your memory, emotion, or moment..."
        className="w-full p-2 border rounded"
        rows={3}
      />
      <button onClick={handleGenerate} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        Generate Capsule Text
      </button>
      {output && <p className="mt-4 text-sm text-gray-800">{output}</p>}
    </div>
  );
}
