import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  ExternalLink,
  Download,
  Share2,
  Clock,
  User,
  Award,
  FileText,
  Shield,
  Coins,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CapsuleDetails {
  id: string;
  title: string;
  content: string;
  griefTier: number;
  walletAddress: string;
  replayCount: number;
  mintedAt: string;
  nftTokenId?: string;
  openseaUrl?: string;
  verificationStatus: string;
  truthScore: number;
  capsuleType: string;
  tags: string[];
}

export default function CapsuleViewPage() {
  const [location] = useLocation();
  const { toast } = useToast();

  // Extract capsule ID from URL path like /capsule-view/cap_123
  const pathParts = location.split("/");
  const capsuleId = pathParts[pathParts.length - 1];

  const {
    data: capsule,
    isLoading,
    error,
  } = useQuery<CapsuleDetails>({
    queryKey: [`/api/capsules/${capsuleId}`],
    enabled: !!capsuleId && capsuleId !== "capsule-view",
  });

  if (!capsuleId || capsuleId === "capsule-view") {
    return (
      <Layout>
        <PageHeader title="Capsule Vault" subtitle="View capsule details" />
        <div className="p-6 text-center">
          <p className="text-brand-light/60 mb-4">
            No capsule ID was provided.
          </p>
          <Button
            onClick={() => (window.location.href = "/capsules/gallery")}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            Back to Gallery
          </Button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <PageHeader
          title="Loading Capsule..."
          subtitle="Retrieving capsule details"
        />
        <div className="p-6">
          <Card className="bg-brand-secondary border-brand-surface animate-pulse">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-6 bg-brand-surface rounded w-3/4"></div>
                <div className="h-4 bg-brand-surface rounded w-1/2"></div>
                <div className="h-32 bg-brand-surface rounded"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-brand-surface rounded w-24"></div>
                  <div className="h-8 bg-brand-surface rounded w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !capsule) {
    return (
      <Layout>
        <PageHeader
          title="Capsule Not Found"
          subtitle="The requested capsule could not be found"
        />
        <div className="p-6 text-center">
          <p className="text-brand-danger mb-4">
            Failed to load capsule details.
          </p>
          <Button
            onClick={() => (window.location.href = "/capsules/gallery")}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            Back to Gallery
          </Button>
        </div>
      </Layout>
    );
  }

  const getGriefTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 2:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case 3:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 4:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case 5:
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-brand-surface text-brand-light border-brand-surface";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-brand-accent text-white";
      case "pending":
        return "bg-brand-warning text-white";
      case "rejected":
        return "bg-brand-danger text-white";
      default:
        return "bg-brand-surface text-brand-light";
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: capsule.title || `Capsule #${capsule.id}`,
        text: capsule.content.slice(0, 100) + "...",
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Capsule link copied to clipboard",
      });
    }
  };

  const handleDownloadCertificate = () => {
    // Simulate certificate download
    toast({
      title: "Certificate Download",
      description: "Truth certificate will be generated and downloaded",
    });
  };

  return (
    <Layout>
      <PageHeader
        title={capsule.title || `Capsule #${capsule.id.slice(-6)}`}
        subtitle={`${capsule.content.slice(0, 60)}...`}
      />

      <div className="p-6 space-y-6">
        {/* Main Content Card */}
        <Card className="bg-brand-secondary border-brand-surface shadow-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-brand-light font-brand text-xl mb-2">
                  {capsule.title || `Capsule #${capsule.id.slice(-6)}`}
                </CardTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={getGriefTierColor(capsule.griefTier)}>
                    Grief Tier {capsule.griefTier}
                  </Badge>
                  <Badge className={getStatusColor(capsule.verificationStatus)}>
                    {capsule.verificationStatus}
                  </Badge>
                  <Badge className="bg-brand-surface text-brand-light">
                    {capsule.capsuleType.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              {capsule.nftTokenId && (
                <Badge className="bg-brand-accent text-white">
                  <Award className="w-3 h-3 mr-1" />
                  NFT #{capsule.nftTokenId}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Content */}
            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-vault p-4">
              <div className="text-brand-light whitespace-pre-wrap leading-relaxed">
                {capsule.content}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-brand-light/60">
                  <User className="w-4 h-4" />
                  <span>Creator: {truncateAddress(capsule.walletAddress)}</span>
                </div>
                <div className="flex items-center gap-2 text-brand-light/60">
                  <Eye className="w-4 h-4" />
                  <span>
                    {capsule.replayCount || 0} replay
                    {capsule.replayCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-brand-light/60">
                  <Clock className="w-4 h-4" />
                  <span>
                    Minted {new Date(capsule.mintedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-brand-light/60">
                  <Shield className="w-4 h-4" />
                  <span>Truth Score: {capsule.truthScore}/100</span>
                </div>
                <div className="flex items-center gap-2 text-brand-light/60">
                  <Coins className="w-4 h-4" />
                  <span>GTT Yield: {capsule.griefTier * 10} GTT</span>
                </div>
                <div className="flex items-center gap-2 text-brand-light/60">
                  <FileText className="w-4 h-4" />
                  <span>ID: {capsule.id}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {capsule.tags && capsule.tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-brand-light/60">Tags:</div>
                <div className="flex flex-wrap gap-2">
                  {capsule.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-brand-surface text-brand-light/80"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-brand-surface">
              <Button
                onClick={handleDownloadCertificate}
                className="bg-brand-accent hover:bg-brand-accent/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                className="border-brand-surface text-brand-light hover:bg-brand-surface"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              {capsule.openseaUrl && (
                <Button
                  onClick={() => window.open(capsule.openseaUrl, "_blank")}
                  variant="outline"
                  className="border-brand-surface text-brand-light hover:bg-brand-surface"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on OpenSea
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/capsules/gallery")}
            className="border-brand-surface text-brand-light hover:bg-brand-surface"
          >
            Back to Gallery
          </Button>

          <Button
            onClick={() => (window.location.href = "/create-capsule")}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            Create New Capsule
          </Button>
        </div>
      </div>
    </Layout>
  );
}
