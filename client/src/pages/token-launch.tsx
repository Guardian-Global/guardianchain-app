import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import BlockchainInteractionVisualizer from '@/components/launch/BlockchainInteractionVisualizer';
import IntuitiveTokenPerformanceHeatmap from '@/components/launch/IntuitiveTokenPerformanceHeatmap';
import OneClickSocialMediaShare from '@/components/launch/OneClickSocialMediaShare';
import PersonalizedBlockchainLearningCompanion from '@/components/launch/PersonalizedBlockchainLearningCompanion';
import GamifiedBlockchainRewardsSystem from '@/components/launch/GamifiedBlockchainRewardsSystem';
import MobileOptimizations from '@/components/launch/mobile-optimizations';
import VideoExplainer from '@/components/launch/video-explainer';
import CommandDashboard from '@/components/admin/command-dashboard';

interface LaunchStatus {
  phase: string;
  progress: number;
  networks: NetworkStatus[];
  exchanges: ExchangeStatus[];
  bridges: BridgeStatus[];
  overall: OverallStatus;
}

interface NetworkStatus {
  name: string;
  chainId: number;
  status: 'pending' | 'deployed' | 'verified' | 'error';
  contractAddress?: string;
  explorerUrl?: string;
  liquidityPools: LiquidityPool[];
}

interface ExchangeStatus {
  name: string;
  type: 'CEX' | 'DEX';
  status: 'not_applied' | 'submitted' | 'under_review' | 'approved' | 'listed' | 'rejected';
  applicationId?: string;
  listingDate?: string;
  tradingPairs: string[];
}

interface BridgeStatus {
  name: string;
  networks: string[];
  status: 'not_configured' | 'configured' | 'tested' | 'live';
  testResults?: any;
}

interface LiquidityPool {
  dex: string;
  pair: string;
  tvl: string;
  apy: string;
  status: 'pending' | 'active' | 'error';
}

interface OverallStatus {
  phase: 'preparation' | 'testnet_deployment' | 'mainnet_deployment' | 'exchange_listings' | 'bridge_setup' | 'complete';
  completionPercentage: number;
  nextActions: string[];
  estimatedCompletion: string;
}

export default function TokenLaunchPage() {
  const { toast } = useToast();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum');

  // Fetch current launch status (no auth required)
  const { data: launchStatus, isLoading, error } = useQuery<LaunchStatus>({
    queryKey: ['/api/admin/launch-status'],
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3,
    retryDelay: 1000,
  });

  // Deploy to network mutation
  const deployToNetworkMutation = useMutation({
    mutationFn: async (network: string) => {
      return apiRequest('POST', '/api/admin/deploy-network', { network });
    },
    onSuccess: (data, network) => {
      toast({
        title: "Deployment Started",
        description: `GTT deployment initiated on ${network}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/launch-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add liquidity mutation
  const addLiquidityMutation = useMutation({
    mutationFn: async ({ network, dex, amounts }: { network: string; dex: string; amounts: string[] }) => {
      return apiRequest('POST', '/api/admin/add-liquidity', { network, dex, amounts });
    },
    onSuccess: () => {
      toast({
        title: "Liquidity Added",
        description: "Initial liquidity provision completed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/launch-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Liquidity Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit exchange application mutation
  const submitExchangeApplicationMutation = useMutation({
    mutationFn: async (exchange: string) => {
      return apiRequest('POST', '/api/admin/submit-exchange-application', { exchange });
    },
    onSuccess: (data, exchange) => {
      toast({
        title: "Application Submitted",
        description: `${exchange} listing application submitted successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/launch-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Configure bridge mutation
  const configureBridgeMutation = useMutation({
    mutationFn: async ({ bridge, sourceNetwork, targetNetwork }: { 
      bridge: string; 
      sourceNetwork: string; 
      targetNetwork: string; 
    }) => {
      return apiRequest('POST', '/api/admin/configure-bridge', { bridge, sourceNetwork, targetNetwork });
    },
    onSuccess: () => {
      toast({
        title: "Bridge Configured",
        description: "Cross-chain bridge setup completed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/launch-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Bridge Configuration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
      case 'verified':
      case 'active':
      case 'live':
      case 'approved':
      case 'listed':
        return 'bg-green-500';
      case 'pending':
      case 'submitted':
      case 'under_review':
      case 'configured':
        return 'bg-yellow-500';
      case 'error':
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Token launch page error:', error);
    // Show page with default data instead of blocking
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            GUARDIANCHAIN Token Global Launch Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Monitor and control the comprehensive DeFi deployment across all major networks
          </p>
        </div>

      {/* Overall Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Launch Progress</h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Phase: {launchStatus?.overall?.phase || 'Preparation'}
            </Badge>
          </div>
          
          <Progress 
            value={launchStatus?.overall?.completionPercentage || 0} 
            className="h-4"
          />
          
          <div className="text-center text-sm text-muted-foreground">
            {launchStatus?.overall?.completionPercentage || 0}% Complete
          </div>

          {launchStatus?.overall?.nextActions && (
            <div className="space-y-2">
              <h3 className="font-medium">Next Actions:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {launchStatus.overall.nextActions.map((action: string, index: number) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Enhanced Adder Components */}
      <div className="grid gap-6">
        <BlockchainInteractionVisualizer />
        <IntuitiveTokenPerformanceHeatmap />
        <OneClickSocialMediaShare />
        <PersonalizedBlockchainLearningCompanion />
        <GamifiedBlockchainRewardsSystem />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="networks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          <TabsTrigger value="bridges">Bridges</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        {/* Network Deployment Tab */}
        <TabsContent value="networks" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {launchStatus?.networks?.map((network: NetworkStatus) => (
              <Card key={network.name} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{network.name}</h3>
                    <Badge className={getStatusColor(network.status)}>
                      {getStatusText(network.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>Chain ID: {network.chainId}</div>
                    {network.contractAddress && (
                      <div className="break-all">
                        Contract: {network.contractAddress}
                      </div>
                    )}
                  </div>

                  {network.liquidityPools && network.liquidityPools.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Liquidity Pools:</h4>
                      {network.liquidityPools.map((pool: LiquidityPool, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{pool.dex} {pool.pair}</span>
                          <Badge variant={pool.status === 'active' ? 'default' : 'secondary'}>
                            {pool.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    {network.status === 'pending' && (
                      <Button 
                        onClick={() => deployToNetworkMutation.mutate(network.name)}
                        disabled={deployToNetworkMutation.isPending}
                        className="w-full"
                      >
                        {deployToNetworkMutation.isPending ? 'Deploying...' : 'Deploy GTT'}
                      </Button>
                    )}
                    
                    {network.status === 'deployed' && (
                      <Button 
                        onClick={() => addLiquidityMutation.mutate({ 
                          network: network.name, 
                          dex: 'uniswap', 
                          amounts: ['50000', '25'] 
                        })}
                        disabled={addLiquidityMutation.isPending}
                        variant="outline"
                        className="w-full"
                      >
                        {addLiquidityMutation.isPending ? 'Adding Liquidity...' : 'Add Liquidity'}
                      </Button>
                    )}

                    {network.explorerUrl && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(network.explorerUrl, '_blank')}
                      >
                        View on Explorer
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exchange Listings Tab */}
        <TabsContent value="exchanges" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {launchStatus?.exchanges?.map((exchange: ExchangeStatus) => (
              <Card key={exchange.name} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{exchange.name}</h3>
                    <div className="space-x-2">
                      <Badge variant="outline">{exchange.type}</Badge>
                      <Badge className={getStatusColor(exchange.status)}>
                        {getStatusText(exchange.status)}
                      </Badge>
                    </div>
                  </div>

                  {exchange.applicationId && (
                    <div className="text-sm">
                      Application ID: {exchange.applicationId}
                    </div>
                  )}

                  {exchange.tradingPairs && exchange.tradingPairs.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Trading Pairs:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exchange.tradingPairs.map((pair: string, index: number) => (
                          <Badge key={index} variant="secondary">{pair}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {exchange.listingDate && (
                    <div className="text-sm">
                      Listing Date: {new Date(exchange.listingDate).toLocaleDateString()}
                    </div>
                  )}

                  <div className="space-y-2">
                    {exchange.status === 'not_applied' && (
                      <Button 
                        onClick={() => submitExchangeApplicationMutation.mutate(exchange.name)}
                        disabled={submitExchangeApplicationMutation.isPending}
                        className="w-full"
                      >
                        {submitExchangeApplicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    )}
                    
                    {(exchange.status === 'submitted' || exchange.status === 'under_review') && (
                      <Button variant="outline" className="w-full" disabled>
                        Application Under Review
                      </Button>
                    )}

                    {exchange.status === 'approved' && (
                      <Button variant="outline" className="w-full" disabled>
                        Approved - Awaiting Listing
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cross-Chain Bridges Tab */}
        <TabsContent value="bridges" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {launchStatus?.bridges?.map((bridge: BridgeStatus) => (
              <Card key={bridge.name} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{bridge.name}</h3>
                    <Badge className={getStatusColor(bridge.status)}>
                      {getStatusText(bridge.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Supported Networks:</h4>
                    <div className="flex flex-wrap gap-1">
                      {bridge.networks.map((network: string, index: number) => (
                        <Badge key={index} variant="outline">{network}</Badge>
                      ))}
                    </div>
                  </div>

                  {bridge.testResults && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Test Results:</h4>
                      <div className="text-sm text-muted-foreground">
                        Last tested: {new Date(bridge.testResults.timestamp).toLocaleString()}
                      </div>
                      <Badge variant={bridge.testResults.success ? 'default' : 'destructive'}>
                        {bridge.testResults.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    {bridge.status === 'not_configured' && (
                      <Button 
                        onClick={() => configureBridgeMutation.mutate({ 
                          bridge: bridge.name, 
                          sourceNetwork: 'ethereum', 
                          targetNetwork: 'polygon' 
                        })}
                        disabled={configureBridgeMutation.isPending}
                        className="w-full"
                      >
                        {configureBridgeMutation.isPending ? 'Configuring...' : 'Configure Bridge'}
                      </Button>
                    )}
                    
                    {bridge.status === 'configured' && (
                      <Button variant="outline" className="w-full">
                        Test Bridge
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Deployment Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Networks Deployed:</span>
                  <span className="font-medium">
                    {launchStatus?.networks?.filter((n: NetworkStatus) => n.status === 'deployed').length || 0} / 
                    {launchStatus?.networks?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Exchange Applications:</span>
                  <span className="font-medium">
                    {launchStatus?.exchanges?.filter((e: ExchangeStatus) => e.status !== 'not_applied').length || 0} / 
                    {launchStatus?.exchanges?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bridges Configured:</span>
                  <span className="font-medium">
                    {launchStatus?.bridges?.filter((b: BridgeStatus) => b.status !== 'not_configured').length || 0} / 
                    {launchStatus?.bridges?.length || 0}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              <div className="space-y-2 text-sm">
                <div>Estimated Completion: {launchStatus?.overall?.estimatedCompletion || 'TBD'}</div>
                <div>Current Phase: {launchStatus?.overall?.phase || 'Preparation'}</div>
                <div>Progress: {launchStatus?.overall?.completionPercentage || 0}%</div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  View Deployment Logs
                </Button>
                <Button className="w-full" variant="outline">
                  Download Reports
                </Button>
                <Button className="w-full" variant="outline">
                  Emergency Pause
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Mobile Optimizations Tab */}
        <TabsContent value="mobile" className="space-y-6">
          <MobileOptimizations />
        </TabsContent>

        {/* Video Explainer Tab */}
        <TabsContent value="video" className="space-y-6">
          <VideoExplainer />
        </TabsContent>

        {/* Command Dashboard Tab */}
        <TabsContent value="admin" className="space-y-6">
          <CommandDashboard />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}