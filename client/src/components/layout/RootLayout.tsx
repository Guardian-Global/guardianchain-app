import { ReactNode } from "react";
import UnifiedNavigation from "@/components/layout/UnifiedNavigation";
import Footer from "@/components/layout/footer";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  
  // Determine user role for navigation
  const userRole = isAuthenticated && user ? user.role : "guest";
  const userTier = isAuthenticated && user ? user.tier : "EXPLORER";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
      <UnifiedNavigation />
      <main className="pt-20 px-4 max-w-screen-xl mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}