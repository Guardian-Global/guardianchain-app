import React from "react";
import { EnhancedCapsuleGallery } from "@/components/capsules/EnhancedCapsuleGallery";

export default function CapsulePreviewTest() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00ffe1] mb-4">
            Capsule Preview Test
          </h1>
          <p className="text-[#8b949e]">
            Testing the enhanced capsule preview functionality
          </p>
        </div>
        
        <EnhancedCapsuleGallery />
      </div>
    </div>
  );
}