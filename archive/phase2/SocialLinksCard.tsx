import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Plus, 
  X, 
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  verified: boolean;
}

interface SocialLinksCardProps {
  userId: string;
  socialLinks?: SocialLink[];
  isOwner?: boolean;
}

export default function SocialLinksCard({ 
  userId, 
  socialLinks = [], 
  isOwner = false 
}: SocialLinksCardProps) {
  const [links, setLinks] = useState<SocialLink[]>(socialLinks);
  const [isEditing, setIsEditing] = useState(false);
  const [newLink, setNewLink] = useState({ platform: "", url: "" });
  const { toast } = useToast();

  const platformIcons = {
    twitter: "🐦",
    github: "🐙", 
    linkedin: "💼",
    website: "🌐",
    youtube: "📺",
    instagram: "📷",
    discord: "🎮",
    telegram: "✈️"
  };

  const addLink = () => {
    if (!newLink.platform.trim() || !newLink.url.trim()) {
      toast({
        title: "Invalid Link",
        description: "Please provide both platform and URL",
        variant: "destructive",
      });
      return;
    }

    const newSocialLink: SocialLink = {
      id: `link-${Date.now()}`,
      platform: newLink.platform.toLowerCase(),
      url: newLink.url,
      verified: false,
    };

    setLinks([...links, newSocialLink]);
    setNewLink({ platform: "", url: "" });
    
    toast({
      title: "Link Added",
      description: "Social link has been added to your profile",
    });
  };

  const removeLink = (linkId: string) => {
    setLinks(links.filter(link => link.id !== linkId));
    toast({
      title: "Link Removed",
      description: "Social link has been removed from your profile",
    });
  };

  const saveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your social links have been saved",
    });
  };

  const getPlatformIcon = (platform: string) => {
    return platformIcons[platform.toLowerCase() as keyof typeof platformIcons] || "🔗";
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-accent" />
            Social Links
          </CardTitle>
          
          {isOwner && (
            <div className="flex gap-2">
              {isEditing ? (
                <Button
                  onClick={saveChanges}
                  size="sm"
                  className="bg-brand-primary hover:bg-brand-primary/80"
                  data-testid="button-save-social-links"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-brand-light/20 hover:bg-brand-light/10 text-brand-light"
                  data-testid="button-edit-social-links"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {links.length === 0 && !isEditing ? (
          <div className="text-center py-6">
            <Globe className="w-8 h-8 text-brand-light/30 mx-auto mb-3" />
            <p className="text-brand-light/60 text-sm">
              {isOwner ? "Add your social links to connect with others" : "No social links added yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 bg-brand-surface border border-brand-light/10 rounded-lg"
                data-testid={`social-link-${index}`}
              >
                <div className="text-lg">
                  {getPlatformIcon(link.platform)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-brand-light capitalize">
                      {link.platform}
                    </span>
                    {link.verified ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-accent hover:text-brand-accent/80 truncate block"
                  >
                    {link.url}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-brand-light/10"
                    data-testid={`button-visit-${link.platform}`}
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>

                  {isOwner && isEditing && (
                    <Button
                      onClick={() => removeLink(link.id)}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-500/20 text-red-400"
                      data-testid={`button-remove-${link.platform}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isOwner && isEditing && (
          <div className="space-y-3 border-t border-brand-light/10 pt-4">
            <h4 className="text-sm font-medium text-brand-light">Add New Link</h4>
            
            <div className="space-y-2">
              <Input
                value={newLink.platform}
                onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                placeholder="Platform (e.g. twitter, github, website)"
                className="bg-brand-surface border-brand-light/20 text-brand-light"
                data-testid="input-platform"
              />
              
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://..."
                className="bg-brand-surface border-brand-light/20 text-brand-light"
                data-testid="input-url"
              />
            </div>

            <Button
              onClick={addLink}
              size="sm"
              className="bg-brand-primary hover:bg-brand-primary/80 w-full"
              disabled={!newLink.platform.trim() || !isValidUrl(newLink.url)}
              data-testid="button-add-link"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add Link
            </Button>
          </div>
        )}

        {links.length > 0 && !isOwner && (
          <div className="text-center pt-2">
            <p className="text-xs text-brand-light/50">
              {links.filter(l => l.verified).length} of {links.length} links verified
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}