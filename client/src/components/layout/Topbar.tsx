import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationCenter from "./NotificationCenter";
import LanguageSwitcher from "./LanguageSwitcher";
import { Settings, User, LogOut, Menu, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

const Topbar = ({ onMobileMenuToggle }: TopbarProps) => {
  const { user, isAuthenticated } = useAuth();

  const currentTier = (user as any)?.tier?.toLowerCase() || "guest";

  const tierColors = {
    guest: "bg-gray-500",
    member: "bg-blue-500",
    moderator: "bg-purple-500",
    admin: "bg-red-500",
    "dao-owner": "bg-yellow-500",
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm">
      {/* Mobile menu button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-slate-400 hover:text-white"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search bar */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2 min-w-[300px]">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search capsules, users, transactions..."
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none flex-1"
          />
          <kbd className="hidden lg:inline-block text-xs text-slate-500 bg-slate-600 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <NotificationCenter />

        {/* User menu */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 text-slate-300 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">
                      {(user as any)?.firstName || "Debug"}{" "}
                      {(user as any)?.lastName || "User"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {(user as any)?.email || "debug@guardianchain.app"}
                    </div>
                  </div>
                  <Badge
                    className={`text-xs text-white ${tierColors[currentTier as keyof typeof tierColors] || "bg-gray-500"}`}
                  >
                    {currentTier.toUpperCase()}
                  </Badge>
                </div>
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => (window.location.href = "/api/logout")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => (window.location.href = "/api/login")}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
