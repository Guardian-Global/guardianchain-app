import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Upload,
  Zap,
  Star,
  Eye,
  Calendar,
  Shield,
  Clock,
  Coins,
  Users,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share,
  Download,
  Settings,
  PlusCircle,
  Search,
  Filter,
  Grid,
  List,
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  Globe,
  Lock,
  Unlock
} from "lucide-react";

// Consolidated Component replacing multiple scattered capsule components
// Replaces: CapsuleCreator, CapsuleForge/*, CapsuleDrawer, CapsuleSearch, CapsuleList, etc.
interface ConsolidatedCapsuleManagerProps {
  mode: 'create' | 'manage' | 'search' | 'analytics';
  onModeChange: (mode: 'create' | 'manage' | 'search' | 'analytics') => void;
}

export default function ConsolidatedCapsuleManager({ 
  mode, 
  onModeChange 
}: ConsolidatedCapsuleManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    privacy: 'public'
  });

  const CapsuleCreationPanel = () => (
    <div className="space-y-6">
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-accent" />
            Create Truth Capsule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-brand-text-secondary mb-2 block">Title</label>
            <Input
              value={createForm.title}
              onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter capsule title..."
              className="bg-brand-surface border-brand-surface text-white"
            />
          </div>
          
          <div>
            <label className="text-sm text-brand-text-secondary mb-2 block">Content</label>
            <Textarea
              value={createForm.content}
              onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your truth, story, or evidence..."
              rows={6}
              className="bg-brand-surface border-brand-surface text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-brand-text-secondary mb-2 block">Category</label>
              <Select value={createForm.category} onValueChange={(value) => 
                setCreateForm(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger className="bg-brand-surface border-brand-surface">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="testimony">Testimony</SelectItem>
                  <SelectItem value="evidence">Evidence</SelectItem>
                  <SelectItem value="memory">Memory</SelectItem>
                  <SelectItem value="prediction">Prediction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-brand-text-secondary mb-2 block">Privacy</label>
              <Select value={createForm.privacy} onValueChange={(value) => 
                setCreateForm(prev => ({ ...prev, privacy: value }))
              }>
                <SelectTrigger className="bg-brand-surface border-brand-surface">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {createForm.content && createForm.content.length > 50 && (
            <div className="bg-brand-surface p-4 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-3">AI Analysis Preview</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-400">87%</p>
                  <p className="text-xs text-brand-text-muted">Truth Score</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-400">15.2 GTT</p>
                  <p className="text-xs text-brand-text-muted">Est. Yield</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-400">High</p>
                  <p className="text-xs text-brand-text-muted">Impact</p>
                </div>
              </div>
            </div>
          )}

          <Button className="w-full bg-brand-primary hover:bg-brand-primary/80">
            <Shield className="w-4 h-4 mr-2" />
            Create & Seal Capsule
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const CapsuleManagementPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">My Capsules</h3>
        <div className="flex gap-2">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">Capsule #{index + 1}</h4>
                  <p className="text-sm text-brand-text-muted">Created 2 days ago</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Verified
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-muted">Truth Score</span>
                  <span className="text-green-400">92%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-muted">GTT Earned</span>
                  <span className="text-yellow-400">18.7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-muted">Views</span>
                  <span className="text-blue-400">1,247</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const CapsuleSearchPanel = () => (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search capsules by title, content, or creator..."
            className="pl-10 bg-brand-surface border-brand-surface text-white"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48 bg-brand-surface border-brand-surface">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="testimony">Testimony</SelectItem>
            <SelectItem value="evidence">Evidence</SelectItem>
            <SelectItem value="memory">Memory</SelectItem>
            <SelectItem value="prediction">Prediction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-accent/20 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">Global Truth Capsule #{index + 1}</h4>
                  <p className="text-sm text-brand-text-muted mb-2">
                    by Guardian-{(Math.random() * 1000).toFixed(0)}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-brand-text-muted">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {Math.floor(Math.random() * 5000)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {Math.floor(Math.random() * 500)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {Math.floor(Math.random() * 100)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs mb-1">
                    Truth: {85 + Math.floor(Math.random() * 15)}%
                  </Badge>
                  <p className="text-xs text-yellow-400">{(Math.random() * 50).toFixed(1)} GTT</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const CapsuleAnalyticsPanel = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Capsules', value: '1,247', icon: FileText, color: 'text-blue-400' },
          { title: 'GTT Earned', value: '3,892', icon: Coins, color: 'text-yellow-400' },
          { title: 'Average Score', value: '87.3%', icon: Target, color: 'text-green-400' },
          { title: 'Total Views', value: '45.2K', icon: Eye, color: 'text-purple-400' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-muted">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-brand-text-muted mx-auto mb-4" />
                <p className="text-brand-text-muted">Analytics visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-brand-surface rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-white">Capsule verified</span>
                  </div>
                  <span className="text-xs text-brand-text-muted">{index + 1}h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Capsule Manager</h2>
        <div className="flex gap-2">
          <Button
            variant={mode === 'create' ? 'default' : 'outline'}
            onClick={() => onModeChange('create')}
            size="sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create
          </Button>
          <Button
            variant={mode === 'manage' ? 'default' : 'outline'}
            onClick={() => onModeChange('manage')}
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
          <Button
            variant={mode === 'search' ? 'default' : 'outline'}
            onClick={() => onModeChange('search')}
            size="sm"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button
            variant={mode === 'analytics' ? 'default' : 'outline'}
            onClick={() => onModeChange('analytics')}
            size="sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {mode === 'create' && <CapsuleCreationPanel />}
      {mode === 'manage' && <CapsuleManagementPanel />}
      {mode === 'search' && <CapsuleSearchPanel />}
      {mode === 'analytics' && <CapsuleAnalyticsPanel />}
    </div>
  );
}