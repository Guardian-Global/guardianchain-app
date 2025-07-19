import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Shield, 
  Settings, 
  TrendingUp, 
  Bot, 
  Calendar,
  Wallet,
  Crown,
  Star,
  Trophy,
  Coins
} from 'lucide-react';

import GTTPortfolioManager from './GTTPortfolioManager';
import SovereignAIAssistant from './SovereignAIAssistant';
import CapsuleOrganizer from './CapsuleOrganizer';
import TimelineManager from './TimelineManager';
import WalletPortfolio from './WalletPortfolio';

interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  tier: 'Explorer' | 'Seeker' | 'Creator' | 'Sovereign';
  gttBalance: number;
  totalYield: number;
  capsulesCreated: number;
  verificationsPerformed: number;
  reputationScore: number;
  joinDate: string;
  profileImage?: string;
}

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTimelinePublic, setIsTimelinePublic] = useState(true);

  // Mock profile data - in production, fetch from API
  const profileData: ProfileData = {
    id: 'user_001',
    username: 'TruthGuardian2024',
    displayName: 'Alex Chen',
    bio: 'Climate researcher and blockchain truth advocate. Building immutable verification systems for scientific data integrity.',
    tier: 'Creator',
    gttBalance: 12847.50,
    totalYield: 3247.89,
    capsulesCreated: 23,
    verificationsPerformed: 156,
    reputationScore: 9.2,
    joinDate: '2024-03-15',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  };

  const getTierColor = (tier: string) => {
    const colors = {
      Explorer: 'bg-blue-500',
      Seeker: 'bg-green-500', 
      Creator: 'bg-purple-500',
      Sovereign: 'bg-amber-500'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-500';
  };

  const getTierIcon = (tier: string) => {
    const icons = {
      Explorer: Star,
      Seeker: Shield,
      Creator: Trophy,
      Sovereign: Crown
    };
    return icons[tier as keyof typeof icons] || User;
  };

  const TierIcon = getTierIcon(profileData.tier);

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-purple-500">
                  <AvatarImage src={profileData.profileImage} alt={profileData.displayName} />
                  <AvatarFallback className="bg-purple-600 text-white text-2xl">
                    {profileData.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{profileData.displayName}</h1>
                    <Badge className={`${getTierColor(profileData.tier)} text-white flex items-center`}>
                      <TierIcon className="w-3 h-3 mr-1" />
                      {profileData.tier}
                    </Badge>
                  </div>
                  <p className="text-lg text-purple-400 mb-2">@{profileData.username}</p>
                  <p className="text-slate-300 max-w-2xl">{profileData.bio}</p>
                </div>
              </div>
              
              <div className="ml-auto">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Coins className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{profileData.gttBalance.toLocaleString()}</div>
              <div className="text-xs text-slate-400">GTT Balance</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{profileData.totalYield.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total Yield</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{profileData.capsulesCreated}</div>
              <div className="text-xs text-slate-400">Capsules</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <User className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{profileData.verificationsPerformed}</div>
              <div className="text-xs text-slate-400">Verifications</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{profileData.reputationScore}/10</div>
              <div className="text-xs text-slate-400">Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 p-1">
            <TabsTrigger value="overview" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="capsules" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Capsules
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center">
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Created "Climate Research Data Verification" capsule</span>
                      <span className="text-xs text-slate-400 ml-auto">2h ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm">Received 127.5 GTT yield from Legal Document Auth</span>
                      <span className="text-xs text-slate-400 ml-auto">6h ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm">Verified 5 community capsules</span>
                      <span className="text-xs text-slate-400 ml-auto">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Achievement Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Truth Guardian</span>
                        <span>89%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '89%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Capsule Master</span>
                        <span>46%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{width: '46%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Yield Hunter</span>
                        <span>72%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <GTTPortfolioManager />
          </TabsContent>

          <TabsContent value="capsules">
            <CapsuleOrganizer />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineManager isPublic={isTimelinePublic} />
          </TabsContent>

          <TabsContent value="ai">
            <SovereignAIAssistant userId={profileData.id} />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletPortfolio />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}