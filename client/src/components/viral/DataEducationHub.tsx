import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  DollarSign,
  Shield,
  TrendingUp,
  AlertTriangle,
  Eye,
  Users,
  Clock,
  Lightbulb,
  BookOpen,
  Target,
  Zap,
  Crown,
  CheckCircle,
  ArrowRight,
  Play,
} from "lucide-react";

interface DataInsight {
  title: string;
  description: string;
  valueImpact: string;
  example: string;
  actionable: string[];
}

const DataEducationHub: React.FC = () => {
  const [selectedInsight, setSelectedInsight] = useState<string>("ownership");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const dataInsights: Record<string, DataInsight> = {
    ownership: {
      title: "Digital Ownership Crisis",
      description:
        "Most creators don't realize they're giving away ownership of their ideas the moment they post on social media. Platforms own your content, can monetize it, and you have no legal recourse.",
      valueImpact:
        "Average creator loses $15,000+ annually in unclaimed IP value",
      example:
        "A viral TikTok idea gets copied by major brands without credit or compensation. The original creator has no proof of first creation.",
      actionable: [
        "Always timestamp your ideas before sharing publicly",
        "Create immutable proof of ownership on blockchain",
        "Document your creative process and iterations",
        "Build a portfolio of verified original content",
      ],
    },
    data_economics: {
      title: "Your Data = Big Tech Profits",
      description:
        "Social media platforms generate billions from user data. Your posts, engagement patterns, and social connections are valuable commodities sold to advertisers.",
      valueImpact: "Individual user data worth $500-2000 annually to platforms",
      example:
        "Instagram uses your photos to train AI models, sells access to your engagement data, and profits from ads shown to your followers - all without compensating you.",
      actionable: [
        "Understand what data you're giving away",
        "Quantify the value of your digital footprint",
        "Create multiple revenue streams from your content",
        "Maintain control over high-value intellectual property",
      ],
    },
    viral_mechanics: {
      title: "The Viral Value Chain",
      description:
        "Viral content can generate millions in value, but creators typically capture less than 1% of the economic benefit. Understanding viral mechanics helps you optimize for maximum value extraction.",
      valueImpact:
        "Viral creators can earn 100x more with proper value capture strategies",
      example:
        "A viral business idea shared freely on Twitter gets implemented by a startup that raises $10M. The original creator gets nothing.",
      actionable: [
        "Analyze viral potential before sharing",
        "Create value capture mechanisms (email lists, products)",
        "Time your content releases strategically",
        "Build audience ownership outside platforms",
      ],
    },
    ai_disruption: {
      title: "AI is Mining Your Content",
      description:
        "AI companies are training models on publicly available content without compensation. Your creative work is being used to build billion-dollar AI systems.",
      valueImpact:
        "Creative professionals facing 40-60% income reduction from AI competition",
      example:
        "Your writing style, artistic techniques, and creative ideas are being learned by AI models that will compete with you in the marketplace.",
      actionable: [
        "Protect high-value content from AI training",
        "Create AI-resistant value propositions",
        "Use AI tools to enhance rather than replace your work",
        "Build personal brand around irreplaceable human elements",
      ],
    },
    network_effects: {
      title: "Network Effects & Social Capital",
      description:
        "Your social connections and influence have quantifiable economic value. Understanding network effects helps you build and monetize social capital more effectively.",
      valueImpact:
        "Strong social networks worth 5-10x more than follower count suggests",
      example:
        "A smaller account with high-value connections can monetize better than larger accounts with passive followers.",
      actionable: [
        "Map and analyze your network value",
        "Focus on quality connections over quantity",
        "Create value for your network consistently",
        "Leverage network effects for collaborative opportunities",
      ],
    },
  };

  const insights = Object.keys(dataInsights);

  const markLessonComplete = (insightKey: string) => {
    if (!completedLessons.includes(insightKey)) {
      setCompletedLessons((prev) => [...prev, insightKey]);
    }
  };

  const progressPercentage = (completedLessons.length / insights.length) * 100;

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-400" />
            <div>
              <div className="text-3xl font-bold">Data Value Education Hub</div>
              <div className="text-lg text-blue-400">
                Understand the True Worth of Your Digital Assets
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-white font-semibold">
                Learning Progress
              </span>
              <span className="text-blue-400">
                {completedLessons.length}/{insights.length} lessons
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-red-900/30 rounded-lg p-6 mb-4">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  $2.3 Trillion
                </div>
                <div className="text-sm text-slate-400">
                  Annual value extracted from user data
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Big tech platforms generate massive profits from user-generated
                content and data
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-900/30 rounded-lg p-6 mb-4">
                <DollarSign className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">$1,200</div>
                <div className="text-sm text-slate-400">
                  Average annual value per user
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Your personal data and content generates significant value that
                you don't capture
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-900/30 rounded-lg p-6 mb-4">
                <Crown className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">95%+</div>
                <div className="text-sm text-slate-400">
                  Value creators miss out on
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Most creators capture less than 5% of the value their content
                generates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lesson Navigation */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-6 h-6 mr-2 text-purple-400" />
              Essential Data Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((key) => {
                const insight = dataInsights[key];
                const isCompleted = completedLessons.includes(key);
                const isSelected = selectedInsight === key;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedInsight(key)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "bg-purple-900/30 border border-purple-600"
                        : "bg-slate-700/50 hover:bg-slate-600/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        ) : (
                          <Play className="w-5 h-5 text-purple-400 mr-3" />
                        )}
                        <div>
                          <div className="text-white font-semibold">
                            {insight.title}
                          </div>
                          <div className="text-slate-400 text-sm">
                            Essential knowledge for creators
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 ${
                          isSelected ? "text-purple-400" : "text-slate-400"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Content */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{dataInsights[selectedInsight].title}</span>
              {completedLessons.includes(selectedInsight) && (
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2">The Problem</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {dataInsights[selectedInsight].description}
                </p>
              </div>

              <div className="bg-red-900/20 rounded-lg p-4 border border-red-700">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-400 font-semibold">
                    Value Impact
                  </span>
                </div>
                <p className="text-red-300 text-sm">
                  {dataInsights[selectedInsight].valueImpact}
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Real Example</h3>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-300 text-sm italic">
                    "{dataInsights[selectedInsight].example}"
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Action Steps</h3>
                <div className="space-y-2">
                  {dataInsights[selectedInsight].actionable.map(
                    (action, index) => (
                      <div key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{action}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Button
                onClick={() => markLessonComplete(selectedInsight)}
                disabled={completedLessons.includes(selectedInsight)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {completedLessons.includes(selectedInsight) ? (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Lesson Completed
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-6 h-6 mr-2 text-purple-400" />
              Start Protecting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Begin protecting your content and ideas before sharing them
              publicly
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Verify Content Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-900/20 to-yellow-900/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-green-400" />
              Calculate Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Discover the monetary value of your ideas and social media
              presence
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Value Calculator
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-900/20 to-red-900/20 border-pink-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-pink-400" />
              Optimize Virality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Use AI to predict and optimize your content for viral potential
            </p>
            <Button className="w-full bg-pink-600 hover:bg-pink-700">
              Viral Analyzer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Completion Reward */}
      {progressPercentage === 100 && (
        <Card className="bg-gradient-to-r from-gold-900/20 to-yellow-900/20 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-center">
              <Crown className="w-8 h-8 mr-3 text-yellow-400" />
              <div className="text-center">
                <div className="text-2xl font-bold">Congratulations! 🎉</div>
                <div className="text-lg text-yellow-400">
                  Data Education Complete
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-slate-300 mb-6">
                You've mastered the fundamentals of data value and digital
                ownership. You're now equipped to protect and monetize your
                content effectively.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Lightbulb className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">
                    Knowledge Unlocked
                  </div>
                  <div className="text-slate-400 text-sm">
                    Advanced value extraction strategies
                  </div>
                </div>
                <div className="bg-green-900/30 rounded-lg p-4">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">
                    Protection Ready
                  </div>
                  <div className="text-slate-400 text-sm">
                    Ready to secure your digital assets
                  </div>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4">
                  <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">
                    Value Maximized
                  </div>
                  <div className="text-slate-400 text-sm">
                    Optimized for content monetization
                  </div>
                </div>
              </div>

              <Button
                className="mt-6 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                size="lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Claim Your Expert Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataEducationHub;
