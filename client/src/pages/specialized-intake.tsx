import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  Music,
  Newspaper,
  Crown,
  Users,
  FlaskConical,
  Wrench,
  Building,
  Trophy,
  Heart,
  AlertTriangle,
  Video,
  BookOpen,
  Briefcase,
  Zap,
  Shield,
} from "lucide-react";

interface SpecializedCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  features: string[];
  verificationMethods: string[];
  rewardMultiplier: number;
  specialTools: string[];
  color: string;
}

const SPECIALIZED_CATEGORIES: SpecializedCategory[] = [
  {
    id: "truth-oracle",
    name: "Truth Oracle (Influencer)",
    icon: Crown,
    description:
      "Verified content creators with massive reach amplifying authentic truth",
    features: [
      "Influence Impact Scoring",
      "Viral Truth Amplification",
      "Audience Authenticity Verification",
      "Cross-Platform Truth Syndication",
    ],
    verificationMethods: [
      "Social Media Following Verification",
      "Engagement Rate Authentication",
      "Historical Content Accuracy Check",
      "Community Trust Score",
    ],
    rewardMultiplier: 3.5,
    specialTools: [
      "Viral Prediction Engine",
      "Audience Demographics Analysis",
      "Content Performance Optimizer",
      "Truth Amplification Dashboard",
    ],
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "sovereign-journalist",
    name: "Sovereign Truth Correspondent",
    icon: Newspaper,
    description:
      "Independent journalists breaking free from corporate media control",
    features: [
      "Source Protection Protocol",
      "Real-Time Fact Verification",
      "Breaking News Priority Queue",
      "Anonymous Tip Integration",
    ],
    verificationMethods: [
      "Press Credentials Verification",
      "Source Documentation Review",
      "Timeline Consistency Check",
      "Geographic Location Validation",
    ],
    rewardMultiplier: 4.0,
    specialTools: [
      "Anonymous Source Portal",
      "Live Fact-Check Dashboard",
      "Evidence Chain Tracker",
      "Whistleblower Protection Suite",
    ],
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "voice-sovereign",
    name: "Voice Sovereign (Podcaster)",
    icon: Mic,
    description:
      "Audio truth specialists reaching millions through spoken word",
    features: [
      "Audio Content Transcription",
      "Voice Authentication Technology",
      "Podcast Episode Verification",
      "Guest Credibility Scoring",
    ],
    verificationMethods: [
      "Voice Print Analysis",
      "Audio Quality Assessment",
      "Content Timestamp Verification",
      "Guest Background Validation",
    ],
    rewardMultiplier: 2.8,
    specialTools: [
      "Auto-Transcription Engine",
      "Voice Authenticity Detector",
      "Episode Performance Analytics",
      "Guest Truth Score Database",
    ],
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "harmony-guardian",
    name: "Harmony Guardian (Artist/Musician)",
    icon: Music,
    description: "Creative truth-tellers using art and music to expose reality",
    features: [
      "Artistic Expression Protection",
      "Creative Content Authentication",
      "Performance Rights Verification",
      "Cultural Impact Measurement",
    ],
    verificationMethods: [
      "Original Work Verification",
      "Performance History Validation",
      "Creative Process Documentation",
      "Cultural Authenticity Check",
    ],
    rewardMultiplier: 2.5,
    specialTools: [
      "Creative Content Authenticator",
      "Performance Rights Tracker",
      "Cultural Impact Analyzer",
      "Artistic Truth Scorer",
    ],
    color: "from-orange-600 to-red-600",
  },
  {
    id: "knowledge-architect",
    name: "Knowledge Architect (Non-Fiction Writer)",
    icon: BookOpen,
    description:
      "Researchers and authors documenting reality through written truth",
    features: [
      "Research Citation Verification",
      "Manuscript Authentication",
      "Peer Review Integration",
      "Knowledge Graph Building",
    ],
    verificationMethods: [
      "Academic Credential Check",
      "Source Citation Verification",
      "Peer Review Validation",
      "Research Methodology Assessment",
    ],
    rewardMultiplier: 3.2,
    specialTools: [
      "Citation Validator",
      "Research Database Access",
      "Peer Review Portal",
      "Knowledge Impact Tracker",
    ],
    color: "from-indigo-600 to-purple-600",
  },
  {
    id: "discovery-pioneer",
    name: "Discovery Pioneer (Scientist)",
    icon: FlaskConical,
    description:
      "Scientific truth discoverers pushing the boundaries of human knowledge",
    features: [
      "Research Data Verification",
      "Experiment Replication Tracking",
      "Peer Review Acceleration",
      "Scientific Misconduct Detection",
    ],
    verificationMethods: [
      "Academic Institution Verification",
      "Research Data Validation",
      "Experimental Method Review",
      "Publication History Check",
    ],
    rewardMultiplier: 4.5,
    specialTools: [
      "Data Integrity Checker",
      "Experiment Replicator",
      "Research Collaboration Hub",
      "Scientific Truth Validator",
    ],
    color: "from-cyan-600 to-blue-600",
  },
  {
    id: "innovation-architect",
    name: "Innovation Architect (Engineer)",
    icon: Wrench,
    description:
      "Technical truth-builders creating solutions that change the world",
    features: [
      "Technical Documentation Verification",
      "Patent Authenticity Check",
      "Innovation Impact Tracking",
      "Safety Protocol Validation",
    ],
    verificationMethods: [
      "Professional License Verification",
      "Technical Competency Assessment",
      "Project Portfolio Review",
      "Safety Record Validation",
    ],
    rewardMultiplier: 3.8,
    specialTools: [
      "Technical Spec Validator",
      "Innovation Impact Calculator",
      "Safety Compliance Checker",
      "Patent Truth Verifier",
    ],
    color: "from-gray-600 to-slate-600",
  },
  {
    id: "governance-guardian",
    name: "Governance Guardian (Politician)",
    icon: Building,
    description:
      "Public servants committed to transparent governance and accountability",
    features: [
      "Voting Record Transparency",
      "Policy Impact Tracking",
      "Campaign Promise Monitoring",
      "Conflict of Interest Detection",
    ],
    verificationMethods: [
      "Electoral Office Verification",
      "Voting Record Validation",
      "Financial Disclosure Review",
      "Public Statement Consistency",
    ],
    rewardMultiplier: 5.0,
    specialTools: [
      "Policy Impact Analyzer",
      "Promise Tracker Dashboard",
      "Transparency Score Calculator",
      "Public Trust Meter",
    ],
    color: "from-red-600 to-rose-600",
  },
  {
    id: "performance-champion",
    name: "Performance Champion (Athletic Records)",
    icon: Trophy,
    description:
      "Athletes setting verified records and inspiring human potential",
    features: [
      "Performance Data Validation",
      "Drug Testing Integration",
      "Competition Result Verification",
      "Training Regimen Documentation",
    ],
    verificationMethods: [
      "Official Competition Validation",
      "Performance Measurement Verification",
      "Anti-Doping Compliance Check",
      "Training History Review",
    ],
    rewardMultiplier: 2.2,
    specialTools: [
      "Performance Data Authenticator",
      "Competition Result Verifier",
      "Training Log Validator",
      "Achievement Impact Tracker",
    ],
    color: "from-yellow-600 to-orange-600",
  },
  {
    id: "wellness-advocate",
    name: "Wellness Advocate (Health)",
    icon: Heart,
    description:
      "Health professionals and advocates promoting verified wellness information",
    features: [
      "Medical Credential Verification",
      "Treatment Outcome Tracking",
      "Research Study Validation",
      "Patient Safety Monitoring",
    ],
    verificationMethods: [
      "Medical License Verification",
      "Board Certification Check",
      "Clinical Trial Validation",
      "Patient Outcome Assessment",
    ],
    rewardMultiplier: 4.2,
    specialTools: [
      "Medical Credential Validator",
      "Clinical Data Verifier",
      "Treatment Outcome Tracker",
      "Health Impact Analyzer",
    ],
    color: "from-green-600 to-teal-600",
  },
  {
    id: "shadow-revealer",
    name: "Shadow Revealer (Whistleblower)",
    icon: AlertTriangle,
    description:
      "Courageous truth-tellers exposing corruption and protecting the public interest",
    features: [
      "Anonymous Submission Protocol",
      "Identity Protection System",
      "Legal Protection Framework",
      "Evidence Validation Pipeline",
    ],
    verificationMethods: [
      "Anonymous Evidence Review",
      "Multi-Source Corroboration",
      "Legal Risk Assessment",
      "Public Interest Validation",
    ],
    rewardMultiplier: 10.0,
    specialTools: [
      "Anonymous Submission Portal",
      "Identity Protection Suite",
      "Legal Shield Generator",
      "Evidence Authentication Hub",
    ],
    color: "from-red-700 to-amber-600",
  },
];

export default function SpecializedIntakePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = SPECIALIZED_CATEGORIES.find((c) => c.id === categoryId);
    toast({
      title: "Category Selected",
      description: `Initializing ${category?.name} intake process`,
    });
  };

  const selectedCategoryData = SPECIALIZED_CATEGORIES.find(
    (c) => c.id === selectedCategory
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Specialized Truth Verification Portals
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose your specialized category to access custom verification
            tools, enhanced rewards, and industry-specific truth validation
            protocols
          </p>
        </div>

        {!selectedCategory ? (
          /* Category Selection Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALIZED_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:scale-105 transition-all duration-300 border-slate-700 hover:border-slate-600 bg-slate-800/50"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardHeader>
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-center text-lg">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-sm text-slate-400">
                      {category.description}
                    </p>
                    <div className="flex justify-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {category.rewardMultiplier}x Rewards
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {category.features.length} Features
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Selected Category Interface */
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="text-white border-slate-600"
              >
                ← Back to Categories
              </Button>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedCategoryData?.color} flex items-center justify-center`}
                >
                  {selectedCategoryData?.icon && (
                    <selectedCategoryData.icon className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedCategoryData?.name}
                  </h2>
                  <p className="text-slate-400">
                    {selectedCategoryData?.description}
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="tools">Specialized Tools</TabsTrigger>
                <TabsTrigger value="submit">Submit Content</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Enhanced Features for {selectedCategoryData?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedCategoryData?.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      Verification Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCategoryData?.verificationMethods.map(
                        (method, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
                          >
                            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-400">
                                {index + 1}
                              </span>
                            </div>
                            <span className="text-sm">{method}</span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-purple-500" />
                      Specialized Tools & Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedCategoryData?.specialTools.map((tool, index) => (
                        <Card
                          key={index}
                          className="bg-slate-700/30 border-slate-600"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Wrench className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm">
                                  {tool}
                                </h4>
                                <p className="text-xs text-slate-400">
                                  Professional grade tool
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="submit" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      Submit Verified Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-6 border-2 border-dashed border-slate-600 rounded-lg">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedCategoryData?.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        {selectedCategoryData?.icon && (
                          <selectedCategoryData.icon className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        Ready to Submit Truth
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Access your specialized {selectedCategoryData?.name}{" "}
                        submission portal with enhanced verification and{" "}
                        {selectedCategoryData?.rewardMultiplier}x reward
                        multiplier
                      </p>
                      <Button
                        size="lg"
                        className={`bg-gradient-to-r ${selectedCategoryData?.color} hover:opacity-90`}
                        onClick={() => {
                          toast({
                            title: "Portal Activated",
                            description: `${selectedCategoryData?.name} submission portal is now active`,
                          });
                        }}
                      >
                        Launch Specialized Portal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
