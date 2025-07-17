import { Zap, Shield, Coins, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mintCapsuleNFT } from '@/lib/web3/mint';
import { useAccount } from 'wagmi';

interface CapsuleData {
  title: string;
  blocks: Array<{ id: number; type: string; content: string }>;
  metadata: {
    category: string;
    tags: string[];
    griefScore: number;
    credibilityScore: number;
  };
}

interface ForgeControlsProps {
  capsuleData: CapsuleData;
}

export default function ForgeControls({ capsuleData }: ForgeControlsProps) {
  const { toast } = useToast();
  const { address } = useAccount();
  const [isMinting, setIsMinting] = useState(false);

  const fees = {
    mint: 50,
    seal: 100,
    premium: 25
  };

  const getTotalFee = () => {
    let total = fees.mint;
    const hasSeal = capsuleData.blocks.some(block => block.type === 'seal');
    if (hasSeal) total += fees.seal;
    
    // Premium features
    const hasMultimedia = capsuleData.blocks.some(block => 
      block.type === 'image' || block.type === 'video'
    );
    if (hasMultimedia) total += fees.premium;
    
    return total;
  };

  const getValidationIssues = () => {
    const issues = [];
    
    if (!capsuleData.title.trim()) {
      issues.push('Title is required');
    }
    
    const hasContent = capsuleData.blocks.some(block => block.content.trim());
    if (!hasContent) {
      issues.push('At least one block must have content');
    }
    
    if (capsuleData.title.length > 100) {
      issues.push('Title should be under 100 characters');
    }
    
    return issues;
  };

  const isValid = () => {
    return getValidationIssues().length === 0;
  };

  const handleSealAndMint = async () => {
    if (!isValid()) {
      toast({
        title: "Validation Error",
        description: "Please fix validation issues before minting",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint a capsule",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    toast({
      title: "Minting Started",
      description: "Your capsule is being sealed and minted...",
    });

    try {
      const { hash, tokenId } = await mintCapsuleNFT(capsuleData, address);
      
      toast({
        title: "Capsule Minted Successfully!",
        description: `NFT #${tokenId} minted for ${getTotalFee()} GTT. Transaction: ${hash.slice(0, 10)}...`,
      });
    } catch (error) {
      console.error("Minting failed:", error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your capsule has been saved as a draft",
    });
  };

  const validationIssues = getValidationIssues();

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Zap className="h-5 w-5 text-green-400" />
          </div>
          <span className="text-white">Publishing Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Status */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold">Validation Status</h4>
          
          {validationIssues.length === 0 ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Ready to mint</span>
            </div>
          ) : (
            <div className="space-y-2">
              {validationIssues.map((issue, index) => (
                <div key={index} className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{issue}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fee Breakdown */}
        <div className="bg-slate-700/20 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            Fee Breakdown
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Base Minting Fee</span>
              <span className="text-white">{fees.mint} GTT</span>
            </div>
            
            {capsuleData.blocks.some(block => block.type === 'seal') && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Veritas Seal</span>
                <span className="text-white">{fees.seal} GTT</span>
              </div>
            )}
            
            {capsuleData.blocks.some(block => block.type === 'image' || block.type === 'video') && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Multimedia Content</span>
                <span className="text-white">{fees.premium} GTT</span>
              </div>
            )}
            
            <div className="border-t border-slate-600 pt-2">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-white">Total Cost</span>
                <span className="text-yellow-400 text-lg">{getTotalFee()} GTT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing Options */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold">Publishing Options</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Save Draft
            </Button>
            
            <Button
              onClick={handleSealAndMint}
              disabled={!isValid() || isMinting}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isMinting ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {isMinting ? 'Minting...' : 'Seal & Mint'}
            </Button>
          </div>
        </div>

        {/* Feature Status */}
        <div className="bg-slate-700/20 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-semibold">Features Included</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white text-xs">✓</Badge>
              <span className="text-xs text-slate-300">Blockchain Storage</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white text-xs">✓</Badge>
              <span className="text-xs text-slate-300">NFT Certificate</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`${capsuleData.blocks.some(b => b.type === 'seal') ? 'bg-green-600' : 'bg-slate-600'} text-white text-xs`}>
                {capsuleData.blocks.some(b => b.type === 'seal') ? '✓' : '○'}
              </Badge>
              <span className="text-xs text-slate-300">Veritas Seal</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white text-xs">✓</Badge>
              <span className="text-xs text-slate-300">DAO Governance</span>
            </div>
          </div>
        </div>

        {/* Current Balance Display */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-yellow-400 font-semibold">GTT Balance</span>
              <p className="text-xs text-slate-400">Available for transactions</p>
            </div>
            <span className="text-yellow-400 font-bold text-lg">850 GTT</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}