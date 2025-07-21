import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut, Crown, Wallet, ChevronDown } from 'lucide-react';

export function AuthButton() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case 'SOVEREIGN': return 'text-purple-600';
      case 'CREATOR': return 'text-green-600';
      case 'SEEKER': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case 'SOVEREIGN': return <Crown className="w-4 h-4" />;
      case 'CREATOR': return <Settings className="w-4 h-4" />;
      case 'SEEKER': return <Wallet className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => handleAuth('login')}
            className="text-gray-600 hover:text-purple-600"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => handleAuth('signup')}
            className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white"
          >
            Get Started
          </Button>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          initialMode={authMode}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-green-600 text-white text-sm">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <div className="text-sm font-medium">
              {user?.firstName || user?.email?.split('@')[0]}
            </div>
            <div className={`text-xs flex items-center gap-1 ${getTierColor(user?.tier || '')}`}>
              {getTierIcon(user?.tier || '')}
              {user?.tier || 'Explorer'}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email?.split('@')[0]
              }
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <div className={`text-xs flex items-center gap-1 ${getTierColor(user?.tier || '')}`}>
              {getTierIcon(user?.tier || '')}
              {user?.tier || 'Explorer'} Tier
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a href="/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile & Settings
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a href="/my-listings" className="flex items-center cursor-pointer">
            <Wallet className="mr-2 h-4 w-4" />
            My Listings
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a href="/tiers" className="flex items-center cursor-pointer">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Tier
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}