'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ObjectUploader } from "@/components/ObjectUploader";
import AIBackgroundEnhancer from "@/components/ai/AIBackgroundEnhancer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { UploadResult } from '@uppy/core';
import { 
  User, 
  Camera, 
  Video, 
  Music, 
  Palette, 
  Settings, 
  Globe, 
  MapPin, 
  Briefcase,
  Clock,
  Languages,
  Star,
  Award,
  Heart,
  Code,
  Sparkles,
  Eye,
  MessageSquare,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Save,
  Upload,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Link,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Facebook
} from "lucide-react";

interface ProfileData {
  id: string;
  email: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  occupation?: string;
  pronouns?: string;
  timezone?: string;
  profileImage?: string;
  coverImage?: string;
  profileVideo?: string;
  portfolioImages?: string[];
  portfolioVideos?: string[];
  profileMusic?: string;
  customCSS?: string;
  socialLinks?: Record<string, string>;
  customBadges?: string[];
  skillTags?: string[];
  interests?: string[];
  achievements?: string[];
  languages?: string[];
  musicPreferences?: string[];
  customization?: {
    theme?: string;
    accentColor?: string;
    backgroundPattern?: string;
    profileLayout?: string;
    showActivityFeed?: boolean;
    showStatsPublic?: boolean;
    allowDirectMessages?: boolean;
    statusMessage?: string;
    availabilityStatus?: string;
    favoriteQuote?: string;
    animationsEnabled?: boolean;
    particleEffects?: boolean;
    displayMode?: string;
  };
  tier: string;
}

export default function EnhancedProfileEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeSection, setActiveSection] = useState('basic');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newBadge, setNewBadge] = useState('');

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/profile'],
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        ...profile,
        portfolioImages: profile.portfolioImages || [],
        portfolioVideos: profile.portfolioVideos || [],
        socialLinks: profile.socialLinks || {},
        customBadges: profile.customBadges || [],
        skillTags: profile.skillTags || [],
        interests: profile.interests || [],
        achievements: profile.achievements || [],
        languages: profile.languages || [],
        musicPreferences: profile.musicPreferences || [],
        customization: profile.customization || {
          theme: 'cyberpunk',
          accentColor: '#00ffe1',
          backgroundPattern: 'matrix',
          profileLayout: 'grid',
          showActivityFeed: true,
          showStatsPublic: true,
          allowDirectMessages: true,
          statusMessage: '',
          availabilityStatus: 'online',
          favoriteQuote: '',
          animationsEnabled: true,
          particleEffects: true,
          displayMode: 'professional'
        }
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<ProfileData>) => {
      return apiRequest('/api/profile', 'PATCH', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({ title: "Profile updated successfully!", variant: "default" });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({ title: "Failed to update profile", description: error.message, variant: "destructive" });
    },
  });

  // Handle file upload completions
  const handleImageUpload = async (result: UploadResult, type: 'profile' | 'cover' | 'portfolio') => {
    if (!result.successful[0]) return;
    
    const uploadUrl = result.successful[0].uploadURL;
    
    try {
      if (type === 'profile') {
        const response = await apiRequest('/api/profile/avatar', 'PATCH', { profileImageURL: uploadUrl });
        setProfileData(prev => prev ? { ...prev, profileImage: response.objectPath } : null);
      } else if (type === 'cover') {
        const response = await apiRequest('/api/profile/cover', 'PATCH', { coverImageURL: uploadUrl });
        setProfileData(prev => prev ? { ...prev, coverImage: response.objectPath } : null);
      } else if (type === 'portfolio') {
        const newImages = [...(profileData?.portfolioImages || []), uploadUrl];
        setProfileData(prev => prev ? { ...prev, portfolioImages: newImages } : null);
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({ title: "Image uploaded successfully!", variant: "default" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    }
  };

  const handleVideoUpload = async (result: UploadResult, type: 'profile' | 'portfolio') => {
    if (!result.successful[0]) return;
    
    const uploadUrl = result.successful[0].uploadURL;
    
    if (type === 'profile') {
      setProfileData(prev => prev ? { ...prev, profileVideo: uploadUrl } : null);
    } else {
      const newVideos = [...(profileData?.portfolioVideos || []), uploadUrl];
      setProfileData(prev => prev ? { ...prev, portfolioVideos: newVideos } : null);
    }
    
    toast({ title: "Video uploaded successfully!", variant: "default" });
  };

  // Get upload parameters
  const getUploadParameters = async () => {
    const response = await apiRequest('/api/objects/upload', { method: 'POST' });
    return { method: 'PUT' as const, url: response.uploadURL };
  };

  const addTag = (type: string, value: string) => {
    if (!value.trim() || !profileData) return;
    
    const updatedData = { ...profileData };
    switch (type) {
      case 'skill':
        updatedData.skillTags = [...(updatedData.skillTags || []), value.trim()];
        setNewSkill('');
        break;
      case 'interest':
        updatedData.interests = [...(updatedData.interests || []), value.trim()];
        setNewInterest('');
        break;
      case 'language':
        updatedData.languages = [...(updatedData.languages || []), value.trim()];
        setNewLanguage('');
        break;
      case 'badge':
        updatedData.customBadges = [...(updatedData.customBadges || []), value.trim()];
        setNewBadge('');
        break;
    }
    setProfileData(updatedData);
  };

  const removeTag = (type: string, index: number) => {
    if (!profileData) return;
    
    const updatedData = { ...profileData };
    switch (type) {
      case 'skill':
        updatedData.skillTags?.splice(index, 1);
        break;
      case 'interest':
        updatedData.interests?.splice(index, 1);
        break;
      case 'language':
        updatedData.languages?.splice(index, 1);
        break;
      case 'badge':
        updatedData.customBadges?.splice(index, 1);
        break;
    }
    setProfileData(updatedData);
  };

  const handleSave = () => {
    if (profileData) {
      updateProfileMutation.mutate(profileData);
    }
  };

  if (isLoading || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const socialPlatforms = [
    { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/c/username' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Enhanced Profile Editor
            </h1>
            <p className="text-slate-300 mt-2">Customize every aspect of your digital presence</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 border border-cyan-500/20">
            <TabsTrigger value="basic" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <User className="w-4 h-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Camera className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Globe className="w-4 h-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Award className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="ai-enhance" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Enhancement
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Code className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <User className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-slate-200">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.displayName || ''}
                    onChange={(e) => setProfileData(prev => prev ? { ...prev, displayName: e.target.value } : null)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <Input
                    id="email"
                    value={profileData.email || ''}
                    disabled
                    className="bg-slate-900/50 border-slate-700 text-slate-400"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio" className="text-slate-200">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio || ''}
                    onChange={(e) => setProfileData(prev => prev ? { ...prev, bio: e.target.value } : null)}
                    className="bg-slate-900/50 border-slate-700 text-white min-h-[100px]"
                    placeholder="Tell the world about yourself..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-200">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location || ''}
                    onChange={(e) => setProfileData(prev => prev ? { ...prev, location: e.target.value } : null)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-slate-200">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website || ''}
                    onChange={(e) => setProfileData(prev => prev ? { ...prev, website: e.target.value } : null)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="https://your-website.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-200">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company || ''}
                    onChange={(e) => setProfileData(prev => prev ? { ...prev, company: e.target.value } : null)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-slate-200">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profileData.occupation || ''}
                    onChange={(e) => setProfileData(prev => prev ? { ...prev, occupation: e.target.value } : null)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="Your job title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pronouns" className="text-slate-200">Pronouns</Label>
                  <Select 
                    value={profileData.pronouns || ''} 
                    onValueChange={(value) => setProfileData(prev => prev ? { ...prev, pronouns: value } : null)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select pronouns" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="he/him">he/him</SelectItem>
                      <SelectItem value="she/her">she/her</SelectItem>
                      <SelectItem value="they/them">they/them</SelectItem>
                      <SelectItem value="xe/xir">xe/xir</SelectItem>
                      <SelectItem value="custom">other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-slate-200">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profileData.timezone || ''}
                    onChange={(e) => setProfileData(prev => prev ? { ...prev, timezone: e.target.value } : null)}
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="UTC-8, EST, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Gallery */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Camera className="w-5 h-5 mr-2" />
                    Profile Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        {profileData.profileImage ? (
                          <img 
                            src={profileData.profileImage} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
                            onError={(e) => {
                              console.log('Profile image failed to load:', profileData.profileImage);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border-2 border-cyan-400">
                            <User className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={5 * 1024 * 1024} // 5MB
                        onGetUploadParameters={async () => {
                          try {
                            const response = await fetch('/api/objects/upload', {
                              method: 'POST',
                              headers: { 
                                'Content-Type': 'application/json'
                              },
                              credentials: 'include'
                            });
                            
                            if (!response.ok) {
                              throw new Error(`Failed to get upload URL: ${response.status}`);
                            }
                            
                            const { uploadURL } = await response.json();
                            return { method: 'PUT' as const, url: uploadURL };
                          } catch (error) {
                            console.error("Upload URL error:", error);
                            throw error;
                          }
                        }}
                        onComplete={async (result) => {
                          try {
                            if (result.successful[0]) {
                              const imageUrl = result.successful[0].uploadURL;
                              
                              // Update profile media via backend API
                              const response = await fetch('/api/profile-media', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                  mediaURL: imageUrl,
                                  mediaType: 'profileImage'
                                })
                              });

                              if (response.ok) {
                                const { objectPath } = await response.json();
                                // Update local profile state immediately
                                setProfileData(prev => prev ? { ...prev, profileImage: imageUrl } : null);
                                // Also refresh profile data from server
                                queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
                                
                                toast({
                                  title: "Profile Picture Updated",
                                  description: "Your profile picture has been updated successfully",
                                });
                              } else {
                                throw new Error('Failed to update profile');
                              }
                            }
                          } catch (error) {
                            console.error("Profile update error:", error);
                            toast({
                              title: "Update Failed",
                              description: "Failed to update your profile picture",
                              variant: "destructive",
                            });
                          }
                        }}
                        accept="image/*"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Profile Picture
                      </ObjectUploader>
                    </div>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="space-y-2">
                    <Label className="text-slate-200">Cover Image</Label>
                    <div className="space-y-2">
                      <div className="relative w-full h-32">
                        {profileData.coverImage ? (
                          <img 
                            src={profileData.coverImage} 
                            alt="Cover" 
                            className="w-full h-32 rounded-lg object-cover border border-cyan-400"
                            onError={(e) => {
                              console.log('Cover image failed to load:', profileData.coverImage);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-32 rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center">
                            <Camera className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={10 * 1024 * 1024} // 10MB
                        onGetUploadParameters={async () => {
                          try {
                            const response = await fetch('/api/objects/upload', {
                              method: 'POST',
                              headers: { 
                                'Content-Type': 'application/json'
                              },
                              credentials: 'include'
                            });
                            
                            if (!response.ok) {
                              throw new Error(`Failed to get upload URL: ${response.status}`);
                            }
                            
                            const { uploadURL } = await response.json();
                            return { method: 'PUT' as const, url: uploadURL };
                          } catch (error) {
                            console.error("Upload URL error:", error);
                            throw error;
                          }
                        }}
                        onComplete={async (result) => {
                          try {
                            if (result.successful[0]) {
                              const imageUrl = result.successful[0].uploadURL;
                              
                              // Update profile media via backend API
                              const response = await fetch('/api/profile-media', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                  mediaURL: imageUrl,
                                  mediaType: 'coverImage'
                                })
                              });

                              if (response.ok) {
                                const { objectPath } = await response.json();
                                // Update local profile state immediately  
                                setProfileData(prev => prev ? { ...prev, coverImage: imageUrl } : null);
                                // Also refresh profile data from server
                                queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
                                
                                toast({
                                  title: "Cover Image Updated",
                                  description: "Your cover image has been updated successfully",
                                });
                              } else {
                                throw new Error('Failed to update profile');
                              }
                            }
                          } catch (error) {
                            console.error("Profile update error:", error);
                            toast({
                              title: "Update Failed",
                              description: "Failed to update your cover image",
                              variant: "destructive",
                            });
                          }
                        }}
                        accept="image/*"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Cover Image
                      </ObjectUploader>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Video className="w-5 h-5 mr-2" />
                    Video Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Profile Video</Label>
                    <Input
                      value={profileData.profileVideo || ''}
                      onChange={(e) => setProfileData(prev => prev ? { ...prev, profileVideo: e.target.value } : null)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="Video URL or upload"
                    />
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={50 * 1024 * 1024} // 50MB
                      onGetUploadParameters={getUploadParameters}
                      onComplete={(result) => handleVideoUpload(result, 'profile')}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Upload Profile Video
                    </ObjectUploader>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="space-y-2">
                    <Label className="text-slate-200">Background Music</Label>
                    <Input
                      value={profileData.profileMusic || ''}
                      onChange={(e) => setProfileData(prev => prev ? { ...prev, profileMusic: e.target.value } : null)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="Music URL (Spotify, YouTube, etc.)"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Gallery */}
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Portfolio Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profileData.portfolioImages?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Portfolio ${index + 1}`} 
                        className="w-full h-24 object-cover rounded border border-slate-700"
                      />
                      <button
                        onClick={() => {
                          const newImages = [...(profileData.portfolioImages || [])];
                          newImages.splice(index, 1);
                          setProfileData(prev => prev ? { ...prev, portfolioImages: newImages } : null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  <ObjectUploader
                    maxNumberOfFiles={5}
                    maxFileSize={10 * 1024 * 1024}
                    onGetUploadParameters={getUploadParameters}
                    onComplete={(result) => handleImageUpload(result, 'portfolio')}
                    buttonClassName="w-full h-24 border-2 border-dashed border-slate-600 hover:border-cyan-400 rounded flex items-center justify-center"
                  >
                    <Plus className="w-8 h-8 text-slate-500" />
                  </ObjectUploader>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links */}
          <TabsContent value="social" className="space-y-6">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Globe className="w-5 h-5 mr-2" />
                  Social Media Links
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map(({ key, label, icon: Icon, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-slate-200 flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </Label>
                    <Input
                      value={profileData.socialLinks?.[key] || ''}
                      onChange={(e) => setProfileData(prev => prev ? {
                        ...prev,
                        socialLinks: { ...prev.socialLinks, [key]: e.target.value }
                      } : null)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills & Interests */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Award className="w-5 h-5 mr-2" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData.skillTags?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {skill}
                        <button onClick={() => removeTag('skill', index)} className="ml-1 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add skill..."
                      className="bg-slate-900/50 border-slate-700 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addTag('skill', newSkill)}
                    />
                    <Button onClick={() => addTag('skill', newSkill)} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Heart className="w-5 h-5 mr-2" />
                    Interests & Hobbies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests?.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {interest}
                        <button onClick={() => removeTag('interest', index)} className="ml-1 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add interest..."
                      className="bg-slate-900/50 border-slate-700 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addTag('interest', newInterest)}
                    />
                    <Button onClick={() => addTag('interest', newInterest)} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Languages className="w-5 h-5 mr-2" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData.languages?.map((language, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-400 border border-green-500/30">
                        {language}
                        <button onClick={() => removeTag('language', index)} className="ml-1 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add language..."
                      className="bg-slate-900/50 border-slate-700 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addTag('language', newLanguage)}
                    />
                    <Button onClick={() => addTag('language', newLanguage)} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Star className="w-5 h-5 mr-2" />
                    Custom Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData.customBadges?.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        {badge}
                        <button onClick={() => removeTag('badge', index)} className="ml-1 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder="Add custom badge..."
                      className="bg-slate-900/50 border-slate-700 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addTag('badge', newBadge)}
                    />
                    <Button onClick={() => addTag('badge', newBadge)} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Theme Customization */}
          <TabsContent value="theme" className="space-y-6">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Palette className="w-5 h-5 mr-2" />
                  Visual Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Theme</Label>
                    <Select 
                      value={profileData.customization?.theme || 'cyberpunk'}
                      onValueChange={(value) => setProfileData(prev => prev ? {
                        ...prev,
                        customization: { ...prev.customization, theme: value }
                      } : null)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                        <SelectItem value="neon">Neon</SelectItem>
                        <SelectItem value="matrix">Matrix</SelectItem>
                        <SelectItem value="holographic">Holographic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Accent Color</Label>
                    <Input
                      type="color"
                      value={profileData.customization?.accentColor || '#00ffe1'}
                      onChange={(e) => setProfileData(prev => prev ? {
                        ...prev,
                        customization: { ...prev.customization, accentColor: e.target.value }
                      } : null)}
                      className="h-12 bg-slate-900/50 border-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Display Mode</Label>
                    <Select 
                      value={profileData.customization?.displayMode || 'professional'}
                      onValueChange={(value) => setProfileData(prev => prev ? {
                        ...prev,
                        customization: { ...prev.customization, displayMode: value }
                      } : null)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Profile Layout</Label>
                    <Select 
                      value={profileData.customization?.profileLayout || 'grid'}
                      onValueChange={(value) => setProfileData(prev => prev ? {
                        ...prev,
                        customization: { ...prev.customization, profileLayout: value }
                      } : null)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="grid">Grid Layout</SelectItem>
                        <SelectItem value="list">List Layout</SelectItem>
                        <SelectItem value="cards">Card Layout</SelectItem>
                        <SelectItem value="timeline">Timeline Layout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Status Message</Label>
                    <Input
                      value={profileData.customization?.statusMessage || ''}
                      onChange={(e) => setProfileData(prev => prev ? {
                        ...prev,
                        customization: { ...prev.customization, statusMessage: e.target.value }
                      } : null)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="What's your current status?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Favorite Quote</Label>
                    <Textarea
                      value={profileData.customization?.favoriteQuote || ''}
                      onChange={(e) => setProfileData(prev => prev ? {
                        ...prev,
                        customization: { ...prev.customization, favoriteQuote: e.target.value }
                      } : null)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="Share your favorite quote..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">Animations Enabled</Label>
                      <Switch 
                        checked={profileData.customization?.animationsEnabled !== false}
                        onCheckedChange={(checked) => setProfileData(prev => prev ? {
                          ...prev,
                          customization: { ...prev.customization, animationsEnabled: checked }
                        } : null)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">Particle Effects</Label>
                      <Switch 
                        checked={profileData.customization?.particleEffects !== false}
                        onCheckedChange={(checked) => setProfileData(prev => prev ? {
                          ...prev,
                          customization: { ...prev.customization, particleEffects: checked }
                        } : null)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">Show Activity Feed</Label>
                      <Switch 
                        checked={profileData.customization?.showActivityFeed !== false}
                        onCheckedChange={(checked) => setProfileData(prev => prev ? {
                          ...prev,
                          customization: { ...prev.customization, showActivityFeed: checked }
                        } : null)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">Show Stats Publicly</Label>
                      <Switch 
                        checked={profileData.customization?.showStatsPublic !== false}
                        onCheckedChange={(checked) => setProfileData(prev => prev ? {
                          ...prev,
                          customization: { ...prev.customization, showStatsPublic: checked }
                        } : null)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">Allow Direct Messages</Label>
                      <Switch 
                        checked={profileData.customization?.allowDirectMessages !== false}
                        onCheckedChange={(checked) => setProfileData(prev => prev ? {
                          ...prev,
                          customization: { ...prev.customization, allowDirectMessages: checked }
                        } : null)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Enhancement */}
          <TabsContent value="ai-enhance" className="space-y-6">
            <AIBackgroundEnhancer
              originalImage={profileData.profileImage || ''}
              onEnhancedImage={(enhancedImageUrl) => {
                // Update the profile image with the enhanced version
                setProfileData(prev => prev ? { ...prev, profileImage: enhancedImageUrl } : null);
                queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
                toast({
                  title: "Profile Enhanced!",
                  description: "Your profile picture has been enhanced with AI",
                });
              }}
            />
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Code className="w-5 h-5 mr-2" />
                  Advanced Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Custom CSS</Label>
                  <p className="text-sm text-slate-400">Add custom CSS to personalize your profile further (advanced users only)</p>
                  <Textarea
                    value={profileData.customCSS || ''}
                    onChange={(e) => setProfileData(prev => prev ? { ...prev, customCSS: e.target.value } : null)}
                    className="bg-slate-900/50 border-slate-700 text-white font-mono min-h-[200px]"
                    placeholder="/* Your custom CSS here */
.profile-container {
  background: linear-gradient(45deg, #00ffe1, #ff00d4);
}

.custom-badge {
  animation: pulse 2s infinite;
}"
                  />
                </div>
                
                <Separator className="bg-slate-700" />
                
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Settings className="w-5 h-5 text-yellow-400 mr-2" />
                    <h3 className="font-semibold text-yellow-400">Advanced Features</h3>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Custom CSS will be applied to your profile page</li>
                    <li>• All changes are saved permanently to the database</li>
                    <li>• Media files are stored securely in object storage</li>
                    <li>• Profile data is backed up automatically</li>
                    <li>• Theme changes apply instantly across all devices</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}