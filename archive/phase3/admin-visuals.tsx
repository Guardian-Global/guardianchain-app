import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Code, Settings, TestTube, FileText, Monitor } from "lucide-react";

export default function AdminVisualsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Admin Development Center
            </h1>
            <p className="text-xl text-slate-300">
              Development tools, examples, and test components - Admin Only
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2">
            🔒 Admin Access Only
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Development Examples */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Code Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/asset-showcase")}
              >
                Asset Integration Examples
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/responsive-demo")}
              >
                Responsive Design Demo
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() =>
                  (window.location.href = "/blockchain-playground")
                }
              >
                Blockchain Animation Demo
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/logo-sync")}
              >
                Logo Sync Manager
              </Button>
            </CardContent>
          </Card>

          {/* Testing Components */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-green-400" />
                Test Components
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/api-status")}
              >
                API Status Monitor
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/supabase-security")}
              >
                Supabase Security Center
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/teams-upgrades")}
              >
                Teams Upgrades Hub
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/replit-tools")}
              >
                Replit Tools Integration
              </Button>
            </CardContent>
          </Card>

          {/* Development Tools */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Development Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/asset-integration")}
              >
                Asset Integration Hub
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/asset-debug")}
              >
                Asset Debug Tools
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/config")}
              >
                System Configuration
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/admin")}
              >
                Admin Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Visual Examples */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-yellow-400" />
                Visual Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() =>
                  (window.location.href = "/professional-homepage")
                }
              >
                Homepage Variants
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/mascot-settings")}
              >
                Mascot System Demo
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/advanced-features")}
              >
                Advanced Features Demo
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/whitepapers")}
              >
                Documentation Examples
              </Button>
            </CardContent>
          </Card>

          {/* Monitoring */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-cyan-400" />
                System Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/reporting")}
              >
                Reporting Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/compliance")}
              >
                Compliance Panel
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/treasury")}
              >
                Treasury Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600"
                onClick={() => (window.location.href = "/yield-distribution")}
              >
                Yield Distribution
              </Button>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-slate-400 mb-3">
                Development notes and progress tracking
              </div>
              <div className="text-green-400 text-sm">
                ✅ Production Replit Auth Integration Complete
              </div>
              <div className="text-green-400 text-sm">
                ✅ Revenue-Focused Public Pages Live
              </div>
              <div className="text-green-400 text-sm">
                ✅ Admin-Only Development Content Protected
              </div>
              <div className="text-blue-400 text-sm">
                🔄 Platform Ready for Mass Deployment
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning Banner */}
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-700/50 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">
                  Admin Only Content Warning
                </h3>
                <p className="text-slate-300">
                  This page contains development tools, examples, and test
                  components that are only visible to administrators. Public
                  users see the production-ready revenue-focused pages with real
                  functionality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
