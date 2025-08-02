import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Blocks,
  Shield,
  Coins,
  Users,
  BookOpen,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number;
  isActive: boolean;
  completionReward: number;
}

interface BlockchainConcept {
  id: string;
  name: string;
  explanation: string;
  visualized: boolean;
  understood: boolean;
}

const LEARNING_MODULES: LearningModule[] = [
  {
    id: "blocks-basics",
    title: "Block Fundamentals",
    description: "Understanding how blocks store data",
    difficulty: "beginner",
    progress: 0,
    isActive: false,
    completionReward: 50,
  },
  {
    id: "hash-functions",
    title: "Cryptographic Hashing",
    description: "How hash functions secure blockchain",
    difficulty: "intermediate",
    progress: 0,
    isActive: false,
    completionReward: 75,
  },
  {
    id: "consensus-mechanisms",
    title: "Consensus Algorithms",
    description: "Proof of Work vs Proof of Stake",
    difficulty: "advanced",
    progress: 0,
    isActive: false,
    completionReward: 100,
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts",
    description: "Self-executing contracts on blockchain",
    difficulty: "intermediate",
    progress: 0,
    isActive: false,
    completionReward: 85,
  },
  {
    id: "gtt-tokenomics",
    title: "GTT Token Economics",
    description: "Understanding token utility and value",
    difficulty: "advanced",
    progress: 0,
    isActive: false,
    completionReward: 125,
  },
];

const BLOCKCHAIN_CONCEPTS: BlockchainConcept[] = [
  {
    id: "immutability",
    name: "Immutability",
    explanation: "Once data is recorded, it cannot be changed",
    visualized: false,
    understood: false,
  },
  {
    id: "decentralization",
    name: "Decentralization",
    explanation: "No single point of control or failure",
    visualized: false,
    understood: false,
  },
  {
    id: "transparency",
    name: "Transparency",
    explanation: "All transactions are publicly verifiable",
    visualized: false,
    understood: false,
  },
  {
    id: "consensus",
    name: "Consensus",
    explanation: "Network agreement on transaction validity",
    visualized: false,
    understood: false,
  },
];

export default function PlayfulBlockchainLearning() {
  const [modules, setModules] = useState(LEARNING_MODULES);
  const [concepts, setConcepts] = useState(BLOCKCHAIN_CONCEPTS);
  const [isLearning, setIsLearning] = useState(false);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [totalGTTEarned, setTotalGTTEarned] = useState(0);
  const [learningStreak, setLearningStreak] = useState(0);

  const startLearning = async (moduleId: string) => {
    setIsLearning(true);
    setCurrentModule(moduleId);

    // Mark module as active
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? { ...module, isActive: true, progress: 0 }
          : { ...module, isActive: false },
      ),
    );

    // Simulate learning progress
    for (let progress = 0; progress <= 100; progress += 5) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setModules((prev) =>
        prev.map((module) =>
          module.id === moduleId ? { ...module, progress } : module,
        ),
      );
    }

    // Mark concepts as understood
    const conceptsToMark = Math.floor(Math.random() * 2) + 1;
    const availableConcepts = concepts.filter((c) => !c.understood);

    for (
      let i = 0;
      i < Math.min(conceptsToMark, availableConcepts.length);
      i++
    ) {
      const randomIndex = Math.floor(Math.random() * availableConcepts.length);
      const conceptToMark = availableConcepts[randomIndex];

      setConcepts((prev) =>
        prev.map((concept) =>
          concept.id === conceptToMark.id
            ? { ...concept, visualized: true, understood: true }
            : concept,
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Award GTT tokens
    const module = modules.find((m) => m.id === moduleId);
    if (module) {
      setTotalGTTEarned((prev) => prev + module.completionReward);
      setLearningStreak((prev) => prev + 1);
    }

    setIsLearning(false);
    setCurrentModule(null);
  };

  const resetLearning = () => {
    setModules(LEARNING_MODULES);
    setConcepts(BLOCKCHAIN_CONCEPTS);
    setIsLearning(false);
    setCurrentModule(null);
    setTotalGTTEarned(0);
    setLearningStreak(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-600";
      case "intermediate":
        return "bg-yellow-600";
      case "advanced":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const overallProgress =
    modules.reduce((sum, module) => sum + module.progress, 0) / modules.length;
  const conceptsUnderstood = concepts.filter((c) => c.understood).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Playful Blockchain Learning Path
        </h1>
        <p className="text-xl text-slate-300">
          Interactive blockchain education with GTT token rewards
        </p>
      </div>

      {/* Learning Stats */}
      <Card className="bg-slate-800/50 border-purple-500/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-purple-400" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">
                {Math.round(overallProgress)}%
              </p>
              <p className="text-sm text-slate-400">Overall Progress</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {totalGTTEarned}
              </p>
              <p className="text-sm text-slate-400">GTT Earned</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {conceptsUnderstood}
              </p>
              <p className="text-sm text-slate-400">Concepts Mastered</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">
                {learningStreak}
              </p>
              <p className="text-sm text-slate-400">Learning Streak</p>
            </div>
          </div>

          {isLearning && currentModule && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">
                  Learning: {modules.find((m) => m.id === currentModule)?.title}
                </span>
                <span className="text-white font-semibold">
                  {modules.find((m) => m.id === currentModule)?.progress || 0}%
                </span>
              </div>
              <Progress
                value={
                  modules.find((m) => m.id === currentModule)?.progress || 0
                }
                className="h-3"
              />
              <p className="text-center text-sm text-purple-400 animate-pulse">
                Absorbing blockchain knowledge...
              </p>
            </div>
          )}

          <Button
            onClick={resetLearning}
            variant="outline"
            className="w-full border-slate-600 text-white"
            disabled={isLearning}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset Learning Progress
          </Button>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <Card
            key={module.id}
            className={`border transition-all duration-300 ${
              module.isActive
                ? "bg-purple-900/20 border-purple-500/50 animate-pulse"
                : module.progress === 100
                  ? "bg-green-900/20 border-green-500/50"
                  : "bg-slate-800/50 border-slate-700"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">
                    {module.title}
                  </CardTitle>
                  <p className="text-slate-400 text-sm">{module.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge
                    className={`text-xs ${getDifficultyColor(module.difficulty)}`}
                  >
                    {module.difficulty.toUpperCase()}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">
                      {module.completionReward}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Progress</span>
                  <span className="text-white">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />

                <Button
                  onClick={() => startLearning(module.id)}
                  disabled={isLearning || module.progress === 100}
                  className="w-full"
                  variant={module.progress === 100 ? "outline" : "default"}
                >
                  {module.progress === 100 ? (
                    <>
                      <Trophy className="mr-2 h-4 w-4" />
                      COMPLETED
                    </>
                  ) : module.isActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      LEARNING...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      START LEARNING
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blockchain Concepts */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Blocks className="h-6 w-6 text-blue-400" />
            Blockchain Concepts Mastered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  concept.understood
                    ? "bg-green-900/20 border-green-500/50"
                    : "bg-slate-700/50 border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{concept.name}</h3>
                  {concept.understood && (
                    <Sparkles className="h-5 w-5 text-green-400" />
                  )}
                </div>
                <p className="text-slate-300 text-sm">{concept.explanation}</p>
                {concept.understood && (
                  <Badge className="mt-2 bg-green-600 text-white text-xs">
                    MASTERED
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Unlock */}
      {conceptsUnderstood === concepts.length && (
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Blockchain Master Achievement Unlocked!
            </h2>
            <p className="text-purple-400 text-lg mb-6">
              You've mastered all core blockchain concepts
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-white font-semibold">Total GTT Earned</p>
                <p className="text-yellow-400 text-xl">{totalGTTEarned}</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Learning Streak</p>
                <p className="text-orange-400 text-xl">{learningStreak}</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Mastery Level</p>
                <p className="text-purple-400 text-xl">Expert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
