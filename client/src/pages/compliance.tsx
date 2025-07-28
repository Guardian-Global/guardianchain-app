import React, { useEffect, useState } from "react";
import {
  runComplianceAudit,
  getComplianceStatus,
  logComplianceEvent,
} from "@/lib/compliance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Activity,
  Eye,
} from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function CompliancePanel() {
  const [audit, setAudit] = useState<string>("Running compliance audit...");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const runAudit = async () => {
    try {
      setRefreshing(true);
      const [auditResult, statusResult] = await Promise.all([
        runComplianceAudit(),
        getComplianceStatus(),
      ]);
      setAudit(auditResult);
      setStatus(statusResult);
    } catch (error) {
      console.error("Compliance audit error:", error);
      setAudit("Compliance audit temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const handleLogEvent = async (eventType: string) => {
    await logComplianceEvent({
      type: eventType,
      details: { manual_trigger: true, timestamp: new Date().toISOString() },
    });
    runAudit(); // Refresh after logging
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            🛡️ Compliance Monitor & AI Audit
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            AI-powered compliance monitoring and regulatory risk assessment for{" "}
            {BRAND_NAME}
          </p>
          <Badge className="bg-blue-600 text-white px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Enterprise Compliance Suite
          </Badge>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status Overview */}
          {status && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-green-400 font-semibold capitalize">
                      {status.status}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Risk Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    {status.riskLevel === "low" ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                    )}
                    <span
                      className={`font-semibold capitalize ${
                        status.riskLevel === "low"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {status.riskLevel}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-white font-semibold">
                      {status.activeAlerts}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Last Audit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-purple-400 mr-2" />
                    <span className="text-slate-300 text-sm">
                      {new Date(status.lastAudit).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Audit Results */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Shield
                    className="w-5 h-5 mr-2"
                    style={{ color: BRAND_COLORS.SUCCESS }}
                  />
                  AI Compliance Audit Results
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runAudit}
                  disabled={refreshing}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Audit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-700/50 p-6 rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mr-3" />
                    <span className="text-slate-300">
                      Running AI compliance audit...
                    </span>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm">
                    {audit}
                  </pre>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manual Compliance Actions */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                Manual Compliance Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => handleLogEvent("manual_security_check")}
                  className="w-full"
                  style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
                >
                  Security Check
                </Button>
                <Button
                  onClick={() => handleLogEvent("compliance_review")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Log Review
                </Button>
                <Button
                  onClick={() => handleLogEvent("risk_assessment")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Risk Assessment
                </Button>
                <Button
                  onClick={() => handleLogEvent("audit_trigger")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Trigger Audit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Monitoring Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Real-time transaction monitoring</li>
                  <li>• Geo-location compliance checking</li>
                  <li>• Suspicious activity detection</li>
                  <li>• AML pattern recognition</li>
                  <li>• Automated regulatory reporting</li>
                  <li>• Risk scoring algorithms</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Alert Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Large transaction alerts</li>
                  <li>• Restricted region access</li>
                  <li>• Unusual trading patterns</li>
                  <li>• KYC verification issues</li>
                  <li>• Cross-border compliance</li>
                  <li>• Data privacy concerns</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
