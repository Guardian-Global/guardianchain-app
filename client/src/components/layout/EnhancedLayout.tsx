import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import TopbarCommandMenu from "./TopbarCommandMenu";
import MobileDrawer from "./MobileDrawer";
import CommandPalette from "./CommandPalette";
import MobileNav from "./MobileNav";
import CapsuleDrawer from "@/components/ui/CapsuleDrawer";
import QuickActions from "./QuickActions";
import StatusIndicator from "./StatusIndicator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EnhancedLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showCommandPalette?: boolean;
  showBreadcrumbs?: boolean;
  showCapsuleDrawer?: boolean;
  showQuickActions?: boolean;
  showStatusIndicator?: boolean;
}

const EnhancedLayout = ({ 
  children, 
  showSidebar = true, 
  showCommandPalette = true,
  showBreadcrumbs = true,
  showCapsuleDrawer = true,
  showQuickActions = true,
  showStatusIndicator = true
}: EnhancedLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Don't show enhanced layout for unauthenticated users
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <title>GuardianChain - Sovereign Memory Infrastructure</title>
      <meta name="description" content="Store, verify, and yield from your most important memories. Powered by SealChain and Veritas." />
      <meta property="og:title" content="GuardianChain" />
      <meta property="og:image" content="/og-image.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="flex">
          {/* Desktop Sidebar */}
          {showSidebar && <Sidebar />}

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top Header with Command Menu */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
              <div className="flex-1">
                <TopbarCommandMenu />
              </div>
            </div>
            
            {/* Breadcrumbs */}
            {showBreadcrumbs && <Breadcrumbs />}
            
            <main className="flex-1 overflow-x-hidden p-6">
              {children}
            </main>
          </div>
        </div>

        {/* Floating Components */}
        {showCommandPalette && <CommandPalette />}
        {showCapsuleDrawer && <CapsuleDrawer />}
        {showQuickActions && <QuickActions />}
        {showStatusIndicator && <StatusIndicator />}
      </div>
    </>
  );
};

export default EnhancedLayout;