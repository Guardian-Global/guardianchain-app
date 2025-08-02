import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Globe, 
  Lock, 
  Users, 
  Eye,
  EyeOff,
  Shield,
  Info,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type PrivacyLevel = 'public' | 'private' | 'family' | 'sealed';

interface CapsulePrivacyToggleProps {
  initialPrivacy?: PrivacyLevel;
  capsuleId?: string;
  onPrivacyChange?: (privacy: PrivacyLevel) => void;
  disabled?: boolean;
  showDetails?: boolean;
  className?: string;
}

interface PrivacyOption {
  level: PrivacyLevel;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  features: string[];
}

export default function CapsulePrivacyToggle({
  initialPrivacy = 'public',
  capsuleId,
  onPrivacyChange,
  disabled = false,
  showDetails = true,
  className = ""
}: CapsulePrivacyToggleProps) {
  const [currentPrivacy, setCurrentPrivacy] = useState<PrivacyLevel>(initialPrivacy);
  const [showInfo, setShowInfo] = useState(false);
  const { toast } = useToast();

  const privacyOptions: PrivacyOption[] = [
    {
      level: 'public',
      icon: <Globe className="w-4 h-4" />,
      label: 'Public',
      description: 'Visible to everyone, discoverable, shareable',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      features: [
        'Visible in public feeds',
        'Search engine indexable',
        'Shareable links',
        'Higher truth score weight'
      ]
    },
    {
      level: 'family',
      icon: <Users className="w-4 h-4" />,
      label: 'Family',
      description: 'Only family members and trusted connections',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      features: [
        'Family circle only',
        'Inherited access rights',
        'Protected sharing',
        'Legacy preservation'
      ]
    },
    {
      level: 'private',
      icon: <Lock className="w-4 h-4" />,
      label: 'Private',
      description: 'Only you can access this capsule',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      features: [
        'Personal access only',
        'No public visibility',
        'Secure storage',
        'Can upgrade later'
      ]
    },
    {
      level: 'sealed',
      icon: <Shield className="w-4 h-4" />,
      label: 'Sealed',
      description: 'Time-locked, blockchain-secured, immutable',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      features: [
        'Blockchain immutability',
        'Time-lock mechanism',
        'Cryptographic sealing',
        'Maximum security'
      ]
    }
  ];

  const handlePrivacyChange = (newPrivacy: PrivacyLevel) => {
    if (disabled) return;
    
    setCurrentPrivacy(newPrivacy);
    onPrivacyChange?.(newPrivacy);
    
    toast({
      title: "Privacy Updated",
      description: `Capsule privacy set to ${newPrivacy}`,
      variant: "default"
    });
  };

  const currentOption = privacyOptions.find(opt => opt.level === currentPrivacy) || privacyOptions[0];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Privacy Display */}
      <Card className={currentOption.bgColor}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={currentOption.color}>
                {currentOption.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{currentOption.label}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {currentOption.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="h-8 w-8 p-0"
              >
                <Info className="w-3 h-3" />
              </Button>
              {!disabled && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Change
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Options Grid */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-2">
          {privacyOptions.map((option) => (
            <Button
              key={option.level}
              variant={currentPrivacy === option.level ? "default" : "outline"}
              className={`h-auto p-3 flex-col gap-1 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handlePrivacyChange(option.level)}
              disabled={disabled}
            >
              <div className={option.color}>
                {option.icon}
              </div>
              <span className="text-xs font-medium">{option.label}</span>
              {currentPrivacy === option.level && (
                <Badge variant="secondary" className="text-xs mt-1">
                  <Eye className="w-2 h-2 mr-1" />
                  Active
                </Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Detailed Info Panel */}
      {showInfo && (
        <Card className="border-gray-200">
          <CardContent className="p-3">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              {currentOption.icon}
              {currentOption.label} Privacy Features
            </h4>
            <ul className="space-y-1">
              {currentOption.features.map((feature, index) => (
                <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
            
            {currentPrivacy === 'sealed' && (
              <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                <p className="font-medium text-purple-800 dark:text-purple-200">
                  Blockchain Sealing
                </p>
                <p className="text-purple-600 dark:text-purple-400">
                  Once sealed, this capsule becomes permanently immutable and time-locked on the blockchain.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Capsule ID: {capsuleId || 'pending'}</span>
        <span>{currentPrivacy} mode</span>
      </div>
    </div>
  );
}