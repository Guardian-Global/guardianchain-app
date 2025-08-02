import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Shield, 
  Coins, 
  Brain,
  CheckCircle,
  Star,
  Users,
  Activity,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

export default function LiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Create Truth Capsule",
      description: "Submit your memory, testimony, or digital asset for verification",
      icon: Shield,
      status: "completed"
    },
    {
      title: "AI Verification",
      description: "Advanced AI analyzes content authenticity and generates truth score",
      icon: Brain,
      status: "completed"
    },
    {
      title: "Community Review",
      description: "Guardian network validates and scores your submission",
      icon: Users,
      status: "active"
    },
    {
      title: "Earn GTT Rewards",
      description: "Receive tokens based on verification success and grief score",
      icon: Coins,
      status: "pending"
    }
  ];

  const liveStats = {
    totalCapsules: "25,847",
    activeValidators: "1,234",
    gttDistributed: "$2.4M",
    truthAccuracy: "98.7%"
  };

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate demo progression
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= demoSteps.length - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Live GuardianChain Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Experience the complete truth verification process from capsule creation to GTT rewards
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
              <Activity className="h-3 w-3 mr-1" />
              Live Network
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active Demo
            </Badge>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-400 mb-2">{liveStats.totalCapsules}</div>
              <div className="text-gray-400">Truth Capsules</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-400 mb-2">{liveStats.activeValidators}</div>
              <div className="text-gray-400">Active Validators</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{liveStats.gttDistributed}</div>
              <div className="text-gray-400">GTT Distributed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-400 mb-2">{liveStats.truthAccuracy}</div>
              <div className="text-gray-400">Truth Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Interactive Verification Process</CardTitle>
              <CardDescription>
                Watch how GuardianChain transforms memories into verified digital assets
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              {/* Demo Controls */}
              <div className="text-center mb-8">
                <Button 
                  onClick={handlePlayDemo}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause Demo
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Demo
                    </>
                  )}
                </Button>
              </div>

              {/* Demo Steps */}
              <div className="space-y-6">
                {demoSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep && isPlaying;
                  const isCompleted = index < currentStep || step.status === "completed";
                  
                  return (
                    <div key={index} className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
                      isActive 
                        ? 'bg-blue-600/20 border-blue-500/50 scale-105' 
                        : isCompleted 
                          ? 'bg-green-600/10 border-green-500/30' 
                          : 'bg-slate-700/30 border-slate-600/50'
                    }`}>
                      <div className={`p-3 rounded-lg ${
                        isActive 
                          ? 'bg-blue-600/30' 
                          : isCompleted 
                            ? 'bg-green-600/30' 
                            : 'bg-slate-600/30'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        ) : (
                          <Icon className={`h-6 w-6 ${
                            isActive ? 'text-blue-400' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${
                          isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-white'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-gray-300 text-sm">{step.description}</p>
                      </div>
                      
                      {isActive && (
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse h-2 w-2 bg-blue-400 rounded-full"></div>
                          <span className="text-blue-400 text-sm">Processing...</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 border-slate-700/50">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-400 mb-2" />
              <CardTitle>Veritas Sealed</CardTitle>
              <CardDescription>Ultimate truth verification with blockchain guarantee</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Multi-layer verification process</li>
                <li>• Immutable blockchain storage</li>
                <li>• Professional validator review</li>
                <li>• 3x GTT reward multiplier</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-green-900/20 border-slate-700/50">
            <CardHeader>
              <Coins className="h-8 w-8 text-green-400 mb-2" />
              <CardTitle>GTT Tokenomics</CardTitle>
              <CardDescription>Earn rewards for truth verification and quality content</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• GriefScore-based yield calculation</li>
                <li>• Tier-based reward multipliers</li>
                <li>• Staking for passive income</li>
                <li>• Community governance rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700/50">
            <CardHeader>
              <Brain className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle>AI Integration</CardTitle>
              <CardDescription>Advanced AI-powered content analysis and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Automated authenticity scoring</li>
                <li>• Personalized recommendations</li>
                <li>• Content optimization suggestions</li>
                <li>• Fraud detection algorithms</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Preserving Truth?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of guardians already earning GTT rewards through verified truth preservation.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/api/login">
                    <Shield className="h-4 w-4 mr-2" />
                    Start Now
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-600/20">
                  <Link href="/truth-vault">
                    <Star className="h-4 w-4 mr-2" />
                    Explore Vault
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}