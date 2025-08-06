import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  MapPin,
  Globe,
  Camera,
  Save,
  Upload,
  Edit3,
  Shield,
  Star,
  Trophy,
  Crown
} from "lucide-react";
import type { UploadResult } from "@uppy/core";

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  socialLinks: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    telegram: z.string().optional(),
    discord: z.string().optional(),
  }).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Profile {
  id: string;
  email: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  profileImage?: string;
  coverImage?: string;
  socialLinks?: Record<string, string>;
  tier: string;
  subscriptionStatus: string;
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      location: "",
      website: "",
      socialLinks: {
        twitter: "",
        linkedin: "",
        github: "",
        telegram: "",
        discord: "",
      },
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        socialLinks: {
          twitter: profile.socialLinks?.twitter || "",
          linkedin: profile.socialLinks?.linkedin || "",
          github: profile.socialLinks?.github || "",
          telegram: profile.socialLinks?.telegram || "",
          discord: profile.socialLinks?.discord || "",
        },
      });
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleProfileImageUpload = async (): Promise<{ method: "PUT"; url: string }> => {
    const response = await apiRequest("/api/objects/upload", {
      method: "POST",
    });
    return {
      method: "PUT",
      url: response.uploadURL,
    };
  };

  const handleProfileImageComplete = async (result: UploadResult) => {
    if (result.successful && result.successful[0]) {
      const uploadUrl = result.successful[0].uploadURL;
      try {
        await apiRequest("/api/profile/avatar", {
          method: "PATCH",
          body: JSON.stringify({ profileImageURL: uploadUrl }),
        });
        
        queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to update profile image",
          variant: "destructive",
        });
      }
    }
    setUploadingProfileImage(false);
  };

  const handleCoverImageComplete = async (result: UploadResult) => {
    if (result.successful && result.successful[0]) {
      const uploadUrl = result.successful[0].uploadURL;
      try {
        await apiRequest("/api/profile/cover", {
          method: "PATCH",
          body: JSON.stringify({ coverImageURL: uploadUrl }),
        });
        
        queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
        toast({
          title: "Cover Image Updated",
          description: "Your cover image has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to update cover image",
          variant: "destructive",
        });
      }
    }
    setUploadingCoverImage(false);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "ADMIN": return <Crown className="h-4 w-4" />;
      case "SOVEREIGN": return <Trophy className="h-4 w-4" />;
      case "CREATOR": return <Star className="h-4 w-4" />;
      case "SEEKER": return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "ADMIN": return "bg-gradient-to-r from-red-500 to-pink-500";
      case "SOVEREIGN": return "bg-gradient-to-r from-purple-500 to-indigo-500";
      case "CREATOR": return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "SEEKER": return "bg-gradient-to-r from-green-500 to-emerald-500";
      default: return "bg-gradient-to-r from-gray-500 to-slate-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) flex items-center justify-center">
        <div className="text-xl text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Profile Management
            </h1>
            <p className="text-gray-400 mt-2">Customize your GuardianChain identity</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className="bg-cyan-600 hover:bg-cyan-700"
            data-testid="button-edit-profile"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {/* Cover Image Section */}
        <Card className="bg-white/5 border-white/10 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
            {profile?.coverImage && (
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-4 right-4">
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={5242880} // 5MB
                onGetUploadParameters={handleProfileImageUpload}
                onComplete={handleCoverImageComplete}
                buttonClassName="bg-black/50 hover:bg-black/70 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Cover Photo
              </ObjectUploader>
            </div>
            
            {/* Profile Image */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={2097152} // 2MB
                    onGetUploadParameters={handleProfileImageUpload}
                    onComplete={handleProfileImageComplete}
                    buttonClassName="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-2"
                  >
                    <Camera className="h-4 w-4" />
                  </ObjectUploader>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="pt-20 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {profile?.displayName || "Set Your Display Name"}
                  </h2>
                  <Badge className={`${getTierColor(profile?.tier || "")} text-white`}>
                    <div className="flex items-center gap-1">
                      {getTierIcon(profile?.tier || "")}
                      {profile?.tier}
                    </div>
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile?.email}
                  </div>
                  {profile?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
                        Website
                      </a>
                    </div>
                  )}
                </div>
                {profile?.bio && (
                  <p className="text-gray-300 mt-3 max-w-2xl">{profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        {isEditing && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Edit Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Display Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                              placeholder="Your display name"
                              data-testid="input-display-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Location</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                              placeholder="Your location"
                              data-testid="input-location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                            placeholder="Tell us about yourself..."
                            rows={3}
                            data-testid="textarea-bio"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Website</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                            placeholder="https://yourwebsite.com"
                            data-testid="input-website"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="socialLinks.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Twitter</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                                placeholder="@username"
                                data-testid="input-twitter"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialLinks.linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">LinkedIn</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                                placeholder="linkedin.com/in/username"
                                data-testid="input-linkedin"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialLinks.github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">GitHub</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                                placeholder="github.com/username"
                                data-testid="input-github"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialLinks.discord"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Discord</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                                placeholder="username#1234"
                                data-testid="input-discord"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-cyan-600 hover:bg-cyan-700"
                      data-testid="button-save-profile"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-white/10 hover:bg-white/5"
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {profile?.subscriptionStatus === "active" ? "Premium" : "Free"}
                </div>
                <div className="text-sm text-gray-400">Account Status</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">0</div>
                <div className="text-sm text-gray-400">Capsules Created</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">0 GTT</div>
                <div className="text-sm text-gray-400">Total Earned</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}