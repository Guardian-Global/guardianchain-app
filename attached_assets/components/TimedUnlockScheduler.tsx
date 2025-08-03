import { useState } from "react";

export default function TimedUnlockScheduler({ onSchedule }) {
  const [unlockTime, setUnlockTime] = useState("");

  const handleSubmit = () => {
    const ts = new Date(unlockTime).getTime();
    if (!ts) return alert("Invalid date");
    onSchedule(ts);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">⏳ Schedule Unlock Time</h3>
      <input
        type="datetime-local"
        value={unlockTime}
        onChange={(e) => setUnlockTime(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        Set Unlock Timestamp
      </button>
    </div>
  );
}
