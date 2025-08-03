import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Calendar, 
  Globe, 
  Users, 
  Activity,
  Heart,
  Brain,
  Zap,
  Target,
  Filter,
  Download,
  Share,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmotionData {
  emotion: string;
  value: number;
  intensity: number;
  authenticity: number;
  timestamp: string;
  location?: {
    country: string;
    region: string;
    coordinates: [number, number];
  };
  category: string;
  verified: boolean;
}

interface HeatmapCell {
  day: string;
  hour: number;
  emotion: string;
  value: number;
  intensity: number;
  count: number;
}

interface GriefPattern {
  pattern: string;
  strength: number;
  trend: "increasing" | "decreasing" | "stable";
  timeframe: string;
  affectedRegions: number;
}

export default function EnhancedEmotionHeatmap() {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedEmotion, setSelectedEmotion] = useState("all");
  const [viewMode, setViewMode] = useState<"heatmap" | "patterns" | "geographic">("heatmap");
  const [filterRegion, setFilterRegion] = useState("global");
  const [isRealTime, setIsRealTime] = useState(true);

  // Fetch emotion heatmap data
  const { data: heatmapData, isLoading, refetch } = useQuery({
    queryKey: ["/api/analytics/emotion-heatmap", timeRange, selectedEmotion, filterRegion],
    refetchInterval: isRealTime ? 30000 : false, // Real-time updates every 30 seconds
  });

  // Fetch grief patterns
  const { data: patternsData } = useQuery({
    queryKey: ["/api/analytics/grief-patterns", timeRange],
    refetchInterval: isRealTime ? 60000 : false,
  });

  const emotions = [
    { id: "all", name: "All Emotions", color: "bg-gray-500" },
    { id: "happy", name: "Joy", color: "bg-yellow-500" },
    { id: "sad", name: "Sadness", color: "bg-blue-500" },
    { id: "anger", name: "Anger", color: "bg-red-500" },
    { id: "fear", name: "Fear", color: "bg-purple-500" },
    { id: "grief", name: "Grief", color: "bg-indigo-500" },
    { id: "hope", name: "Hope", color: "bg-green-500" },
    { id: "love", name: "Love", color: "bg-pink-500" },
    { id: "anxiety", name: "Anxiety", color: "bg-orange-500" },
    { id: "determination", name: "Determination", color: "bg-cyan-500" }
  ];

  const regions = [
    { id: "global", name: "Global" },
    { id: "north_america", name: "North America" },
    { id: "europe", name: "Europe" },
    { id: "asia_pacific", name: "Asia Pacific" },
    { id: "south_america", name: "South America" },
    { id: "africa", name: "Africa" },
    { id: "middle_east", name: "Middle East" }
  ];

  // Generate mock heatmap data
  const generateHeatmapData = (): HeatmapCell[] => {
    const days = timeRange === "week" ? 
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] :
      timeRange === "month" ?
      Array.from({ length: 30 }, (_, i) => `${i + 1}`) :
      ["Q1", "Q2", "Q3", "Q4"];
    
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data: HeatmapCell[] = [];
    
    days.forEach(day => {
      hours.forEach(hour => {
        emotions.slice(1).forEach(emotion => { // Skip "all"
          const baseValue = Math.random() * 100;
          const intensity = Math.random() * 100;
          const count = Math.floor(Math.random() * 50) + 1;
          
          data.push({
            day,
            hour,
            emotion: emotion.id,
            value: baseValue,
            intensity,
            count
          });
        });
      });
    });
    
    return data;
  };

  const heatmapCells = useMemo(() => generateHeatmapData(), [timeRange]);

  // Generate grief patterns
  const griefPatterns: GriefPattern[] = [
    {
      pattern: "Truth Revelation Surge",
      strength: 85,
      trend: "increasing",
      timeframe: "Last 7 days",
      affectedRegions: 12
    },
    {
      pattern: "Collective Memory Processing",
      strength: 72,
      trend: "stable",
      timeframe: "Last 30 days",
      affectedRegions: 8
    },
    {
      pattern: "Healing Community Formation",
      strength: 63,
      trend: "increasing",
      timeframe: "Last 14 days",
      affectedRegions: 15
    },
    {
      pattern: "Legacy Documentation Wave",
      strength: 58,
      trend: "decreasing",
      timeframe: "Last 21 days",
      affectedRegions: 6
    }
  ];

  const getEmotionColor = (emotion: string, intensity: number) => {
    const emotionData = emotions.find(e => e.id === emotion);
    if (!emotionData) return "bg-gray-500";
    
    const opacity = Math.max(0.2, intensity / 100);
    return `${emotionData.color} opacity-${Math.round(opacity * 10) * 10}`;
  };

  const getIntensitySize = (intensity: number) => {
    if (intensity > 80) return "w-4 h-4";
    if (intensity > 60) return "w-3 h-3";
    if (intensity > 40) return "w-2 h-2";
    return "w-1 h-1";
  };

  const HeatmapView = () => (
    <div className="space-y-6">
      {/* Emotion Legend */}
      <div className="flex flex-wrap gap-2">
        {emotions.slice(1).map((emotion) => (
          <div key={emotion.id} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${emotion.color}`} />
            <span className="text-xs text-gray-400">{emotion.name}</span>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Hour Labels */}
          <div className="flex mb-2">
            <div className="w-16"></div> {/* Day label space */}
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="flex-1 text-xs text-center text-gray-400 px-1">
                {hour.toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Heatmap Rows */}
          {(timeRange === "week" ? 
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] :
            timeRange === "month" ?
            Array.from({ length: 7 }, (_, i) => `Week ${i + 1}`) :
            ["Q1", "Q2", "Q3", "Q4"]
          ).map((day) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-16 text-xs text-gray-400 text-right pr-2">
                {day}
              </div>
              {Array.from({ length: 24 }, (_, hour) => {
                const cellData = heatmapCells.filter(cell => 
                  cell.day === day && cell.hour === hour &&
                  (selectedEmotion === "all" || cell.emotion === selectedEmotion)
                );
                
                const avgIntensity = cellData.length > 0 
                  ? cellData.reduce((sum, cell) => sum + cell.intensity, 0) / cellData.length
                  : 0;
                
                const totalCount = cellData.reduce((sum, cell) => sum + cell.count, 0);
                
                return (
                  <div
                    key={hour}
                    className="flex-1 h-8 mx-0.5 rounded relative group cursor-pointer"
                    style={{
                      backgroundColor: avgIntensity > 0 
                        ? `rgba(139, 92, 246, ${Math.max(0.1, avgIntensity / 100)})` 
                        : 'rgba(100, 116, 139, 0.1)'
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      <div>{day} {hour.toString().padStart(2, '0')}:00</div>
                      <div>Intensity: {avgIntensity.toFixed(1)}%</div>
                      <div>Count: {totalCount}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Time Period Navigation */}
      <div className="flex justify-center gap-2">
        {["day", "week", "month", "quarter"].map((period) => (
          <Button
            key={period}
            variant={timeRange === period ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(period)}
            className="capitalize"
          >
            {period}
          </Button>
        ))}
      </div>
    </div>
  );

  const PatternsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {griefPatterns.map((pattern, index) => (
          <Card key={index} className="bg-slate-700/30 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-white">{pattern.pattern}</h3>
                <Badge 
                  variant={
                    pattern.trend === "increasing" ? "default" :
                    pattern.trend === "decreasing" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {pattern.trend}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Pattern Strength</span>
                    <span className="text-white">{pattern.strength}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${pattern.strength}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block">Timeframe</span>
                    <span className="text-white">{pattern.timeframe}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Regions</span>
                    <span className="text-white">{pattern.affectedRegions}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Metrics */}
      <Card className="bg-slate-700/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-cyan-400" />
            Real-time Emotion Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Emotions", value: "847", change: "+12%", icon: Heart },
              { label: "Truth Revelations", value: "23", change: "+156%", icon: Target },
              { label: "Healing Processes", value: "134", change: "+8%", icon: Brain },
              { label: "Community Support", value: "567", change: "+24%", icon: Users }
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <metric.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-white">{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.label}</div>
                <div className="text-xs text-green-400">{metric.change}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const GeographicView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {regions.slice(1).map((region) => (
          <Card key={region.id} className="bg-slate-700/30 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-sm">{region.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emotions.slice(1, 4).map((emotion) => {
                  const value = Math.floor(Math.random() * 100);
                  return (
                    <div key={emotion.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">{emotion.name}</span>
                        <span className="text-white">{value}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-1">
                        <div 
                          className={`${emotion.color} h-1 rounded-full`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Emotion Map Placeholder */}
      <Card className="bg-slate-700/30 border-purple-500/20">
        <CardContent className="p-6">
          <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">Interactive emotion map visualization</p>
              <p className="text-xs text-gray-500 mt-2">Real-time global emotion tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Controls */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Community Emotion Heatmap
                {isRealTime && (
                  <Badge variant="outline" className="animate-pulse">
                    Live
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Real-time emotional analysis of truth community
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealTime(!isRealTime)}
              >
                {isRealTime ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isRealTime ? "Live" : "Paused"}
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map((emotion) => (
                    <SelectItem key={emotion.id} value={emotion.id}>
                      {emotion.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heatmap" className="mt-6">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6">
              <HeatmapView />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patterns" className="mt-6">
          <PatternsView />
        </TabsContent>
        
        <TabsContent value="geographic" className="mt-6">
          <GeographicView />
        </TabsContent>
      </Tabs>
    </div>
  );
}