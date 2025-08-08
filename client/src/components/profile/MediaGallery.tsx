// client/src/components/profile/MediaGallery.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type MediaItem = {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  title?: string;
  grief_score?: number;
  unlocks?: number;
  uploaded_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MediaGallery({
  wallet,
  filter
}: {
  wallet: string;
  filter: "all" | "image" | "video" | "audio";
}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, [wallet]);

  async function loadMedia() {
    const { data, error } = await supabase
      .from("media_uploads")
      .select("*")
      .eq("owner_wallet", wallet)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Media fetch error:", error);
      return;
    }

    const parsed = (data || []).map((item: any) => {
      const ext = item.url?.split(".").pop()?.toLowerCase();
      let type: MediaItem["type"] = "image";
      if (["mp4", "webm"].includes(ext)) type = "video";
      if (["mp3", "wav", "ogg"].includes(ext)) type = "audio";

      return {
        id: item.id,
        type,
        url: item.url,
        title: item.title,
        grief_score: item.grief_score,
        unlocks: item.unlocks,
        uploaded_at: item.uploaded_at
      };
    });

    setMedia(parsed);
    setLoading(false);
  }

  const filtered = filter === "all" ? media : media.filter((m) => m.type === filter);

  if (loading) return <p className="text-gray-500">Loading media...</p>;

  if (filtered.length === 0)
    return <p className="text-gray-400">No {filter} media found.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {filtered.map((item) => (
        <div key={item.id} className="relative rounded overflow-hidden shadow bg-white">
          {item.type === "image" && (
            <img src={item.url} className="w-full h-48 object-cover" />
          )}
          {item.type === "video" && (
            <video controls className="w-full h-48 object-cover">
              <source src={item.url} />
            </video>
          )}
          {item.type === "audio" && (
            <audio controls className="w-full px-2 py-4 bg-gray-100">
              <source src={item.url} />
            </audio>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 flex justify-between">
            <span>{item.title || "Untitled"}</span>
            {item.grief_score !== undefined && (
              <span className="text-yellow-300">⚡ {item.grief_score.toFixed(1)}</span>
            )}
            {item.unlocks !== undefined && (
              <span className="text-green-300">🔓 {item.unlocks}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
