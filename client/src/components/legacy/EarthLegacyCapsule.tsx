import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Leaf, 
  Shield,
  Mountain,
  Droplets,
  Wind,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  Lock,
  Coins,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Archive,
  Vault,
  Award,
  Eye,
  History,
  TreePine,
  Fish,
  Sun,
  CloudRain
} from 'lucide-react';

interface EarthLegacy {
  id: string;
  projectName: string;
  legacyType: 'climate' | 'biodiversity' | 'ocean' | 'forest' | 'renewable' | 'conservation';
  region: string;
  stakingPeriod: '50-year' | '100-year' | '200-year' | 'millennial';
  stakingAmount: number;
  projectedImpact: string;
  projectedValue: number;
  guardianCount: number;
  carbonOffset: number;
  speciesProtected: number;
  areaProtected: number; // in hectares
  publicAccess: boolean;
  certificationLevel: 'un_verified' | 'government_verified' | 'international_treaty';
  createdDate: string;
  maturityDate: string;
  status: 'active' | 'monitoring' | 'mature';
}

interface LegacyTemplate {
  name: string;
  description: string;
  minStaking: number;
  impactMetrics: string[];
  features: string[];
  roi: string;
  category: 'climate' | 'biodiversity' | 'ocean' | 'forest' | 'renewable' | 'conservation';
}

export function EarthLegacyCapsule() {
  const [activeTab, setActiveTab] = useState<'create' | 'portfolio' | 'templates' | 'impact'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const [legacyTemplates] = useState<LegacyTemplate[]>([
    {
      name: 'Amazon Rainforest Preservation',
      description: 'Multi-generational rainforest protection with carbon credit generation and biodiversity preservation',
      minStaking: 100000000, // $100M
      impactMetrics: ['50,000 hectares protected', '2.5M tons CO2 annually', '10,000+ species'],
      features: ['Carbon Credit Generation', 'Biodiversity Monitoring', 'Indigenous Community Partnership', 'Satellite Surveillance'],
      roi: '1,247% over 200 years',
      category: 'forest'
    },
    {
      name: 'Coral Reef Restoration Network',
      description: 'Global coral reef restoration and marine ecosystem preservation across critical oceanic regions',
      minStaking: 75000000, // $75M
      impactMetrics: ['25,000 hectares restored', '500+ species protected', '10M marine life benefited'],
      features: ['Marine Sanctuary Creation', 'Coral Breeding Programs', 'Ocean Acidification Monitoring', 'Blue Carbon Credits'],
      roi: '987% over 100 years',
      category: 'ocean'
    },
    {
      name: 'Renewable Energy Infrastructure Legacy',
      description: 'Multi-generational renewable energy installations with perpetual clean energy generation',
      minStaking: 200000000, // $200M
      impactMetrics: ['1,000 MW capacity', '5M tons CO2 avoided annually', '2M households powered'],
      features: ['Solar/Wind Farm Networks', 'Energy Storage Systems', 'Grid Infrastructure', 'Technology Upgrades'],
      roi: '1,856% over 100 years',
      category: 'renewable'
    },
    {
      name: 'Climate Restoration Megaproject',
      description: 'Comprehensive climate change mitigation through carbon sequestration and atmospheric restoration',
      minStaking: 500000000, // $500M
      impactMetrics: ['100M tons CO2 sequestered', '1M hectares restored', 'Global climate impact'],
      features: ['Direct Air Capture', 'Reforestation Programs', 'Wetland Restoration', 'Climate Monitoring'],
      roi: '2,347% over 200 years',
      category: 'climate'
    },
    {
      name: 'Endangered Species Ark',
      description: 'Comprehensive species preservation program with genetic banking and habitat restoration',
      minStaking: 150000000, // $150M
      impactMetrics: ['1,000+ species protected', '500,000 hectares habitat', 'Genetic diversity preserved'],
      features: ['Genetic Banking', 'Breeding Programs', 'Habitat Restoration', 'Anti-Poaching Systems'],
      roi: '1,567% over 100 years',
      category: 'biodiversity'
    }
  ]);

  const [activeEarthLegacies] = useState<EarthLegacy[]>([
    {
      id: '1',
      projectName: 'Amazon Guardian Initiative',
      legacyType: 'forest',
      region: 'South America',
      stakingPeriod: '200-year',
      stakingAmount: 125000000,
      projectedImpact: '50,000 hectares preserved, 2.5M tons CO2 annually',
      projectedValue: 1558750000,
      guardianCount: 150,
      carbonOffset: 2500000, // tons CO2 annually
      speciesProtected: 12500,
      areaProtected: 50000, // hectares
      publicAccess: true,
      certificationLevel: 'international_treaty',
      createdDate: '2024-04-15',
      maturityDate: '2224-04-15',
      status: 'active'
    },
    {
      id: '2',
      projectName: 'Great Barrier Reef Revival',
      legacyType: 'ocean',
      region: 'Australia',
      stakingPeriod: '100-year',
      stakingAmount: 85000000,
      projectedImpact: '15,000 hectares restored, 300+ species protected',
      projectedValue: 839150000,
      guardianCount: 95,
      carbonOffset: 450000, // tons CO2 annually (blue carbon)
      speciesProtected: 8900,
      areaProtected: 15000, // hectares
      publicAccess: true,
      certificationLevel: 'government_verified',
      createdDate: '2024-07-22',
      maturityDate: '2124-07-22',
      status: 'monitoring'
    },
    {
      id: '3',
      projectName: 'Sahara Solar Legacy',
      legacyType: 'renewable',
      region: 'North Africa',
      stakingPeriod: '100-year',
      stakingAmount: 275000000,
      projectedImpact: '2,000 MW capacity, 8M tons CO2 avoided annually',
      projectedValue: 2712500000,
      guardianCount: 75,
      carbonOffset: 8000000, // tons CO2 annually
      speciesProtected: 0,
      areaProtected: 5000, // hectares
      publicAccess: false,
      certificationLevel: 'government_verified',
      createdDate: '2024-02-10',
      maturityDate: '2124-02-10',
      status: 'active'
    }
  ]);

  const [createForm, setCreateForm] = useState({
    projectName: '',
    legacyType: 'climate',
    region: '',
    stakingPeriod: '100-year',
    stakingAmount: 50000000,
    projectedImpact: '',
    guardianCount: 10,
    publicAccess: true,
    certificationLevel: 'un_verified',
    projectDescription: '',
    impactMetrics: '',
    sustainabilityPlan: ''
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getLegacyTypeColor = (type: string) => {
    switch (type) {
      case 'climate': return 'bg-blue-600/20 text-blue-400';
      case 'biodiversity': return 'bg-green-600/20 text-green-400';
      case 'ocean': return 'bg-cyan-600/20 text-cyan-400';
      case 'forest': return 'bg-emerald-600/20 text-emerald-400';
      case 'renewable': return 'bg-yellow-600/20 text-yellow-400';
      case 'conservation': return 'bg-purple-600/20 text-purple-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getLegacyTypeIcon = (type: string) => {
    switch (type) {
      case 'climate': return <Wind className="h-5 w-5" />;
      case 'biodiversity': return <TreePine className="h-5 w-5" />;
      case 'ocean': return <Fish className="h-5 w-5" />;
      case 'forest': return <Leaf className="h-5 w-5" />;
      case 'renewable': return <Sun className="h-5 w-5" />;
      case 'conservation': return <Mountain className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const calculateProjectedValue = (staking: number, years: number) => {
    // Earth legacy appreciation: 9.87% annually compounded (environmental value increase)
    return staking * Math.pow(1.0987, years);
  };

  const totalCarbonOffset = activeEarthLegacies.reduce((sum, legacy) => sum + legacy.carbonOffset, 0);
  const totalSpeciesProtected = activeEarthLegacies.reduce((sum, legacy) => sum + legacy.speciesProtected, 0);
  const totalAreaProtected = activeEarthLegacies.reduce((sum, legacy) => sum + legacy.areaProtected, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Earth Legacy Capsules</h2>
          <p className="text-slate-400">
            Preserve Earth's natural heritage with multi-generational environmental stewardship and value appreciation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            {formatNumber(totalCarbonOffset)} tons CO2
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            {activeEarthLegacies.length} Active Projects
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Staked Value</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(activeEarthLegacies.reduce((sum, legacy) => sum + legacy.stakingAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Wind className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">CO2 Offset/Year</p>
                <p className="text-xl font-bold text-white">{formatNumber(totalCarbonOffset)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <TreePine className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Species Protected</p>
                <p className="text-xl font-bold text-white">{formatNumber(totalSpeciesProtected)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Mountain className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Area Protected</p>
                <p className="text-xl font-bold text-white">{formatNumber(totalAreaProtected)} ha</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
        <Button
          size="sm"
          variant={activeTab === 'create' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('create')}
          className="flex-1"
        >
          Create Earth Legacy
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'portfolio' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('portfolio')}
          className="flex-1"
        >
          Active Projects
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'templates' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('templates')}
          className="flex-1"
        >
          Templates
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'impact' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('impact')}
          className="flex-1"
        >
          Impact Analytics
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Create Earth Legacy Capsule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Project Name</label>
                  <Input 
                    value={createForm.projectName}
                    onChange={(e) => setCreateForm({...createForm, projectName: e.target.value})}
                    placeholder="Enter project name"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Legacy Type</label>
                  <select 
                    value={createForm.legacyType}
                    onChange={(e) => setCreateForm({...createForm, legacyType: e.target.value as any})}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="climate">Climate Restoration</option>
                    <option value="biodiversity">Biodiversity Conservation</option>
                    <option value="ocean">Ocean Preservation</option>
                    <option value="forest">Forest Protection</option>
                    <option value="renewable">Renewable Energy</option>
                    <option value="conservation">Wildlife Conservation</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Region</label>
                  <Input 
                    value={createForm.region}
                    onChange={(e) => setCreateForm({...createForm, region: e.target.value})}
                    placeholder="Geographic region or country"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Staking & Governance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Staking Period</label>
                  <select 
                    value={createForm.stakingPeriod}
                    onChange={(e) => setCreateForm({...createForm, stakingPeriod: e.target.value as any})}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="50-year">50 Years</option>
                    <option value="100-year">100 Years</option>
                    <option value="200-year">200 Years</option>
                    <option value="millennial">1000 Years (Millennial)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Staking Amount (GTT)</label>
                  <Input 
                    type="number"
                    value={createForm.stakingAmount}
                    onChange={(e) => setCreateForm({...createForm, stakingAmount: parseInt(e.target.value)})}
                    placeholder="Minimum: 50,000,000 GTT"
                    className="bg-slate-700 border-slate-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Projected Value: {formatCurrency(calculateProjectedValue(createForm.stakingAmount, 100))}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Guardian Count</label>
                  <Input 
                    type="number"
                    value={createForm.guardianCount}
                    onChange={(e) => setCreateForm({...createForm, guardianCount: parseInt(e.target.value)})}
                    placeholder="5-200 guardians"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Project Description</label>
                <Textarea 
                  value={createForm.projectDescription}
                  onChange={(e) => setCreateForm({...createForm, projectDescription: e.target.value})}
                  placeholder="Describe the environmental project and its long-term goals..."
                  className="bg-slate-700 border-slate-600 h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Projected Impact</label>
                <Input 
                  value={createForm.projectedImpact}
                  onChange={(e) => setCreateForm({...createForm, projectedImpact: e.target.value})}
                  placeholder="e.g., 10,000 hectares protected, 1M tons CO2 annually"
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Sustainability Plan</label>
                <Textarea 
                  value={createForm.sustainabilityPlan}
                  onChange={(e) => setCreateForm({...createForm, sustainabilityPlan: e.target.value})}
                  placeholder="Long-term sustainability strategy and monitoring plan..."
                  className="bg-slate-700 border-slate-600 h-24"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={createForm.publicAccess}
                    onChange={(e) => setCreateForm({...createForm, publicAccess: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">Enable Public Monitoring</span>
                </label>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Globe className="h-4 w-4 mr-2" />
                Create Earth Legacy Capsule
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Active Earth Legacy Projects</h3>
          
          <div className="grid gap-6">
            {activeEarthLegacies.map((legacy) => (
              <Card key={legacy.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-lg ${getLegacyTypeColor(legacy.legacyType)}`}>
                          {getLegacyTypeIcon(legacy.legacyType)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{legacy.projectName}</h4>
                          <p className="text-sm text-slate-400">{legacy.region}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getLegacyTypeColor(legacy.legacyType)}>
                              {legacy.legacyType.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-slate-400 mb-2">Environmental Impact</p>
                        <p className="text-white">{legacy.projectedImpact}</p>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">Staked Value</p>
                          <p className="text-lg font-bold text-white">{formatCurrency(legacy.stakingAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">CO2 Offset/Year</p>
                          <p className="text-lg font-bold text-green-400">{formatNumber(legacy.carbonOffset)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Species Protected</p>
                          <p className="text-lg font-bold text-white">{formatNumber(legacy.speciesProtected)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Area Protected</p>
                          <p className="text-lg font-bold text-white">{formatNumber(legacy.areaProtected)} ha</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-400">Maturity: {legacy.maturityDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-slate-400">{legacy.guardianCount} Guardians</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <Badge className={`mb-3 ${
                        legacy.status === 'active' ? 'bg-green-600/20 text-green-400' :
                        legacy.status === 'monitoring' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-blue-600/20 text-blue-400'
                      }`}>
                        {legacy.status.toUpperCase()}
                      </Badge>
                      <div className="mb-3">
                        <p className="text-sm text-slate-400">Projected Value</p>
                        <p className="text-xl font-bold text-green-400">{formatCurrency(legacy.projectedValue)}</p>
                      </div>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline">
                          Monitor Impact
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                          Manage Project
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Earth Legacy Templates</h3>
          
          <div className="grid gap-6">
            {legacyTemplates.map((template, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-lg ${getLegacyTypeColor(template.category)}`}>
                          {getLegacyTypeIcon(template.category)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{template.name}</h4>
                          <p className="text-sm text-slate-400">{template.description}</p>
                        </div>
                        <Badge className={getLegacyTypeColor(template.category)}>
                          {template.category.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">Minimum Staking</p>
                          <p className="text-lg font-bold text-white">{formatCurrency(template.minStaking)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Projected ROI</p>
                          <p className="text-lg font-bold text-green-400">{template.roi}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2">Impact Metrics</p>
                        <div className="flex flex-wrap gap-2">
                          {template.impactMetrics.map((metric, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-2">Template Features</p>
                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setSelectedTemplate(template.name)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Environmental Impact Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-400" />
                  Carbon Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual CO2 Offset</span>
                    <span className="text-green-400 font-bold">{formatNumber(totalCarbonOffset)} tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">100-Year CO2 Impact</span>
                    <span className="text-green-400 font-bold">{formatNumber(totalCarbonOffset * 100)} tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carbon Credit Value</span>
                    <span className="text-white font-medium">{formatCurrency(totalCarbonOffset * 50)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-green-400" />
                  Biodiversity Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Species Protected</span>
                    <span className="text-green-400 font-bold">{formatNumber(totalSpeciesProtected)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Area Protected</span>
                    <span className="text-green-400 font-bold">{formatNumber(totalAreaProtected)} hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ecosystem Value</span>
                    <span className="text-white font-medium">{formatCurrency(totalAreaProtected * 25000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Earth Legacy Impact</h4>
                  <p className="text-green-300 mb-4">
                    Protecting {formatNumber(totalAreaProtected)} hectares with {formatNumber(totalCarbonOffset)} tons annual CO2 offset across {activeEarthLegacies.length} legacy projects
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      987% average environmental value appreciation over 100-year periods
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Total Environmental Value</p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(activeEarthLegacies.reduce((sum, legacy) => sum + legacy.projectedValue, 0))}
                  </p>
                  <p className="text-sm text-green-300">Projected Impact Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}