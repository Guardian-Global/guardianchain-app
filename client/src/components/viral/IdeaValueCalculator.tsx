import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Users,
  Clock,
  Lightbulb,
  Target,
  Zap,
  Crown,
} from "lucide-react";

interface ValueMetrics {
  contentType: string;
  audienceSize: number;
  engagementRate: number;
  uniqueness: number;
  trendRelevance: number;
  monetizationPotential: number;
  estimatedValue: number;
  monthlyEarnings: number;
  yearlyProjection: number;
}

const IdeaValueCalculator: React.FC = () => {
  const [metrics, setMetrics] = useState<ValueMetrics>({
    contentType: "educational",
    audienceSize: 100, // Realistic starting audience
    engagementRate: 2, // Conservative engagement rate
    uniqueness: 50, // Average uniqueness
    trendRelevance: 30, // Low trend relevance for new users
    monetizationPotential: 20, // Low monetization potential for beginners
    estimatedValue: 0,
    monthlyEarnings: 0,
    yearlyProjection: 0,
  });

  const [calculating, setCalculating] = useState(false);

  const contentTypes = [
    { id: "educational", label: "Educational Content", multiplier: 1.2 },
    { id: "entertainment", label: "Entertainment", multiplier: 1.1 },
    { id: "business", label: "Business Insights", multiplier: 1.5 },
    { id: "tech", label: "Technology", multiplier: 1.4 },
    { id: "creative", label: "Creative/Art", multiplier: 1.0 },
    { id: "news", label: "News/Commentary", multiplier: 1.3 },
    { id: "lifestyle", label: "Lifestyle", multiplier: 0.9 },
    { id: "research", label: "Research/Data", multiplier: 1.6 },
  ];

  const calculateValue = () => {
    setCalculating(true);

    setTimeout(() => {
      const typeMultiplier =
        contentTypes.find((t) => t.id === metrics.contentType)?.multiplier ||
        1.0;

      // Realistic value calculation for new users
      const audienceValue = metrics.audienceSize * 0.005; // $0.005 per follower (more realistic)
      const engagementBonus =
        (metrics.engagementRate / 100) * audienceValue * 1.5; // Reduced multiplier
      const uniquenessBonus = (metrics.uniqueness / 100) * audienceValue * 1.0; // Reduced multiplier
      const trendBonus = (metrics.trendRelevance / 100) * audienceValue * 0.5; // Much lower trend bonus
      const monetizationBonus =
        (metrics.monetizationPotential / 100) * audienceValue * 1.0; // Realistic monetization

      const baseValue =
        (audienceValue +
          engagementBonus +
          uniquenessBonus +
          trendBonus +
          monetizationBonus) *
        typeMultiplier;

      // Monthly and yearly projections
      const monthlyEarnings = baseValue * 0.15; // 15% monthly conversion
      const yearlyProjection = monthlyEarnings * 12 * 1.2; // 20% growth factor

      setMetrics((prev) => ({
        ...prev,
        estimatedValue: Math.round(baseValue),
        monthlyEarnings: Math.round(monthlyEarnings),
        yearlyProjection: Math.round(yearlyProjection),
      }));

      setCalculating(false);
    }, 1500);
  };

  useEffect(() => {
    calculateValue();
  }, [
    metrics.contentType,
    metrics.audienceSize,
    metrics.engagementRate,
    metrics.uniqueness,
    metrics.trendRelevance,
    metrics.monetizationPotential,
  ]);

  const getValueTier = (value: number) => {
    if (value >= 50000)
      return {
        tier: "Platinum",
        color: "text-purple-400",
        bgColor: "bg-purple-900/20",
      };
    if (value >= 25000)
      return {
        tier: "Gold",
        color: "text-yellow-400",
        bgColor: "bg-yellow-900/20",
      };
    if (value >= 10000)
      return {
        tier: "Silver",
        color: "text-gray-400",
        bgColor: "bg-gray-900/20",
      };
    return {
      tier: "Bronze",
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
    };
  };

  const valueTier = getValueTier(metrics.estimatedValue);

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calculator className="w-8 h-8 mr-3 text-green-400" />
            <div>
              <div className="text-3xl font-bold">Idea Value Calculator</div>
              <div className="text-lg text-green-400">
                Discover Your Content's Worth Before Sharing
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="text-white font-semibold mb-3 block">
                  Content Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={
                        metrics.contentType === type.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setMetrics((prev) => ({
                          ...prev,
                          contentType: type.id,
                        }))
                      }
                      className={
                        metrics.contentType === type.id ? "bg-green-600" : ""
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Expected Audience Size:{" "}
                  {metrics.audienceSize.toLocaleString()}
                </label>
                <Slider
                  value={[metrics.audienceSize]}
                  onValueChange={(value) =>
                    setMetrics((prev) => ({ ...prev, audienceSize: value[0] }))
                  }
                  max={1000000}
                  min={100}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-1">
                  <span>100</span>
                  <span>1M+</span>
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Expected Engagement Rate: {metrics.engagementRate}%
                </label>
                <Slider
                  value={[metrics.engagementRate]}
                  onValueChange={(value) =>
                    setMetrics((prev) => ({
                      ...prev,
                      engagementRate: value[0],
                    }))
                  }
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-1">
                  <span>1%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Content Uniqueness: {metrics.uniqueness}%
                </label>
                <Slider
                  value={[metrics.uniqueness]}
                  onValueChange={(value) =>
                    setMetrics((prev) => ({ ...prev, uniqueness: value[0] }))
                  }
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-1">
                  <span>Common</span>
                  <span>Unique</span>
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Trend Relevance: {metrics.trendRelevance}%
                </label>
                <Slider
                  value={[metrics.trendRelevance]}
                  onValueChange={(value) =>
                    setMetrics((prev) => ({
                      ...prev,
                      trendRelevance: value[0],
                    }))
                  }
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-1">
                  <span>Niche</span>
                  <span>Trending</span>
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Monetization Potential: {metrics.monetizationPotential}%
                </label>
                <Slider
                  value={[metrics.monetizationPotential]}
                  onValueChange={(value) =>
                    setMetrics((prev) => ({
                      ...prev,
                      monetizationPotential: value[0],
                    }))
                  }
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* Value Results */}
            <div className="space-y-6">
              <div
                className={`${valueTier.bgColor} rounded-lg p-6 border border-current ${valueTier.color}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Crown className={`w-8 h-8 mr-2 ${valueTier.color}`} />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        ${metrics.estimatedValue.toLocaleString()}
                      </div>
                      <div className={`text-lg ${valueTier.color}`}>
                        {valueTier.tier} Tier Content
                      </div>
                    </div>
                  </div>
                  <Badge className={`${valueTier.color} border-current`}>
                    {valueTier.tier}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      ${metrics.monthlyEarnings.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">
                      Monthly Potential
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      ${metrics.yearlyProjection.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">
                      Yearly Projection
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {metrics.audienceSize.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">Audience</div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {metrics.engagementRate}%
                  </div>
                  <div className="text-sm text-slate-400">Engagement</div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {metrics.uniqueness}%
                  </div>
                  <div className="text-sm text-slate-400">Uniqueness</div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {metrics.trendRelevance}%
                  </div>
                  <div className="text-sm text-slate-400">Trending</div>
                </div>
              </div>

              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 font-semibold">
                    Value Breakdown
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Base Audience Value:</span>
                    <span className="text-white">
                      ${(metrics.audienceSize * 0.02).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Engagement Bonus:</span>
                    <span className="text-green-400">
                      +{metrics.engagementRate * 3}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Uniqueness Bonus:</span>
                    <span className="text-yellow-400">
                      +{metrics.uniqueness * 2}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Type Multiplier:</span>
                    <span className="text-purple-400">
                      {
                        contentTypes.find((t) => t.id === metrics.contentType)
                          ?.multiplier
                      }
                      x
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-400" />
            Maximize Your Content Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-900/20 rounded-lg p-6 mb-4">
                <Clock className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-bold">Protect First</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Verify and timestamp your content on GUARDIANCHAIN before
                sharing publicly. This establishes ownership and protects your
                intellectual property.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-900/20 rounded-lg p-6 mb-4">
                <DollarSign className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-bold">Monetize Smart</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Consider creating premium versions, courses, or licensing
                opportunities based on your content's estimated value.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-900/20 rounded-lg p-6 mb-4">
                <Share2 className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-bold">Share Strategically</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Use the calculated metrics to time your posts optimally and
                choose the right platforms for maximum impact and value.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdeaValueCalculator;
