import React from "react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Crown, Shield, Zap } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredTier?: string;
  requiredPermission?: string;
  fallbackPath?: string;
  showUpgradeOption?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredTier,
  requiredPermission,
  fallbackPath = "/login",
  showUpgradeOption = true
}: ProtectedRouteProps) {
  const { isAuthenticated, user, hasRole, hasTier, hasPermission } = useUnifiedAuth();
  const [, setLocation] = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-slate-800/50 border-purple-500/30">
          <CardContent className="pt-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
            <p className="text-slate-400 mb-6">
              Please sign in to access GUARDIANCHAIN services
            </p>
            <Button 
              onClick={() => setLocation(fallbackPath)}
              className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
            >
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    const roleIcons = {
      ADMIN: Shield,
      COMMANDER: Crown,
      FOUNDER: Crown,
      MASTER_ADMIN: Crown
    };
    const IconComponent = roleIcons[requiredRole as keyof typeof roleIcons] || Shield;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-slate-800/50 border-red-500/30">
          <CardContent className="pt-6 text-center">
            <IconComponent className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Access Denied</h3>
            <p className="text-slate-400 mb-4">
              Required role: <span className="text-red-400 font-semibold">{requiredRole}</span>
            </p>
            <p className="text-slate-400 mb-6">
              Your current role: <span className="text-blue-400 font-semibold">{user?.role}</span>
            </p>
            <Button 
              onClick={() => setLocation("/dashboard")}
              variant="outline"
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check tier requirement
  if (requiredTier && !hasTier(requiredTier)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-slate-800/50 border-yellow-500/30">
          <CardContent className="pt-6 text-center">
            <Zap className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Upgrade Required</h3>
            <p className="text-slate-400 mb-4">
              Required tier: <span className="text-yellow-400 font-semibold">{requiredTier}</span>
            </p>
            <p className="text-slate-400 mb-6">
              Your current tier: <span className="text-blue-400 font-semibold">{user?.tier}</span>
            </p>
            {showUpgradeOption && (
              <div className="space-y-3">
                <Button 
                  onClick={() => setLocation("/upgrade")}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                >
                  Upgrade Now
                </Button>
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  variant="outline"
                  className="w-full"
                >
                  Return to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-slate-800/50 border-red-500/30">
          <CardContent className="pt-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Permission Denied</h3>
            <p className="text-slate-400 mb-4">
              Required permission: <span className="text-red-400 font-semibold">{requiredPermission}</span>
            </p>
            <p className="text-slate-400 mb-6">
              Contact your administrator for access
            </p>
            <Button 
              onClick={() => setLocation("/dashboard")}
              variant="outline"
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed - render children
  return <>{children}</>;
}

// Convenience components for specific access levels
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      {children}
    </ProtectedRoute>
  );
}

export function CommanderRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="COMMANDER">
      {children}
    </ProtectedRoute>
  );
}

export function FounderRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="FOUNDER">
      {children}
    </ProtectedRoute>
  );
}

export function MasterAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="MASTER_ADMIN">
      {children}
    </ProtectedRoute>
  );
}

export function CreatorTierRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredTier="CREATOR">
      {children}
    </ProtectedRoute>
  );
}

export function SovereignTierRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredTier="SOVEREIGN">
      {children}
    </ProtectedRoute>
  );
}