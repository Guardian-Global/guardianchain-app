import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MasterProfile from "@/components/MasterProfile";
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
            <MasterProfile 
              profile={{
                id: user?.id || "dev-user-123",
                wallet: "0x1234...abcd",
                username: user?.username || "Guardian",
                displayName: user?.name || "Guardian User",
                bio: "Guardian of Truth in the digital realm",
                avatar: user?.profileImageUrl || "/guardian-mascot.png",
                truthScore: 88,
                reputation: 2450,
                joinedAt: "2024-01-15",
                isVerified: true,
                badges: 12,
                capsuleCount: 47,
                friendCount: 234,
                gttEarned: 12850,
                totalViews: 5670,
                recentActivity: 15
              }}
              capsuleStats={{
                totalCapsules: 47,
                verifiedCapsules: 42,
                timeSealedCapsules: 8,
                weeklyActivity: 12,
                avgTruthScore: 85,
                totalGTT: 12850,
                totalViews: 5670,
                engagementRate: 78
              }}
              isOwnProfile={true}
            />
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
