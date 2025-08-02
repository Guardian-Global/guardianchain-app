import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { MediaUploader } from '@/components/MediaUploader';
import { CapsuleVaultTimeline } from '@/components/CapsuleVaultTimeline';
import { SaveNotificationProvider, useSaveNotification } from '@/components/SaveNotificationProvider';
import { 
  User, 
  Crown, 
  Award, 
  Shield,
  Star,
  Camera,
  Edit,
  Save,
  Upload,
  Zap,
  Trophy,
  Target,
  Heart,
  Globe,
  Link,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Video,
  Image,
  Play,
  Pause,
  Coins,
  Eye,
  FileText,
  Sparkles,
  Settings,
  Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  profileImageUrl?: string;
  profileVideoUrl?: string;
  backgroundImageUrl?: string;
  mediaPreferences?: {
    autoMintImages: boolean;
    autoMintVideos: boolean;
    autoSealTruthVault: boolean;
    defaultVisibility: string;
  };
  bannerImageUrl?: string;
  tier: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN';
  reputation: {
    truthScore: number;
    griefTotal: number;
    capsuleCount: number;
    verificationsCount: number;
    reputationTier: string;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  stats: {
    capsulesCreated: number;
    truthsVerified: number;
    tokensEarned: number;
    daysActive: number;
    influence: number;
  };
}

interface ProfileUpgradeContentProps {
  user: any;
}

function ProfileUpgradeContent({ user }: ProfileUpgradeContentProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { trackChanges, saveChanges, hasUnsavedChanges } = useSaveNotification();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: '',
    profileImageUrl: '',
    profileVideoUrl: '',
    backgroundImageUrl: '',
    mediaPreferences: {
      autoMintImages: false,
      autoMintVideos: false,
      autoSealTruthVault: false,
      defaultVisibility: 'public'
    }
  });

  const [profileMedia, setProfileMedia] = useState({
    profileImage: null as any,
    profileVideo: null as any,
    backgroundImage: null as any,
  });

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Fetch user profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/api/profile", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/profile/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/profile/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile", user?.id] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        username: profileData.username || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || '',
        twitter: profileData.twitter || '',
        linkedin: profileData.linkedin || '',
        profileImageUrl: profileData.profileImageUrl || '',
        profileVideoUrl: profileData.profileVideoUrl || '',
        backgroundImageUrl: profileData.backgroundImageUrl || '',
        mediaPreferences: {
          autoMintImages: profileData.mediaPreferences?.autoMintImages || false,
          autoMintVideos: profileData.mediaPreferences?.autoMintVideos || false,
          autoSealTruthVault: profileData.mediaPreferences?.autoSealTruthVault || false,
          defaultVisibility: profileData.mediaPreferences?.defaultVisibility || 'public'
        }
      });
    }
  }, [profileData]);

  const handleInputChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    trackChanges(updatedData, 'profile');
  };

  const handleMediaPreferenceChange = (field: string, value: any) => {
    const updatedPreferences = { ...formData.mediaPreferences, [field]: value };
    const updatedData = { ...formData, mediaPreferences: updatedPreferences };
    setFormData(updatedData);
    trackChanges(updatedData, 'profile');
  };

  const handleMediaUpload = async (uploadedFiles: any[], mediaType: 'profileImage' | 'profileVideo' | 'backgroundImage') => {
    if (uploadedFiles.length === 0) return;

    const file = uploadedFiles[0];
    const mediaUrl = file.url;

    // Update form data
    const updatedData = { ...formData, [`${mediaType}Url`]: mediaUrl };
    setFormData(updatedData);
    trackChanges(updatedData, 'profile');

    // Store media reference
    setProfileMedia(prev => ({ ...prev, [mediaType]: file }));

    // If auto-mint is enabled, create capsule and mint as NFT
    if (formData.mediaPreferences.autoMintImages && mediaType === 'profileImage') {
      try {
        await createCapsuleFromMedia(file, 'Profile Image Update');
      } catch (error) {
        console.error('Failed to auto-mint profile image:', error);
      }
    }

    if (formData.mediaPreferences.autoMintVideos && mediaType === 'profileVideo') {
      try {
        await createCapsuleFromMedia(file, 'Profile Video Update');
      } catch (error) {
        console.error('Failed to auto-mint profile video:', error);
      }
    }

    toast({
      title: `${mediaType} Updated`,
      description: `Your ${mediaType.replace(/([A-Z])/g, ' $1').toLowerCase()} has been uploaded successfully.`,
    });
  };

  const createCapsuleFromMedia = async (file: any, title: string) => {
    const capsuleData = {
      title,
      content: `Auto-generated capsule for ${title}`,
      mediaType: file.type.startsWith('image/') ? 'image' : 
                 file.type.startsWith('video/') ? 'video' : 'document',
      mediaUrl: file.url,
      fileName: file.name,
      fileSize: file.size,
      capsuleType: "personal_testimony",
      autoMintEnabled: true,
      isNftMinted: false,
      isTruthVaultSealed: formData.mediaPreferences.autoSealTruthVault,
    };

    const response = await fetch('/api/capsules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(capsuleData),
    });

    if (!response.ok) throw new Error('Failed to create capsule');
    const capsule = await response.json();

    // Auto-mint as NFT if enabled
    if (formData.mediaPreferences.autoMintImages || formData.mediaPreferences.autoMintVideos) {
      try {
        await fetch(`/api/capsules/${capsule.id}/mint-nft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        toast({
          title: "NFT Minted",
          description: `Your ${title} has been automatically minted as an NFT.`,
        });
      } catch (error) {
        console.error('Failed to mint NFT:', error);
      }
    }

    return capsule;
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      await saveChanges();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const toggleVideoPlayback = () => {
    const video = document.getElementById('profile-video') as HTMLVideoElement;
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Save Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Profile</h1>
          <p className="text-muted-foreground">Manage your digital identity and media vault</p>
        </div>
        <div className="flex items-center gap-4">
          {hasUnsavedChanges && (
            <Badge variant="destructive" className="animate-pulse">
              Unsaved Changes
            </Badge>
          )}
          <Button 
            onClick={handleSaveProfile}
            disabled={updateProfile.isPending || !hasUnsavedChanges}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </Button>
        </div>
      </div>

      <Tabs defaultValue="media" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="vault" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Capsule Vault
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Media Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="space-y-3">
                  <Label>Profile Image</Label>
                  <div className="flex items-center gap-4">
                    {formData.profileImageUrl ? (
                      <img 
                        src={formData.profileImageUrl} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <MediaUploader
                      uploadType="profile_image"
                      maxNumberOfFiles={1}
                      acceptedFileTypes={["image/*"]}
                      onUploadComplete={(files) => handleMediaUpload(files, 'profileImage')}
                      className="flex-1"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Photo
                    </MediaUploader>
                  </div>
                </div>

                {/* Profile Video */}
                <div className="space-y-3">
                  <Label>Profile Video Loop</Label>
                  <div className="space-y-3">
                    {formData.profileVideoUrl ? (
                      <div className="relative">
                        <video 
                          id="profile-video"
                          src={formData.profileVideoUrl}
                          className="w-full h-40 object-cover rounded-lg"
                          loop
                          muted
                          onClick={toggleVideoPlayback}
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={toggleVideoPlayback}
                        >
                          {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <MediaUploader
                      uploadType="profile_video"
                      maxNumberOfFiles={1}
                      acceptedFileTypes={["video/*"]}
                      maxFileSize={100 * 1024 * 1024} // 100MB
                      onUploadComplete={(files) => handleMediaUpload(files, 'profileVideo')}
                      className="w-full"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Upload Video Loop
                    </MediaUploader>
                  </div>
                </div>

                {/* Background Image */}
                <div className="space-y-3">
                  <Label>Background Image</Label>
                  <div className="space-y-3">
                    {formData.backgroundImageUrl ? (
                      <img 
                        src={formData.backgroundImageUrl} 
                        alt="Background" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <MediaUploader
                      uploadType="background"
                      maxNumberOfFiles={1}
                      acceptedFileTypes={["image/*"]}
                      onUploadComplete={(files) => handleMediaUpload(files, 'backgroundImage')}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Background
                    </MediaUploader>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Any Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload any digital files - photos, videos, documents, audio. They'll be automatically organized as capsules in your vault.
                </p>
                
                <MediaUploader
                  uploadType="general"
                  maxNumberOfFiles={10}
                  maxFileSize={500 * 1024 * 1024} // 500MB
                  onUploadComplete={(files) => {
                    files.forEach(file => {
                      createCapsuleFromMedia(file, `General Upload - ${file.name}`);
                    });
                  }}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Files
                </MediaUploader>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm">Instant NFT Minting</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Mint All as NFTs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Information Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capsule Vault Tab */}
        <TabsContent value="vault" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Capsule Vault Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CapsuleVaultTimeline userId={user?.id} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-mint Images as NFTs</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically mint uploaded images as NFTs
                  </p>
                </div>
                <Switch
                  checked={formData.mediaPreferences.autoMintImages}
                  onCheckedChange={(checked) => handleMediaPreferenceChange('autoMintImages', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-mint Videos as NFTs</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically mint uploaded videos as NFTs
                  </p>
                </div>
                <Switch
                  checked={formData.mediaPreferences.autoMintVideos}
                  onCheckedChange={(checked) => handleMediaPreferenceChange('autoMintVideos', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-seal in Truth Vault</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically seal important uploads in the truth vault
                  </p>
                </div>
                <Switch
                  checked={formData.mediaPreferences.autoSealTruthVault}
                  onCheckedChange={(checked) => handleMediaPreferenceChange('autoSealTruthVault', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements & Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm text-muted-foreground">Capsules Created</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <Star className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Truths Verified</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <Coins className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">NFTs Minted</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
                  <Crown className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                  <div className="text-2xl font-bold">89</div>
                  <div className="text-sm text-muted-foreground">Influence Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function EnhancedProfileUpgradePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to access your enhanced profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SaveNotificationProvider userId={user.id}>
      <ProfileUpgradeContent user={user} />
    </SaveNotificationProvider>
  );
}