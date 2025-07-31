import { useEffect } from "react";
import { getUserTier } from "@/utils/getUserTier";

// Actual Replit Auth imports (uncomment when implementing)
// import { useAuth } from "@replit/extensions";

export default function LoginPage() {
  // Mock implementation - replace with actual Replit Auth
  // const { user, isLoading, login } = useAuth();
  const user = null;
  const isLoading = false;
  const login = () => {
    console.log('Initiating Replit Auth login...');
    // For now, redirect to existing auth system
    window.location.href = '/api/login';
  };

  useEffect(() => {
    if (!user && !isLoading) {
      login();
    } else if (user) {
      const tier = getUserTier(user);
      if (tier === "admin") window.location.href = "/command";
      else if (tier === "pro") window.location.href = "/dashboard";
      else window.location.href = "/vault";
    }
  }, [user, isLoading, login]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center pt-20 text-lg text-slate-300">
        Redirecting you based on your access tier...
      </div>
    </div>
  );
}