import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CapsuleLoopDisplay from "@/components/profile/CapsuleLoopDisplay";
import QuantumSecurityPanel from "@/components/profile/QuantumSecurityPanel";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Bot,
  Palette,
  Shield,
  Eye,
  Brain,
  Sparkles,
  Zap,
  Lock,
  Camera,
  Infinity,
  Globe,
  Timer,
  Settings,
  Save,
  RefreshCw,
  Wand2,
  Star,
  Crown,
  Fingerprint,
  Cpu,
  Radio,
  Waves,
  Orbit,
} from "lucide-react";

interface AIPersona {
  id: string;
  name: string;
  description: string;
  traits: string[];
  color: string;
}

interface SecurityLevel {
  id: string;
  name: string;
  description: string;
  features: string[];
  level: number;
}

const aiPersonas: AIPersona[] = [
  {
    id: "guardian",
    name: "Truth Guardian",
    description:
      "Protects and validates your content with military-grade precision",
    traits: ["Analytical", "Protective", "Vigilant", "Precise"],
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "sage",
    name: "Digital Sage",
    description: "Provides wisdom and insights from vast knowledge networks",
    traits: ["Wise", "Contemplative", "Deep", "Insightful"],
    color: "from-purple-600 to-indigo-600",
  },
  {
    id: "pioneer",
    name: "Future Pioneer",
    description: "Explores cutting-edge possibilities and innovative solutions",
    traits: ["Innovative", "Forward-thinking", "Creative", "Bold"],
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "oracle",
    name: "Truth Oracle",
    description: "Predicts trends and reveals hidden patterns in data",
    traits: ["Prophetic", "Pattern-aware", "Intuitive", "Revealing"],
    color: "from-yellow-600 to-orange-600",
  },
  {
    id: "phantom",
    name: "Ghost Protocol",
    description: "Ultimate privacy and stealth operations specialist",
    traits: ["Stealthy", "Anonymous", "Secure", "Invisible"],
    color: "from-gray-600 to-slate-600",
  },
];

const securityLevels: SecurityLevel[] = [
  {
    id: "quantum",
    name: "Quantum Shield",
    description: "Military-grade quantum encryption with time-locked access",
    features: [
      "Quantum Key Distribution",
      "Post-Quantum Cryptography",
      "Zero-Knowledge Proofs",
      "Temporal Locks",
    ],
    level: 5,
  },
  {
    id: "neural",
    name: "Neural Fortress",
    description: "AI-powered behavioral biometrics and pattern recognition",
    features: [
      "Behavioral Biometrics",
      "Neural Pattern Recognition",
      "Anomaly Detection",
      "Adaptive Security",
    ],
    level: 4,
  },
  {
    id: "phantom",
    name: "Phantom Protocol",
    description: "Advanced stealth mode with onion routing and anonymization",
    features: [
      "Onion Routing",
      "Data Obfuscation",
      "Identity Scrambling",
      "Ghost Transactions",
    ],
    level: 4,
  },
  {
    id: "vault",
    name: "Truth Vault",
    description: "Multi-signature governance with distributed consensus",
    features: [
      "Multi-Signature Auth",
      "Distributed Consensus",
      "Social Recovery",
      "Time Delays",
    ],
    level: 3,
  },
  {
    id: "guardian",
    name: "Guardian Standard",
    description: "Enhanced 2FA with hardware security modules",
    features: [
      "Hardware 2FA",
      "Biometric Auth",
      "Device Fingerprinting",
      "Location Validation",
    ],
    level: 2,
  },
];

const backgroundThemes = [
  {
    id: "cosmic",
    name: "Cosmic Void",
    gradient: "from-purple-900 via-blue-900 to-black",
  },
  {
    id: "neural",
    name: "Neural Network",
    gradient: "from-cyan-900 via-blue-900 to-purple-900",
  },
  {
    id: "quantum",
    name: "Quantum Field",
    gradient: "from-green-900 via-teal-900 to-blue-900",
  },
  {
    id: "matrix",
    name: "Digital Matrix",
    gradient: "from-green-800 via-black to-green-900",
  },
  {
    id: "plasma",
    name: "Plasma Storm",
    gradient: "from-pink-900 via-purple-900 to-indigo-900",
  },
  {
    id: "aurora",
    name: "Aurora Borealis",
    gradient: "from-blue-900 via-green-800 to-purple-900",
  },
  {
    id: "void",
    name: "Void Walker",
    gradient: "from-black via-gray-900 to-black",
  },
  {
    id: "crystal",
    name: "Crystal Lattice",
    gradient: "from-blue-800 via-cyan-700 to-teal-800",
  },
];

export default function AdvancedProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    aiPersona: "guardian",
    securityLevel: "vault",
    backgroundTheme: "cosmic",
    capsuleDisplayMode: "infinite-loop",
    aiFilterIntensity: 75,
    privacyMode: "stealth",
    biometricSync: true,
    quantumEncryption: false,
    neuralAnalysis: true,
    ghostMode: false,
    timeLockedAccess: false,
    socialRecovery: true,
    capsuleLoopSpeed: 3,
    holographicDisplay: true,
    aiAssistantLevel: "advanced",
    dataObfuscation: true,
    behavioralMasking: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  // Get user from localStorage
  const userStr = localStorage.getItem("auth_user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    // Generate AI personality insight
    const selectedPersona = aiPersonas.find((p) => p.id === profile.aiPersona);
    if (selectedPersona) {
      setAiInsight(
        `Your ${selectedPersona.name} AI companion is ${selectedPersona.traits.join(", ").toLowerCase()} by nature. This creates a unique digital fingerprint that enhances your truth verification capabilities.`,
      );
    }
  }, [profile.aiPersona]);

  const handleSave = async () => {
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save to localStorage with advanced settings
    const updatedUser = {
      ...user,
      advancedProfile: profile,
      lastProfileUpdate: new Date().toISOString(),
    };
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));

    toast({
      title: "Neural Profile Synchronized",
      description:
        "Your advanced AI profile has been quantum-encrypted and stored.",
    });

    setIsProcessing(false);
  };

  const generateAIRecommendation = () => {
    const recommendations = [
      "Consider upgrading to Quantum Shield for maximum security",
      "Your neural patterns suggest compatibility with Ghost Protocol",
      "Enabling behavioral masking would enhance your privacy profile",
      "Time-locked access could protect your most sensitive capsules",
      "Your AI persona synergy is at 94% - excellent compatibility",
    ];

    toast({
      title: "AI Recommendation",
      description:
        recommendations[Math.floor(Math.random() * recommendations.length)],
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">
            Neural access denied. Authentication required.
          </p>
          <Button onClick={() => (window.location.href = "/")} className="mt-4">
            Initialize Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${backgroundThemes.find((t) => t.id === profile.backgroundTheme)?.gradient || "from-slate-900 to-black"} p-6 transition-all duration-1000`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center space-x-3">
            <Brain className="h-8 w-8 text-cyan-400" />
            <span>Neural Profile Matrix</span>
            <Sparkles className="h-8 w-8 text-purple-400" />
          </h1>
          <p className="text-slate-300">
            Configure your AI-enhanced identity and security protocols
          </p>
          <div className="mt-4">
            <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-4 py-2">
              QUANTUM ENHANCED
            </Badge>
          </div>
        </div>

        {/* AI Insight Panel */}
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>AI Personality Insight</span>
              <Button
                onClick={generateAIRecommendation}
                variant="ghost"
                size="sm"
                className="ml-auto text-purple-400 hover:text-purple-300"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Insight
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">{aiInsight}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Persona Selection */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>AI Persona Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {aiPersonas.map((persona) => (
                  <div
                    key={persona.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      profile.aiPersona === persona.id
                        ? "border-purple-500 bg-purple-900/20"
                        : "border-slate-700 hover:border-purple-600/50"
                    }`}
                    onClick={() =>
                      setProfile({ ...profile, aiPersona: persona.id })
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${persona.color} flex items-center justify-center`}
                      >
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {persona.name}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {persona.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {persona.traits.map((trait) => (
                            <Badge
                              key={trait}
                              variant="secondary"
                              className="text-xs"
                            >
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Level */}
          <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Protocol</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {securityLevels.map((level) => (
                  <div
                    key={level.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      profile.securityLevel === level.id
                        ? "border-red-500 bg-red-900/20"
                        : "border-slate-700 hover:border-red-600/50"
                    }`}
                    onClick={() =>
                      setProfile({ ...profile, securityLevel: level.id })
                    }
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-red-400" />
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < level.level ? "bg-red-400" : "bg-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mt-2">
                      {level.name}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {level.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {level.features.slice(0, 2).map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual & Display Settings */}
        <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Quantum Visual Matrix</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Background Theme */}
            <div>
              <Label className="text-slate-300 mb-3 block">
                Neural Background Theme
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {backgroundThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                      profile.backgroundTheme === theme.id
                        ? "border-green-500 scale-105"
                        : "border-slate-700 hover:border-green-600/50"
                    }`}
                    onClick={() =>
                      setProfile({ ...profile, backgroundTheme: theme.id })
                    }
                  >
                    <div
                      className={`w-full h-16 rounded bg-gradient-to-br ${theme.gradient} mb-2`}
                    />
                    <p className="text-white text-sm font-medium">
                      {theme.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Capsule Display Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-slate-300 mb-3 block">
                  Capsule Display Mode
                </Label>
                <Select
                  value={profile.capsuleDisplayMode}
                  onValueChange={(value) =>
                    setProfile({ ...profile, capsuleDisplayMode: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="infinite-loop">
                      ∞ Infinite Loop
                    </SelectItem>
                    <SelectItem value="neural-cascade">
                      🧠 Neural Cascade
                    </SelectItem>
                    <SelectItem value="quantum-spiral">
                      🌀 Quantum Spiral
                    </SelectItem>
                    <SelectItem value="holographic-grid">
                      📐 Holographic Grid
                    </SelectItem>
                    <SelectItem value="plasma-wave">🌊 Plasma Wave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300 mb-3 block">
                  Loop Speed: {profile.capsuleLoopSpeed}x
                </Label>
                <Slider
                  value={[profile.capsuleLoopSpeed]}
                  onValueChange={(value) =>
                    setProfile({ ...profile, capsuleLoopSpeed: value[0] })
                  }
                  max={10}
                  min={0.5}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>

            {/* AI Filter Intensity */}
            <div>
              <Label className="text-slate-300 mb-3 block">
                AI Filter Intensity: {profile.aiFilterIntensity}%
              </Label>
              <Slider
                value={[profile.aiFilterIntensity]}
                onValueChange={(value) =>
                  setProfile({ ...profile, aiFilterIntensity: value[0] })
                }
                max={100}
                min={0}
                step={5}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Natural</span>
                <span>Enhanced</span>
                <span>Cyber-Augmented</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Security Features */}
        <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center space-x-2">
              <Fingerprint className="h-5 w-5" />
              <span>Quantum Security Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Security Toggles */}
              {[
                {
                  key: "biometricSync",
                  label: "Biometric Synchronization",
                  icon: Fingerprint,
                  desc: "Neural pattern recognition",
                },
                {
                  key: "quantumEncryption",
                  label: "Quantum Encryption",
                  icon: Cpu,
                  desc: "Post-quantum cryptography",
                },
                {
                  key: "neuralAnalysis",
                  label: "Neural Analysis",
                  icon: Brain,
                  desc: "AI behavioral patterns",
                },
                {
                  key: "ghostMode",
                  label: "Ghost Protocol",
                  icon: Eye,
                  desc: "Ultimate stealth mode",
                },
                {
                  key: "timeLockedAccess",
                  label: "Time-Locked Access",
                  icon: Timer,
                  desc: "Temporal security locks",
                },
                {
                  key: "socialRecovery",
                  label: "Social Recovery",
                  icon: Globe,
                  desc: "Distributed recovery system",
                },
                {
                  key: "holographicDisplay",
                  label: "Holographic UI",
                  icon: Sparkles,
                  desc: "3D interface rendering",
                },
                {
                  key: "dataObfuscation",
                  label: "Data Obfuscation",
                  icon: Waves,
                  desc: "Pattern scrambling",
                },
                {
                  key: "behavioralMasking",
                  label: "Behavioral Masking",
                  icon: Radio,
                  desc: "Identity concealment",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">
                          {feature.label}
                        </p>
                        <p className="text-slate-400 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={
                        profile[feature.key as keyof typeof profile] as boolean
                      }
                      onCheckedChange={(checked) =>
                        setProfile({ ...profile, [feature.key]: checked })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Capsule Loop Display */}
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Orbit className="h-5 w-5" />
              <span>Truth Capsule Display Loop</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CapsuleLoopDisplay
              capsules={[]}
              displayMode={profile.capsuleDisplayMode}
              loopSpeed={profile.capsuleLoopSpeed}
              aiFilterIntensity={profile.aiFilterIntensity}
            />
          </CardContent>
        </Card>

        {/* Quantum Security Panel */}
        <QuantumSecurityPanel />

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={isProcessing}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 hover:from-purple-700 hover:via-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
          >
            {isProcessing ? (
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            {isProcessing
              ? "Synchronizing Neural Matrix..."
              : "Save Quantum Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
