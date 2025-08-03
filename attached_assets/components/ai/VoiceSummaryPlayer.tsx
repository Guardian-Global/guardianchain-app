import { useEffect, useState } from "react";
import axios from "axios";

export function VoiceSummaryPlayer({ text }: { text: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchAudio = async () => {
      const res = await axios.post("/api/ai/tts", { text });
      setUrl(res.data.audioUrl);
    };
    fetchAudio();
  }, [text]);

  return (
    <div className="my-2">
      {url && <audio controls src={url} className="w-full" />}
    </div>
  );
}
