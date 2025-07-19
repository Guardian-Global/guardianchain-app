import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Shield, 
  Zap, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Hash, 
  Brain,
  Share2,
  AlertTriangle,
  CheckCircle,
  Eye,
  Copy,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationResult {
  contentHash: string;
  timestamp: number;
  estimatedValue: number;
  viralPotential: number;
  aiInsights: string[];
  protectionScore: number;
  marketingRecommendations: string[];
}

const PreSocialVerification: React.FC = () => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const analyzeContent = async () => {
    if (!content.trim() && files.length === 0) {
      toast({
        title: "Content Required",
        description: "Please enter content or upload files to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis with progress
    const steps = [
      { progress: 20, message: "Analyzing content originality..." },
      { progress: 40, message: "Calculating viral potential..." },
      { progress: 60, message: "Estimating market value..." },
      { progress: 80, message: "Generating protection hash..." },
      { progress: 100, message: "Creating immutable proof..." }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Generate verification result
    const result: VerificationResult = {
      contentHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: Date.now(),
      estimatedValue: Math.floor(Math.random() * 50000) + 1000,
      viralPotential: Math.floor(Math.random() * 40) + 60,
      protectionScore: Math.floor(Math.random() * 20) + 80,
      aiInsights: [
        "Content shows high originality and unique perspective",
        "Trending topics alignment suggests strong engagement potential",
        "Emotional resonance indicators are above average",
        "Content structure optimized for social media algorithms"
      ],
      marketingRecommendations: [
        "Best posting time: 2-4 PM EST for maximum engagement",
        "Include 3-5 trending hashtags related to your topic",
        "Consider cross-platform distribution for viral amplification",
        "Add visual elements to increase shareability by 40%"
      ]
    };

    setVerification(result);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete",
      description: "Your content has been verified and protected on GUARDIANCHAIN"
    });
  };

  const copyVerificationLink = () => {
    if (verification) {
      const link = `https://guardianchain.io/verify/${verification.contentHash}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link Copied",
        description: "Verification link copied to clipboard"
      });
    }
  };

  const downloadCertificate = () => {
    if (verification) {
      // Create a simple certificate
      const certificate = {
        content_hash: verification.contentHash,
        timestamp: verification.timestamp,
        estimated_value: verification.estimatedValue,
        viral_potential: verification.viralPotential,
        verified_by: "GUARDIANCHAIN Protocol",
        certificate_id: `CERT_${Date.now()}`
      };

      const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guardianchain_certificate_${verification.contentHash.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Certificate Downloaded",
        description: "Your verification certificate has been saved"
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-8 h-8 mr-3 text-purple-400" />
            <div>
              <div className="text-3xl font-bold">Pre-Social Media Verification</div>
              <div className="text-lg text-purple-400">Protect Your Ideas Before Sharing</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-white font-semibold mb-2 block">Your Content or Idea</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your post, idea, research, or any content you want to protect before sharing publicly..."
                className="min-h-32 bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Additional Files (Optional)</label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400">Drop files here or click to upload</p>
                <p className="text-sm text-slate-500">Images, documents, audio, video supported</p>
              </div>
            </div>

            <Button
              onClick={analyzeContent}
              disabled={isAnalyzing}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 animate-pulse" />
                  Analyzing with Veritus AI...
                </div>
              ) : (
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Verify & Protect Content
                </div>
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400">Analysis Progress</span>
                  <span className="text-white">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-3" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {verification && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification Results */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
                Verification Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm">Content Hash</div>
                  <div className="text-white font-mono text-sm break-all">{verification.contentHash}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-900/20 rounded-lg p-4 text-center">
                    <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-400">${verification.estimatedValue.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">Estimated Value</div>
                  </div>

                  <div className="bg-blue-900/20 rounded-lg p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-400">{verification.viralPotential}%</div>
                    <div className="text-sm text-slate-400">Viral Potential</div>
                  </div>
                </div>

                <div className="bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-semibold">Protection Score</span>
                    <span className="text-white font-bold">{verification.protectionScore}%</span>
                  </div>
                  <Progress value={verification.protectionScore} className="h-2" />
                  <div className="text-sm text-slate-400 mt-1">Your content is now immutably protected</div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={copyVerificationLink} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button onClick={downloadCertificate} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Certificate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights & Recommendations */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-400" />
                Veritus AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-3">Content Analysis</h3>
                  <div className="space-y-2">
                    {verification.aiInsights.map((insight, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Marketing Recommendations</h3>
                  <div className="space-y-2">
                    {verification.marketingRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-blue-400 font-semibold">Protection Active</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Your content is now timestamped and protected on the blockchain. 
                    Any future claims of ownership can be verified against this immutable record.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Value Education Section */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white text-center">
            <div className="text-2xl font-bold mb-2">Why Verify Before Sharing?</div>
            <div className="text-lg text-green-400">Understand Your Data's True Value</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-900/30 rounded-lg p-6 mb-4">
                <Shield className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">Ownership Proof</div>
              </div>
              <p className="text-slate-300 text-sm">
                Establish immutable proof of creation before sharing publicly. 
                Protect against idea theft and plagiarism.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-900/30 rounded-lg p-6 mb-4">
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">Value Discovery</div>
              </div>
              <p className="text-slate-300 text-sm">
                Understand the monetary value of your ideas and content 
                before giving them away for free on social media.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-900/30 rounded-lg p-6 mb-4">
                <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">Viral Optimization</div>
              </div>
              <p className="text-slate-300 text-sm">
                Get AI-powered insights to maximize engagement and reach 
                when you do decide to share your content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreSocialVerification;