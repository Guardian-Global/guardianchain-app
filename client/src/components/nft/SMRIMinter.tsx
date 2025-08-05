import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Award, Zap } from 'lucide-react';
import { mintSMRIBadge, analyzeCapsuleForSMRI, type SMRITraits } from '@/lib/nft/smriMinter';
import { useToast } from '@/hooks/use-toast';

interface SMRIMinterProps {
  capsuleText?: string;
  recipientAddress?: string;
  onMintSuccess?: (result: { tokenId: string; txHash: string; metadataUrl: string }) => void;
}

export function SMRIMinter({ capsuleText, recipientAddress, onMintSuccess }: SMRIMinterProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [traits, setTraits] = useState<SMRITraits | null>(null);
  const [mintResult, setMintResult] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!capsuleText) {
      toast({
        title: "No Content",
        description: "Please provide capsule text to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analyzedTraits = await analyzeCapsuleForSMRI(capsuleText);
      setTraits(analyzedTraits);
      toast({
        title: "Analysis Complete",
        description: "SMRI traits have been generated from your capsule content",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze capsule content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMint = async () => {
    if (!traits || !recipientAddress) {
      toast({
        title: "Missing Requirements",
        description: "Please analyze content and ensure wallet is connected",
        variant: "destructive"
      });
      return;
    }

    setIsMinting(true);
    try {
      const result = await mintSMRIBadge(recipientAddress, traits);
      setMintResult(result);
      onMintSuccess?.(result);
      toast({
        title: "SMRI Badge Minted!",
        description: `Successfully minted SMRI Badge #${result.tokenId}`,
      });
    } catch (error) {
      console.error('Minting failed:', error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Failed to mint SMRI badge",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };

  const getTraitColor = (value: string) => {
    const colorMap: Record<string, string> = {
      // Memory types
      visual: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      auditory: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      kinesthetic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      emotional: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      cognitive: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      
      // Grief scores
      low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      transcendent: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      
      // Affinities
      curious: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      empathetic: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      analytical: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      protective: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      visionary: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    };
    
    return colorMap[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-cyan-400" />
          SMRI Badge Minter
        </CardTitle>
        <CardDescription>
          Subjective Memory Resonance Index - Generate and mint personalized NFT badges based on capsule analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Content Analysis</h3>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !capsuleText}
              variant="outline"
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>

          {traits && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Memory Type:</span>
                  <Badge className={getTraitColor(traits.memoryType)}>{traits.memoryType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Grief Score:</span>
                  <Badge className={getTraitColor(traits.griefScore)}>{traits.griefScore}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trust Index:</span>
                  <Badge variant="secondary">{traits.trustIndex}%</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Affinity:</span>
                  <Badge className={getTraitColor(traits.profileAffinity)}>{traits.profileAffinity}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Frequency:</span>
                  <Badge variant="outline">{traits.resonanceFrequency}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Temporal:</span>
                  <Badge variant="outline">{traits.temporalAnchor}</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minting Section */}
        {traits && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Mint SMRI Badge</h3>
              <Button
                onClick={handleMint}
                disabled={isMinting || !recipientAddress}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    Mint Badge
                  </>
                )}
              </Button>
            </div>

            {recipientAddress && (
              <p className="text-sm text-muted-foreground">
                Badge will be minted to: <code className="bg-muted px-1 rounded">{recipientAddress}</code>
              </p>
            )}
          </div>
        )}

        {/* Success Section */}
        {mintResult && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              🎉 SMRI Badge Minted Successfully!
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Token ID:</strong> #{mintResult.tokenId}</p>
              <p><strong>Transaction:</strong> 
                <a 
                  href={`https://basescan.org/tx/${mintResult.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  {mintResult.txHash.slice(0, 10)}...
                </a>
              </p>
              <p><strong>Metadata:</strong> 
                <a 
                  href={mintResult.metadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  View on IPFS
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• SMRI badges represent subjective memory resonance patterns</p>
          <p>• Each badge is unique based on your content analysis</p>
          <p>• Badges can be displayed on profiles and traded as NFTs</p>
        </div>
      </CardContent>
    </Card>
  );
}