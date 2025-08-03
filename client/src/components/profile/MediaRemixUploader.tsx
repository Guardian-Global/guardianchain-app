import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  Wand2, 
  Image as ImageIcon, 
  Loader2,
  Download,
  Share2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PredictionStatus {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[];
  error?: string;
}

interface RemixResponse {
  success: boolean;
  prediction: {
    id: string;
    status: string;
    output?: string | string[];
    urls?: {
      get: string;
      cancel: string;
    };
  };
  message: string;
}

export interface MediaRemixUploaderProps {
  userId: string;
  onRemixComplete?: (outputUrl: string) => void;
  className?: string;
}

export default function MediaRemixUploader({ 
  userId, 
  onRemixComplete, 
  className 
}: MediaRemixUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Poll for prediction status
  const { data: predictionStatus } = useQuery<PredictionStatus>({
    queryKey: [`/api/media/remix/status/${predictionId}`],
    enabled: !!predictionId && !outputUrl,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Check if prediction is complete
  if (predictionStatus?.status === "succeeded" && predictionStatus.output && !outputUrl) {
    const output = Array.isArray(predictionStatus.output) 
      ? predictionStatus.output[0] 
      : predictionStatus.output;
    setOutputUrl(output);
    onRemixComplete?.(output);
    toast({
      title: "Remix Complete!",
      description: "Your AI-powered media transformation is ready",
    });
  }

  const uploadMutation = useMutation({
    mutationFn: async (uploadFile: File) => {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", uploadFile);
      
      // For now, we'll use a base64 data URL as fallback
      // In production, this would upload to your preferred storage service
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadFile);
      });
    },
    onSuccess: (dataUrl) => {
      setPreviewUrl(dataUrl);
      toast({
        title: "Image Uploaded",
        description: "Ready for AI transformation",
      });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const remixMutation = useMutation<RemixResponse, Error, { inputUrl: string; prompt: string }>({
    mutationFn: async ({ inputUrl, prompt }: { inputUrl: string; prompt: string }) => {
      const response = await apiRequest("POST", "/api/media/remix", {
        inputUrl,
        prompt,
        modelVersion: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // stable-diffusion img2img
        strength: 0.8
      });
      return response as unknown as RemixResponse;
    },
    onSuccess: (data) => {
      setPredictionId(data.prediction.id);
      toast({
        title: "AI Remix Started",
        description: "Your image is being transformed. This may take a minute...",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Remix Failed",
        description: error.message || "Failed to start AI remix",
        variant: "destructive",
      });
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      uploadMutation.mutate(droppedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop an image file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleRemix = () => {
    if (!previewUrl || !prompt.trim()) {
      toast({
        title: "Missing Requirements",
        description: "Please upload an image and enter a transformation prompt",
        variant: "destructive",
      });
      return;
    }

    remixMutation.mutate({
      inputUrl: previewUrl,
      prompt: prompt.trim(),
    });
  };

  const downloadImage = () => {
    if (outputUrl) {
      const link = document.createElement('a');
      link.href = outputUrl;
      link.download = `guardianchain-remix-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareRemix = () => {
    if (outputUrl) {
      navigator.clipboard.writeText(outputUrl);
      toast({
        title: "Link Copied",
        description: "Remix URL copied to clipboard",
      });
    }
  };

  const isProcessing = remixMutation.isPending || (predictionId && predictionStatus?.status !== "succeeded");

  return (
    <Card className={`bg-brand-secondary border-brand-surface ${className}`}>
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-accent" />
          AI Media Remix Studio
        </CardTitle>
        <p className="text-brand-light/60 text-sm">
          Transform your images with AI-powered artistic styles and effects
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-brand-light/20 rounded-lg p-8 text-center cursor-pointer hover:border-brand-accent/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          data-testid="drop-zone-media-remix"
        >
          {previewUrl ? (
            <div className="space-y-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="mx-auto max-h-48 rounded-lg shadow-lg"
              />
              <Badge variant="outline" className="text-brand-accent border-brand-accent">
                Original Image
              </Badge>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-brand-light/30 mx-auto" />
              <div className="space-y-2">
                <p className="text-brand-light">Drop an image here to upload</p>
                <p className="text-xs text-brand-light/50">Or click to select from your device</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                data-testid="input-file-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="border-brand-accent text-brand-accent hover:bg-brand-accent/10"
                data-testid="button-select-file"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Select Image
              </Button>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-light">
            Transformation Prompt
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want to transform the image (e.g., 'Van Gogh style painting', 'cyberpunk neon aesthetic', 'watercolor artwork')"
            className="bg-brand-surface border-brand-light/20 text-brand-light placeholder:text-brand-light/40 resize-none"
            rows={3}
            data-testid="textarea-remix-prompt"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleRemix}
            disabled={!previewUrl || !prompt.trim() || isProcessing || false}
            className="flex-1 bg-brand-primary hover:bg-brand-primary/80"
            data-testid="button-start-remix"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {predictionStatus?.status === "processing" ? "Transforming..." : "Starting..."}
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Remix with AI
              </>
            )}
          </Button>
        </div>

        {/* Processing Status */}
        {isProcessing && predictionStatus && (
          <Card className="bg-brand-surface border-brand-light/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-brand-accent" />
                <div>
                  <p className="text-brand-light font-medium">AI Transformation in Progress</p>
                  <p className="text-xs text-brand-light/60">
                    Status: {predictionStatus.status} • ID: {predictionId?.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Output Display */}
        {outputUrl && (
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="outline" className="text-green-400 border-green-400 mb-4">
                AI Transformation Complete
              </Badge>
              <img 
                src={outputUrl} 
                alt="AI Remixed" 
                className="mx-auto max-w-full rounded-lg shadow-lg"
                data-testid="img-remix-output"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={downloadImage}
                variant="outline"
                className="flex-1 border-brand-accent text-brand-accent hover:bg-brand-accent/10"
                data-testid="button-download-remix"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={shareRemix}
                variant="outline"
                className="flex-1 border-brand-accent text-brand-accent hover:bg-brand-accent/10"
                data-testid="button-share-remix"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}