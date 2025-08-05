import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon, 
  Video, 
  Play,
  Download,
  Eye,
  Trash2,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import MediaUploader from "./MediaUploader";

interface MediaFile {
  id: string;
  type: string;
  url: string;
  thumbnail?: string;
  title: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  isPublic: boolean;
  duration?: number;
}

interface MediaGalleryProps {
  userId: string;
}

export default function MediaGallery({ userId }: MediaGalleryProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const { toast } = useToast();

  // Fetch user's media files
  const { data: mediaFiles = [], isLoading, refetch } = useQuery<MediaFile[]>({
    queryKey: ['/api/profile', userId, 'media'],
    enabled: !!userId
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMediaPreview = (media: MediaFile) => {
    const isVideo = media.type === 'video' || media.mimeType.startsWith('video/');
    const isImage = media.type === 'image' || media.mimeType.startsWith('image/');

    return (
      <div className="relative group">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {isImage ? (
            <img
              src={media.url}
              alt={media.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : isVideo ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 relative">
              {media.thumbnail ? (
                <img
                  src={media.thumbnail}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Video className="w-12 h-12 text-gray-400" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="w-8 h-8 text-white" />
              </div>
              {media.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSelectedMedia(media)}
            data-testid={`button-view-media-${media.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(media.url, '_blank')}
            data-testid={`button-download-media-${media.id}`}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Media info */}
        <div className="mt-2">
          <p className="text-sm font-medium truncate" data-testid={`text-media-title-${media.id}`}>
            {media.title}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">
              {formatFileSize(media.size)}
            </span>
            <Badge variant={media.isPublic ? "default" : "secondary"} className="text-xs">
              {media.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <p className="text-xs text-gray-400">
            {format(new Date(media.uploadedAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
    );
  };

  const handleUploadComplete = () => {
    setShowUploader(false);
    refetch();
    toast({
      title: "Upload Complete",
      description: "Your media files have been uploaded successfully.",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Media Gallery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Media Gallery</span>
            <Badge variant="outline">{mediaFiles.length}</Badge>
          </CardTitle>
          <Button 
            onClick={() => setShowUploader(true)}
            data-testid="button-open-uploader"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {mediaFiles.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No media files yet
            </h3>
            <p className="text-gray-500 mb-4">
              Upload your first photo or video to get started
            </p>
            <Button 
              onClick={() => setShowUploader(true)}
              data-testid="button-upload-first-media"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaFiles.map((media: MediaFile) => (
              <div key={media.id}>
                {renderMediaPreview(media)}
              </div>
            ))}
          </div>
        )}

        {/* Media Uploader Modal */}
        {showUploader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Media Files</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploader(false)}
                  data-testid="button-close-uploader"
                >
                  ×
                </Button>
              </div>
              <MediaUploader
                userId={userId}
                onUploadComplete={handleUploadComplete}
                maxFiles={5}
              />
            </div>
          </div>
        )}

        {/* Media Viewer Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="max-w-4xl max-h-[90vh] w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-semibold">
                  {selectedMedia.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMedia(null)}
                  className="text-white hover:bg-white/20"
                  data-testid="button-close-viewer"
                >
                  ×
                </Button>
              </div>
              <div className="bg-black rounded-lg overflow-hidden">
                {selectedMedia.mimeType.startsWith('image/') ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-auto max-h-[70vh]"
                    data-testid="video-player"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="mt-4 text-white text-sm">
                <p><strong>File:</strong> {selectedMedia.originalName}</p>
                <p><strong>Size:</strong> {formatFileSize(selectedMedia.size)}</p>
                <p><strong>Uploaded:</strong> {format(new Date(selectedMedia.uploadedAt), 'PPP')}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}