import { useState } from "react";

export default function HybridCapsuleUploader() {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [type, setType] = useState("text");

  const handleFile = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", media);
    formData.append("caption", caption);
    formData.append("type", type);

    await fetch("/api/capsules/hybrid", {
      method: "POST",
      body: formData
    });
    alert("Uploaded!");
  };

  return (
    <div className="p-4 border rounded space-y-3">
      <h3 className="font-semibold">📥 Upload Capsule (Hybrid)</h3>
      <select onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded">
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="audio">Voice</option>
      </select>
      <input type="file" onChange={handleFile} className="w-full p-2 border" />
      <textarea
        placeholder="Caption or grief note"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
      />
      <button onClick={handleUpload} className="px-4 py-2 bg-green-600 text-white rounded">Upload Capsule</button>
    </div>
  );
}
