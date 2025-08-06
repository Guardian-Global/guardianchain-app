"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MasterCapsule from "@/components/MasterCapsule";
import {
  Lock,
  Unlock,
  TrendingUp,
  Clock,
  Filter,
  Archive,
  Coins,
  Eye,
  Activity,
  Calendar,
  Star,
  Shield,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CapsuleData {
  id: string;
  title: string;
  creator: string;
  createdAt: string;
  isLocked: boolean;
  isTimeSealed: boolean;
  unlockDate?: string;
  truthScore: number;
  gttValue: number;
  category: string;
  content: string;
  tags: string[];
  isVerified: boolean;
  mediaAttachments: string[];
  viewCount: number;
}

interface TrendDataPoint {
  day: string;
  unlocks: number;
  isSpike: boolean;
}

export default function Vault() {
  const { user, isAuthenticated } = useAuth();

  const [capsules, setCapsules] = useState<CapsuleData[]>([]);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [activeTab, setActiveTab] = useState("vault");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [capsulesRes, trendsRes] = await Promise.all([
          fetch("/api/vault/capsules"),
          fetch("/api/vault/unlock-trend")
        ]);
        
        if (capsulesRes.ok) {
          const capsulesData = await capsulesRes.json();
          setCapsules(capsulesData);
        }
        
        if (trendsRes.ok) {
          const trendsData = await trendsRes.json();
          setTrendData(trendsData);
        }
      } catch (error) {
        console.error("Failed to fetch vault data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter capsules based on status
  const filteredCapsules = capsules.filter(capsule => {
    switch (filterStatus) {
      case "locked":
        return capsule.isLocked;
      case "unlocked":
        return !capsule.isLocked;
      case "time-sealed":
        return capsule.isTimeSealed;
      case "archive":
        return capsule.unlockDate && new Date(capsule.unlockDate) < new Date();
      default:
        return true;
    }
  });

  // Unlock Timeline Graph Component
  const UnlockTimelineGraph = () => (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Unlock Timeline Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <XAxis 
                dataKey="day" 
                stroke="#8b949e" 
                fontSize={12}
                tick={{ fill: '#8b949e' }}
              />
              <YAxis 
                stroke="#8b949e" 
                fontSize={12}
                tick={{ fill: '#8b949e' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  color: '#f0f6fc'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="unlocks" 
                stroke="#00ffe1" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-brand-text-muted">
            <Activity className="h-6 w-6 mr-2" />
            Loading unlock trend data...
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Capsule Grid Component with filters
  const CapsuleGrid = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-brand-accent" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter capsules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Capsules</SelectItem>
              <SelectItem value="locked">🔒 Locked</SelectItem>
              <SelectItem value="unlocked">🔓 Unlocked</SelectItem>
              <SelectItem value="time-sealed">⏰ Time-Sealed</SelectItem>
              <SelectItem value="archive">📂 Archive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Badge variant="outline" className="text-brand-accent border-brand-accent">
          {filteredCapsules.length} capsules
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-brand-secondary border-brand-surface animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-brand-surface rounded mb-2"></div>
                <div className="h-3 bg-brand-surface rounded mb-4 w-3/4"></div>
                <div className="h-2 bg-brand-surface rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCapsules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => (
            <Card key={capsule.id} className="bg-brand-secondary border-brand-surface hover:border-brand-accent transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white line-clamp-2">{capsule.title}</h3>
                  {capsule.isLocked ? (
                    <Lock className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />
                  ) : (
                    <Unlock className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-brand-text-muted mb-3">
                  <span>{capsule.creator}</span>
                  <span>•</span>
                  <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                    Truth: {capsule.truthScore}%
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                    {capsule.gttValue} GTT
                  </Badge>
                  {capsule.isVerified && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                  <Eye className="w-4 h-4" />
                  {capsule.viewCount} views
                  {capsule.isTimeSealed && capsule.unlockDate && (
                    <>
                      <Clock className="w-4 h-4 ml-2" />
                      Unlocks {new Date(capsule.unlockDate).toLocaleDateString()}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Archive className="w-12 h-12 text-brand-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No capsules found</h3>
          <p className="text-brand-text-muted">Try adjusting your filter settings</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔐 Vault</h1>
          <p className="text-brand-text-muted">
            Manage your locked capsules, unlock timeline, and archive access
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-brand-surface max-w-md">
            <TabsTrigger 
              value="vault" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
            >
              <Lock className="w-4 h-4 mr-2" />
              Vault
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="archive" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vault" className="space-y-6">
            <CapsuleGrid />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <UnlockTimelineGraph />
            <CapsuleGrid />
          </TabsContent>

          <TabsContent value="archive" className="space-y-6">
            <Card className="bg-brand-secondary border-brand-surface">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Archive Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-text-muted mb-4">
                  View previously unlocked or expired capsules from your vault history.
                </p>
                <CapsuleGrid />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}