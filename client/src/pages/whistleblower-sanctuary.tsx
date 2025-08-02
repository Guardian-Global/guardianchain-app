import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  FileText,
  Users,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

export default function WhistleblowerSanctuary() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [protectionLevel, setProtectionLevel] = useState("maximum");

  const categories = [
    {
      id: "corporate",
      name: "Corporate Misconduct",
      icon: FileText,
      description: "Financial fraud, safety violations, regulatory breaches",
      protection: "Military-grade encryption + Legal shield",
      badge: "HIGH RISK",
    },
    {
      id: "government",
      name: "Government Corruption",
      icon: AlertTriangle,
      description: "Public official misconduct, abuse of power, cover-ups",
      protection: "Anonymous routing + Witness protection protocols",
      badge: "MAXIMUM RISK",
    },
    {
      id: "healthcare",
      name: "Medical Malpractice",
      icon: Shield,
      description: "Patient safety, drug testing fraud, medical device defects",
      protection: "HIPAA-compliant + Patient advocacy",
      badge: "PROTECTED",
    },
    {
      id: "environmental",
      name: "Environmental Crimes",
      icon: Eye,
      description:
        "Pollution cover-ups, toxic waste, climate data manipulation",
      protection: "Global advocacy network + Media protection",
      badge: "URGENT",
    },
  ];

  const protectionLevels = [
    {
      id: "standard",
      name: "Standard Protection",
      features: [
        "End-to-end encryption",
        "Anonymous submission",
        "Basic legal guidance",
      ],
      cost: "Free",
    },
    {
      id: "enhanced",
      name: "Enhanced Protection",
      features: [
        "Military-grade encryption",
        "Anonymous routing",
        "Legal counsel access",
        "Media protection",
      ],
      cost: "$299",
    },
    {
      id: "maximum",
      name: "Maximum Protection",
      features: [
        "Zero-knowledge encryption",
        "Tor routing",
        "Legal defense fund",
        "Witness protection",
        "Global advocacy",
      ],
      cost: "$899",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔒 WHISTLEBLOWER SANCTUARY
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Secure Truth Disclosure Portal - Protecting Those Who Protect Truth
          </p>
          <Badge className="bg-red-600/20 text-red-400 text-lg px-4 py-2">
            MAXIMUM SECURITY GUARANTEED
          </Badge>
        </div>

        {/* Security Features */}
        <Card className="bg-gradient-to-r from-red-900/30 to-purple-900/30 border-red-500/30 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              🛡️ FORTRESS-LEVEL SECURITY PROTOCOLS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Lock className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-2">
                  Zero-Knowledge Encryption
                </h3>
                <p className="text-slate-300 text-sm">
                  Military-grade encryption that even we cannot decrypt
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-2">Anonymous Routing</h3>
                <p className="text-slate-300 text-sm">
                  Multiple proxy layers hide your identity completely
                </p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-2">
                  Legal Defense Network
                </h3>
                <p className="text-slate-300 text-sm">
                  Global network of whistleblower protection lawyers
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-2">
                  Witness Protection
                </h3>
                <p className="text-slate-300 text-sm">
                  Physical safety protocols for high-risk disclosures
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclosure Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Select Disclosure Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "bg-red-600/20 border-red-500"
                      : "bg-slate-800/50 border-slate-600 hover:border-red-500/50"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Icon className="h-8 w-8 text-red-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold text-lg">
                            {category.name}
                          </h3>
                          <Badge
                            className={`
                            ${category.badge === "MAXIMUM RISK" ? "bg-red-600/20 text-red-400" : ""}
                            ${category.badge === "HIGH RISK" ? "bg-orange-600/20 text-orange-400" : ""}
                            ${category.badge === "PROTECTED" ? "bg-green-600/20 text-green-400" : ""}
                            ${category.badge === "URGENT" ? "bg-yellow-600/20 text-yellow-400" : ""}
                          `}
                          >
                            {category.badge}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">
                          {category.description}
                        </p>
                        <p className="text-blue-400 text-sm font-semibold">
                          {category.protection}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Protection Levels */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Choose Protection Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {protectionLevels.map((level) => {
              const isSelected = protectionLevel === level.id;

              return (
                <Card
                  key={level.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "bg-purple-600/20 border-purple-500"
                      : "bg-slate-800/50 border-slate-600 hover:border-purple-500/50"
                  }`}
                  onClick={() => setProtectionLevel(level.id)}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="text-white font-bold text-xl mb-4">
                      {level.name}
                    </h3>
                    <div className="text-3xl font-bold text-green-400 mb-4">
                      {level.cost}
                    </div>
                    <ul className="space-y-2">
                      {level.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-slate-300 flex items-center justify-center"
                        >
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Disclosure Form */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <FileText className="h-6 w-6 text-green-400" />
              <span>Secure Disclosure Submission</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Disclosure Title
              </label>
              <Input
                placeholder="Brief title for your disclosure (will be encrypted)"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Detailed Description
              </label>
              <Textarea
                placeholder="Provide detailed information about the misconduct, including dates, locations, people involved, and evidence you possess..."
                rows={8}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Evidence Files
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">
                  Upload documents, photos, videos, or audio files
                </p>
                <p className="text-slate-400 text-sm">
                  All files encrypted with zero-knowledge protocol
                </p>
                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                  Select Files
                </Button>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-1">
                    Security Notice
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Your submission will be encrypted with military-grade
                    protocols. Even our administrators cannot access your
                    content without your private key.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                size="lg"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={!selectedCategory}
              >
                <Lock className="h-5 w-5 mr-2" />
                Submit Secure Disclosure
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-blue-500 text-blue-400 hover:bg-blue-600/20"
              >
                <Shield className="h-5 w-5 mr-2" />
                Request Legal Consultation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Truth Vault Branding */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              💎 TRUTH VAULT TOKEN ECOSYSTEM
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-300 text-lg mb-6">
              Earn Truth Vault (TRUTH) tokens for verified whistleblower
              disclosures
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  1,000 TRUTH
                </div>
                <p className="text-slate-300">Standard Disclosure Reward</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  5,000 TRUTH
                </div>
                <p className="text-slate-300">High-Impact Disclosure Reward</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  25,000 TRUTH
                </div>
                <p className="text-slate-300">Maximum Protection Disclosure</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
