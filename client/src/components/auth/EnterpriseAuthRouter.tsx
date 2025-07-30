import React from "react";
import { Route, Switch } from "wouter";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import AuthenticationHub from "@/components/auth/AuthenticationHub";
import OnboardingPage from "@/pages/onboarding";
import RoleBasedDashboard from "@/components/auth/RoleBasedDashboard";
import UnifiedLogin from "@/pages/UnifiedLogin";
import MasterAdmin from "@/pages/MasterAdmin";
import AdminDashboard from "@/pages/AdminDashboard";
import EnhancedCommanderDashboard from "@/components/admin/EnhancedCommanderDashboard";
import EnhancedFounderDashboard from "@/components/admin/EnhancedFounderDashboard";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requiredRole?: string;
  requiredTier?: string;
  requiredPermission?: string;
  fallbackComponent?: React.ComponentType<any>;
}

function ProtectedRoute({ 
  component: Component, 
  requiredRole, 
  requiredTier, 
  requiredPermission,
  fallbackComponent: FallbackComponent = UnifiedLogin 
}: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, hasTier, hasPermission } = useUnifiedAuth();

  if (!isAuthenticated) {
    return <FallbackComponent />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <div className="text-center text-red-500 p-8">Access Denied: Insufficient Role</div>;
  }

  if (requiredTier && !hasTier(requiredTier)) {
    return <div className="text-center text-red-500 p-8">Access Denied: Tier Upgrade Required</div>;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <div className="text-center text-red-500 p-8">Access Denied: Missing Permission</div>;
  }

  return <Component />;
}

export default function EnterpriseAuthRouter() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={UnifiedLogin} />
      <Route path="/auth-hub" component={() => <AuthenticationHub onAuthenticated={() => {}} />} />
      <Route path="/login" component={UnifiedLogin} />
      <Route path="/unified-login" component={UnifiedLogin} />
      
      {/* Onboarding (authenticated but no role requirements) */}
      <Route path="/onboarding">
        <ProtectedRoute component={OnboardingPage} />
      </Route>

      {/* Role-based dashboards */}
      <Route path="/auth-dashboard">
        <ProtectedRoute component={RoleBasedDashboard} />
      </Route>

      {/* Master admin routes */}
      <Route path="/master-admin">
        <ProtectedRoute 
          component={MasterAdmin} 
          requiredRole="MASTER_ADMIN"
        />
      </Route>

      {/* Admin routes */}
      <Route path="/admin">
        <ProtectedRoute 
          component={AdminDashboard} 
          requiredRole="ADMIN"
        />
      </Route>

      <Route path="/admin/dashboard">
        <ProtectedRoute 
          component={AdminDashboard} 
          requiredRole="ADMIN"
        />
      </Route>

      {/* Commander routes */}
      <Route path="/commander">
        <ProtectedRoute 
          component={EnhancedCommanderDashboard} 
          requiredRole="COMMANDER"
        />
      </Route>

      {/* Founder routes */}
      <Route path="/founder-dashboard">
        <ProtectedRoute 
          component={EnhancedFounderDashboard} 
          requiredRole="FOUNDER"
        />
      </Route>

      {/* Tier-based routes */}
      <Route path="/premium">
        <ProtectedRoute 
          component={RoleBasedDashboard} 
          requiredTier="CREATOR"
        />
      </Route>

      <Route path="/sovereign">
        <ProtectedRoute 
          component={RoleBasedDashboard} 
          requiredTier="SOVEREIGN"
        />
      </Route>

      {/* Permission-based routes */}
      <Route path="/billing">
        <ProtectedRoute 
          component={RoleBasedDashboard} 
          requiredPermission="billing.manage"
        />
      </Route>

      <Route path="/compliance">
        <ProtectedRoute 
          component={RoleBasedDashboard} 
          requiredPermission="compliance.view"
        />
      </Route>

      <Route path="/treasury">
        <ProtectedRoute 
          component={RoleBasedDashboard} 
          requiredPermission="treasury.view"
        />
      </Route>
    </Switch>
  );
}

// Export individual protection components for reuse
export { ProtectedRoute };

// Enterprise auth utilities
export const ENTERPRISE_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN", 
  COMMANDER: "COMMANDER",
  FOUNDER: "FOUNDER",
  MASTER_ADMIN: "MASTER_ADMIN"
} as const;

export const ENTERPRISE_TIERS = {
  EXPLORER: "EXPLORER",
  SEEKER: "SEEKER", 
  CREATOR: "CREATOR",
  SOVEREIGN: "SOVEREIGN"
} as const;

export const ENTERPRISE_PERMISSIONS = {
  // User permissions
  "profile.edit": "Edit user profile",
  "capsule.create": "Create truth capsules",
  "capsule.verify": "Verify capsules",
  
  // Admin permissions
  "user.manage": "Manage users",
  "capsule.moderate": "Moderate capsules",
  "system.configure": "Configure system",
  
  // Financial permissions
  "billing.manage": "Manage billing",
  "treasury.view": "View treasury",
  "treasury.manage": "Manage treasury",
  "compliance.view": "View compliance",
  "compliance.manage": "Manage compliance",
  
  // Master permissions
  "*": "All permissions"
} as const;