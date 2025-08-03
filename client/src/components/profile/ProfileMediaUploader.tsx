import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image, Video, FileAudio, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProfileMediaUploaderProps {
  userId: string;
}

export default function ProfileMediaUploader({ userId }: ProfileMediaUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('userId', userId);
      
      return apiRequest("POST", "/api/profile/media/upload", formData);
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Media files have been uploaded to your profile.",
      });
      setSelectedFiles([]);
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${userId}/media`] });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload media files. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || 
      file.type.startsWith('video/') || 
      file.type.startsWith('audio/')
    );
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="w-4 h-4" />;
    return <Upload className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <Upload className="w-5 h-5 text-brand-accent" />
          Media Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive 
              ? "border-brand-primary bg-brand-primary/10" 
              : "border-brand-light/20 hover:border-brand-light/40"
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          data-testid="media-drop-zone"
        >
          <Upload className="w-12 h-12 text-brand-light/40 mx-auto mb-4" />
          <p className="text-brand-light/80 mb-2">
            Drag and drop media files here, or click to select
          </p>
          <p className="text-xs text-brand-light/50 mb-4">
            Supports images, videos, and audio files
          </p>
          
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={handleFileInput}
            className="hidden"
            id="media-upload"
            data-testid="input-file-upload"
          />
          <Button
            variant="outline"
            asChild
            className="border-brand-light/20 text-brand-light hover:bg-brand-light/10"
          >
            <label htmlFor="media-upload" className="cursor-pointer">
              Select Files
            </label>
          </Button>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-brand-light">Selected Files</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-brand-surface rounded border border-brand-light/10"
                  data-testid={`selected-file-${index}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getFileIcon(file)}
                    <div className="min-w-0">
                      <p className="text-sm text-brand-light truncate">{file.name}</p>
                      <p className="text-xs text-brand-light/50">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-brand-light/60 hover:text-red-400 p-1"
                    data-testid={`button-remove-file-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFiles.length > 0 && (
          <Button
            onClick={() => uploadMutation.mutate(selectedFiles)}
            disabled={uploadMutation.isPending}
            className="w-full bg-brand-primary hover:bg-brand-primary/80"
            data-testid="button-upload-media"
          >
            {uploadMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </div>
            ) : (
              `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}