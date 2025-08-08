// client/src/components/profile/MediaGallery.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  title?: string;
  uploaded_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MediaGallery({ wallet }: { wallet: string }) {
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

    setMedia(
      (data || []).map((item: any) => ({
        id: item.id,
        type: item.url.match(/\.(mp4|webm)$/i) ? "video" : "image",
        url: item.url,
        title: item.title,
        uploaded_at: item.uploaded_at,
      }))
    );
    setLoading(false);
  }

  if (loading) return <p className="text-gray-500">Loading media...</p>;

  if (media.length === 0)
    return <p className="text-gray-400">No media uploaded yet.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {media.map((item) => (
        <div key={item.id} className="rounded overflow-hidden shadow-md bg-white">
          {item.type === "image" ? (
            <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
          ) : (
            <video controls className="w-full h-48 object-cover">
              <source src={item.url} />
            </video>
          )}
          {item.title && (
            <div className="px-2 py-1 text-xs text-gray-600">{item.title}</div>
          )}
        </div>
      ))}
    </div>
  );
}
