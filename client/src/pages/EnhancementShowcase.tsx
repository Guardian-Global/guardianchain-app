import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Brain, 
  Shield, 
  Trophy, 
  Compass,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';
import { AnimatedCapsuleInteraction } from '@/components/animations/AnimatedCapsuleInteraction';
import { CapsuleRecommendationEngine } from '@/components/ai/CapsuleRecommendationEngine';
import { BlockchainVerificationVisualizer } from '@/components/visualization/BlockchainVerificationVisualizer';
import { TruthScoreAchievementSystem } from '@/components/gamification/TruthScoreAchievementSystem';
import { PersonalizedUserJourneyFlow } from '@/components/onboarding/PersonalizedUserJourneyFlow';

export default function EnhancementShowcase() {
  const [selectedDemo, setSelectedDemo] = useState<string>('animations');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleCapsuleInteraction = (type: string, capsuleId: string) => {
    console.log(`Interaction: ${type} on capsule ${capsuleId}`);
  };

  const handleOnboardingComplete = (profile: any) => {
    console.log('Onboarding completed:', profile);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <PersonalizedUserJourneyFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ffe1]/20 to-[#7c3aed]/20 rounded-full border border-[#00ffe1]/30 mb-6">
            <Sparkles className="w-5 h-5 text-[#00ffe1]" />
            <span className="text-[#00ffe1] font-medium">Enhanced GuardianChain Experience</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent">
            Next-Generation Features
          </h1>
          
          <p className="text-lg text-[#8b949e] max-w-3xl mx-auto mb-8">
            Experience the future of truth verification with our enhanced visual interactions, 
            AI-powered recommendations, immersive blockchain visualization, gamified achievements, 
            and personalized user journeys.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() => setShowOnboarding(true)}
              className="bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
            >
              <Compass className="w-4 h-4 mr-2" />
              Try Personalized Onboarding
            </Button>
            <Button
              variant="outline"
              className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]"
              onClick={() => setSelectedDemo('blockchain')}
            >
              <Shield className="w-4 h-4 mr-2" />
              See Blockchain Verification
            </Button>
          </div>
        </div>

        {/* Enhancement Tabs */}
        <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#161b22] border border-[#30363d]">
            <TabsTrigger 
              value="animations" 
              className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-[#0d1117]"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Animations
            </TabsTrigger>
            <TabsTrigger 
              value="ai-recommendations"
              className="data-[state=active]:bg-[#ff00d4] data-[state=active]:text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Engine
            </TabsTrigger>
            <TabsTrigger 
              value="blockchain"
              className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Blockchain
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="data-[state=active]:bg-[#f59e0b] data-[state=active]:text-[#0d1117]"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Gamification
            </TabsTrigger>
            <TabsTrigger 
              value="user-journey"
              className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
            >
              <Compass className="w-4 h-4 mr-2" />
              Journey
            </TabsTrigger>
          </TabsList>

          {/* Animated Capsule Interactions */}
          <TabsContent value="animations" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
                  <Sparkles className="w-5 h-5 text-[#00ffe1]" />
                  Animated Capsule Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <AnimatedCapsuleInteraction
                      key={index}
                      capsuleId={`demo-capsule-${index}`}
                      onInteraction={handleCapsuleInteraction}
                    >
                      <Card className="bg-[#21262d] border-[#30363d] p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ffe1] to-[#7c3aed] flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#f0f6fc]">Sample Capsule {index + 1}</h4>
                            <p className="text-sm text-[#8b949e]">Interactive demo capsule</p>
                          </div>
                        </div>
                        <p className="text-sm text-[#8b949e] mb-4">
                          Hover over this capsule to see the enhanced micro-animations and interaction effects in action.
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="border-[#00ffe1] text-[#00ffe1]">
                            Demo
                          </Badge>
                          <Button size="sm" className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]">
                            Interact
                          </Button>
                        </div>
                      </Card>
                    </AnimatedCapsuleInteraction>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-[#21262d] rounded-lg">
                  <h3 className="text-lg font-semibold text-[#f0f6fc] mb-4">Features Demonstrated</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-[#00ffe1] mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[#f0f6fc]">Micro-animations</h4>
                        <p className="text-sm text-[#8b949e]">Subtle hover effects and interactions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#ff00d4] mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[#f0f6fc]">Particle Effects</h4>
                        <p className="text-sm text-[#8b949e]">Dynamic visual feedback on actions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-[#7c3aed] mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[#f0f6fc]">Quick Actions</h4>
                        <p className="text-sm text-[#8b949e]">Contextual interaction buttons</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#10b981] mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[#f0f6fc]">Visual Feedback</h4>
                        <p className="text-sm text-[#8b949e]">Immediate response to user actions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI-Powered Recommendation Engine */}
          <TabsContent value="ai-recommendations" className="space-y-6">
            <CapsuleRecommendationEngine />
          </TabsContent>

          {/* Blockchain Verification Visualizer */}
          <TabsContent value="blockchain" className="space-y-6">
            <BlockchainVerificationVisualizer 
              capsuleId="demo-capsule-verification" 
              autoStart={false}
            />
          </TabsContent>

          {/* Truth Score Achievement System */}
          <TabsContent value="achievements" className="space-y-6">
            <TruthScoreAchievementSystem />
          </TabsContent>

          {/* User Journey Information */}
          <TabsContent value="user-journey" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
                  <Compass className="w-5 h-5 text-[#10b981]" />
                  Personalized User Journey Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center">
                    <Compass className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#f0f6fc] mb-4">
                    Intelligent Onboarding Experience
                  </h3>
                  
                  <p className="text-lg text-[#8b949e] max-w-2xl mx-auto mb-8">
                    Our personalized journey flow adapts to each user's unique needs, goals, and preferences, 
                    creating a tailored onboarding experience that maximizes engagement and understanding.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
                      <div className="w-12 h-12 mx-auto mb-3 bg-[#10b981]/20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-[#10b981]">1</span>
                      </div>
                      <h4 className="font-semibold text-[#f0f6fc] mb-2">Welcome & Goals</h4>
                      <p className="text-sm text-[#8b949e]">Identify user objectives and motivations</p>
                    </div>
                    
                    <div className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
                      <div className="w-12 h-12 mx-auto mb-3 bg-[#10b981]/20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-[#10b981]">2</span>
                      </div>
                      <h4 className="font-semibold text-[#f0f6fc] mb-2">Interests & Topics</h4>
                      <p className="text-sm text-[#8b949e]">Customize content recommendations</p>
                    </div>
                    
                    <div className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
                      <div className="w-12 h-12 mx-auto mb-3 bg-[#10b981]/20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-[#10b981]">3</span>
                      </div>
                      <h4 className="font-semibold text-[#f0f6fc] mb-2">Content Types</h4>
                      <p className="text-sm text-[#8b949e]">Select preferred interaction modes</p>
                    </div>
                    
                    <div className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
                      <div className="w-12 h-12 mx-auto mb-3 bg-[#10b981]/20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-[#10b981]">4</span>
                      </div>
                      <h4 className="font-semibold text-[#f0f6fc] mb-2">Personalization</h4>
                      <p className="text-sm text-[#8b949e]">Create tailored dashboard experience</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setShowOnboarding(true)}
                    size="lg"
                    className="bg-[#10b981] text-white hover:bg-[#059669] px-8"
                  >
                    Experience Personalized Journey
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#161b22] to-[#0d1117] border-[#30363d]">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-[#f0f6fc] mb-4">
                Ready to Experience the Future?
              </h2>
              <p className="text-lg text-[#8b949e] mb-6 max-w-2xl mx-auto">
                These enhancements are now integrated throughout GuardianChain, 
                providing a more engaging, intelligent, and visually stunning experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]">
                  Explore Enhanced Dashboard
                </Button>
                <Button variant="outline" className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]">
                  View All Features
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}