import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@/hooks/useWallet";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Upload, 
  Shield, 
  Coins, 
  Clock, 
  FileText, 
  Image, 
  Video,
  Mic,
  Lock,
  Globe,
  Zap,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from "lucide-react";

interface SuperiorCapsuleCreatorProps {
  onCapsuleCreated?: (capsule: any) => void;
  className?: string;
}

export default function SuperiorCapsuleCreator({ 
  onCapsuleCreated, 
  className 
}: SuperiorCapsuleCreatorProps) {
  const { user } = useAuth();
  const { address, isConnected, chainId } = useWallet();
  const { isWalletAuthenticated } = useWalletAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasVeritasSeal, setHasVeritasSeal] = useState(false);
  const [unlockDate, setUnlockDate] = useState("");
  
  // UI state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<"content" | "media" | "settings" | "mint">("content");

  // Enhanced file upload handling
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setMediaFile(file);
    
    // Create preview for images/videos
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    setCurrentStep("settings");
  };

  // Enhanced capsule creation
  const createCapsuleMutation = useMutation({
    mutationFn: async (capsuleData: any) => {
      if (!isWalletAuthenticated) {
        throw new Error("Wallet authentication required");
      }

      setUploadProgress(25);
      
      // Step 1: Upload media to object storage
      let mediaUrl = "";
      if (mediaFile) {
        const uploadResponse = await fetch("/api/objects/upload", {
          method: "POST",
          credentials: "include",
        });
        
        if (!uploadResponse.ok) {
          throw new Error("Failed to get upload URL");
        }
        
        const { uploadURL } = await uploadResponse.json();
        setUploadProgress(50);

        // Upload file directly to object storage
        const uploadResult = await fetch(uploadURL, {
          method: "PUT",
          body: mediaFile,
          headers: {
            "Content-Type": mediaFile.type,
          },
        });

        if (!uploadResult.ok) {
          throw new Error("Media upload failed");
        }

        mediaUrl = uploadURL.split("?")[0]; // Remove query params
        setUploadProgress(75);
      }

      // Step 2: Create capsule with metadata
      const response = await fetch("/api/capsules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...capsuleData,
          mediaUrl,
          creatorAddress: address,
          chainId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create capsule");
      }

      setUploadProgress(100);
      return response.json();
    },
    onSuccess: (capsule) => {
      toast({
        title: "Capsule Created Successfully",
        description: `"${capsule.title}" has been minted to the blockchain`,
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setMediaFile(null);
      setMediaPreview("");
      setIsPrivate(false);
      setHasVeritasSeal(false);
      setUnlockDate("");
      setCurrentStep("content");
      setUploadProgress(0);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      
      onCapsuleCreated?.(capsule);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create capsule",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const handleCreateCapsule = () => {
    const capsuleData = {
      title,
      description,
      isPrivate,
      hasVeritasSeal,
      unlockDate: unlockDate || null,
      mediaType: mediaFile?.type || "text",
      fileSize: mediaFile?.size || 0,
      fileName: mediaFile?.name || "",
    };

    setCurrentStep("mint");
    createCapsuleMutation.mutate(capsuleData);
  };

  // Validation
  const canProceed = {
    content: title.trim().length > 0 && description.trim().length > 0,
    media: true, // Media is optional
    settings: true,
    mint: !createCapsuleMutation.isPending,
  };

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <Shield className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Connect your wallet to create capsules
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Superior Capsule Creator
        </CardTitle>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mt-4">
          {(["content", "media", "settings", "mint"] as const).map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep === step 
                  ? "bg-purple-600 text-white" 
                  : index < (["content", "media", "settings", "mint"] as const).indexOf(currentStep)
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }
              `}>
                {index < (["content", "media", "settings", "mint"] as const).indexOf(currentStep) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div className={`w-16 h-1 ${
                  index < (["content", "media", "settings", "mint"] as const).indexOf(currentStep)
                    ? "bg-green-600"
                    : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Content */}
        {currentStep === "content" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Capsule Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title for your truth capsule"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Truth Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the truth, testimony, or legacy you're preserving..."
                className="mt-2 min-h-[120px]"
              />
            </div>

            <Button 
              onClick={() => setCurrentStep("media")} 
              disabled={!canProceed.content}
              className="w-full"
            >
              Continue to Media
              <FileText className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Media Upload */}
        {currentStep === "media" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <Image className="w-8 h-8 text-gray-400" />
                    <Video className="w-8 h-8 text-gray-400" />
                    <Mic className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Upload Media (Optional)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Images, videos, audio, or documents (Max 10MB)
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {mediaFile && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Upload className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">{mediaFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(mediaFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMediaFile(null);
                      setMediaPreview("");
                    }}
                  >
                    Remove
                  </Button>
                </div>

                {mediaPreview && (
                  <div className="relative">
                    {mediaFile.type.startsWith("image/") ? (
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : mediaFile.type.startsWith("video/") ? (
                      <video 
                        src={mediaPreview} 
                        controls 
                        className="w-full h-48 rounded-lg"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("content")}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep("settings")} 
                className="flex-1"
              >
                Continue to Settings
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Advanced Settings */}
        {currentStep === "settings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Privacy Setting</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Control who can access this capsule
                    </p>
                  </div>
                  <Switch
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  {isPrivate ? (
                    <>
                      <Lock className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600">Private - Only you can access</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Public - Anyone can view</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Veritas Seal</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mark as verified truth
                    </p>
                  </div>
                  <Switch
                    checked={hasVeritasSeal}
                    onCheckedChange={setHasVeritasSeal}
                  />
                </div>
                
                {hasVeritasSeal && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600">Protected by Veritas Protocol</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="unlock-date">Time Lock (Optional)</Label>
              <Input
                id="unlock-date"
                type="datetime-local"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Set a future date when this capsule will be automatically unlocked
              </p>
            </div>

            {unlockDate && (
              <Alert>
                <Clock className="w-4 h-4" />
                <AlertDescription>
                  Capsule will unlock on {new Date(unlockDate).toLocaleDateString()} at {new Date(unlockDate).toLocaleTimeString()}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("media")}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep("mint")}
                className="flex-1"
              >
                Review & Create
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Final Review & Minting */}
        {currentStep === "mint" && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Review Your Capsule</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Title:</span>
                  <p className="text-gray-600 dark:text-gray-400">{title}</p>
                </div>
                <div>
                  <span className="font-medium">Privacy:</span>
                  <Badge variant={isPrivate ? "secondary" : "default"}>
                    {isPrivate ? "Private" : "Public"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Media:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {mediaFile ? mediaFile.name : "Text only"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Veritas Seal:</span>
                  <Badge variant={hasVeritasSeal ? "default" : "outline"}>
                    {hasVeritasSeal ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-sm">Description:</span>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                </p>
              </div>
            </div>

            {createCapsuleMutation.isPending && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Creating capsule...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("settings")}
                disabled={createCapsuleMutation.isPending}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleCreateCapsule}
                disabled={createCapsuleMutation.isPending || !canProceed.mint}
                className="flex-1"
              >
                {createCapsuleMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    Create Capsule
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
