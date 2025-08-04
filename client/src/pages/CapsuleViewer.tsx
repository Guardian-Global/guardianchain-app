import { useState } from "react";
import { useLocation } from "wouter";
import { CapsuleDetailViewer } from "@/components/capsules/CapsuleDetailViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";

export default function CapsuleViewer() {
  const [location, setLocation] = useLocation();
  const [fullscreen, setFullscreen] = useState(false);
  
  // Extract capsule ID from URL
  const capsuleId = location.split('/').pop() || 'default';

  const handleBack = () => {
    setLocation('/explorer');
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-[#0d1117]`}>
      {!fullscreen && (
        <div className="border-b border-[#30363d] bg-[#161b22] p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} className="text-[#8b949e] hover:text-[#f0f6fc]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explorer
            </Button>
            <Button variant="ghost" onClick={toggleFullscreen} className="text-[#8b949e] hover:text-[#f0f6fc]">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {fullscreen && (
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" onClick={toggleFullscreen} className="text-[#8b949e] hover:text-[#f0f6fc]">
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <CapsuleDetailViewer
        capsuleId={capsuleId}
        onBack={fullscreen ? undefined : handleBack}
        fullscreen={fullscreen}
      />
    </div>
  );
}