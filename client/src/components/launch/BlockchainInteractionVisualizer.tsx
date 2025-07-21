import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Shield, Layers, ChevronRight } from 'lucide-react';

interface FlowStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress: number;
  details: string;
}

export default function BlockchainInteractionVisualizer() {
  const [activeFlow, setActiveFlow] = useState<'deployment' | 'bridge' | 'staking' | null>(null);
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const deploymentSteps: FlowStep[] = [
    { id: 'compile', name: 'Smart Contract Compilation', status: 'pending', progress: 0, details: 'Compiling GTT token contract with Solidity 0.8.17' },
    { id: 'deploy', name: 'Multi-Network Deployment', status: 'pending', progress: 0, details: 'Deploying to Ethereum, Polygon, BSC simultaneously' },
    { id: 'verify', name: 'Contract Verification', status: 'pending', progress: 0, details: 'Verifying contracts on Etherscan, Polygonscan, BSCScan' },
    { id: 'configure', name: 'Initial Configuration', status: 'pending', progress: 0, details: 'Setting up minting permissions and treasury controls' }
  ];

  const bridgeSteps: FlowStep[] = [
    { id: 'map', name: 'Token Mapping', status: 'pending', progress: 0, details: 'Mapping GTT across Polygon Bridge, Celer, Hop Protocol' },
    { id: 'liquidity', name: 'Bridge Liquidity', status: 'pending', progress: 0, details: 'Adding initial liquidity to cross-chain pools' },
    { id: 'test', name: 'Bridge Testing', status: 'pending', progress: 0, details: 'Testing cross-chain transfers with small amounts' },
    { id: 'activate', name: 'Bridge Activation', status: 'pending', progress: 0, details: 'Activating production bridge infrastructure' }
  ];

  const stakingSteps: FlowStep[] = [
    { id: 'pools', name: 'Staking Pool Creation', status: 'pending', progress: 0, details: 'Creating GTT staking pools with tiered rewards' },
    { id: 'rewards', name: 'Reward Configuration', status: 'pending', progress: 0, details: 'Configuring APY rates and bonus multipliers' },
    { id: 'launch', name: 'Pool Launch', status: 'pending', progress: 0, details: 'Launching staking pools with initial rewards' },
    { id: 'monitor', name: 'Performance Monitoring', status: 'pending', progress: 0, details: 'Setting up automated monitoring and alerts' }
  ];

  const startFlow = (flowType: 'deployment' | 'bridge' | 'staking') => {
    setActiveFlow(flowType);
    setIsRunning(true);
    
    let steps: FlowStep[];
    switch (flowType) {
      case 'deployment': steps = [...deploymentSteps]; break;
      case 'bridge': steps = [...bridgeSteps]; break;
      case 'staking': steps = [...stakingSteps]; break;
    }
    
    setFlowSteps(steps);
    simulateFlow(steps);
  };

  const simulateFlow = async (steps: FlowStep[]) => {
    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i];
      
      // Set current step as active
      setFlowSteps(prev => prev.map(step => ({
        ...step,
        status: step.id === currentStep.id ? 'active' : step.status
      })));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFlowSteps(prev => prev.map(step => 
          step.id === currentStep.id ? { ...step, progress } : step
        ));
      }

      // Mark as completed
      setFlowSteps(prev => prev.map(step => ({
        ...step,
        status: step.id === currentStep.id ? 'completed' : step.status
      })));
    }
    
    setIsRunning(false);
  };

  const getStepIcon = (status: FlowStep['status']) => {
    switch (status) {
      case 'completed': return <Shield className="w-4 h-4 text-green-500" />;
      case 'active': return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'error': return <Activity className="w-4 h-4 text-red-500" />;
      default: return <Layers className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: FlowStep['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Blockchain Interaction Visualizer with Animated Flow Diagrams
        </CardTitle>
        <CardDescription>
          Real-time visualization of blockchain deployment, bridging, and staking operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Flow Type Selector */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={activeFlow === 'deployment' ? 'default' : 'outline'}
            onClick={() => startFlow('deployment')}
            disabled={isRunning}
            className="h-20 flex flex-col gap-2"
          >
            <Shield className="w-6 h-6" />
            <span>Token Deployment</span>
          </Button>
          <Button
            variant={activeFlow === 'bridge' ? 'default' : 'outline'}
            onClick={() => startFlow('bridge')}
            disabled={isRunning}
            className="h-20 flex flex-col gap-2"
          >
            <Layers className="w-6 h-6" />
            <span>Cross-Chain Bridges</span>
          </Button>
          <Button
            variant={activeFlow === 'staking' ? 'default' : 'outline'}
            onClick={() => startFlow('staking')}
            disabled={isRunning}
            className="h-20 flex flex-col gap-2"
          >
            <Zap className="w-6 h-6" />
            <span>Staking Pools</span>
          </Button>
        </div>

        {/* Flow Visualization */}
        {activeFlow && flowSteps.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-sm">
                {activeFlow.charAt(0).toUpperCase() + activeFlow.slice(1)} Flow
              </Badge>
              {isRunning && (
                <Badge variant="secondary" className="text-sm animate-pulse">
                  Running...
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {flowSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex-shrink-0 mt-1">
                      {getStepIcon(step.status)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{step.name}</h4>
                        <Badge 
                          variant={step.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {step.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{step.details}</p>
                      
                      {step.status === 'active' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{step.progress}%</span>
                          </div>
                          <Progress value={step.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flow arrow */}
                  {index < flowSteps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">6</div>
            <div className="text-sm text-muted-foreground">Networks Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">12</div>
            <div className="text-sm text-muted-foreground">DEX Integrations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">4</div>
            <div className="text-sm text-muted-foreground">Bridge Protocols</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">5</div>
            <div className="text-sm text-muted-foreground">Staking Tiers</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}