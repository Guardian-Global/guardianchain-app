import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EnhancedLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showCommandPalette?: boolean;
}

const EnhancedLayout = ({ 
  children, 
  showSidebar = true, 
  showCommandPalette = true 
}: EnhancedLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Don't show enhanced layout for unauthenticated users
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="flex">
        {/* Desktop Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h1 className="font-bold text-xl text-white">GuardianChain</h1>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="overflow-y-auto">
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Topbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      {/* Command Palette */}
      {showCommandPalette && <CommandPalette />}
    </div>
  );
};

export default EnhancedLayout;