import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dna,
  Search,
  Megaphone,
  Eye,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TruthGenomeCardProps {
  userId?: string;
  className?: string;
}

interface TruthGenomeData {
  traits: {
    seeker: number;
    whistleblower: number;
    visionary: number;
    historian: number;
  };
  dominantTrait: "seeker" | "whistleblower" | "visionary" | "historian";
  evidenceCount: {
    researched: number;
    exposed: number;
    predicted: number;
    preserved: number;
  };
  genomeScore: number;
  evolution: {
    lastMonth: number;
    trend: "rising" | "stable" | "declining";
  };
  achievements: string[];
  specializations: string[];
}

export default function TruthGenomeCard({
  userId,
  className = "",
}: TruthGenomeCardProps) {
  const { data: genomeData, isLoading } = useQuery({
    queryKey: ["/api/ai/truth-genome", userId],
    queryFn: () =>
      apiRequest("GET", `/api/ai/truth-genome/${userId || "current"}`),
  });

  const traitConfig = {
    seeker: {
      icon: Search,
      label: "Truth Seeker",
      description: "Relentlessly pursues hidden knowledge",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    whistleblower: {
      icon: Megaphone,
      label: "Whistleblower",
      description: "Courageously exposes corruption",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    visionary: {
      icon: Eye,
      label: "Visionary",
      description: "Predicts future patterns and trends",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    historian: {
      icon: BookOpen,
      label: "Historian",
      description: "Preserves important memories",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return TrendingUp;
      case "declining":
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "rising":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!genomeData) {
    return null;
  }

  const data = genomeData as TruthGenomeData;
  const dominantConfig = traitConfig[data.dominantTrait];
  const TrendIcon = getTrendIcon(data.evolution.trend);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna className="w-5 h-5" />
          Truth Genome
          <Badge variant="secondary" className="ml-auto">
            Score: {data.genomeScore}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dominant Trait */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${dominantConfig.bgColor}`}>
              <dominantConfig.icon
                className={`w-5 h-5 ${dominantConfig.color}`}
              />
            </div>
            <div>
              <div className="font-semibold">{dominantConfig.label}</div>
              <div className="text-sm text-muted-foreground">
                {dominantConfig.description}
              </div>
            </div>
          </div>
        </div>

        {/* Trait Distribution */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Trait Distribution</div>
          {Object.entries(data.traits).map(([trait, value]) => {
            const config = traitConfig[trait as keyof typeof traitConfig];
            return (
              <div key={trait} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <config.icon className="w-3 h-3" />
                    {config.label}
                  </span>
                  <span>{value}%</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Evidence Count */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Evidence Portfolio</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {data.evidenceCount.researched}
              </div>
              <div className="text-xs text-muted-foreground">Researched</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {data.evidenceCount.exposed}
              </div>
              <div className="text-xs text-muted-foreground">Exposed</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {data.evidenceCount.predicted}
              </div>
              <div className="text-xs text-muted-foreground">Predicted</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {data.evidenceCount.preserved}
              </div>
              <div className="text-xs text-muted-foreground">Preserved</div>
            </div>
          </div>
        </div>

        {/* Evolution Trend */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Evolution Trend</div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendIcon
                className={`w-4 h-4 ${getTrendColor(data.evolution.trend)}`}
              />
              <span className="text-sm capitalize">{data.evolution.trend}</span>
            </div>
            <div
              className={`text-sm font-medium ${getTrendColor(data.evolution.trend)}`}
            >
              {data.evolution.lastMonth > 0 ? "+" : ""}
              {data.evolution.lastMonth}
            </div>
          </div>
        </div>

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Recent Achievements</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Specializations */}
        {data.specializations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Specializations</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.specializations.map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
