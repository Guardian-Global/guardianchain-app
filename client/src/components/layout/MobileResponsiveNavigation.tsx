import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Menu, X, Moon, Sun, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/web3/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { LogoDisplay } from "@/components/assets/LogoDisplay";

// Mobile-optimized navigation items
const navigation = [
  { name: "Explore", href: "/explore" },
  { name: "Create", href: "/create" },
  { name: "Token Launch", href: "/token-launch" },
  { name: "Analytics", href: "/capsule-analytics" },
  { name: "Profile", href: "/profile" },
];

const mobileNavigation = [
  { name: "Explore", href: "/explore" },
  { name: "Create", href: "/create" },
  { name: "Specialized Intake", href: "/specialized-intake" },
  { name: "Whistleblower", href: "/whistleblower-sanctuary" },
  { name: "Token Launch", href: "/token-launch" },
  { name: "Blockchain Playground", href: "/blockchain-playground" },
  { name: "Analytics", href: "/capsule-analytics" },
  { name: "Profile", href: "/profile" },
  { name: "Categories", href: "/category-discovery" },
  { name: "Assets", href: "/asset-showcase" },
];

export default function MobileResponsiveNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <LogoDisplay 
                size="lg" 
                variant="icon"
                className="w-6 h-6 sm:w-8 sm:h-8"
                fallback={
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="text-white h-3 w-3 sm:h-5 sm:w-5" />
                  </div>
                }
              />
              <span className="text-sm sm:text-xl font-bold">
                <span className="text-purple-400">GUARDIAN</span>
                <span className="text-green-400">CHAIN</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-slate-300 hover:text-white transition-colors ${
                    location === item.href ? "text-purple-400" : ""
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-300">
                  {user.firstName}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  Login
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-300 hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-300 hover:text-white p-2"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              
              <SheetContent 
                side="right" 
                className="w-80 bg-slate-900/98 border-slate-800 overflow-y-auto"
              >
                <div className="flex flex-col space-y-6 mt-8">
                  {/* User Section */}
                  {isAuthenticated && user ? (
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-slate-400">@{user.username}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full text-purple-400 border-purple-400 hover:bg-purple-400/10"
                          onClick={() => setIsOpen(false)}
                        >
                          Login to GUARDIANCHAIN
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {mobileNavigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-left py-3 px-4 ${
                            location === item.href 
                              ? "text-purple-400 bg-purple-400/10" 
                              : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  {/* User Actions */}
                  {isAuthenticated && user && (
                    <div className="pt-4 border-t border-slate-800">
                      <Button
                        variant="outline"
                        className="w-full text-red-400 border-red-400 hover:bg-red-400/10"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}