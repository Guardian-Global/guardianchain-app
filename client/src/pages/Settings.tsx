import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Settings as SettingsIcon 
} from "lucide-react";
import LoginActivity from "@/components/LoginActivity";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          </div>
          <p className="text-slate-400">
            Manage your account preferences and security settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-cyan-500/20">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              data-testid="tab-profile"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              data-testid="tab-security"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              data-testid="tab-notifications"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              data-testid="tab-appearance"
            >
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              data-testid="tab-data"
            >
              <Database className="w-4 h-4 mr-2" />
              Data & Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-slate-900/50 border-slate-700 text-slate-300"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-slate-200">Display Name</Label>
                    <Input
                      id="displayName"
                      value={user?.displayName || ""}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      data-testid="input-display-name"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
                    Tier: {user?.tier || 'SEEKER'}
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                    Status: {user?.subscriptionStatus || 'Free'}
                  </Badge>
                </div>

                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                  data-testid="button-save-profile"
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Password Section */}
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-slate-200">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      data-testid="input-current-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-200">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      data-testid="input-new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      data-testid="input-confirm-password"
                    />
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                    data-testid="button-change-password"
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Login Activity */}
              <LoginActivity />
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-slate-400 text-sm">Receive notifications about your account activity</p>
                  </div>
                  <Button variant="outline" className="border-cyan-500/40 text-cyan-400">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Push Notifications</h4>
                    <p className="text-slate-400 text-sm">Get real-time updates in your browser</p>
                  </div>
                  <Button variant="outline" className="border-cyan-500/40 text-cyan-400">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Dark Mode</h4>
                    <p className="text-slate-400 text-sm">Currently using dark cyberpunk theme</p>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Color Scheme</h4>
                    <p className="text-slate-400 text-sm">Cyberpunk cyan and magenta theme</p>
                  </div>
                  <Button variant="outline" className="border-cyan-500/40 text-cyan-400">
                    Customize
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data & Privacy Tab */}
          <TabsContent value="data">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Data & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Download Your Data</h4>
                    <p className="text-slate-400 text-sm">Export all your account data and capsules</p>
                  </div>
                  <Button variant="outline" className="border-cyan-500/40 text-cyan-400">
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-500/40">
                  <div>
                    <h4 className="text-red-400 font-medium">Delete Account</h4>
                    <p className="text-red-300 text-sm">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    Delete
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