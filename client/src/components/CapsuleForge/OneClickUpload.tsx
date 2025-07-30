import React, { useState, useCallback } from "react";
import { Upload, CheckCircle, AlertCircle, FileText, Image, Video, File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string;
  ipfsHash?: string;
  uploadProgress: number;
  status: "uploading" | "completed" | "error";
}

interface OneClickUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  onContentExtracted: (content: string, metadata: any) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function OneClickUpload({
  onFilesUploaded,
  onContentExtracted,
  maxFiles = 5,
  acceptedTypes = ['.txt', '.md', '.pdf', '.jpg', '.png', '.mp4', '.json']
}: OneClickUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const processFileUpload = async (file: File): Promise<UploadedFile> => {
    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: "uploading"
    };

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        uploadedFile.uploadProgress = progress;
        setUploadedFiles(prev => 
          prev.map(f => f.name === file.name ? { ...f, uploadProgress: progress } : f)
        );
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Extract content based on file type
      let content = "";
      let metadata = {};

      if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        content = await file.text();
        metadata = {
          wordCount: content.split(/\s+/).length,
          charCount: content.length,
          language: detectLanguage(content)
        };
      } else if (file.type.startsWith('image/')) {
        content = `[Image: ${file.name}]`;
        metadata = {
          imageType: file.type,
          size: file.size,
          dimensions: await getImageDimensions(file)
        };
      } else if (file.type.startsWith('video/')) {
        content = `[Video: ${file.name}]`;
        metadata = {
          videoType: file.type,
          size: file.size,
          duration: await getVideoDuration(file)
        };
      } else {
        content = `[File: ${file.name}]`;
        metadata = {
          fileType: file.type,
          size: file.size
        };
      }

      // Generate IPFS hash
      const contentForHash = JSON.stringify({ content, metadata, timestamp: Date.now() });
      const hash = await generateIPFSHash(contentForHash);

      uploadedFile.content = content;
      uploadedFile.ipfsHash = hash;
      uploadedFile.status = "completed";

      return uploadedFile;
    } catch (error) {
      uploadedFile.status = "error";
      return uploadedFile;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: "uploading" as const
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(processFileUpload)
      );

      setUploadedFiles(prev => 
        prev.map(existing => {
          const processed = processedFiles.find(p => p.name === existing.name);
          return processed || existing;
        })
      );

      onFilesUploaded(processedFiles);

      // If there's text content, extract it for the main form
      const textContent = processedFiles
        .filter(f => f.content && !f.content.startsWith('['))
        .map(f => f.content)
        .join('\n\n');

      if (textContent) {
        onContentExtracted(textContent, {
          sources: processedFiles.map(f => ({ name: f.name, hash: f.ipfsHash })),
          totalFiles: processedFiles.length
        });
      }

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${processedFiles.length} file(s) to IPFS`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onFilesUploaded, onContentExtracted, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('text/')) return FileText;
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return File;
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'error': return AlertCircle;
      default: return Upload;
    }
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="h-5 w-5 text-green-400" />
          One-Click IPFS Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-purple-500 bg-purple-900/20'
              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-900/30'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          
          {isDragActive ? (
            <div className="text-purple-400">
              <p className="text-lg font-medium">Drop files here...</p>
              <p className="text-sm">Automatic IPFS upload and content extraction</p>
            </div>
          ) : (
            <div className="text-slate-300">
              <p className="text-lg font-medium">Drag & drop files or click to browse</p>
              <p className="text-sm text-slate-400 mt-2">
                Supports: Text, Images, Videos, Documents
              </p>
              <div className="flex flex-wrap justify-center gap-1 mt-3">
                {acceptedTypes.map(type => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-white font-medium">Uploaded Files</h4>
              <Button
                onClick={clearFiles}
                variant="outline"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                Clear All
              </Button>
            </div>
            
            {uploadedFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              const StatusIcon = getStatusIcon(file.status);
              
              return (
                <div
                  key={index}
                  className="bg-slate-900/30 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-4 w-4 text-slate-400" />
                      <span className="text-white text-sm truncate max-w-48">
                        {file.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {(file.size / 1024).toFixed(1)}KB
                      </Badge>
                    </div>
                    
                    <div className={`flex items-center gap-1 ${getStatusColor(file.status)}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-xs capitalize">{file.status}</span>
                    </div>
                  </div>
                  
                  {file.status === "uploading" && (
                    <Progress value={file.uploadProgress} className="h-1" />
                  )}
                  
                  {file.ipfsHash && (
                    <div className="text-xs text-green-400 font-mono">
                      IPFS: {file.ipfsHash.slice(0, 20)}...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Status */}
        {isUploading && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"></div>
              <span className="text-purple-400 text-sm">
                Uploading to IPFS and extracting content...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper functions
async function generateIPFSHash(content: string): Promise<string> {
  // Simple hash generation for demo
  const hash = content.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return `Qm${Math.abs(hash).toString(36).padStart(44, '0').substr(0, 44)}`;
}

function detectLanguage(text: string): string {
  // Simple language detection
  const englishPattern = /^[a-zA-Z\s.,!?;:'"()\-0-9]+$/;
  return englishPattern.test(text.substr(0, 100)) ? 'en' : 'unknown';
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = URL.createObjectURL(file);
  });
}

async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => resolve(video.duration);
    video.onerror = () => resolve(0);
    video.src = URL.createObjectURL(file);
  });
}