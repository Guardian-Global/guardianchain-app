import { useEffect, useState } from "react";
import { Lock, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Note: Replace with actual Replit Auth when available
// import { useAuth } from "@replit/extensions";

interface AuthGateProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoute?: string;
}

export default function AuthGate({ 
  allowedRoles, 
  children, 
  fallback,
  requiredRoute 
}: AuthGateProps) {
  // Mock implementation - replace with actual Replit Auth
  // const { user, isLoading } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("guest");

  useEffect(() => {
    // Mock auth check - replace with actual Replit Auth integration
    setTimeout(() => {
      // Simulate user data from Replit Auth
      const mockUser = {
        metadata: {
          tier: "guest" // This would come from actual Replit user metadata
        }
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      const tier = user?.metadata?.tier || "guest";
      setRole(tier);

      if (!allowedRoles.includes(tier) && requiredRoute) {
        // Use setTimeout to avoid direct navigation in render
        setTimeout(() => {
          window.location.href = "/upgrade";
        }, 100);
      }
    }
  }, [user, isLoading, allowedRoles, requiredRoute]);

  if (isLoading || role === "") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="text-center py-10">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <span>Access Denied</span>
          <Lock className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}