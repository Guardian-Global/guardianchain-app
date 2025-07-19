import React from 'react';
import TreasuryDashboard from "@/components/TreasuryDashboard";
import AIAccountingPanel from "@/components/AIAccountingPanel";
import ClaimAllYieldPanel from "@/components/web3/ClaimAllYieldPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'wouter';
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  FileText, 
  Brain,
  Activity,
  Users,
  BarChart3,
  Coins,
  AlertTriangle
} from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function CommanderDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {BRAND_NAME} Commander Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Advanced treasury management, AI insights, and yield claiming hub
          </p>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/treasury">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Treasury
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Real-time GTT treasury and market metrics
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ai-advisor">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    AI Advisor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Strategic recommendations and automated insights
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reporting">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Automated daily operations reports
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Treasury Dashboard Component */}
          <TreasuryDashboard />
          
          {/* AI Accounting Panel */}
          <AIAccountingPanel />

          {/* GTT Yield Claiming Panel */}
          <ClaimAllYieldPanel />

        </div>
      </div>
    </div>
  );
}

// Previous section data that was partially displayed
const dashboardSections = [
  {
    title: "Treasury Overview",
    description: "Real-time GTT treasury and market metrics",
    href: "/treasury",
    icon: DollarSign,
    color: BRAND_COLORS.SUCCESS,
    status: "operational",
    metrics: {
      value: "$2.4M",
      label: "Treasury Value",
      trend: "+12.5%"
    }
  },
  {
    title: "AI Financial Advisor", 
    description: "Strategic recommendations and automated insights",
    href: "/ai-advisor",
    icon: Brain,
    color: BRAND_COLORS.GUARDIAN,
    status: "active",
    metrics: {
      value: "94%",
      label: "Confidence Score",
      trend: "+2.1%"
    }
  }
];}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashboardSections.map((section, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <section.icon className="w-5 h-5 mr-2" style={{ color: section.color }} />
                      {section.title}
                    </CardTitle>
                    <Badge 
                      className={`text-xs ${
                        section.status === 'operational' || section.status === 'healthy' ? 'bg-green-600' :
                        section.status === 'active' || section.status === 'monitoring' || section.status === 'automated' ? 'bg-blue-600' :
                        'bg-yellow-600'
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
                  
                  {/* Metrics */}
                  <div className="bg-slate-700/30 p-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{section.metrics.label}</span>
                      <div className="text-right">
                        <span className="text-white font-semibold">{section.metrics.value}</span>
                        <div className="flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                          <span className="text-xs text-green-400">{section.metrics.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={section.href}>
                    <div 
                      className="w-full py-2 px-4 rounded-lg text-white text-center font-medium cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: section.color }}
                    >
                      Access Dashboard
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-green-400" />
                  Recent System Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          alert.type === 'success' ? 'bg-green-400' :
                          alert.type === 'info' ? 'bg-blue-400' :
                          'bg-yellow-400'
                        }`} />
                        <span className="text-slate-300 text-sm">{alert.message}</span>
                      </div>
                      <span className="text-xs text-slate-500">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">API Services:</span>
                    <Badge className="bg-green-600 text-white">Operational</Badge>
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
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Yield Engine:</span>
                    <Badge className="bg-green-600 text-white">Distributing</Badge>
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