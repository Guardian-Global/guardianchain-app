import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Target, DollarSign, Users, Clock, TrendingUp, Award, Eye } from "lucide-react";

export default function TruthBountyPage() {
  const [bountyData, setBountyData] = useState({
    title: "",
    description: "",
    reward: 100,
    deadline: "7",
    category: "investigation"
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Truth Bounty Created",
      description: `${bountyData.reward} GTT bounty posted for community investigation.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Truth Bounty
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Crowdsource truth investigations. Post GTT token rewards for community researchers 
            to uncover evidence and verify claims through collaborative investigation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Create Investigation Bounty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Investigation Title"
                  value={bountyData.title}
                  onChange={(e) => setBountyData({...bountyData, title: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
                <Textarea
                  placeholder="Describe what needs to be investigated, evidence required, and success criteria..."
                  value={bountyData.description}
                  onChange={(e) => setBountyData({...bountyData, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 min-h-[150px]"
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Reward (GTT)</label>
                    <Input
                      type="number"
                      min="10"
                      value={bountyData.reward}
                      onChange={(e) => setBountyData({...bountyData, reward: parseInt(e.target.value)})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Deadline (Days)</label>
                    <select 
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                      value={bountyData.deadline}
                      onChange={(e) => setBountyData({...bountyData, deadline: e.target.value})}
                    >
                      <option value="3">3 Days</option>
                      <option value="7">1 Week</option>
                      <option value="14">2 Weeks</option>
                      <option value="30">1 Month</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Category</label>
                    <select 
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                      value={bountyData.category}
                      onChange={(e) => setBountyData({...bountyData, category: e.target.value})}
                    >
                      <option value="investigation">Investigation</option>
                      <option value="verification">Verification</option>
                      <option value="research">Research</option>
                      <option value="documentation">Documentation</option>
                    </select>
                  </div>
                </div>
                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Post Truth Bounty ({bountyData.reward} GTT)
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Active Bounties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">Corporate Whistleblower Investigation</h4>
                      <Badge className="bg-green-600">500 GTT</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">Verify claims about financial irregularities...</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      <span>5 investigators</span>
                      <Clock className="w-3 h-3" />
                      <span>3 days left</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">Scientific Data Verification</h4>
                      <Badge className="bg-blue-600">250 GTT</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">Cross-reference research methodology...</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      <span>2 investigators</span>
                      <Clock className="w-3 h-3" />
                      <span>1 week left</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Bounty Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Bounties</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Investigations</span>
                  <span className="font-semibold">43</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GTT Rewards Pool</span>
                  <span className="font-semibold">12,450 GTT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="font-semibold text-green-400">87%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}