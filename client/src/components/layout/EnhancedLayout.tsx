import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/components/ui/notification-system";
import InteractiveBackground from "@/components/ui/interactive-background";
// import EnhancedNavigation from "@/components/navigation/EnhancedNavigation"; // DISABLED TO FIX LAYOUT
import FloatingActionMenu from "@/components/layout/FloatingActionMenu";
import { LiveTokenTracker } from "@/components/live/LiveTokenTracker";
import { cn } from "@/lib/utils";

interface EnhancedLayoutProps {
  children: React.ReactNode;
  variant?: "default" | "minimal" | "dashboard" | "auth";
  showNavigation?: boolean;
  showBackground?: boolean;
  className?: string;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({
  children,
  variant = "default",
  showNavigation = true,
  showBackground = true,
  className
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Layout variants
  const variants = {
    default: {
      background: "bg-gradient-to-br from-slate-900 via-purple-900/50 to-black",
      container: "min-h-screen",
      content: "flex-1"
    },
    minimal: {
      background: "bg-black",
      container: "min-h-screen",
      content: "flex-1"
    },
    dashboard: {
      background: "bg-gradient-to-br from-slate-900 via-blue-900/30 to-black",
      container: "min-h-screen flex",
      content: "flex-1 overflow-hidden"
    },
    auth: {
      background: "bg-gradient-to-br from-purple-900 via-cyan-900/50 to-black",
      container: "min-h-screen flex items-center justify-center",
      content: "w-full max-w-md"
    }
  };

  const config = variants[variant];

  // Route-based metadata
  const getPageMetadata = () => {
    const routes: Record<string, { title: string; description: string }> = {
      "/": {
        title: "GuardianChain - Sovereign Memory Infrastructure",
        description: "Preserve your truth. Earn yield. Own your story forever with blockchain-powered memory sovereignty."
      },
      "/dashboard": {
        title: "Dashboard - GuardianChain",
        description: "Manage your truth capsules, track GTT yield, and explore your sovereign memory vault."
      },
      "/profile": {
        title: "Profile - GuardianChain",
        description: "Your sovereign profile with truth genome, capsule collections, and verification status."
      },
      "/create": {
        title: "Create Capsule - GuardianChain",
        description: "Seal your truth in an immutable capsule and mint it as an NFT on the blockchain."
      },
      "/vault": {
        title: "Truth Vault - GuardianChain",
        description: "Explore your sealed memories and earn yield from your truth contributions."
      }
    };

    return routes[location] || routes["/"];
  };

  const metadata = getPageMetadata();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className={cn(config.background, config.container, className)}>
        <Helmet>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <meta property="og:title" content={metadata.title} />
          <meta property="og:description" content={metadata.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://guardianchain.app${location}`} />
          <meta property="og:image" content="https://guardianchain.app/assets/og-image.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@GuardianChain" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>

        {/* Interactive Background */}
        {showBackground && (
          <div className="fixed inset-0 z-0">
            <InteractiveBackground />
          </div>
        )}

        {/* Navigation - DISABLED TO FIX LAYOUT */}
        {/* {showNavigation && isAuthenticated && (
          <EnhancedNavigation />
        )} */}

        {/* Live Token Tracker */}
        {isAuthenticated && variant !== "auth" && (
          <LiveTokenTracker position="top-right" />
        )}

        {/* Main Content */}
        <main className={cn("relative z-10", config.content)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Floating Action Menu */}
        {isAuthenticated && variant !== "auth" && (
          <FloatingActionMenu />
        )}

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </NotificationProvider>
  );
};

export default EnhancedLayout;