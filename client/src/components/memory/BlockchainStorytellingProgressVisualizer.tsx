import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Link2,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Eye,
  ArrowRight,
  Sparkles,
  Hash,
  Timer,
  Award,
} from "lucide-react";

interface StoryChapter {
  id: string;
  title: string;
  content: string;
  status: "completed" | "current" | "upcoming";
  blockHash: string;
  timestamp: Date;
  verifications: number;
  stakingReward: number;
  emotionalScore: number;
  connections: string[];
}

interface StoryArc {
  id: string;
  title: string;
  description: string;
  chapters: StoryChapter[];
  totalReward: number;
  overallProgress: number;
  genre: "family" | "adventure" | "achievement" | "wisdom" | "love";
}

const SAMPLE_STORY: StoryArc = {
  id: "1",
  title: "The Mountain Climber's Journey",
  description: "A decade-long journey from novice to expert mountaineer",
  totalReward: 147.8,
  overallProgress: 65,
  genre: "adventure",
  chapters: [
    {
      id: "1",
      title: "First Steps",
      content: "The day I first set foot on a climbing wall...",
      status: "completed",
      blockHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
      timestamp: new Date("2020-03-15"),
      verifications: 247,
      stakingReward: 15.7,
      emotionalScore: 78,
      connections: ["2", "3"],
    },
    {
      id: "2",
      title: "Learning the Ropes",
      content: "My first outdoor climb and the lessons learned...",
      status: "completed",
      blockHash: "0x2b3c4d5e6f7890abcdef1234567890ab",
      timestamp: new Date("2020-08-22"),
      verifications: 189,
      stakingReward: 12.3,
      emotionalScore: 82,
      connections: ["1", "3", "4"],
    },
    {
      id: "3",
      title: "First Major Peak",
      content: "Conquering my first 14,000 foot summit...",
      status: "completed",
      blockHash: "0x3c4d5e6f7890abcdef1234567890abcd",
      timestamp: new Date("2021-07-10"),
      verifications: 312,
      stakingReward: 18.9,
      emotionalScore: 95,
      connections: ["2", "4", "5"],
    },
    {
      id: "4",
      title: "The Accident",
      content: "A fall that changed everything about my approach...",
      status: "completed",
      blockHash: "0x4d5e6f7890abcdef1234567890abcdef",
      timestamp: new Date("2022-04-18"),
      verifications: 156,
      stakingReward: 9.4,
      emotionalScore: 65,
      connections: ["3", "5"],
    },
    {
      id: "5",
      title: "Recovery and Growth",
      content: "Rebuilding confidence and technique after the setback...",
      status: "current",
      blockHash: "0x5e6f7890abcdef1234567890abcdef12",
      timestamp: new Date("2023-01-12"),
      verifications: 203,
      stakingReward: 14.2,
      emotionalScore: 88,
      connections: ["4", "6"],
    },
    {
      id: "6",
      title: "Everest Base Camp",
      content: "The ultimate test approaches...",
      status: "upcoming",
      blockHash: "",
      timestamp: new Date("2024-05-15"),
      verifications: 0,
      stakingReward: 0,
      emotionalScore: 0,
      connections: ["5"],
    },
  ],
};

const genreColors = {
  family: "from-pink-500 to-rose-500",
  adventure: "from-orange-500 to-red-500",
  achievement: "from-purple-500 to-indigo-500",
  wisdom: "from-green-500 to-teal-500",
  love: "from-pink-500 to-purple-500",
};

const statusColors = {
  completed: "text-green-400 bg-green-500/20",
  current: "text-yellow-400 bg-yellow-500/20",
  upcoming: "text-gray-400 bg-gray-500/20",
};

export default function BlockchainStorytellingProgressVisualizer() {
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(
    null,
  );
  const [storyArc] = useState(SAMPLE_STORY);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getConnectionLines = (chapter: StoryChapter) => {
    return chapter.connections
      .map((connectionId) => {
        const connectedChapter = storyArc.chapters.find(
          (c) => c.id === connectionId,
        );
        return connectedChapter;
      })
      .filter(Boolean);
  };

  const ChapterNode = ({
    chapter,
    index,
  }: {
    chapter: StoryChapter;
    index: number;
  }) => {
    const Icon =
      chapter.status === "completed"
        ? CheckCircle
        : chapter.status === "current"
          ? Clock
          : Timer;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative"
      >
        <Card
          className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
            chapter.status === "completed"
              ? "border-green-500/50 bg-green-500/10"
              : chapter.status === "current"
                ? "border-yellow-500/50 bg-yellow-500/10"
                : "border-gray-500/50 bg-gray-500/10"
          } backdrop-blur-sm`}
          onClick={() => setSelectedChapter(chapter)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Icon
                className={
                  chapter.status === "completed"
                    ? "text-green-400"
                    : chapter.status === "current"
                      ? "text-yellow-400"
                      : "text-gray-400"
                }
                size={20}
              />
              <Badge className={statusColors[chapter.status]}>
                {chapter.status}
              </Badge>
            </div>
            <CardTitle className="text-white text-sm">
              {chapter.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {chapter.status !== "upcoming" && (
              <>
                <div className="flex items-center gap-2 text-xs">
                  <Hash size={12} className="text-blue-400" />
                  <span className="text-gray-400 font-mono">
                    {chapter.blockHash.slice(0, 10)}...
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Users size={10} className="text-purple-400" />
                    <span className="text-gray-400">
                      {chapter.verifications}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={10} className="text-yellow-400" />
                    <span className="text-gray-400">
                      {chapter.stakingReward} GTT
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Emotion Score</span>
                    <span className="text-white">
                      {chapter.emotionalScore}%
                    </span>
                  </div>
                  <Progress value={chapter.emotionalScore} className="h-1" />
                </div>
              </>
            )}

            {chapter.status === "upcoming" && (
              <div className="text-center py-4">
                <Timer className="text-gray-400 mx-auto mb-2" size={24} />
                <p className="text-gray-400 text-xs">Coming Soon</p>
              </div>
            )}
          </CardContent>

          {/* Connection Lines */}
          {chapter.connections.length > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            >
              <Link2 size={12} className="text-white" />
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <BookOpen className="text-blue-400" />
            Blockchain Storytelling Progress Visualizer
            <Link2 className="text-green-400" />
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track your story's journey through the blockchain with immutable
            progress verification
          </p>
        </motion.div>

        {/* Story Arc Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/80 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl">
                    {storyArc.title}
                  </CardTitle>
                  <p className="text-gray-300 mt-2">{storyArc.description}</p>
                </div>
                <Badge
                  className={`bg-gradient-to-r ${genreColors[storyArc.genre]} text-white px-4 py-2`}
                >
                  {storyArc.genre}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-blue-400" size={16} />
                    <span className="text-gray-400 text-sm">
                      Overall Progress
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {storyArc.overallProgress}%
                  </div>
                  <Progress value={storyArc.overallProgress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-purple-400" size={16} />
                    <span className="text-gray-400 text-sm">Chapters</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {
                      storyArc.chapters.filter((c) => c.status === "completed")
                        .length
                    }
                    /{storyArc.chapters.length}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="text-yellow-400" size={16} />
                    <span className="text-gray-400 text-sm">Total Rewards</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-300">
                    {storyArc.totalReward} GTT
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="text-green-400" size={16} />
                    <span className="text-gray-400 text-sm">
                      Total Verifications
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {storyArc.chapters.reduce(
                      (sum, c) => sum + c.verifications,
                      0,
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chapter Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Link2 className="text-blue-400" />
            Story Timeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storyArc.chapters.map((chapter, index) => (
              <ChapterNode key={chapter.id} chapter={chapter} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Blockchain Verification Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-slate-800/80 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="text-green-400" />
                Immutable Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {storyArc.chapters.filter((c) => c.blockHash).length}
              </div>
              <p className="text-gray-300 text-sm">
                Chapters stored on blockchain
              </p>
              <div className="mt-4">
                <motion.div
                  className="flex items-center gap-2 text-green-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle size={16} />
                  <span className="text-sm">Verified & Secured</span>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="text-purple-400" />
                Community Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {storyArc.chapters.reduce((sum, c) => sum + c.verifications, 0)}
              </div>
              <p className="text-gray-300 text-sm">
                Total community verifications
              </p>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-purple-300">
                  <Eye size={16} />
                  <span className="text-sm">
                    Avg:{" "}
                    {Math.round(
                      storyArc.chapters.reduce(
                        (sum, c) => sum + c.verifications,
                        0,
                      ) /
                        storyArc.chapters.filter((c) => c.verifications > 0)
                          .length,
                    )}{" "}
                    per chapter
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 backdrop-blur-sm border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="text-yellow-400" />
                Emotional Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {Math.round(
                  storyArc.chapters.reduce(
                    (sum, c) => sum + c.emotionalScore,
                    0,
                  ) /
                    storyArc.chapters.filter((c) => c.emotionalScore > 0)
                      .length,
                )}
                %
              </div>
              <p className="text-gray-300 text-sm">
                Average emotional resonance
              </p>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-yellow-300">
                  <Sparkles size={16} />
                  <span className="text-sm">High engagement story</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Chapter Detail Modal */}
        <AnimatePresence>
          {selectedChapter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedChapter(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedChapter.title}
                    </h2>
                    <Badge
                      className={`mt-2 ${statusColors[selectedChapter.status]}`}
                    >
                      {selectedChapter.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedChapter(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed">
                    {selectedChapter.content}
                  </p>

                  {selectedChapter.status !== "upcoming" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <h3 className="text-blue-400 font-semibold mb-3">
                            Blockchain Details
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Block Hash:</span>
                              <span className="text-white font-mono text-xs">
                                {selectedChapter.blockHash.slice(0, 8)}...
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Timestamp:</span>
                              <span className="text-white">
                                {selectedChapter.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Verifications:
                              </span>
                              <span className="text-white">
                                {selectedChapter.verifications}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4">
                          <h3 className="text-yellow-400 font-semibold mb-3">
                            Rewards & Impact
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300">
                                Staking Reward:
                              </span>
                              <span className="text-yellow-300 font-bold">
                                {selectedChapter.stakingReward} GTT
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">
                                Emotional Score:
                              </span>
                              <span className="text-white">
                                {selectedChapter.emotionalScore}%
                              </span>
                            </div>
                            <div className="mt-2">
                              <Progress
                                value={selectedChapter.emotionalScore}
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h3 className="text-purple-400 font-semibold mb-3">
                          Story Connections
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {getConnectionLines(selectedChapter).map(
                            (connectedChapter, index) => (
                              <Badge
                                key={index}
                                className="bg-purple-500/20 text-purple-300 cursor-pointer hover:bg-purple-500/30"
                                onClick={() =>
                                  setSelectedChapter(
                                    connectedChapter as StoryChapter,
                                  )
                                }
                              >
                                <ArrowRight size={12} className="mr-1" />
                                {connectedChapter?.title}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
