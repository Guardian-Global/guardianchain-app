import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Plus, X, Twitter, Github, Globe, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  verified: boolean;
}

interface SocialLinksCardProps {
  profile: {
    id: string;
    socialLinks?: SocialLink[];
  };
}

export default function SocialLinksCard({ profile }: SocialLinksCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const socialLinks = profile.socialLinks || [];

  const addLinkMutation = useMutation({
    mutationFn: async ({ platform, url }: { platform: string; url: string }) => {
      return apiRequest("POST", `/api/profile/${profile.id}/social-links`, { platform, url });
    },
    onSuccess: () => {
      toast({
        title: "Link Added",
        description: "Social link has been added to your profile.",
      });
      setNewPlatform("");
      setNewUrl("");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${profile.id}`] });
    },
    onError: () => {
      toast({
        title: "Failed to Add Link",
        description: "Could not add social link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      return apiRequest("DELETE", `/api/profile/${profile.id}/social-links/${linkId}`);
    },
    onSuccess: () => {
      toast({
        title: "Link Removed",
        description: "Social link has been removed from your profile.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${profile.id}`] });
    },
    onError: () => {
      toast({
        title: "Failed to Remove Link",
        description: "Could not remove social link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "github":
        return <Github className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "text-blue-400 border-blue-500";
      case "github":
        return "text-gray-400 border-gray-500";
      case "email":
        return "text-green-400 border-green-500";
      default:
        return "text-brand-accent border-brand-accent";
    }
  };

  const handleAddLink = () => {
    if (!newPlatform.trim() || !newUrl.trim()) return;
    addLinkMutation.mutate({ platform: newPlatform, url: newUrl });
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface w-64">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-brand-accent" />
            Social Links
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-brand-light/60 hover:text-brand-light"
            data-testid="button-edit-social-links"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Existing Links */}
        {socialLinks.length === 0 && !isEditing && (
          <div className="text-center py-4">
            <p className="text-xs text-brand-light/60">No social links added</p>
          </div>
        )}

        {socialLinks.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-3 p-2 bg-brand-surface rounded border border-brand-light/10 hover:border-brand-light/20 transition-colors"
            data-testid={`social-link-${link.id}`}
          >
            <div className={`${getPlatformColor(link.platform)}`}>
              {getPlatformIcon(link.platform)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-brand-light capitalize">
                  {link.platform}
                </span>
                {link.verified && (
                  <Badge variant="outline" className="text-green-400 border-green-500 text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="text-xs text-brand-light/60 truncate">
                {link.url}
              </div>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(link.url, '_blank')}
                className="text-brand-light/60 hover:text-brand-light p-1"
                data-testid={`button-open-link-${link.id}`}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLinkMutation.mutate(link.id)}
                className="text-brand-light/60 hover:text-red-400 p-1"
                data-testid={`button-remove-link-${link.id}`}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Link Form */}
        {isEditing && (
          <div className="space-y-3 p-3 bg-brand-surface/50 rounded border border-brand-light/10">
            <div className="space-y-2">
              <Input
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                placeholder="Platform (e.g., Twitter, GitHub)"
                className="bg-brand-surface border-brand-light/20 text-brand-light text-sm"
                data-testid="input-social-platform"
              />
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="URL (https://...)"
                className="bg-brand-surface border-brand-light/20 text-brand-light text-sm"
                data-testid="input-social-url"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleAddLink}
                disabled={!newPlatform.trim() || !newUrl.trim() || addLinkMutation.isPending}
                size="sm"
                className="flex-1 bg-brand-primary hover:bg-brand-primary/80 text-xs"
                data-testid="button-save-social-link"
              >
                {addLinkMutation.isPending ? "Adding..." : "Add"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setNewPlatform("");
                  setNewUrl("");
                }}
                variant="outline"
                size="sm"
                className="border-brand-light/20 text-brand-light hover:bg-brand-light/10 text-xs"
                data-testid="button-cancel-social-link"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}