// components/layout/Breadcrumbs.tsx — Navigation breadcrumbs
import { useLocation, Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const [location] = useLocation();
  
  // Parse location into breadcrumb segments
  const segments = location.split('/').filter(Boolean);
  
  // Don't show breadcrumbs for root path
  if (segments.length === 0) {
    return null;
  }

  const getBreadcrumbLabel = (segment: string) => {
    const labels: Record<string, string> = {
      'dashboard': 'Dashboard',
      'capsules': 'Capsules',
      'create': 'Create',
      'vault': 'Vault',
      'gtt-demo': 'GTT Demo',
      'profile': 'Profile',
      'settings': 'Settings',
      'veritas': 'Veritas Tools',
      'analytics': 'Analytics',
      'dao': 'DAO Governance',
      'validator': 'Validator',
      'legal': 'Legal',
      'press-kit': 'Press Kit'
    };
    return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link href="/" className="text-brand-highlight hover:text-brand-primary transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = '/' + segments.slice(0, index + 1).join('/');
        
        return (
          <div key={segment} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-brand-highlight/60" />
            {isLast ? (
              <span className="text-brand-primary font-medium">
                {getBreadcrumbLabel(segment)}
              </span>
            ) : (
              <Link 
                href={href}
                className="text-brand-highlight hover:text-brand-primary transition-colors"
              >
                {getBreadcrumbLabel(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}