import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Share2,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  FileImage,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface InfographicData {
  totalCapsules: number;
  verifiedCapsules: number;
  gttEarned: number;
  emotionalResonance: number;
  topEmotions: Array<{ emotion: string; percentage: number; color: string }>;
  recentAchievements: string[];
}

interface ShareableInfographicProps {
  data: InfographicData;
  userHandle?: string;
}

export default function ShareableInfographic({
  data,
  userHandle = "Anonymous",
}: ShareableInfographicProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const infographicRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const defaultData: InfographicData = {
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

  const infographicData = { ...defaultData, ...data };

  const generateImage = async () => {
    if (!infographicRef.current) return null;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(infographicRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
        width: 800,
        height: 1000,
      });

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob(resolve as BlobCallback, "image/png", 0.9),
      );

      return blob;
    } catch (error) {
      console.error("Failed to generate image:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const blob = await generateImage();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `guardianchain-legacy-${userHandle.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Infographic Downloaded",
        description: "Your legacy highlights are ready to share",
      });
    }
  };

  const handleShare = async (platform: string) => {
    const shareText = `My GUARDIANCHAIN legacy: ${infographicData.totalCapsules} capsules sealed, ${infographicData.gttEarned.toFixed(0)} GTT earned. Truth preserved, memories immortalized. #GuardianChain #VeritasSealed`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://guardianchain.app`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=https://guardianchain.app&quote=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://guardianchain.app&summary=${encodeURIComponent(shareText)}`,
    };

    window.open(
      shareUrls[platform as keyof typeof shareUrls],
      "_blank",
      "width=600,height=400",
    );
  };

  const copyToClipboard = async () => {
    const shareText = `My GUARDIANCHAIN legacy: ${infographicData.totalCapsules} capsules sealed, ${infographicData.gttEarned.toFixed(0)} GTT earned. Check out https://guardianchain.app`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Legacy summary ready to paste",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Infographic */}
      <div
        ref={infographicRef}
        className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500 rounded-full filter blur-2xl" />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              GUARDIANCHAIN LEGACY
            </h1>
            <p className="text-lg text-blue-400 font-medium">@{userHandle}</p>
            <p className="text-sm text-slate-400 mt-2">
              Veritas Sealed. Truth Tokenized.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"
            >
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {infographicData.totalCapsules}
              </div>
              <div className="text-sm text-slate-300">Capsules Sealed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20"
            >
              <div className="text-3xl font-bold text-green-400 mb-1">
                {infographicData.gttEarned.toFixed(0)}
              </div>
              <div className="text-sm text-slate-300">GTT Earned</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20"
            >
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {infographicData.verifiedCapsules}
              </div>
              <div className="text-sm text-slate-300">Verified</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-4 bg-orange-500/10 rounded-xl border border-orange-500/20"
            >
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {infographicData.emotionalResonance}%
              </div>
              <div className="text-sm text-slate-300">Resonance</div>
            </motion.div>
          </div>

          {/* Emotion Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white text-center">
              Emotional Spectrum
            </h3>
            <div className="space-y-3">
              {infographicData.topEmotions.map((emotion, index) => (
                <motion.div
                  key={emotion.emotion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-16 text-sm text-slate-300 font-medium">
                    {emotion.emotion}
                  </div>
                  <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: emotion.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${emotion.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <div className="w-10 text-sm text-slate-400 text-right">
                    {emotion.percentage}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white text-center">
              Recent Achievements
            </h3>
            <div className="space-y-2">
              {infographicData.recentAchievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                  <span className="text-slate-300">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              Generated by guardianchain.app • Truth Preservation Infrastructure
            </p>
          </div>
        </div>
      </div>

      {/* Sharing Options */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-blue-400" />
            Share Your Legacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Download"}
            </Button>

            <Button
              onClick={() => handleShare("twitter")}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>

            <Button
              onClick={() => handleShare("facebook")}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>

          <p className="text-sm text-slate-400 text-center">
            Share your truth preservation journey with the world
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
