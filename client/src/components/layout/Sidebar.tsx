import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  FileText, 
  Play, 
  TrendingUp, 
  Users, 
  Settings,
  Shield,
  Crown,
  Zap
} from "lucide-react";

interface Route {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
}

const routes: Route[] = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    roles: ["guest", "member", "moderator", "admin", "dao-owner"] 
  },
  { 
    name: "Admin Panel", 
    href: "/admin", 
    icon: Settings,
    roles: ["admin", "dao-owner"],
    badge: "ADMIN" 
  },
  { 
    name: "Capsules", 
    href: "/vault", 
    icon: FileText,
    roles: ["guest", "member", "moderator", "admin", "dao-owner"] 
  },
  { 
    name: "Create", 
    href: "/create", 
    icon: Zap,
    roles: ["member", "moderator", "admin", "dao-owner"] 
  },
  { 
    name: "Staking", 
    href: "/staking", 
    icon: TrendingUp,
    roles: ["member", "moderator", "admin", "dao-owner"] 
  },
  { 
    name: "DAO Governance", 
    href: "/dao", 
    icon: Crown,
    roles: ["dao-owner"],
    badge: "DAO" 
  },
  { 
    name: "Validator", 
    href: "/validator", 
    icon: Shield,
    roles: ["moderator", "admin", "dao-owner"],
    badge: "MOD+" 
  }
];

const tierHierarchy = {
  'guest': 0,
  'member': 1,
  'moderator': 2,
  'admin': 3,
  'dao-owner': 4
};

interface SidebarProps {
  userTier?: string;
}

const Sidebar = ({ userTier }: SidebarProps) => {
  const { user } = useAuth();
  
  // Determine user tier from auth or props
  const currentTier = userTier || (user as any)?.tier?.toLowerCase() || 'guest';
  const currentTierLevel = tierHierarchy[currentTier as keyof typeof tierHierarchy] ?? 0;

  // Filter routes based on user permissions
  const availableRoutes = routes.filter(route => {
    return route.roles.some(role => {
      const roleLevel = tierHierarchy[role as keyof typeof tierHierarchy] ?? 0;
      return currentTierLevel >= roleLevel;
    });
  });

  return (
    <aside className="w-64 bg-slate-800/50 border-r border-slate-700 hidden md:block min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">GuardianChain</h1>
            <p className="text-xs text-slate-400">Truth Vault Platform</p>
          </div>
        </div>
        
        {/* User info */}
        <div className="mb-6 p-3 bg-slate-700/50 rounded-lg">
          <div className="text-sm font-medium text-white">
            {(user as any)?.firstName || 'Debug'} {(user as any)?.lastName || 'User'}
          </div>
          <div className="text-xs text-slate-400">
            {(user as any)?.email || 'debug@guardianchain.app'}
          </div>
          <Badge variant="outline" className="mt-2 text-xs">
            {currentTier.toUpperCase()}
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {availableRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <Link key={route.name} href={route.href}>
                <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors group cursor-pointer">
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
                  <span className="font-medium">{route.name}</span>
                  {route.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {route.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Tier upgrade prompt for lower tiers */}
        {currentTierLevel < 2 && (
          <div className="mt-8 p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
            <h3 className="text-sm font-semibold text-purple-200 mb-2">
              Unlock More Features
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Upgrade your tier to access advanced tools and higher yields
            </p>
            <Link href="/tier-access">
              <div className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition-colors cursor-pointer inline-block">
                View Tiers
              </div>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;