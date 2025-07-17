import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ShareButtons from "@/components/social/share-buttons";
import CapsuleAnalytics from "@/components/analytics/capsule-analytics";
import DynamicMeta, { generateCapsuleStructuredData } from "@/components/seo/dynamic-meta";
import { Star, User, Coins, Check, Clock, Eye, MessageCircle, ExternalLink, Shield, Image, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Capsule } from "@shared/schema";

export default function CapsuleDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);
  
  const { data: capsule, isLoading, error } = useQuery({
    queryKey: ['/api/capsules', id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/capsules/${id}`);
      if (!response.ok) throw new Error('Capsule not found');
      return response.json();
    },
    enabled: !!id
  });

  // Track view when capsule loads
  useEffect(() => {
    if (capsule?.id) {
      apiRequest("POST", `/api/analytics/${capsule.id}/view`)
        .catch(error => console.log("View tracking failed:", error));
    }
  }, [capsule?.id]);

  const handleMintNFT = async () => {
    if (!capsule) return;
    
    setIsMinting(true);
    try {
      const response = await apiRequest("POST", "/api/mint", {
        capsuleId: capsule.id,
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678" // Mock wallet for demo
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "NFT Minting Successful!",
          description: `NFT metadata uploaded to IPFS: ${data.ipfsHash}`,
        });
      } else {
        throw new Error(data.error || "Minting failed");
      }
    } catch (error: any) {
      toast({
        title: "Minting Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  // Add structured data to page head
  useEffect(() => {
    if (capsule) {
      const structuredData = generateCapsuleStructuredData(capsule);
      
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
      
      return () => {
        const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [capsule]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Capsule Not Found</h2>
            <p className="text-slate-400 mb-4">The requested truth capsule could not be found.</p>
            <Link href="/explore">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Explore
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSealed = capsule.status === "sealed" && capsule.docusignEnvelopeId;
  const canMint = isSealed && !capsule.nftTokenId;
  const alreadyMinted = !!capsule.nftTokenId;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-emerald-600 text-white";
      case "sealed": return "bg-purple-600 text-white";
      case "pending": return "bg-blue-600 text-white";
      case "rejected": return "bg-red-600 text-white";
      default: return "bg-slate-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <Check className="h-3 w-3" />;
      case "sealed": return <Star className="h-3 w-3" />;
      case "pending": return <Clock className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sealed": return "Sealed with Veritas";
      case "verified": return "Truth Verified";
      case "pending": return "Pending Review";
      case "rejected": return "Disputed";
      default: return status;
    }
  };

  return (
    <>
      {/* Dynamic Meta Tags */}
      <DynamicMeta capsule={capsule} />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link href="/explore">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
          <div className="text-sm text-slate-400">
            Truth Capsule #{capsule.id}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(capsule.status)}>
                        {getStatusIcon(capsule.status)}
                        <span className="ml-1">{getStatusText(capsule.status)}</span>
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {capsule.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-white">
                      {capsule.title}
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">GTT Reward</div>
                    <div className="text-lg font-bold text-green-400">
                      {capsule.gttReward} GTT
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {capsule.description}
                </p>
                
                {capsule.content && (
                  <div className="bg-slate-900 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-white mb-2">Capsule Content</h4>
                    <div className="text-slate-300 whitespace-pre-wrap">
                      {capsule.content}
                    </div>
                  </div>
                )}

                {/* Creator Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-slate-700 text-slate-300">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-white">Creator #{capsule.creatorId}</div>
                    <div className="text-xs text-slate-400">
                      Created {new Date(capsule.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evidence & Verification Details */}
            {capsule.evidence && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    Supporting Evidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <pre className="text-slate-300 text-sm whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(capsule.evidence, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Verification Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Grief Score</span>
                  <span className="font-bold text-white">{capsule.griefScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verifications</span>
                  <span className="font-bold text-white">{capsule.verificationCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Replays</span>
                  <span className="font-bold text-white">{capsule.replayCount}</span>
                </div>
                {capsule.ipfsHash && (
                  <div className="pt-2 border-t border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">IPFS Hash</div>
                    <code className="text-xs text-green-400 break-all">
                      {capsule.ipfsHash}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Veritas Seal */}
                {isSealed && capsule.veritasSealUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
                    onClick={() => window.open(capsule.veritasSealUrl!, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View Veritas Certificate
                  </Button>
                )}
                
                {/* NFT Minting */}
                {canMint && (
                  <Button 
                    onClick={handleMintNFT}
                    disabled={isMinting}
                    size="sm" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Image className="h-3 w-3 mr-2" />
                    {isMinting ? "Minting..." : "Mint as NFT"}
                  </Button>
                )}
                
                {alreadyMinted && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                    onClick={() => window.open(`https://opensea.io/assets/matic/0x1234567890abcdef1234567890abcdef12345678/${capsule.nftTokenId}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View NFT on OpenSea
                  </Button>
                )}
                
                {!isSealed && (
                  <div className="text-xs text-red-400 text-center">
                    ❌ Must seal with Veritas before minting NFT
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics */}
            <CapsuleAnalytics 
              capsule={capsule}
              walletAddress="0x1234567890abcdef1234567890abcdef12345678"
              showClaimButton={true}
            />

            {/* Share */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Share Truth Capsule</CardTitle>
              </CardHeader>
              <CardContent>
                <ShareButtons
                  title={`Immutable Truth Capsule: ${capsule.title}`}
                  url={`https://guardianchain.app/capsule/${capsule.id}`}
                  image={capsule.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${capsule.id}`}
                  description={`${capsule.description} • Verified truth on GuardianChain with grief score ${capsule.griefScore}`}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}