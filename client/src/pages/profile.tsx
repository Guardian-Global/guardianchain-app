import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedProfile from "@/components/profile/UnifiedProfile";
import ProfileMediaSection from "@/components/profile/ProfileMediaSection";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Image as ImageIcon, 
  FileText, 
  Activity
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-brand-surface max-w-md mx-auto">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="profile-tab"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
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

          <TabsContent value="media" className="space-y-6">
            <ProfileMediaSection userId={user?.id || "dev-user-123"} />
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
