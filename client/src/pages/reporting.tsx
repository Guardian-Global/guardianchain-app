import React, { useEffect, useState } from 'react';
import { getDailyReport, getHistoricalReports, scheduleNightlyReport } from '@/lib/reporting';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, RefreshCw, Clock, TrendingUp, Calendar } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function ReportingDashboard() {
  const [report, setReport] = useState<string>('Generating comprehensive daily report...');
  const [historicalReports, setHistoricalReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReport = async () => {
    try {
      setRefreshing(true);
      const [dailyReport, historical] = await Promise.all([
        getDailyReport(),
        getHistoricalReports(7)
      ]);
      setReport(dailyReport);
      setHistoricalReports(historical);
    } catch (error) {
      console.error('Error loading reports:', error);
      setReport('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleScheduleNightly = async () => {
    try {
      await scheduleNightlyReport();
      // In production, this would trigger the nightly report schedule
      console.log('Nightly report scheduling updated');
    } catch (error) {
      console.error('Failed to schedule nightly report:', error);
    }
  };

  const handleExport = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardianchain-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-indigo-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            📊 Automated Reporting Center
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            AI-powered daily operations reports and analytics for {BRAND_NAME}
          </p>
          <Badge className="bg-indigo-600 text-white px-4 py-2">
            <FileText className="w-4 h-4 mr-2" />
            Autonomous Reporting System
          </Badge>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Report Controls */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Report Management</span>
                <div className="flex gap-2">
                  <Button
                    onClick={loadReport}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    onClick={handleExport}
                    size="sm"
                    style={{ backgroundColor: BRAND_COLORS.SUCCESS }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleScheduleNightly}
                  className="w-full"
                  style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Nightly Reports
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => console.log('Send test email')}
                >
                  Send Test Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => console.log('Configure alerts')}
                >
                  Configure Alerts
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Report */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" style={{ color: BRAND_COLORS.SUCCESS }} />
                Today's Operations Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-700/50 p-6 rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full mr-3" />
                    <span className="text-slate-300">Generating comprehensive report...</span>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm font-mono">
                    {report}
                  </pre>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Historical Reports */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" style={{ color: BRAND_COLORS.GUARDIAN }} />
                Historical Reports (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historicalReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Daily Report - {report.date}</p>
                      <p className="text-sm text-slate-400">{report.summary}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={report.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                        {report.status}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Automated Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Daily operations summary at midnight UTC</li>
                  <li>• AI-powered insights and recommendations</li>
                  <li>• Automatic email delivery to administrators</li>
                  <li>• Yield distribution analytics</li>
                  <li>• Compliance monitoring alerts</li>
                  <li>• Financial performance tracking</li>
                  <li>• User engagement metrics</li>
                  <li>• Historical trend analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Report Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Reports Generated:</span>
                    <span className="text-white font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Average Generation Time:</span>
                    <span className="text-white font-semibold">2.3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Success Rate:</span>
                    <span className="text-green-400 font-semibold">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Last Failure:</span>
                    <span className="text-slate-400">None (30 days)</span>
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