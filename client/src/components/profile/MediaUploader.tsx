import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  X, 
  Check,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  uploadProgress: number;
  uploaded: boolean;
  error?: string;
}

interface MediaUploaderProps {
  userId: string;
  onUploadComplete?: (files: MediaFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function MediaUploader({ 
  userId, 
  onUploadComplete, 
  maxFiles = 10,
  acceptedTypes = ['image/*', 'video/*']
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const generatePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: MediaFile[] = [];
    
    for (let i = 0; i < selectedFiles.length && files.length + newFiles.length < maxFiles; i++) {
      const file = selectedFiles[i];
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 50MB limit`,
          variant: "destructive"
        });
        continue;
      }

      const preview = await generatePreview(file);
      
      newFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        type,
        uploadProgress: 0,
        uploaded: false
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, maxFiles, generatePreview, toast]);

  const uploadFile = async (mediaFile: MediaFile) => {
    try {
      const formData = new FormData();
      formData.append('file', mediaFile.file);
      formData.append('userId', userId);
      formData.append('type', mediaFile.type);

      const response = await fetch('/api/profile/upload-media', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      setFiles(prev => prev.map(f => 
        f.id === mediaFile.id 
          ? { ...f, uploaded: true, uploadProgress: 100 }
          : f
      ));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setFiles(prev => prev.map(f => 
        f.id === mediaFile.id 
          ? { ...f, error: errorMessage, uploadProgress: 0 }
          : f
      ));
      
      throw error;
    }
  };

  const handleUploadAll = async () => {
    setIsUploading(true);
    const unuploadedFiles = files.filter(f => !f.uploaded && !f.error);

    try {
      await Promise.all(unuploadedFiles.map(uploadFile));
      
      toast({
        title: "Upload successful",
        description: `${unuploadedFiles.length} files uploaded to your profile`,
        variant: "default"
      });

      if (onUploadComplete) {
        onUploadComplete(files.filter(f => f.uploaded));
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Photos & Videos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-brand-primary bg-brand-primary/10' 
              : 'border-brand-light/20 hover:border-brand-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="media-upload-area"
        >
          <Upload className="w-12 h-12 text-brand-light/40 mx-auto mb-4" />
          <p className="text-brand-light mb-2">Drag and drop files here</p>
          <p className="text-sm text-brand-light/60 mb-4">
            or click to select files (max {maxFiles} files, 50MB each)
          </p>
          
          <Label htmlFor="media-upload" className="cursor-pointer">
            <Button variant="outline" className="border-brand-light/20 hover:bg-brand-light/10">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </Label>
          
          <Input
            id="media-upload"
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            data-testid="media-upload-input"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-brand-light">
              Selected Files ({files.length}/{maxFiles})
            </h4>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-brand-surface rounded-lg border border-brand-light/10"
                  data-testid={`media-file-${file.id}`}
                >
                  {/* Preview */}
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-dark rounded overflow-hidden">
                    {file.type === 'image' ? (
                      <img 
                        src={file.preview} 
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-brand-accent" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-light truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-brand-light/60">
                      {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    
                    {/* Progress */}
                    {file.uploadProgress > 0 && file.uploadProgress < 100 && (
                      <Progress value={file.uploadProgress} className="mt-2 h-1" />
                    )}
                    
                    {/* Error */}
                    {file.error && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {file.error}
                      </p>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2">
                    {file.uploaded ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : file.error ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(file.id)}
                        className="text-brand-light/60 hover:text-red-400"
                        data-testid={`remove-file-${file.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUploadAll}
              disabled={isUploading || files.every(f => f.uploaded || f.error)}
              className="w-full"
              data-testid="upload-all-button"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload All Files
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}