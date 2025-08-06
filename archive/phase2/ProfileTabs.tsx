import { Button } from "@/components/ui/button";
import { FileText, Image, Users, Trophy, Activity, Settings } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOwnProfile?: boolean;
}

export default function ProfileTabs({ activeTab, setActiveTab, isOwnProfile = false }: ProfileTabsProps) {
  const tabs = [
    {
      id: "capsules",
      label: "Capsules",
      icon: FileText,
      description: "Truth capsules and memories"
    },
    {
      id: "media",
      label: "Media",
      icon: Image,
      description: "Media uploads and AI recall"
    },
    {
      id: "friends",
      label: "Friends",
      icon: Users,
      description: "Guardian connections"
    },
    {
      id: "badges",
      label: "Badges",
      icon: Trophy,
      description: "Achievements and honors"
    },
    {
      id: "activity",
      label: "Activity",
      icon: Activity,
      description: "Recent platform activity"
    }
  ];

  if (isOwnProfile) {
    tabs.push({
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Profile preferences"
    });
  }

  return (
    <div className="border-b border-brand-surface">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all
                ${isActive 
                  ? "bg-brand-primary text-white border-brand-primary" 
                  : "text-brand-light/70 hover:text-brand-light border-transparent hover:bg-brand-surface"
                }
              `}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}