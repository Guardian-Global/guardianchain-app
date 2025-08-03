import { useState } from "react";

export function TranslateToggle({ summary, translated }: { summary: string; translated: string }) {
  const [showTranslated, setShowTranslated] = useState(false);

  return (
    <div className="text-sm mt-2">
      <button
        onClick={() => setShowTranslated(!showTranslated)}
        className="text-blue-600 underline mb-1"
      >
        {showTranslated ? "Show Original" : "Translate"}
      </button>
      <p className="text-gray-700">{showTranslated ? translated : summary}</p>
    </div>
  );
}
