import { useState } from "react";

export function CapsuleWallToggle() {
  const [view, setView] = useState<"timeline" | "grid">("timeline");

  return (
    <div className="flex items-center space-x-2 mb-4">
      <button onClick={() => setView("timeline")} className={view === "timeline" ? "font-bold" : ""}>
        Timeline View
      </button>
      <button onClick={() => setView("grid")} className={view === "grid" ? "font-bold" : ""}>
        Grid View
      </button>
    </div>
  );
}
