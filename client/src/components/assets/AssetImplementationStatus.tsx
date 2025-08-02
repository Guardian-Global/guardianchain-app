import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";

export function AssetImplementationStatus() {
  const { assets, totalAssets, isLoading } = useSupabaseAssets();

  const implementationStatus = [
    {
      component: "Enhanced Logo Display",
      location: "Navigation Header",
      status: "active",
      description: "Automatically uses highest-value branding assets",
    },
    {
      component: "Hero Background",
      location: "Admin Dashboards",
      status: "active",
      description:
        "Commander and Founder dashboards with immersive backgrounds",
    },
    {
      component: "Asset Manager",
      location: "/asset-manager",
      status: "active",
      description: "Complete asset browser with search and filtering",
    },
    {
      component: "Asset Integration Hub",
      location: "/asset-integration",
      status: "active",
      description: "Strategic implementation guides and code snippets",
    },
    {
      component: "Image Galleries",
      location: "Throughout App",
      status: "ready",
      description: "Professional galleries ready for deployment",
    },
    {
      component: "Video Integration",
      location: "Content Pages",
      status: "pending",
      description: "Video assets integration planned",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "ready":
        return "bg-blue-600";
      case "pending":
        return "bg-yellow-600";
      default:
        return "bg-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "ready":
        return ArrowRight;
      case "pending":
        return Clock;
      default:
        return Clock;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4 text-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent mx-auto mb-2"></div>
          <p className="text-slate-400">Loading implementation status...</p>
        </CardContent>
      </Card>
    );
  }

  const activeCount = implementationStatus.filter(
    (item) => item.status === "active",
  ).length;
  const readyCount = implementationStatus.filter(
    (item) => item.status === "ready",
  ).length;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Asset Implementation Status</span>
          <Badge className="bg-green-600">
            {activeCount}/{implementationStatus.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {totalAssets}
            </div>
            <div className="text-sm text-slate-400">Total Assets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {activeCount}
            </div>
            <div className="text-sm text-slate-400">Active Integrations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {readyCount}
            </div>
            <div className="text-sm text-slate-400">Ready to Deploy</div>
          </div>
        </div>

        <div className="space-y-3">
          {implementationStatus.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50"
              >
                <div className="flex items-center space-x-3">
                  <StatusIcon
                    className={`h-5 w-5 ${
                      item.status === "active"
                        ? "text-green-400"
                        : item.status === "ready"
                          ? "text-blue-400"
                          : "text-yellow-400"
                    }`}
                  />
                  <div>
                    <div className="text-white font-medium">
                      {item.component}
                    </div>
                    <div className="text-sm text-slate-400">
                      {item.location} • {item.description}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <h3 className="text-green-400 font-semibold mb-2">
            Successfully Implemented
          </h3>
          <ul className="space-y-1 text-sm text-green-300">
            <li>
              • Navigation automatically uses your highest-value branding assets
            </li>
            <li>• Admin dashboards enhanced with immersive hero backgrounds</li>
            <li>• Complete asset management system with professional UI</li>
            <li>• Real-time asset discovery across all Supabase buckets</li>
            <li>• Strategic implementation guides with copy-paste code</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default AssetImplementationStatus;
