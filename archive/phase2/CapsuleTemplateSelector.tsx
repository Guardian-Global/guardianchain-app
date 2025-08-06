import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Heart,
  Users,
  Eye,
  Lock,
  Star,
  Globe,
  Calendar,
  Brain,
  Lightbulb,
  Zap,
  Target,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Bookmark,
  ChevronRight,
  Sparkles,
  Flame,
  Award,
  FileText,
  Camera,
  Mic,
  Video
} from 'lucide-react';

interface CapsuleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  estimatedGTT: number;
  popularity: number;
  tags: string[];
  template: string;
  placeholders: Record<string, string>;
  suggestions: string[];
  features: string[];
  trending?: boolean;
  new?: boolean;
  premium?: boolean;
}

const templates: CapsuleTemplate[] = [
  {
    id: 'truth-revelation',
    name: 'Truth Revelation',
    description: 'Expose hidden truths or share important revelations',
    category: 'Truth',
    icon: Shield,
    color: 'from-cyan-500 to-blue-600',
    difficulty: 'Intermediate',
    estimatedTime: '10-15 min',
    estimatedGTT: 45,
    popularity: 94,
    tags: ['truth', 'revelation', 'expose', 'important'],
    template: 'I need to reveal an important truth about {subject}. After {timeframe} of {experience}, I discovered that {revelation}. This matters because {impact}.',
    placeholders: {
      subject: 'the subject of your revelation',
      timeframe: 'how long you\'ve known this',
      experience: 'your experience or investigation',
      revelation: 'the truth you discovered',
      impact: 'why this truth is important'
    },
    suggestions: [
      'Corporate misconduct you witnessed',
      'Historical facts that were hidden',
      'Personal realizations that changed your life',
      'Industry secrets that affect others'
    ],
    features: ['High Impact', 'Truth Verification', 'Community Validation'],
    trending: true
  },
  {
    id: 'memory-preservation',
    name: 'Memory Preservation',
    description: 'Capture and preserve precious personal memories',
    category: 'Memory',
    icon: Heart,
    color: 'from-pink-500 to-red-500',
    difficulty: 'Beginner',
    estimatedTime: '5-10 min',
    estimatedGTT: 32,
    popularity: 87,
    tags: ['memory', 'family', 'personal', 'nostalgia'],
    template: 'One of my most cherished memories is {memory}. It happened {when} at {where}. What made it special was {significance}. Even now, {feeling}.',
    placeholders: {
      memory: 'the memory you want to preserve',
      when: 'when it happened',
      where: 'where it took place',
      significance: 'what made it meaningful',
      feeling: 'how it makes you feel today'
    },
    suggestions: [
      'Childhood moments with family',
      'First experiences and milestones',
      'Conversations that changed you',
      'Simple moments that brought joy'
    ],
    features: ['Emotional Resonance', 'Family Sharing', 'Time Capsule'],
    new: true
  },
  {
    id: 'witness-testimony',
    name: 'Witness Testimony',
    description: 'Provide testimony about events you witnessed',
    category: 'Testimony',
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    difficulty: 'Advanced',
    estimatedTime: '15-25 min',
    estimatedGTT: 58,
    popularity: 76,
    tags: ['witness', 'testimony', 'evidence', 'legal'],
    template: 'I was present at {event} on {date}. I witnessed {what_happened}. The key details I remember are: {details}. This testimony is important because {importance}.',
    placeholders: {
      event: 'the event you witnessed',
      date: 'when it occurred',
      what_happened: 'what you saw happen',
      details: 'specific details you remember',
      importance: 'why your testimony matters'
    },
    suggestions: [
      'Historical events you witnessed',
      'Accidents or incidents you saw',
      'Important conversations you heard',
      'Acts of kindness or courage'
    ],
    features: ['Legal Validity', 'Blockchain Proof', 'Expert Verification'],
    trending: true
  },
  {
    id: 'future-prediction',
    name: 'Future Prediction',
    description: 'Make predictions about future events',
    category: 'Prediction',
    icon: Eye,
    color: 'from-purple-500 to-indigo-600',
    difficulty: 'Intermediate',
    estimatedTime: '8-12 min',
    estimatedGTT: 41,
    popularity: 82,
    tags: ['prediction', 'future', 'forecast', 'vision'],
    template: 'Based on {evidence}, I predict that {prediction} will happen by {timeframe}. My reasoning is {logic}. If I\'m right, the impact will be {impact}.',
    placeholders: {
      evidence: 'current trends or evidence you see',
      prediction: 'what you think will happen',
      timeframe: 'when you think it will occur',
      logic: 'your reasoning behind the prediction',
      impact: 'what the consequences will be'
    },
    suggestions: [
      'Technology trends and developments',
      'Social and cultural changes',
      'Economic or market predictions',
      'Environmental changes'
    ],
    features: ['Time-Lock Verification', 'Prediction Tracking', 'Accuracy Scoring']
  },
  {
    id: 'legacy-message',
    name: 'Legacy Message',
    description: 'Leave important messages for the future',
    category: 'Legacy',
    icon: Star,
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'Beginner',
    estimatedTime: '10-20 min',
    estimatedGTT: 38,
    popularity: 91,
    tags: ['legacy', 'future', 'family', 'wisdom'],
    template: 'To {recipients}, I want you to know {message}. The most important lesson I\'ve learned is {wisdom}. My hope for you is {hopes}. Remember that {reminder}.',
    placeholders: {
      recipients: 'who this message is for',
      message: 'your main message to them',
      wisdom: 'key life lesson you want to share',
      hopes: 'your hopes for their future',
      reminder: 'something important to remember'
    },
    suggestions: [
      'Messages for your children or grandchildren',
      'Wisdom for future generations',
      'Instructions for handling your affairs',
      'Stories you want preserved'
    ],
    features: ['Time-Lock Release', 'Family Access', 'Permanent Storage']
  },
  {
    id: 'creative-work',
    name: 'Creative Expression',
    description: 'Share original creative content and ideas',
    category: 'Creative',
    icon: Sparkles,
    color: 'from-rose-500 to-pink-600',
    difficulty: 'Beginner',
    estimatedTime: '5-15 min',
    estimatedGTT: 29,
    popularity: 69,
    tags: ['creative', 'art', 'original', 'expression'],
    template: 'I created {work} because {inspiration}. The meaning behind it is {meaning}. I hope people will {response} when they experience it.',
    placeholders: {
      work: 'what you created',
      inspiration: 'what inspired you to create it',
      meaning: 'the deeper meaning or message',
      response: 'how you want people to react'
    },
    suggestions: [
      'Original poems or short stories',
      'Artwork descriptions and meanings',
      'Musical compositions or lyrics',
      'Photography projects'
    ],
    features: ['Copyright Protection', 'Creative Commons', 'Portfolio Building'],
    new: true
  },
  {
    id: 'confession-release',
    name: 'Personal Confession',
    description: 'Share personal confessions or admissions',
    category: 'Personal',
    icon: Lock,
    color: 'from-red-500 to-rose-600',
    difficulty: 'Advanced',
    estimatedTime: '10-30 min',
    estimatedGTT: 52,
    popularity: 64,
    tags: ['confession', 'personal', 'release', 'truth'],
    template: 'I need to confess that {confession}. I\'ve kept this secret because {reasons}. The truth is {details}. Sharing this now because {motivation}.',
    placeholders: {
      confession: 'what you need to confess',
      reasons: 'why you kept it secret',
      details: 'the full truth of the situation',
      motivation: 'why you\'re sharing it now'
    },
    suggestions: [
      'Mistakes you need to own up to',
      'Secrets that have been weighing on you',
      'Apologies you need to make',
      'Truth about past events'
    ],
    features: ['Anonymous Option', 'Encrypted Storage', 'Delayed Release'],
    premium: true
  },
  {
    id: 'achievement-milestone',
    name: 'Achievement Record',
    description: 'Document significant achievements and milestones',
    category: 'Achievement',
    icon: Award,
    color: 'from-amber-500 to-yellow-600',
    difficulty: 'Beginner',
    estimatedTime: '5-10 min',
    estimatedGTT: 35,
    popularity: 73,
    tags: ['achievement', 'milestone', 'success', 'record'],
    template: 'Today I achieved {achievement}. This was significant because {significance}. The journey to get here involved {journey}. What I learned was {lessons}.',
    placeholders: {
      achievement: 'what you accomplished',
      significance: 'why this achievement matters',
      journey: 'how you reached this milestone',
      lessons: 'what you learned along the way'
    },
    suggestions: [
      'Career milestones and promotions',
      'Personal goals you\'ve reached',
      'Learning achievements and certifications',
      'Overcoming challenges or fears'
    ],
    features: ['Achievement Tracking', 'Progress Visualization', 'Milestone Rewards']
  }
];

const categories = ['All', 'Truth', 'Memory', 'Testimony', 'Prediction', 'Legacy', 'Creative', 'Personal', 'Achievement'];

interface CapsuleTemplateSelectorProps {
  onTemplateSelect: (template: CapsuleTemplate) => void;
  selectedTemplate?: string;
  className?: string;
}

export default function CapsuleTemplateSelector({ 
  onTemplateSelect, 
  selectedTemplate,
  className = '' 
}: CapsuleTemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'gtt' | 'difficulty'>('popularity');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'gtt':
          return b.estimatedGTT - a.estimatedGTT;
        case 'difficulty':
          const difficultyOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-600';
      case 'Intermediate': return 'bg-yellow-600';
      case 'Advanced': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Template</h2>
        <p className="text-gray-400">Select a template to get started with guided content creation</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="template-search"
          />
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Category:</span>
            <div className="flex gap-1">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`category-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              data-testid="sort-select"
            >
              <option value="popularity">Popularity</option>
              <option value="gtt">GTT Potential</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <ScrollArea className="h-96">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
          <AnimatePresence>
            {filteredTemplates.map((template) => {
              const IconComponent = template.icon;
              const isSelected = selectedTemplate === template.id;
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    onClick={() => onTemplateSelect(template)}
                    data-testid={`template-${template.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {template.trending && (
                            <Badge className="bg-orange-600 text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                          {template.new && (
                            <Badge className="bg-green-600 text-xs">New</Badge>
                          )}
                          {template.premium && (
                            <Badge className="bg-purple-600 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      <p className="text-gray-400 text-sm">{template.description}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <Badge className={getDifficultyColor(template.difficulty)} variant="secondary">
                          {template.difficulty}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {template.estimatedTime}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              ~{template.estimatedGTT} GTT
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Flame className="w-3 h-3" />
                              {template.popularity}%
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDetails(showDetails === template.id ? null : template.id);
                            }}
                            data-testid={`details-${template.id}`}
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform ${
                              showDetails === template.id ? 'rotate-90' : ''
                            }`} />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {showDetails === template.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 border-t border-gray-600 pt-3"
                            >
                              <div>
                                <h4 className="text-sm font-medium text-white mb-1">Features:</h4>
                                <div className="text-xs text-gray-400 space-y-1">
                                  {template.features.map(feature => (
                                    <div key={feature} className="flex items-center gap-1">
                                      <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-white mb-1">Suggestions:</h4>
                                <div className="text-xs text-gray-400 space-y-1">
                                  {template.suggestions.slice(0, 2).map(suggestion => (
                                    <div key={suggestion} className="flex items-center gap-1">
                                      <Lightbulb className="w-3 h-3 text-yellow-400" />
                                      {suggestion}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Templates Found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}