import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Server, 
  Download, 
  Play, 
  Square, 
  Activity, 
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  ExternalLink
} from 'lucide-react';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { EliteHero } from '@/components/ui/elite-hero';
import { EliteCard, EliteCardContent, EliteCardHeader, StatsCard } from '@/components/ui/elite-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface NodeStats {
  status: 'running' | 'stopped' | 'syncing' | 'error';
  uptime: string;
  syncProgress: number;
  peerCount: number;
  blockHeight: number;
  memoryUsage: number;
  diskUsage: number;
  cpuUsage: number;
}

const mockNodeStats: NodeStats = {
  status: 'running',
  uptime: '15d 7h 23m',
  syncProgress: 98.7,
  peerCount: 47,
  blockHeight: 2847392,
  memoryUsage: 68,
  diskUsage: 45,
  cpuUsage: 23
};

const systemRequirements = [
  { component: 'OS', requirement: 'Ubuntu 20.04+ / macOS 12+ / Windows 10+', met: true },
  { component: 'CPU', requirement: '4+ cores, 2.4GHz+', met: true },
  { component: 'RAM', requirement: '8GB minimum, 16GB recommended', met: true },
  { component: 'Storage', requirement: '500GB+ SSD recommended', met: true },
  { component: 'Network', requirement: 'Stable internet, 100Mbps+', met: true },
  { component: 'Ports', requirement: 'TCP 30303, UDP 30301 open', met: false },
];

const installCommands = {
  ubuntu: `# Ubuntu/Debian Installation
wget -O- https://guardian.global/install.sh | bash
sudo systemctl enable guardianchain-node
sudo systemctl start guardianchain-node`,
  
  macos: `# macOS Installation  
brew tap guardianchain/tap
brew install guardianchain-node
guardianchain-node --init`,
  
  windows: `# Windows Installation (PowerShell as Administrator)
Invoke-WebRequest -Uri "https://guardian.global/install.ps1" -OutFile "install.ps1"
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
.\\install.ps1`,
  
  docker: `# Docker Installation
docker pull guardianchain/veritas-node:latest
docker run -d --name veritas-node \\
  -p 30303:30303 -p 8545:8545 \\
  -v veritas-data:/data \\
  guardianchain/veritas-node:latest`
};

export default function EliteVeritasNode() {
  const [nodeRunning, setNodeRunning] = useState(false);
  const [selectedOS, setSelectedOS] = useState<keyof typeof installCommands>('ubuntu');
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Installation commands have been copied.",
    });
  };

  const handleStartNode = () => {
    setNodeRunning(true);
    toast({
      title: "Node Starting",
      description: "Veritas node is initializing and connecting to the network.",
    });
  };

  const handleStopNode = () => {
    setNodeRunning(false);
    toast({
      title: "Node Stopped",
      description: "Veritas node has been safely shutdown.",
    });
  };

  const statsData = [
    { 
      title: 'Node Status', 
      value: mockNodeStats.status.toUpperCase(), 
      icon: mockNodeStats.status === 'running' ? Activity : AlertCircle,
      subtitle: `Uptime: ${mockNodeStats.uptime}`
    },
    { 
      title: 'Sync Progress', 
      value: `${mockNodeStats.syncProgress}%`, 
      icon: Download,
      subtitle: `Block: ${mockNodeStats.blockHeight.toLocaleString()}`
    },
    { 
      title: 'Network Peers', 
      value: mockNodeStats.peerCount.toString(), 
      icon: Wifi,
      subtitle: 'Connected validators'
    },
    { 
      title: 'System Health', 
      value: 'Optimal', 
      icon: Shield,
      subtitle: 'All systems operational'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'syncing': return 'text-yellow-400';
      case 'stopped': return 'text-gray-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <EliteLayout>
      <EliteHero
        title="Veritas Node"
        subtitle="Network Validation Infrastructure"
        description="Run a Veritas validator node to strengthen the GuardianChain network, earn rewards, and participate in truth consensus validation."
        primaryAction={{
          label: 'Download Node',
          href: '#install',
          onClick: () => document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' })
        }}
        secondaryAction={{
          label: 'View Docs',
          href: '/docs/node-setup'
        }}
        badge="Validator Network"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Node Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Node Control Panel */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <EliteCard>
            <EliteCardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Node Control</h3>
                  <p className="text-gray-400">Manage your Veritas validator node</p>
                </div>
                <Badge 
                  variant={mockNodeStats.status === 'running' ? 'default' : 'secondary'}
                  className={`${getStatusColor(mockNodeStats.status)} border-current`}
                >
                  {mockNodeStats.status.toUpperCase()}
                </Badge>
              </div>
            </EliteCardHeader>
            <EliteCardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Metrics */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">System Metrics</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">CPU Usage</span>
                        <span className="text-white">{mockNodeStats.cpuUsage}%</span>
                      </div>
                      <Progress value={mockNodeStats.cpuUsage} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Memory Usage</span>
                        <span className="text-white">{mockNodeStats.memoryUsage}%</span>
                      </div>
                      <Progress value={mockNodeStats.memoryUsage} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Disk Usage</span>
                        <span className="text-white">{mockNodeStats.diskUsage}%</span>
                      </div>
                      <Progress value={mockNodeStats.diskUsage} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Sync Progress</span>
                        <span className="text-white">{mockNodeStats.syncProgress}%</span>
                      </div>
                      <Progress value={mockNodeStats.syncProgress} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Node Controls */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Node Controls</h4>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleStartNode}
                      disabled={nodeRunning}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Node</span>
                    </Button>
                    
                    <Button
                      onClick={handleStopNode}
                      disabled={!nodeRunning}
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <Square className="h-4 w-4" />
                      <span>Stop Node</span>
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Node ID:</span>
                      <span className="text-white font-mono">0x7f8a...9e2d</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Validator Address:</span>
                      <span className="text-white font-mono">0x1a2b...8f3c</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-yellow-400">Guardian Mainnet</span>
                    </div>
                  </div>
                </div>
              </div>
            </EliteCardContent>
          </EliteCard>
        </motion.div>

        {/* Installation Guide */}
        <motion.div
          id="install"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <EliteCard>
            <EliteCardHeader>
              <h3 className="text-xl font-semibold text-white">Installation Guide</h3>
              <p className="text-gray-400">Set up your Veritas validator node</p>
            </EliteCardHeader>
            <EliteCardContent>
              <Tabs defaultValue="requirements" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5">
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="install">Installation</TabsTrigger>
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="requirements" className="mt-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">System Requirements</h4>
                    <div className="space-y-3">
                      {systemRequirements.map((req, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <span className="text-white font-medium">{req.component}</span>
                            <p className="text-gray-400 text-sm">{req.requirement}</p>
                          </div>
                          {req.met ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="install" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white font-medium mb-4">Choose Your Platform</h4>
                      <div className="flex gap-2 mb-4">
                        {Object.keys(installCommands).map((os) => (
                          <Button
                            key={os}
                            variant={selectedOS === os ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedOS(os as keyof typeof installCommands)}
                            className="capitalize"
                          >
                            {os}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <pre className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto">
                        <code className="text-green-400 text-sm font-mono">
                          {installCommands[selectedOS]}
                        </code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(installCommands[selectedOS])}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-blue-400 font-medium">Installation Notes</p>
                          <p className="text-gray-400 text-sm mt-1">
                            The installation script will automatically configure your node, 
                            create necessary directories, and start the sync process. 
                            Initial synchronization may take several hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="config" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white font-medium mb-4">Configuration Steps</h4>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-sm font-semibold flex items-center justify-center mt-1">1</div>
                          <div>
                            <p className="text-white">Generate Validator Keys</p>
                            <p className="text-gray-400 text-sm">Create your validator keypair for signing</p>
                            <code className="bg-black/40 px-2 py-1 rounded text-green-400 text-sm">guardianchain-node keygen</code>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-sm font-semibold flex items-center justify-center mt-1">2</div>
                          <div>
                            <p className="text-white">Stake GTT Tokens</p>
                            <p className="text-gray-400 text-sm">Minimum 1000 GTT required for validation</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-sm font-semibold flex items-center justify-center mt-1">3</div>
                          <div>
                            <p className="text-white">Open Network Ports</p>
                            <p className="text-gray-400 text-sm">Ensure TCP 30303 and UDP 30301 are accessible</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-sm font-semibold flex items-center justify-center mt-1">4</div>
                          <div>
                            <p className="text-white">Start Validation</p>
                            <p className="text-gray-400 text-sm">Begin participating in consensus</p>
                            <code className="bg-black/40 px-2 py-1 rounded text-green-400 text-sm">guardianchain-node start --validator</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </EliteCardContent>
          </EliteCard>
        </motion.div>

        {/* Resources */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <EliteCard>
            <EliteCardContent className="text-center">
              <Terminal className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Documentation</h4>
              <p className="text-gray-400 text-sm mb-4">Comprehensive setup and operation guides</p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Docs
              </Button>
            </EliteCardContent>
          </EliteCard>

          <EliteCard>
            <EliteCardContent className="text-center">
              <Activity className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Node Monitoring</h4>
              <p className="text-gray-400 text-sm mb-4">Real-time network statistics and health</p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Monitor
              </Button>
            </EliteCardContent>
          </EliteCard>

          <EliteCard>
            <EliteCardContent className="text-center">
              <Server className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Support</h4>
              <p className="text-gray-400 text-sm mb-4">Get help from the validator community</p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Discord
              </Button>
            </EliteCardContent>
          </EliteCard>
        </motion.div>
      </div>
    </EliteLayout>
  );
}