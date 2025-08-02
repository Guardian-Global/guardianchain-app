import {
  Star,
  User,
  Coins,
  Check,
  Clock,
  Eye,
  MessageCircle,
  ExternalLink,
  Shield,
  Image,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Link } from "wouter";
import ShareButtons from "@/components/social/share-buttons";
import type { Capsule } from "@shared/schema";

interface CapsuleCardProps {
  capsule: Capsule;
  viewMode?: "grid" | "list";
}

export default function CapsuleCard({
  capsule,
  viewMode = "grid",
}: CapsuleCardProps) {
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);

  const handleMintNFT = async () => {
    setIsMinting(true);
    try {
      const response = await apiRequest("POST", "/api/mint", {
        capsuleId: capsule.id,
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678", // Mock wallet for demo
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

  const isSealed = capsule.status === "sealed" && capsule.docusignEnvelopeId;
  const canMint = isSealed && !capsule.nftTokenId;
  const alreadyMinted = !!capsule.nftTokenId;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-600 text-white";
      case "sealed":
        return "bg-purple-600 text-white";
      case "pending":
        return "bg-blue-600 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Check className="h-3 w-3" />;
      case "sealed":
        return <Star className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sealed":
        return "Sealed with Veritas";
      case "verified":
        return "Verified";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 card-hover">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
              {capsule.imageUrl ? (
                <img
                  src={capsule.imageUrl}
                  alt={capsule.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-slate-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(capsule.status)}>
                    {getStatusIcon(capsule.status)}
                    <span className="ml-1">
                      {getStatusText(capsule.status)}
                    </span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    {capsule.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">
                    {capsule.griefScore}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white hover:text-primary transition-colors line-clamp-2">
                {capsule.title}
              </h3>

              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {capsule.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {capsule.creatorId.toString().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-400">
                      Creator #{capsule.creatorId}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Coins className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400 font-medium">
                      +{capsule.gttReward} GTT
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-400">
                      {capsule.verificationCount}
                    </span>
                  </div>
                </div>
                <span className="text-slate-500">
                  {timeAgo(capsule.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 card-hover overflow-hidden group">
      <div className="aspect-video bg-slate-700 overflow-hidden relative">
        {capsule.imageUrl ? (
          <img
            src={capsule.imageUrl}
            alt={capsule.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Eye className="h-12 w-12 text-slate-400" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(capsule.status)}>
            {getStatusIcon(capsule.status)}
            <span className="ml-1">{getStatusText(capsule.status)}</span>
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className="border-slate-600 text-slate-300 bg-slate-900/80 backdrop-blur-sm"
          >
            {capsule.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{capsule.griefScore}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Coins className="h-4 w-4 text-amber-400" />
            <span className="text-amber-400 font-medium text-sm">
              +{capsule.gttReward} GTT
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {capsule.title}
        </h3>

        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
          {capsule.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4 text-slate-500" />
              <span className="text-slate-400">
                Creator #{capsule.creatorId}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4 text-slate-500" />
              <span className="text-slate-400">
                {capsule.verificationCount}
              </span>
            </div>
          </div>
          <span className="text-slate-500">{timeAgo(capsule.createdAt)}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
          {/* Veritas Seal Status */}
          {isSealed && capsule.veritasSealUrl && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
              onClick={() => window.open(capsule.veritasSealUrl!, "_blank")}
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <Image className="h-3 w-3 mr-2" />
              {isMinting ? "Minting..." : "Mint as NFT"}
            </Button>
          )}

          {alreadyMinted && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
              onClick={() =>
                window.open(
                  `https://opensea.io/assets/matic/0x1234567890abcdef1234567890abcdef12345678/${capsule.nftTokenId}`,
                  "_blank",
                )
              }
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

          <div className="space-y-2">
            <Link href={`/capsule/${capsule.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-600 hover:border-primary hover:text-primary transition-colors"
              >
                View Details
              </Button>
            </Link>

            <div className="pt-2 border-t border-slate-700">
              <ShareButtons
                title={`Immutable Truth Capsule: ${capsule.title}`}
                url={`https://guardianchain.app/capsule/${capsule.id}`}
                image={
                  capsule.imageUrl ||
                  `https://api.dicebear.com/7.x/shapes/svg?seed=${capsule.id}`
                }
                description={`${capsule.description} • Verified truth on GuardianChain with grief score ${capsule.griefScore}`}
                compact={true}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
