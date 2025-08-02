import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Award, Clock, User } from "lucide-react";

interface MintedCapsule {
  id: string;
  title: string;
  content: string;
  griefTier: number;
  walletAddress: string;
  replayCount: number;
  mintedAt: string;
  nftTokenId?: string;
  openseaUrl?: string;
}

export default function CapsuleGallery() {
  const {
    data: capsules,
    isLoading,
    error,
  } = useQuery<MintedCapsule[]>({
    queryKey: ["/api/capsules/minted"],
  });

  if (isLoading) {
    return (
      <Layout>
        <PageHeader
          title="Capsule Gallery"
          subtitle="Explore permanently minted memory NFTs"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="bg-brand-secondary border-brand-surface animate-pulse"
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-brand-surface rounded w-3/4"></div>
                  <div className="h-3 bg-brand-surface rounded w-1/2"></div>
                  <div className="h-16 bg-brand-surface rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-brand-surface rounded w-16"></div>
                    <div className="h-6 bg-brand-surface rounded w-12"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageHeader
          title="Capsule Gallery"
          subtitle="Explore permanently minted memory NFTs"
        />
        <div className="p-6 text-center">
          <div className="text-brand-danger mb-4">
            Failed to load minted capsules. Please try again later.
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  if (!capsules || capsules.length === 0) {
    return (
      <Layout>
        <PageHeader
          title="Capsule Gallery"
          subtitle="Explore permanently minted memory NFTs"
        />
        <div className="p-6 text-center">
          <div className="text-brand-light/60 mb-4">
            No minted capsules found. Create and mint your first truth capsule
            to get started.
          </div>
          <Button
            onClick={() => (window.location.href = "/create-capsule")}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            Create Capsule
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <PageHeader
        title="Capsule Gallery"
        subtitle="Explore permanently minted memory NFTs"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-brand-light/60">
            {capsules.length} minted capsule{capsules.length !== 1 ? "s" : ""}{" "}
            found
          </div>
          <Button
            onClick={() => (window.location.href = "/create-capsule")}
            className="bg-brand-accent hover:bg-brand-accent/90"
          >
            Create New Capsule
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule) => (
            <Card
              key={capsule.id}
              className="bg-brand-secondary border-brand-surface shadow-card hover:shadow-card-hover transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-brand-light font-brand text-lg truncate flex-1 mr-2">
                    {capsule.title || `Capsule #${capsule.id.slice(-6)}`}
                  </CardTitle>
                  <Badge
                    className={`${getGriefTierColor(capsule.griefTier)} border text-xs font-medium`}
                  >
                    Tier {capsule.griefTier}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Content Preview */}
                <div className="text-brand-light/80 text-sm line-clamp-3 min-h-[3.75rem]">
                  {capsule.content}
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-xs text-brand-light/60">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>
                      Creator: {truncateAddress(capsule.walletAddress)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    <span>
                      {capsule.replayCount || 0} replay
                      {capsule.replayCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>Minted {formatDate(capsule.mintedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-brand-surface">
                  <Button
                    size="sm"
                    className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                    onClick={() =>
                      (window.location.href = `/capsule/${capsule.id}`)
                    }
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  {capsule.openseaUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-brand-surface text-brand-light hover:bg-brand-surface"
                      onClick={() => window.open(capsule.openseaUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      OpenSea
                    </Button>
                  )}
                </div>

                {/* NFT Badge */}
                {capsule.nftTokenId && (
                  <div className="flex items-center justify-center pt-2">
                    <Badge className="bg-brand-accent text-white text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      NFT #{capsule.nftTokenId}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
