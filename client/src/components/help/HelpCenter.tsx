import React, { useState } from 'react';
import { Search, BookOpen, HelpCircle, Lightbulb, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HELP_CONTENT_DATABASE, HelpContent } from './ContextualHelp';
import { useHelp } from './HelpProvider';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<HelpContent | null>(null);
  const { helpHistory, showHelp } = useHelp();

  const helpContentArray = Object.values(HELP_CONTENT_DATABASE);

  const filteredContent = helpContentArray.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categorizedContent = {
    capsule: filteredContent.filter(c => c.category === 'capsule'),
    verification: filteredContent.filter(c => c.category === 'verification'),
    token: filteredContent.filter(c => c.category === 'token'),
    analytics: filteredContent.filter(c => c.category === 'analytics'),
    security: filteredContent.filter(c => c.category === 'security'),
    general: filteredContent.filter(c => c.category === 'general')
  };

  const recentHelpContent = helpHistory
    .map(id => HELP_CONTENT_DATABASE[id])
    .filter(Boolean)
    .slice(0, 5);

  const complexityColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const handleContentSelect = (content: HelpContent) => {
    setSelectedContent(content);
    showHelp(content.id);
  };

  const handleBackToList = () => {
    setSelectedContent(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] bg-slate-900 border-slate-700 flex flex-col">
        <CardHeader className="border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <BookOpen className="w-6 h-6 text-purple-400" />
              <CardTitle className="text-xl text-white">
                {selectedContent ? selectedContent.title : 'Help Center'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-6">
          {selectedContent ? (
            // Detailed view
            <div className="h-full overflow-y-auto space-y-6">
              <div className="flex items-center space-x-3">
                <Badge
                  variant="outline"
                  className={`${complexityColors[selectedContent.complexity]}`}
                >
                  {selectedContent.complexity}
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  {selectedContent.category}
                </Badge>
              </div>

              <div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {selectedContent.description}
                </p>
              </div>

              {selectedContent.steps && (
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-purple-400" />
                    Step-by-step guide:
                  </h3>
                  <div className="space-y-3">
                    {selectedContent.steps.map((step, index) => (
                      <div key={index} className="flex space-x-4 p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedContent.tips && (
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                    Pro tips:
                  </h3>
                  <div className="space-y-2">
                    {selectedContent.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-500/5 border-l-4 border-yellow-500/30 rounded-r-lg">
                        <span className="text-yellow-400 font-bold">•</span>
                        <p className="text-slate-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedContent.relatedFeatures && (
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4">Related features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedContent.relatedFeatures.map((featureId) => {
                      const feature = HELP_CONTENT_DATABASE[featureId];
                      return feature ? (
                        <Card
                          key={featureId}
                          className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 cursor-pointer transition-colors"
                          onClick={() => handleContentSelect(feature)}
                        >
                          <CardContent className="p-4">
                            <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                            <p className="text-slate-400 text-sm">{feature.description.slice(0, 100)}...</p>
                          </CardContent>
                        </Card>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // List view
            <div className="h-full flex flex-col">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search help topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <Tabs defaultValue="all" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-6 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="capsule">Capsules</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="token">Tokens</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="all" className="space-y-4">
                    {filteredContent.map((content) => (
                      <Card
                        key={content.id}
                        className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 cursor-pointer transition-colors"
                        onClick={() => handleContentSelect(content)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-white font-medium">{content.title}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${complexityColors[content.complexity]}`}
                            >
                              {content.complexity}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{content.description}</p>
                          <Badge variant="outline" className="text-xs text-slate-500 border-slate-600">
                            {content.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="recent" className="space-y-4">
                    {recentHelpContent.length > 0 ? (
                      recentHelpContent.map((content) => (
                        <Card
                          key={content.id}
                          className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 cursor-pointer transition-colors"
                          onClick={() => handleContentSelect(content)}
                        >
                          <CardContent className="p-4">
                            <h3 className="text-white font-medium mb-2">{content.title}</h3>
                            <p className="text-slate-400 text-sm">{content.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent help topics</p>
                      </div>
                    )}
                  </TabsContent>

                  {Object.entries(categorizedContent).map(([category, contents]) => (
                    <TabsContent key={category} value={category} className="space-y-4">
                      {contents.map((content) => (
                        <Card
                          key={content.id}
                          className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 cursor-pointer transition-colors"
                          onClick={() => handleContentSelect(content)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-white font-medium">{content.title}</h3>
                              <Badge
                                variant="outline"
                                className={`text-xs ${complexityColors[content.complexity]}`}
                              >
                                {content.complexity}
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-sm">{content.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};