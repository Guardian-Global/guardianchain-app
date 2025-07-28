import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Activity,
  Brain,
  Coins,
  AlertTriangle,
} from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function AdminDashboard() {
  const adminSections = [
    {
      title: "Treasury Dashboard",
      description: "Monitor GTT treasury, market metrics, and financial health",
      href: "/treasury",
      icon: DollarSign,
      color: BRAND_COLORS.SUCCESS,
      status: "operational",
    },
    {
      title: "AI Financial Advisor",
      description: "AI-powered strategic recommendations and insights",
      href: "/ai-advisor",
      icon: Brain,
      color: BRAND_COLORS.GUARDIAN,
      status: "active",
    },
    {
      title: "Compliance Monitor",
      description: "Real-time compliance monitoring and regulatory alerts",
      href: "/compliance",
      icon: Shield,
      color: "#3b82f6",
      status: "monitoring",
    },
    {
      title: "Yield Distribution",
      description: "Manage capsule yield distribution and reward engine",
      href: "/yield-distribution",
      icon: Coins,
      color: "#10b981",
      status: "healthy",
    },
    {
      title: "Financial Dashboard",
      description:
        "Comprehensive financial analytics and business intelligence",
      href: "/financial-dashboard",
      icon: BarChart3,
      color: "#8b5cf6",
      status: "operational",
    },
    {
      title: "Tier Management",
      description: "Configure subscription tiers and pricing",
      href: "/tiers",
      icon: Users,
      color: "#f59e0b",
      status: "active",
    },
  ];

  const systemMetrics = [
    { label: "Active Users", value: "1,247", icon: Users, color: "#3b82f6" },
    { label: "GTT Distributed", value: "18.5K", icon: Coins, color: "#10b981" },
    {
      label: "Revenue (30d)",
      value: "$12.4K",
      icon: DollarSign,
      color: "#f59e0b",
    },
    {
      label: "System Health",
      value: "98.5%",
      icon: Activity,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            👑 {BRAND_NAME} Commander Admin Dashboard
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Central command center for platform administration and system
            oversight
          </p>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            <Settings className="w-4 h-4 mr-2" />
            Administrative Access
          </Badge>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* System Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {systemMetrics.map((metric, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400 flex items-center">
                    <metric.icon
                      className="w-4 h-4 mr-2"
                      style={{ color: metric.color }}
                    />
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {metric.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adminSections.map((section, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <section.icon
                        className="w-5 h-5 mr-2"
                        style={{ color: section.color }}
                      />
                      {section.title}
                    </CardTitle>
                    <Badge
                      className={`text-xs ${
                        section.status === "operational" ||
                        section.status === "healthy"
                          ? "bg-green-600"
                          : section.status === "active" ||
                            section.status === "monitoring"
                          ? "bg-blue-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {section.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-4">
                    {section.description}
                  </p>
                  <Link href={section.href}>
                    <Button
                      className="w-full"
                      style={{ backgroundColor: section.color }}
                    >
                      Access Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                Quick Administrative Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/yield-distribution">
                  <Button
                    className="w-full"
                    style={{ backgroundColor: BRAND_COLORS.SUCCESS }}
                  >
                    Run Yield Distribution
                  </Button>
                </Link>
                <Link href="/compliance">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Compliance Audit
                  </Button>
                </Link>
                <Link href="/treasury">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Treasury Report
                  </Button>
                </Link>
                <Link href="/ai-advisor">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    AI Analysis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">API Services:</span>
                    <Badge className="bg-green-600 text-white">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Database:</span>
                    <Badge className="bg-green-600 text-white">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">AI Services:</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Compliance:</span>
                    <Badge className="bg-green-600 text-white">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>No critical alerts</span>
                      <span className="text-xs text-slate-500">24h</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>Yield distribution completed</span>
                      <span className="text-xs text-slate-500">2h ago</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>Compliance audit passed</span>
                      <span className="text-xs text-slate-500">6h ago</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>Treasury sync completed</span>
                      <span className="text-xs text-slate-500">12h ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
