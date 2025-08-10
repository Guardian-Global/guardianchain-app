import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Capsule, NotarizationStatus, EvidenceLevel } from "@/hooks/useCapsules";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Shield, 
  Clock, 
  Eye,
  Share2,
  ExternalLink,
  Download,
  Lock,
  Globe,
  Play,
  Image,
  FileText,
  Coins,
  Timer,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from "lucide-react";

interface CapsuleDetailData {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: string;
  isPrivate: boolean;
  hasVeritasSeal: boolean;
  unlockDate?: string;
  ipfsUrl?: string;
  createdAt: string;
  truthScore?: number;
  viewCount?: number;
  gttYield?: number;
  nftTokenId?: string;
  contractAddress?: string;
  transactionHash?: string;
}

export default function CapsuleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { address, chainId } = useWallet();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const { data: capsule, isLoading, error } = useQuery<Capsule>({
    queryKey: ["/api/capsules", id],
    queryFn: async () => {
      const response = await fetch(`/api/capsules/${id}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch capsule details");
      }
      
      return response.json();
    },
    enabled: !!id,
  });

  // Calculate yield for this capsule
  const calculateYield = (createdAt: string): string => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    const baseRate = 0.12; // 12% APY
    const apy = baseRate * (diffDays / 365);
    return `${apy.toFixed(4)} GTT`;
  };

  // Share to social platforms
  const shareMutation = useMutation({
    mutationFn: async (platform: "farcaster" | "lens") => {
      const response = await fetch(`/api/capsules/${id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ platform }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to share to ${platform}`);
      }
      
      return response.json();
    },
    onSuccess: (data, platform) => {
      toast({
        title: "Shared Successfully",
        description: `Capsule shared to ${platform}`,
      });
      
      // Open the share URL in a new tab
      if (data.shareUrl) {
        window.open(data.shareUrl, '_blank');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Share Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleShare = (platform: "farcaster" | "lens") => {
    setIsSharing(true);
    shareMutation.mutate(platform);
    setTimeout(() => setIsSharing(false), 1000);
  };

  const isUnlocked = (unlockDate?: string) => {
    if (!unlockDate) return true;
    return new Date() >= new Date(unlockDate);
  };

  const getCapsuleIcon = (mediaType: string) => {
    if (mediaType.startsWith("image/")) return <Image className="w-5 h-5" />;
    if (mediaType.startsWith("video/")) return <Play className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              {error?.message || "Capsule not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {capsule.viewCount || 0} views
            </Badge>
            
            {capsule.truthScore && (
              <Badge variant="default">
                Score: {capsule.truthScore}
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Section */}
            {capsule.mediaUrl && (
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    {capsule.mediaType.startsWith("image/") ? (
                      <img 
                        src={capsule.mediaUrl} 
                        alt={capsule.title}
                        className="w-full h-full object-cover"
                      />
                    ) : capsule.mediaType.startsWith("video/") ? (
                      <video 
                        src={capsule.mediaUrl}
                        controls
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          {getCapsuleIcon(capsule.mediaType)}
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {capsule.mediaType}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Status overlays */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {capsule.hasVeritasSeal && (
                        <Badge className="bg-blue-600 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Veritas Sealed
                        </Badge>
                      )}
                      
                      {!isUnlocked(capsule.unlockDate) && (
                        <Badge className="bg-orange-600 text-white">
                          <Lock className="w-3 h-3 mr-1" />
                          Time Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Title and Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  {capsule.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {capsule.description}
                </p>
                
                <Separator className="my-4" />
                
                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Created</span>
                    <p>{new Date(capsule.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-500">Privacy</span>
                    <div className="flex items-center gap-1 mt-1">
                      {capsule.isPrivate ? (
                        <>
                          <Lock className="w-3 h-3 text-orange-500" />
                          <span>Private</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3 text-green-500" />
                          <span>Public</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-500">Type</span>
                    <div className="flex items-center gap-1 mt-1">
                      {getCapsuleIcon(capsule.mediaType)}
                      <span className="capitalize">{capsule.mediaType.split('/')[0]}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-500">Yield Earned</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Coins className="w-3 h-3 text-yellow-500" />
                      <span>{calculateYield(capsule.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Lock Information */}
            {capsule.unlockDate && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      isUnlocked(capsule.unlockDate) 
                        ? "bg-green-100 text-green-600" 
                        : "bg-orange-100 text-orange-600"
                    }`}>
                      {isUnlocked(capsule.unlockDate) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Timer className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">
                        {isUnlocked(capsule.unlockDate) ? "Content Unlocked" : "Time Locked Content"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isUnlocked(capsule.unlockDate) 
                          ? `Unlocked on ${new Date(capsule.unlockDate).toLocaleDateString()}`
                          : `Will unlock on ${new Date(capsule.unlockDate).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* IPFS Link */}
                {capsule.ipfsUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(capsule.ipfsUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on IPFS
                  </Button>
                )}

                {/* Blockchain Transaction */}
                {capsule.transactionHash && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(
                      `https://polygonscan.com/tx/${capsule.transactionHash}`, 
                      '_blank'
                    )}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Transaction
                  </Button>
                )}

                <Separator />

                {/* Social Sharing */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Share this capsule
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-purple-50 hover:bg-purple-100 border-purple-200"
                    onClick={() => handleShare("farcaster")}
                    disabled={isSharing}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share to Farcaster
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-green-50 hover:bg-green-100 border-green-200"
                    onClick={() => handleShare("lens")}
                    disabled={isSharing}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share to Lens
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* NFT Information */}
            {capsule.nftTokenId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    NFT Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Token ID</span>
                    <p className="font-mono">{capsule.nftTokenId}</p>
                  </div>
                  
                  {capsule.contractAddress && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contract</span>
                      <p className="font-mono text-xs break-all">{capsule.contractAddress}</p>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(
                      `https://opensea.io/assets/polygon/${capsule.contractAddress}/${capsule.nftTokenId}`, 
                      '_blank'
                    )}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on OpenSea
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Yield Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  Yield Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Yield</span>
                    <span className="font-mono">{calculateYield(capsule.createdAt)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Daily Rate</span>
                    <span className="font-mono">0.00033 GTT</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">APY</span>
                    <span className="font-mono text-green-600">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}