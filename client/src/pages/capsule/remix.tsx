import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Wand2, 
  Upload, 
  Music, 
  Image as ImageIcon, 
  Sparkles, 
  Share,
  Download,
  Palette,
  Volume2,
  Zap,
  Brain,
  Eye,
  Heart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CapsuleRemixPage() {
  const { id } = useParams<{ id: string }>();
  const [remixContent, setRemixContent] = useState('');
  const [remixTitle, setRemixTitle] = useState('');
  const [originalCapsule, setOriginalCapsule] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('cyberpunk');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [smriScore, setSmriScore] = useState(0);

  const remixStyles = [
    { id: 'cyberpunk', name: 'Cyberpunk', color: '#00ffe1', description: 'Neon-futuristic aesthetic' },
    { id: 'vintage', name: 'Vintage', color: '#ff6b35', description: 'Classic retro vibes' },
    { id: 'minimal', name: 'Minimal', color: '#6366f1', description: 'Clean and simple' },
    { id: 'dark', name: 'Dark Mode', color: '#8b5cf6', description: 'Deep and mysterious' },
    { id: 'ethereal', name: 'Ethereal', color: '#ff00d4', description: 'Dreamlike and surreal' },
    { id: 'industrial', name: 'Industrial', color: '#ef4444', description: 'Raw and powerful' }
  ];

  const emotionalTags = ['grief', 'joy', 'nostalgia', 'hope', 'wisdom', 'love', 'courage', 'peace'];

  useEffect(() => {
    // Simulate loading original capsule data
    if (id) {
      setOriginalCapsule({
        id,
        title: 'Original Memory Capsule',
        content: 'This is the original content that will be remixed with AI assistance.',
        author: 'Guardian User',
        timestamp: new Date().toISOString(),
        grieveScore: 7.2,
        verificationLevel: 'VERIFIED'
      });
    }
  }, [id]);

  const generateAIRemix = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation progress
    const progressSteps = [
      { value: 20, message: 'Analyzing original content...' },
      { value: 40, message: 'Generating AI variations...' },
      { value: 60, message: 'Applying style transformations...' },
      { value: 80, message: 'Computing SMRI score...' },
      { value: 100, message: 'Remix complete!' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step.value);
      
      if (step.value === 100) {
        const aiGeneratedContent = `[AI REMIX] Transform this memory through the lens of ${selectedStyle} aesthetics. 

Original essence preserved while enhancing emotional resonance through advanced pattern recognition and stylistic amplification. 

The core truth remains immutable while presentation evolves to match contemporary expression standards. Grief patterns analyzed and processed through our proprietary SMRI (Subjective Memory Resonance Index) for optimal emotional impact.

Generated variations include:
• Visual style transformation
• Emotional amplification markers  
• Narrative restructuring while preserving authenticity
• Enhanced metadata for improved discoverability

This remix maintains full lineage tracking to the original capsule while creating new pathways for engagement and community connection.`;

        setRemixContent(aiGeneratedContent);
        setRemixTitle(`Remix: ${originalCapsule?.title || 'Memory Capsule'}`);
        setSmriScore(Math.random() * 10);
        
        toast({
          title: "AI Remix Generated",
          description: "Your capsule has been enhanced with AI assistance",
        });
      }
    }

    setIsGenerating(false);
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      toast({
        title: "Audio Added",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const publishRemix = async () => {
    if (!remixContent.trim()) {
      toast({
        title: "Content Required",
        description: "Please add content to your remix before publishing",
        variant: "destructive"
      });
      return;
    }

    // Simulate publishing
    toast({
      title: "Remix Published",
      description: "Your remix has been sealed on the blockchain with full lineage tracking",
    });

    // Navigate back to capsule view
    window.location.href = `/capsule/${id}`;
  };

  if (!originalCapsule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) text-hsl(180,100%,90%)">
      {/* Header */}
      <div className="border-b border-hsl(217,33%,17%) bg-hsl(220,39%,11%)/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] bg-clip-text text-transparent">
                Remix Capsule
              </h1>
              <p className="text-hsl(180,100%,70%) mt-2">
                Transform memories with AI assistance while preserving original truth
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] text-black font-semibold">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Original Capsule Reference */}
          <div className="lg:col-span-1">
            <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%) sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#00ffe1] flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Original Capsule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#ff00d4] mb-2">{originalCapsule.title}</h3>
                  <p className="text-sm text-hsl(180,100%,70%) leading-relaxed">
                    {originalCapsule.content}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Author:</span>
                    <span className="text-[#00ffe1]">{originalCapsule.author}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Grief Score:</span>
                    <span className="text-[#ff00d4]">{originalCapsule.grieveScore}/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                      {originalCapsule.verificationLevel}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Remix Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-hsl(217,33%,17%)/50">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="publish">Publish</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                  <CardHeader>
                    <CardTitle className="text-[#00ffe1] flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Content Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="remix-title">Remix Title</Label>
                      <Input
                        id="remix-title"
                        value={remixTitle}
                        onChange={(e) => setRemixTitle(e.target.value)}
                        placeholder="Enter remix title..."
                        className="bg-hsl(220,39%,11%)/50 border-hsl(217,33%,24%)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remix-content">Remix Content</Label>
                      <Textarea
                        id="remix-content"
                        value={remixContent}
                        onChange={(e) => setRemixContent(e.target.value)}
                        placeholder="AI will generate enhanced content here, or write your own remix..."
                        className="min-h-[200px] bg-hsl(220,39%,11%)/50 border-hsl(217,33%,24%)"
                      />
                    </div>

                    {isGenerating && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Generating AI remix...</span>
                          <span>{generationProgress}%</span>
                        </div>
                        <Progress value={generationProgress} className="h-2" />
                      </div>
                    )}

                    <Button
                      onClick={generateAIRemix}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] hover:opacity-90 text-black font-semibold"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate AI Remix'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="space-y-6">
                <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                  <CardHeader>
                    <CardTitle className="text-[#ff00d4] flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Visual Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {remixStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedStyle === style.id
                              ? 'border-current'
                              : 'border-hsl(217,33%,24%) hover:border-hsl(217,33%,35%)'
                          }`}
                          style={{ borderColor: selectedStyle === style.id ? style.color : undefined }}
                        >
                          <div className="w-8 h-8 rounded-full mb-2 mx-auto" style={{ backgroundColor: style.color }} />
                          <div className="text-sm font-semibold" style={{ color: style.color }}>{style.name}</div>
                          <div className="text-xs text-hsl(180,100%,70%) mt-1">{style.description}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                  <CardHeader>
                    <CardTitle className="text-[#7c3aed] flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Emotional Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {emotionalTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#7c3aed]/20 border-[#7c3aed]/30 text-[#7c3aed]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                  <CardHeader>
                    <CardTitle className="text-[#00ffe1] flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Media Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Visual Assets
                        </Label>
                        <div className="border-2 border-dashed border-hsl(217,33%,24%) rounded-lg p-8 text-center hover:border-[#00ffe1]/50 transition-colors">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-hsl(180,100%,60%)" />
                          <p className="text-sm text-hsl(180,100%,70%)">
                            Drop images here or click to upload
                          </p>
                          <Button variant="outline" className="mt-4" size="sm">
                            Browse Files
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="flex items-center">
                          <Volume2 className="w-4 h-4 mr-2" />
                          Audio Soundtrack
                        </Label>
                        <div className="border-2 border-dashed border-hsl(217,33%,24%) rounded-lg p-8 text-center hover:border-[#ff00d4]/50 transition-colors">
                          <Music className="w-8 h-8 mx-auto mb-2 text-hsl(180,100%,60%)" />
                          <p className="text-sm text-hsl(180,100%,70%)">
                            {audioFile ? audioFile.name : 'Add background music'}
                          </p>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioUpload}
                            className="hidden"
                            id="audio-upload"
                          />
                          <Button variant="outline" className="mt-4" size="sm" asChild>
                            <label htmlFor="audio-upload" className="cursor-pointer">
                              {audioFile ? 'Change Audio' : 'Upload Audio'}
                            </label>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="publish" className="space-y-6">
                <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                  <CardHeader>
                    <CardTitle className="text-[#ff00d4] flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      SMRI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Subjective Memory Resonance Index</span>
                      <span className="text-2xl font-bold text-[#ff00d4]">{smriScore.toFixed(1)}/10</span>
                    </div>
                    <Progress value={smriScore * 10} className="h-3" />
                    <p className="text-sm text-hsl(180,100%,70%)">
                      Your remix shows strong emotional resonance and maintains authentic connection to the original memory.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-hsl(217,33%,17%)/50 to-hsl(220,39%,11%)/50 border-[#00ffe1]/30">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#00ffe1] mb-4">Ready to Publish?</h3>
                    <p className="text-hsl(180,100%,70%) mb-6">
                      Your remix will be sealed on the blockchain with full lineage tracking to the original capsule. 
                      This creates permanent provenance while enabling creative expression.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={publishRemix}
                        className="flex-1 bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] hover:opacity-90 text-black font-semibold"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Publish Remix
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}