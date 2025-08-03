import { useEffect, useState } from "react";

export default function CapsuleReplay({ capsuleId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`/api/replay?capsuleId=${capsuleId}`)
      .then((res) => res.json())
      .then(setEvents);
  }, [capsuleId]);

  return (
    <div className="p-6 border rounded max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">⏳ Capsule Replay Timeline</h2>
      <ul className="space-y-2">
        {events.map((event, idx) => (
          <li key={idx} className="text-sm text-gray-700 border-l-2 pl-2 border-blue-500">
            <span className="font-semibold">{event.timestamp}:</span> {event.action}
          </li>
        ))}
      </ul>
    </div>
  );
}
