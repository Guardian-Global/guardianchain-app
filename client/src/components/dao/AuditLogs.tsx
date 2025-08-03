import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollText, Search, Filter, Download, Shield, Clock, User } from "lucide-react";
import { useState } from "react";

interface AuditLog {
  id: string;
  event: string;
  timestamp: string;
  validator: string;
  transactionHash: string;
  eventType: "proposal" | "vote" | "disbursement" | "validation" | "multisig";
  chainId: string;
  gasUsed: number;
  details: string;
  severity: "low" | "medium" | "high" | "critical";
}

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["/api/audit/logs"],
  });

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-light/60">Loading audit logs...</p>
        </CardContent>
      </Card>
    );
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "proposal": return "text-blue-400 border-blue-500";
      case "vote": return "text-green-400 border-green-500";
      case "disbursement": return "text-yellow-400 border-yellow-500";
      case "validation": return "text-purple-400 border-purple-500";
      case "multisig": return "text-red-400 border-red-500";
      default: return "text-gray-400 border-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-black";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const filteredLogs = auditLogs?.filter((log: AuditLog) => {
    const matchesSearch = log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.validator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === "all" || log.eventType === eventFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    
    return matchesSearch && matchesEvent && matchesSeverity;
  }) || [];

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-brand-accent" />
          Public Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-light/50" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 bg-brand-surface border-brand-light/20 text-brand-light"
            />
          </div>
          
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="bg-brand-surface border-brand-light/20 text-brand-light">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="proposal">Proposals</SelectItem>
              <SelectItem value="vote">Votes</SelectItem>
              <SelectItem value="disbursement">Disbursements</SelectItem>
              <SelectItem value="validation">Validations</SelectItem>
              <SelectItem value="multisig">Multisig</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="bg-brand-surface border-brand-light/20 text-brand-light">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Audit Log Entries */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredLogs.map((log: AuditLog) => (
            <div key={log.id} className="p-4 bg-brand-surface rounded-lg border border-brand-light/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={getEventColor(log.eventType)}
                  >
                    {log.eventType}
                  </Badge>
                  <Badge 
                    className={getSeverityColor(log.severity)}
                  >
                    {log.severity}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-light/50">
                  <Clock className="w-3 h-3" />
                  {log.timestamp}
                </div>
              </div>

              <h4 className="font-medium text-brand-light mb-2">{log.event}</h4>
              <p className="text-sm text-brand-light/80 mb-3">{log.details}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-brand-accent" />
                  <span className="text-brand-light/60">Validator:</span>
                  <span className="text-brand-light">{log.validator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-brand-accent" />
                  <span className="text-brand-light/60">Chain:</span>
                  <span className="text-brand-light">{log.chainId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-light/60">Gas:</span>
                  <span className="text-brand-light">{log.gasUsed?.toLocaleString() || "N/A"}</span>
                </div>
              </div>

              <div className="mt-3 text-xs">
                <span className="text-brand-light/60">TX Hash:</span>
                <span className="text-brand-accent font-mono ml-2">{log.transactionHash}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-brand-light/60">No audit logs match your current filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}