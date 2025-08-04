import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Vote, Users, DollarSign, Shield, Clock, Zap } from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: "active" | "passed" | "rejected";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endDate: string;
  requiredGTT: number;
}

interface DAOStats {
  totalMembers: number;
  totalGTT: number;
  activeProposals: number;
  treasuryBalance: number;
}

export default function DAO() {
  const [selectedTab, setSelectedTab] = useState("proposals");

  const { data: proposals } = useQuery({
    queryKey: ["/api/dao/proposals"],
    queryFn: () => Promise.resolve([
      {
        id: "prop-1",
        title: "Increase Validator Rewards",
        description: "Proposal to increase validator rewards by 15% to incentivize network security.",
        status: "active" as const,
        votesFor: 12500,
        votesAgainst: 3200,
        totalVotes: 15700,
        endDate: "2025-08-10",
        requiredGTT: 1000
      },
      {
        id: "prop-2", 
        title: "New Truth Portal Integration",
        description: "Add support for academic research submissions with specialized verification.",
        status: "active" as const,
        votesFor: 8900,
        votesAgainst: 2100,
        totalVotes: 11000,
        endDate: "2025-08-08",
        requiredGTT: 500
      }
    ])
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dao/stats"],
    queryFn: () => Promise.resolve({
      totalMembers: 2847,
      totalGTT: 156780,
      activeProposals: 3,
      treasuryBalance: 89340
    })
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cyberpunk Hero Header */}
        <div className="relative mb-8 p-8 rounded-lg bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffe1]/5 to-[#ff00d4]/5" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-[#00ffe1] font-[Orbitron] mb-2 drop-shadow-[0_0_10px_rgba(0,255,225,0.3)]">
              GuardianChain DAO
            </h1>
            <p className="text-xl text-[#8b949e] max-w-2xl">
              Decentralized governance for the truth vault ecosystem. Vote on proposals and shape the future.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#00ffe1]" />
                <div>
                  <p className="text-sm text-[#8b949e]">Total Members</p>
                  <p className="text-2xl font-bold text-[#f0f6fc]">{stats?.totalMembers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161b22] border-[#30363d] hover:border-[#ff00d4]/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-[#ff00d4]" />
                <div>
                  <p className="text-sm text-[#8b949e]">Total GTT</p>
                  <p className="text-2xl font-bold text-[#f0f6fc]">{stats?.totalGTT.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161b22] border-[#30363d] hover:border-[#7c3aed]/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Vote className="w-8 h-8 text-[#7c3aed]" />
                <div>
                  <p className="text-sm text-[#8b949e]">Active Proposals</p>
                  <p className="text-2xl font-bold text-[#f0f6fc]">{stats?.activeProposals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161b22] border-[#30363d] hover:border-[#10b981]/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-[#10b981]" />
                <div>
                  <p className="text-sm text-[#8b949e]">Treasury</p>
                  <p className="text-2xl font-bold text-[#f0f6fc]">${stats?.treasuryBalance.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-[#161b22] border-[#30363d] p-1">
            <TabsTrigger 
              value="proposals" 
              className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-[#0d1117] text-[#8b949e]"
            >
              <Vote className="w-4 h-4 mr-2" />
              Proposals
            </TabsTrigger>
            <TabsTrigger 
              value="governance" 
              className="data-[state=active]:bg-[#ff00d4] data-[state=active]:text-[#0d1117] text-[#8b949e]"
            >
              <Users className="w-4 h-4 mr-2" />
              Governance
            </TabsTrigger>
            <TabsTrigger 
              value="treasury" 
              className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-[#0d1117] text-[#8b949e]"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Treasury
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#f0f6fc]">Active Proposals</h2>
              <Button className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb] shadow-[0_0_10px_rgba(0,255,225,0.3)]">
                <Zap className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </div>

            <div className="space-y-4">
              {proposals?.map((proposal) => (
                <Card key={proposal.id} className="bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/20 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-[#f0f6fc] mb-2">{proposal.title}</CardTitle>
                        <p className="text-[#8b949e]">{proposal.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          proposal.status === 'active' 
                            ? 'border-[#00ffe1] text-[#00ffe1]' 
                            : proposal.status === 'passed'
                            ? 'border-[#10b981] text-[#10b981]'
                            : 'border-[#f85149] text-[#f85149]'
                        }`}
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-[#8b949e]">
                        <span>Votes: {proposal.totalVotes.toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Ends: {proposal.endDate}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#10b981]">For: {proposal.votesFor.toLocaleString()}</span>
                          <span className="text-[#f85149]">Against: {proposal.votesAgainst.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(proposal.votesFor / proposal.totalVotes) * 100} 
                          className="h-2 bg-[#21262d]"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button 
                          variant="outline" 
                          className="border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10"
                        >
                          Vote For
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-[#f85149] text-[#f85149] hover:bg-[#f85149]/10"
                        >
                          Vote Against
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#30363d]"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc]">Governance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#00ffe1]">Voting Power</h3>
                    <p className="text-[#8b949e]">Your voting power is determined by your GTT holdings and Truth Score.</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#8b949e]">GTT Holdings:</span>
                        <span className="text-[#f0f6fc] font-semibold">2,450 GTT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b949e]">Truth Score:</span>
                        <span className="text-[#f0f6fc] font-semibold">87/100</span>
                      </div>
                      <div className="flex justify-between border-t border-[#30363d] pt-2">
                        <span className="text-[#00ffe1]">Total Voting Power:</span>
                        <span className="text-[#00ffe1] font-bold">2,131 VP</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#ff00d4]">Participation</h3>
                    <p className="text-[#8b949e]">Your governance participation history and rewards.</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#8b949e]">Proposals Voted:</span>
                        <span className="text-[#f0f6fc] font-semibold">23/28</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b949e]">Participation Rate:</span>
                        <span className="text-[#f0f6fc] font-semibold">82%</span>
                      </div>
                      <div className="flex justify-between border-t border-[#30363d] pt-2">
                        <span className="text-[#ff00d4]">Governance Rewards:</span>
                        <span className="text-[#ff00d4] font-bold">156 GTT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treasury" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc]">Treasury Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#7c3aed]">Total Assets</h4>
                    <p className="text-2xl font-bold text-[#f0f6fc]">$89,340</p>
                    <p className="text-sm text-[#8b949e]">+12.5% this month</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#10b981]">Monthly Allocation</h4>
                    <p className="text-2xl font-bold text-[#f0f6fc]">$12,500</p>
                    <p className="text-sm text-[#8b949e]">For validator rewards</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#f79009]">Reserve Fund</h4>
                    <p className="text-2xl font-bold text-[#f0f6fc]">$45,000</p>
                    <p className="text-sm text-[#8b949e]">Emergency reserves</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}