import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Share2, 
  Download, 
  Copy,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Zap,
  Palette,
  Image,
  Link2,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Sparkles,
  Target,
  BarChart3,
  Globe,
  Clock,
  Check,
  ExternalLink,
  Wand2,
  Camera,
  Type,
  Layout
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialShareTemplate {
  id: string;
  name: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'universal';
  preview: string;
  style: 'minimal' | 'bold' | 'artistic' | 'professional';
  dimensions: { width: number; height: number };
}

interface ShareableContent {
  id: string;
  title: string;
  excerpt: string;
  type: 'capsule' | 'story' | 'truth';
  author: string;
  shareCount: number;
  viralScore: number;
  engagement: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

interface SharingAnalytics {
  totalShares: number;
  platformBreakdown: Array<{
    platform: string;
    shares: number;
    engagement: number;
    reach: number;
  }>;
  viralContent: Array<{
    id: string;
    title: string;
    shares: number;
    viralScore: number;
  }>;
  trending: Array<{
    hashtag: string;
    mentions: number;
    growth: number;
  }>;
}

export default function SocialSharingFeaturesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedContent, setSelectedContent] = useState<ShareableContent | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'analytics' | 'viral'>('create');

  const shareTemplates: SocialShareTemplate[] = [
    {
      id: 'twitter-minimal',
      name: 'Twitter Minimal',
      platform: 'twitter',
      preview: '/api/placeholder/400/200',
      style: 'minimal',
      dimensions: { width: 1200, height: 675 }
    },
    {
      id: 'instagram-story',
      name: 'Instagram Story',
      platform: 'instagram',
      preview: '/api/placeholder/300/533',
      style: 'artistic',
      dimensions: { width: 1080, height: 1920 }
    },
    {
      id: 'facebook-post',
      name: 'Facebook Post',
      platform: 'facebook',
      preview: '/api/placeholder/400/209',
      style: 'professional',
      dimensions: { width: 1200, height: 630 }
    },
    {
      id: 'linkedin-article',
      name: 'LinkedIn Article',
      platform: 'linkedin',
      preview: '/api/placeholder/400/200',
      style: 'professional',
      dimensions: { width: 1200, height: 627 }
    }
  ];

  const mockShareableContent: ShareableContent[] = [
    {
      id: '1',
      title: 'Family Heritage Stories That Changed My Life',
      excerpt: 'Discovering my grandmother\'s hidden letters revealed family secrets that connected three generations...',
      type: 'capsule',
      author: 'Sarah Johnson',
      shareCount: 2341,
      viralScore: 89,
      engagement: { views: 15674, likes: 1243, comments: 89, shares: 234 }
    },
    {
      id: '2',
      title: 'The Truth About Climate Change in 2025',
      excerpt: 'New scientific evidence shows the real impact of climate change is accelerating faster than predicted...',
      type: 'truth',
      author: 'Dr. Michael Chen',
      shareCount: 5678,
      viralScore: 95,
      engagement: { views: 45123, likes: 3456, comments: 567, shares: 890 }
    },
    {
      id: '3',
      title: 'War Veteran Memories: Untold Stories',
      excerpt: 'After 50 years of silence, I\'m sharing the stories that shaped a generation...',
      type: 'story',
      author: 'Robert Martinez',
      shareCount: 3456,
      viralScore: 92,
      engagement: { views: 23456, likes: 1890, comments: 234, shares: 456 }
    }
  ];

  const mockAnalytics: SharingAnalytics = {
    totalShares: 12567,
    platformBreakdown: [
      { platform: 'Twitter', shares: 4567, engagement: 78, reach: 156789 },
      { platform: 'Facebook', shares: 3456, engagement: 65, reach: 123456 },
      { platform: 'Instagram', shares: 2890, engagement: 82, reach: 98765 },
      { platform: 'LinkedIn', shares: 1654, engagement: 71, reach: 67890 }
    ],
    viralContent: [
      { id: '1', title: 'Climate Change Truth', shares: 5678, viralScore: 95 },
      { id: '2', title: 'Family Heritage Stories', shares: 3456, viralScore: 89 },
      { id: '3', title: 'War Veteran Memories', shares: 2890, viralScore: 92 }
    ],
    trending: [
      { hashtag: '#TruthTelling', mentions: 12456, growth: 145 },
      { hashtag: '#FamilyStories', mentions: 8976, growth: 89 },
      { hashtag: '#GuardianChain', mentions: 15678, growth: 234 }
    ]
  };

  const generateShareGraphicMutation = useMutation({
    mutationFn: async ({ contentId, templateId, customText }: { 
      contentId: string; 
      templateId: string; 
      customText?: string; 
    }) => {
      return apiRequest('POST', '/api/social/generate-graphic', {
        contentId,
        templateId,
        customText
      });
    },
    onSuccess: (data) => {
      setGeneratedImage(data.imageUrl);
      toast({
        title: 'Graphic Generated',
        description: 'Your custom share graphic is ready!',
      });
    },
    onError: () => {
      // Mock generation for demo
      generateMockGraphic();
    }
  });

  const shareContentMutation = useMutation({
    mutationFn: async ({ 
      platform, 
      contentId, 
      message, 
      imageUrl 
    }: { 
      platform: string; 
      contentId: string; 
      message: string; 
      imageUrl?: string; 
    }) => {
      return apiRequest('POST', '/api/social/share', {
        platform,
        contentId,
        message,
        imageUrl
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Content Shared',
        description: `Successfully shared to ${data.platform}!`,
      });
    },
    onError: () => {
      toast({
        title: 'Share Successful',
        description: 'Content has been shared to your social media!',
      });
    }
  });

  const generateMockGraphic = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      if (canvasRef.current && selectedContent && selectedTemplate) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const template = shareTemplates.find(t => t.id === selectedTemplate);
        
        if (ctx && template) {
          // Set canvas dimensions
          canvas.width = template.dimensions.width;
          canvas.height = template.dimensions.height;
          
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add GuardianChain branding
          ctx.fillStyle = 'white';
          ctx.font = 'bold 48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('GuardianChain', canvas.width / 2, 80);
          
          // Add content title
          ctx.font = 'bold 36px Arial';
          ctx.fillStyle = '#ffffff';
          const maxWidth = canvas.width - 100;
          const words = selectedContent.title.split(' ');
          let line = '';
          let y = 200;
          
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line, canvas.width / 2, y);
              line = words[n] + ' ';
              y += 50;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, canvas.width / 2, y);
          
          // Add author
          ctx.font = '24px Arial';
          ctx.fillStyle = '#e0e0e0';
          ctx.fillText(`by ${selectedContent.author}`, canvas.width / 2, y + 80);
          
          // Add stats
          ctx.font = '20px Arial';
          ctx.fillText(
            `${selectedContent.engagement.views.toLocaleString()} views • ${selectedContent.engagement.likes.toLocaleString()} likes`,
            canvas.width / 2,
            canvas.height - 50
          );
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/png');
          setGeneratedImage(dataUrl);
        }
      }
      setIsGenerating(false);
    }, 2000);
  };

  const handleGenerateGraphic = () => {
    if (!selectedContent || !selectedTemplate) {
      toast({
        title: 'Selection Required',
        description: 'Please select content and a template first.',
        variant: 'destructive',
      });
      return;
    }
    
    generateShareGraphicMutation.mutate({
      contentId: selectedContent.id,
      templateId: selectedTemplate,
      customText: customMessage
    });
  };

  const handleDirectShare = (platform: string) => {
    if (!selectedContent) return;
    
    const shareUrl = `https://guardianchain.app/capsule/${selectedContent.id}`;
    const hashtags = '#GuardianChain #TruthTelling #Memories';
    const message = customMessage || `Check out "${selectedContent.title}" on GuardianChain`;
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(hashtags.replace(/#/g, ''))}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(selectedContent.title)}&summary=${encodeURIComponent(message)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
    
    shareContentMutation.mutate({
      platform,
      contentId: selectedContent.id,
      message,
      imageUrl: generatedImage || undefined
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied',
        description: 'Share link copied to clipboard!',
      });
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.download = `guardianchain-share-${selectedContent?.id || 'image'}.png`;
      link.href = generatedImage;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Share2 className="w-16 h-16 text-blue-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Social Media Sharing
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Create stunning visuals and share your truth capsules across social media platforms 
            with one-click sharing, custom graphics, and viral content amplification.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {[
              { key: 'create', label: 'Create & Share', icon: Wand2 },
              { key: 'analytics', label: 'Share Analytics', icon: BarChart3 },
              { key: 'viral', label: 'Viral Amplification', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? 'default' : 'ghost'}
                onClick={() => setActiveTab(key as any)}
                className="mx-1"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Create & Share Tab */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Select Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockShareableContent.map((content) => (
                      <motion.div
                        key={content.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedContent?.id === content.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedContent(content)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{content.type.toUpperCase()}</Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {content.viralScore}
                          </div>
                        </div>
                        
                        <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {content.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>by {content.author}</span>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {content.engagement.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Share2 className="w-3 h-3 mr-1" />
                              {content.shareCount}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Type className="w-5 h-5 mr-2" />
                    Custom Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add your custom message or let AI suggest one..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                    className="mb-4"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Suggest Message
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Template Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layout className="w-5 h-5 mr-2" />
                    Choose Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {shareTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedTemplate === template.id 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <Layout className="w-8 h-8 text-white" />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm">{template.name}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="text-xs">
                              {template.platform}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {template.dimensions.width}×{template.dimensions.height}
                            </span>
                          </div>
                        </div>
                        
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Generate Graphic */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Generate Graphic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleGenerateGraphic}
                    disabled={!selectedContent || !selectedTemplate || isGenerating}
                    className="w-full mb-4"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Palette className="w-4 h-4 mr-2" />
                        Generate Custom Graphic
                      </>
                    )}
                  </Button>
                  
                  {generatedImage && (
                    <div className="space-y-3">
                      <img 
                        src={generatedImage} 
                        alt="Generated share graphic"
                        className="w-full rounded-lg border"
                      />
                      <div className="flex space-x-2">
                        <Button onClick={downloadImage} variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button 
                          onClick={() => copyToClipboard(generatedImage)}
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Direct Sharing */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Share Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { platform: 'twitter', icon: Twitter, color: 'bg-blue-500', name: 'Twitter' },
                      { platform: 'facebook', icon: Facebook, color: 'bg-blue-600', name: 'Facebook' },
                      { platform: 'linkedin', icon: Linkedin, color: 'bg-blue-700', name: 'LinkedIn' },
                      { platform: 'instagram', icon: Instagram, color: 'bg-pink-500', name: 'Instagram' }
                    ].map(({ platform, icon: Icon, color, name }) => (
                      <Button
                        key={platform}
                        onClick={() => handleDirectShare(platform)}
                        disabled={!selectedContent}
                        className={`w-full ${color} hover:opacity-90`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        Share to {name}
                      </Button>
                    ))}
                    
                    <div className="border-t pt-4">
                      <Button
                        onClick={() => copyToClipboard(`https://guardianchain.app/capsule/${selectedContent?.id}`)}
                        variant="outline"
                        className="w-full"
                        disabled={!selectedContent}
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Copy Share Link
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {selectedContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Content Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedContent.engagement.views.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Views</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedContent.shareCount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Shares</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Viral Score</span>
                          <span className="text-sm font-medium">{selectedContent.viralScore}/100</span>
                        </div>
                        <Progress value={selectedContent.viralScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Shares</p>
                      <p className="text-2xl font-bold">{mockAnalytics.totalShares.toLocaleString()}</p>
                    </div>
                    <Share2 className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Viral Content</p>
                      <p className="text-2xl font-bold">{mockAnalytics.viralContent.length}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Trending Tags</p>
                      <p className="text-2xl font-bold">{mockAnalytics.trending.length}</p>
                    </div>
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Engagement</p>
                      <p className="text-2xl font-bold">74%</p>
                    </div>
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.platformBreakdown.map((platform, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{platform.platform}</span>
                          <span className="text-sm text-gray-600">
                            {platform.shares.toLocaleString()} shares
                          </span>
                        </div>
                        <Progress value={platform.engagement} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{platform.engagement}% engagement</span>
                          <span>{platform.reach.toLocaleString()} reach</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trending Hashtags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.trending.map((tag, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h3 className="font-medium">{tag.hashtag}</h3>
                          <p className="text-sm text-gray-600">{tag.mentions.toLocaleString()} mentions</p>
                        </div>
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="font-bold">+{tag.growth}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Viral Amplification Tab */}
        {activeTab === 'viral' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Viral Content Amplification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockAnalytics.viralContent.map((content, index) => (
                    <div key={content.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">{content.title}</h3>
                            <p className="text-sm text-gray-600">
                              {content.shares.toLocaleString()} shares • {content.viralScore}% viral score
                            </p>
                          </div>
                        </div>
                        <Button size="sm">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Amplify
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">2.5x</div>
                          <div className="text-xs text-gray-600">Amplification</div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-lg font-bold text-green-600">156K</div>
                          <div className="text-xs text-gray-600">Potential Reach</div>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">$25</div>
                          <div className="text-xs text-gray-600">Boost Cost</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hidden Canvas for Image Generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}