import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Settings, 
  Crown, 
  Coins, 
  TrendingUp, 
  Shield,
  Eye,
  EyeOff,
  Bot,
  Shuffle,
  Plus,
  DollarSign,
  BarChart3,
  Calendar,
  Lock,
  Globe,
  MessageSquare
} from 'lucide-react';
import { GTTPortfolioManager } from './GTTPortfolioManager';
import { CapsuleOrganizer } from './CapsuleOrganizer';
import { SovereignAIAssistant } from './SovereignAIAssistant';
import { TimelineManager } from './TimelineManager';
import { WalletPortfolio } from './WalletPortfolio';
import { useEnterpriseAuth } from '@/hooks/useEnterpriseAuth';

interface ProfileData {
  id: string;
  username: string;
  email: string;
  tier: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  gttBalance: number;
  totalYield: number;
  capsulesCreated: number;
  capsulesVerified: number;
  reputationScore: number;
  isPublic: boolean;
}

interface CapsuleInvestment {
  id: string;
  title: string;
  originalInvestment: number;
  purchaseDate: string;
  currentValue: number;
  projectedYield: number;
  lifetimeValue: number;
  status: 'active' | 'matured' | 'pending';
}

export default function ProfileDashboard() {
  const { user } = useEnterpriseAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [investments, setInvestments] = useState<CapsuleInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with real API calls
      const mockProfile: ProfileData = {
        id: user?.id || '1',
        username: user?.username || 'guardian_user',
        email: user?.email || 'user@guardianchain.com',
        tier: user?.tier || 'professional',
        avatar: user?.metadata?.profileImageUrl || '',
        bio: 'Truth seeker and blockchain innovator protecting digital integrity',
        location: 'Global',
        website: 'https://guardianchain.app',
        joinDate: user?.createdAt?.toLocaleDateString() || '2025-01-01',
        gttBalance: 12847.50,
        totalYield: 3247.89,
        capsulesCreated: 127,
        capsulesVerified: 1849,
        reputationScore: 8.7,
        isPublic: true
      };

      const mockInvestments: CapsuleInvestment[] = [
        {
          id: '1',
          title: 'Climate Research Data Verification',
          originalInvestment: 1000,
          purchaseDate: '2024-12-15',
          currentValue: 1247.50,
          projectedYield: 2100,
          lifetimeValue: 3347.50,
          status: 'active'
        },
        {
          id: '2',
          title: 'Legal Document Authentication',
          originalInvestment: 500,
          purchaseDate: '2024-11-22',
          currentValue: 823.75,
          projectedYield: 1200,
          lifetimeValue: 2023.75,
          status: 'active'
        },
        {
          id: '3',
          title: 'AI Training Data Integrity',
          originalInvestment: 2000,
          purchaseDate: '2024-10-08',
          currentValue: 2567.89,
          projectedYield: 4000,
          lifetimeValue: 6567.89,
          status: 'matured'
        }
      ];

      setProfileData(mockProfile);
      setInvestments(mockInvestments);
    } catch (error) {
      console.error('Profile data loading failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePrivacy = () => {
    if (profileData) {
      setProfileData(prev => prev ? { ...prev, isPublic: !prev.isPublic } : null);
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      starter: 'bg-blue-500',
      professional: 'bg-purple-500',
      enterprise: 'bg-amber-500',
      sovereign: 'bg-gradient-to-r from-purple-500 to-amber-500'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading || !profileData) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24 border-4 border-purple-500">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="bg-purple-600 text-white text-2xl">
                  {profileData.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{profileData.username}</h1>
                  <Badge className={`${getTierColor(profileData.tier)} text-white`}>
                    <Crown className="w-4 h-4 mr-1" />
                    {profileData.tier.charAt(0).toUpperCase() + profileData.tier.slice(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePrivacy}
                    className="text-slate-400 hover:text-white"
                  >
                    {profileData.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
                
                <p className="text-slate-300 mb-2">{profileData.bio}</p>
                
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span>📍 {profileData.location}</span>
                  <span>📅 Joined {profileData.joinDate}</span>
                  <span>⭐ {profileData.reputationScore}/10</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profileData.gttBalance.toLocaleString()}</div>
              <div className="text-sm text-slate-400">GTT Balance</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profileData.totalYield.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Total Yield</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800">
            <CardContent className="p-4 text-center">
              <Plus className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profileData.capsulesCreated}</div>
              <div className="text-sm text-slate-400">Created</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profileData.capsulesVerified}</div>
              <div className="text-sm text-slate-400">Verified</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profileData.reputationScore}</div>
              <div className="text-sm text-slate-400">Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 mb-8">
            <TabsTrigger value="overview" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
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
            <TabsTrigger value="ai-assistant" className="flex items-center">
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Investment Portfolio Overview */}
              <Card className="bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Investment Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investments.map((investment) => (
                      <div key={investment.id} className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{investment.title}</h4>
                          <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                            {investment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400">Original: </span>
                            <span className="text-white">{investment.originalInvestment} GTT</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Current: </span>
                            <span className="text-green-400">{investment.currentValue} GTT</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Projected: </span>
                            <span className="text-blue-400">{investment.projectedYield} GTT</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Lifetime: </span>
                            <span className="text-purple-400">{investment.lifetimeValue} GTT</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Progress</span>
                            <span>{Math.round((investment.currentValue / investment.projectedYield) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(investment.currentValue / investment.projectedYield) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 py-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <div className="text-sm">Capsule verified successfully</div>
                        <div className="text-xs text-slate-400">+127 GTT • 2 hours ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 py-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="text-sm">New investment opportunity</div>
                        <div className="text-xs text-slate-400">AI recommended • 5 hours ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 py-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div>
                        <div className="text-sm">Yield distribution received</div>
                        <div className="text-xs text-slate-400">+89.3 GTT • 1 day ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 py-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <div>
                        <div className="text-sm">Tier upgraded to Professional</div>
                        <div className="text-xs text-slate-400">Benefits unlocked • 3 days ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GTTPortfolioManager 
                  balance={profileData.gttBalance}
                  yield={profileData.totalYield}
                  investments={investments}
                />
              </div>
              <div>
                <WalletPortfolio />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="capsules">
            <CapsuleOrganizer />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineManager isPublic={profileData.isPublic} />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <SovereignAIAssistant userId={profileData.id} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Public Profile</span>
                    <Button
                      variant={profileData.isPublic ? "default" : "outline"}
                      size="sm"
                      onClick={togglePrivacy}
                    >
                      {profileData.isPublic ? <Globe className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                      {profileData.isPublic ? 'Public' : 'Private'}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    {profileData.isPublic 
                      ? "Your profile is visible to all users"
                      : "Your profile is only visible to you"
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Edit Personal Information
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Security & Authentication
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Bot className="w-4 h-4 mr-2" />
                    AI Assistant Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}