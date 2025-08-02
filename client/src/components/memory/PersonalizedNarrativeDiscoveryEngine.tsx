import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Brain,
  Lightbulb,
  Heart,
  Star,
  Compass,
  BookOpen,
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight,
  Filter,
  Shuffle,
  Eye,
  Clock,
  Award,
} from "lucide-react";

interface NarrativeTheme {
  id: string;
  title: string;
  description: string;
  emotionalResonance: number;
  matchScore: number;
  category:
    | "growth"
    | "relationships"
    | "achievements"
    | "challenges"
    | "discoveries";
  suggestedMemories: string[];
  potentialConnections: string[];
  storyArcPotential: number;
}

interface DiscoveryInsight {
  type: "pattern" | "connection" | "theme" | "opportunity";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

const SAMPLE_THEMES: NarrativeTheme[] = [
  {
    id: "1",
    title: "Overcoming Adversity",
    description:
      "A journey through challenges that shaped your resilience and character",
    emotionalResonance: 94,
    matchScore: 87,
    category: "challenges",
    suggestedMemories: [
      "The Accident Recovery",
      "Learning from Failure",
      "Family Crisis",
    ],
    potentialConnections: ["Personal Growth", "Mentorship Moments"],
    storyArcPotential: 92,
  },
  {
    id: "2",
    title: "Mentor and Student",
    description:
      "Your evolution from learner to teacher, shaping others as you were shaped",
    emotionalResonance: 88,
    matchScore: 83,
    category: "relationships",
    suggestedMemories: ["First Teacher", "Coaching Youth", "Passing Knowledge"],
    potentialConnections: ["Leadership Journey", "Community Impact"],
    storyArcPotential: 85,
  },
  {
    id: "3",
    title: "Creative Awakening",
    description:
      "Discovering and nurturing your artistic and innovative spirit",
    emotionalResonance: 76,
    matchScore: 79,
    category: "discoveries",
    suggestedMemories: [
      "First Painting",
      "Musical Breakthrough",
      "Innovation Moment",
    ],
    potentialConnections: ["Self Expression", "Artistic Growth"],
    storyArcPotential: 81,
  },
  {
    id: "4",
    title: "Building Connections",
    description:
      "The relationships that defined you and the community you created",
    emotionalResonance: 91,
    matchScore: 88,
    category: "relationships",
    suggestedMemories: ["First Friend", "Wedding Day", "Team Building"],
    potentialConnections: ["Love Stories", "Friendship Bonds"],
    storyArcPotential: 89,
  },
  {
    id: "5",
    title: "Professional Evolution",
    description:
      "Your career journey from beginnings to expertise and leadership",
    emotionalResonance: 73,
    matchScore: 82,
    category: "achievements",
    suggestedMemories: [
      "First Job",
      "Major Promotion",
      "Starting Own Business",
    ],
    potentialConnections: ["Skills Development", "Industry Impact"],
    storyArcPotential: 78,
  },
];

const SAMPLE_INSIGHTS: DiscoveryInsight[] = [
  {
    type: "pattern",
    title: "Resilience Through Community",
    description:
      "Your most meaningful memories involve overcoming challenges with support from others",
    confidence: 92,
    actionable: true,
  },
  {
    type: "connection",
    title: "Teaching Moments",
    description:
      "Strong thematic connection between your learning experiences and mentoring others",
    confidence: 88,
    actionable: true,
  },
  {
    type: "opportunity",
    title: "Untold Adventure Stories",
    description:
      "Your travel and exploration memories could form a compelling adventure narrative",
    confidence: 76,
    actionable: true,
  },
  {
    type: "theme",
    title: "Innovation Through Necessity",
    description:
      "Pattern of creative problem-solving emerging from challenging situations",
    confidence: 84,
    actionable: false,
  },
];

const categoryColors = {
  growth: "from-green-500 to-emerald-500",
  relationships: "from-pink-500 to-rose-500",
  achievements: "from-purple-500 to-indigo-500",
  challenges: "from-orange-500 to-red-500",
  discoveries: "from-blue-500 to-cyan-500",
};

const categoryIcons = {
  growth: TrendingUp,
  relationships: Heart,
  achievements: Star,
  challenges: Compass,
  discoveries: Lightbulb,
};

const insightTypeIcons = {
  pattern: Brain,
  connection: Heart,
  theme: BookOpen,
  opportunity: Sparkles,
};

export default function PersonalizedNarrativeDiscoveryEngine() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<NarrativeTheme | null>(
    null,
  );
  const [themes, setThemes] = useState(SAMPLE_THEMES);
  const [insights, setInsights] = useState(SAMPLE_INSIGHTS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [discoveryMode, setDiscoveryMode] = useState<"themes" | "insights">(
    "themes",
  );

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch =
      theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || theme.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const runDiscoveryAnalysis = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      // Randomly adjust match scores to simulate new discoveries
      setThemes((prev) =>
        prev.map((theme) => ({
          ...theme,
          matchScore: Math.min(
            100,
            theme.matchScore + Math.floor(Math.random() * 10) - 5,
          ),
        })),
      );

      setIsAnalyzing(false);
    }, 2000);
  };

  const ThemeCard = ({ theme }: { theme: NarrativeTheme }) => {
    const CategoryIcon = categoryIcons[theme.category];

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="cursor-pointer"
        onClick={() => setSelectedTheme(theme)}
      >
        <Card className="bg-slate-800/80 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CategoryIcon className="text-purple-400" size={20} />
                <Badge
                  className={`bg-gradient-to-r ${categoryColors[theme.category]} text-white`}
                >
                  {theme.category}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Match Score</div>
                <div className="text-lg font-bold text-white">
                  {theme.matchScore}%
                </div>
              </div>
            </div>
            <CardTitle className="text-white text-lg">{theme.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {theme.description}
            </p>

            <div className="space-y-3">
              {/* Emotional Resonance Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Emotional Resonance</span>
                  <span>{theme.emotionalResonance}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${theme.emotionalResonance}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Story Arc Potential */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Story Arc Potential</span>
                  <span>{theme.storyArcPotential}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${theme.storyArcPotential}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Suggested Memories */}
              <div>
                <div className="text-xs text-gray-400 mb-2">
                  Suggested Memories
                </div>
                <div className="flex flex-wrap gap-1">
                  {theme.suggestedMemories.slice(0, 2).map((memory, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs text-gray-300 border-gray-600"
                    >
                      {memory}
                    </Badge>
                  ))}
                  {theme.suggestedMemories.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs text-gray-400 border-gray-600"
                    >
                      +{theme.suggestedMemories.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const InsightCard = ({ insight }: { insight: DiscoveryInsight }) => {
    const Icon = insightTypeIcons[insight.type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/20"
      >
        <div className="flex items-start gap-3">
          <Icon className="text-purple-400 mt-1" size={20} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-semibold">{insight.title}</h3>
              <Badge
                className={`text-xs ${
                  insight.confidence >= 90
                    ? "bg-green-500/20 text-green-300"
                    : insight.confidence >= 80
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-blue-500/20 text-blue-300"
                }`}
              >
                {insight.confidence}% confidence
              </Badge>
            </div>
            <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
            {insight.actionable && (
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <ArrowRight size={14} className="mr-1" />
                Explore This Theme
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="text-purple-400" />
            Personalized Narrative Discovery Engine
            <Compass className="text-blue-400" />
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            AI-powered discovery of your unique story themes and narrative
            connections
          </p>
        </motion.div>

        {/* Discovery Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/80 backdrop-blur-sm border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    placeholder="Search themes, memories, or connections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="growth">Growth</option>
                    <option value="relationships">Relationships</option>
                    <option value="achievements">Achievements</option>
                    <option value="challenges">Challenges</option>
                    <option value="discoveries">Discoveries</option>
                  </select>

                  <Button
                    onClick={runDiscoveryAnalysis}
                    disabled={isAnalyzing}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isAnalyzing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Brain size={16} className="mr-2" />
                        </motion.div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Shuffle size={16} className="mr-2" />
                        Rediscover
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant={discoveryMode === "themes" ? "default" : "outline"}
                  onClick={() => setDiscoveryMode("themes")}
                  size="sm"
                >
                  <BookOpen size={16} className="mr-2" />
                  Themes
                </Button>
                <Button
                  variant={discoveryMode === "insights" ? "default" : "outline"}
                  onClick={() => setDiscoveryMode("insights")}
                  size="sm"
                >
                  <Lightbulb size={16} className="mr-2" />
                  Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Discovery Results */}
        <AnimatePresence mode="wait">
          {discoveryMode === "themes" ? (
            <motion.div
              key="themes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="insights"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" />
                Discovery Insights
              </h2>
              {insights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Theme Detail Modal */}
        <AnimatePresence>
          {selectedTheme && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTheme(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedTheme.title}
                    </h2>
                    <Badge
                      className={`mt-2 bg-gradient-to-r ${categoryColors[selectedTheme.category]} text-white`}
                    >
                      {selectedTheme.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTheme(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {selectedTheme.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {selectedTheme.matchScore}%
                      </div>
                      <div className="text-gray-400 text-sm">Match Score</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-pink-400">
                        {selectedTheme.emotionalResonance}%
                      </div>
                      <div className="text-gray-400 text-sm">
                        Emotional Resonance
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {selectedTheme.storyArcPotential}%
                      </div>
                      <div className="text-gray-400 text-sm">
                        Story Arc Potential
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Suggested Memories
                      </h3>
                      <div className="space-y-2">
                        {selectedTheme.suggestedMemories.map(
                          (memory, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-slate-700/30 rounded"
                            >
                              <Eye size={16} className="text-gray-400" />
                              <span className="text-gray-300">{memory}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Potential Connections
                      </h3>
                      <div className="space-y-2">
                        {selectedTheme.potentialConnections.map(
                          (connection, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-slate-700/30 rounded"
                            >
                              <ArrowRight size={16} className="text-gray-400" />
                              <span className="text-gray-300">
                                {connection}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <BookOpen size={16} className="mr-2" />
                      Start Creating This Story Arc
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
