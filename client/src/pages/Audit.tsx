import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  target: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'resolved' | 'investigating';
  details: string;
  txHash?: string;
  blockNumber?: number;
}

interface AuditSummary {
  totalLogs: number;
  pendingActions: number;
  criticalIssues: number;
  resolvedToday: number;
  validatorAttestations: number;
}

export default function Audit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: auditData, isLoading } = useQuery({
    queryKey: ["/api/audit/logs"],
    refetchInterval: 30000,
  });

  const mockData = {
    summary: {
      totalLogs: 1247,
      pendingActions: 23,
      criticalIssues: 2,
      resolvedToday: 15,
      validatorAttestations: 89
    } as AuditSummary,
    logs: [
      {
        id: "audit-001",
        timestamp: "2025-08-03T21:45:00Z",
        action: "Capsule Validation Failed",
        actor: "validator-0x1234",
        target: "capsule-789",
        severity: "high" as const,
        status: "investigating" as const,
        details: "Truth verification score below threshold (0.65)",
        txHash: "0xabc123...",
        blockNumber: 18950234
      },
      {
        id: "audit-002",
        timestamp: "2025-08-03T21:42:15Z",
        action: "GTT Yield Distribution",
        actor: "dao-contract",
        target: "yield-pool-4",
        severity: "low" as const,
        status: "resolved" as const,
        details: "Weekly yield distribution completed successfully",
        txHash: "0xdef456...",
        blockNumber: 18950220
      },
      {
        id: "audit-003",
        timestamp: "2025-08-03T21:40:30Z",
        action: "Multisig Transaction",
        actor: "guardian-council",
        target: "treasury-vault",
        severity: "medium" as const,
        status: "pending" as const,
        details: "Requires 3/5 signatures for 50,000 GTT transfer",
        txHash: "0x789abc...",
        blockNumber: 18950210
      },
      {
        id: "audit-004",
        timestamp: "2025-08-03T21:38:45Z",
        action: "Validator Slashing",
        actor: "slashing-contract",
        target: "validator-0x5678",
        severity: "critical" as const,
        status: "resolved" as const,
        details: "Validator slashed for double attestation",
        txHash: "0x456def...",
        blockNumber: 18950195
      },
      {
        id: "audit-005",
        timestamp: "2025-08-03T21:35:12Z",
        action: "Cross-chain Attestation",
        actor: "bridge-validator",
        target: "polygon-sync",
        severity: "low" as const,
        status: "resolved" as const,
        details: "Polygon attestation synchronized successfully",
        txHash: "0x123789...",
        blockNumber: 18950180
      }
    ] as AuditLog[]
  };

  const data = auditData || mockData;
  
  const filteredLogs = data.logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'investigating': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 max-w-7xl mx-auto text-white space-y-6">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">🔍 DAO Audit Trail</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl animate-pulse">
              <div className="h-16 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto text-white space-y-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">🔍 DAO Audit Trail</h1>
        <p className="text-purple-300 text-lg mb-6">
          Comprehensive audit logging and metadata tracking for all DAO operations
        </p>
      </div>

      {/* Audit Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Total Logs</p>
          <p className="text-2xl font-bold text-blue-400">{data.summary.totalLogs.toLocaleString()}</p>
          <p className="text-xs text-slate-500">All operations</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Pending Actions</p>
          <p className="text-2xl font-bold text-yellow-400">{data.summary.pendingActions}</p>
          <p className="text-xs text-slate-500">Awaiting resolution</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Critical Issues</p>
          <p className="text-2xl font-bold text-red-400">{data.summary.criticalIssues}</p>
          <p className="text-xs text-slate-500">Needs attention</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Resolved Today</p>
          <p className="text-2xl font-bold text-green-400">{data.summary.resolvedToday}</p>
          <p className="text-xs text-slate-500">Issues fixed</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <Shield className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Attestations</p>
          <p className="text-2xl font-bold text-purple-400">{data.summary.validatorAttestations}</p>
          <p className="text-xs text-slate-500">Validator signed</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-purple-300">Filter Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600"
              />
            </div>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Export Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <div>
        <h2 className="text-2xl font-bold text-purple-300 mb-6">Recent Audit Events</h2>
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <h3 className="text-purple-300 font-medium">{log.action}</h3>
                      <p className="text-sm text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getSeverityColor(log.severity)} capitalize`}>
                    {log.severity}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-400">Actor:</p>
                    <p className="text-blue-400 font-mono text-sm">{log.actor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Target:</p>
                    <p className="text-green-400 font-mono text-sm">{log.target}</p>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-4">{log.details}</p>
                
                {log.txHash && (
                  <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-400">Transaction Hash:</p>
                      <p className="text-yellow-400 font-mono text-sm">{log.txHash}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Block:</p>
                      <p className="text-purple-400 font-mono text-sm">{log.blockNumber?.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center text-slate-500 text-sm">
        Last updated: {new Date().toLocaleString()} • Auto-refresh every 30 seconds
      </div>
    </div>
  );
}