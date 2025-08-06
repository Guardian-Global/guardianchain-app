// client/src/pages/mint/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useUserCapsules } from '@/hooks/useUserCapsules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Coins, ExternalLink, Shield, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const MintCapsulePage: React.FC = () => {
  const [match, params] = useRoute('/mint/:id');
  const { isAuthenticated, user } = useAuth();
  const { capsules } = useUserCapsules();
  const { toast } = useToast();

  const [capsule, setCapsule] = useState<any>(null);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [mintResult, setMintResult] = useState<{
    txHash?: string;
    ipfsUrl?: string;
    veritasId?: string;
    contractAddress?: string;
  } | null>(null);

  const capsuleId = params?.id;

  useEffect(() => {
    if (capsuleId && capsules.length > 0) {
      const foundCapsule = capsules.find(c => c.id === capsuleId);
      setCapsule(foundCapsule);
      setMinted(foundCapsule?.minted || false);
    }
  }, [capsuleId, capsules]);

  const handleMint = async () => {
    if (!capsule || !isAuthenticated) {
      toast({
        title: "Cannot mint capsule",
        description: "Please ensure you're logged in and the capsule is loaded",
        variant: "destructive",
      });
      return;
    }

    setMinting(true);

    try {
      // Prepare metadata for IPFS
      const metadata = {
        name: capsule.title,
        description: capsule.description,
        content: capsule.content,
        grief_score: capsule.grief_score,
        visibility: capsule.visibility,
        creator: user?.email,
        media_url: capsule.media_url,
        created_at: capsule.created_at,
        attributes: [
          {
            trait_type: "Grief Score",
            value: capsule.grief_score || 0
          },
          {
            trait_type: "Visibility",
            value: capsule.visibility
          },
          {
            trait_type: "Content Type",
            value: capsule.media_url ? "Mixed Media" : "Text"
          }
        ]
      };

      // Call mint API
      const response = await fetch(`/api/capsules/${capsuleId}/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ metadata }),
      });

      if (!response.ok) {
        throw new Error('Minting failed');
      }

      const result = await response.json();
      setMintResult(result);
      setMinted(true);

      toast({
        title: "Capsule minted successfully!",
        description: "Your memory capsule has been minted as an NFT and stored on IPFS",
      });

    } catch (error) {
      console.error('Minting error:', error);
      toast({
        title: "Minting failed",
        description: "There was an error minting your capsule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };

  if (!match || !capsuleId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-medium">Invalid Capsule ID</h3>
              <p className="text-gray-500">The capsule you're trying to mint could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading capsule metadata...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              Mint Memory Capsule as NFT
            </CardTitle>
            <CardDescription>
              Convert your memory capsule into a permanent, verifiable NFT on the blockchain
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Capsule Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capsule Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{capsule.title}</h3>
                {capsule.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{capsule.description}</p>
                )}
              </div>

              {capsule.media_url && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={capsule.media_url} 
                    alt="Capsule media" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Visibility:</span>
                  <Badge variant="outline">{capsule.visibility}</Badge>
                </div>
                
                {capsule.grief_score !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Emotional Intensity:</span>
                    <Badge variant="secondary">{capsule.grief_score}/100</Badge>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm text-gray-500">
                    {new Date(capsule.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                  {capsule.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mint Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">NFT Minting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!minted ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">IPFS Storage</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Metadata will be stored permanently on IPFS
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Veritas Certificate</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Generates authenticity certificate for verification
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Coins className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Blockchain Storage</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Minted as ERC-721 NFT on Polygon network
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleMint}
                    disabled={minting}
                    className="w-full"
                    size="lg"
                    data-testid="button-mint-capsule"
                  >
                    {minting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Minting...
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 mr-2" />
                        Mint as NFT
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Successfully Minted!</span>
                  </div>

                  {mintResult && (
                    <div className="space-y-3">
                      {mintResult.veritasId && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Veritas ID:</span>
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {mintResult.veritasId}
                          </code>
                        </div>
                      )}

                      {mintResult.txHash && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Transaction:</span>
                          <a
                            href={`https://polygonscan.com/tx/${mintResult.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View on Explorer
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {mintResult.ipfsUrl && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">IPFS Metadata:</span>
                          <a
                            href={mintResult.ipfsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View Metadata
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MintCapsulePage;