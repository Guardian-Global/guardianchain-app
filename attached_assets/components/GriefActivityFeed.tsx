import { useEffect, useState } from "react";

export default function GriefActivityFeed() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  return (
    <div className="border p-4 rounded max-w-3xl mx-auto">
      <h3 className="text-lg font-bold mb-4">📡 Grief Capsule Activity Feed</h3>
      <ul className="space-y-2 text-sm">
        {events.map((e, i) => (
          <li key={i} className="border-l-4 border-purple-600 pl-2">
            <span className="font-semibold">{e.title}</span> — {e.action} ({e.timestamp})
          </li>
        ))}
      </ul>
    </div>
  );
}
