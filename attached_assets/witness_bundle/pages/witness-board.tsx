import { useEffect, useState } from "react";

export default function WitnessBoard() {
  const [testimonies, setTestimonies] = useState([]);
  const [newTestimony, setNewTestimony] = useState("");

  useEffect(() => {
    fetch("/api/witnesses").then(res => res.json()).then(setTestimonies);
  }, []);

  const submitTestimony = async () => {
    const res = await fetch("/api/witnesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newTestimony })
    });
    const data = await res.json();
    setTestimonies([...testimonies, data]);
    setNewTestimony("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📣 Witness Testimony Board</h1>
      <textarea
        value={newTestimony}
        onChange={(e) => setNewTestimony(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Write your testimony..."
      />
      <button onClick={submitTestimony} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      <ul className="mt-6 space-y-2 text-sm">
        {testimonies.map((t, i) => (
          <li key={i} className="border p-2 rounded">{t.message}</li>
        ))}
      </ul>
    </div>
  );
}
