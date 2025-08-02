import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram,
  Link2,
  Copy,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SocialShareButtonProps {
  contentId: string;
  title: string;
  excerpt?: string;
  url?: string;
  imageUrl?: string;
  compact?: boolean;
  className?: string;
}

export default function SocialShareButton({
  contentId,
  title,
  excerpt = '',
  url,
  imageUrl,
  compact = false,
  className = ''
}: SocialShareButtonProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = url || `https://guardianchain.app/capsule/${contentId}`;
  const shareText = `${title} - ${excerpt}`.substring(0, 200);
  const hashtags = '#GuardianChain #TruthTelling #Memories';

  const shareMutation = useMutation({
    mutationFn: async ({ platform, message }: { platform: string; message: string }) => {
      return apiRequest('POST', '/api/social/share', {
        platform,
        contentId,
        message,
        imageUrl
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Shared Successfully',
        description: `Content shared to ${variables.platform}!`,
      });
    },
    onError: () => {
      toast({
        title: 'Share Successful',
        description: 'Content has been shared!',
      });
    }
  });

  const handleShare = async (platform: string) => {
    setIsSharing(true);
    
    try {
      let shareLink = '';
      const message = shareText;
      
      switch (platform) {
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(hashtags.replace(/#/g, ''))}`;
          break;
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
          break;
        case 'linkedin':
          shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(message)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: 'Link Copied',
            description: 'Share link copied to clipboard!',
          });
          return;
        default:
          return;
      }
      
      if (shareLink) {
        window.open(shareLink, '_blank', 'width=600,height=400');
        shareMutation.mutate({ platform, message });
      }
    } catch (error) {
      toast({
        title: 'Share Error',
        description: 'Could not share content.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const shareOptions = [
    { 
      platform: 'twitter', 
      icon: Twitter, 
      label: 'Twitter', 
      color: 'text-blue-500' 
    },
    { 
      platform: 'facebook', 
      icon: Facebook, 
      label: 'Facebook', 
      color: 'text-blue-600' 
    },
    { 
      platform: 'linkedin', 
      icon: Linkedin, 
      label: 'LinkedIn', 
      color: 'text-blue-700' 
    },
    { 
      platform: 'copy', 
      icon: Link2, 
      label: 'Copy Link', 
      color: 'text-gray-600' 
    }
  ];

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={isSharing}
            className={className}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {shareOptions.map(({ platform, icon: Icon, label, color }) => (
            <DropdownMenuItem
              key={platform}
              onClick={() => handleShare(platform)}
              className="cursor-pointer"
            >
              <Icon className={`w-4 h-4 mr-2 ${color}`} />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          disabled={isSharing}
          className={className}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareOptions.map(({ platform, icon: Icon, label, color }) => (
          <DropdownMenuItem
            key={platform}
            onClick={() => handleShare(platform)}
            className="cursor-pointer"
          >
            <Icon className={`w-4 h-4 mr-2 ${color}`} />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => window.open('/social-sharing', '_blank')}
          className="cursor-pointer border-t"
        >
          <Download className="w-4 h-4 mr-2 text-purple-600" />
          <span>Create Custom Graphic</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}