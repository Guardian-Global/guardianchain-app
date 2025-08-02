import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Clock,
  Globe,
  Calendar,
  Key,
  AlertTriangle,
  Info
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type PrivacyLevel = 'public' | 'family' | 'private' | 'sealed';

interface CapsulePrivacyToggleProps {
  capsuleId?: string;
  currentPrivacy: PrivacyLevel;
  onPrivacyChange: (privacy: PrivacyLevel, unlockDate?: Date) => void;
  className?: string;
}

interface PrivacySettings {
  level: PrivacyLevel;
  unlockDate?: Date;
  allowedUsers?: string[];
  requiresPassword?: boolean;
  password?: string;
}

export default function CapsulePrivacyToggle({
  capsuleId,
  currentPrivacy,
  onPrivacyChange,
  className = ""
}: CapsulePrivacyToggleProps) {
  const { toast } = useToast();
  const [privacy, setPrivacy] = useState<PrivacyLevel>(currentPrivacy);
  const [unlockDate, setUnlockDate] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [allowedEmails, setAllowedEmails] = useState<string>('');

  const updatePrivacyMutation = useMutation({
    mutationFn: async (settings: PrivacySettings) => {
      if (!capsuleId) throw new Error('Capsule ID required');
      
      return await apiRequest("PATCH", `/api/capsules/${capsuleId}/privacy`, {
        privacyLevel: settings.level,
        unlockDate: settings.unlockDate,
        allowedUsers: settings.allowedUsers,
        requiresPassword: settings.requiresPassword,
        password: settings.password
      });
    },
    onSuccess: (data) => {
      onPrivacyChange(privacy, unlockDate ? new Date(unlockDate) : undefined);
      toast({
        title: "Privacy Updated",
        description: `Capsule privacy set to ${privacy}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update privacy settings",
        variant: "destructive",
      });
    },
  });

  const privacyOptions = [
    {
      value: 'public' as const,
      label: 'Public',
      icon: Globe,
      description: 'Anyone can view this capsule',
      details: 'Visible on your public profile and searchable by others',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'family' as const,
      label: 'Family & Friends',
      icon: Users,
      description: 'Only people you specify can view',
      details: 'Share with specific email addresses or trusted contacts',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'private' as const,
      label: 'Private',
      icon: Lock,
      description: 'Only you can view this capsule',
      details: 'Completely private, not visible to anyone else',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      value: 'sealed' as const,
      label: 'Time-Sealed',
      icon: Clock,
      description: 'Locked until a specific date',
      details: 'Permanently sealed on blockchain until unlock date',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const selectedOption = privacyOptions.find(option => option.value === privacy);

  const handleSaveSettings = () => {
    const settings: PrivacySettings = {
      level: privacy,
      unlockDate: unlockDate ? new Date(unlockDate) : undefined,
      allowedUsers: allowedEmails ? allowedEmails.split(',').map(email => email.trim()) : undefined,
      requiresPassword: !!password,
      password: password || undefined
    };

    updatePrivacyMutation.mutate(settings);
  };

  const hasChanges = privacy !== currentPrivacy || unlockDate || password || allowedEmails;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Access Control
          {selectedOption && (
            <Badge 
              variant="secondary" 
              className={`${selectedOption.color} ${selectedOption.bgColor}`}
            >
              {selectedOption.label}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Privacy Level Selection */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Choose Privacy Level</Label>
          <RadioGroup
            value={privacy}
            onValueChange={(value) => setPrivacy(value as PrivacyLevel)}
            className="space-y-3"
          >
            {privacyOptions.map((option) => (
              <div 
                key={option.value}
                className={`border rounded-lg p-4 ${
                  privacy === option.value 
                    ? `${option.borderColor} ${option.bgColor}` 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <Label 
                      htmlFor={option.value} 
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <option.icon className={`w-4 h-4 ${option.color}`} />
                      <span className="font-medium">{option.label}</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Additional Settings Based on Privacy Level */}
        {privacy === 'family' && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <Label className="text-sm font-medium">Allowed Viewers</Label>
            </div>
            <Input
              placeholder="Enter email addresses separated by commas"
              value={allowedEmails}
              onChange={(e) => setAllowedEmails(e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-blue-600">
              Example: family@example.com, friend@example.com
            </div>
          </div>
        )}

        {privacy === 'sealed' && (
          <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <Label className="text-sm font-medium">Unlock Date</Label>
            </div>
            <Input
              type="datetime-local"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full"
            />
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div className="text-xs text-orange-600">
                Once sealed, this capsule cannot be accessed until the unlock date. 
                This action is permanent and recorded on the blockchain.
              </div>
            </div>
          </div>
        )}

        {(privacy === 'private' || privacy === 'sealed') && (
          <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-600" />
              <Label className="text-sm font-medium">Additional Password (Optional)</Label>
            </div>
            <Input
              type="password"
              placeholder="Enter additional password protection"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-purple-600">
              Add an extra layer of security with a custom password
            </div>
          </div>
        )}

        {/* Privacy Impact Summary */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">Privacy Impact</span>
          </div>
          <div className="text-xs space-y-1">
            {privacy === 'public' && (
              <>
                <div>• Appears on your public profile at /u/[username]</div>
                <div>• Searchable by other users</div>
                <div>• Can be shared on social media</div>
                <div>• Contributes to your Truth Genome score</div>
              </>
            )}
            {privacy === 'family' && (
              <>
                <div>• Only visible to specified email addresses</div>
                <div>• Not searchable by public</div>
                <div>• Can be shared with invitation links</div>
                <div>• Limited Truth Genome contribution</div>
              </>
            )}
            {privacy === 'private' && (
              <>
                <div>• Only you can view this capsule</div>
                <div>• Not searchable or visible to anyone</div>
                <div>• Cannot be shared publicly</div>
                <div>• No Truth Genome contribution</div>
              </>
            )}
            {privacy === 'sealed' && (
              <>
                <div>• Completely locked until unlock date</div>
                <div>• Recorded permanently on blockchain</div>
                <div>• Cannot be modified after sealing</div>
                <div>• Full Truth Genome contribution when unsealed</div>
              </>
            )}
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <Button 
            onClick={handleSaveSettings}
            disabled={updatePrivacyMutation.isPending}
            className="w-full"
          >
            {updatePrivacyMutation.isPending ? 'Updating...' : 'Save Privacy Settings'}
          </Button>
        )}

        {!hasChanges && (
          <div className="text-center text-sm text-muted-foreground">
            No changes to save
          </div>
        )}
      </CardContent>
    </Card>
  );
}