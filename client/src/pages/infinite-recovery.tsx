import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Infinity,
  Shield,
  Cloud,
  HardDrive,
  Satellite,
  Globe,
  Lock,
  Key,
  RefreshCw,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  Zap,
  Clock,
  Users,
  Database,
  Network,
  Cpu,
  Server,
  Wifi,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export default function InfiniteRecovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState('idle');

  const storageNodes = [
    {
      id: 'ipfs-primary',
      name: 'IPFS Primary Network',
      status: 'online',
      replicas: '10,000+',
      uptime: '99.97%',
      location: 'Global Distributed',
      security: 'Military Grade',
      icon: Globe
    },
    {
      id: 'blockchain-ethereum',
      name: 'Ethereum Mainnet',
      status: 'online',
      replicas: '15,000+',
      uptime: '100%',
      location: 'Global Nodes',
      security: 'Cryptographic',
      icon: Network
    },
    {
      id: 'blockchain-polygon',
      name: 'Polygon Network',
      status: 'online',
      replicas: '12,000+',
      uptime: '99.99%',
      location: 'Multi-Chain',
      security: 'Proof of Stake',
      icon: Database
    },
    {
      id: 'arweave',
      name: 'Arweave Permaweb',
      status: 'online',
      replicas: '1,000+',
      uptime: '99.95%',
      location: 'Permanent Storage',
      security: '200-Year Guarantee',
      icon: Infinity
    },
    {
      id: 'filecoin',
      name: 'Filecoin Network',
      status: 'online',
      replicas: '5,000+',
      uptime: '99.89%',
      location: 'Decentralized Storage',
      security: 'Cryptographic Proof',
      icon: HardDrive
    },
    {
      id: 'satellite',
      name: 'Satellite Backup',
      status: 'online',
      replicas: '3 Satellites',
      uptime: '99.95%',
      location: 'Low Earth Orbit',
      security: 'Quantum Resistant',
      icon: Satellite
    },
  ];

  const recoveryScenarios = [
    {
      id: 'device-loss',
      title: 'Lost Device/Phone',
      description: 'Your phone, laptop, or tablet is lost or stolen',
      recoveryTime: '15 minutes',
      successRate: '100%',
      methods: ['Biometric Scan', 'Master Key', 'Family Verification'],
      icon: '📱'
    },
    {
      id: 'account-locked',
      title: 'Account Lockout',
      description: 'Forgotten passwords or locked out of accounts',
      recoveryTime: '30 minutes',
      successRate: '100%',
      methods: ['Multi-Factor Recovery', 'Trustee Network', 'Biometric Proof'],
      icon: '🔐'
    },
    {
      id: 'data-corruption',
      title: 'Data Corruption',
      description: 'Files corrupted or accidentally deleted',
      recoveryTime: '5 minutes',
      successRate: '100%',
      methods: ['Hash Verification', 'Multiple Replicas', 'Auto-Restoration'],
      icon: '💾'
    },
    {
      id: 'platform-shutdown',
      title: 'Platform Shutdown',
      description: 'Cloud service or platform goes out of business',
      recoveryTime: '24 hours',
      successRate: '100%',
      methods: ['Blockchain Recovery', 'IPFS Access', 'Satellite Download'],
      icon: '🏢'
    },
    {
      id: 'natural-disaster',
      title: 'Natural Disasters',
      description: 'Earthquakes, floods, fires destroy local infrastructure',
      recoveryTime: '1 hour',
      successRate: '100%',
      methods: ['Global Replication', 'Satellite Backup', 'Distributed Network'],
      icon: '🌪️'
    },
    {
      id: 'internet-down',
      title: 'Internet Outage',
      description: 'Complete internet outage in your region',
      recoveryTime: '2 hours',
      successRate: '100%',
      methods: ['Satellite Internet', 'Mesh Networks', 'Mobile Data'],
      icon: '📡'
    },
    {
      id: 'civilization-collapse',
      title: 'Societal Collapse',
      description: 'Complete breakdown of modern infrastructure',
      recoveryTime: 'Years',
      successRate: '95%',
      methods: ['Blockchain Survival', 'Satellite Archives', 'Physical Backups'],
      icon: '🌍'
    },
    {
      id: 'solar-flare',
      title: 'Solar Flare/EMP',
      description: 'Electromagnetic pulse destroys electronics',
      recoveryTime: 'Months',
      successRate: '90%',
      methods: ['Hardened Satellites', 'Underground Bunkers', 'Faraday Cages'],
      icon: '☀️'
    },
  ];

  const userCapsules = [
    {
      id: '1',
      name: 'Family Wedding 2024',
      type: 'Video',
      size: '2.4 GB',
      nodes: 6,
      lastVerified: '2 hours ago',
      integrity: '100%',
      value: '$15,600'
    },
    {
      id: '2',
      name: 'Birthday Message 2625',
      type: 'Message',
      size: '2 KB',
      nodes: 6,
      lastVerified: '1 hour ago',
      integrity: '100%',
      value: '$1,250'
    },
    {
      id: '3',
      name: 'Family Photos 2023',
      type: 'Photos',
      size: '890 MB',
      nodes: 6,
      lastVerified: '3 hours ago',
      integrity: '100%',
      value: '$8,900'
    },
  ];

  const handleRecoveryTest = () => {
    setRecoveryStatus('testing');
    setTimeout(() => {
      setRecoveryStatus('success');
      setTimeout(() => setRecoveryStatus('idle'), 3000);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (status: string) => {
    return status === 'online' ? CheckCircle : AlertTriangle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
              <Infinity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Infinite Recovery System
            <Badge className="ml-4 bg-blue-600/20 text-blue-400">ULTIMATE SECURITY</Badge>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Your memories are protected by the most advanced recovery system ever built. 
            From device loss to civilization collapse - your data survives everything.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              System Overview
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-blue-600">
              Recovery Scenarios
            </TabsTrigger>
            <TabsTrigger value="nodes" className="data-[state=active]:bg-blue-600">
              Storage Nodes
            </TabsTrigger>
            <TabsTrigger value="recovery" className="data-[state=active]:bg-blue-600">
              Test Recovery
            </TabsTrigger>
          </TabsList>

          {/* System Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-2">100%</div>
                  <p className="text-slate-400 text-sm">Recovery Success Rate</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Network className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-2">47,000+</div>
                  <p className="text-slate-400 text-sm">Global Storage Nodes</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-2">15 min</div>
                  <p className="text-slate-400 text-sm">Average Recovery Time</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Infinity className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-2">∞</div>
                  <p className="text-slate-400 text-sm">Recovery Scenarios Covered</p>
                </CardContent>
              </Card>
            </div>

            {/* Your Protected Capsules */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3">
                  <Lock className="h-6 w-6 text-blue-400" />
                  <span>Your Protected Memory Capsules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userCapsules.map((capsule) => (
                    <div key={capsule.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{capsule.name}</h4>
                          <p className="text-slate-400 text-sm">
                            {capsule.type} • {capsule.size} • Protected on {capsule.nodes} nodes
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-green-400 font-bold">{capsule.value}</div>
                        <div className="text-slate-400 text-sm">Integrity: {capsule.integrity}</div>
                        <div className="text-slate-500 text-xs">Verified {capsule.lastVerified}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recovery Guarantee */}
            <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    The Infinite Recovery Guarantee
                  </h2>
                  <p className="text-slate-300 text-lg mb-8 max-w-3xl mx-auto">
                    We guarantee that your memories will survive any conceivable disaster. 
                    If we can't recover your data within 24 hours, we'll refund 10x your investment.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-white font-bold mb-2">100% Success Rate</h3>
                      <p className="text-slate-400 text-sm">Never lost a single byte in 3 years</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-8 w-8 text-blue-400" />
                      </div>
                      <h3 className="text-white font-bold mb-2">Lightning Fast</h3>
                      <p className="text-slate-400 text-sm">Most recoveries complete in under 15 minutes</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Infinity className="h-8 w-8 text-purple-400" />
                      </div>
                      <h3 className="text-white font-bold mb-2">Future Proof</h3>
                      <p className="text-slate-400 text-sm">Adapts to new threats automatically</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recovery Scenarios */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recoveryScenarios.map((scenario) => (
                <Card key={scenario.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{scenario.icon}</div>
                      <div>
                        <CardTitle className="text-white">{scenario.title}</CardTitle>
                        <p className="text-slate-400 text-sm">{scenario.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-lg font-bold text-green-400">{scenario.recoveryTime}</div>
                          <p className="text-slate-400 text-xs">Recovery Time</p>
                        </div>
                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-lg font-bold text-blue-400">{scenario.successRate}</div>
                          <p className="text-slate-400 text-xs">Success Rate</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Recovery Methods:</h4>
                        <div className="space-y-1">
                          {scenario.methods.map((method, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-slate-300">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Storage Nodes */}
          <TabsContent value="nodes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {storageNodes.map((node) => {
                const Icon = node.icon;
                const StatusIcon = getStatusIcon(node.status);
                
                return (
                  <Card key={node.id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-8 w-8 text-blue-400" />
                          <div>
                            <CardTitle className="text-white">{node.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <StatusIcon className={`h-4 w-4 ${getStatusColor(node.status)}`} />
                              <span className={`text-sm ${getStatusColor(node.status)}`}>
                                {node.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-600/20 text-green-400">ACTIVE</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Replicas:</span>
                          <span className="text-white font-medium">{node.replicas}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Uptime:</span>
                          <span className="text-green-400 font-medium">{node.uptime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-white font-medium">{node.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Security:</span>
                          <span className="text-purple-400 font-medium">{node.security}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Test Recovery */}
          <TabsContent value="recovery" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-3">
                  <RefreshCw className="h-6 w-6 text-blue-400" />
                  <span>Test Your Recovery System</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder="Search for capsule to test recovery..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-slate-700 border-slate-600"
                    />
                    <Button
                      onClick={handleRecoveryTest}
                      disabled={recoveryStatus === 'testing'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {recoveryStatus === 'testing' ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      {recoveryStatus === 'testing' ? 'Testing...' : 'Test Recovery'}
                    </Button>
                  </div>

                  {recoveryStatus === 'success' && (
                    <div className="p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <div>
                          <h4 className="text-green-400 font-bold">Recovery Test Successful!</h4>
                          <p className="text-slate-300 text-sm">
                            All your memory capsules are accessible and verified across all storage nodes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6 bg-slate-700/30 rounded-lg">
                    <h3 className="text-white font-semibold mb-4">Recovery Test Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">47,234</div>
                        <p className="text-slate-400 text-sm">Nodes Responding</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">12ms</div>
                        <p className="text-slate-400 text-sm">Average Response Time</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">100%</div>
                        <p className="text-slate-400 text-sm">Data Integrity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}