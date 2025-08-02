import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface AuthGuardProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

export function AuthGuard({ allowedRoles = [], children }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
      return;
    }

    if (!isLoading && isAuthenticated && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
      const hasRequiredRole = allowedRoles.some(role => 
        user?.tier?.toLowerCase() === role.toLowerCase()
      );
      
      if (!hasRequiredRole) {
        setLocation('/unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has required role
  if (!isAuthenticated) {
    return null;
  }

  // If roles are specified, check if user has one of them
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => 
      user?.tier?.toLowerCase() === role.toLowerCase()
    );
    
    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}

export function withAuthGuard<T extends object>(
  Component: React.ComponentType<T>, 
  allowedRoles: string[] = []
) {
  return function GuardedComponent(props: T) {
    return (
      <AuthGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}