import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function BreadcrumbNavigation() {
  const [location] = useLocation();

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const segments = path.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Convert segment to readable label
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(location);

  // Don't show breadcrumbs on home page
  if (location === "/" || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((item, index) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-1"
        >
          {index === 0 ? (
            <Link href={item.href}>
              <a className="flex items-center hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
              </a>
            </Link>
          ) : (
            <>
              <ChevronRight className="h-4 w-4" />
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href}>
                  <a className="hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                </Link>
              )}
            </>
          )}
        </motion.div>
      ))}
    </nav>
  );
}
