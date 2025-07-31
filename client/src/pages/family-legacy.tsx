import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Users,
  Shield,
  Clock,
  Vault,
  TrendingUp,
  Star,
  Award,
  Lock,
  Infinity,
  Camera,
  Video,
  Music,
  FileText,
  MessageSquare,
  Baby,
  GraduationCap,
  Home,
  Cake,
  CircleDot,
} from 'lucide-react';

export default function FamilyLegacy() {
  const [selectedMember, setSelectedMember] = useState('');
  const [viewMode, setViewMode] = useState('timeline');

  const familyMembers = [
    {
      id: 'grandpa',
      name: 'Grandpa John',
      role: 'Family Patriarch',
      totalCapsules: 47,
      totalValue: '$125,000',
      activeSince: '2023',
      avatar: '👴',
      specialization: 'Life Stories & Wisdom'
    },
    {
      id: 'mom',
      name: 'Mom Sarah',
      role: 'Memory Keeper',
      totalCapsules: 89,
      totalValue: '$245,000',
      activeSince: '2024',
      avatar: '👩',
      specialization: 'Family Photos & Videos'
    },
    {
      id: 'dad',
      name: 'Dad Michael',
      role: 'Tech Guardian',
      totalCapsules: 32,
      totalValue: '$87,000',
      activeSince: '2024',
      avatar: '👨',
      specialization: 'Digital Preservation'
    },
    {
      id: 'teen',
      name: 'Emma (16)',
      role: 'Digital Native',
      totalCapsules: 156,
      totalValue: '$320,000',
      activeSince: '2025',
      avatar: '👧',
      specialization: 'Music & Creative Content'
    },
  ];

  const familyMilestones = [
    {
      id: '1',
      title: 'First Baby Photos',
      date: '2009-03-15',
      type: 'photo',
      creator: 'Mom Sarah',
      capsuleValue: '$5,500',
      projectedValue: '$75,000 (2109)',
      icon: Baby,
      color: 'text-pink-400'
    },
    {
      id: '2',
      title: 'Wedding Anniversary Video',
      date: '2015-08-22',
      type: 'video',
      creator: 'Dad Michael',
      capsuleValue: '$12,300',
      projectedValue: '$186,000 (2115)',
      icon: CircleDot,
      color: 'text-purple-400'
    },
    {
      id: '3',
      title: 'Graduation Speech',
      date: '2023-06-10',
      type: 'video',
      creator: 'Emma',
      capsuleValue: '$3,200',
      projectedValue: '$128,000 (2123)',
      icon: GraduationCap,
      color: 'text-blue-400'
    },
    {
      id: '4',
      title: 'Grandpa\'s War Stories',
      date: '2024-11-11',
      type: 'audio',
      creator: 'Grandpa John',
      capsuleValue: '$8,900',
      projectedValue: '$357,000 (2124)',
      icon: FileText,
      color: 'text-yellow-400'
    },
  ];

  const legacyStats = [
    {
      title: 'Total Family Value',
      value: '$777,000',
      change: '+$45,600 (30d)',
      color: 'text-green-400',
      icon: TrendingUp
    },
    {
      title: 'Active Capsules',
      value: '324',
      change: '+12 this month',
      color: 'text-blue-400',
      icon: Vault
    },
    {
      title: 'Generational Reach',
      value: '600 Years',
      change: 'Through 2625',
      color: 'text-purple-400',
      icon: Clock
    },
    {
      title: 'Family Members',
      value: '4 Active',
      change: '+1 pending',
      color: 'text-yellow-400',
      icon: Users
    },
  ];

  const legacyPrograms = [
    {
      id: 'baby-first',
      name: 'Baby\'s First Everything',
      description: 'Capture and preserve every precious first moment',
      participants: 1247,
      averageValue: '$45,000',
      timeframe: '100 years',
      badge: 'MOST POPULAR'
    },
    {
      id: 'wedding-eternal',
      name: 'Eternal Wedding Collection',
      description: 'Wedding memories that appreciate like fine wine',
      participants: 892,
      averageValue: '$125,000',
      timeframe: '100 years',
      badge: 'HIGH VALUE'
    },
    {
      id: 'wisdom-keeper',
      name: 'Wisdom Keeper Program',
      description: 'Preserve elder wisdom for future generations',
      participants: 1456,
      averageValue: '$450*',
      timeframe: '200 years',
      badge: 'HERITAGE'
    },
    {
      id: 'teen-time-capsule',
      name: 'Teen Time Capsule',
      description: 'Teenage memories for their adult selves',
      participants: 2103,
      averageValue: '$185*',
      timeframe: '50 years',
      badge: 'FUTURE SELF'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900/10 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Family Legacy Hub
            <Badge className="ml-4 bg-pink-600/20 text-pink-400">GENERATIONAL</Badge>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Create a living digital inheritance that grows in value across generations. 
            Transform family memories into financial legacies that tell your story forever.
          </p>
        </div>

        {/* Family Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {legacyStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                  <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                  <p className={`text-xs font-medium ${stat.color}`}>{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="timeline" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-pink-600">
              Family Timeline
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-pink-600">
              Family Members
            </TabsTrigger>
            <TabsTrigger value="programs" className="data-[state=active]:bg-pink-600">
              Legacy Programs
            </TabsTrigger>
            <TabsTrigger value="projections" className="data-[state=active]:bg-pink-600">
              Future Value
            </TabsTrigger>
          </TabsList>

          {/* Family Timeline */}
          <TabsContent value="timeline" className="space-y-6">
            {/* Family Legacy Video */}
            <Card className="bg-gradient-to-r from-pink-900/30 to-red-900/30 border-pink-500/30">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-white font-semibold text-lg mb-2">Family Legacy in Action</h3>
                  <p className="text-slate-300 text-sm">Watch how families preserve their memories forever</p>
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto"
                    style={{ maxHeight: '250px' }}
                  >
                    <source src="/capsule_mint_sealed_staked_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-pink-400" />
                  <span>Family Memory Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {familyMilestones.map((milestone) => {
                    const Icon = milestone.icon;
                    return (
                      <div key={milestone.id} className="flex items-center space-x-6 p-6 bg-slate-700/30 rounded-lg">
                        <div className={`w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${milestone.color}`} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg">{milestone.title}</h3>
                          <p className="text-slate-400 text-sm">
                            Created by {milestone.creator} • {new Date(milestone.date).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-green-400 font-bold text-lg">{milestone.capsuleValue}</div>
                          <div className="text-slate-400 text-sm">Current Value</div>
                          <div className="text-purple-400 text-sm font-medium">{milestone.projectedValue}</div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-pink-500 text-pink-400 hover:bg-pink-600/20"
                        >
                          View Details
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Members */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {familyMembers.map((member) => (
                <Card
                  key={member.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedMember === member.id
                      ? 'bg-pink-600/20 border-pink-500 ring-2 ring-pink-500/50'
                      : 'bg-slate-800/50 border-slate-700 hover:border-pink-500/50'
                  }`}
                  onClick={() => setSelectedMember(member.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{member.avatar}</div>
                      <div>
                        <CardTitle className="text-white">{member.name}</CardTitle>
                        <p className="text-slate-400 text-sm">{member.role}</p>
                        <p className="text-pink-400 text-xs">{member.specialization}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-xl font-bold text-white">{member.totalCapsules}</div>
                        <p className="text-slate-400 text-xs">Capsules</p>
                      </div>
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-xl font-bold text-green-400">{member.totalValue}</div>
                        <p className="text-slate-400 text-xs">Total Value</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between text-sm">
                      <span className="text-slate-400">Active Since:</span>
                      <span className="text-white">{member.activeSince}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Legacy Programs */}
          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {legacyPrograms.map((program) => (
                <Card key={program.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{program.name}</CardTitle>
                        <Badge className="mt-2 bg-pink-600/20 text-pink-400">{program.badge}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-6">{program.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Participants:</span>
                        <span className="text-white font-medium">{program.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Value:</span>
                        <span className="text-green-400 font-bold">{program.averageValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Timeframe:</span>
                        <span className="text-purple-400 font-medium">{program.timeframe}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
                    >
                      Join Program
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Future Value Projections */}
          <TabsContent value="projections" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  <span>Generational Wealth Projection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-white font-semibold mb-4">Current Family Portfolio</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Today (2025)</span>
                          <span className="text-white font-bold text-xl">$2,500</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">Current family capsule investments</p>
                      </div>
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">2050 (25 years)</span>
                          <span className="text-yellow-400 font-bold text-xl">$6,000*</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">Conservative growth estimate</p>
                      </div>
                      <div className="p-4 bg-slate-600/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">2075 (50 years)</span>
                          <span className="text-orange-400 font-bold text-xl">$12,500*</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">Based on 3.5% annual growth</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">2125 (100 years)</span>
                          <span className="text-blue-400 font-bold text-2xl">$78,000*</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">Hypothetical long-term projection</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-4">Impact Timeline</h3>
                    <div className="space-y-4 text-sm">
                      <div className="p-3 bg-slate-800/30 rounded border-l-4 border-blue-500">
                        <div className="font-medium text-blue-400">Children (2025-2050)</div>
                        <p className="text-slate-300">Preserved memories with modest growth potential</p>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded border-l-4 border-green-500">
                        <div className="font-medium text-green-400">Grandchildren (2050-2075)</div>
                        <p className="text-slate-300">Family stories preserved for future generations</p>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded border-l-4 border-purple-500">
                        <div className="font-medium text-purple-400">Great-Grandchildren (2075-2125)</div>
                        <p className="text-slate-300">Multi-generational memory preservation</p>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded border-l-4 border-pink-500">
                        <div className="font-medium text-pink-400">Beyond (2125+)</div>
                        <p className="text-slate-300">Eternal family memory preservation</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Legal Disclaimer */}
                <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-semibold mb-2">Important Legal Disclaimer</h4>
                  <p className="text-red-300 text-xs leading-relaxed">
                    *All value projections are hypothetical estimates for illustrative purposes only. These projections are NOT financial advice, 
                    investment recommendations, or guarantees of future performance. Actual results may vary significantly and could result in 
                    loss of principal. Platform primarily provides memory preservation services. Past performance does not predict future results. 
                    Consult qualified financial advisors before making investment decisions. This platform is for entertainment and educational purposes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-pink-900/30 to-red-900/30 border-pink-500/30">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Start Your Family Legacy Today
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Preserve your family's precious memories for future generations. Create digital time capsules 
                that protect your stories, photos, and messages forever. Start building your family's 
                digital legacy today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-8 py-4 text-lg"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Create First Legacy Capsule
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-pink-500 text-pink-400 hover:bg-pink-600/20 px-8 py-4 text-lg"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Invite Family Members
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}