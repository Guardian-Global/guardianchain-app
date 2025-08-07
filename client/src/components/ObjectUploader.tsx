import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { successful: Array<{ uploadURL: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
  accept?: string;
}

/**
 * A simplified, functional file upload component for GuardianChain
 * Handles direct uploads to object storage with proper error handling
 */
export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
  accept = "image/*"
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file size
    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');

    try {
      // Get upload URL from backend
      const { url } = await onGetUploadParameters();
      
      // Upload file directly to object storage
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      setUploadStatus('success');
      
      // Call completion handler with the upload URL
      onComplete?.({
        successful: [{
          uploadURL: url.split('?')[0] // Remove query parameters
        }]
      });

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully",
      });

    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus('error');
      
      toast({
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept={accept}
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
        id="file-upload-input"
        data-testid="input-file-upload"
      />
      
      <Button
        onClick={() => document.getElementById('file-upload-input')?.click()}
        disabled={isUploading}
        className={buttonClassName}
        data-testid="button-upload"
      >
        <div className="flex items-center gap-2">
          {uploadStatus === 'uploading' && <div className="animate-spin">⚡</div>}
          {uploadStatus === 'success' && <CheckCircle className="w-4 h-4" />}
          {uploadStatus === 'error' && <AlertCircle className="w-4 h-4" />}
          {uploadStatus === 'idle' && <Upload className="w-4 h-4" />}
          {children}
        </div>
      </Button>
      
      {uploadStatus === 'uploading' && (
        <div className="text-sm text-muted-foreground" data-testid="text-upload-status">
          Uploading to object storage...
        </div>
      )}
    </div>
  );
}