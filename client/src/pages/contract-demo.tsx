import { useState } from 'react';
import { Shield, Zap, Factory, Wallet, ChevronRight, Code2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MintGTTButton from '@/components/web3/MintGTTButton';
import SealTrackerUI from '@/components/web3/SealTrackerUI';
import { CONTRACTS, NETWORK_CONFIGS, areContractsDeployed } from '@/lib/contracts';
import { useAccount, useBalance } from 'wagmi';

export default function ContractDemo() {
  const { address, chainId } = useAccount();
  const { data: balance } = useBalance({ address });

  const currentNetwork = chainId ? NETWORK_CONFIGS[chainId as keyof typeof NETWORK_CONFIGS] : null;
  const contractsDeployed = chainId ? areContractsDeployed(chainId) : false;
  const contracts = chainId ? CONTRACTS[Object.keys(CONTRACTS).find(key => CONTRACTS[key].chainId === chainId) || ''] : null;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Smart Contract Demo
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Interactive testing environment for GuardianChain smart contracts
            </p>
          </div>
        </div>
      </section>

      {/* Network Status */}
      <section className="py-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Network Status</h3>
                  {currentNetwork ? (
                    <div className="space-y-1">
                      <Badge variant="default" className="bg-green-600">
                        {currentNetwork.name}
                      </Badge>
                      <p className="text-xs text-slate-400">Chain ID: {chainId}</p>
                    </div>
                  ) : (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                      Not Connected
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Wallet</h3>
                  {address ? (
                    <div className="space-y-1">
                      <p className="text-xs font-mono">{address.slice(0, 6)}...{address.slice(-4)}</p>
                      <p className="text-xs text-slate-400">
                        {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0 ETH'}
                      </p>
                    </div>
                  ) : (
                    <Badge variant="outline" className="border-red-500 text-red-400">
                      No Wallet
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Contracts</h3>
                  {contractsDeployed ? (
                    <Badge variant="default" className="bg-purple-600">
                      Deployed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                      Not Deployed
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Block Explorer</h3>
                  {currentNetwork?.blockExplorer ? (
                    <a
                      href={currentNetwork.blockExplorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">N/A</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contract Interactions */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="mint" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="mint" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                GTT Token
              </TabsTrigger>
              <TabsTrigger value="seal" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Truth Vault
              </TabsTrigger>
              <TabsTrigger value="factory" className="flex items-center gap-2">
                <Factory className="h-4 w-4" />
                Capsule Factory
              </TabsTrigger>
            </TabsList>

            {/* GTT Token Tab */}
            <TabsContent value="mint" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <MintGTTButton variant="card" />
                </div>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      GTT Token Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Token Name:</span>
                        <span className="text-white">Guardian Truth Token</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Symbol:</span>
                        <span className="text-white">GTT</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Decimals:</span>
                        <span className="text-white">18</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Contract:</span>
                        <span className="font-mono text-xs text-white">
                          {contracts?.gtt || "Not deployed"}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• ERC-20 compliant token</li>
                        <li>• Owner-controlled minting</li>
                        <li>• Used for governance voting</li>
                        <li>• Reward distribution system</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Truth Vault Tab */}
            <TabsContent value="seal" className="space-y-6">
              <SealTrackerUI />
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    Truth Vault Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Contract:</span>
                        <span className="font-mono text-xs text-white">
                          {contracts?.vault || "Not deployed"}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Permanent capsule sealing</li>
                        <li>• IPFS metadata storage</li>
                        <li>• Tamper-proof timestamps</li>
                        <li>• Public verification</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Capsule Factory Tab */}
            <TabsContent value="factory" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="h-5 w-5 text-green-400" />
                    Capsule Factory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Factory className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                      <p className="text-slate-400 mb-4">
                        Direct capsule creation and management through smart contracts
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Contract:</span>
                        <span className="font-mono text-xs text-white">
                          {contracts?.factory || "Not deployed"}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="font-semibold mb-2">Planned Features</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• On-chain capsule creation</li>
                        <li>• Content hash storage</li>
                        <li>• Creator verification</li>
                        <li>• Automated sealing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Deployment Status */}
          {!contractsDeployed && (
            <Card className="bg-yellow-900/20 border-yellow-700 mt-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Wallet className="h-5 w-5" />
                  Deploy Contracts First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-yellow-200">
                    Smart contracts are not yet deployed to this network. 
                    To test contract interactions, deploy them first:
                  </p>
                  
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <code className="text-sm text-slate-300">
                      npx hardhat compile<br/>
                      npx hardhat run scripts/deploy.cjs --network {currentNetwork?.name.toLowerCase() || 'hardhat'}
                    </code>
                  </div>

                  <div className="text-sm text-yellow-200">
                    <p className="mb-2">Available networks:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Local: hardhat (chainId: 31337)</li>
                      <li>Testnet: sepolia (chainId: 11155111)</li>
                      <li>Testnet: polygonAmoy (chainId: 80002)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}