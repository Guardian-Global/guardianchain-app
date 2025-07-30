import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Wallet, 
  Shield, 
  Star, 
  TrendingUp, 
  Coins, 
  Settings,
  Edit3,
  Camera,
  Award,
  Crown,
  Zap
} from 'lucide-react';

interface UserProfileData {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  tier: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN';
  gttBalance: number;
  reputation: number;
  capsuleCount: number;
  verificationCount: number;
  joinedDate: string;
  walletAddress?: string;
}

const mockUserData: UserProfileData = {
  id: '1',
  username: 'GuardianFounder',
  email: 'founder@guardianchain.org',
  avatar: '',
  tier: 'SOVEREIGN',
  gttBalance: 247500,
  reputation: 98,
  capsuleCount: 156,
  verificationCount: 89,
  joinedDate: '2025-01-15',
  walletAddress: '0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db'
};

interface EnhancedUserProfileProps {
  userData?: UserProfileData;
  onUpdate?: (data: Partial<UserProfileData>) => void;
}

export default function EnhancedUserProfile({ 
  userData = mockUserData, 
  onUpdate 
}: EnhancedUserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData);

  const getTierColor = (tier: string) => {
    const colors = {
      EXPLORER: 'bg-blue-600',
      SEEKER: 'bg-purple-600',
      CREATOR: 'bg-green-600',
      SOVEREIGN: 'bg-gradient-to-r from-yellow-500 to-orange-600'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-600';
  };

  const getTierIcon = (tier: string) => {
    const icons = {
      EXPLORER: Shield,
      SEEKER: Star,
      CREATOR: Zap,
      SOVEREIGN: Crown
    };
    const IconComponent = icons[tier as keyof typeof icons] || Shield;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-purple-500/50">
                <AvatarImage src={editData.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-green-600 text-white text-2xl">
                  {editData.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <Input
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="text-2xl font-bold bg-slate-700 border-slate-600"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white">{userData.username}</h1>
                )}
                
                <Badge className={`${getTierColor(userData.tier)} text-white px-3 py-1`}>
                  {getTierIcon(userData.tier)}
                  <span className="ml-2">{userData.tier}</span>
                </Badge>
              </div>

              <p className="text-slate-400">{userData.email}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-green-400" />
                  <span className="text-white font-semibold">
                    {userData.gttBalance.toLocaleString()} GTT
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-white">{userData.reputation}% Reputation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-purple-400" />
                  <span className="text-white">{userData.capsuleCount} Capsules</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(userData);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Coins className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {userData.gttBalance.toLocaleString()}
                </h3>
                <p className="text-slate-400">GTT Balance</p>
                <p className="text-green-400 text-sm mt-2">+12.5% this month</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{userData.reputation}%</h3>
                <p className="text-slate-400">Reputation Score</p>
                <p className="text-purple-400 text-sm mt-2">Top 5% of users</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{userData.capsuleCount}</h3>
                <p className="text-slate-400">Truth Capsules</p>
                <p className="text-yellow-400 text-sm mt-2">{userData.verificationCount} verified</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: 'Created truth capsule', time: '2 hours ago', reward: '+150 GTT' },
                { action: 'Verified community submission', time: '5 hours ago', reward: '+75 GTT' },
                { action: 'Staked GTT tokens', time: '1 day ago', reward: '+25 GTT' },
                { action: 'Earned reputation milestone', time: '2 days ago', reward: '+500 GTT' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-slate-400 text-sm">{activity.time}</p>
                  </div>
                  <Badge className="bg-green-600 text-white">{activity.reward}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">GTT Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Value</span>
                    <span className="text-white font-semibold">$18,562.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Yield</span>
                    <span className="text-green-400 font-semibold">+$2,340.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Staked Amount</span>
                    <span className="text-white font-semibold">125,000 GTT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">APY</span>
                    <span className="text-purple-400 font-semibold">25.6%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Yield Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Truth Verification</span>
                        <span className="text-white">65%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Staking Rewards</span>
                        <span className="text-white">25%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Governance Participation</span>
                        <span className="text-white">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-semibold">Connected Wallet</p>
                  <p className="text-slate-400 text-sm font-mono">
                    {userData.walletAddress}
                  </p>
                </div>
                <Badge className="bg-green-600 text-white">Connected</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Wallet className="h-4 w-4 mr-2" />
                  Add Wallet
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Wallet Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input 
                    id="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input 
                    id="username"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}