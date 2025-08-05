// Enhanced profile page with avatar, media, capsule reels, and engagement
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserProfile() {
  const { query } = useRouter();
  const wallet = query.wallet;
  const [selectedTab, setSelectedTab] = useState("reels");

  return (
    <div className="p-6">
      <div className="flex items-center gap-6">
        <img src="/avatar.png" className="w-24 h-24 rounded-full border" />
        <div>
          <h1 className="text-3xl font-bold">👤 Profile: {wallet}</h1>
          <p className="text-gray-600">Veritas Tier • Joined 2025 • 12 Friends</p>
          <div className="mt-2 space-x-3">
            <button className="btn btn-outline">➕ Add Friend</button>
            <button className="btn btn-outline">🧠 Invite to Capsule</button>
            <button className="btn btn-outline">💬 Message</button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="space-x-6 border-b pb-2">
          {["reels", "media", "friends", "groups", "filters", "text2media"].map(tab => (
            <button
              key={tab}
              className={\`uppercase text-sm font-semibold \${selectedTab === tab ? "text-blue-600" : "text-gray-500"}\`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {selectedTab === "reels" && <p>🎥 Capsule Reels: Showcase of capsule threads and replay chains.</p>}
          {selectedTab === "media" && <p>📸 Uploaded Pictures & Videos with AI tags + grief scores.</p>}
          {selectedTab === "friends" && <p>👥 Friend list, followers, mutual interactions.</p>}
          {selectedTab === "groups" && <p>🫂 Memory groups or capsule collectives this user belongs to.</p>}
          {selectedTab === "filters" && <p>🎨 AI picture/video filters: moodify, griefify, veritasify.</p>}
          {selectedTab === "text2media" && (
            <div className="space-y-4">
              <p>🪄 Text → Image / Video Generator</p>
              <input className="border p-2 w-full max-w-xl" placeholder="Describe a memory..." />
              <div className="flex gap-4 mt-2">
                <button className="btn btn-blue">🖼 Generate Image</button>
                <button className="btn btn-purple">🎬 Generate Video</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
