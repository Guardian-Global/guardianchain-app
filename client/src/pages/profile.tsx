import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedProfile from "@/components/profile/UnifiedProfile";
import ProfileMediaSection from "@/components/profile/ProfileMediaSection";
import VeritasBadgeSection from "@/components/profile/VeritasBadgeSection";
import ProfileCapsulesView from "@/components/profile/ProfileCapsulesView";
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
  const { user } = useAuth();
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
            <UnifiedProfile />
          </TabsContent>

          <TabsContent value="capsules" className="space-y-6">
            <ProfileCapsulesView 
              userId={user?.id || "dev-user-123"} 
              isOwnProfile={true}
            />
          </TabsContent>

          <TabsContent value="lineage" className="space-y-6">
            <div className="bg-slate-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Capsule Lineage Network</h3>
              <p className="text-slate-400 mb-6">
                Interactive visualization of your capsule relationships, verification trails, and DAO certifications.
              </p>
              <ProfileCapsulesView 
                userId={user?.id || "dev-user-123"} 
                isOwnProfile={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <ProfileMediaSection userId={user?.id || "dev-user-123"} />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <VeritasBadgeSection userId={user?.id || "dev-user-123"} />
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
