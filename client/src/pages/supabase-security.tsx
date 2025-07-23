import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Settings, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityCheck {
  auth_configured: boolean;
  rls_enabled: boolean;
  secure_functions: boolean;
  api_restrictions: boolean;
  audit_logging: boolean;
}

interface SecurityStatus {
  security_score: number;
  security_checks: SecurityCheck;
  details: string[];
  recommendations: string[];
  timestamp: string;
}

export default function SupabaseSecurity() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [hardening, setHardening] = useState(false);
  const { toast } = useToast();

  const checkSecurityStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/supabase/security/status');
      const data = await response.json();
      
      if (data.success) {
        setSecurityStatus(data.data);
        toast({
          title: "Security Status Updated",
          description: `Security score: ${data.data.security_score}%`,
        });
      } else {
        toast({
          title: "Check Failed",
          description: data.error || "Failed to check security status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to security service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyHardening = async () => {
    setHardening(true);
    try {
      const response = await fetch('/api/supabase/security/harden', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Security Hardening Applied",
          description: `Completed ${data.data.total_steps} hardening steps`,
        });
        
        // Refresh security status
        await checkSecurityStatus();
      } else {
        toast({
          title: "Hardening Failed",
          description: data.error || "Failed to apply security hardening",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply security hardening",
        variant: "destructive",
      });
    } finally {
      setHardening(false);
    }
  };

  const fixSpecificIssue = async (issue: string) => {
    try {
      const response = await fetch(`/api/supabase/security/fix/${issue}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Issue Fixed",
          description: data.data.fix_result.message,
        });
        await checkSecurityStatus();
      } else {
        toast({
          title: "Fix Failed",
          description: data.error || "Failed to fix issue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fix security issue",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-600">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-600">Good</Badge>;
    return <Badge className="bg-red-600">Needs Attention</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-12 w-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">
              GUARDIANCHAIN Security Center
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Monitor and enhance Supabase security configuration with enterprise-grade protection
          </p>
        </div>

        {/* Security Score Card */}
        {securityStatus && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <span>Security Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score */}
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(securityStatus.security_score)}`}>
                    {securityStatus.security_score}%
                  </div>
                  <div className="text-slate-400">Security Score</div>
                  <div className="mt-2">{getScoreBadge(securityStatus.security_score)}</div>
                </div>

                {/* Security Checks */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Security Checks</h3>
                  {Object.entries(securityStatus.security_checks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-slate-300 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      {value ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Status Details</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {securityStatus.details.map((detail, index) => (
                      <div key={index} className="text-sm text-slate-400 p-2 bg-slate-700/30 rounded">
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="h-6 w-6 text-green-400" />
                <span>Security Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={checkSecurityStatus}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Checking..." : "Check Security Status"}
              </Button>

              <Button
                onClick={applyHardening}
                disabled={hardening}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {hardening ? "Hardening..." : "Apply Security Hardening"}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => fixSpecificIssue('exposed-auth-users')}
                  variant="outline"
                  className="text-sm border-slate-600 text-slate-300"
                >
                  Fix Auth Exposure
                </Button>
                <Button
                  onClick={() => fixSpecificIssue('function-search-path')}
                  variant="outline"
                  className="text-sm border-slate-600 text-slate-300"
                >
                  Fix Functions
                </Button>
                <Button
                  onClick={() => fixSpecificIssue('foreign-table-api')}
                  variant="outline"
                  className="text-sm border-slate-600 text-slate-300"
                >
                  Fix Foreign Tables
                </Button>
                <Button
                  onClick={() => fixSpecificIssue('password-protection')}
                  variant="outline"
                  className="text-sm border-slate-600 text-slate-300"
                >
                  Password Config
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {securityStatus && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityStatus.recommendations.map((rec, index) => (
                    <Alert key={index} className="bg-slate-700/30 border-slate-600">
                      <AlertDescription className="text-slate-300">
                        {rec}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Security Issues from Screenshots */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <span>Identified Security Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-red-400 font-semibold">Critical Issues</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-red-900/20 border border-red-700 rounded">
                    <div className="font-medium text-red-300">Exposed Auth Users</div>
                    <div className="text-sm text-red-400">
                      public.users_with_roles - auth.users exposed via view or authenticated roles
                    </div>
                  </div>
                  <div className="p-3 bg-red-900/20 border border-red-700 rounded">
                    <div className="font-medium text-red-300">Security Definer Views</div>
                    <div className="text-sm text-red-400">
                      Views defined with SECURITY DEFINER property enforcement needed
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-yellow-400 font-semibold">Function Issues</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded">
                    <div className="font-medium text-yellow-300">Function Search Path</div>
                    <div className="text-sm text-yellow-400">
                      Multiple functions with search_path parameter not set
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded">
                    <div className="font-medium text-yellow-300">Foreign Table API</div>
                    <div className="text-sm text-yellow-400">
                      Foreign tables accessible over APIs without proper restrictions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        {securityStatus && (
          <div className="text-center text-sm text-slate-500">
            Last updated: {new Date(securityStatus.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}