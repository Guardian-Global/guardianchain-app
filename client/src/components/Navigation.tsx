import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Shield,
  Play,
  Unlock,
  FileText,
  CheckCircle,
  Users,
  BarChart3,
  Vault,
  User,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create", label: "Mint", icon: Shield },
  { href: "/replay", label: "Replay", icon: Play },
  { href: "/unlock", label: "Unlock", icon: Unlock },
  { href: "/submit", label: "Submit", icon: FileText },
  { href: "/verify", label: "Verify", icon: CheckCircle },
  { href: "/dao", label: "DAO", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/vault", label: "Vault", icon: Vault },
  { href: "/profile", label: "Profile", icon: User }
];

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className="hidden lg:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={`
                      px-4 py-2 rounded-xl transition-all duration-300
                      ${active 
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-lg shadow-[#FFD700]/25' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.div 
        className="lg:hidden fixed top-4 right-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-black/80 backdrop-blur-xl border-white/10 text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        px-8 py-4 rounded-xl text-lg transition-all duration-300
                        ${active 
                          ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-lg shadow-[#FFD700]/25' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
            
            {isAuthenticated && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: navigationItems.length * 0.1 }}
                className="pt-6 border-t border-white/10"
              >
                <div className="text-center text-white/60">
                  <p className="text-sm">Welcome back,</p>
                  <p className="text-[#FFD700] font-semibold">{user?.firstName}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}