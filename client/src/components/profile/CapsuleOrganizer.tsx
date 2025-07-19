import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Clock, 
  TrendingUp,
  Shuffle,
  Copy,
  Edit,
  Eye,
  Share,
  DollarSign,
  Calendar,
  Tag,
  MoreHorizontal
} from 'lucide-react';

interface Capsule {
  id: string;
  title: string;
  type: 'legal' | 'research' | 'creative' | 'financial' | 'health' | 'personal';
  status: 'draft' | 'sealed' | 'verified' | 'yielding';
  createdDate: string;
  value: number;
  yield: number;
  views: number;
  verifications: number;
  isPublic: boolean;
  tags: string[];
  thumbnail?: string;
}

export function CapsuleOrganizer() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Mock capsule data
  const capsules: Capsule[] = [
    {
      id: '1',
      title: 'Climate Research Data Verification',
      type: 'research',
      status: 'verified',
      createdDate: '2024-12-15',
      value: 2847.50,
      yield: 647.89,
      views: 1247,
      verifications: 89,
      isPublic: true,
      tags: ['climate', 'environment', 'data', 'science']
    },
    {
      id: '2',
      title: 'Legal Document Authentication',
      type: 'legal',
      status: 'yielding',
      createdDate: '2024-11-22',
      value: 1523.75,
      yield: 289.33,
      views: 834,
      verifications: 156,
      isPublic: false,
      tags: ['legal', 'authentication', 'documents']
    },
    {
      id: '3',
      title: 'AI Training Data Integrity',
      type: 'research',
      status: 'sealed',
      createdDate: '2024-10-08',
      value: 3267.89,
      yield: 0,
      views: 2156,
      verifications: 234,
      isPublic: true,
      tags: ['ai', 'training', 'data', 'machine-learning']
    },
    {
      id: '4',
      title: 'Personal Health Records',
      type: 'health',
      status: 'draft',
      createdDate: '2024-12-20',
      value: 0,
      yield: 0,
      views: 12,
      verifications: 0,
      isPublic: false,
      tags: ['health', 'personal', 'medical']
    },
    {
      id: '5',
      title: 'Creative Portfolio Protection',
      type: 'creative',
      status: 'verified',
      createdDate: '2024-09-15',
      value: 1847.25,
      yield: 347.88,
      views: 3421,
      verifications: 167,
      isPublic: true,
      tags: ['art', 'design', 'portfolio', 'creative']
    }
  ];

  const filteredCapsules = capsules.filter(capsule => {
    const matchesSearch = capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capsule.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || capsule.type === filterType;
    const matchesStatus = filterStatus === 'all' || capsule.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case 'value':
        return b.value - a.value;
      case 'yield':
        return b.yield - a.yield;
      case 'popular':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      sealed: 'bg-blue-500',
      verified: 'bg-green-500',
      yielding: 'bg-purple-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      legal: '⚖️',
      research: '🔬',
      creative: '🎨',
      financial: '💰',
      health: '🏥',
      personal: '👤'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const handleRemix = (capsule: Capsule) => {
    console.log('Remixing capsule:', capsule.id);
    // Implement remix functionality
  };

  const handleDuplicate = (capsule: Capsule) => {
    console.log('Duplicating capsule:', capsule.id);
    // Implement duplication functionality
  };

  const handleShare = (capsule: Capsule) => {
    console.log('Sharing capsule:', capsule.id);
    // Implement sharing functionality
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-400" />
              Capsule Organizer
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search capsules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sealed">Sealed</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="yielding">Yielding</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="value">Highest Value</SelectItem>
                <SelectItem value="yield">Highest Yield</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{capsules.length}</div>
            <div className="text-sm text-slate-400">Total Capsules</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {capsules.filter(c => c.status === 'verified').length}
            </div>
            <div className="text-sm text-slate-400">Verified</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {capsules.filter(c => c.status === 'yielding').length}
            </div>
            <div className="text-sm text-slate-400">Yielding</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">
              {capsules.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Value</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {capsules.reduce((sum, c) => sum + c.yield, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Yield</div>
          </CardContent>
        </Card>
      </div>

      {/* Capsules Display */}
      <Card className="bg-slate-800">
        <CardContent className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCapsules.map((capsule) => (
                <Card key={capsule.id} className="bg-slate-700 hover:bg-slate-650 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getTypeIcon(capsule.type)}</span>
                        <Badge className={`${getStatusColor(capsule.status)} text-white text-xs`}>
                          {capsule.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-medium text-white mb-2 line-clamp-2">
                      {capsule.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Value:</span>
                        <span className="text-amber-400">{capsule.value.toLocaleString()} GTT</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-400">Yield:</span>
                        <span className="text-green-400">{capsule.yield.toLocaleString()} GTT</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-400">Views:</span>
                        <span className="text-blue-400">{capsule.views}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {capsule.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                      {capsule.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs text-slate-400">
                          +{capsule.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => handleRemix(capsule)}>
                          <Shuffle className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDuplicate(capsule)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShare(capsule)}>
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(capsule.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCapsules.map((capsule) => (
                <Card key={capsule.id} className="bg-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-xl">{getTypeIcon(capsule.type)}</span>
                        
                        <div>
                          <h3 className="font-medium text-white">{capsule.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <Badge className={`${getStatusColor(capsule.status)} text-white text-xs`}>
                              {capsule.status}
                            </Badge>
                            <span>{new Date(capsule.createdDate).toLocaleDateString()}</span>
                            <span>{capsule.views} views</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-amber-400">{capsule.value.toLocaleString()} GTT</div>
                          <div className="text-xs text-green-400">+{capsule.yield.toLocaleString()} yield</div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleRemix(capsule)}>
                            <Shuffle className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDuplicate(capsule)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleShare(capsule)}>
                            <Share className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {filteredCapsules.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No capsules found</h3>
              <p className="text-slate-400">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remix Options Panel */}
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shuffle className="w-5 h-5 mr-2 text-blue-400" />
            Remix & Collaboration Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 flex flex-col items-center py-6">
              <Copy className="w-6 h-6 mb-2" />
              <span>Duplicate Capsule</span>
              <span className="text-xs text-blue-200">Create exact copy</span>
            </Button>
            
            <Button className="bg-purple-600 hover:bg-purple-700 flex flex-col items-center py-6">
              <Shuffle className="w-6 h-6 mb-2" />
              <span>Remix Content</span>
              <span className="text-xs text-purple-200">Modify and improve</span>
            </Button>
            
            <Button className="bg-green-600 hover:bg-green-700 flex flex-col items-center py-6">
              <Share className="w-6 h-6 mb-2" />
              <span>Collaborative Edit</span>
              <span className="text-xs text-green-200">Work with others</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}