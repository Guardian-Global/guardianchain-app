import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  Copy, 
  Star,
  ZoomIn
} from "lucide-react";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { useToast } from "@/hooks/use-toast";

interface SupabaseImageGalleryProps {
  category?: string;
  maxImages?: number;
  showControls?: boolean;
  gridCols?: 2 | 3 | 4;
  className?: string;
}

export function SupabaseImageGallery({
  category,
  maxImages = 12,
  showControls = true,
  gridCols = 3,
  className = ""
}: SupabaseImageGalleryProps) {
  const { getAssetsByType, getAssetsByCategory, isLoading } = useSupabaseAssets();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Get images based on category or all images
  const allImages = category 
    ? getAssetsByCategory(category)
    : getAssetsByType("image");
  
  const images = allImages.slice(0, maxImages);

  const copyImageUrl = async (asset: any) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      toast({
        title: "URL Copied",
        description: `Image URL copied: ${asset.name}`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadImage = (asset: any) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-400 border-t-transparent mx-auto mb-2"></div>
          <p className="text-slate-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">No images found in Supabase storage</p>
          {category && (
            <p className="text-sm text-slate-500 mt-2">
              Category: {category}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  const gridColsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Images` : 'Image Gallery'}
          </h3>
          <p className="text-slate-400">{images.length} images from Supabase storage</p>
        </div>
        {showControls && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-slate-300">
              High Value Assets
            </Badge>
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className={`grid ${gridColsClass[gridCols]} gap-4`}>
        {images.map((image, index) => (
          <Card key={image.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors group">
            <CardContent className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedImage(image)}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
                        <div className="relative">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-auto max-h-[80vh] object-contain"
                          />
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <Button size="sm" onClick={() => copyImageUrl(image)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => downloadImage(image)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      size="sm" 
                      variant="secondary"
                      onClick={() => copyImageUrl(image)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(image.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Value Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-600 text-white flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>{image.value}</span>
                  </Badge>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white truncate" title={image.name}>
                    {image.name}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {image.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{(image.size / 1024).toFixed(1)}KB</span>
                  <span>{image.type.toUpperCase()}</span>
                </div>

                {showControls && (
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyImageUrl(image)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage(image)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {allImages.length > maxImages && (
        <div className="text-center">
          <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
            View All {allImages.length} Images
          </Button>
        </div>
      )}
    </div>
  );
}

export default SupabaseImageGallery;