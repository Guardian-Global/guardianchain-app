import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Smartphone,
  Key,
  Download
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated", 
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-light">Settings</h1>
          <p className="text-brand-light/60 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-brand-surface">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="profile-settings-tab"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="notifications-tab"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="security-tab"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="appearance"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="appearance-tab"
            >
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="data"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="data-tab"
            >
              <Download className="w-4 h-4 mr-2" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-brand-surface border-brand-primary/20">
              <CardHeader>
                <CardTitle className="text-brand-light">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-brand-light">First Name</Label>
                    <Input 
                      id="firstName"
                      defaultValue={user?.firstName || ''}
                      className="bg-brand-dark border-brand-primary/30"
                      data-testid="first-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-brand-light">Last Name</Label>
                    <Input 
                      id="lastName"
                      defaultValue={user?.lastName || ''}
                      className="bg-brand-dark border-brand-primary/30"
                      data-testid="last-name-input"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-brand-light">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    defaultValue={user?.email || ''}
                    className="bg-brand-dark border-brand-primary/30"
                    data-testid="email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-brand-light">Bio</Label>
                  <Textarea 
                    id="bio"
                    placeholder="Tell us about yourself..."
                    className="bg-brand-dark border-brand-primary/30"
                    data-testid="bio-input"
                  />
                </div>
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-brand-primary text-brand-dark hover:bg-brand-primary/80"
                  data-testid="save-profile-button"
                >
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-brand-surface border-brand-primary/20">
              <CardHeader>
                <CardTitle className="text-brand-light">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-brand-light">Email Notifications</Label>
                    <p className="text-sm text-brand-light/60">Receive email updates</p>
                  </div>
                  <Switch defaultChecked data-testid="email-notifications-toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-brand-light">Push Notifications</Label>
                    <p className="text-sm text-brand-light/60">Receive push notifications</p>
                  </div>
                  <Switch defaultChecked data-testid="push-notifications-toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-brand-light">Truth Capsule Updates</Label>
                    <p className="text-sm text-brand-light/60">Get notified about capsule interactions</p>
                  </div>
                  <Switch defaultChecked data-testid="capsule-notifications-toggle" />
                </div>
                <Button 
                  onClick={handleSaveNotifications}
                  className="bg-brand-primary text-brand-dark hover:bg-brand-primary/80"
                  data-testid="save-notifications-button"
                >
                  Save Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-brand-surface border-brand-primary/20">
              <CardHeader>
                <CardTitle className="text-brand-light">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-brand-light">Two-Factor Authentication</Label>
                    <p className="text-sm text-brand-light/60">Enable 2FA for additional security</p>
                  </div>
                  <Switch data-testid="2fa-toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-brand-light">Login Notifications</Label>
                    <p className="text-sm text-brand-light/60">Get notified of new login attempts</p>
                  </div>
                  <Switch defaultChecked data-testid="login-notifications-toggle" />
                </div>
                <Button 
                  onClick={handleSaveSecurity}
                  className="bg-brand-primary text-brand-dark hover:bg-brand-primary/80"
                  data-testid="save-security-button"
                >
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-brand-surface border-brand-primary/20">
              <CardHeader>
                <CardTitle className="text-brand-light">Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-brand-light">Dark Mode</Label>
                    <p className="text-sm text-brand-light/60">Toggle dark theme</p>
                  </div>
                  <Switch defaultChecked data-testid="dark-mode-toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-brand-light">Animations</Label>
                    <p className="text-sm text-brand-light/60">Enable interface animations</p>
                  </div>
                  <Switch defaultChecked data-testid="animations-toggle" />
                </div>
                <Button 
                  className="bg-brand-primary text-brand-dark hover:bg-brand-primary/80"
                  data-testid="save-appearance-button"
                >
                  Save Appearance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="bg-brand-surface border-brand-primary/20">
              <CardHeader>
                <CardTitle className="text-brand-light">Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-brand-light">Export Data</Label>
                  <p className="text-sm text-brand-light/60 mb-4">
                    Download all your data including capsules and activities
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-brand-primary/30 text-brand-light hover:bg-brand-primary/10"
                    data-testid="export-data-button"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                <div>
                  <Label className="text-brand-light text-red-400">Danger Zone</Label>
                  <p className="text-sm text-brand-light/60 mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <Button 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                    data-testid="delete-account-button"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}