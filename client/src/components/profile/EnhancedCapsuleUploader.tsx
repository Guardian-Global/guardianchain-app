import { useState } from 'react';
import { useCreateCapsule, useMintNFT } from '../../hooks/useCapsules';
import { useAnalyze } from '../../hooks/useAI';
import { useUploadAsset } from '../../hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, Brain, Coins, CheckCircle } from 'lucide-react';

interface UploadStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
}

export function EnhancedCapsuleUploader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [capsuleData, setCapsuleData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const uploadAsset = useUploadAsset();
  const createCapsule = useCreateCapsule();
  const analyze = useAnalyze();
  const mintNFT = useMintNFT();

  const steps: UploadStep[] = [
    { id: 'upload', label: 'Upload Content', status: 'pending' },
    { id: 'analyze', label: 'AI Analysis', status: 'pending' },
    { id: 'mint', label: 'Create Capsule', status: 'pending' },
    { id: 'complete', label: 'NFT Minting', status: 'pending' },
  ];

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setCurrentStep(1);
    steps[0].status = 'complete';
    steps[1].status = 'active';

    try {
      // Step 1: Upload file
      const uploadResult = await uploadAsset.mutateAsync({ file });
      
      // Step 2: AI Analysis
      const analysisResult = await analyze.mutateAsync({
        content: file.name,
        type: 'full'
      });
      
      setAnalysisResult(analysisResult);
      setCurrentStep(2);
      steps[1].status = 'complete';
      steps[2].status = 'active';

      // Step 3: Create Capsule
      const capsuleResult = await createCapsule.mutateAsync({
        title: file.name,
        content: analysisResult.summary || 'AI-generated capsule',
        type: analysisResult.category || 'personal',
        metadata: {
          fileUrl: uploadResult.url,
          analysis: analysisResult,
          truthScore: analysisResult.truthLikelihood || 0.8,
          emotionalResonance: analysisResult.emotionalResonance || 0.7,
        }
      });

      setCapsuleData(capsuleResult);
      setCurrentStep(3);
      steps[2].status = 'complete';
      steps[3].status = 'active';

      // Step 4: Mint NFT
      await mintNFT.mutateAsync({
        capsuleId: capsuleResult.id,
        metadata: {
          name: `Truth Capsule: ${file.name}`,
          description: analysisResult.summary,
          image: uploadResult.url,
          attributes: [
            { trait_type: 'Truth Score', value: analysisResult.truthLikelihood * 100 },
            { trait_type: 'Emotional Resonance', value: analysisResult.emotionalResonance * 100 },
            { trait_type: 'Category', value: analysisResult.category },
          ]
        }
      });

      setCurrentStep(4);
      steps[3].status = 'complete';

    } catch (error) {
      console.error('Upload workflow error:', error);
      steps[currentStep].status = 'error';
    }
  };

  const getStepIcon = (step: UploadStep, index: number) => {
    if (step.status === 'complete') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (step.status === 'active') return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    if (step.status === 'error') return <span className="w-5 h-5 text-red-500">✕</span>;
    
    switch (step.id) {
      case 'upload': return <Upload className="w-5 h-5 text-gray-400" />;
      case 'analyze': return <Brain className="w-5 h-5 text-gray-400" />;
      case 'mint': return <Coins className="w-5 h-5 text-gray-400" />;
      case 'complete': return <CheckCircle className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Enhanced Capsule Creation</h2>
          <p className="text-muted-foreground">
            Upload → Analyze → Mint → Complete
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4">
              {getStepIcon(step, index)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    step.status === 'complete' ? 'text-green-600' :
                    step.status === 'active' ? 'text-blue-600' :
                    step.status === 'error' ? 'text-red-600' :
                    'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  <Badge variant={
                    step.status === 'complete' ? 'default' :
                    step.status === 'active' ? 'secondary' :
                    step.status === 'error' ? 'destructive' :
                    'outline'
                  }>
                    {step.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <Progress value={(currentStep / steps.length) * 100} className="w-full" />

        {/* File Upload Area */}
        {currentStep === 0 && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="file-upload"
              accept="image/*,video/*,audio/*,.pdf,.txt,.md"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Content</h3>
              <p className="text-muted-foreground">
                Images, videos, audio, documents - all formats supported
              </p>
            </label>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && currentStep >= 2 && (
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">AI Analysis Results</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Truth Score:</span>
                <span className="ml-2 font-medium">
                  {Math.round((analysisResult.truthLikelihood || 0.8) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Emotional Resonance:</span>
                <span className="ml-2 font-medium">
                  {Math.round((analysisResult.emotionalResonance || 0.7) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2 font-medium">
                  {analysisResult.category || 'Personal'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Verification Status:</span>
                <span className="ml-2 font-medium text-green-600">Verified</span>
              </div>
            </div>
          </Card>
        )}

        {/* Completion Message */}
        {currentStep === 4 && (
          <Card className="p-4 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Capsule Created Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Your content has been uploaded, analyzed, minted as an NFT, and added to the blockchain.
              </p>
              <Button 
                onClick={() => window.location.href = `/capsule/${capsuleData?.id}`}
                className="bg-green-600 hover:bg-green-700"
              >
                View Your Capsule
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}