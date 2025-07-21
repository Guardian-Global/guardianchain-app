import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Share2, Twitter, MessageCircle, Linkedin, Instagram, Facebook, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareTemplate {
  platform: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  template: string;
  hashtags: string[];
  characterLimit: number;
}

export default function OneClickSocialMediaShare() {
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('launch');

  const shareTemplates = {
    launch: {
      title: '🚀 GTT Token Launch',
      message: 'The future of truth verification is here! Guardian Truth Token (GTT) is now live across all major networks. Join the revolution in decentralized truth verification.',
      url: 'https://guardianchain.app/token-launch',
      hashtags: ['GTT', 'TruthToken', 'DeFi', 'Blockchain', 'GuardianChain']
    },
    milestone: {
      title: '🎯 Major Milestone Achieved',
      message: 'GTT Token just hit another major milestone! Over $50M in liquidity across 12 networks. The truth economy is growing exponentially.',
      url: 'https://guardianchain.app/analytics',
      hashtags: ['GTTMilestone', 'DeFi', 'TruthEconomy', 'Blockchain']
    },
    partnership: {
      title: '🤝 Strategic Partnership',
      message: 'Exciting partnership announcement! GTT Token is expanding its reach with new integrations. The truth verification ecosystem grows stronger.',
      url: 'https://guardianchain.app/partnerships',
      hashtags: ['Partnership', 'GTT', 'Collaboration', 'Innovation']
    }
  };

  const platforms: ShareTemplate[] = [
    {
      platform: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500 hover:bg-blue-600',
      template: '{message} {url} {hashtags}',
      hashtags: ['GTT', 'TruthToken', 'DeFi'],
      characterLimit: 280
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      template: '{message}\n\nLearn more: {url}\n\n{hashtags}',
      hashtags: ['GTT', 'Blockchain', 'Innovation'],
      characterLimit: 3000
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      template: '{message}\n\n{url}\n\n{hashtags}',
      hashtags: ['GTT', 'TruthVerification', 'DeFi'],
      characterLimit: 63206
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      template: '{message}\n\nLink in bio!\n\n{hashtags}',
      hashtags: ['GTT', 'Truth', 'Blockchain', 'Innovation'],
      characterLimit: 2200
    },
    {
      platform: 'Discord',
      icon: MessageCircle,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      template: '**{title}**\n\n{message}\n\n{url}',
      hashtags: [],
      characterLimit: 2000
    }
  ];

  const generateShareContent = (platform: ShareTemplate, template: typeof shareTemplates.launch) => {
    const hashtags = platform.hashtags.map(tag => `#${tag}`).join(' ');
    
    let content = platform.template
      .replace('{title}', template.title)
      .replace('{message}', customMessage || template.message)
      .replace('{url}', template.url)
      .replace('{hashtags}', hashtags);

    // Trim to character limit if necessary
    if (content.length > platform.characterLimit) {
      const urlLength = template.url.length + 1; // +1 for space
      const hashtagLength = hashtags.length + 1; // +1 for space
      const maxMessageLength = platform.characterLimit - urlLength - hashtagLength - 10; // -10 for safety
      
      const trimmedMessage = (customMessage || template.message).substring(0, maxMessageLength) + '...';
      content = platform.template
        .replace('{title}', template.title)
        .replace('{message}', trimmedMessage)
        .replace('{url}', template.url)
        .replace('{hashtags}', hashtags);
    }

    return content;
  };

  const shareToSocial = (platform: ShareTemplate, template: typeof shareTemplates.launch) => {
    const content = generateShareContent(platform, template);
    const encodedContent = encodeURIComponent(content);
    const encodedUrl = encodeURIComponent(template.url);

    let shareUrl = '';

    switch (platform.platform) {
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodeURIComponent(content)}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(content)}`;
        break;
      case 'Instagram':
        // Instagram doesn't support direct sharing, copy to clipboard instead
        copyToClipboard(content);
        toast({
          title: "Copied to clipboard!",
          description: "Content copied for Instagram. Paste it in your Instagram post.",
        });
        return;
      case 'Discord':
        copyToClipboard(content);
        toast({
          title: "Copied to clipboard!",
          description: "Content copied for Discord. Paste it in your channel.",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      toast({
        title: "Opening share dialog",
        description: `Sharing GTT Token content on ${platform.platform}`,
      });
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard!",
        description: "Share content has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the content from the preview.",
        variant: "destructive"
      });
    }
  };

  const currentTemplate = shareTemplates[selectedTemplate as keyof typeof shareTemplates];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          One-Click Social Media Share for Blockchain Insights
        </CardTitle>
        <CardDescription>
          Share GTT Token updates across all major social platforms with optimized content for each channel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Content Template:</label>
          <div className="flex gap-2">
            {Object.entries(shareTemplates).map(([key, template]) => (
              <Button
                key={key}
                variant={selectedTemplate === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTemplate(key)}
              >
                {template.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Message (optional):</label>
          <Textarea
            placeholder={currentTemplate.message}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="min-h-20"
          />
          <div className="text-xs text-muted-foreground">
            Leave empty to use the default template message
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const content = generateShareContent(platform, currentTemplate);
            const isOverLimit = content.length > platform.characterLimit;

            return (
              <Card key={platform.platform} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <platform.icon className="w-4 h-4" />
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <Badge variant={isOverLimit ? 'destructive' : 'secondary'} className="text-xs">
                      {content.length}/{platform.characterLimit}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-20 overflow-y-auto">
                    {content}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className={`flex-1 text-white ${platform.color}`}
                      size="sm"
                      onClick={() => shareToSocial(platform, currentTemplate)}
                      disabled={isOverLimit}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(content)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Performance Analytics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-500">12.5k</div>
            <div className="text-xs text-muted-foreground">Total Shares</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-500">2.8M</div>
            <div className="text-xs text-muted-foreground">Impressions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-500">156k</div>
            <div className="text-xs text-muted-foreground">Engagements</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-500">4.2%</div>
            <div className="text-xs text-muted-foreground">CTR</div>
          </div>
        </div>

        {/* Auto-scheduling hint */}
        <div className="bg-muted p-3 rounded-lg">
          <div className="text-sm font-medium">💡 Pro Tip</div>
          <div className="text-xs text-muted-foreground mt-1">
            For maximum reach, share during peak hours: Twitter (9-10 AM, 7-9 PM), LinkedIn (7-8 AM, 5-6 PM), Instagram (11 AM-1 PM, 7-9 PM)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}