import { useState, useEffect } from "react";

export default function CapsuleComments() {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/capsule-comments")
      .then((res) => res.json())
      .then(setComments);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">💬 Capsule Comments</h1>
      <ul className="space-y-2">
        {comments.map((comment, i) => (
          <li key={i} className="border p-4 rounded bg-white/70">
            <p><strong>{comment.user}</strong>: {comment.comment}</p>
            <small className="text-gray-500">Posted on {comment.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
