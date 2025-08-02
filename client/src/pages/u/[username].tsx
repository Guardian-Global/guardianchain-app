import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  ExternalLink,
  Star,
  Flame,
  Shield,
  Crown,
  Eye,
  Heart,
  MessageCircle,
  Download,
} from "lucide-react";
import TruthGenomeCard from "@/components/profile/TruthGenomeCard";
import CapsuleWallToggle, {
  type ViewMode,
} from "@/components/profile/CapsuleWallToggle";
import { CapsuleVaultTimeline } from "@/components/CapsuleVaultTimeline";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
  tier: string;
  truthScore: number;
  griefScore: number;
  capsuleCount: number;
  nftCount: number;
  veritasSealCount: number;
  memberSince: string;
  isVerified: boolean;
  isPublic: boolean;
  lastActive: string;
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (username) {
      loadPublicProfile(username);
    }
  }, [username]);

  const loadPublicProfile = async (username: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock public profile data for development
      const mockProfile: PublicProfile = {
        id: `profile-${username}`,
        username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        bio: "Sovereign guardian preserving truth for future generations",
        profileImageUrl: "/api/placeholder-image",
        backgroundImageUrl: "/api/placeholder-background",
        tier: "SOVEREIGN",
        truthScore: 892,
        griefScore: 156,
        capsuleCount: 47,
        nftCount: 23,
        veritasSealCount: 8,
        memberSince: "2024",
        isVerified: true,
        isPublic: true,
        lastActive: new Date().toISOString(),
      };

      setProfile(mockProfile);
    } catch (error) {
      console.error("Failed to load public profile:", error);
      setError("Profile not found or is private");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${username}`;

    try {
      await navigator.share({
        title: `${profile?.displayName} - GuardianChain Profile`,
        text: `Check out ${profile?.displayName}'s sovereign memory wall on GuardianChain`,
        url,
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      toast({
        title: "Profile Link Copied",
        description: "Share this link to showcase your sovereign profile",
      });
    }
  };

  const handleFollow = () => {
    toast({
      title: "Following Feature Coming Soon",
      description:
        "Guardian network connections will be available in the next update",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || "This profile doesn't exist or has been set to private"}
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden">
          {/* Background Image */}
          <div
            className="h-64 bg-gradient-to-br from-purple-600 to-blue-600 relative"
            style={
              profile.backgroundImageUrl
                ? {
                    backgroundImage: `url(${profile.backgroundImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            <div className="absolute inset-0 bg-black/30" />

            {/* Public Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 text-black">
                <Eye className="w-3 h-3 mr-1" />
                Public Profile
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="secondary">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Blockchain
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-8 pt-6">
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="relative -mt-16">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
                  {profile.profileImageUrl && (
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {profile.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.displayName}</h1>
                  <Badge
                    variant="outline"
                    className="border-yellow-400 text-yellow-400"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    {profile.tier}
                  </Badge>
                </div>

                <p className="text-lg text-gray-600 mb-3">
                  @{profile.username}
                </p>

                {profile.bio && (
                  <p className="text-gray-700 mb-4 max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>Guardian since {profile.memberSince}</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {profile.truthScore} Truth Score
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    {profile.griefScore} Grief
                  </span>
                </div>
              </div>

              {/* Follow Button */}
              <div className="flex flex-col gap-2">
                <Button onClick={handleFollow}>
                  <Heart className="w-4 h-4 mr-2" />
                  Follow Guardian
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="grid grid-cols-2 col-span-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {profile.capsuleCount}
                    </div>
                    <div className="text-sm text-gray-600">Truth Capsules</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {profile.nftCount}
                    </div>
                    <div className="text-sm text-gray-600">NFT Collection</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {profile.veritasSealCount}
                    </div>
                    <div className="text-sm text-gray-600">Verified Seals</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {profile.griefScore}
                    </div>
                    <div className="text-sm text-gray-600">Influence Score</div>
                  </CardContent>
                </Card>
              </div>

              {/* Truth Genome Card */}
              <div className="row-span-1">
                <TruthGenomeCard
                  userId={profile.id}
                  overallScore={Math.round(profile.truthScore / 10)}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Capsule Wall */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sovereign Memory Wall</span>
              <Badge variant="outline">
                {profile.capsuleCount} Public Capsules
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CapsuleWallToggle
                currentView={viewMode}
                onViewChange={setViewMode}
                capsuleCount={profile.capsuleCount}
              />
              <CapsuleVaultTimeline
                userId={profile.id}
                viewMode={viewMode}
                isPublicView={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">
            This is a sovereign profile on GuardianChain -
            <a href="/" className="text-purple-600 hover:underline ml-1">
              Create your own memory wall
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
