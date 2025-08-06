import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Shield, Lock, User, Key } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { AdvancedCard } from "@/components/ui/advanced-card";
import { useNotificationHelpers } from "@/components/ui/notification-system";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  requiredTier?: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN";
  showFallback?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  requireAuth = true,
  requiredTier,
  showFallback = true
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const { notifyWarning } = useNotificationHelpers();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      notifyWarning(
        "Authentication Required",
        "Please sign in to access this page"
      );
    }
  }, [isLoading, requireAuth, isAuthenticated, notifyWarning]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="text-gray-400">Verifying access...</p>
        </motion.div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    
    if (!showFallback) return null;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-black p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <AdvancedCard variant="glass" className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Access Required
              </h2>
              <p className="text-gray-400">
                Sign in to access your sovereign memory vault
              </p>
            </div>

            <div className="space-y-4">
              <EnhancedButton
                variant="quantum"
                size="lg"
                className="w-full"
                onClick={() => setLocation("/api/login")}
              >
                <User className="w-5 h-5 mr-2" />
                Sign In with Replit
              </EnhancedButton>

              <div className="text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure Authentication</span>
                </div>
                <p>
                  Your identity is verified through Replit's secure OAuth system.
                  No passwords required.
                </p>
              </div>
            </div>
          </AdvancedCard>
        </motion.div>
      </div>
    );
  }

  // Check tier requirements
  if (requiredTier && user?.tier) {
    const tierHierarchy = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const userTierIndex = tierHierarchy.indexOf(user.tier);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

    if (userTierIndex < requiredTierIndex) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-black p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <AdvancedCard variant="gradient" className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Tier Upgrade Required
                </h2>
                <p className="text-gray-400">
                  You need {requiredTier} tier to access this feature
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">Current Tier:</p>
                  <p className="font-semibold text-white">{user.tier}</p>
                </div>

                <EnhancedButton
                  variant="quantum"
                  size="lg"
                  className="w-full"
                  onClick={() => setLocation("/upgrade")}
                >
                  Upgrade to {requiredTier}
                </EnhancedButton>

                <EnhancedButton
                  variant="neural"
                  size="sm"
                  className="w-full"
                  onClick={() => setLocation("/dashboard")}
                >
                  Return to Dashboard
                </EnhancedButton>
              </div>
            </AdvancedCard>
          </motion.div>
        </div>
      );
    }
  }

  // Render protected content
  return <>{children}</>;
};

export default AuthGuard;