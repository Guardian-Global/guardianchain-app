import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Image as ImageIcon, 
  Video, 
  Play, 
  Download, 
  Trash2,
  Grid3X3,
  List,
  Calendar,
  Eye
} from "lucide-react";

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title: string;
  uploadedAt: string;
  size?: number;
  duration?: number;
}

interface MediaGalleryProps {
  userId: string;
  onSelectMedia?: (media: MediaItem) => void;
  selectable?: boolean;
}

export default function MediaGallery({ userId, onSelectMedia, selectable = false }: MediaGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: mediaData, isLoading, refetch } = useQuery({
    queryKey: [`/api/profile/${userId}/media`],
    queryFn: async () => {
      const response = await fetch(`/api/profile/${userId}/media`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch media');
      return response.json();
    },
  });

  const media: MediaItem[] = mediaData?.media || [];

  const handleMediaClick = (item: MediaItem) => {
    if (selectable && onSelectMedia) {
      onSelectMedia(item);
    } else {
      setSelectedMedia(item);
      setPreviewOpen(true);
    }
  };

  const handleDelete = async (mediaId: string) => {
    try {
      const response = await fetch(`/api/profile/media/${mediaId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-brand-light/60">Loading media gallery...</p>
        </CardContent>
      </Card>
    );
  }

  if (media.length === 0) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <ImageIcon className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
          <p className="text-brand-light/60">No media uploaded yet</p>
          <p className="text-xs text-brand-light/40 mt-2">
            Upload photos and videos to see them here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-brand-light flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Media Gallery ({media.length})
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="px-2"
                data-testid="view-grid-button"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="px-2"
                data-testid="view-list-button"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border border-brand-light/10 hover:border-brand-accent/50 transition-all duration-200 ${
                    selectable ? 'hover:ring-2 hover:ring-brand-primary' : ''
                  }`}
                  onClick={() => handleMediaClick(item)}
                  data-testid={`media-item-${item.id}`}
                >
                  <div className="aspect-square bg-brand-dark">
                    {item.type === 'image' ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs truncate">{item.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        </Badge>
                        {!selectable && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="text-white hover:text-red-400 p-1 h-auto"
                            data-testid={`delete-media-${item.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 bg-brand-surface rounded-lg border border-brand-light/10 hover:border-brand-accent/50 transition-all duration-200 cursor-pointer ${
                    selectable ? 'hover:bg-brand-primary/10' : ''
                  }`}
                  onClick={() => handleMediaClick(item)}
                  data-testid={`media-list-item-${item.id}`}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-16 h-16 bg-brand-dark rounded overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <Play className="w-4 h-4 text-white absolute" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-light truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.type === 'image' ? (
                          <><ImageIcon className="w-3 h-3 mr-1" />Image</>
                        ) : (
                          <><Video className="w-3 h-3 mr-1" />Video</>
                        )}
                      </Badge>
                      <span className="text-xs text-brand-light/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.uploadedAt)}
                      </span>
                      {item.size && (
                        <span className="text-xs text-brand-light/60">
                          {formatFileSize(item.size)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!selectable && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.url, '_blank');
                        }}
                        className="text-brand-light/60 hover:text-brand-accent p-2"
                        data-testid={`download-media-${item.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-brand-light/60 hover:text-red-400 p-2"
                        data-testid={`delete-media-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl bg-brand-secondary border-brand-surface">
          <DialogHeader>
            <DialogTitle className="text-brand-light flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {selectedMedia?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMedia && (
            <div className="space-y-4">
              <div className="max-h-96 bg-brand-dark rounded-lg overflow-hidden">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-full"
                    data-testid="video-preview"
                  />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-brand-light/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedMedia.uploadedAt)}
                  </span>
                  {selectedMedia.size && (
                    <span>{formatFileSize(selectedMedia.size)}</span>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedMedia.url, '_blank')}
                  data-testid="download-preview-button"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}