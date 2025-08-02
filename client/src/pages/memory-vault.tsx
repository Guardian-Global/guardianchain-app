import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { calculateMemoryVaultGrowth, calculateStakingReward, STAKING_POOLS, calculateInstitutionalMarketSize, INSTITUTIONAL_MARKETS, calculateVendorCosts, calculateOptimalPricing, VENDOR_COSTS } from '@/utils/memoryVaultCalculations';
import {
  Vault,
  Clock,
  Shield,
  Infinity,
  Heart,
  Upload,
  Music,
  FileText,
  Image,
  Video,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Lock,
  Star,
  Calendar,
  Zap,
  Globe,
} from 'lucide-react';

export default function MemoryVault() {
  const [selectedDataType, setSelectedDataType] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stakingYears, setStakingYears] = useState(100);

  const dataTypes = [
    {
      id: 'photos',
      name: 'Family Photos',
      icon: Image,
      description: 'Professional portraits, family gatherings, special moments',
      cost: '$125-250',
      potential: `$${calculateMemoryVaultGrowth(200, 100, 'family_memories').finalValue.toLocaleString()} (100 years)`,
      badge: 'POPULAR'
    },
    {
      id: 'videos',
      name: 'Family Videos',
      icon: Video,
      description: 'Birthdays, weddings, first steps, life milestones',
      cost: '$200-400',
      potential: `$${calculateMemoryVaultGrowth(300, 100, 'digital_collectibles').finalValue.toLocaleString()} (100 years)`,
      badge: 'HIGH VALUE'
    },
    {
      id: 'songs',
      name: 'Original Music',
      icon: Music,
      description: 'Family songs, lullabies, personal compositions',
      cost: '$75-150',
      potential: `$${calculateMemoryVaultGrowth(112, 100, 'creative_content').finalValue.toLocaleString()} (100 years)`,
      badge: 'CREATIVE'
    },
    {
      id: 'poems',
      name: 'Poetry & Writing',
      icon: FileText,
      description: 'Love letters, poems, personal stories, wisdom',
      cost: '$50-100',
      potential: `$${calculateMemoryVaultGrowth(75, 100, 'creative_content').finalValue.toLocaleString()} (100 years)`,
      badge: 'LITERARY'
    },
    {
      id: 'messages',
      name: 'Time-Lock Messages',
      icon: MessageSquare,
      description: 'Birthday wishes, advice, future communications',
      cost: '$15-50',
      potential: `$${calculateMemoryVaultGrowth(32, 100, 'time_capsules').finalValue.toLocaleString()} (100 years)`,
      badge: 'LEGACY'
    },
    {
      id: 'data',
      name: 'Life Data',
      icon: Globe,
      description: 'Digital footprint, achievements, memories, moments',
      cost: '$100-300',
      potential: `$${calculateMemoryVaultGrowth(200, 100, 'life_data').finalValue.toLocaleString()} (100 years)`,
      badge: 'COMPREHENSIVE'
    },
    // Institutional & Professional Markets
    {
      id: 'legal',
      name: 'Legal Evidence & Court Records',
      icon: Shield,
      description: 'Court cases, depositions, legal evidence, witness testimonies',
      cost: '$500-2000',
      potential: `$${calculateMemoryVaultGrowth(1250, 100, 'legal_documents').finalValue.toLocaleString()} (100 years)`,
      badge: 'INSTITUTIONAL'
    },
    {
      id: 'sports',
      name: 'Athletic Achievements & Records',
      icon: Award,
      description: 'Sports events, championships, records, athlete performances, yearbooks',
      cost: '$200-800',
      potential: `$${calculateMemoryVaultGrowth(500, 100, 'sports_achievements').finalValue.toLocaleString()} (100 years)`,
      badge: 'ATHLETICS'
    },
    {
      id: 'academic',
      name: 'School Records & Achievements',
      icon: Users,
      description: 'Graduations, academic achievements, yearbooks, school history',
      cost: '$150-600',
      potential: `$${calculateMemoryVaultGrowth(375, 100, 'academic_records').finalValue.toLocaleString()} (100 years)`,
      badge: 'EDUCATION'
    },
    {
      id: 'whistleblower',
      name: 'Truth Verification & Whistleblowing',
      icon: Lock,
      description: 'Protected disclosures, truth verification, anonymous evidence',
      cost: '$300-1500',
      potential: `$${calculateMemoryVaultGrowth(900, 100, 'whistleblower_evidence').finalValue.toLocaleString()} (100 years)`,
      badge: 'TRUTH PROTECTION'
    },
  ];

  const stakingRewards = {
    1: { multiplier: '1.05x', annual: '5%' },
    10: { multiplier: '1.8x', annual: '6%' },
    25: { multiplier: '5.4x', annual: '7%' },
    50: { multiplier: '47x', annual: '8%' },
    100: { multiplier: '136x', annual: '9%' },
  };

  const calculatePotentialValue = (initialCost: number, years: number) => {
    const annualRate = stakingRewards[years as keyof typeof stakingRewards]?.annual || '5%';
    const rate = parseFloat(annualRate) / 100;
    return initialCost * Math.pow(1 + rate, years);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Hero Video */}
          <div className="relative mb-8 mx-auto max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
                style={{ maxHeight: '400px' }}
              >
                <source src="/capsule_mint_sealed_staked_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-white text-sm font-medium">Memory Vault Capsule Creation Process</div>
                <div className="text-slate-300 text-xs">Watch your memories transform into eternal digital assets</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-green-600 rounded-2xl flex items-center justify-center">
              <Vault className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Memory Vault System
            <Badge className="ml-4 bg-green-600/20 text-green-400">NEW</Badge>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Transform ANY digital data into eternal digital assets. Turn family photos, songs, poems, 
            messages, and life moments into investments that appreciate for centuries.
          </p>
          <div className="flex items-center justify-center space-x-8 text-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-400" />
              <span className="text-green-400 font-semibold">Ultimate Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Infinity className="h-6 w-6 text-blue-400" />
              <span className="text-blue-400 font-semibold">Infinite Recoverability</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-purple-400" />
              <span className="text-purple-400 font-semibold">Generational Wealth</span>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Traditional Storage</h3>
                <p className="text-slate-300 mb-4">
                  Spend $200 photographer + $50/year storage = $5,200 over 100 years
                </p>
                <div className="text-red-400 font-bold">PURE EXPENSE</div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Vault className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Memory Vault</h3>
                <p className="text-slate-300 mb-4">
                  Spend $200 photographer + $250 capsule = $450 total investment
                </p>
                <div className="text-green-400 font-bold">TURNS INTO $75,000+</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Veritas Tools Integration */}
        <Card className="bg-gradient-to-r from-red-900/30 to-yellow-900/30 border-red-500/30 mb-12">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">🔴 TRUTH VERIFICATION ECOSYSTEM</h2>
              <p className="text-slate-300 text-lg">Preventing AI & Power Alteration of Reality Through Validated Digital Memory Preservation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-600 hover:border-red-500/50 transition-all cursor-pointer" 
                onClick={() => window.location.href = '/veritas-seal'}>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold mb-2">Veritas Seal</h3>
                  <p className="text-slate-300 text-sm">Legal verification for binding truth capsules</p>
                  <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1">ACCESS NOW</Button>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-600 hover:border-yellow-500/50 transition-all cursor-pointer"
                onClick={() => window.location.href = '/truth-bounty'}>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold mb-2">Truth Bounty</h3>
                  <p className="text-slate-300 text-sm">GTT rewards for community investigation</p>
                  <Button className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1">START BOUNTY</Button>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-600 hover:border-green-500/50 transition-all cursor-pointer"
                onClick={() => window.location.href = '/truth-redemption'}>
                <CardContent className="p-4 text-center">
                  <Heart className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold mb-2">Truth Redemption</h3>
                  <p className="text-slate-300 text-sm">Public accountability platform</p>
                  <Button className="mt-2 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1">REDEEM TRUTH</Button>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-600 hover:border-purple-500/50 transition-all cursor-pointer"
                onClick={() => window.location.href = '/conspiracy-capsule'}>
                <CardContent className="p-4 text-center">
                  <Lock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold mb-2">Conspiracy Capsule</h3>
                  <p className="text-slate-300 text-sm">Secure whistleblower disclosure portal</p>
                  <Button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1">DISCLOSE SAFELY</Button>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-6">
              <p className="text-red-400 font-semibold">Humans must validate and preserve actual reality before AI alters truth forever</p>
              <div className="mt-4">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white mx-2"
                  onClick={() => window.location.href = '/whistleblower-sanctuary'}
                >
                  Enter Whistleblower Sanctuary
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white mx-2"
                  onClick={() => window.location.href = '/specialized-intake'}
                >
                  Specialized Truth Intake
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Types Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Transform ANY Data Into Eternal Digital Assets
          </h2>
          <div className="text-center mb-8">
            <p className="text-slate-300 text-lg">Personal & Family + Institutional Markets (Courts, Schools, Sports, Legal)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedDataType === type.id;
              
              return (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/50'
                      : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                  }`}
                  onClick={() => setSelectedDataType(type.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-purple-600' : 'bg-slate-700'
                        }`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{type.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {type.badge}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-4">{type.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Initial Cost:</span>
                        <span className="text-white font-medium">{type.cost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">100-Year Value:</span>
                        <span className="text-green-400 font-bold">{type.potential}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Staking Calculator */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Clock className="h-6 w-6 text-yellow-400" />
              <span>100-Year Staking Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Staking Options */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Choose Staking Period</h3>
                <div className="space-y-3">
                  {Object.entries(stakingRewards).map(([years, data]) => (
                    <div
                      key={years}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        stakingYears === parseInt(years)
                          ? 'bg-yellow-600/20 border-yellow-500'
                          : 'bg-slate-700/50 border-slate-600 hover:border-yellow-500/50'
                      }`}
                      onClick={() => setStakingYears(parseInt(years))}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-white font-medium">{years} Years</span>
                          <p className="text-slate-300 text-sm">{data.annual} Annual Yield</p>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">{data.multiplier}</div>
                          <div className="text-xs text-slate-400">Total Multiplier</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI Visualization */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Investment Projection</h3>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-green-500/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        ${calculateMemoryVaultGrowth(250, stakingYears, 'family_memories').finalValue.toLocaleString()}
                      </div>
                      <p className="text-slate-300">
                        Final Value ({stakingYears} years)
                      </p>
                      <p className="text-slate-400 text-sm mt-2">
                        Includes {calculateMemoryVaultGrowth(250, stakingYears, 'family_memories').gttTokensEarned} GTT tokens (${calculateMemoryVaultGrowth(250, stakingYears, 'family_memories').gttTokenValue.toLocaleString()} value)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-xl font-bold text-white">$250</div>
                      <p className="text-slate-400 text-sm">Initial Investment</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-xl font-bold text-yellow-400">
                        {Math.round((calculateMemoryVaultGrowth(250, stakingYears, 'family_memories').finalValue / 250) * 100) / 100}x
                      </div>
                      <p className="text-slate-400 text-sm">Return Multiple</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-slate-300 text-sm mb-2">Progress Visualization</p>
                    <Progress value={Math.min((stakingYears / 100) * 100, 100)} className="h-2" />
                    <p className="text-xs text-slate-400 mt-1">
                      {stakingYears} years selected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time-Lock Message Example - Realistic 100-Year Timeline */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-pink-400" />
              <span>Time-Lock Message: 100-Year Example</span>
              <Badge className="bg-pink-600/20 text-pink-400">FAMILY LEGACY</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">The Message</h3>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                  <p className="text-slate-300 italic">
                    "Happy 16th birthday, my dear great-granddaughter! 
                    I'm writing this in 2025, hoping you'll read it in 2125. 
                    I invested $15 in this message capsule. I wonder what it's worth now? 
                    Remember: family love is the only currency that appreciates forever. ❤️"
                  </p>
                  <div className="mt-4 text-xs text-slate-400">
                    — Locked until January 1, 2125
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Value Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="text-slate-300">2025 (Today)</span>
                    <span className="text-white font-bold">$15</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">2050 (25 years)</span>
                    <span className="text-yellow-400 font-bold">$81</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-600/50 rounded-lg">
                    <span className="text-slate-300">2075 (50 years)</span>
                    <span className="text-orange-400 font-bold">$705</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                    <span className="text-slate-300">2125 (100 years)</span>
                    <span className="text-green-400 font-bold text-xl">$2,047</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Institutional Markets Section */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              🏛️ INSTITUTIONAL MARKETS - MASSIVE SCALE OPPORTUNITY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    ${calculateInstitutionalMarketSize().totalAddressableMarket.toLocaleString()}
                  </div>
                  <p className="text-slate-300">Total Addressable Market</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    ${calculateInstitutionalMarketSize().fiveYearRevenue.toLocaleString()}
                  </div>
                  <p className="text-slate-300">5-Year Revenue Potential</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    ${calculateInstitutionalMarketSize().gttTokenDemand.toLocaleString()}
                  </div>
                  <p className="text-slate-300">GTT Token Demand</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(INSTITUTIONAL_MARKETS).map(([key, market]) => (
                <Card key={key} className="bg-slate-800/50 border-slate-600">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-white font-bold text-lg mb-2">{market.name}</h3>
                    <div className="space-y-2">
                      <div className="text-green-400 text-xl font-bold">
                        ${market.averagePrice.toLocaleString()}
                      </div>
                      <p className="text-slate-400 text-sm">Average Price</p>
                      <div className="text-blue-400 text-lg font-semibold">
                        {(market.globalMarket / 1000000).toFixed(0)}M
                      </div>
                      <p className="text-slate-400 text-sm">Global Market Size</p>
                      <div className="text-yellow-400 text-lg font-semibold">
                        {(market.adoptionRate * 100).toFixed(0)}%
                      </div>
                      <p className="text-slate-400 text-sm">5-Year Adoption</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-slate-300 text-lg mb-4">
                Courts, Schools, Sports Events, Legal Firms - Preventing institutional memory loss forever
              </p>
              <p className="text-blue-400 font-semibold">
                Global junior athletics, yearbooks, discoveries, awards - no achievement forgotten
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Cost Analysis & Profitability */}
        <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              💰 VENDOR COST ANALYSIS & PROFITABILITY MODEL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Real Vendor Costs Per Capsule</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">IPFS Storage (per GB/year)</span>
                    <span className="text-red-400">${VENDOR_COSTS.ipfsStorage}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Blockchain Transaction</span>
                    <span className="text-red-400">${VENDOR_COSTS.blockchainTransaction}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Video Processing (per min)</span>
                    <span className="text-red-400">${VENDOR_COSTS.videoProcessing}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">AI Validation</span>
                    <span className="text-red-400">${VENDOR_COSTS.aiValidation}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Security Audit</span>
                    <span className="text-red-400">${VENDOR_COSTS.securityAudit}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Legal Compliance</span>
                    <span className="text-red-400">${VENDOR_COSTS.legalCompliance}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-600/20 rounded-lg border border-green-500/30">
                    <span className="text-white font-bold">Total Base Cost (1GB capsule)</span>
                    <span className="text-green-400 font-bold">${calculateVendorCosts(1, 5, false, false).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Pricing Model & Margins</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Personal Family Capsule (1GB)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Vendor Costs:</span>
                        <span className="text-red-400">${calculateVendorCosts(1, 5, false, false).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Our Price:</span>
                        <span className="text-green-400">${calculateOptimalPricing(calculateVendorCosts(1, 5, false, false), false, false).finalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Profit Margin:</span>
                        <span className="text-green-400 font-bold">{calculateOptimalPricing(calculateVendorCosts(1, 5, false, false), false, false).margin}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Institutional Legal (10GB)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Vendor Costs:</span>
                        <span className="text-red-400">${calculateVendorCosts(10, 20, true, true).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Our Price:</span>
                        <span className="text-green-400">${calculateOptimalPricing(calculateVendorCosts(10, 20, true, true), true, false).finalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Profit Margin:</span>
                        <span className="text-green-400 font-bold">{calculateOptimalPricing(calculateVendorCosts(10, 20, true, true), true, false).margin}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                    <p className="text-white text-center font-bold">
                      ✅ AGGRESSIVE PRICING WITH 35%+ PROFIT MARGINS MAINTAINED
                    </p>
                    <p className="text-slate-300 text-center text-sm mt-2">
                      Sustainable scaling with institutional 2.5x multiplier funding personal markets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-8 py-4 text-lg"
              disabled={!selectedDataType}
            >
              <Upload className="h-5 w-5 mr-2" />
              Create Memory Capsule ({selectedDataType ? dataTypes.find(t => t.id === selectedDataType)?.cost : 'Select Data Type'})
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-purple-500 text-purple-400 hover:bg-purple-600/20 px-8 py-4 text-lg"
            >
              <Clock className="h-5 w-5 mr-2" />
              Start 100-Year Staking
            </Button>
          </div>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Join thousands of families who have transformed their photo expenses into generational wealth. 
            Your memories become your family's financial legacy.
          </p>
        </div>
      </div>
    </div>
  );
}