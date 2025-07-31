import { useEffect, useState } from "react";
import { Lock } from 'lucide-react';
import { getUserTierFromAuth } from '@/utils/getUserTier';

// Note: Replace with actual Replit Auth when available
// import { useAuth } from "@replit/extensions";

interface AuthGateProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGate({ 
  allowedRoles, 
  children, 
  fallback
}: AuthGateProps) {
  // Mock implementation - replace with actual Replit Auth
  // const { user, isLoading } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock auth check - replace with actual Replit Auth integration
    const checkAuth = async () => {
      // Simulate user data from Replit Auth
      const mockUser = {
        id: "mock-user-id",
        metadata: {
          tier: "guest" // This would come from actual Replit user metadata
        }
      };
      setUser(mockUser);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      const checkAccess = async () => {
        const tier = await getUserTierFromAuth(user.id);
        
        if (!allowedRoles.includes(tier)) {
          // Use setTimeout to avoid direct navigation in render
          setTimeout(() => {
            window.location.href = "/upgrade";
          }, 100);
        }
      };
      
      checkAccess();
    }
  }, [user, isLoading, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const role = getUserTier(user);

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