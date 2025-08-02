import { useLocation } from "wouter";
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/admin': 'Admin Panel',
  '/vault': 'Truth Vault',
  '/create': 'Create Capsule',
  '/staking': 'Staking',
  '/dao': 'DAO Governance',
  '/validator': 'Validator Dashboard',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/tier-access': 'Tier Access',
  '/referral': 'Referral Program',
  '/yield': 'Yield Tracking',
  '/governance': 'Governance',
  '/treasury': 'Treasury',
  '/analytics': 'Analytics',
  '/compliance': 'Compliance',
  '/ai-advisor': 'AI Advisor'
};

const Breadcrumbs = () => {
  const [location] = useLocation();
  
  const pathSegments = location.split('/').filter(Boolean);
  
  // Don't show breadcrumbs on home page
  if (location === '/' || location === '/dashboard') {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/dashboard' }
  ];

  // Build breadcrumb path
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      href: index === pathSegments.length - 1 ? undefined : currentPath // No link for current page
    });
  });

  return (
    <nav className="px-6 py-3 bg-slate-800/30 border-b border-slate-700/50">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-slate-500 mx-2" />
            )}
            
            {index === 0 && (
              <Home className="h-4 w-4 text-slate-400 mr-2" />
            )}
            
            {crumb.href ? (
              <Link href={crumb.href}>
                <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  {crumb.label}
                </span>
              </Link>
            ) : (
              <span className="text-white font-medium">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;