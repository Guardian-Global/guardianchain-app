import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Settings, 
  Shield, 
  TestTube,
  Bell,
  BrainCircuit,
  Vote,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface EmailPreferences {
  emailEnabled: boolean;
  capsuleEvents?: boolean;
  aiMemorySaves?: boolean;
  daoVotes?: boolean;
  weeklyDigest?: boolean;
  adminAlerts?: boolean;
}

const NOTIFICATION_TYPES = [
  {
    key: 'capsuleEvents',
    title: 'Capsule Events',
    description: 'Notifications when your capsules are remixed, sealed, or gain yield',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'text-green-400',
    example: 'Your capsule "Climate Truth" was remixed and earned 250 GTT'
  },
  {
    key: 'aiMemorySaves',
    title: 'AI Memory Saves',
    description: 'When your Sovereign AI saves important conversations',
    icon: <BrainCircuit className="w-4 h-4" />,
    color: 'text-purple-400',
    example: 'AI saved: "Investment strategy discussion - HIGH priority"'
  },
  {
    key: 'daoVotes',
    title: 'DAO Governance',
    description: 'Voting confirmations and proposal updates',
    icon: <Vote className="w-4 h-4" />,
    color: 'text-blue-400',
    example: 'Your vote for "Protocol Upgrade V2" has been confirmed'
  },
  {
    key: 'weeklyDigest',
    title: 'Weekly Performance Report',
    description: 'Summary of your GTT earnings, capsule activity, and market insights',
    icon: <Mail className="w-4 h-4" />,
    color: 'text-amber-400',
    example: 'This week: 1,247 GTT earned, 3 capsules sealed, rank #156'
  }
];

export default function EmailPreferences() {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    emailEnabled: true,
    capsuleEvents: true,
    aiMemorySaves: true,
    daoVotes: true,
    weeklyDigest: true,
    adminAlerts: false
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock user email - in production this would come from authentication
  const userEmail = "user@example.com";

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch(`/api/email-preferences/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<EmailPreferences>) => {
    setLoading(true);
    try {
      const updatedPrefs = { ...preferences, ...newPreferences };
      
      const response = await fetch(`/api/email-preferences/${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPrefs)
      });

      if (response.ok) {
        setPreferences(updatedPrefs);
        toast({
          title: "Preferences Updated",
          description: "Your email notification settings have been saved.",
        });
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update your email preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async (type: string) => {
    setTesting(type);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: userEmail, type })
      });

      if (response.ok) {
        toast({
          title: "Test Email Sent",
          description: `Check your inbox for the ${type} notification test.`,
        });
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not send test email. Check your configuration.",
        variant: "destructive",
      });
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Preferences</h1>
        <p className="text-slate-400">
          Manage your GUARDIANCHAIN notification settings and stay informed about what matters to you.
        </p>
      </div>

      {/* Master Toggle */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <span>Email Notifications</span>
            <Badge variant={preferences.emailEnabled ? "default" : "secondary"}>
              {preferences.emailEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Master control for all GUARDIANCHAIN email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="master-toggle" className="text-base font-medium">
                Receive Email Notifications
              </Label>
              <div className="text-sm text-slate-400">
                Turn off to disable all non-critical emails
              </div>
            </div>
            <Switch
              id="master-toggle"
              checked={preferences.emailEnabled}
              onCheckedChange={(checked) => updatePreferences({ emailEnabled: checked })}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Individual Notification Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {NOTIFICATION_TYPES.map((type) => (
          <Card key={type.key} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <span className={type.color}>{type.icon}</span>
                <span className="text-lg">{type.title}</span>
              </CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Switch
                  checked={preferences[type.key as keyof EmailPreferences] as boolean}
                  onCheckedChange={(checked) => updatePreferences({ [type.key]: checked })}
                  disabled={loading || !preferences.emailEnabled}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendTestEmail(type.key)}
                  disabled={testing === type.key || !preferences.emailEnabled}
                >
                  {testing === type.key ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-1" />
                      Test
                    </>
                  )}
                </Button>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs text-slate-400 mb-1">Example:</div>
                <div className="text-sm text-slate-300 italic">"{type.example}"</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Alerts Notice */}
      <Card className="bg-red-900/20 border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-400">
            <Shield className="w-5 h-5" />
            <span>Critical Security Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-slate-300">
                Security alerts, emergency notifications, and legal notices will always be delivered regardless of your preferences.
              </p>
              <p className="text-xs text-slate-400">
                These include account security breaches, protocol emergency updates, and legal compliance notifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>System Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">ProtonMail SMTP</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Founder Oversight</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Encryption Enabled</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            All emails are sent via encrypted ProtonMail infrastructure with automatic founder oversight for compliance.
            Your email address: <span className="font-mono text-slate-300">{userEmail}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}