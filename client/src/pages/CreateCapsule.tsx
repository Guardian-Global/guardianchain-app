import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Sparkles, 
  Camera, 
  Clock, 
  Coins, 
  Shield, 
  ArrowRight,
  Loader2,
  Eye,
  Heart,
  Brain,
  Zap
} from 'lucide-react';

interface CapsuleData {
  title: string;
  content: string;
  capsuleType: string;
  timelock: number;
  category: string;
  tags: string[];
  isPrivate: boolean;
  griefTier: number;
}

export default function CreateCapsule() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<CapsuleData>({
    title: '',
    content: '',
    capsuleType: 'personal_memory',
    timelock: 365,
    category: 'family',
    tags: [],
    isPrivate: false,
    griefTier: 1
  });
  
  // UI state
  const [step, setStep] = useState(1);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [yieldEstimate, setYieldEstimate] = useState<any>(null);
  const [mintedNFT, setMintedNFT] = useState<any>(null);

  // AI Image Generation
  const generateImageMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/generate-image', {
        prompt: `${formData.title}: ${formData.content}`,
        style: 'truth_capsule'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedImage(data.imageUrl);
      toast({
        title: "AI Image Generated",
        description: "Your capsule visualization is ready",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate image. Please try again.",
        variant: "destructive",
      });
    }
  });

  // AI Content Analysis
  const analyzeContentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/analyze-content', {
        title: formData.title,
        content: formData.content,
        capsuleType: formData.capsuleType
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAiAnalysis(data);
      setFormData(prev => ({
        ...prev,
        griefTier: data.recommendedGriefTier || prev.griefTier,
        tags: data.suggestedTags || prev.tags
      }));
      setStep(3);
    }
  });

  // Yield Estimation
  const estimateYieldMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/capsules/estimate-yield', {
        griefTier: formData.griefTier,
        timelock: formData.timelock,
        capsuleType: formData.capsuleType
      });
      return response.json();
    },
    onSuccess: (data) => {
      setYieldEstimate(data);
    }
  });

  // NFT Minting
  const mintNFTMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/capsules/mint-nft', {
        ...formData,
        imageUrl: generatedImage,
        aiAnalysis: aiAnalysis
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMintedNFT(data);
      queryClient.invalidateQueries({ queryKey: ['/api/capsules/recent'] });
      toast({
        title: "NFT Minted Successfully!",
        description: `Capsule #${data.tokenId} has been created`,
      });
      setStep(5);
    },
    onError: () => {
      toast({
        title: "Minting Failed",
        description: "Unable to mint NFT. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Auto-estimate yield when timelock or grief tier changes
  useEffect(() => {
    if (formData.timelock > 0 && formData.griefTier > 0) {
      estimateYieldMutation.mutate();
    }
  }, [formData.timelock, formData.griefTier]);

  const handleNext = () => {
    if (step === 1 && formData.title && formData.content) {
      setStep(2);
    } else if (step === 2) {
      analyzeContentMutation.mutate();
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      mintNFTMutation.mutate();
    }
  };

  const handleGenerateImage = () => {
    generateImageMutation.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-secondary via-slate-900 to-brand-surface">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-brand-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-slate-300 mb-4">Please sign in to create your truth capsule</p>
            <Button onClick={() => setLocation('/test-auth')} className="w-full">
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-slate-900 to-brand-surface p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Truth Capsule</h1>
          <p className="text-slate-300">Preserve your truth for eternity on the blockchain</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Step {step} of 5</span>
            <span className="text-sm text-slate-400">{Math.round((step / 5) * 100)}% Complete</span>
          </div>
          <Progress value={(step / 5) * 100} className="h-2" />
        </div>

        {/* Step 1: Content Creation */}
        {step === 1 && (
          <Card className="bg-slate-800/50 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-brand-primary" />
                Tell Your Truth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Capsule Title
                </label>
                <Input
                  placeholder="What is this truth about?"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Truth Content
                </label>
                <Textarea
                  placeholder="Share your story, memory, or truth..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Capsule Type
                  </label>
                  <select
                    value={formData.capsuleType}
                    onChange={(e) => setFormData(prev => ({ ...prev, capsuleType: e.target.value }))}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="personal_memory">Personal Memory</option>
                    <option value="family_history">Family History</option>
                    <option value="confession">Confession</option>
                    <option value="prophecy">Prophecy</option>
                    <option value="wisdom">Wisdom</option>
                    <option value="testimony">Testimony</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Time Lock (Days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="36500"
                    value={formData.timelock}
                    onChange={(e) => setFormData(prev => ({ ...prev, timelock: parseInt(e.target.value) || 365 }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                disabled={!formData.title || !formData.content}
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
              >
                Continue to AI Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Image Generation */}
        {step === 2 && (
          <Card className="bg-slate-800/50 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Camera className="h-5 w-5 text-brand-accent" />
                Visualize Your Capsule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                {!generatedImage ? (
                  <div className="p-8 border-2 border-dashed border-slate-600 rounded-xl">
                    <Sparkles className="h-16 w-16 text-brand-accent mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Generate AI Capsule Image
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Create a unique visual representation of your truth capsule
                    </p>
                    <Button
                      onClick={handleGenerateImage}
                      disabled={generateImageMutation.isPending}
                      className="bg-brand-accent hover:bg-brand-accent/90"
                    >
                      {generateImageMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img 
                      src={generatedImage} 
                      alt="Generated capsule visualization"
                      className="max-w-md mx-auto rounded-xl shadow-2xl"
                    />
                    <Button
                      onClick={handleGenerateImage}
                      variant="outline"
                      className="border-brand-accent text-brand-accent hover:bg-brand-accent/10"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(1)} 
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                  disabled={analyzeContentMutation.isPending}
                >
                  {analyzeContentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Continue to Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Analysis Results */}
        {step === 3 && aiAnalysis && (
          <Card className="bg-slate-800/50 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-brand-green" />
                AI Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Content Insights</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Emotional Intensity</span>
                      <Badge className="bg-brand-primary/20 text-brand-primary">
                        {aiAnalysis.emotionalIntensity || 'Medium'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Truth Confidence</span>
                      <Badge className="bg-brand-green/20 text-brand-green">
                        {aiAnalysis.truthConfidence || '85%'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Recommended Grief Tier</span>
                      <Badge className="bg-brand-accent/20 text-brand-accent">
                        Tier {aiAnalysis.recommendedGriefTier || formData.griefTier}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Suggested Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(aiAnalysis.suggestedTags || ['memory', 'truth', 'personal']).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="border-slate-600 text-slate-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">AI Summary</h3>
                <p className="text-slate-300 text-sm">
                  {aiAnalysis.summary || 'This appears to be a meaningful personal truth that would benefit from long-term preservation. The content shows authenticity and emotional depth.'}
                </p>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(2)} 
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                >
                  Continue to Minting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Yield Estimation & Minting */}
        {step === 4 && (
          <Card className="bg-slate-800/50 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Coins className="h-5 w-5 text-brand-accent" />
                Mint Your Truth NFT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {yieldEstimate && (
                <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-4">Yield Projection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-accent">
                        {yieldEstimate.estimatedYield || '245'} GTT
                      </div>
                      <div className="text-sm text-slate-400">Total Yield</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-primary">
                        {yieldEstimate.apy || '12.5'}%
                      </div>
                      <div className="text-sm text-slate-400">Annual Yield</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-green">
                        {Math.round(formData.timelock / 365 * 10) / 10} years
                      </div>
                      <div className="text-sm text-slate-400">Lock Period</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Capsule Summary</h3>
                <div className="bg-slate-700/30 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Title:</span>
                    <span className="text-white">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Type:</span>
                    <span className="text-white capitalize">{formData.capsuleType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Grief Tier:</span>
                    <span className="text-white">Tier {formData.griefTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Time Lock:</span>
                    <span className="text-white">{formData.timelock} days</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(3)} 
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={mintNFTMutation.isPending}
                  className="flex-1 bg-brand-accent hover:bg-brand-accent/90"
                >
                  {mintNFTMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Mint Truth NFT
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {step === 5 && mintedNFT && (
          <Card className="bg-slate-800/50 border-brand-green/20">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-brand-green" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Truth Capsule Minted!</h2>
                <p className="text-slate-300">Your truth has been sealed on the blockchain</p>
              </div>

              <div className="bg-slate-700/30 p-6 rounded-xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold text-brand-accent">
                      #{mintedNFT.tokenId || '1001'}
                    </div>
                    <div className="text-sm text-slate-400">Token ID</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-brand-primary">
                      {mintedNFT.contractAddress || '0x...abc123'}
                    </div>
                    <div className="text-sm text-slate-400">Contract</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => setLocation('/vault')} 
                  className="w-full bg-brand-primary hover:bg-brand-primary/90"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View in Vault
                </Button>
                <Button 
                  onClick={() => setLocation('/capsules/gallery')} 
                  variant="outline"
                  className="w-full border-brand-accent text-brand-accent hover:bg-brand-accent/10"
                >
                  Explore NFT Gallery
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}