import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon, 
  Video,
  Play,
  Check,
  Upload,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MediaUploader from "@/components/profile/MediaUploader";

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

interface CapsuleMediaPickerProps {
  userId: string;
  onSelect: (mediaFile: MediaFile) => void;
  selectedMedia?: MediaFile[];
  maxSelections?: number;
  allowUpload?: boolean;
}

export default function CapsuleMediaPicker({ 
  userId, 
  onSelect, 
  selectedMedia = [],
  maxSelections = 5,
  allowUpload = true
}: CapsuleMediaPickerProps) {
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  // Fetch user's media files using our existing API
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['/api/profile', userId, 'media'],
    enabled: !!userId
  });
  
  const mediaFiles = (response as any)?.media || [];

  const isSelected = (media: MediaFile) => {
    return selectedMedia.some(selected => selected.id === media.id);
  };

  const handleMediaSelect = (media: MediaFile) => {
    if (isSelected(media)) {
      // Already selected, remove from selection
      return;
    }

    if (selectedMedia.length >= maxSelections) {
      toast({
        title: "Selection Limit Reached",
        description: `You can only select up to ${maxSelections} media files.`,
        variant: "destructive"
      });
      return;
    }

    onSelect(media);
  };

  const renderMediaPreview = (media: MediaFile) => {
    const isVideo = media.type === 'video' || media.mimeType.startsWith('video/');
    const isImage = media.type === 'image' || media.mimeType.startsWith('image/');
    const selected = isSelected(media);

    return (
      <div 
        key={media.id}
        className={`
          relative cursor-pointer rounded-lg overflow-hidden transition-all
          ${selected 
            ? 'ring-2 ring-cyan-400 bg-cyan-400/10' 
            : 'hover:ring-2 hover:ring-gray-400 bg-gray-100 dark:bg-gray-800'
          }
        `}
        onClick={() => handleMediaSelect(media)}
        data-testid={`media-picker-item-${media.id}`}
      >
        <div className="aspect-square relative">
          {isImage ? (
            <img
              src={media.url}
              alt={media.title}
              className="w-full h-full object-cover"
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

          {/* Selection overlay */}
          {selected && (
            <div className="absolute inset-0 bg-cyan-400/20 flex items-center justify-center">
              <div className="bg-cyan-400 rounded-full p-2">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Media type badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {media.type}
            </Badge>
          </div>
        </div>

        {/* Media info */}
        <div className="p-2">
          <p className="text-sm font-medium truncate" data-testid={`text-media-title-${media.id}`}>
            {media.title}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {media.originalName}
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
      description: "Your media files are now available for selection.",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Select Media for Capsule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <span>Select Media for Capsule</span>
            {selectedMedia.length > 0 && (
              <Badge variant="outline">
                {selectedMedia.length} / {maxSelections} selected
              </Badge>
            )}
          </CardTitle>
          {allowUpload && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowUploader(true)}
              data-testid="button-open-media-uploader"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {mediaFiles.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No media files available
            </h3>
            <p className="text-gray-500 mb-4">
              Upload your first photo or video to add to capsules
            </p>
            {allowUpload && (
              <Button 
                onClick={() => setShowUploader(true)}
                data-testid="button-upload-first-media-capsule"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mediaFiles.map((media: MediaFile) => renderMediaPreview(media))}
          </div>
        )}

        {/* Selected Media Summary */}
        {selectedMedia.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Selected Media:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedMedia.map((media) => (
                <Badge key={media.id} variant="secondary" className="text-xs">
                  {media.title}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Media Uploader Modal */}
        {showUploader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Media for Capsules</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploader(false)}
                  data-testid="button-close-media-uploader"
                >
                  <X className="w-4 h-4" />
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
      </CardContent>
    </Card>
  );
}