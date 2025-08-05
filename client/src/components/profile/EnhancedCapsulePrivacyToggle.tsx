import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Globe, 
  Users, 
  Eye,
  Shield,
  Settings
} from "lucide-react";

type PrivacyLevel = "public" | "followers" | "private" | "time-locked" | "premium";

interface EnhancedCapsulePrivacyToggleProps {
  onChange?: (level: PrivacyLevel) => void;
  defaultLevel?: PrivacyLevel;
  className?: string;
  variant?: 'compact' | 'detailed';
}

export default function EnhancedCapsulePrivacyToggle({ 
  onChange, 
  defaultLevel = "public",
  className = "",
  variant = 'detailed'
}: EnhancedCapsulePrivacyToggleProps) {
  const [privacy, setPrivacy] = useState<PrivacyLevel>(defaultLevel);

  const privacyOptions = [
    {
      value: "public" as PrivacyLevel,
      label: "Public",
      icon: Globe,
      description: "Visible to everyone",
      color: "text-green-400 bg-green-500/20 border-green-500/30"
    },
    {
      value: "followers" as PrivacyLevel,
      label: "Followers",
      icon: Users,
      description: "Only your followers can see",
      color: "text-blue-400 bg-blue-500/20 border-blue-500/30"
    },
    {
      value: "private" as PrivacyLevel,
      label: "Private",
      icon: Lock,
      description: "Only you can see",
      color: "text-red-400 bg-red-500/20 border-red-500/30"
    },
    {
      value: "time-locked" as PrivacyLevel,
      label: "Time-Locked",
      icon: Shield,
      description: "Unlocks after specified time",
      color: "text-purple-400 bg-purple-500/20 border-purple-500/30"
    },
    {
      value: "premium" as PrivacyLevel,
      label: "Premium",
      icon: Eye,
      description: "Requires GTT tokens to view",
      color: "text-[#00ffe1] bg-[#00ffe1]/20 border-[#00ffe1]/30"
    }
  ];

  const handleChange = (level: PrivacyLevel) => {
    setPrivacy(level);
    onChange?.(level);
  };

  const selectedOption = privacyOptions.find(option => option.value === privacy);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 text-sm ${className}`}>
        <Settings className="h-4 w-4 text-[#8b949e]" />
        <span className="font-medium text-[#f0f6fc]">Privacy:</span>
        <div className="flex space-x-1">
          {privacyOptions.slice(0, 3).map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => handleChange(option.value)}
              className={`h-7 px-2 text-xs ${
                privacy === option.value 
                  ? 'bg-[#00ffe1]/20 text-[#00ffe1] border border-[#00ffe1]/30' 
                  : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]'
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className={`bg-[#161b22] border-[#30363d] ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#00ffe1]" />
            <h4 className="font-medium text-[#f0f6fc]">Privacy Settings</h4>
          </div>
          {selectedOption && (
            <Badge className={`${selectedOption.color} text-xs px-2 py-1`}>
              <selectedOption.icon className="h-3 w-3 mr-1" />
              {selectedOption.label}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {privacyOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              onClick={() => handleChange(option.value)}
              className={`justify-start h-auto p-3 text-left ${
                privacy === option.value 
                  ? 'bg-[#00ffe1]/10 border border-[#00ffe1]/30' 
                  : 'hover:bg-[#21262d] border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <option.icon className={`h-4 w-4 ${
                  privacy === option.value ? 'text-[#00ffe1]' : 'text-[#8b949e]'
                }`} />
                <div className="flex-1">
                  <div className={`font-medium text-sm ${
                    privacy === option.value ? 'text-[#f0f6fc]' : 'text-[#8b949e]'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-[#8b949e] mt-1">
                    {option.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {privacy === 'time-locked' && (
          <div className="mt-4 p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
            <p className="text-xs text-[#8b949e] mb-2">Time-lock duration:</p>
            <div className="flex space-x-2">
              {['1 day', '1 week', '1 month', '1 year'].map((duration) => (
                <Button
                  key={duration}
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]"
                >
                  {duration}
                </Button>
              ))}
            </div>
          </div>
        )}

        {privacy === 'premium' && (
          <div className="mt-4 p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
            <p className="text-xs text-[#8b949e] mb-2">GTT tokens required to view:</p>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                placeholder="100"
                className="bg-[#21262d] border border-[#30363d] rounded px-2 py-1 text-xs text-[#f0f6fc] w-20"
              />
              <span className="text-xs text-[#00ffe1]">GTT</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Legacy compatibility export
export function CapsulePrivacyToggle({ onChange }: { onChange: (val: string) => void }) {
  return (
    <EnhancedCapsulePrivacyToggle 
      onChange={(level) => onChange(level)} 
      variant="compact" 
    />
  );
}