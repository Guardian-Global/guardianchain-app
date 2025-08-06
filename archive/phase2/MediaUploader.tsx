import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, X, Image, Video, File, Check } from "lucide-react";

interface MediaUploaderProps {
  userId: string;
  onUploadComplete?: () => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
  url?: string;
}

export default function MediaUploader({ 
  userId, 
  onUploadComplete, 
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*']
}: MediaUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Get presigned URL for upload
      const uploadResponse = await apiRequest('/api/objects/upload', 'POST');
      const { uploadURL } = uploadResponse as { uploadURL: string };

      // Upload file to object storage
      const fileUploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!fileUploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Save media metadata
      const mediaData = {
        userId,
        title: file.name.split('.')[0],
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: uploadURL.split('?')[0], // Remove query params
        isPublic: true
      };

      return await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mediaData)
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile', userId, 'media'] });
      onUploadComplete?.();
    }
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files).slice(0, maxFiles);
    const newUploadingFiles: UploadingFile[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload each file
    fileArray.forEach(async (file, index) => {
      try {
        await uploadMutation.mutateAsync(file);
        
        setUploadingFiles(prev => prev.map((item, i) => 
          item.file === file ? { ...item, progress: 100, status: 'complete' } : item
        ));

        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded successfully.`
        });
      } catch (error) {
        setUploadingFiles(prev => prev.map((item, i) => 
          item.file === file ? { 
            ...item, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed' 
          } : item
        ));

        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(item => item.file !== file));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8" />;
    if (file.type.startsWith('video/')) return <Video className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">Upload Media Files</h3>
        <p className="text-gray-500 mb-4">
          Drag and drop your files here, or click to browse
        </p>
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="file-upload"
          data-testid="input-file-upload"
        />
        <label htmlFor="file-upload">
          <Button 
            type="button" 
            className="cursor-pointer"
            data-testid="button-browse-files"
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </label>
        <p className="text-xs text-gray-400 mt-2">
          Supports images and videos up to 10MB each
        </p>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Uploading Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadingFiles.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0 text-gray-400">
                  {item.status === 'complete' ? (
                    <Check className="w-8 h-8 text-green-500" />
                  ) : item.status === 'error' ? (
                    <X className="w-8 h-8 text-red-500" />
                  ) : (
                    getFileIcon(item.file)
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" data-testid={`text-file-name-${index}`}>
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(item.file.size)}
                  </p>
                  
                  {item.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  )}
                  
                  {item.status === 'error' && (
                    <p className="text-xs text-red-500 mt-1">
                      {item.error}
                    </p>
                  )}
                  
                  {item.status === 'complete' && (
                    <p className="text-xs text-green-500 mt-1">
                      Upload complete
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(item.file)}
                  className="flex-shrink-0"
                  data-testid={`button-remove-file-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}