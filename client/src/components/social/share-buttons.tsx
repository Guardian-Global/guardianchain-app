import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";

interface ShareButtonsProps {
  title: string;
  url: string;
  image?: string;
  description?: string;
  compact?: boolean;
}

export default function ShareButtons({ 
  title, 
  url, 
  image, 
  description,
  compact = false 
}: ShareButtonsProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const shareData = {
    title,
    text: description || title,
    url
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=GuardianChain,TruthVerification,Web3`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    
    setIsSharing(true);
    try {
      await navigator.share(shareData);
      toast({
        title: "Shared successfully!",
        description: "Truth capsule shared via native sharing."
      });
    } catch (error) {
      // User cancelled sharing or sharing failed
      console.log("Native sharing cancelled or failed");
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Capsule link copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const handleSocialShare = (platform: string, link: string) => {
    window.open(link, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {navigator.share && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleNativeShare}
            disabled={isSharing}
            className="border-slate-600 hover:border-blue-500 hover:text-blue-400"
          >
            <Share2 className="h-3 w-3" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopyLink}
          className="border-slate-600 hover:border-blue-500 hover:text-blue-400"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSocialShare('twitter', shareLinks.twitter)}
          className="border-slate-600 hover:border-blue-500 hover:text-blue-400"
        >
          <FaTwitter className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-slate-300 mb-2">Share this truth capsule</div>
      
      {/* Native Share (Mobile) */}
      {navigator.share && (
        <Button
          onClick={handleNativeShare}
          disabled={isSharing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {isSharing ? "Sharing..." : "Share"}
        </Button>
      )}

      {/* Social Media Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSocialShare('twitter', shareLinks.twitter)}
          className="border-slate-600 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
        >
          <FaTwitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSocialShare('facebook', shareLinks.facebook)}
          className="border-slate-600 hover:border-blue-600 hover:text-blue-400 hover:bg-blue-600/10"
        >
          <FaFacebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSocialShare('linkedin', shareLinks.linkedin)}
          className="border-slate-600 hover:border-blue-700 hover:text-blue-400 hover:bg-blue-700/10"
        >
          <FaLinkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSocialShare('whatsapp', shareLinks.whatsapp)}
          className="border-slate-600 hover:border-green-500 hover:text-green-400 hover:bg-green-500/10"
        >
          <FaWhatsapp className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </div>

      {/* Email and Copy Link */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSocialShare('email', shareLinks.email)}
          className="border-slate-600 hover:border-slate-400 hover:text-slate-300"
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="border-slate-600 hover:border-slate-400 hover:text-slate-300"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </div>
      
      <div className="text-xs text-slate-500 text-center">
        Share immutable truth • Powered by GuardianChain
      </div>
    </div>
  );
}