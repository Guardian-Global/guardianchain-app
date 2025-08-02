import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MediaUploader } from "./MediaUploader";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Coins, 
  Shield, 
  Eye,
  Trash2,
  Pin,
  MoreHorizontal,
  Play,
  Pause,
  Download,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface CapsuleVaultTimelineProps {
  userId: string;
  className?: string;
}

interface TimelineEntry {
  id: string;
  capsule: {
    id: string;
    title: string;
    content: string;
    mediaType?: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    nftTokenId?: string;
    isNftMinted: boolean;
    isTruthVaultSealed: boolean;
  };
  entryType: string;
  caption: string;
  visibility: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isPinned: boolean;
  createdAt: string;
}

export function CapsuleVaultTimeline({ userId, className }: CapsuleVaultTimelineProps) {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedEntryType, setSelectedEntryType] = useState("post");
  const queryClient = useQueryClient();

  const { data: timelineEntries = [], isLoading } = useQuery({
    queryKey: ["/api/vault/timeline", userId],
    queryFn: async () => {
      const response = await fetch(`/api/vault/timeline/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch timeline');
      return response.json();
    },
  });

  const createTimelineEntry = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/vault/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create timeline entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vault/timeline", userId] });
      setNewPostContent("");
    },
  });

  const mintAsNFT = useMutation({
    mutationFn: async (capsuleId: string) => {
      const response = await fetch(`/api/capsules/${capsuleId}/mint-nft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error('Failed to mint NFT');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vault/timeline", userId] });
    },
  });

  const sealInTruthVault = useMutation({
    mutationFn: async (capsuleId: string) => {
      const response = await fetch(`/api/capsules/${capsuleId}/seal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error('Failed to seal capsule');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vault/timeline", userId] });
    },
  });

  const handleMediaUpload = async (uploadedFiles: any[]) => {
    if (uploadedFiles.length === 0) return;

    const file = uploadedFiles[0];
    
    // Automatically create capsule from uploaded media
    const capsuleData = {
      title: `Media Upload - ${file.name}`,
      content: newPostContent || `Uploaded ${file.type} file`,
      mediaType: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
      mediaUrl: file.url,
      fileName: file.name,
      fileSize: file.size,
      capsuleType: "personal_testimony",
      autoMintEnabled: true,
    };

    try {
      const response = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capsuleData),
      });
      
      if (!response.ok) throw new Error('Failed to create capsule');
      const capsule = await response.json();

      // Create timeline entry
      await createTimelineEntry.mutateAsync({
        capsuleId: capsule.id,
        entryType: selectedEntryType,
        caption: newPostContent,
        visibility: "public",
      });
    } catch (error) {
      console.error("Error creating capsule from media:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    // Create text-only capsule
    const capsuleData = {
      title: `Timeline Post - ${new Date().toISOString()}`,
      content: newPostContent,
      capsuleType: "personal_testimony",
    };

    try {
      const response = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capsuleData),
      });
      
      if (!response.ok) throw new Error('Failed to create capsule');
      const capsule = await response.json();

      await createTimelineEntry.mutateAsync({
        capsuleId: capsule.id,
        entryType: selectedEntryType,
        caption: newPostContent,
        visibility: "public",
      });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const getMediaDisplay = (entry: TimelineEntry) => {
    const { capsule } = entry;
    
    if (!capsule.mediaUrl) return null;

    if (capsule.mediaType === 'image') {
      return (
        <div className="relative group">
          <img 
            src={capsule.thumbnailUrl || capsule.mediaUrl} 
            alt={capsule.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          {capsule.isNftMinted && (
            <Badge className="absolute top-2 right-2 bg-purple-600">
              <Sparkles className="w-3 h-3 mr-1" />
              NFT
            </Badge>
          )}
        </div>
      );
    }

    if (capsule.mediaType === 'video') {
      return (
        <div className="relative group">
          <video 
            src={capsule.mediaUrl}
            poster={capsule.thumbnailUrl}
            controls
            className="w-full h-64 object-cover rounded-lg"
          />
          {capsule.isNftMinted && (
            <Badge className="absolute top-2 right-2 bg-purple-600">
              <Sparkles className="w-3 h-3 mr-1" />
              NFT
            </Badge>
          )}
        </div>
      );
    }

    return (
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span className="font-medium">{capsule.title}</span>
          {capsule.isNftMinted && (
            <Badge className="bg-purple-600">
              <Sparkles className="w-3 h-3 mr-1" />
              NFT
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Create Post Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Timeline Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your truth, upload media, or create a capsule..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={3}
          />
          
          <div className="flex items-center gap-2 flex-wrap">
            <MediaUploader
              uploadType="general"
              maxNumberOfFiles={5}
              onUploadComplete={handleMediaUpload}
              className="flex-1 min-w-fit"
            >
              Upload Media
            </MediaUploader>
            
            <Button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || createTimelineEntry.isPending}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Create Capsule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Entries */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : timelineEntries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No timeline entries yet</h3>
              <p className="text-muted-foreground">
                Start by creating your first capsule or uploading media to your vault.
              </p>
            </CardContent>
          </Card>
        ) : (
          timelineEntries.map((entry: TimelineEntry) => (
            <Card key={entry.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Entry Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{entry.capsule.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                    {entry.capsule.isTruthVaultSealed && (
                      <Badge variant="secondary">
                        <Shield className="w-3 h-3 mr-1" />
                        Sealed
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Caption */}
                {entry.caption && (
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    {entry.caption}
                  </p>
                )}

                {/* Media Display */}
                {getMediaDisplay(entry)}

                {/* Capsule Content */}
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="text-sm">{entry.capsule.content}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {entry.likesCount}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {entry.commentsCount}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share className="w-4 h-4" />
                      {entry.sharesCount}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {!entry.capsule.isNftMinted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => mintAsNFT.mutate(entry.capsule.id)}
                        disabled={mintAsNFT.isPending}
                        className="flex items-center gap-1"
                      >
                        <Coins className="w-3 h-3" />
                        Mint NFT
                      </Button>
                    )}
                    {!entry.capsule.isTruthVaultSealed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sealInTruthVault.mutate(entry.capsule.id)}
                        disabled={sealInTruthVault.isPending}
                        className="flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" />
                        Seal
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}