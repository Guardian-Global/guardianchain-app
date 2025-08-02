import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Zap, 
  TrendingUp, 
  Shield, 
  Users,
  Bell,
  Settings,
  Search,
  Bookmark,
  Upload
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  roles: string[];
  badge?: string;
  color: string;
}

const tierHierarchy = {
  'guest': 0,
  'member': 1,
  'moderator': 2,
  'admin': 3,
  'dao-owner': 4
};

const quickActions: QuickAction[] = [
  {
    id: "create-capsule",
    label: "Create Capsule",
    icon: Plus,
    action: () => window.location.href = "/create",
    roles: ["member", "moderator", "admin", "dao-owner"],
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    id: "ai-boost",
    label: "AI Boost",
    icon: Zap,
    action: () => window.location.href = "/ai-advisor",
    roles: ["member", "moderator", "admin", "dao-owner"],
    badge: "NEW",
    color: "bg-purple-600 hover:bg-purple-700"
  },
  {
    id: "stake-gtt",
    label: "Stake GTT",
    icon: TrendingUp,
    action: () => window.location.href = "/staking",
    roles: ["member", "moderator", "admin", "dao-owner"],
    color: "bg-green-600 hover:bg-green-700"
  },
  {
    id: "validator-tools",
    label: "Validator",
    icon: Shield,
    action: () => window.location.href = "/validator",
    roles: ["moderator", "admin", "dao-owner"],
    badge: "MOD+",
    color: "bg-red-600 hover:bg-red-700"
  },
  {
    id: "governance",
    label: "DAO Vote",
    icon: Users,
    action: () => window.location.href = "/dao",
    roles: ["dao-owner"],
    badge: "DAO",
    color: "bg-yellow-600 hover:bg-yellow-700"
  }
];

const QuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  
  const currentTier = (user as any)?.tier?.toLowerCase() || 'guest';
  const currentTierLevel = tierHierarchy[currentTier as keyof typeof tierHierarchy] ?? 0;

  const availableActions = quickActions.filter(action => {
    return action.roles.some(role => {
      const roleLevel = tierHierarchy[role as keyof typeof tierHierarchy] ?? 0;
      return currentTierLevel >= roleLevel;
    });
  });

  if (availableActions.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="flex flex-col-reverse gap-3">
        {/* Quick action buttons */}
        {isExpanded && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300">
            {availableActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  onClick={action.action}
                  className={`${action.color} text-white shadow-lg relative group`}
                  size="sm"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                  {action.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 text-xs bg-white text-black"
                    >
                      {action.badge}
                    </Badge>
                  )}
                  <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {action.label}
                  </span>
                </Button>
              );
            })}
          </div>
        )}

        {/* Main toggle button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            isExpanded 
              ? 'bg-red-600 hover:bg-red-700 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;