import { useState } from "react";
import CapsuleTypeSelector from "@/components/capsule/CapsuleTypeSelector";
import { CapsuleType } from "@/types/capsule";
import { Palette, Brain, FileText, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForgeEditor from "@/components/CapsuleForge/ForgeEditor";
import MetadataPreview from "@/components/CapsuleForge/MetadataPreview";
import ForgeControls from "@/components/CapsuleForge/ForgeControls";
import AIAssistant from "@/components/CapsuleForge/AIAssistant";

export default function CapsuleForgePage() {
  const [capsuleData, setCapsuleData] = useState({
    title: "",
    type: "STANDARD" as CapsuleType,
    blocks: [{ id: Date.now(), type: "text", content: "" }],
    metadata: {
      category: "general",
      tags: [],
      griefScore: 0,
      credibilityScore: 0,
    },
  });

  const stats = [
    {
      label: "Draft Capsules",
      value: "12",
      icon: FileText,
      color: "text-blue-400",
    },
    {
      label: "AI Suggestions",
      value: "47",
      icon: Brain,
      color: "text-purple-400",
    },
    { label: "Sealed Today", value: "3", icon: Zap, color: "text-green-400" },
    {
      label: "GTT Available",
      value: "850",
      icon: Palette,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Palette className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  🧱 Capsule Forge
                </span>
                <p className="text-slate-400 text-sm font-normal">
                  Design, seal, and publish your verified Truth Capsules
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Capsule Type Selection */}
        <div className="mb-8">
          <CapsuleTypeSelector
            selectedType={capsuleData.type}
            onTypeSelect={(type) =>
              setCapsuleData((prev) => ({ ...prev, type }))
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            <ForgeEditor
              capsuleData={capsuleData}
              setCapsuleData={setCapsuleData}
            />
            <ForgeControls capsuleData={capsuleData} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <MetadataPreview capsuleData={capsuleData} />
            <AIAssistant
              capsuleData={capsuleData}
              setCapsuleData={setCapsuleData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
