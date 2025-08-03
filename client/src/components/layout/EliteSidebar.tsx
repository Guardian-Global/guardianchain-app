import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Plus, 
  Compass, 
  Trophy, 
  User, 
  Gavel,
  Wallet,
  Settings,
  TrendingUp,
  Shield,
  FileText,
  Users,
  BarChart3,
  Coins,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  tier?: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN';
}

const navigation: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Create Capsule', href: '/create', icon: Plus, badge: 'New' },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Truth Auctions', href: '/auction-house', icon: Gavel, badge: 3 },
  { label: 'Profile', href: '/profile', icon: User },
];

const analytics: NavItem[] = [
  { label: 'Enhanced Dashboard', href: '/dashboard', icon: Zap, badge: 'Pro' },
  { label: 'Unlocks', href: '/dashboard/unlocks', icon: Clock },
  { label: 'Yield', href: '/dashboard/yield', icon: Coins },
  { label: 'Funding', href: '/dashboard/funding', icon: TrendingUp },
  { label: 'Treasury', href: '/treasury', icon: BarChart3 },
];

const advanced: NavItem[] = [
  { label: 'Enterprise Center', href: '/enterprise', icon: Crown, badge: 'New', tier: 'CREATOR' },
  { label: 'Governance', href: '/governance', icon: Users, tier: 'SEEKER' },
  { label: 'Veritas Tools', href: '/veritas-seal', icon: Shield, tier: 'CREATOR' },
  { label: 'Compliance', href: '/compliance', icon: FileText, tier: 'SOVEREIGN' },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface EliteSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EliteSidebar({ isOpen, onClose }: EliteSidebarProps) {
  const [location] = useLocation();

  const NavSection = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                onClick={() => onClose()}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-r-2 border-blue-500"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"
                )} />
                <span className="flex-1">{item.label}</span>
                
                {item.badge && (
                  <Badge 
                    variant={typeof item.badge === 'number' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
                
                {item.tier && (
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400" />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 bottom-0 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out z-50 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <NavSection title="Main" items={navigation} />
            <NavSection title="Analytics" items={analytics} />
            <NavSection title="Advanced" items={advanced} />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-lg border border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="flex-1">
                <p className="text-xs font-medium text-green-400">Status: Active</p>
                <p className="text-xs text-slate-400">Truth Network Online</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}