import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileMaster from "@/components/ProfileMaster";
// Components consolidated during Phase 2 cleanup
// ProfileCapsulesView consolidated into MasterProfile
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Image as ImageIcon, 
  FileText, 
  Activity,
  Shield,
  Archive,
  GitBranch
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Auth protection
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-brand-text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="w-16 h-16 text-brand-accent mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-brand-text-muted mb-6">Please log in to access your profile</p>
          <button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-brand-accent text-brand-dark px-6 py-2 rounded-lg hover:bg-brand-accent/90 transition-colors"
            data-testid="login-button"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-brand-surface max-w-4xl mx-auto">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="profile-tab"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="capsules" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="capsules-tab"
            >
              <Archive className="w-4 h-4 mr-2" />
              Capsules
            </TabsTrigger>
            <TabsTrigger 
              value="lineage" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="lineage-tab"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Lineage
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="media-tab"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger 
              value="badges" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="badges-tab"
            >
              <Shield className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="activity-tab"
            >
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileMaster />
          </TabsContent>

          <TabsContent value="capsules" className="space-y-6">
            <div className="text-center py-12 text-hsl(215,25%,65%)">
              <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Capsule view consolidated into Profile tab</p>
            </div>
          </TabsContent>

          <TabsContent value="lineage" className="space-y-6">
            <div className="bg-slate-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Capsule Lineage Network</h3>
              <p className="text-slate-400 mb-6">
                Interactive visualization of your capsule relationships, verification trails, and DAO certifications.
              </p>
              <div className="text-center py-12 text-hsl(215,25%,65%)">
                <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Lineage visualization consolidated into Profile tab</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="text-center py-12 text-hsl(215,25%,65%)">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Media section consolidated into Profile tab</p>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="text-center py-12 text-hsl(215,25%,65%)">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Badge section consolidated into Profile tab</p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="text-center py-8 text-brand-light/60">
              Activity timeline coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
