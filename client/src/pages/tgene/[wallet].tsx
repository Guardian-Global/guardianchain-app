import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dna, 
  Eye, 
  Share2, 
  Download, 
  Star,
  TrendingUp,
  Calendar,
  Hash,
  Users,
  Award,
  Zap,
  Activity
} from 'lucide-react';

interface TruthGeneData {
  wallet: string;
  nftTokenId: string;
  generatedAt: string;
  lastUpdated: string;
  traits: {
    truthfulness: number;
    creativity: number;
    influence: number;
    consistency: number;
    depth: number;
    resonance: number;
  };
  genome: {
    primarySequence: string;
    secondaryMarkers: string[];
    mutationHistory: {
      timestamp: string;
      change: string;
      trigger: string;
    }[];
  };
  analytics: {
    totalCapsules: number;
    griefScoreAverage: number;
    influenceNetwork: number;
    verificationRate: number;
    communityImpact: number;
  };
  evolution: {
    generation: number;
    parentGenomes: string[];
    childGenomes: string[];
    evolutionScore: number;
  };
  rarity: {
    rank: number;
    totalSupply: number;
    rarityScore: number;
    tier: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  };
}

export default function TruthGenomeViewer() {
  const params = useParams();
  const wallet = params.wallet;
  const [activeTab, setActiveTab] = useState<'overview' | 'traits' | 'genome' | 'evolution'>('overview');

  const { data: tgeneData, isLoading } = useQuery<TruthGeneData>({
    queryKey: ['/api/tgene', wallet],
    enabled: !!wallet
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tgeneData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <Dna className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Truth Genome Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No Truth Genome NFT found for wallet: {wallet}
          </p>
        </div>
      </div>
    );
  }

  const getRarityColor = (tier: string) => {
    switch (tier) {
      case 'Common': return 'text-gray-600 bg-gray-100';
      case 'Uncommon': return 'text-green-600 bg-green-100';
      case 'Rare': return 'text-blue-600 bg-blue-100';
      case 'Epic': return 'text-purple-600 bg-purple-100';
      case 'Legendary': return 'text-yellow-600 bg-yellow-100';
      case 'Mythic': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTraitColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatWallet = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Dna className="w-12 h-12 text-purple-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Truth Genome NFT
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore the unique genetic signature of truth-telling behavior.
          </p>
        </div>

        {/* Genome Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Genome #{tgeneData.nftTokenId}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    <span>{formatWallet(tgeneData.wallet)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Generated {formatDate(tgeneData.generatedAt)}</span>
                  </div>
                  <Badge className={getRarityColor(tgeneData.rarity.tier)}>
                    {tgeneData.rarity.tier}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  #{tgeneData.rarity.rank}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  of {tgeneData.rarity.totalSupply.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Rarity Score: {tgeneData.rarity.rarityScore.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {['overview', 'traits', 'genome', 'evolution'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab as any)}
                className="mx-1"
              >
                {tab === 'overview' && <Activity className="w-4 h-4 mr-2" />}
                {tab === 'traits' && <Star className="w-4 h-4 mr-2" />}
                {tab === 'genome' && <Dna className="w-4 h-4 mr-2" />}
                {tab === 'evolution' && <TrendingUp className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Capsules</p>
                      <p className="text-3xl font-bold">{tgeneData.analytics.totalCapsules}</p>
                    </div>
                    <Eye className="w-10 h-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Grief Score</p>
                      <p className="text-3xl font-bold">{tgeneData.analytics.griefScoreAverage.toFixed(1)}</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Influence Network</p>
                      <p className="text-3xl font-bold">{tgeneData.analytics.influenceNetwork}</p>
                    </div>
                    <Users className="w-10 h-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trait Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Truth Traits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(tgeneData.traits).map(([trait, value]) => (
                    <div key={trait} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{trait}</span>
                        <span className={`font-bold ${getTraitColor(value)}`}>
                          {value}/100
                        </span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Verification Rate</span>
                    <span className="font-semibold">{tgeneData.analytics.verificationRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Impact</span>
                    <span className="font-semibold">{tgeneData.analytics.communityImpact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Generation</span>
                    <span className="font-semibold">Gen {tgeneData.evolution.generation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evolution Score</span>
                    <span className="font-semibold">{tgeneData.evolution.evolutionScore}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Genome Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Primary Sequence</span>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {tgeneData.genome.primarySequence.slice(0, 12)}...
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span>Secondary Markers</span>
                    <span className="font-semibold">{tgeneData.genome.secondaryMarkers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mutations</span>
                    <span className="font-semibold">{tgeneData.genome.mutationHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-semibold">{formatDate(tgeneData.lastUpdated)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'traits' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Detailed Trait Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(tgeneData.traits).map(([trait, value]) => (
                  <div key={trait} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold capitalize">{trait}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getTraitColor(value)}`}>
                          {value}
                        </span>
                        <span className="text-gray-500">/100</span>
                      </div>
                    </div>
                    <Progress value={value} className="h-3 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {trait === 'truthfulness' && 'Measures consistency and accuracy in truth-telling across all capsules.'}
                      {trait === 'creativity' && 'Evaluates originality and innovative approaches in content creation.'}
                      {trait === 'influence' && 'Tracks the impact and reach of created content within the community.'}
                      {trait === 'consistency' && 'Analyzes the reliability and pattern stability in behavior.'}
                      {trait === 'depth' && 'Measures the complexity and profundity of shared truths.'}
                      {trait === 'resonance' && 'Evaluates how well content connects with and affects others.'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'genome' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dna className="w-5 h-5 mr-2" />
                  Genetic Sequence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Sequence</label>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm break-all">
                      {tgeneData.genome.primarySequence}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Secondary Markers ({tgeneData.genome.secondaryMarkers.length})
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tgeneData.genome.secondaryMarkers.map((marker, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                          {marker}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mutation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tgeneData.genome.mutationHistory.map((mutation, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">{mutation.change}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{mutation.trigger}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(mutation.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Evolution Tree
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl font-bold text-purple-600 mb-2">
                    Gen {tgeneData.evolution.generation}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Evolution Score: {tgeneData.evolution.evolutionScore}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Parent Genomes</h3>
                      {tgeneData.evolution.parentGenomes.length > 0 ? (
                        <div className="space-y-2">
                          {tgeneData.evolution.parentGenomes.map((parent, index) => (
                            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                              <code className="text-sm">{parent}</code>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Genesis genome - no parents</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Child Genomes</h3>
                      {tgeneData.evolution.childGenomes.length > 0 ? (
                        <div className="space-y-2">
                          {tgeneData.evolution.childGenomes.map((child, index) => (
                            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                              <code className="text-sm">{child}</code>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No child genomes yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex justify-center space-x-4">
              <Button>
                <Eye className="w-4 h-4 mr-2" />
                View on OpenSea
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Genome
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}