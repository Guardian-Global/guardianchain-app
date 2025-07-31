import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Newspaper, 
  Users, 
  Globe,
  CheckCircle,
  Clock,
  Building
} from 'lucide-react';
import { generatePressKitPDF, generateExecutiveSummary, generateTechnicalWhitepaper } from '@/utils/generatePressKit';
import { useToast } from '@/hooks/use-toast';

export default function PressKitGenerator() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generatedDocs, setGeneratedDocs] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGeneratePressKit = async () => {
    setIsGenerating('presskit');
    
    try {
      const result = generatePressKitPDF();
      
      setGeneratedDocs(prev => [...prev, result.filename]);
      toast({
        title: "Press Kit Generated",
        description: `Successfully created ${result.filename}`,
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate press kit",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateExecutiveSummary = async () => {
    setIsGenerating('executive');
    
    try {
      generateExecutiveSummary();
      const filename = 'GUARDIANCHAIN_Executive_Summary.pdf';
      
      setGeneratedDocs(prev => [...prev, filename]);
      toast({
        title: "Executive Summary Generated",
        description: `Successfully created ${filename}`,
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate executive summary",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateWhitepaper = async () => {
    setIsGenerating('whitepaper');
    
    try {
      generateTechnicalWhitepaper();
      const filename = 'GUARDIANCHAIN_Technical_Whitepaper.pdf';
      
      setGeneratedDocs(prev => [...prev, filename]);
      toast({
        title: "Technical Whitepaper Generated",
        description: `Successfully created ${filename}`,
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate whitepaper",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const pressKitItems = [
    {
      id: 'presskit',
      title: 'Media Press Kit',
      description: 'Comprehensive one-sheet with platform overview, features, statistics, and contact information',
      icon: Newspaper,
      audience: 'Journalists & Media',
      pages: '2 pages',
      action: handleGeneratePressKit
    },
    {
      id: 'executive',
      title: 'Executive Summary',
      description: 'High-level business overview with mission, market opportunity, and revenue model',
      icon: Building,
      audience: 'Investors & Partners',
      pages: '4 pages',
      action: handleGenerateExecutiveSummary
    },
    {
      id: 'whitepaper',
      title: 'Technical Whitepaper',
      description: 'Detailed technical specification with architecture, smart contracts, and implementation',
      icon: FileText,
      audience: 'Developers & Engineers',
      pages: '12+ pages',
      action: handleGenerateWhitepaper
    }
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-400" />
            Press Kit Generator
          </div>
          <Badge className="bg-blue-600 text-white">
            <Globe className="w-3 h-3 mr-1" />
            Launch Ready
          </Badge>
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Generate professional documentation for media, investors, and technical audiences
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Generation Options */}
        <div className="space-y-4">
          {pressKitItems.map((item) => {
            const IconComponent = item.icon;
            const isCurrentlyGenerating = isGenerating === item.id;
            const isGenerated = generatedDocs.some(doc => doc.includes(item.id === 'presskit' ? 'Press_Kit' : item.id === 'executive' ? 'Executive' : 'Whitepaper'));
            
            return (
              <div key={item.id} className="border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                  
                  {isGenerated && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {item.audience}
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {item.pages}
                    </div>
                  </div>
                  
                  <Button
                    onClick={item.action}
                    disabled={isCurrentlyGenerating}
                    size="sm"
                    className={`${isGenerated ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isCurrentlyGenerating ? (
                      <>
                        <Clock className="w-3 h-3 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : isGenerated ? (
                      <>
                        <Download className="w-3 h-3 mr-2" />
                        Regenerate
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-2" />
                        Generate PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generated Documents Summary */}
        {generatedDocs.length > 0 && (
          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
            <div className="flex items-center text-green-400 mb-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">Documents Generated</span>
            </div>
            <p className="text-green-300 text-sm mb-3">
              {generatedDocs.length} document{generatedDocs.length !== 1 ? 's' : ''} successfully created and downloaded
            </p>
            <div className="space-y-1">
              {generatedDocs.map((doc, index) => (
                <div key={index} className="text-xs text-green-200 flex items-center">
                  <FileText className="w-3 h-3 mr-2" />
                  {doc}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Guidelines */}
        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Distribution Guidelines</h4>
          <div className="text-xs text-slate-400 space-y-1">
            <p>• Press Kit: Share with journalists, bloggers, and media outlets</p>
            <p>• Executive Summary: Present to potential investors and strategic partners</p>
            <p>• Technical Whitepaper: Distribute to developers, auditors, and technical communities</p>
            <p>• All documents include current platform statistics and contact information</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}