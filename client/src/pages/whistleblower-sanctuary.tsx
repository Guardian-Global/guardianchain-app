import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, AlertTriangle, Lock, Eye, FileText, 
  Download, Upload, Users, Zap, Crown, 
  Globe, MessageSquare, Scale, Heart
} from "lucide-react";

interface ProtectionLevel {
  name: string;
  description: string;
  features: string[];
  securityLevel: number;
  rewardMultiplier: number;
  color: string;
}

const PROTECTION_LEVELS: ProtectionLevel[] = [
  {
    name: "Standard Shield",
    description: "Basic anonymity protection for low-risk disclosures",
    features: ["IP Masking", "Basic Encryption", "24h Evidence Review", "Standard Legal Review"],
    securityLevel: 3,
    rewardMultiplier: 5.0,
    color: "from-blue-600 to-cyan-600"
  },
  {
    name: "Sovereign Sanctuary",
    description: "Enhanced protection for medium-risk institutional disclosures",
    features: ["Tor Network Routing", "Military-Grade Encryption", "1h Priority Review", "Legal Shield Activation", "Identity Obfuscation"],
    securityLevel: 7,
    rewardMultiplier: 10.0,
    color: "from-purple-600 to-pink-600"
  },
  {
    name: "Shadow Protocol",
    description: "Maximum protection for high-risk government and corporate exposures",
    features: ["Quantum-Safe Encryption", "Multi-Hop Anonymous Routing", "Immediate Emergency Review", "International Legal Protection", "Witness Relocation Coordination"],
    securityLevel: 10,
    rewardMultiplier: 25.0,
    color: "from-red-600 to-orange-600"
  }
];

const DISCLOSURE_CATEGORIES = [
  { name: "Corporate Fraud", icon: "💼", risk: "High", reward: "25x GTT" },
  { name: "Government Corruption", icon: "🏛️", risk: "Critical", reward: "50x GTT" },
  { name: "Environmental Cover-up", icon: "🌍", risk: "Medium", reward: "15x GTT" },
  { name: "Healthcare Malpractice", icon: "🏥", risk: "High", reward: "20x GTT" },
  { name: "Financial Misconduct", icon: "💰", risk: "High", reward: "30x GTT" },
  { name: "Safety Violations", icon: "⚠️", risk: "Medium", reward: "18x GTT" },
  { name: "Data Privacy Breach", icon: "🔒", risk: "Medium", reward: "12x GTT" },
  { name: "Election Interference", icon: "🗳️", risk: "Critical", reward: "75x GTT" }
];

export default function WhistleblowerSanctuary() {
  const [selectedProtection, setSelectedProtection] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submissionStep, setSubmissionStep] = useState(1);
  const { toast } = useToast();

  const handleProtectionSelect = (level: string) => {
    setSelectedProtection(level);
    toast({
      title: "Protection Level Activated",
      description: `${level} security protocols now active`,
    });
  };

  const initiateSubmission = () => {
    if (!selectedProtection || !selectedCategory) {
      toast({
        title: "Selection Required",
        description: "Please select protection level and disclosure category",
        variant: "destructive"
      });
      return;
    }
    setSubmissionStep(2);
  };

  const selectedProtectionData = PROTECTION_LEVELS.find(p => p.name === selectedProtection);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                Shadow Revealer Sanctuary
              </h1>
              <p className="text-slate-400">Secure Truth Disclosure Portal</p>
            </div>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            A fortified sanctuary for those who risk everything to expose corruption, fraud, and injustice. 
            Your truth is protected by military-grade security and international legal frameworks.
          </p>
        </div>

        {submissionStep === 1 ? (
          <div className="space-y-8">
            {/* Security Level Selection */}
            <Card className="border-red-500/30 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-500" />
                  Choose Your Protection Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {PROTECTION_LEVELS.map((level) => (
                    <Card 
                      key={level.name}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedProtection === level.name 
                          ? 'border-red-500 bg-red-500/10' 
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => handleProtectionSelect(level.name)}
                    >
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center mx-auto`}>
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-center text-lg">{level.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-slate-400 text-center">{level.description}</p>
                        <div className="flex justify-center gap-2">
                          <Badge variant="outline">Level {level.securityLevel}</Badge>
                          <Badge variant="outline">{level.rewardMultiplier}x GTT</Badge>
                        </div>
                        <div className="space-y-2">
                          {level.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disclosure Categories */}
            <Card className="border-amber-500/30 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-amber-500" />
                  Disclosure Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {DISCLOSURE_CATEGORIES.map((category) => (
                    <Card 
                      key={category.name}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedCategory === category.name 
                          ? 'border-amber-500 bg-amber-500/10' 
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h4 className="font-semibold text-sm mb-2">{category.name}</h4>
                        <div className="space-y-1">
                          <Badge variant={category.risk === 'Critical' ? 'destructive' : category.risk === 'High' ? 'default' : 'secondary'} className="text-xs">
                            {category.risk} Risk
                          </Badge>
                          <p className="text-xs text-green-400">{category.reward}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-blue-500/30 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Lock className="w-5 h-5" />
                    Anonymous Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Zero-knowledge submission</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Identity obfuscation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Secure communication</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Scale className="w-5 h-5" />
                    Legal Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>International legal framework</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Whistleblower protection laws</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Legal defense coordination</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Crown className="w-5 h-5" />
                    Truth Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Up to 75x GTT multiplier</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Impact-based rewards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Anonymous reward delivery</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={initiateSubmission}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-90 text-white px-8 py-3"
                disabled={!selectedProtection || !selectedCategory}
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Initiate Secure Disclosure
              </Button>
            </div>
          </div>
        ) : (
          /* Secure Submission Interface */
          <div className="space-y-6">
            <Alert className="border-green-500/50 bg-green-500/10">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>{selectedProtectionData?.name}</strong> protection is now active. 
                Your submission is secured with Level {selectedProtectionData?.securityLevel} encryption and anonymity protocols.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="evidence" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="evidence">Evidence Upload</TabsTrigger>
                <TabsTrigger value="details">Disclosure Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="submit">Final Review</TabsTrigger>
              </TabsList>

              <TabsContent value="evidence" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Secure Evidence Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-2">Drop files here or click to upload</p>
                      <p className="text-xs text-slate-500">Documents, images, videos, audio recordings</p>
                      <p className="text-xs text-green-400 mt-2">All files encrypted with {selectedProtectionData?.name} protocols</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle>Disclosure Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">What happened? (Required)</label>
                      <Textarea 
                        placeholder="Describe the situation, what laws or ethics were violated, and why this matters to the public..."
                        rows={6}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Organizations/People Involved</label>
                      <Input 
                        placeholder="Names, companies, departments (optional but helpful)"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">When did this occur?</label>
                      <Input 
                        type="date"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle>Timeline of Events</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea 
                      placeholder="Chronological sequence of events, key dates, and important milestones..."
                      rows={8}
                      className="bg-slate-700 border-slate-600"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="submit" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Final Review & Submission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Protection Level</h4>
                        <p className="text-sm text-slate-400">{selectedProtectionData?.name}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Category</h4>
                        <p className="text-sm text-slate-400">{selectedCategory}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Security Level</h4>
                        <p className="text-sm text-slate-400">Level {selectedProtectionData?.securityLevel} Encryption</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Potential Reward</h4>
                        <p className="text-sm text-green-400">{selectedProtectionData?.rewardMultiplier}x GTT Multiplier</p>
                      </div>
                    </div>

                    <Alert className="border-amber-500/50 bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        By submitting this disclosure, you confirm that you believe this information serves the public interest 
                        and that you are prepared to provide additional evidence if required by our verification team.
                      </AlertDescription>
                    </Alert>

                    <div className="text-center">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-90 text-white px-8 py-3"
                        onClick={() => {
                          toast({
                            title: "Disclosure Submitted",
                            description: "Your truth has been securely submitted for verification. You will be contacted through secure channels.",
                          });
                        }}
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        Submit Secure Disclosure
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