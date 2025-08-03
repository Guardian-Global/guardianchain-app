import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Activity, Heart } from "lucide-react";
import { useState } from "react";

interface EmotionData {
  emotion: string;
  count: number;
  griefScore: number;
  trend: number;
  color: string;
}

interface HeatmapData {
  days: string[];
  emotions: string[];
  data: number[][];
  metadata: {
    totalCapsules: number;
    avgGriefScore: number;
    mostActiveDay: string;
    dominantEmotion: string;
  };
}

export default function EnhancedEmotionHeatmap() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  const { data: heatmapData, isLoading } = useQuery<HeatmapData>({
    queryKey: ['/api/analytics/emotion-heatmap', timeRange],
  });

  const emotionColors = {
    happy: '#10B981',
    sad: '#3B82F6', 
    anger: '#EF4444',
    fear: '#8B5CF6',
    grief: '#6B7280',
    hope: '#F59E0B',
    love: '#EC4899',
    neutral: '#9CA3AF'
  };

  const getIntensityColor = (value: number, max: number) => {
    const intensity = value / (max || 1);
    return `rgba(139, 92, 246, ${intensity})`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Emotion Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!heatmapData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emotion Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No emotion data available.</p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...heatmapData.data.flat());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-500" />
            Community Emotion Heatmap
          </CardTitle>
          <div className="flex gap-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {heatmapData.metadata.totalCapsules}
            </div>
            <div className="text-sm text-muted-foreground">Total Capsules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {heatmapData.metadata.avgGriefScore.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Grief Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {heatmapData.metadata.mostActiveDay}
            </div>
            <div className="text-sm text-muted-foreground">Most Active</div>
          </div>
          <div className="text-center">
            <Badge 
              variant="secondary"
              className="text-lg font-bold px-3 py-1"
            >
              {heatmapData.metadata.dominantEmotion}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">Dominant</div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Days Header */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-xs font-medium text-muted-foreground"></div>
              {heatmapData.days.map((day) => (
                <div 
                  key={day}
                  className="text-xs font-medium text-center text-muted-foreground p-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Emotion Rows */}
            {heatmapData.emotions.map((emotion, emotionIndex) => (
              <div key={emotion} className="grid grid-cols-8 gap-1 mb-1">
                {/* Emotion Label */}
                <div className="text-xs font-medium text-muted-foreground p-2 flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ 
                      backgroundColor: emotionColors[emotion as keyof typeof emotionColors] || '#9CA3AF'
                    }}
                  />
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </div>

                {/* Data Cells */}
                {heatmapData.data[emotionIndex]?.map((value, dayIndex) => (
                  <div
                    key={`${emotion}-${dayIndex}`}
                    className="aspect-square rounded flex items-center justify-center text-xs font-medium border cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all"
                    style={{
                      backgroundColor: getIntensityColor(value, maxValue),
                      color: value > maxValue * 0.5 ? 'white' : 'black'
                    }}
                    title={`${emotion} on ${heatmapData.days[dayIndex]}: ${value} capsules`}
                  >
                    {value > 0 ? value : ''}
                  </div>
                )) || []}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
              <div
                key={intensity}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: `rgba(139, 92, 246, ${intensity})` }}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* Insights */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="font-medium">Community Insights</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The community shows strongest emotional expression on{' '}
            <span className="font-medium">{heatmapData.metadata.mostActiveDay}</span>
            {' '}with{' '}
            <span className="font-medium">{heatmapData.metadata.dominantEmotion}</span>
            {' '}being the most prevalent emotion. This data helps validate grief patterns and supports our truth verification algorithms.
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Updated in real-time from blockchain capsules
            </span>
          </div>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}