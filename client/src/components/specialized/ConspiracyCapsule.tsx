import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Shield,
  AlertTriangle,
  Users,
  FileText,
  Search,
  Loader2,
} from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface ConspiracyCapsuleProps {
  onCapsuleCreated?: (capsuleData: any) => void;
}

export default function ConspiracyCapsule({
  onCapsuleCreated,
}: ConspiracyCapsuleProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [theory, setTheory] = useState("");
  const [evidence, setEvidence] = useState("");
  const [sources, setSources] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("medium");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const confidenceLevels = [
    {
      value: "low",
      label: "Speculative",
      color: "text-yellow-400",
      description: "Early hypothesis with limited evidence",
    },
    {
      value: "medium",
      label: "Investigating",
      color: "text-orange-400",
      description: "Some evidence collected, investigation ongoing",
    },
    {
      value: "high",
      label: "Strong Evidence",
      color: "text-red-400",
      description: "Substantial evidence supporting the theory",
    },
    {
      value: "verified",
      label: "Verified",
      color: "text-green-400",
      description: "Evidence verified by multiple sources",
    },
  ];

  const createConspiracyMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/conspiracy-capsule", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Conspiracy Capsule Created",
        description: "Your investigation has been documented and shared.",
      });
      onCapsuleCreated?.(data);
      // Reset form
      setTitle("");
      setTheory("");
      setEvidence("");
      setSources("");
      setConfidenceLevel("medium");
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create conspiracy capsule.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    if (!title.trim() || !theory.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide at least a title and theory description.",
        variant: "destructive",
      });
      return;
    }

    createConspiracyMutation.mutate({
      title: title.trim(),
      theory: theory.trim(),
      evidence: evidence.trim() || null,
      sources: sources.trim() || null,
      confidenceLevel,
      isAnonymous,
      capsuleType: "CONSPIRACY",
    });
  };

  const selectedConfidence = confidenceLevels.find(
    (level) => level.value === confidenceLevel,
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Conspiracy Capsule</h1>
        <p className="text-slate-400">
          Document theories, investigations, and hidden connections with
          transparency
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Conspiracy Capsule */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye
                  className="w-5 h-5"
                  style={{ color: BRAND_COLORS.CHAIN }}
                />
                Document Investigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Investigation Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What are you investigating?"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Theory Description *
                </label>
                <Textarea
                  value={theory}
                  onChange={(e) => setTheory(e.target.value)}
                  placeholder="Describe your theory, hypothesis, or what you're investigating..."
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Evidence & Documentation
                </label>
                <Textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="List evidence, documents, witness accounts, or other supporting information..."
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Sources & References
                </label>
                <Textarea
                  value={sources}
                  onChange={(e) => setSources(e.target.value)}
                  placeholder="List sources, links, documents, or references (one per line)..."
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white">
                  Confidence Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {confidenceLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setConfidenceLevel(level.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        confidenceLevel === level.value
                          ? "border-purple-600 bg-purple-600/20"
                          : "border-slate-600 bg-slate-700/30 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className={`font-medium ${level.color}`}>
                        {level.label}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {level.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700/50"
                />
                <label htmlFor="anonymous" className="text-sm text-white">
                  Submit anonymously (identity protected)
                </label>
              </div>

              <Button
                onClick={handleCreate}
                disabled={createConspiracyMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {createConspiracyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Capsule...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Create Conspiracy Capsule
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines & Recent Investigations */}
        <div className="space-y-6">
          {/* Guidelines */}
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.CHAIN }}
                />
                Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Evidence-Based:</strong>{" "}
                  Support theories with verifiable evidence
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Source Everything:</strong>{" "}
                  Cite sources and references when possible
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Collaborative:</strong>{" "}
                  Investigations can be built upon by others
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Search className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Transparency:</strong> Show
                  your research methodology
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Investigations */}
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Recent Investigations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  title: "Corporate Media Coordination",
                  confidence: "high",
                  submissions: 12,
                  daysAgo: 2,
                },
                {
                  title: "Algorithm Bias Investigation",
                  confidence: "medium",
                  submissions: 8,
                  daysAgo: 5,
                },
                {
                  title: "Supply Chain Manipulation",
                  confidence: "verified",
                  submissions: 23,
                  daysAgo: 7,
                },
              ].map((investigation, index) => {
                const confidence = confidenceLevels.find(
                  (c) => c.value === investigation.confidence,
                );
                return (
                  <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">
                        {investigation.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`${confidence?.color} border-current`}
                      >
                        {confidence?.label}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{investigation.submissions} submissions</span>
                      <span>{investigation.daysAgo} days ago</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">
            How Conspiracy Capsules Work
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">1. Investigate</h3>
            <p className="text-sm text-slate-400">
              Research patterns, connections, or hidden information
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">2. Document</h3>
            <p className="text-sm text-slate-400">
              Create detailed capsule with evidence and sources
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">3. Collaborate</h3>
            <p className="text-sm text-slate-400">
              Others contribute evidence and verify findings
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="font-semibold text-white">4. Reveal</h3>
            <p className="text-sm text-slate-400">
              Truth emerges through transparent investigation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
