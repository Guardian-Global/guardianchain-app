import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye,
  Shield,
  CheckCircle,
  AlertTriangle,
  Search,
  Star,
  Clock,
  Users
} from "lucide-react";

interface WitnessData {
  id: string;
  address: string;
  reputation: number;
  totalWitnesses: number;
  activeDisputes: number;
  successRate: number;
  stake: number;
  lastActive: string;
  status: "active" | "inactive" | "disputed";
}

interface DisputeData {
  id: string;
  capsuleId: string;
  witnessAddress: string;
  disputeType: string;
  status: "pending" | "resolved" | "escalated";
  createdAt: string;
  evidence: string[];
}

export default function WitnessBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWitness, setSelectedWitness] = useState<string | null>(null);

  const { data: witnesses, isLoading: witnessesLoading } = useQuery({
    queryKey: ["/api/dao/witnesses"],
  });

  const { data: disputes, isLoading: disputesLoading } = useQuery({
    queryKey: ["/api/dao/disputes"],
  });

  // Mock data for demonstration
  const mockWitnesses: WitnessData[] = [
    {
      id: "witness_001",
      address: "0x742d35cc6bf8a3a1234567890abcdef",
      reputation: 987,
      totalWitnesses: 234,
      activeDisputes: 2,
      successRate: 94.5,
      stake: 50000,
      lastActive: "2 hours ago",
      status: "active"
    },
    {
      id: "witness_002", 
      address: "0x8f5c7d2e9b1a4c5678901234abcdef56",
      reputation: 856,
      totalWitnesses: 187,
      activeDisputes: 0,
      successRate: 97.2,
      stake: 75000,
      lastActive: "1 hour ago",
      status: "active"
    },
    {
      id: "witness_003",
      address: "0x1a2b3c4d5e6f789012345678abcdef90",
      reputation: 623,
      totalWitnesses: 145,
      activeDisputes: 1,
      successRate: 91.8,
      stake: 30000,
      lastActive: "5 hours ago",
      status: "active"
    }
  ];

  const mockDisputes: DisputeData[] = [
    {
      id: "dispute_001",
      capsuleId: "cap_abc123",
      witnessAddress: "0x742d35cc6bf8a3a1234567890abcdef",
      disputeType: "Evidence Quality",
      status: "pending",
      createdAt: "2024-01-15T10:30:00Z",
      evidence: ["timestamp_mismatch.jpg", "metadata_analysis.pdf"]
    },
    {
      id: "dispute_002", 
      capsuleId: "cap_def456",
      witnessAddress: "0x1a2b3c4d5e6f789012345678abcdef90",
      disputeType: "Truth Score Dispute",
      status: "escalated",
      createdAt: "2024-01-14T15:45:00Z",
      evidence: ["witness_report.pdf", "ai_analysis.json"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-brand-surface text-brand-light border-brand-surface";
    }
  };

  const getDisputeStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "escalated":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-brand-surface text-brand-light border-brand-surface";
    }
  };

  if (witnessesLoading || disputesLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-light/60">Loading witness board...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-primary" />
            Witness Network Board
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="witnesses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-brand-surface">
              <TabsTrigger 
                value="witnesses"
                className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Witnesses
              </TabsTrigger>
              <TabsTrigger 
                value="disputes"
                className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Disputes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="witnesses" className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-light/40" />
                <Input
                  placeholder="Search witnesses by address or reputation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-brand-surface border-brand-primary/20 text-brand-light"
                />
              </div>

              {/* Witnesses List */}
              <div className="space-y-3">
                {mockWitnesses.map((witness) => (
                  <Card key={witness.id} className="bg-brand-surface border-brand-primary/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-brand-primary" />
                            <span className="text-brand-light font-mono text-sm">
                              {witness.address}
                            </span>
                            <Badge className={getStatusColor(witness.status)}>
                              {witness.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-brand-light/60">Reputation</div>
                              <div className="text-brand-light font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3 text-brand-warning" />
                                {witness.reputation}
                              </div>
                            </div>
                            <div>
                              <div className="text-brand-light/60">Success Rate</div>
                              <div className="text-brand-light font-semibold">
                                {witness.successRate}%
                              </div>
                            </div>
                            <div>
                              <div className="text-brand-light/60">Total Witnesses</div>
                              <div className="text-brand-light font-semibold">
                                {witness.totalWitnesses}
                              </div>
                            </div>
                            <div>
                              <div className="text-brand-light/60">Stake</div>
                              <div className="text-brand-light font-semibold">
                                {witness.stake.toLocaleString()} GTT
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-brand-light/60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Last active: {witness.lastActive}
                            </span>
                            {witness.activeDisputes > 0 && (
                              <span className="flex items-center gap-1 text-yellow-400">
                                <AlertTriangle className="w-3 h-3" />
                                {witness.activeDisputes} active dispute{witness.activeDisputes > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-brand-primary/20 text-brand-light hover:bg-brand-primary/10"
                          onClick={() => setSelectedWitness(witness.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="disputes" className="space-y-4">
              <div className="space-y-3">
                {mockDisputes.map((dispute) => (
                  <Card key={dispute.id} className="bg-brand-surface border-brand-primary/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-brand-warning" />
                            <span className="text-brand-light font-semibold">
                              {dispute.disputeType}
                            </span>
                            <Badge className={getDisputeStatusColor(dispute.status)}>
                              {dispute.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-brand-light/60">Capsule ID</div>
                              <div className="text-brand-light font-mono">
                                {dispute.capsuleId}
                              </div>
                            </div>
                            <div>
                              <div className="text-brand-light/60">Witness Address</div>
                              <div className="text-brand-light font-mono text-xs">
                                {dispute.witnessAddress}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-brand-light/60 text-xs">Evidence Files:</div>
                            <div className="flex gap-2">
                              {dispute.evidence.map((file, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {file}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="text-xs text-brand-light/60">
                            Created: {new Date(dispute.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-brand-primary/20 text-brand-light hover:bg-brand-primary/10"
                        >
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}