// pages/UserCapsules.tsx
// User-specific capsule management page with real-time updates

import React, { useState } from 'react';
import { useUserCapsules, type CapsuleFilter } from '@/hooks/useUserCapsules';
import { withAuthGuard } from '@/middleware/withAuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter, Eye, Lock, Globe, Users, Calendar, Hash } from 'lucide-react';

function UserCapsules() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<CapsuleFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Apply search to filter
  const activeFilter = {
    ...filter,
    search: searchQuery || undefined,
    visibility: activeTab === 'all' ? undefined : activeTab as any
  };

  const {
    capsules,
    isLoading,
    createCapsule,
    updateCapsule,
    deleteCapsule,
    sealCapsule,
    isCreating,
    isUpdating,
    isDeleting,
    isSealing,
    getCapsuleStats
  } = useUserCapsules(activeFilter);

  const handleCreateCapsule = () => {
    // Navigate to create capsule page or open modal
    window.location.href = '/create-capsule';
  };

  const handleSealCapsule = async (id: string, title: string) => {
    try {
      await sealCapsule(id);
      toast({
        title: "Capsule Sealed",
        description: `"${title}" has been permanently sealed on the blockchain.`,
      });
    } catch (error) {
      toast({
        title: "Sealing Failed",
        description: "Could not seal the capsule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCapsule = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCapsule(id);
      toast({
        title: "Capsule Deleted",
        description: `"${title}" has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Could not delete the capsule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return <Lock className="w-4 h-4" />;
      case 'public': return <Globe className="w-4 h-4" />;
      case 'friends': return <Users className="w-4 h-4" />;
      case 'unlockable': return <Hash className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'private': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'public': return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-300';
      case 'friends': return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-300';
      case 'unlockable': return 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Capsules</h1>
          <p className="text-muted-foreground">
            Manage your truth capsules and memories
          </p>
        </div>
        <Button onClick={handleCreateCapsule} data-testid="button-create-capsule">
          <Plus className="w-4 h-4 mr-2" />
          Create Capsule
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your capsules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            
            <Select value={filter.grief_score_min?.toString() || ''} onValueChange={(value) => 
              setFilter(prev => ({ ...prev, grief_score_min: value ? parseInt(value) : undefined }))
            }>
              <SelectTrigger className="w-[180px]" data-testid="select-grief-score">
                <SelectValue placeholder="Grief Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Score</SelectItem>
                <SelectItem value="1">1+ (Low)</SelectItem>
                <SelectItem value="5">5+ (Medium)</SelectItem>
                <SelectItem value="8">8+ (High)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" data-testid="button-filter">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Capsule Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" data-testid="tab-all">All ({capsules.length})</TabsTrigger>
          <TabsTrigger value="private" data-testid="tab-private">
            Private ({capsules.filter(c => c.visibility === 'private').length})
          </TabsTrigger>
          <TabsTrigger value="public" data-testid="tab-public">
            Public ({capsules.filter(c => c.visibility === 'public').length})
          </TabsTrigger>
          <TabsTrigger value="friends" data-testid="tab-friends">
            Friends ({capsules.filter(c => c.visibility === 'friends').length})
          </TabsTrigger>
          <TabsTrigger value="unlockable" data-testid="tab-unlockable">
            Unlockable ({capsules.filter(c => c.visibility === 'unlockable').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {capsules.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No capsules yet</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'all' 
                    ? "Create your first truth capsule to get started"
                    : `No ${activeTab} capsules found`
                  }
                </p>
                <Button onClick={handleCreateCapsule} data-testid="button-create-first">
                  Create Your First Capsule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {capsules.map((capsule) => (
                <Card key={capsule.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <span className="truncate">{capsule.title}</span>
                          {capsule.is_sealed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              Sealed
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {capsule.description || 'No description provided'}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getVisibilityColor(capsule.visibility)}>
                          <div className="flex items-center gap-1">
                            {getVisibilityIcon(capsule.visibility)}
                            <span className="capitalize">{capsule.visibility}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          <span>Grief Score: {capsule.grief_score}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{capsule.view_count} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(capsule.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {capsule.tags && capsule.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {capsule.tags.slice(0, 5).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {capsule.tags.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{capsule.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/capsule/${capsule.id}`}
                          data-testid={`button-view-${capsule.id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        
                        {!capsule.is_sealed && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `/capsule/${capsule.id}/edit`}
                              data-testid={`button-edit-${capsule.id}`}
                            >
                              Edit
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSealCapsule(capsule.id, capsule.title)}
                              disabled={isSealing}
                              data-testid={`button-seal-${capsule.id}`}
                            >
                              {isSealing ? 'Sealing...' : 'Seal'}
                            </Button>
                            
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteCapsule(capsule.id, capsule.title)}
                              disabled={isDeleting}
                              data-testid={`button-delete-${capsule.id}`}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuthGuard(UserCapsules, { 
  requireAuth: true,
  requireOnboarding: true 
});