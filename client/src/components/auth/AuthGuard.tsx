import React from "react";
import { useCompleteAuth } from "@/hooks/useCompleteAuth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

export function AuthGuard({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath = "/unified-login"
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useCompleteAuth();
  const [, setLocation] = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-white">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    setLocation(fallbackPath);
    return null;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-red-300 mb-4">
            You need one of the following roles: {requiredRoles.join(", ")}
          </p>
          <p className="text-slate-400 text-sm">
            Your role: {user?.role || "Unknown"}
          </p>
        </div>
      </div>
    );
  }

  // Check permission requirements
  if (requiredPermissions.length > 0 && !requiredPermissions.some(permission => hasPermission(permission))) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Insufficient Permissions</h2>
          <p className="text-red-300 mb-4">
            You need one of the following permissions: {requiredPermissions.join(", ")}
          </p>
          <p className="text-slate-400 text-sm">
            Your permissions: {user?.permissions?.join(", ") || "None"}
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
}

export default AuthGuard;