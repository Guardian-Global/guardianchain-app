import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import LogoDisplay from '@/components/assets/LogoDisplay';
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Rocket,
  Shield,
  User,
  Settings,
  Wallet,
  Star,
  Crown,
  Zap
} from 'lucide-react';

export default function EnhancedMegaNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navSections = {
    platform: [
      { href: '/', label: 'Home', icon: Home },
      { href: '/token-launch', label: 'GTT Launch', icon: Rocket, featured: true },
      { href: '/professional-homepage', label: 'Platform', icon: Shield },
      { href: '/asset-debug', label: 'Diagnostics', icon: Zap },
    ],
    assets: [
      { href: '/logo-test', label: 'Logo System', icon: Star },
      { href: '/supabase-assets', label: 'Asset Gallery', icon: Crown },
      { href: '/asset-showcase', label: 'Showcase', icon: Shield },
    ],
    profile: [
      { href: '/profile', label: 'My Profile', icon: User },
      { href: '/wallet', label: 'Wallet', icon: Wallet },
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <LogoDisplay size="sm" variant="icon" type="gtt" />
            <span className="text-xl font-bold">
              <span style={{ color: "#7F5AF0" }}>GUARDIAN</span>
              <span style={{ color: "#2CB67D" }}>CHAIN</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Platform Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  Platform <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                {navSections.platform.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center space-x-2 text-white hover:text-purple-400">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.featured && <Badge className="bg-purple-600 text-white text-xs">LIVE</Badge>}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Assets Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-green-400">
                  Assets <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                {navSections.assets.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center space-x-2 text-white hover:text-green-400">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-blue-400">
                  Profile <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                {navSections.profile.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center space-x-2 text-white hover:text-blue-400">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Launch Button */}
            <Link href="/token-launch">
              <Button className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white">
                <Rocket className="mr-2 h-4 w-4" />
                Deploy GTT
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-700 py-4">
            <div className="space-y-4">
              {Object.entries(navSections).map(([sectionName, items]) => (
                <div key={sectionName}>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    {sectionName}
                  </h3>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2 text-white hover:bg-slate-700 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.featured && <Badge className="bg-purple-600 text-white text-xs">LIVE</Badge>}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}