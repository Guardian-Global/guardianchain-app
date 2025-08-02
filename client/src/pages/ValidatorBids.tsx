import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, Star, TrendingUp, Users, Award } from "lucide-react";
import { useState } from "react";

interface ValidatorBid {
  id: string;
  validator: {
    id: string;
    name: string;
    reputation: number;
    avatar: string;
    totalValidations: number;
    successRate: number;
    stakeAmount: number;
  };
  capsule: {
    id: string;
    title: string;
    category: string;
    griefScore: number;
    author: string;
  };
  bidAmount: number;
  bidTimestamp: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  estimatedCompletion: string;
  confidence: number;
  specialization: string[];
}

interface ValidatorBidsData {
  activeBids: ValidatorBid[];
  totalBids: number;
  averageBidAmount: number;
  topValidators: Array<{
    id: string;
    name: string;
    reputation: number;
    totalEarnings: number;
    activeBids: number;
  }>;
  marketStats: {
    totalStaked: number;
    averageValidationTime: number;
    successRate: number;
    dailyVolume: number;
  };
}

export default function ValidatorBids() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("bidAmount");

  const { data: bidsData, isLoading } = useQuery<ValidatorBidsData>({
    queryKey: ["/api/validators/bids", { filterStatus, sortBy }],
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const bidTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - bidTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Validator Marketplace</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
            className="text-xs"
          >
            All Bids
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
            className="text-xs"
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === "accepted" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("accepted")}
            className="text-xs"
          >
            Active
          </Button>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Staked
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bidsData?.marketStats.totalStaked.toLocaleString()} GTT
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Avg Validation Time
            </CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bidsData?.marketStats.averageValidationTime}h
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Success Rate
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bidsData?.marketStats.successRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Daily Volume
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bidsData?.marketStats.dailyVolume.toLocaleString()} GTT
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Bids */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Validation Bids</h2>
          
          {bidsData?.activeBids.map((bid) => (
            <Card key={bid.id} className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {bid.validator.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{bid.validator.reputation}/100</span>
                        <span>•</span>
                        <span>{bid.validator.totalValidations} validations</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(bid.status)}>
                    {bid.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {bid.capsule.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{bid.capsule.category}</span>
                    <span>Grief Score: {bid.capsule.griefScore}</span>
                    <span>by {bid.capsule.author}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bid Amount</span>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {bid.bidAmount} GTT
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Confidence</span>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {bid.confidence}%
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Success Rate</span>
                    <span className="text-gray-900 dark:text-white">{bid.validator.successRate}%</span>
                  </div>
                  <Progress value={bid.validator.successRate} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex space-x-2">
                    {bid.specialization.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(bid.bidTimestamp)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Validators Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Top Validators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bidsData?.topValidators.map((validator, index) => (
                <div key={validator.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {validator.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Rep: {validator.reputation}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {validator.totalEarnings} GTT
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {validator.activeBids} active
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Market Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Bids</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {bidsData?.totalBids}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Bid</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {bidsData?.averageBidAmount} GTT
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}