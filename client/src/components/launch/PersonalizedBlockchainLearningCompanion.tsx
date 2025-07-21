import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Trophy, Target, CheckCircle, Star } from "lucide-react";
import { useState } from "react";

export default function PersonalizedBlockchainLearningCompanion() {
  const [selectedModule, setSelectedModule] = useState(0);

  const learningModules = [
    {
      title: "Blockchain Basics",
      progress: 100,
      level: "Beginner",
      duration: "15 min",
      description: "Understanding blocks, chains, and decentralization",
      completed: true
    },
    {
      title: "GTT Token Economics",
      progress: 75,
      level: "Intermediate", 
      duration: "20 min",
      description: "How GTT powers the GUARDIANCHAIN ecosystem",
      completed: false
    },
    {
      title: "Truth Verification",
      progress: 45,
      level: "Intermediate",
      duration: "25 min", 
      description: "Decentralized consensus and verification mechanisms",
      completed: false
    },
    {
      title: "DeFi Integration",
      progress: 0,
      level: "Advanced",
      duration: "30 min",
      description: "Yield farming, staking, and liquidity provision",
      completed: false
    }
  ];

  const achievements = [
    { name: "First Steps", icon: "🚀", earned: true },
    { name: "Token Expert", icon: "💎", earned: true },
    { name: "Truth Seeker", icon: "🔍", earned: false },
    { name: "DeFi Master", icon: "🏆", earned: false }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-green-400 bg-green-500/20";
      case "Intermediate": return "text-blue-400 bg-blue-500/20";
      case "Advanced": return "text-purple-400 bg-purple-500/20";
      default: return "text-slate-400 bg-slate-500/20";
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          Blockchain Learning Companion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto" />
              <div className="text-2xl font-bold text-blue-400">2/4</div>
              <div className="text-sm text-slate-400">Modules Complete</div>
            </div>
            
            <div className="text-center space-y-2">
              <Target className="w-8 h-8 text-green-400 mx-auto" />
              <div className="text-2xl font-bold text-green-400">55%</div>
              <div className="text-sm text-slate-400">Overall Progress</div>
            </div>
            
            <div className="text-center space-y-2">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto" />
              <div className="text-2xl font-bold text-yellow-400">2/4</div>
              <div className="text-sm text-slate-400">Achievements</div>
            </div>
            
            <div className="text-center space-y-2">
              <Star className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-2xl font-bold text-purple-400">150</div>
              <div className="text-sm text-slate-400">XP Points</div>
            </div>
          </div>

          {/* Learning Modules */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Learning Path</h4>
            <div className="space-y-3">
              {learningModules.map((module, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedModule === index 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedModule(index)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-500 rounded-full" />
                      )}
                      <h5 className="font-semibold">{module.title}</h5>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getLevelColor(module.level)}>
                        {module.level}
                      </Badge>
                      <span className="text-sm text-slate-400">{module.duration}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3">{module.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-purple-400">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Achievements</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-center ${
                    achievement.earned 
                      ? 'bg-yellow-500/20 border border-yellow-500/30' 
                      : 'bg-slate-700/50 border border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <div className={`text-sm font-semibold ${
                    achievement.earned ? 'text-yellow-400' : 'text-slate-400'
                  }`}>
                    {achievement.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
            <Button variant="outline" className="border-slate-600">
              <Trophy className="w-4 h-4 mr-2" />
              View Certificates
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}