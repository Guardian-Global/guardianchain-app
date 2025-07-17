import { useState } from 'react';
import { Palette, Download, Share2, Sparkles, FileText, Shield, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import SealBadge from '@/components/SealBadge';

const SealStudio = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [sealType, setSealType] = useState('standard');
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const sealTypes = [
    { value: 'standard', label: 'Standard Verification', color: 'bg-blue-600' },
    { value: 'premium', label: 'Premium Guardian', color: 'bg-purple-600' },
    { value: 'legal', label: 'Legal Certification', color: 'bg-green-600' },
    { value: 'diamond', label: 'Diamond Elite', color: 'bg-yellow-600' }
  ];

  const categories = [
    'Technology', 'Legal', 'Health', 'Environment', 'Economics', 'Politics', 'Research'
  ];

  const handleGenerate = () => {
    if (!title.trim() || !summary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and summary",
        variant: "destructive",
      });
      return;
    }

    setGenerated(true);
    toast({
      title: "Seal Generated",
      description: "Your Veritas seal is ready for download",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your seal certificate is being downloaded",
    });
    // In real implementation, this would generate and download the actual image/PDF
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/seal/' + Date.now());
    toast({
      title: "Share Link Copied",
      description: "Seal verification link copied to clipboard",
    });
  };

  const getSealTypeColor = (type: string) => {
    return sealTypes.find(t => t.value === type)?.color || 'bg-blue-600';
  };

  const getSealTypeLabel = (type: string) => {
    return sealTypes.find(t => t.value === type)?.label || 'Standard';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Palette className="h-5 w-5 text-purple-400" />
          </div>
          <span className="text-white">Veritas Seal Studio</span>
        </CardTitle>
        <p className="text-slate-400">
          Design and preview your capsule's professional certification seal
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">
                Certificate Title
              </label>
              <Input
                type="text"
                placeholder="e.g., Climate Data Analysis Report"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">
                Summary Statement
              </label>
              <Textarea
                placeholder="Brief description of the verified content..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">
                Seal Type
              </label>
              <Select value={sealType} onValueChange={setSealType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sealTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Seal
            </Button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-400 mb-2 block">
              Seal Preview
            </label>
            
            {generated ? (
              <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-slate-800 to-slate-900">
                <CardContent className="p-6">
                  {/* Seal Header */}
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                      <div className={`p-4 ${getSealTypeColor(sealType)} rounded-full`}>
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {title || "Veritas Certified Capsule"}
                    </h3>
                    <div className="mb-3">
                      <SealBadge type={sealType as 'Standard' | 'Premium' | 'Legal' | 'Diamond'} size="lg" />
                    </div>
                  </div>

                  {/* Seal Content */}
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {summary || "This content has been authenticated under GuardianChain's Seal Framework."}
                      </p>
                    </div>

                    {category && (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">Category: {category}</span>
                      </div>
                    )}

                    {/* Verification Details */}
                    <div className="border-t border-slate-600 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-sm font-bold text-green-400">Verified</div>
                          <div className="text-xs text-slate-400">Status</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-blue-400">#{Date.now().toString().slice(-6)}</div>
                          <div className="text-xs text-slate-400">Seal ID</div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-600 pt-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-slate-400">Soulbound NFT Issued</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Powered by GuardianChain Veritas Protocol
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Fill in the details to generate your seal preview</p>
              </div>
            )}

            {/* Action Buttons */}
            {generated && (
              <div className="flex gap-3">
                <Button 
                  onClick={handleDownload}
                  variant="outline" 
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Information */}
        <div className="bg-slate-700/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Seal Features</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                Blockchain-verified authenticity
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                Tamper-proof digital signature
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                IPFS metadata storage
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                Downloadable PDF certificate
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                Social media sharing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                QR code verification
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SealStudio;