import React, { useState, useEffect } from 'react';
import TreasuryDashboard from '@/components/TreasuryDashboard';
import AIAccountingPanel from '@/components/AIAccountingPanel';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

interface DailyReport {
  date: string;
  gttMinted: number;
  yieldDistributed: number;
  activeUsers: number;
  revenue: number;
  complianceScore: number;
  systemUptime: number;
}

export default function ReportingDashboard() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Mock data for development - replace with real API calls
      const mockReports: DailyReport[] = [
        {
          date: new Date().toISOString().split('T')[0],
          gttMinted: 3420,
          yieldDistributed: 1247,
          activeUsers: 892,
          revenue: 15600,
          complianceScore: 98.5,
          systemUptime: 99.8
        },
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          gttMinted: 3280,
          yieldDistributed: 1189,
          activeUsers: 867,
          revenue: 14200,
          complianceScore: 99.2,
          systemUptime: 100.0
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          gttMinted: 3156,
          yieldDistributed: 1134,
          activeUsers: 823,
          revenue: 13800,
          complianceScore: 97.8,
          systemUptime: 99.9
        }
      ];

      setReports(mockReports);
      setLastGenerated(new Date());
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNightlyReport = async () => {
    try {
      setGenerating(true);
      
      // Simulate AI report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add new report to the list
      const newReport: DailyReport = {
        date: new Date().toISOString().split('T')[0],
        gttMinted: Math.floor(Math.random() * 1000) + 3000,
        yieldDistributed: Math.floor(Math.random() * 500) + 1000,
        activeUsers: Math.floor(Math.random() * 200) + 800,
        revenue: Math.floor(Math.random() * 5000) + 12000,
        complianceScore: Math.random() * 5 + 95,
        systemUptime: Math.random() * 1 + 99
      };

      setReports(prev => [newReport, ...prev.slice(0, 6)]);
      setLastGenerated(new Date());
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const exportReport = (report: DailyReport) => {
    const csvContent = `Date,GTT Minted,Yield Distributed,Active Users,Revenue USD,Compliance Score,System Uptime
${report.date},${report.gttMinted},${report.yieldDistributed},${report.activeUsers},${report.revenue},${report.complianceScore},${report.systemUptime}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardianchain-report-${report.date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                📊 {BRAND_NAME} Reporting Dashboard
              </h1>
              <p className="text-xl text-slate-300">
                Automated daily operations reports with AI-powered insights and analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={generateNightlyReport}
                disabled={generating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {generating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
              <Button
                onClick={fetchReports}
                disabled={loading}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {lastGenerated && (
            <div className="mt-4">
              <Badge className="bg-green-600 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Last generated: {lastGenerated.toLocaleString()}
              </Badge>
            </div>
          )}
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Live Treasury Dashboard */}
          <TreasuryDashboard />
          
          {/* AI Financial Intelligence */}
          <AIAccountingPanel />

          {/* Daily Reports Archive */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                Daily Operations Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-slate-700/30 rounded-lg p-4">
                      <div className="grid grid-cols-6 gap-4">
                        <div className="h-4 bg-slate-600 rounded"></div>
                        <div className="h-4 bg-slate-600 rounded"></div>
                        <div className="h-4 bg-slate-600 rounded"></div>
                        <div className="h-4 bg-slate-600 rounded"></div>
                        <div className="h-4 bg-slate-600 rounded"></div>
                        <div className="h-4 bg-slate-600 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Reports Header */}
                  <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-slate-400 border-b border-slate-700 pb-2">
                    <div>Date</div>
                    <div>GTT Minted</div>
                    <div>Yield Distributed</div>
                    <div>Active Users</div>
                    <div>Revenue</div>
                    <div>Compliance</div>
                    <div>Actions</div>
                  </div>

                  {/* Reports List */}
                  {reports.map((report, index) => (
                    <div key={report.date} className="grid grid-cols-7 gap-4 items-center py-3 border-b border-slate-800 hover:bg-slate-700/20">
                      <div className="text-white font-medium">
                        {new Date(report.date).toLocaleDateString()}
                      </div>
                      <div className="text-slate-300">
                        {report.gttMinted.toLocaleString()} GTT
                      </div>
                      <div className="text-slate-300">
                        {report.yieldDistributed.toLocaleString()} GTT
                      </div>
                      <div className="text-slate-300">
                        {report.activeUsers.toLocaleString()}
                      </div>
                      <div className="text-slate-300">
                        ${report.revenue.toLocaleString()}
                      </div>
                      <div>
                        <Badge className={`${
                          report.complianceScore >= 99 ? 'bg-green-600' :
                          report.complianceScore >= 95 ? 'bg-yellow-600' :
                          'bg-red-600'
                        } text-white`}>
                          {report.complianceScore.toFixed(1)}%
                        </Badge>
                      </div>
                      <div>
                        <Button
                          onClick={() => exportReport(report)}
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:text-white"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Schedule & Automation */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-400" />
                Automated Reporting Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-green-400" />
                    Daily Operations
                  </h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Generated every night at 03:00 UTC with comprehensive platform metrics
                  </p>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                    Weekly Analytics
                  </h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Deep-dive analysis every Sunday with growth insights and recommendations
                  </p>
                  <Badge className="bg-blue-600 text-white">Scheduled</Badge>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-purple-400" />
                    Compliance Audits
                  </h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Monthly compliance reports with regulatory assessment and risk analysis
                  </p>
                  <Badge className="bg-purple-600 text-white">Monthly</Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Next scheduled report:</strong> Tonight at 03:00 UTC (in {Math.floor((24 - new Date().getHours() + 3) % 24)} hours)
                </p>
                <p className="text-blue-300 text-sm mt-1">
                  All reports are automatically exported to CSV and sent via email to administrators.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}