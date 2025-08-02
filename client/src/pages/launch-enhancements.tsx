import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Heart,
  Share2,
  Stars,
  Zap,
  Eye,
  PlayCircle,
  Palette,
  Gift,
} from "lucide-react";

// Import all enhancement components
import OnboardingTour from "@/components/OnboardingTour";
import {
  EmotionProvider,
  EmotionAnimatedBackground,
  EmotionIndicator,
  EmotionButton,
  useEmotion,
} from "@/components/EmotionResponsiveUI";
import ShareableInfographic from "@/components/ShareableInfographic";
import AchievementConstellation from "@/components/AchievementConstellation";
import CapsuleCreationMicroAnimations from "@/components/CapsuleCreationMicroAnimations";

interface EnhancementShowcaseProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}

function EnhancementShowcase({
  title,
  description,
  icon: Icon,
  children,
}: EnhancementShowcaseProps) {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Icon className="w-5 h-5 mr-2 text-blue-400" />
          {title}
        </CardTitle>
        <p className="text-slate-400 text-sm">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function EmotionDemo() {
  const { setEmotion, currentEmotion } = useEmotion();

  const emotions = [
    { key: "joy", label: "Joy", emoji: "😊" },
    { key: "sadness", label: "Sadness", emoji: "😢" },
    { key: "anger", label: "Anger", emoji: "😠" },
    { key: "fear", label: "Fear", emoji: "😨" },
    { key: "surprise", label: "Surprise", emoji: "😲" },
    { key: "neutral", label: "Neutral", emoji: "😐" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <EmotionIndicator />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {emotions.map((emotion) => (
          <EmotionButton
            key={emotion.key}
            variant={currentEmotion === emotion.key ? "primary" : "secondary"}
            onClick={() => setEmotion(emotion.key as any)}
          >
            <span className="mr-1">{emotion.emoji}</span>
            {emotion.label}
          </EmotionButton>
        ))}
      </div>

      <p className="text-sm text-slate-400 text-center">
        Switch emotions to see the UI adapt with different colors and animations
      </p>
    </div>
  );
}

export default function LaunchEnhancements() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("tour");

  const sampleInfographicData = {
    totalCapsules: 47,
    verifiedCapsules: 32,
    gttEarned: 1247.89,
    emotionalResonance: 94.2,
    topEmotions: [
      { emotion: "Joy", percentage: 35, color: "#f59e0b" },
      { emotion: "Nostalgia", percentage: 28, color: "#3b82f6" },
      { emotion: "Gratitude", percentage: 22, color: "#10b981" },
      { emotion: "Hope", percentage: 15, color: "#8b5cf6" },
    ],
    recentAchievements: [
      "Truth Seeker - First 10 capsules verified",
      "Emotional Depth - 90+ resonance score",
      "Community Builder - 25+ jury validations",
    ],
  };

  return (
    <EmotionProvider>
      <EmotionAnimatedBackground>
        <div className="min-h-screen bg-slate-950 text-white">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                GUARDIANCHAIN Launch Enhancements
              </h1>
              <p className="text-xl text-slate-300 mb-6">
                Experience the next generation of user engagement features
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setShowOnboarding(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Platform Tour
                </Button>
              </div>
            </motion.div>

            {/* Enhancement Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
                <TabsTrigger
                  value="tour"
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Tour</span>
                </TabsTrigger>
                <TabsTrigger
                  value="emotion"
                  className="flex items-center space-x-2"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Emotion UI</span>
                </TabsTrigger>
                <TabsTrigger
                  value="infographic"
                  className="flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Infographics</span>
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="flex items-center space-x-2"
                >
                  <Stars className="w-4 h-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </TabsTrigger>
                <TabsTrigger
                  value="creation"
                  className="flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Creation</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tour" className="space-y-6">
                <EnhancementShowcase
                  title="Interactive Onboarding Tour"
                  description="Animated storytelling elements guide new users through the platform"
                  icon={Eye}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-400">Features:</h4>
                        <ul className="space-y-1 text-slate-300">
                          <li>• Step-by-step guided tour</li>
                          <li>• Interactive element highlighting</li>
                          <li>• Progress tracking with animations</li>
                          <li>• Contextual tooltips and descriptions</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-400">
                          Benefits:
                        </h4>
                        <ul className="space-y-1 text-slate-300">
                          <li>• Reduced user onboarding time</li>
                          <li>• Higher feature adoption rates</li>
                          <li>• Improved user engagement</li>
                          <li>• Professional first impression</li>
                        </ul>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowOnboarding(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Launch Demo Tour
                    </Button>
                  </div>
                </EnhancementShowcase>
              </TabsContent>

              <TabsContent value="emotion" className="space-y-6">
                <EnhancementShowcase
                  title="Emotion-Responsive UI Color Palette"
                  description="Dynamic interface that adapts to user emotional state and content sentiment"
                  icon={Palette}
                >
                  <EmotionDemo />
                </EnhancementShowcase>
              </TabsContent>

              <TabsContent value="infographic" className="space-y-6">
                <EnhancementShowcase
                  title="One-Click Shareable Infographic Generator"
                  description="Professional legacy highlights with social media integration"
                  icon={Share2}
                >
                  <ShareableInfographic
                    data={sampleInfographicData}
                    userHandle="TruthSeeker47"
                  />
                </EnhancementShowcase>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <EnhancementShowcase
                  title="Interactive User Achievement Constellation Map"
                  description="Gamified achievement system with connected progress visualization"
                  icon={Stars}
                >
                  <AchievementConstellation />
                </EnhancementShowcase>
              </TabsContent>

              <TabsContent value="creation" className="space-y-6">
                <EnhancementShowcase
                  title="Micro-Animations for Capsule Creation Workflow"
                  description="Real-time feedback and progress visualization during capsule creation"
                  icon={Zap}
                >
                  <CapsuleCreationMicroAnimations />
                </EnhancementShowcase>
              </TabsContent>
            </Tabs>

            {/* Implementation Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-green-400" />
                    Launch Enhancement Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-400 mb-3">
                        ✅ Completed Features
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li>
                          • Interactive onboarding tour with storytelling
                          elements
                        </li>
                        <li>• Emotion-responsive UI color palette system</li>
                        <li>• One-click shareable infographic generator</li>
                        <li>• Interactive achievement constellation map</li>
                        <li>
                          • Micro-animations for capsule creation workflow
                        </li>
                        <li>• Social media sharing integration</li>
                        <li>
                          • Real-time grief scoring and emotional analysis
                        </li>
                        <li>• Professional PDF export capabilities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-400 mb-3">
                        🚀 Technical Integration
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li>• Framer Motion animations integrated</li>
                        <li>• HTML2Canvas for image generation</li>
                        <li>• Context-based emotion detection</li>
                        <li>• Progressive Web App compatibility</li>
                        <li>• Mobile-responsive design maintained</li>
                        <li>• Performance optimized with lazy loading</li>
                        <li>• Accessibility features included</li>
                        <li>• Cross-browser compatibility tested</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Onboarding Tour */}
          <OnboardingTour
            isOpen={showOnboarding}
            onComplete={() => setShowOnboarding(false)}
            onSkip={() => setShowOnboarding(false)}
          />
        </div>
      </EmotionAnimatedBackground>
    </EmotionProvider>
  );
}
