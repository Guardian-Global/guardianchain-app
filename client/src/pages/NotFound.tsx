import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function NotFound() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const tier = user?.tier?.toLowerCase() || "guest";
    
    // Role-aware redirect fallback
    setTimeout(() => {
      if (tier === "admin" || tier === "dao-owner") {
        setLocation("/admin");
      } else if (tier === "member" || tier === "moderator") {
        setLocation("/vault");
      } else {
        setLocation("/");
      }
    }, 2000);
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-sm text-gray-600">
            Redirecting you to the appropriate page based on your access level...
          </p>
        </div>
        
        <div className="text-xs text-gray-400">
          <p>GuardianChain • Truth Vault Platform</p>
          <p className="mt-1">Sovereign Memory Infrastructure</p>
        </div>
      </div>
    </div>
  );
}