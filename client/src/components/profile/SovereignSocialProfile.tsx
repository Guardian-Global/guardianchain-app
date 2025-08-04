import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import {
  User,
  Settings,
  Crown,
  Zap,
  Shield,
  Heart,
  Star,
  Trophy,
  Camera,
  Edit3,
  Save,
  X,
  Plus,
  MessageSquare,
  Sparkles,
  Lock,
  Globe,
  Play,
  Image,
  FileText,
  Music,
  Video,
  Award,
  Gem,
  Clock,
  Pin,
  Upload,
  Eye,
  Share2,
  Flame,
} from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import { CapsuleVaultTimeline } from "@/components/CapsuleVaultTimeline";
import { SaveNotificationProvider } from "@/components/SaveNotificationProvider";
import FeaturedCapsulesManager from "@/components/profile/FeaturedCapsulesManager";
import NFTAutoMinter from "@/components/profile/NFTAutoMinter";
import TruthGenomeCard from "@/components/profile/TruthGenomeCard";
import CapsuleWallToggle, {
  type ViewMode,
} from "@/components/profile/CapsuleWallToggle";
import CapsuleMintBase from "@/components/web3/CapsuleMintBase";

interface SovereignProfile {
  id: string;
  email?: string;
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  profileVideoUrl?: string;
  backgroundImageUrl?: string;
  introVideoUrl?: string;
  location?: string;
  website?: string;
  socials?: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  featuredCapsules?: string[];
  capsuleCount?: number;
  nftCount?: number;
  truthScore?: number;
  griefScore?: number;
  veritasSealCount?: number;
  permanentRecords?: PermanentRecord[];
  tier?: string;
  isVerified?: boolean;
  isFounder?: boolean;
  memberSince?: string;
}

interface PermanentRecord {
  id: string;
  type: "capsule" | "nft" | "veritas_seal" | "truth_bounty";
  title: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: string;
  timestamp: string;
  truthScore?: number;
  isFeatured?: boolean;
  isSealed?: boolean;
  nftTokenId?: string;
  ipfsHash?: string;
}

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadType: string;
}

export default function SovereignSocialProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<SovereignProfile>({
    id: "demo-profile",
    displayName: "Guardian Pioneer",
    bio: "Preserving truth for future generations through blockchain technology",
    tier: "SOVEREIGN",
    isVerified: true,
    memberSince: "2024",
    capsuleCount: 47,
    nftCount: 23,
    truthScore: 892,
    griefScore: 156,
    veritasSealCount: 8,
  });

  const [activeTab, setActiveTab] = useState("timeline");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const { toast } = useToast();

  // Media upload handlers
  const handleProfileImageUpload = (uploadedFiles: MediaFile[]) => {
    if (uploadedFiles.length > 0) {
      setProfile((prev) => ({
        ...prev,
        profileImageUrl: uploadedFiles[0].url,
      }));
      setHasUnsavedChanges(true);
      toast({
        title: "Profile Image Updated",
        description: "Your new profile image will be minted as an NFT.",
      });
    }
  };

  const handleProfileVideoUpload = (uploadedFiles: MediaFile[]) => {
    if (uploadedFiles.length > 0) {
      setProfile((prev) => ({
        ...prev,
        profileVideoUrl: uploadedFiles[0].url,
      }));
      setHasUnsavedChanges(true);
      toast({
        title: "Profile Video Updated",
        description:
          "Your profile video will be minted as an NFT and automatically sealed.",
      });
    }
  };

  const handleBackgroundUpload = (uploadedFiles: MediaFile[]) => {
    if (uploadedFiles.length > 0) {
      setProfile((prev) => ({
        ...prev,
        backgroundImageUrl: uploadedFiles[0].url,
      }));
      setHasUnsavedChanges(true);
      toast({
        title: "Background Updated",
        description: "Your new background has been set permanently.",
      });
    }
  };

  const handleGeneralMediaUpload = async (uploadedFiles: MediaFile[]) => {
    for (const file of uploadedFiles) {
      // Auto-categorize and create capsule
      const capsuleType = getCapsuleTypeFromFile(file);

      try {
        const response = await apiRequest("/api/capsules", {
          method: "POST",
          body: JSON.stringify({
            title: `Auto-Generated: ${file.name}`,
            content: `Automatically created from uploaded ${file.type}`,
            capsuleType,
            mediaUrl: file.url,
            mediaType: file.type,
            isSealed: true, // Auto-seal all uploads
            autoMintNFT: true, // Auto-mint as NFT
          }),
        });

        toast({
          title: "Media Uploaded & Capsule Created",
          description: `${file.name} has been added to your vault and minted as an NFT.`,
        });
      } catch (error) {
        toast({
          title: "Upload Processing Error",
          description: "Media uploaded but capsule creation failed.",
          variant: "destructive",
        });
      }
    }
  };

  const getCapsuleTypeFromFile = (file: MediaFile): string => {
    if (file.type.startsWith("image/")) return "visual_memory";
    if (file.type.startsWith("video/")) return "video_testimony";
    if (file.type.startsWith("audio/")) return "audio_memory";
    if (file.type.includes("pdf") || file.type.includes("document"))
      return "document_legacy";
    return "general_capsule";
  };

  const saveProfile = async () => {
    try {
      // Save profile changes
      await apiRequest("PUT", "/api/user/profile", profile);

      setHasUnsavedChanges(false);
      setIsEditing(false);

      toast({
        title: "Profile Saved",
        description:
          "Your sovereign profile has been permanently recorded on-chain.",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save profile changes.",
        variant: "destructive",
      });
    }
  };

  const renderProfileHeader = () => (
    <div className="relative">
      {/* Background Image */}
      <div
        className="h-64 w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-t-lg relative overflow-hidden"
        style={{
          backgroundImage: profile.backgroundImageUrl
            ? `url(${profile.backgroundImageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isEditing && (
          <div className="absolute top-4 right-4">
            <ObjectUploader
              onGetUploadParameters={async () => {
                const response = await apiRequest("/api/objects/upload", {
                  method: "POST",
                });
                return { method: "PUT" as const, url: response.uploadURL };
              }}
              onComplete={(result) => {
                if (result.successful?.[0]?.uploadURL) {
                  handleBackgroundUpload([
                    {
                      id: "bg-" + Date.now(),
                      name: "background.jpg",
                      type: "image/jpeg",
                      size: 0,
                      url: result.successful[0].uploadURL,
                      uploadType: "background",
                    },
                  ]);
                }
              }}
              buttonClassName="bg-black/50 hover:bg-black/70"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Background
            </ObjectUploader>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Verification badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {profile.isVerified && (
            <Badge variant="secondary" className="bg-blue-500/80 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {profile.isFounder && (
            <Badge variant="secondary" className="bg-yellow-500/80 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Founder
            </Badge>
          )}
        </div>
      </div>

      {/* Profile Info Overlay */}
      <div className="absolute -bottom-16 left-8 flex items-end gap-6">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            <AvatarImage src={profile.profileImageUrl} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {profile.displayName?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>

          {/* Profile Video Play Button */}
          {profile.profileVideoUrl && (
            <Button
              size="sm"
              className="absolute bottom-2 right-2 w-8 h-8 rounded-full p-0 bg-black/70 hover:bg-black/90"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}

          {isEditing && (
            <div className="absolute -bottom-2 -right-2 flex gap-1">
              <ObjectUploader
                onGetUploadParameters={async () => {
                  const response = await apiRequest("/api/objects/upload", {
                    method: "POST",
                  });
                  return { method: "PUT" as const, url: response.uploadURL };
                }}
                onComplete={(result) => {
                  if (result.successful?.[0]?.uploadURL) {
                    handleProfileImageUpload([
                      {
                        id: "img-" + Date.now(),
                        name: "profile.jpg",
                        type: "image/jpeg",
                        size: 0,
                        url: result.successful[0].uploadURL,
                        uploadType: "profile_image",
                      },
                    ]);
                  }
                }}
                buttonClassName="w-8 h-8 rounded-full p-0"
              >
                <Camera className="w-4 h-4" />
              </ObjectUploader>
              <ObjectUploader
                onGetUploadParameters={async () => {
                  const response = await apiRequest("/api/objects/upload", {
                    method: "POST",
                  });
                  return { method: "PUT" as const, url: response.uploadURL };
                }}
                onComplete={(result) => {
                  if (result.successful?.[0]?.uploadURL) {
                    handleProfileVideoUpload([
                      {
                        id: "vid-" + Date.now(),
                        name: "profile.mp4",
                        type: "video/mp4",
                        size: 0,
                        url: result.successful[0].uploadURL,
                        uploadType: "profile_video",
                      },
                    ]);
                  }
                }}
                buttonClassName="w-8 h-8 rounded-full p-0"
              >
                <Video className="w-4 h-4" />
              </ObjectUploader>
            </div>
          )}
        </div>

        {/* Name and Stats */}
        <div className="pb-4 text-white">
          <div className="flex items-center gap-3 mb-2">
            {isEditing ? (
              <Input
                value={profile.displayName || ""}
                onChange={(e) => {
                  setProfile((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }));
                  setHasUnsavedChanges(true);
                }}
                className="text-2xl font-bold bg-black/50 border-white/30 text-white"
                placeholder="Display Name"
              />
            ) : (
              <h1 className="text-3xl font-bold">{profile.displayName}</h1>
            )}

            <Badge
              variant="outline"
              className="border-yellow-400 text-yellow-400"
            >
              {profile.tier}
            </Badge>
          </div>

          {isEditing ? (
            <Textarea
              value={profile.bio || ""}
              onChange={(e) => {
                setProfile((prev) => ({ ...prev, bio: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              className="bg-black/50 border-white/30 text-white resize-none"
              placeholder="Bio"
              rows={2}
            />
          ) : (
            <p className="text-lg text-gray-200 max-w-md">{profile.bio}</p>
          )}

          <div className="flex items-center gap-6 mt-3 text-sm">
            <span>Member since {profile.memberSince}</span>
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
      </div>

      {/* Edit Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isEditing ? (
          <>
            <Button
              onClick={saveProfile}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setHasUnsavedChanges(false);
              }}
              size="sm"
              variant="outline"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="outline"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );

  const renderStatsPanel = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="grid grid-cols-2 col-span-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {profile.capsuleCount}
            </div>
            <div className="text-sm text-gray-600">Capsules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {profile.nftCount}
            </div>
            <div className="text-sm text-gray-600">NFTs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {profile.veritasSealCount}
            </div>
            <div className="text-sm text-gray-600">Veritas Seals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {profile.griefScore}
            </div>
            <div className="text-sm text-gray-600">Grief Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Truth Genome Card */}
      <div className="row-span-1">
        <TruthGenomeCard
          userId={profile.id}
          overallScore={Math.round((profile.truthScore || 0) / 10)}
          className="h-full"
        />
      </div>
    </div>
  );

  const renderMediaUploadPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Media Upload & Auto-Capsule Creation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <ObjectUploader
            maxNumberOfFiles={5}
            onGetUploadParameters={async () => {
              const response = await apiRequest("/api/objects/upload", {
                method: "POST",
              });
              return { method: "PUT" as const, url: response.uploadURL };
            }}
            onComplete={(result) => {
              const files =
                result.successful?.map((file, idx) => ({
                  id: "img-" + Date.now() + "-" + idx,
                  name: file.name || "image.jpg",
                  type: "image/jpeg",
                  size: file.size || 0,
                  url: file.uploadURL || "",
                  uploadType: "general",
                })) || [];
              handleGeneralMediaUpload(files);
            }}
            buttonClassName="h-20 flex-col gap-2"
          >
            <Image className="w-8 h-8" />
            <span>Upload Images</span>
            <span className="text-xs text-gray-500">Auto-mint as NFTs</span>
          </ObjectUploader>

          <ObjectUploader
            maxNumberOfFiles={3}
            onGetUploadParameters={async () => {
              const response = await apiRequest("/api/objects/upload", {
                method: "POST",
              });
              return { method: "PUT" as const, url: response.uploadURL };
            }}
            onComplete={(result) => {
              const files =
                result.successful?.map((file, idx) => ({
                  id: "vid-" + Date.now() + "-" + idx,
                  name: file.name || "video.mp4",
                  type: "video/mp4",
                  size: file.size || 0,
                  url: file.uploadURL || "",
                  uploadType: "general",
                })) || [];
              handleGeneralMediaUpload(files);
            }}
            buttonClassName="h-20 flex-col gap-2"
          >
            <Video className="w-8 h-8" />
            <span>Upload Videos</span>
            <span className="text-xs text-gray-500">Auto-seal & verify</span>
          </ObjectUploader>

          <ObjectUploader
            maxNumberOfFiles={3}
            onGetUploadParameters={async () => {
              const response = await apiRequest("/api/objects/upload", {
                method: "POST",
              });
              return { method: "PUT" as const, url: response.uploadURL };
            }}
            onComplete={(result) => {
              const files =
                result.successful?.map((file, idx) => ({
                  id: "aud-" + Date.now() + "-" + idx,
                  name: file.name || "audio.mp3",
                  type: "audio/mp3",
                  size: file.size || 0,
                  url: file.uploadURL || "",
                  uploadType: "general",
                })) || [];
              handleGeneralMediaUpload(files);
            }}
            buttonClassName="h-20 flex-col gap-2"
          >
            <Music className="w-8 h-8" />
            <span>Upload Audio</span>
            <span className="text-xs text-gray-500">Truth testimonies</span>
          </ObjectUploader>

          <ObjectUploader
            maxNumberOfFiles={5}
            onGetUploadParameters={async () => {
              const response = await apiRequest("/api/objects/upload", {
                method: "POST",
              });
              return { method: "PUT" as const, url: response.uploadURL };
            }}
            onComplete={(result) => {
              const files =
                result.successful?.map((file, idx) => ({
                  id: "doc-" + Date.now() + "-" + idx,
                  name: file.name || "document.pdf",
                  type: "application/pdf",
                  size: file.size || 0,
                  url: file.uploadURL || "",
                  uploadType: "general",
                })) || [];
              handleGeneralMediaUpload(files);
            }}
            buttonClassName="h-20 flex-col gap-2"
          >
            <FileText className="w-8 h-8" />
            <span>Upload Documents</span>
            <span className="text-xs text-gray-500">Legacy preservation</span>
          </ObjectUploader>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <Sparkles className="w-4 h-4 inline mr-1" />
            All uploads are automatically categorized, minted as NFTs, and added
            to your capsule vault timeline.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SaveNotificationProvider hasUnsavedChanges={hasUnsavedChanges}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6 overflow-hidden">
            {renderProfileHeader()}
            <div className="pt-20 pb-6 px-8">{renderStatsPanel()}</div>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="timeline">
                <Clock className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="featured">
                <Pin className="w-4 h-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="nfts">
                <Gem className="w-4 h-4 mr-2" />
                NFT Gallery
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="seals">
                <Award className="w-4 h-4 mr-2" />
                Veritas Seals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6">
              <div className="space-y-4">
                <CapsuleWallToggle
                  currentView={viewMode}
                  onViewChange={setViewMode}
                  capsuleCount={profile.capsuleCount || 0}
                />
                <CapsuleVaultTimeline userId={profile.id} viewMode={viewMode} />
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              <FeaturedCapsulesManager />
            </TabsContent>

            <TabsContent value="nfts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>NFT Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                      >
                        <Gem className="w-8 h-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CapsuleMintBase
                  onChainSelect={(chainId) => {
                    console.log("Selected chain:", chainId);
                  }}
                  onMint={async (chainId, metadata) => {
                    try {
                      console.log("Minting capsule on chain:", chainId, metadata);
                      toast({
                        title: "Capsule Added to Timeline",
                        description: "Your new capsule is now live on your sovereign profile",
                      });
                    } catch (error) {
                      console.error("Mint failed:", error);
                      throw error;
                    }
                  }}
                  className="w-full"
                />
                {renderMediaUploadPanel()}
              </div>
            </TabsContent>

            <TabsContent value="seals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Veritas Seals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Your truth verification achievements and sealed testimonies.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="outline" className="bg-green-50">
                      <Award className="w-3 h-3 mr-1" />
                      {profile.veritasSealCount} Verified Seals
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SaveNotificationProvider>
  );
}
