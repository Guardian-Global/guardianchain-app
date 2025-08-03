import { useState } from "react";
import { CapsuleUploader } from "@/components/profile/CapsuleUploader";
import { CapsuleTimeline } from "@/components/profile/CapsuleTimeline";
import { SavePromptGuard } from "@/components/profile/SavePromptGuard";

export default function ProfilePage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  return (
    <SavePromptGuard active={hasUnsavedChanges}>
      <div className="space-y-4 p-6">
        <CapsuleUploader onChange={() => setHasUnsavedChanges(true)} />
        <CapsuleTimeline />
      </div>
    </SavePromptGuard>
  );
}
