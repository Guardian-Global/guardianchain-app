import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Loader2, Wand2 } from 'lucide-react';

interface AIBackgroundEnhancerProps {
  originalImage: string;
  onEnhancedImage: (enhancedImageUrl: string) => void;
}

const BACKGROUND_STYLES = [
  { id: 'professional', name: 'Professional Office', description: 'Clean office environment with soft lighting' },
  { id: 'nature', name: 'Nature Landscape', description: 'Beautiful outdoor scenery with natural elements' },
  { id: 'abstract', name: 'Abstract Art', description: 'Creative abstract patterns and colors' },
  { id: 'gradient', name: 'Gradient Blur', description: 'Smooth gradient background with bokeh effect' },
  { id: 'futuristic', name: 'Cyberpunk', description: 'Neon lights and futuristic cityscape' },
  { id: 'minimal', name: 'Minimal Clean', description: 'Simple, clean background with subtle textures' },
];

export default function AIBackgroundEnhancer({ originalImage, onEnhancedImage }: AIBackgroundEnhancerProps) {
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEnhanceBackground = async () => {
    if (!originalImage) {
      toast({
        title: "No Image Selected",
        description: "Please select a profile image first",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);

    try {
      const selectedStyleData = BACKGROUND_STYLES.find(style => style.id === selectedStyle);
      const prompt = customPrompt || selectedStyleData?.description || 'professional background';

      const response = await fetch('/api/ai/enhance-profile-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          originalImageUrl: originalImage,
          backgroundStyle: selectedStyle,
          customPrompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Enhancement failed: ${response.status}`);
      }

      const { enhancedImageUrl } = await response.json();
      setEnhancedImage(enhancedImageUrl);
      
      toast({
        title: "Background Enhanced!",
        description: "Your profile picture background has been enhanced with AI",
      });

    } catch (error) {
      console.error('Background enhancement error:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance your profile picture background",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleUseEnhanced = () => {
    if (enhancedImage) {
      onEnhancedImage(enhancedImage);
      toast({
        title: "Profile Updated",
        description: "Your enhanced profile picture has been applied",
      });
    }
  };

  const handleDownload = () => {
    if (enhancedImage) {
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = 'enhanced-profile-picture.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center text-cyan-400">
          <Sparkles className="w-5 h-5 mr-2" />
          AI Background Enhancement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-200">Background Style</Label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {BACKGROUND_STYLES.map((style) => (
                    <SelectItem key={style.id} value={style.id} className="text-slate-200 focus:bg-slate-700">
                      <div className="space-y-1">
                        <div className="font-medium">{style.name}</div>
                        <div className="text-xs text-slate-400">{style.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Custom Enhancement Prompt</Label>
              <Textarea
                placeholder="Describe your ideal background (optional)"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-slate-200 min-h-[80px]"
                data-testid="textarea-custom-prompt"
              />
              <p className="text-xs text-slate-400">
                Leave empty to use the selected style's default description
              </p>
            </div>

            <Button
              onClick={handleEnhanceBackground}
              disabled={isEnhancing || !originalImage}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              data-testid="button-enhance-background"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing Background...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Enhance Background
                </>
              )}
            </Button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Label className="text-slate-200">Preview</Label>
            
            {/* Original Image */}
            <div className="space-y-2">
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                Original
              </Badge>
              {originalImage ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={originalImage}
                    alt="Original profile"
                    className="w-full h-full object-cover"
                    data-testid="img-original-preview"
                  />
                </div>
              ) : (
                <div className="w-full h-40 rounded-lg bg-slate-700/50 border border-slate-600 flex items-center justify-center">
                  <p className="text-slate-400">No image selected</p>
                </div>
              )}
            </div>

            {/* Enhanced Image */}
            {enhancedImage && (
              <div className="space-y-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                  AI Enhanced
                </Badge>
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-cyan-500">
                  <img
                    src={enhancedImage}
                    alt="Enhanced profile"
                    className="w-full h-full object-cover"
                    data-testid="img-enhanced-preview"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleUseEnhanced}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    data-testid="button-use-enhanced"
                  >
                    Use This Image
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="border-slate-600 text-slate-200 hover:bg-slate-700"
                    data-testid="button-download-enhanced"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}