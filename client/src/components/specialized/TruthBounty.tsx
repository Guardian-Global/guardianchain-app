import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Target, DollarSign, Users, Clock, Award, TrendingUp, Loader2 } from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

interface TruthBountyProps {
  onBountyCreated?: (bountyData: any) => void;
}

export default function TruthBounty({ onBountyCreated }: TruthBountyProps) {
  const { toast } = useToast();
  const [bountyTitle, setBountyTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("general");

  const categories = [
    { value: "general", label: "General Investigation" },
    { value: "corporate", label: "Corporate Transparency" },
    { value: "government", label: "Government Accountability" },
    { value: "environmental", label: "Environmental Truth" },
    { value: "healthcare", label: "Healthcare Transparency" },
    { value: "financial", label: "Financial Fraud" },
    { value: "media", label: "Media Accuracy" },
    { value: "scientific", label: "Scientific Integrity" },
  ];

  // Fetch active bounties
  const { data: activeBounties } = useQuery({
    queryKey: ["/api/truth-bounty/active"],
    retry: false,
  });

  const createBountyMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/truth-bounty", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Truth Bounty Created",
        description: "Your bounty has been posted for the community to investigate.",
      });
      onBountyCreated?.(data);
      // Reset form
      setBountyTitle("");
      setDescription("");
      setRewardAmount("");
      setDeadline("");
      setCategory("general");
    },
    onError: (error: any) => {
      toast({
        title: "Bounty Creation Failed",
        description: error.message || "Failed to create truth bounty.",
        variant: "destructive",
      });
    },
  });

  const handleCreateBounty = () => {
    if (!bountyTitle.trim() || !description.trim() || !rewardAmount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createBountyMutation.mutate({
      title: bountyTitle.trim(),
      description: description.trim(),
      rewardAmount: parseFloat(rewardAmount),
      deadline: deadline || null,
      category,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Truth Bounty</h1>
        <p className="text-slate-400">
          Crowdsource truth discovery by offering rewards for verified information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Bounty */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
              Create Truth Bounty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Bounty Title *</label>
              <Input
                value={bountyTitle}
                onChange={(e) => setBountyTitle(e.target.value)}
                placeholder="What truth are you seeking?"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what information you're looking for, sources to investigate, or specific evidence needed..."
                className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Reward (GTT) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  placeholder="100.00"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Deadline (Optional)</label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <Button
              onClick={handleCreateBounty}
              disabled={createBountyMutation.isPending}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {createBountyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Bounty...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Create Truth Bounty
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Active Bounties */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
              Active Bounties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mock active bounties */}
            {[
              {
                id: "1",
                title: "Corporate Environmental Cover-up",
                category: "environmental",
                reward: 500,
                deadline: "2025-02-15",
                submissions: 3,
              },
              {
                id: "2",
                title: "Healthcare Data Manipulation",
                category: "healthcare",
                reward: 750,
                deadline: "2025-02-20",
                submissions: 7,
              },
              {
                id: "3",
                title: "Election Transparency Investigation",
                category: "government",
                reward: 1000,
                deadline: "2025-03-01",
                submissions: 12,
              },
            ].map((bounty) => (
              <Card key={bounty.id} className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white text-sm">{bounty.title}</h3>
                    <Badge variant="outline" className="text-green-400 border-green-600">
                      {bounty.reward} GTT
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="capitalize">{bounty.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {bounty.submissions}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(bounty.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full border-slate-600 text-slate-300">
              View All Bounties
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">How Truth Bounty Works</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="font-semibold text-white">1. Post Bounty</h3>
            <p className="text-sm text-slate-400">Create a bounty with reward and deadline</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">2. Community Investigates</h3>
            <p className="text-sm text-slate-400">Truth seekers research and submit evidence</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">3. Verification</h3>
            <p className="text-sm text-slate-400">Submissions are verified by the community</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">4. Reward Distribution</h3>
            <p className="text-sm text-slate-400">GTT rewards are distributed to contributors</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}