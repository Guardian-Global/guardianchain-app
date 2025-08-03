import { useState } from "react";

export function CapsuleUploader({ onChange }: { onChange: () => void }) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      onChange();
    }
  };

  return (
    <div className="rounded border p-4 bg-white shadow">
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Media or Capsule</label>
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      {file && <p className="mt-2 text-sm">Selected: {file.name}</p>}
    </div>
  );
}
