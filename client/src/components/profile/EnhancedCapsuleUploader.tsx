import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText,
  CheckCircle,
  Loader2,
  X,
  Eye,
  Zap,
  Brain
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import MintCapsuleButton from "./MintCapsuleButton";
import CapsuleAutotagger from "./CapsuleAutotagger";
import CapsulePrivacyToggle, { type PrivacySettings } from "./CapsulePrivacyToggle";

interface UploadStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface FileUpload {
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'audio' | 'document';
  uploadUrl?: string;
  uploaded: boolean;
}

interface CapsuleMetadata {
  title: string;
  summary: string;
  tags: string[];
  truthScore?: number;
  emotionalResonance?: number;
  aiInsights?: any;
}

interface EnhancedCapsuleUploaderProps {
  className?: string;
  onCapsuleCreated?: (capsule: any) => void;
  autoAnalyze?: boolean;
}

export default function EnhancedCapsuleUploader({
  className = "",
  onCapsuleCreated,
  autoAnalyze = true
}: EnhancedCapsuleUploaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [metadata, setMetadata] = useState<CapsuleMetadata>({
    title: '',
    summary: '',
    tags: []
  });
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    level: 'public',
    timeLockEnabled: false,
    allowSharing: true,
    allowComments: true,
    searchable: true
  });
  const [capsuleId, setCapsuleId] = useState<string | null>(null);

  const steps: UploadStep[] = [
    {
      id: 1,
      title: 'Upload Files',
      description: 'Select and upload your media files',
      completed: uploads.length > 0 && uploads.every(u => u.uploaded)
    },
    {
      id: 2,
      title: 'Analyze Content',
      description: 'AI analysis and auto-tagging',
      completed: !!metadata.aiInsights
    },
    {
      id: 3,
      title: 'Mint NFT',
      description: 'Create blockchain proof',
      completed: false
    },
    {
      id: 4,
      title: 'Complete',
      description: 'Finalize your truth capsule',
      completed: false
    }
  ];

  const getFileType = (file: File): 'image' | 'video' | 'audio' | 'document' => {
    const type = file.type;
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      default: return FileText;
    }
  };

  const createPreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  }, []);

  const uploadFileMutation = useMutation({
    mutationFn: async (fileUpload: FileUpload) => {
      // Get presigned upload URL
      const uploadResponse = await apiRequest("POST", "/api/objects/upload") as any;
      
      // Upload file directly to storage
      const uploadResult = await fetch(uploadResponse.uploadURL, {
        method: 'PUT',
        body: fileUpload.file,
        headers: {
          'Content-Type': fileUpload.file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error('Failed to upload file');
      }

      return {
        fileUrl: uploadResponse.uploadURL.split('?')[0], // Remove query params
        fileType: fileUpload.type,
        fileName: fileUpload.file.name,
        fileSize: fileUpload.file.size
      };
    },
    onSuccess: (result, fileUpload) => {
      setUploads(prev => prev.map(upload => 
        upload.file === fileUpload.file 
          ? { ...upload, uploaded: true, uploadUrl: result.fileUrl }
          : upload
      ));
      
      toast({
        title: "File Uploaded",
        description: `${fileUpload.file.name} uploaded successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const createCapsuleMutation = useMutation({
    mutationFn: async () => {
      const capsuleData = {
        title: metadata.title,
        summary: metadata.summary,
        tags: metadata.tags,
        privacy: privacy,
        files: uploads.map(upload => ({
          url: upload.uploadUrl,
          type: upload.type,
          name: upload.file.name,
          size: upload.file.size
        })),
        aiInsights: metadata.aiInsights,
        truthScore: metadata.truthScore,
        emotionalResonance: metadata.emotionalResonance
      };

      return await apiRequest("POST", "/api/capsules", capsuleData);
    },
    onSuccess: (capsule: any) => {
      setCapsuleId(capsule.id);
      setCurrentStep(3);
      onCapsuleCreated?.(capsule);
      
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      
      toast({
        title: "Capsule Created",
        description: "Your truth capsule has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create capsule",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      const type = getFileType(file);
      const preview = await createPreview(file);
      
      const fileUpload: FileUpload = {
        file,
        type,
        preview,
        uploaded: false
      };
      
      setUploads(prev => [...prev, fileUpload]);
      
      // Auto-upload
      uploadFileMutation.mutate(fileUpload);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== fileToRemove));
  };

  const handleMetadataChange = (field: keyof CapsuleMetadata, value: any) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsGenerated = (insights: any) => {
    setMetadata(prev => ({
      ...prev,
      tags: insights.tags || [],
      truthScore: insights.truthLikelihood?.score,
      emotionalResonance: insights.emotionalResonance?.score,
      aiInsights: insights
    }));
    setCurrentStep(2);
  };

  const handleCreateCapsule = () => {
    if (!metadata.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your capsule",
        variant: "destructive",
      });
      return;
    }
    
    createCapsuleMutation.mutate();
  };

  const handleMintComplete = () => {
    setCurrentStep(4);
    toast({
      title: "Process Complete!",
      description: "Your sovereign truth capsule is now live on the blockchain",
    });
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return uploads.length > 0 && uploads.every(u => u.uploaded);
      case 2: return metadata.title.trim() && metadata.summary.trim();
      case 3: return true;
      default: return false;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Enhanced Capsule Creator
          <Badge variant="secondary" className="ml-auto">
            Step {currentStep} of 4
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1
                ${step.completed ? 'bg-green-100 text-green-800' : 
                  currentStep === step.id ? 'bg-blue-100 text-blue-800' : 
                  'bg-muted text-muted-foreground'}
              `}>
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="text-xs font-medium">{step.title}</div>
              <div className="text-xs text-muted-foreground">{step.description}</div>
            </div>
          ))}
        </div>
        
        <Progress value={(currentStep / steps.length) * 100} className="w-full" />

        <Separator />

        {/* Step 1: File Upload */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Upload Your Files</h3>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Files
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />

            {uploads.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {uploads.map((upload, index) => {
                  const IconComponent = getFileIcon(upload.type);
                  
                  return (
                    <div key={index} className="relative p-3 border rounded-lg">
                      {upload.preview && (
                        <img 
                          src={upload.preview} 
                          alt="Preview" 
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                      )}
                      
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium truncate">
                          {upload.file.name}
                        </span>
                        {upload.uploaded ? (
                          <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => handleRemoveFile(upload.file)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {uploads.length > 0 && uploads.every(u => u.uploaded) && (
              <Button 
                onClick={() => setCurrentStep(2)}
                className="w-full"
              >
                Continue to Analysis
                <Brain className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {/* Step 2: Analysis & Metadata */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={metadata.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  placeholder="Enter a compelling title for your truth capsule"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={metadata.summary}
                  onChange={(e) => handleMetadataChange('summary', e.target.value)}
                  placeholder="Describe the content and significance of your capsule"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <CapsulePrivacyToggle
              privacy={privacy}
              onPrivacyChange={setPrivacy}
            />

            <CapsuleAutotagger
              capsuleId={capsuleId || 'temp'}
              content={metadata.summary}
              title={metadata.title}
              onTagsGenerated={handleTagsGenerated}
              autoAnalyze={autoAnalyze && !!metadata.summary}
            />

            {canProceedToNextStep() && (
              <Button 
                onClick={handleCreateCapsule}
                disabled={createCapsuleMutation.isPending}
                className="w-full"
              >
                {createCapsuleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Capsule...
                  </>
                ) : (
                  <>
                    Create Truth Capsule
                    <Zap className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Step 3: NFT Minting */}
        {currentStep === 3 && capsuleId && (
          <div className="space-y-4 text-center">
            <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Capsule Created Successfully!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your truth capsule has been created and is ready for minting as an NFT.
              </p>
              
              <MintCapsuleButton
                capsuleId={capsuleId}
                fileUrl={uploads[0]?.uploadUrl}
                metadata={metadata}
                onMintComplete={handleMintComplete}
                className="w-full"
              />
            </div>
            
            <Button 
              variant="outline"
              onClick={() => setCurrentStep(4)}
              className="w-full"
            >
              Skip NFT Minting
              <Eye className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="text-center space-y-4">
            <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <Zap className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Truth Capsule Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your sovereign memory has been permanently preserved on the blockchain.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  // Reset form
                  setCurrentStep(1);
                  setUploads([]);
                  setMetadata({ title: '', summary: '', tags: [] });
                  setCapsuleId(null);
                }}
                className="flex-1"
              >
                Create Another
              </Button>
              <Button className="flex-1">
                View Profile
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}