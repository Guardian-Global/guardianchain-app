import { useState } from "react";
import { Link } from "wouter";
import { ROUTES, getRoutesForRole } from "@/lib/routes";
import { Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export default function MobileDrawer() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const tier = user?.tier?.toLowerCase() || "guest";
  const accessibleRoutes = getRoutesForRole(tier);

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 md:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <h1 className="text-lg font-bold text-gray-900">GuardianChain</h1>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {tier} Tier
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {accessibleRoutes.map((route) => (
              <Link key={route.path} href={route.path}>
                <a
                  onClick={closeDrawer}
                  className="flex items-start gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                    <span className="text-gray-600 text-sm font-medium">
                      {route.label.match(/^[^a-zA-Z]*(.)/)?.[1]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {route.label}
                    </div>
                    <div className="text-sm text-gray-500 truncate mt-0.5">
                      {route.description}
                    </div>
                    {route.roles.includes("admin") && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        ADMIN
                      </Badge>
                    )}
                  </div>
                </a>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            <p>GuardianChain v2.0</p>
            <p className="mt-1">Sovereign Memory Infrastructure</p>
          </div>
        </div>
      </div>
    </>
  );
}