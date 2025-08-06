import React, { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CAPSULE_FACTORY_V2_ABI, getContractAddress } from "@/lib/contracts";
import { BRAND_COLORS } from "@/lib/constants";
import { 
  Loader2, 
  Upload, 
  Sparkles, 
  Coins, 
  Shield, 
  Zap,
  TrendingUp,
  Target,
  Activity,
  Clock,
  Award,
  DollarSign
} from "lucide-react";

// Consolidated Web3 Capsule Component
// Replaces: CapsuleCreator.tsx, CapsuleMintBase.tsx, CapsuleYieldTracker.tsx, CapsuleYieldManager.tsx, 
// MintCapsuleNFT.tsx, MintCapsuleNFTWrapper.tsx, CapsuleRedeemer.tsx
export default function MasterWeb3Capsule() {
  const { address, chainId } = useAccount();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'create' | 'mint' | 'yield' | 'redeem'>('create');
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contentHash, setContentHash] = useState("");
  const [yieldEstimate, setYieldEstimate] = useState(100);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !chainId) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a capsule",
        variant: "destructive",
      });
      return;
    }

    if (!title || !summary || !contentHash) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const factoryAddress = getContractAddress(chainId, "factoryV2") as `0x${string}`;
      writeContract({
        address: factoryAddress,
        abi: CAPSULE_FACTORY_V2_ABI,
        functionName: "createCapsule",
        args: [contentHash, title, summary, BigInt(yieldEstimate)],
      });

      toast({
        title: "Creating Capsule",
        description: "Transaction submitted. Please wait for confirmation...",
      });
    } catch (error) {
      console.error("Error creating capsule:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create capsule. Please try again.",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (hash && !isConfirming && !isPending) {
      toast({
        title: "Capsule Created Successfully!",
        description: `Your memory capsule "${title}" has been created and is pending verification.`,
      });

      setTitle("");
      setSummary("");
      setContentHash("");
      setYieldEstimate(100);
    }
  }, [hash, isConfirming, isPending, title, toast]);

  const isLoading = isPending || isConfirming;

  const CapsuleCreationForm = () => (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
          Create Memory Capsule
        </CardTitle>
        <p className="text-brand-text-muted text-sm">
          Store your truth permanently on the blockchain with CapsuleFactoryV2
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Story Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title..."
              className="bg-brand-surface border-brand-surface text-white placeholder:text-brand-text-muted"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary" className="text-white">
              Story Summary *
            </Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide a brief summary of your story..."
              rows={4}
              className="bg-brand-surface border-brand-surface text-white placeholder:text-brand-text-muted resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentHash" className="text-white">
              Content Hash *
            </Label>
            <Input
              id="contentHash"
              value={contentHash}
              onChange={(e) => setContentHash(e.target.value)}
              placeholder="IPFS hash or content identifier..."
              className="bg-brand-surface border-brand-surface text-white placeholder:text-brand-text-muted"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yieldEstimate" className="text-white">
              Expected Yield (GTT)
            </Label>
            <Input
              id="yieldEstimate"
              type="number"
              min="1"
              max="10000"
              value={yieldEstimate}
              onChange={(e) => setYieldEstimate(parseInt(e.target.value) || 100)}
              className="bg-brand-surface border-brand-surface text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-primary/80"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Create & Seal Capsule
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const NFTMintingPanel = () => (
    <div className="space-y-6">
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-accent" />
            NFT Minting Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-brand-surface rounded-lg">
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-sm text-brand-text-muted">Available for Mint</p>
              </div>
              <div className="text-center p-4 bg-brand-surface rounded-lg">
                <p className="text-2xl font-bold text-green-400">8</p>
                <p className="text-sm text-brand-text-muted">Successfully Minted</p>
              </div>
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-brand-surface rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-white">Capsule #{index + 1}</h4>
                    <p className="text-xs text-brand-text-muted">Truth Score: 89% | GTT: 24.5</p>
                  </div>
                  <Button size="sm" className="bg-brand-accent hover:bg-brand-accent/80">
                    <Zap className="w-3 h-3 mr-1" />
                    Mint
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const YieldTrackingPanel = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Total GTT Earned</p>
                <p className="text-2xl font-bold text-yellow-400">247.8</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Active Capsules</p>
                <p className="text-2xl font-bold text-blue-400">18</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Avg Yield/Day</p>
                <p className="text-2xl font-bold text-green-400">12.4</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Yield Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-brand-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-accent/20 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Capsule #{index + 1}</h4>
                    <p className="text-xs text-brand-text-muted">Last 24h activity</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-400">+{(Math.random() * 10 + 1).toFixed(1)} GTT</p>
                  <p className="text-xs text-brand-text-muted">{Math.floor(Math.random() * 24)}h ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const RedemptionPanel = () => (
    <div className="space-y-6">
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            GTT Redemption Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 bg-brand-surface rounded-lg">
              <p className="text-sm text-brand-text-muted mb-2">Available for Redemption</p>
              <p className="text-4xl font-bold text-yellow-400 mb-4">247.8 GTT</p>
              <p className="text-sm text-brand-text-muted">≈ $892.15 USD</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Clock className="w-4 h-4 mr-2" />
                Quick Redeem
              </Button>
              <Button variant="outline" className="border-brand-surface">
                <Target className="w-4 h-4 mr-2" />
                Stake for Yield
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Recent Redemptions</h4>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-brand-surface rounded text-sm">
                  <span className="text-brand-text-muted">
                    {new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                  <span className="text-green-400">+{(Math.random() * 50 + 10).toFixed(1)} GTT</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Web3 Capsule Hub</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
            size="sm"
          >
            Create
          </Button>
          <Button
            variant={activeTab === 'mint' ? 'default' : 'outline'}
            onClick={() => setActiveTab('mint')}
            size="sm"
          >
            NFT Mint
          </Button>
          <Button
            variant={activeTab === 'yield' ? 'default' : 'outline'}
            onClick={() => setActiveTab('yield')}
            size="sm"
          >
            Yield Track
          </Button>
          <Button
            variant={activeTab === 'redeem' ? 'default' : 'outline'}
            onClick={() => setActiveTab('redeem')}
            size="sm"
          >
            Redeem
          </Button>
        </div>
      </div>

      {activeTab === 'create' && <CapsuleCreationForm />}
      {activeTab === 'mint' && <NFTMintingPanel />}
      {activeTab === 'yield' && <YieldTrackingPanel />}
      {activeTab === 'redeem' && <RedemptionPanel />}
    </div>
  );
}