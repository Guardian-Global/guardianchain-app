import { Eye, Tag, Star, Target, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface CapsuleData {
  title: string;
  blocks: Array<{ id: number; type: string; content: string }>;
  metadata: {
    category: string;
    tags: string[];
    griefScore: number;
    credibilityScore: number;
  };
}

interface MetadataPreviewProps {
  capsuleData: CapsuleData;
}

export default function MetadataPreview({ capsuleData }: MetadataPreviewProps) {
  const categories = [
    'Technology', 'Legal', 'Health', 'Environment', 'Economics', 'Politics', 'Research', 'General'
  ];

  const getContentLength = () => {
    return capsuleData.blocks.reduce((total, block) => total + block.content.length, 0);
  };

  const getEstimatedGriefScore = () => {
    const contentLength = getContentLength();
    const hasTitle = capsuleData.title.length > 0;
    const hasMultipleBlocks = capsuleData.blocks.length > 1;
    const hasCategory = capsuleData.metadata.category !== 'general';
    
    let score = 50; // Base score
    if (contentLength > 100) score += 10;
    if (contentLength > 500) score += 10;
    if (hasTitle) score += 10;
    if (hasMultipleBlocks) score += 5;
    if (hasCategory) score += 5;
    if (capsuleData.metadata.tags.length > 0) score += 5;
    
    return Math.min(score, 100);
  };

  const getEstimatedCredibility = () => {
    const contentLength = getContentLength();
    const hasVerification = capsuleData.blocks.some(block => block.type === 'seal');
    const hasEvidence = capsuleData.blocks.some(block => block.type === 'image' || block.type === 'link');
    
    let score = 60; // Base score
    if (contentLength > 200) score += 10;
    if (hasVerification) score += 20;
    if (hasEvidence) score += 10;
    
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Eye className="h-5 w-5 text-blue-400" />
          </div>
          <span className="text-white">Metadata Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview Card */}
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
          <div className="space-y-3">
            <div>
              <h3 className="text-white font-semibold text-lg">
                {capsuleData.title || 'Untitled Capsule'}
              </h3>
              <p className="text-slate-400 text-sm">
                {getContentLength()} characters • {capsuleData.blocks.length} blocks
              </p>
            </div>
            
            {capsuleData.metadata.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" />
                <Badge className="bg-blue-600 text-white">
                  {capsuleData.metadata.category}
                </Badge>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(getEstimatedGriefScore())}`}>
                  {getEstimatedGriefScore()}
                </div>
                <div className="text-xs text-slate-400">Grief Score</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(getEstimatedCredibility())}`}>
                  {getEstimatedCredibility()}
                </div>
                <div className="text-xs text-slate-400">Credibility</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Category</label>
          <Select value={capsuleData.metadata.category} onValueChange={() => {}}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Tags</label>
          <Input
            type="text"
            placeholder="Add tags (comma separated)"
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
          <div className="flex flex-wrap gap-1">
            {['truth', 'verified', 'important'].map(tag => (
              <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Scoring Details */}
        <div className="bg-slate-700/20 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            Quality Metrics
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Content Length</span>
              <span className={getContentLength() > 100 ? 'text-green-400' : 'text-yellow-400'}>
                {getContentLength() > 100 ? 'Good' : 'Needs More'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Has Title</span>
              <span className={capsuleData.title ? 'text-green-400' : 'text-red-400'}>
                {capsuleData.title ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Multiple Blocks</span>
              <span className={capsuleData.blocks.length > 1 ? 'text-green-400' : 'text-yellow-400'}>
                {capsuleData.blocks.length > 1 ? 'Yes' : 'Single Block'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Verification Seal</span>
              <span className={capsuleData.blocks.some(b => b.type === 'seal') ? 'text-green-400' : 'text-slate-400'}>
                {capsuleData.blocks.some(b => b.type === 'seal') ? 'Added' : 'Not Added'}
              </span>
            </div>
          </div>
        </div>

        {/* NFT Metadata */}
        <div className="bg-slate-700/20 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-400" />
            NFT Attributes
          </h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-600/50 rounded p-2">
              <div className="text-slate-400">Type</div>
              <div className="text-white">Truth Capsule</div>
            </div>
            <div className="bg-slate-600/50 rounded p-2">
              <div className="text-slate-400">Rarity</div>
              <div className="text-white">
                {getEstimatedGriefScore() > 90 ? 'Legendary' : 
                 getEstimatedGriefScore() > 75 ? 'Rare' : 'Common'}
              </div>
            </div>
            <div className="bg-slate-600/50 rounded p-2">
              <div className="text-slate-400">Blocks</div>
              <div className="text-white">{capsuleData.blocks.length}</div>
            </div>
            <div className="bg-slate-600/50 rounded p-2">
              <div className="text-slate-400">Created</div>
              <div className="text-white">Just Now</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}