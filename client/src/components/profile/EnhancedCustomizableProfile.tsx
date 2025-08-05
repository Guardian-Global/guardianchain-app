import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ProfileCustomizationPanels, { customThemes, layoutConfigs } from "./ProfileCustomizationPanels";
import ProfilePreviewModes from "./ProfilePreviewModes";
import {
  Settings,
  User,
  Palette,
  Eye,
  Save,
  Download,
  Upload,
  RefreshCw,
  Crown,
  Shield,
  Star,
  Trophy,
  CheckCircle,
  Globe,
  Lock,
  Users,
  Heart,
  Zap,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface ProfileData {
  id: string;
  email?: string;
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
  location?: string;
  website?: string;
  customization: {
    theme: {
      id: string;
      name: string;
      colors: Record<string, string>;
      gradients?: Record<string, string>;
      effects: Record<string, boolean>;
    };
    layout: string;
    privacy: Record<string, boolean>;
    display: Record<string, boolean>;
    social: Record<string, boolean>;
  };
  stats: {
    truthScore: number;
    gttEarned: number;
    capsulesCreated: number;
    nftCount: number;
    connections: number;
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: string;
  }>;
  socialLinks: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export default function EnhancedCustomizableProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [tempSettings, setTempSettings] = useState<Record<string, any>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery<ProfileData>({
    queryKey: ['/api/profile'],
    retry: 1
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<ProfileData>) => {
      return apiRequest('PUT', '/api/profile', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setUnsavedChanges(false);
      setTempSettings({});
      toast({
        title: "Profile Updated",
        description: "Your profile settings have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile settings.",
        variant: "destructive",
      });
    }
  });

  const handleThemeChange = (theme: any) => {
    const newCustomization = {
      ...profile?.customization,
      theme: {
        ...theme,
        gradients: theme.gradients || {
          header: `from-[${theme.colors.primary}] to-[${theme.colors.accent}]`,
          card: `from-[${theme.colors.surface}] to-[${theme.colors.background}]`,
          button: `from-[${theme.colors.primary}] to-[${theme.colors.secondary}]`
        }
      }
    };
    
    setTempSettings({
      ...tempSettings,
      customization: newCustomization
    });
    setUnsavedChanges(true);
  };

  const handleLayoutChange = (layout: any) => {
    const newCustomization = {
      ...profile?.customization,
      layout: layout.id
    };
    
    setTempSettings({
      ...tempSettings,
      customization: newCustomization
    });
    setUnsavedChanges(true);
  };

  const handleSettingChange = (category: string, setting: string, value: any) => {
    const currentCustomization = tempSettings.customization || profile?.customization || {};
    const categorySettings = currentCustomization[category] || {};
    
    const newCustomization = {
      ...currentCustomization,
      [category]: {
        ...categorySettings,
        [setting]: value
      }
    };
    
    setTempSettings({
      ...tempSettings,
      customization: newCustomization
    });
    setUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    if (profile && Object.keys(tempSettings).length > 0) {
      updateProfile.mutate({
        ...profile,
        ...tempSettings
      });
    }
  };

  const handleDiscardChanges = () => {
    setTempSettings({});
    setUnsavedChanges(false);
    toast({
      title: "Changes Discarded",
      description: "All unsaved changes have been reverted.",
    });
  };

  // Get current profile data (with temp settings applied)
  const currentProfile = profile ? {
    ...profile,
    ...tempSettings,
    customization: {
      ...profile.customization,
      ...tempSettings.customization
    }
  } : null;

  const selectedTheme = currentProfile ? 
    customThemes.find(t => t.id === currentProfile.customization.theme.id) || customThemes[0] :
    customThemes[0];

  const selectedLayout = currentProfile ?
    layoutConfigs.find(l => l.id === currentProfile.customization.layout) || layoutConfigs[0] :
    layoutConfigs[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e17] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-[#00ffe1]" />
            <span className="ml-3 text-[#f0f6fc]">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0e17] p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-red-400 mb-2">Failed to Load Profile</h2>
                <p className="text-red-300">Please try refreshing the page or contact support if the problem persists.</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                  data-testid="retry-button"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#f0f6fc] flex items-center gap-3">
              <User className="w-8 h-8 text-[#00ffe1]" />
              Enhanced Profile Customization
            </h1>
            <p className="text-[#8b949e] mt-2">
              Personalize your Guardian profile with advanced themes, layouts, and settings
            </p>
          </div>
          
          {unsavedChanges && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                Unsaved Changes
              </Badge>
              <Button
                onClick={handleDiscardChanges}
                variant="outline"
                size="sm"
                data-testid="discard-changes"
              >
                Discard
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={updateProfile.isPending}
                size="sm"
                className="bg-[#00ffe1] text-[#0a0e17] hover:bg-[#00ffe1]/90"
                data-testid="save-changes"
              >
                {updateProfile.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customization Panel */}
          <div className="lg:col-span-1">
            <ProfileCustomizationPanels
              selectedTheme={selectedTheme}
              selectedLayout={selectedLayout}
              onThemeChange={handleThemeChange}
              onLayoutChange={handleLayoutChange}
              onSettingChange={handleSettingChange}
              settings={tempSettings}
            />
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfilePreviewModes
                  profile={currentProfile}
                  mode={previewMode}
                  onModeChange={setPreviewMode}
                  isPublic={currentProfile.customization.privacy.profilePublic}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Stats Overview */}
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Profile Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00ffe1] mb-1">
                  {currentProfile.stats.truthScore}
                </div>
                <div className="text-sm text-[#8b949e]">Truth Score</div>
                <div className="w-full bg-[#21262d] rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-[#00ffe1] to-[#7c3aed] h-2 rounded-full"
                    style={{ width: `${currentProfile.stats.truthScore}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff00d4] mb-1">
                  {currentProfile.stats.gttEarned.toLocaleString()}
                </div>
                <div className="text-sm text-[#8b949e]">GTT Earned</div>
                <div className="flex items-center justify-center mt-2">
                  <Sparkles className="w-4 h-4 text-[#ff00d4]" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7c3aed] mb-1">
                  {currentProfile.stats.capsulesCreated}
                </div>
                <div className="text-sm text-[#8b949e]">Capsules</div>
                <div className="flex items-center justify-center mt-2">
                  <Shield className="w-4 h-4 text-[#7c3aed]" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00ffe1] mb-1">
                  {currentProfile.stats.nftCount}
                </div>
                <div className="text-sm text-[#8b949e]">NFTs</div>
                <div className="flex items-center justify-center mt-2">
                  <Crown className="w-4 h-4 text-[#00ffe1]" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff00d4] mb-1">
                  {currentProfile.stats.connections}
                </div>
                <div className="text-sm text-[#8b949e]">Connections</div>
                <div className="flex items-center justify-center mt-2">
                  <Users className="w-4 h-4 text-[#ff00d4]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2" data-testid="export-profile">
            <Download className="w-4 h-4" />
            Export Profile
          </Button>
          <Button variant="outline" className="flex items-center gap-2" data-testid="import-profile">
            <Upload className="w-4 h-4" />
            Import Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2" data-testid="view-public-profile">
            <ExternalLink className="w-4 h-4" />
            View Public Profile
          </Button>
          <Button variant="outline" className="flex items-center gap-2" data-testid="share-profile">
            <Globe className="w-4 h-4" />
            Share Profile
          </Button>
        </div>
      </div>
    </div>
  );
}