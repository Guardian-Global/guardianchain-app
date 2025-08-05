import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Vote, Users, DollarSign, Shield, Clock, Zap, 
  TrendingUp, Activity, Award, Target, 
  Sparkles, Layers, Eye, Plus,
  ArrowUp, ArrowDown, Calendar, Coins
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { EnhancedGuardianLogo } from "@/components/EnhancedGuardianLogo";

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
  governanceRewards: number;
  totalVotes: number;
  participationRate: number;
  avgQuorum: number;
}

export default function DAO() {
  const [selectedTab, setSelectedTab] = useState("proposals");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [newProposalTitle, setNewProposalTitle] = useState("");
  const [newProposalDescription, setNewProposalDescription] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Live time update for countdowns
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: proposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ["/api/dao/proposals"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dao/stats"],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Mock data for when API isn't ready
  const mockProposals: Proposal[] = [
    {
      id: "prop-1",
      title: "Increase Truth Validator Rewards by 25%",
      description: "Proposal to enhance validator compensation to attract more high-quality truth verifiers to the network.",
      status: "active",
      votesFor: 12450,
      votesAgainst: 3210,
      totalVotes: 15660,
      endDate: "2025-01-15",
      requiredGTT: 100
    },
    {
      id: "prop-2", 
      title: "Launch Community Truth Bounty Program",
      description: "Establish a 50,000 GTT fund for community-driven truth verification bounties targeting misinformation.",
      status: "active",
      votesFor: 8920,
      votesAgainst: 1480,
      totalVotes: 10400,
      endDate: "2025-01-20",
      requiredGTT: 250
    },
    {
      id: "prop-3",
      title: "Upgrade Guardian AI Truth Detection",
      description: "Implement next-generation AI models for enhanced truth detection with 95%+ accuracy.",
      status: "passed",
      votesFor: 18750,
      votesAgainst: 2100,
      totalVotes: 20850,
      endDate: "2025-01-10",
      requiredGTT: 500
    }
  ];

  const mockStats: DAOStats = {
    totalMembers: 45280,
    totalGTT: 12847650,
    activeProposals: 7,
    treasuryBalance: 894750,
    governanceRewards: 125600,
    totalVotes: 156789,
    participationRate: 78.4,
    avgQuorum: 85.2
  };

  const displayProposals = proposals || mockProposals;
  const displayStats = stats || mockStats;

  const voteMutation = useMutation({
    mutationFn: async ({ proposalId, vote, gttAmount }: { proposalId: string; vote: string; gttAmount: number }) => {
      return await apiRequest("POST", "/api/dao/vote", { proposalId, vote, gttAmount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dao/proposals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dao/stats"] });
      toast({
        title: "🚀 Vote Cast Successfully",
        description: "Your vote has been recorded on the blockchain with quantum verification.",
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Vote Failed",
        description: "Failed to cast your vote. Please check your GTT balance and try again.",
        variant: "destructive",
      });
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: async ({ title, description }: { title: string; description: string }) => {
      return await apiRequest("POST", "/api/dao/proposals", { title, description });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dao/proposals"] });
      setIsCreateModalOpen(false);
      setNewProposalTitle("");
      setNewProposalDescription("");
      toast({
        title: "✨ Proposal Created",
        description: "Your proposal has been submitted to the Guardian DAO for voting.",
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Creation Failed",
        description: "Failed to create proposal. Ensure you have sufficient GTT stake.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    const gttAmount = Math.floor(Math.random() * 500) + 100; // Simulate varying GTT amounts
    voteMutation.mutate({ proposalId, vote, gttAmount });
  };

  const handleCreateProposal = () => {
    if (!newProposalTitle.trim() || !newProposalDescription.trim()) {
      toast({
        title: "⚠️ Incomplete Form",
        description: "Please fill in both title and description.",
        variant: "destructive",
      });
      return;
    }
    createProposalMutation.mutate({
      title: newProposalTitle,
      description: newProposalDescription
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = currentTime;
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] text-[#f0f6fc] relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-[#00ffe1]/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff00d4]/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1] 
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#7c3aed]/5 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 30, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Supreme Cyberpunk Hero Header */}
          <motion.div 
            className="relative mb-8 p-8 rounded-2xl bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,255,225,0.1)]"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffe1]/10 to-[#ff00d4]/10" />
            
            {/* Animated Border Effect */}
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "linear-gradient(45deg, transparent, #00ffe1, transparent, #ff00d4, transparent)",
                backgroundSize: "400% 400%"
              }}
              animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-[#161b22]/90 to-[#0d1117]/90" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <EnhancedGuardianLogo size="lg" variant="full" animated={true} />
                <div>
                  <motion.h1 
                    className="text-5xl font-bold text-transparent bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text font-[Orbitron] mb-2"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    GUARDIAN DAO
                  </motion.h1>
                  <motion.div 
                    className="text-xs text-[#00ffe1] font-mono tracking-[0.2em] mb-4 opacity-80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 1, delay: 0.7 }}
                  >
                    <span className="inline-block mr-2">QUANTUM</span>
                    <span className="opacity-60 mr-2">•</span>
                    <span className="inline-block mr-2">GOVERNANCE</span>
                    <span className="opacity-60 mr-2">•</span>
                    <span className="inline-block">PROTOCOL</span>
                  </motion.div>
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.9 }}
                  >
                    <p className="text-lg text-[#8b949e] max-w-3xl leading-relaxed font-light">
                      Decentralized sovereign governance for the truth vault ecosystem.
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1 rounded-full bg-[#00ffe1]/10 text-[#00ffe1] border border-[#00ffe1]/20 font-medium">
                        Quantum-Verified Votes
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#ff00d4]/10 text-[#ff00d4] border border-[#ff00d4]/20 font-medium">
                        Protocol Evolution
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 font-medium">
                        Truth Rewards
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              <motion.div 
                className="text-right"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
              >
                <div className="text-sm text-[#8b949e] mb-1">Your Voting Power</div>
                <div className="text-3xl font-bold text-[#00ffe1] font-[Orbitron]">2,131 VP</div>
                <div className="text-xs text-[#ff00d4]">Truth Score: 87/100</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Advanced Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { 
                icon: Users, 
                color: "#00ffe1", 
                label: "Guardian Members", 
                value: displayStats.totalMembers.toLocaleString(),
                subtext: "Active Validators",
                gradient: "from-[#00ffe1]/20 to-[#059669]/20"
              },
              { 
                icon: Coins, 
                color: "#ff00d4", 
                label: "Total GTT Staked", 
                value: `${(displayStats.totalGTT / 1000000).toFixed(1)}M`,
                subtext: `$${(displayStats.totalGTT * 0.127).toLocaleString()}`,
                gradient: "from-[#ff00d4]/20 to-[#ec4899]/20"
              },
              { 
                icon: Vote, 
                color: "#7c3aed", 
                label: "Active Proposals", 
                value: displayStats.activeProposals.toString(),
                subtext: `${displayStats.participationRate}% participation`,
                gradient: "from-[#7c3aed]/20 to-[#a855f7]/20"
              },
              { 
                icon: Shield, 
                color: "#10b981", 
                label: "Treasury Value", 
                value: `$${(displayStats.treasuryBalance / 1000).toFixed(0)}K`,
                subtext: "Multi-sig secured",
                gradient: "from-[#10b981]/20 to-[#059669]/20"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: `0 0 30px ${stat.color}40`
                }}
              >
                <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 backdrop-blur-sm border border-[#30363d] hover:border-[#30363d]/80 transition-all duration-300 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-[#161b22]/60 border border-[#30363d]/50 flex items-center justify-center backdrop-blur-sm"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        style={{ 
                          boxShadow: `0 0 20px ${stat.color}30`
                        }}
                      >
                        <stat.icon 
                          className="w-6 h-6" 
                          style={{ color: stat.color }}
                        />
                      </motion.div>
                      <TrendingUp className="w-4 h-4 text-[#10b981] opacity-60" />
                    </div>
                    <div>
                      <p className="text-sm text-[#8b949e] mb-2 font-medium">{stat.label}</p>
                      <p 
                        className="text-3xl font-bold font-[Orbitron] mb-2"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-[#8b949e] opacity-80">{stat.subtext}</p>
                    </div>
                    
                    {/* Enhanced pulse effect */}
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 rounded-full"
                      style={{ 
                        background: `linear-gradient(to right, ${stat.color}, transparent)`
                      }}
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Supreme Quantum Tabs */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-[#161b22]/80 border border-[#30363d] p-2 rounded-xl backdrop-blur-sm">
                  {[
                    { value: "proposals", icon: Vote, label: "Proposals", color: "#00ffe1" },
                    { value: "governance", icon: Users, label: "Governance", color: "#ff00d4" },
                    { value: "treasury", icon: DollarSign, label: "Treasury", color: "#7c3aed" },
                    { value: "analytics", icon: Activity, label: "Analytics", color: "#10b981" }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="relative px-6 py-3 rounded-lg transition-all duration-300 text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#30363d]/50"
                      style={{
                        ...(selectedTab === tab.value && {
                          background: `linear-gradient(135deg, ${tab.color}20, ${tab.color}10)`,
                          borderColor: `${tab.color}60`,
                          boxShadow: `0 0 20px ${tab.color}30`,
                          color: tab.color
                        })
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </div>
                      {selectedTab === tab.value && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{ backgroundColor: tab.color }}
                          layoutId="activeTab"
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {selectedTab === "proposals" && (
                  <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-[#00ffe1] to-[#059669] text-[#0d1117] hover:from-[#00e5cb] hover:to-[#047857] shadow-[0_0_20px_rgba(0,255,225,0.3)] font-semibold">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Proposal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#161b22] border-[#30363d] max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-[#f0f6fc] text-xl font-bold">
                          Create New Governance Proposal
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 pt-6">
                        <div>
                          <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                            Proposal Title
                          </label>
                          <Input
                            value={newProposalTitle}
                            onChange={(e) => setNewProposalTitle(e.target.value)}
                            placeholder="Enter proposal title..."
                            className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc] placeholder:text-[#8b949e]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                            Description
                          </label>
                          <Textarea
                            value={newProposalDescription}
                            onChange={(e) => setNewProposalDescription(e.target.value)}
                            placeholder="Describe your proposal in detail..."
                            rows={4}
                            className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc] placeholder:text-[#8b949e]"
                          />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button 
                            onClick={handleCreateProposal}
                            disabled={createProposalMutation.isPending}
                            className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb] flex-1"
                          >
                            {createProposalMutation.isPending ? (
                              <>
                                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Submit Proposal
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsCreateModalOpen(false)}
                            className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <TabsContent value="proposals" className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {displayProposals.map((proposal, index) => (
                      <motion.div
                        key={proposal.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] hover:border-[#00ffe1]/30 transition-all duration-300 backdrop-blur-sm overflow-hidden group">
                          {/* Quantum glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00ffe1]/5 via-transparent to-[#ff00d4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <CardHeader className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <CardTitle className="text-[#f0f6fc] text-xl font-bold">
                                    {proposal.title}
                                  </CardTitle>
                                  <Badge 
                                    variant="outline" 
                                    className={`px-3 py-1 font-semibold ${
                                      proposal.status === 'active' 
                                        ? 'border-[#00ffe1] text-[#00ffe1] bg-[#00ffe1]/10 shadow-[0_0_10px_rgba(0,255,225,0.3)]' 
                                        : proposal.status === 'passed'
                                        ? 'border-[#10b981] text-[#10b981] bg-[#10b981]/10 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                        : 'border-[#f85149] text-[#f85149] bg-[#f85149]/10 shadow-[0_0_10px_rgba(248,81,73,0.3)]'
                                    }`}
                                  >
                                    {proposal.status.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-[#8b949e] leading-relaxed">{proposal.description}</p>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="relative z-10">
                            <div className="space-y-4">
                              {/* Enhanced voting stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-[#0d1117]/50 border border-[#30363d]/50">
                                <div className="text-center">
                                  <div className="text-sm text-[#8b949e] mb-1">Total Votes</div>
                                  <div className="text-lg font-bold text-[#f0f6fc] font-[Orbitron]">
                                    {proposal.totalVotes.toLocaleString()}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm text-[#8b949e] mb-1">Required GTT</div>
                                  <div className="text-lg font-bold text-[#ff00d4] font-[Orbitron]">
                                    {proposal.requiredGTT}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm text-[#8b949e] mb-1">Time Left</div>
                                  <div className="text-lg font-bold text-[#00ffe1] font-[Orbitron]">
                                    {getTimeRemaining(proposal.endDate)}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm text-[#8b949e] mb-1">Quorum</div>
                                  <div className="text-lg font-bold text-[#7c3aed] font-[Orbitron]">
                                    {Math.round((proposal.totalVotes / displayStats.totalMembers) * 100)}%
                                  </div>
                                </div>
                              </div>
                              
                              {/* Advanced progress visualization */}
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm font-medium">
                                  <div className="flex items-center gap-2">
                                    <ArrowUp className="w-4 h-4 text-[#10b981]" />
                                    <span className="text-[#10b981]">For: {proposal.votesFor.toLocaleString()}</span>
                                    <span className="text-[#8b949e]">
                                      ({Math.round((proposal.votesFor / proposal.totalVotes) * 100)}%)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#8b949e]">
                                      ({Math.round((proposal.votesAgainst / proposal.totalVotes) * 100)}%)
                                    </span>
                                    <span className="text-[#f85149]">Against: {proposal.votesAgainst.toLocaleString()}</span>
                                    <ArrowDown className="w-4 h-4 text-[#f85149]" />
                                  </div>
                                </div>
                                
                                <div className="relative h-4 bg-[#21262d] rounded-full overflow-hidden">
                                  <motion.div 
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                  />
                                  <motion.div 
                                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#f85149] to-[#dc2626] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(proposal.votesAgainst / proposal.totalVotes) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.7 }}
                                  />
                                </div>
                              </div>

                              {/* Enhanced action buttons */}
                              <div className="flex gap-3 pt-4">
                                <Button 
                                  className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] shadow-[0_0_15px_rgba(16,185,129,0.3)] flex-1"
                                  onClick={() => handleVote(proposal.id, 'for')}
                                  disabled={voteMutation.isPending || proposal.status !== 'active'}
                                  data-testid={`vote-for-${proposal.id}`}
                                >
                                  <ArrowUp className="w-4 h-4 mr-2" />
                                  Vote For
                                </Button>
                                <Button 
                                  className="bg-gradient-to-r from-[#f85149] to-[#dc2626] text-white hover:from-[#dc2626] hover:to-[#b91c1c] shadow-[0_0_15px_rgba(248,81,73,0.3)] flex-1"
                                  onClick={() => handleVote(proposal.id, 'against')}
                                  disabled={voteMutation.isPending || proposal.status !== 'active'}
                                  data-testid={`vote-against-${proposal.id}`}
                                >
                                  <ArrowDown className="w-4 h-4 mr-2" />
                                  Vote Against
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#30363d]/50 hover:border-[#00ffe1]/30"
                                  onClick={() => setSelectedProposal(proposal)}
                                  data-testid={`view-details-${proposal.id}`}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="governance" className="space-y-6">
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Enhanced Governance Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-[#00ffe1] text-xl font-bold flex items-center gap-2">
                          <Target className="w-6 h-6" />
                          Your Voting Power
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <p className="text-[#8b949e] leading-relaxed">
                          Your voting power is calculated using a quantum algorithm that weighs GTT holdings, Truth Score, and participation history.
                        </p>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-[#0d1117]/50 border border-[#30363d]/50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#8b949e]">GTT Holdings:</span>
                              <span className="text-[#f0f6fc] font-bold font-[Orbitron]">2,450 GTT</span>
                            </div>
                            <Progress value={68} className="h-2 bg-[#21262d]" />
                          </div>
                          <div className="p-4 rounded-lg bg-[#0d1117]/50 border border-[#30363d]/50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#8b949e]">Truth Score:</span>
                              <span className="text-[#f0f6fc] font-bold font-[Orbitron]">87/100</span>
                            </div>
                            <Progress value={87} className="h-2 bg-[#21262d]" />
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-r from-[#00ffe1]/10 to-[#059669]/10 border border-[#00ffe1]/30">
                            <div className="flex justify-between items-center">
                              <span className="text-[#00ffe1] font-semibold">Total Voting Power:</span>
                              <span className="text-[#00ffe1] font-bold text-2xl font-[Orbitron]">2,131 VP</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-[#ff00d4] text-xl font-bold flex items-center gap-2">
                          <Award className="w-6 h-6" />
                          Participation & Rewards
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <p className="text-[#8b949e] leading-relaxed">
                          Earn GTT rewards for active participation in governance decisions and protocol evolution.
                        </p>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-[#0d1117]/50 border border-[#30363d]/50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#8b949e]">Proposals Voted:</span>
                              <span className="text-[#f0f6fc] font-bold font-[Orbitron]">23/28</span>
                            </div>
                            <Progress value={82} className="h-2 bg-[#21262d]" />
                          </div>
                          <div className="p-4 rounded-lg bg-[#0d1117]/50 border border-[#30363d]/50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#8b949e]">Participation Rate:</span>
                              <span className="text-[#f0f6fc] font-bold font-[Orbitron]">82%</span>
                            </div>
                            <Progress value={82} className="h-2 bg-[#21262d]" />
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-r from-[#ff00d4]/10 to-[#ec4899]/10 border border-[#ff00d4]/30">
                            <div className="flex justify-between items-center">
                              <span className="text-[#ff00d4] font-semibold">Governance Rewards:</span>
                              <span className="text-[#ff00d4] font-bold text-2xl font-[Orbitron]">156 GTT</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Governance Activity */}
                  <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-[#7c3aed] text-xl font-bold flex items-center gap-2">
                        <Activity className="w-6 h-6" />
                        Recent Governance Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: "Voted FOR", proposal: "Increase Truth Validator Rewards", time: "2 hours ago", reward: "+5 GTT" },
                          { action: "Voted FOR", proposal: "Launch Community Truth Bounty", time: "1 day ago", reward: "+3 GTT" },
                          { action: "Created", proposal: "Enhanced AI Truth Detection", time: "3 days ago", reward: "+10 GTT" },
                          { action: "Voted AGAINST", proposal: "Reduce Staking Requirements", time: "1 week ago", reward: "+2 GTT" }
                        ].map((activity, index) => (
                          <motion.div 
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg bg-[#0d1117]/30 border border-[#30363d]/50 hover:border-[#7c3aed]/30 transition-all"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                activity.action.includes('FOR') ? 'bg-[#10b981]' :
                                activity.action.includes('AGAINST') ? 'bg-[#f85149]' :
                                'bg-[#00ffe1]'
                              }`} />
                              <div>
                                <div className="text-[#f0f6fc] font-medium">{activity.action} {activity.proposal}</div>
                                <div className="text-[#8b949e] text-sm">{activity.time}</div>
                              </div>
                            </div>
                            <Badge className="bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]/30">
                              {activity.reward}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="treasury" className="space-y-6">
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Treasury Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { 
                        title: "Total Assets", 
                        value: "$894.7K", 
                        change: "+12.5%", 
                        color: "#7c3aed",
                        icon: Shield,
                        description: "Multi-sig secured"
                      },
                      { 
                        title: "Monthly Allocation", 
                        value: "$125.6K", 
                        change: "This month", 
                        color: "#10b981",
                        icon: DollarSign,
                        description: "Validator rewards & development"
                      },
                      { 
                        title: "Reserve Fund", 
                        value: "$450K", 
                        change: "Emergency", 
                        color: "#f79009",
                        icon: Shield,
                        description: "Protocol security buffer"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className={`bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] hover:border-[${item.color}]/50 transition-all duration-300 backdrop-blur-sm`}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <item.icon className={`w-8 h-8 text-[${item.color}]`} />
                              <TrendingUp className="w-4 h-4 text-[#10b981] opacity-60" />
                            </div>
                            <div>
                              <h4 className={`font-semibold text-[${item.color}] mb-2`}>{item.title}</h4>
                              <p className={`text-3xl font-bold text-[${item.color}] font-[Orbitron] mb-1`}>{item.value}</p>
                              <p className="text-sm text-[#8b949e] mb-2">{item.change}</p>
                              <p className="text-xs text-[#8b949e] opacity-80">{item.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Treasury Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-[#00ffe1] text-xl font-bold flex items-center gap-2">
                          <Layers className="w-6 h-6" />
                          Asset Allocation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { asset: "GTT Tokens", amount: "60%", value: "$536.8K", color: "#00ffe1" },
                          { asset: "USDC Stablecoin", amount: "25%", value: "$223.7K", color: "#10b981" },
                          { asset: "ETH Holdings", amount: "10%", value: "$89.5K", color: "#627eea" },
                          { asset: "Other Assets", amount: "5%", value: "$44.7K", color: "#ff00d4" }
                        ].map((asset, index) => (
                          <motion.div 
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-[#0d1117]/30 border border-[#30363d]/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full bg-[${asset.color}]`} />
                              <div>
                                <div className="text-[#f0f6fc] font-medium">{asset.asset}</div>
                                <div className="text-[#8b949e] text-sm">{asset.value}</div>
                              </div>
                            </div>
                            <div className={`text-[${asset.color}] font-bold font-[Orbitron]`}>
                              {asset.amount}
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-[#ff00d4] text-xl font-bold flex items-center gap-2">
                          <Calendar className="w-6 h-6" />
                          Recent Transactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { type: "Validator Rewards", amount: "-$15.2K", time: "2 hours ago", status: "completed" },
                          { type: "GTT Buyback", amount: "-$8.5K", time: "1 day ago", status: "completed" },
                          { type: "Dev Fund Allocation", amount: "-$25K", time: "3 days ago", status: "completed" },
                          { type: "Community Grant", amount: "-$5K", time: "1 week ago", status: "completed" }
                        ].map((tx, index) => (
                          <motion.div 
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-[#0d1117]/30 border border-[#30363d]/50 hover:border-[#ff00d4]/30 transition-all"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                              <div>
                                <div className="text-[#f0f6fc] font-medium">{tx.type}</div>
                                <div className="text-[#8b949e] text-sm">{tx.time}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#f85149] font-bold font-[Orbitron]">{tx.amount}</div>
                              <div className="text-[#10b981] text-xs">{tx.status}</div>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Total Votes Cast", value: "156.8K", change: "+15%", color: "#00ffe1" },
                      { label: "Avg Participation", value: "78.4%", change: "+5%", color: "#10b981" },
                      { label: "Proposals Passed", value: "67%", change: "+3%", color: "#7c3aed" },
                      { label: "Avg Quorum", value: "85.2%", change: "+8%", color: "#ff00d4" }
                    ].map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] backdrop-blur-sm">
                          <CardContent className="p-6 text-center">
                            <div className={`text-3xl font-bold text-[${metric.color}] font-[Orbitron] mb-2`}>
                              {metric.value}
                            </div>
                            <div className="text-[#8b949e] text-sm mb-1">{metric.label}</div>
                            <div className="text-[#10b981] text-xs">{metric.change} vs last month</div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Governance Trends */}
                  <Card className="bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80 border border-[#30363d] backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-[#00ffe1] text-xl font-bold flex items-center gap-2">
                        <Activity className="w-6 h-6" />
                        Governance Activity Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-[#ff00d4] font-semibold">Voting Patterns</h4>
                          {[
                            { category: "Protocol Upgrades", votes: 12450, percentage: 85 },
                            { category: "Treasury Allocation", votes: 9870, percentage: 72 },
                            { category: "Validator Changes", votes: 8920, percentage: 68 },
                            { category: "Community Grants", votes: 7650, percentage: 63 }
                          ].map((pattern, index) => (
                            <motion.div 
                              key={index}
                              className="space-y-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex justify-between text-sm">
                                <span className="text-[#f0f6fc]">{pattern.category}</span>
                                <span className="text-[#8b949e]">{pattern.votes.toLocaleString()} votes</span>
                              </div>
                              <Progress value={pattern.percentage} className="h-2 bg-[#21262d]" />
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-[#7c3aed] font-semibold">Member Engagement</h4>
                          <div className="space-y-3">
                            {[
                              { tier: "Sovereign Members", count: 1250, engagement: 95 },
                              { tier: "Creator Members", count: 8940, engagement: 82 },
                              { tier: "Seeker Members", count: 18760, engagement: 71 },
                              { tier: "Explorer Members", count: 16330, engagement: 45 }
                            ].map((tier, index) => (
                              <motion.div 
                                key={index}
                                className="p-3 rounded-lg bg-[#0d1117]/30 border border-[#30363d]/50"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[#f0f6fc] text-sm font-medium">{tier.tier}</span>
                                  <span className="text-[#8b949e] text-sm">{tier.count.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={tier.engagement} className="h-1.5 bg-[#21262d] flex-1" />
                                  <span className="text-[#7c3aed] text-sm font-bold">{tier.engagement}%</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}