import React from "react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Shield, Zap, User, Settings, BarChart3, LogOut } from "lucide-react";
import LogoDisplay from "@/components/assets/LogoDisplay";

export function RoleBasedDashboard() {
  const { user, logout, hasRole, hasPermission } = useUnifiedAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/unified-login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "master":
      case "commander":
        return Crown;
      case "founder":
        return Shield;
      case "architect":
        return Zap;
      case "admin":
        return Settings;
      default:
        return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "master":
      case "commander":
        return "from-purple-600 to-purple-800";
      case "founder":
        return "from-green-600 to-green-800";
      case "architect":
        return "from-blue-600 to-blue-800";
      case "admin":
        return "from-orange-600 to-orange-800";
      default:
        return "from-slate-600 to-slate-800";
    }
  };

  const getDashboardActions = () => {
    const actions = [];

    if (hasRole("master") || hasRole("commander")) {
      actions.push(
        { title: "Commander Center", description: "Protocol control and GTT minting", href: "/commander", icon: Crown },
        { title: "Treasury Management", description: "Financial oversight and reporting", href: "/treasury", icon: BarChart3 },
        { title: "System Config", description: "Core system configuration", href: "/config", icon: Settings }
      );
    }

    if (hasRole("founder")) {
      actions.push(
        { title: "Strategic Dashboard", description: "Business intelligence and analytics", href: "/dashboard", icon: BarChart3 },
        { title: "Financial Overview", description: "Revenue and compliance monitoring", href: "/billing-dashboard", icon: Shield }
      );
    }

    if (hasRole("architect")) {
      actions.push(
        { title: "System Architecture", description: "Technical infrastructure management", href: "/config", icon: Zap },
        { title: "API Status", description: "Service health and monitoring", href: "/api-status", icon: Settings }
      );
    }

    if (hasRole("admin")) {
      actions.push(
        { title: "Admin Dashboard", description: "User and content moderation", href: "/admin/dashboard", icon: Settings },
        { title: "Compliance Center", description: "Security and legal oversight", href: "/compliance", icon: Shield }
      );
    }

    // Universal actions for all users
    actions.push(
      { title: "My Profile", description: "Personal settings and preferences", href: "/profile", icon: User },
      { title: "Capsule Management", description: "Create and manage truth capsules", href: "/capsules", icon: User }
    );

    return actions;
  };

  const RoleIcon = getRoleIcon(user.role);
  const actions = getDashboardActions();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <LogoDisplay size="lg" variant="full" className="justify-center" />
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome to GUARDIANCHAIN</h1>
            <p className="text-slate-300">Role-based access dashboard</p>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${getRoleColor(user.role)}`}>
                  <RoleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <p className="text-slate-400">
                    {user.role.toUpperCase()} • {user.tier} Tier
                  </p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="text-slate-300 border-slate-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{user.permissions?.length || 0}</div>
                <div className="text-sm text-slate-400">Permissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{user.tier}</div>
                <div className="text-sm text-slate-400">Access Tier</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">ACTIVE</div>
                <div className="text-sm text-slate-400">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Available Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action) => (
              <Card key={action.href} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                <CardContent className="p-6" onClick={() => setLocation(action.href)}>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-green-600">
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-slate-400">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Permissions Display */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Your Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.permissions?.map((permission) => (
                <span
                  key={permission}
                  className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30"
                >
                  {permission}
                </span>
              )) || (
                <span className="text-slate-400">No specific permissions assigned</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RoleBasedDashboard;