import { useState } from "react";

export function CapsulePrivacyToggle({ onChange }: { onChange: (val: string) => void }) {
  const [privacy, setPrivacy] = useState("public");

  const handleChange = (val: string) => {
    setPrivacy(val);
    onChange(val);
  };

  return (
    <div className="text-sm space-x-2 mt-2">
      <span className="font-semibold">Privacy:</span>
      {["public", "followers", "private"].map((p) => (
        <button key={p} onClick={() => handleChange(p)} className={privacy === p ? "underline" : ""}>
          {p}
        </button>
      ))}
    </div>
  );
}
