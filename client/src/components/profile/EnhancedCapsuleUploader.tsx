import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Image, 
  Video,
  Music,
  File,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import MintCapsuleButton from "./MintCapsuleButton";
import CapsuleAutotagger from "./CapsuleAutotagger";
import CapsulePrivacyToggle, { type PrivacyLevel } from "./CapsulePrivacyToggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EnhancedCapsuleUploaderProps {
  onCapsuleCreated?: (capsule: any) => void;
  className?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

interface CapsuleData {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  privacy: PrivacyLevel;
  tags: string[];
  truthScore: number;
  isProcessing: boolean;
  isMinted: boolean;
  mintResult?: any;
}

export default function EnhancedCapsuleUploader({
  onCapsuleCreated,
  className = ""
}: EnhancedCapsuleUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processingStep, setProcessingStep] = useState<'upload' | 'analyze' | 'mint' | 'complete'>('upload');
  const [currentCapsule, setCurrentCapsule] = useState<CapsuleData | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const file = result.successful[0];
      const uploadedFile: UploadedFile = {
        id: 'capsule-' + Date.now(),
        name: file.name || 'untitled',
        type: file.type || 'application/octet-stream',
        size: file.size || 0,
        url: file.uploadURL || '',
        preview: file.preview
      };

      setUploadedFiles([uploadedFile]);
      setProcessingStep('analyze');

      // Create initial capsule data
      const capsuleData: CapsuleData = {
        id: uploadedFile.id,
        fileUrl: uploadedFile.url,
        fileName: uploadedFile.name,
        fileType: uploadedFile.type,
        privacy: 'public',
        tags: [],
        truthScore: 75,
        isProcessing: true,
        isMinted: false
      };

      setCurrentCapsule(capsuleData);

      toast({
        title: "File Uploaded Successfully",
        description: "Now analyzing content and generating capsule metadata...",
      });
    }
  };

  const handleTagsGenerated = (tags: any[]) => {
    if (currentCapsule) {
      setCurrentCapsule(prev => prev ? {
        ...prev,
        tags: tags.map(t => t.tag),
        truthScore: Math.round(Math.random() * 30 + 70) // Mock score
      } : null);
    }
  };

  const handlePrivacyChange = (privacy: PrivacyLevel) => {
    if (currentCapsule) {
      setCurrentCapsule(prev => prev ? { ...prev, privacy } : null);
    }
  };

  const handleMintComplete = (result: any) => {
    if (currentCapsule) {
      setCurrentCapsule(prev => prev ? {
        ...prev,
        isMinted: true,
        mintResult: result,
        isProcessing: false
      } : null);
      setProcessingStep('complete');
      
      // Store metadata in backend
      storeCapsuleMetadata();
      
      onCapsuleCreated?.(currentCapsule);
    }
  };

  const storeCapsuleMetadata = async () => {
    if (!currentCapsule) return;

    try {
      await apiRequest('/api/capsules/metadata', {
        method: 'POST',
        body: JSON.stringify({
          capsuleId: currentCapsule.id,
          fileUrl: currentCapsule.fileUrl,
          fileName: currentCapsule.fileName,
          fileType: currentCapsule.fileType,
          privacy: currentCapsule.privacy,
          tags: currentCapsule.tags,
          truthScore: currentCapsule.truthScore,
          mintResult: currentCapsule.mintResult
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Failed to store capsule metadata:', error);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (type.includes('text') || type.includes('document')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const resetUploader = () => {
    setUploadedFiles([]);
    setCurrentCapsule(null);
    setProcessingStep('upload');
  };

  return (
    <Card className={`border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Enhanced Capsule Creator
          <Badge variant="secondary" className="ml-auto">
            Step {processingStep === 'upload' ? '1' : processingStep === 'analyze' ? '2' : processingStep === 'mint' ? '3' : '4'} of 4
          </Badge>
        </CardTitle>
        
        {/* Progress Bar */}
        <Progress 
          value={
            processingStep === 'upload' ? 25 : 
            processingStep === 'analyze' ? 50 : 
            processingStep === 'mint' ? 75 : 100
          } 
          className="h-2"
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Step 1: File Upload */}
        {processingStep === 'upload' && (
          <div className="space-y-4">
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={50 * 1024 * 1024} // 50MB
              onGetUploadParameters={async () => {
                const response = await apiRequest('/api/objects/upload', { method: 'POST' });
                return { method: 'PUT' as const, url: response.uploadURL };
              }}
              onComplete={handleFileUpload}
              buttonClassName="h-32 w-full flex-col gap-2 border-2 border-dashed border-purple-300 hover:border-purple-400"
            >
              <Upload className="w-8 h-8 text-purple-600" />
              <span className="text-lg font-medium">Upload Your Capsule Content</span>
              <span className="text-sm text-gray-500">Images, videos, audio, documents - all supported</span>
              <Badge variant="outline" className="mt-2">
                Auto-mint as NFT • Blockchain sealing • Truth scoring
              </Badge>
            </ObjectUploader>
          </div>
        )}

        {/* Step 2: Content Analysis */}
        {processingStep === 'analyze' && currentCapsule && (
          <div className="space-y-4">
            {/* File Preview */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {getFileIcon(currentCapsule.fileType)}
                  <div className="flex-1">
                    <p className="font-medium">{currentCapsule.fileName}</p>
                    <p className="text-sm text-gray-500">{currentCapsule.fileType}</p>
                  </div>
                  <Badge variant="outline">Processing</Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <CapsuleAutotagger
              capsuleId={currentCapsule.id}
              fileUrl={currentCapsule.fileUrl}
              fileName={currentCapsule.fileName}
              fileType={currentCapsule.fileType}
              onTagsGenerated={handleTagsGenerated}
            />

            {/* Privacy Settings */}
            <CapsulePrivacyToggle
              initialPrivacy={currentCapsule.privacy}
              capsuleId={currentCapsule.id}
              onPrivacyChange={handlePrivacyChange}
            />

            {/* Mint Button */}
            <div className="pt-2">
              <MintCapsuleButton
                capsuleId={currentCapsule.id}
                fileUrl={currentCapsule.fileUrl}
                fileName={currentCapsule.fileName}
                fileType={currentCapsule.fileType}
                truthScore={currentCapsule.truthScore}
                onMintComplete={handleMintComplete}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Step 3: Minting in Progress */}
        {processingStep === 'mint' && currentCapsule && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg font-medium">Minting your capsule as NFT...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        )}

        {/* Step 4: Complete */}
        {processingStep === 'complete' && currentCapsule && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
                Capsule Created Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your sovereign memory has been permanently sealed on the blockchain
              </p>
            </div>

            {/* Final Summary */}
            <Card className="bg-green-50 dark:bg-green-950">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">NFT Token ID:</span>
                    <p className="text-green-700">{currentCapsule.mintResult?.tokenId}</p>
                  </div>
                  <div>
                    <span className="font-medium">Truth Score:</span>
                    <p className="text-green-700">{currentCapsule.truthScore}/100</p>
                  </div>
                  <div>
                    <span className="font-medium">Privacy Level:</span>
                    <p className="text-green-700 capitalize">{currentCapsule.privacy}</p>
                  </div>
                  <div>
                    <span className="font-medium">Tags:</span>
                    <p className="text-green-700">{currentCapsule.tags.length} generated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={resetUploader} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Create Another Capsule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}