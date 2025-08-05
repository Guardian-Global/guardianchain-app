import { useEffect, useState } from "react";
import axios from "axios";

export function CapsuleAutotagger({ file }: { file: File }) {
  const [tags, setTags] = useState<string[]>([]);
  const [emotion, setEmotion] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      const res = await axios.post("/api/ai/capsule-tags", { name: file.name });
      setTags(res.data.tags);
      setEmotion(res.data.emotion);
    };
    fetchTags();
  }, [file]);

  return (
    <div className="mt-2 text-sm text-gray-600">
      <p>Emotion: {emotion}</p>
      <p>Tags: {tags.join(", ")}</p>
    </div>
  );
}
