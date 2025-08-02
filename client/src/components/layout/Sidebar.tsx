import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ROUTES, getRoutesForRole } from "@/lib/routes";
import { 
  LayoutDashboard, 
  FileText, 
  Play, 
  TrendingUp, 
  Users, 
  Settings,
  Shield,
  Crown,
  Zap,
  BarChart3,
  Brain,
  Clipboard,
  Code,
  Globe,
  Gift,
  Image,
  Calendar,
  Award
} from "lucide-react";

// Icon mapping for routes
const getIconForRoute = (path: string): React.ComponentType<{ className?: string }> => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "/": LayoutDashboard,
    "/vault": FileText,
    "/replay": Play,
    "/mint": Zap,
    "/dao": Crown,
    "/admin": Shield,
    "/analytics": BarChart3,
    "/moderation": Clipboard,
    "/yield": TrendingUp,
    "/insights": Brain,
    "/metadata": Clipboard,
    "/sdk": Code,
    "/settings/language": Globe,
    "/settings/account": Settings,
    "/earn": Gift,
    "/media": Image,
    "/timeline": Calendar,
    "/veritas": Award
  };
  return iconMap[path] || FileText;
};

// Badge mapping for special routes
const getBadgeForRoute = (path: string): string | undefined => {
  const badgeMap: Record<string, string> = {
    "/admin": "ADMIN",
    "/dao": "DAO",
    "/moderation": "MOD",
    "/analytics": "ADMIN",
    "/yield": "ADMIN",
    "/veritas": "LEGAL"
  };
  return badgeMap[path];
};

const getUserTier = (user: any): string => {
  if (!user) return 'guest';
  return user.tier?.toLowerCase() || 'guest';
};

export default function Sidebar() {
  const { user } = useAuth();
  const userTier = getUserTier(user);
  
  // Get accessible routes using the new routing system
  const accessibleRoutes = getRoutesForRole(userTier);

  // Group routes by category for better organization
  const coreRoutes = accessibleRoutes.filter(route => 
    ["/", "/vault", "/replay", "/mint"].includes(route.path)
  );
  
  const adminRoutes = accessibleRoutes.filter(route => 
    ["/admin", "/analytics", "/moderation", "/yield"].includes(route.path)
  );
  
  const toolRoutes = accessibleRoutes.filter(route => 
    ["/insights", "/metadata", "/sdk", "/veritas"].includes(route.path)
  );
  
  const userRoutes = accessibleRoutes.filter(route => 
    ["/earn", "/media", "/timeline", "/settings/account", "/settings/language"].includes(route.path)
  );
  
  const governanceRoutes = accessibleRoutes.filter(route => 
    ["/dao"].includes(route.path)
  );

  const renderRouteGroup = (routes: typeof accessibleRoutes, title: string) => {
    if (routes.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <ul className="space-y-1">
          {routes.map((route) => {
            const Icon = getIconForRoute(route.path);
            const badge = getBadgeForRoute(route.path);
            
            return (
              <li key={route.path}>
                <Link href={route.path}>
                  <a className="group flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">{route.label}</span>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {route.description}
                      </p>
                    </div>
                    {badge && (
                      <Badge variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    )}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">GuardianChain</h1>
        <p className="text-sm text-gray-500 mt-1">Truth Vault Platform</p>
        {user && (
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.firstName?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {userTier} Tier
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        {renderRouteGroup(coreRoutes, "Core Features")}
        {renderRouteGroup(governanceRoutes, "Governance")}
        {renderRouteGroup(adminRoutes, "Administration")}
        {renderRouteGroup(toolRoutes, "Developer Tools")}
        {renderRouteGroup(userRoutes, "User Features")}
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          <p>GuardianChain v2.0</p>
          <p className="mt-1">Sovereign Memory Infrastructure</p>
        </div>
      </div>
    </div>
  );
}