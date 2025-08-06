// pages/UserVault.tsx
// User-specific private vault for memories and documents

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { withAuthGuard } from '@/middleware/withAuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Vault, FileText, Image, Video, Music, Lock, Search, Calendar, Tag } from 'lucide-react';

interface VaultEntry {
  id: string;
  title: string;
  content?: string;
  entry_type: 'memory' | 'document' | 'media' | 'note';
  is_encrypted: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CreateEntryData {
  title: string;
  content?: string;
  entry_type: 'memory' | 'document' | 'media' | 'note';
  tags?: string[];
}

function UserVault() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [createData, setCreateData] = useState<CreateEntryData>({
    title: '',
    content: '',
    entry_type: 'memory',
    tags: []
  });

  // Query for vault entries
  const {
    data: entries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['vault-entries', user?.email, searchQuery, filterType],
    queryFn: async () => {
      if (!user?.email) return [];

      let query = supabase
        .from('vault_entries')
        .select('*')
        .eq('owner_wallet_address', user.email)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`);
      }

      if (filterType !== 'all') {
        query = query.eq('entry_type', filterType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching vault entries:', error);
        throw error;
      }

      return data as VaultEntry[];
    },
    enabled: !!user?.email
  });

  // Create entry mutation
  const createEntry = useMutation({
    mutationFn: async (data: CreateEntryData): Promise<VaultEntry> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const entryData = {
        ...data,
        owner_wallet_address: user.email,
        is_encrypted: false, // For now, encryption is handled separately
        tags: data.tags || []
      };

      const { data: newEntry, error } = await supabase
        .from('vault_entries')
        .insert([entryData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating vault entry:', error);
        throw error;
      }

      return newEntry as VaultEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-entries'] });
      setIsCreateDialogOpen(false);
      setCreateData({ title: '', content: '', entry_type: 'memory', tags: [] });
      toast({
        title: "Entry Created",
        description: "Your vault entry has been saved securely.",
      });
    },
    onError: (error) => {
      console.error('❌ Failed to create vault entry:', error);
      toast({
        title: "Creation Failed",
        description: "Could not create the vault entry. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete entry mutation
  const deleteEntry = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('vault_entries')
        .delete()
        .eq('id', id)
        .eq('owner_wallet_address', user.email);

      if (error) {
        console.error('❌ Error deleting vault entry:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-entries'] });
      toast({
        title: "Entry Deleted",
        description: "The vault entry has been removed.",
      });
    }
  });

  const handleCreateEntry = () => {
    createEntry.mutate(createData);
  };

  const handleDeleteEntry = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }
    deleteEntry.mutate(id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory': return <Vault className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'media': return <Image className="w-4 h-4" />;
      case 'note': return <Tag className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'memory': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'document': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'media': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'note': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredCounts = {
    all: entries.length,
    memory: entries.filter(e => e.entry_type === 'memory').length,
    document: entries.filter(e => e.entry_type === 'document').length,
    media: entries.filter(e => e.entry_type === 'media').length,
    note: entries.filter(e => e.entry_type === 'note').length
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            My Vault
          </h1>
          <p className="text-muted-foreground">
            Your private, encrypted collection of memories and documents
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-entry">
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Vault Entry</DialogTitle>
              <DialogDescription>
                Add a new private entry to your secure vault
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your entry"
                  value={createData.title}
                  onChange={(e) => setCreateData(prev => ({ ...prev, title: e.target.value }))}
                  data-testid="input-entry-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry_type">Type</Label>
                <Select
                  value={createData.entry_type}
                  onValueChange={(value: any) => setCreateData(prev => ({ ...prev, entry_type: value }))}
                >
                  <SelectTrigger data-testid="select-entry-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="memory">Memory</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your content here..."
                  value={createData.content}
                  onChange={(e) => setCreateData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  data-testid="textarea-entry-content"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEntry}
                  disabled={createEntry.isPending || !createData.title.trim()}
                  data-testid="button-save-entry"
                >
                  {createEntry.isPending ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your vault..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-vault"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]" data-testid="select-filter-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types ({filteredCounts.all})</SelectItem>
                <SelectItem value="memory">Memories ({filteredCounts.memory})</SelectItem>
                <SelectItem value="document">Documents ({filteredCounts.document})</SelectItem>
                <SelectItem value="media">Media ({filteredCounts.media})</SelectItem>
                <SelectItem value="note">Notes ({filteredCounts.note})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vault Entries */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Vault className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your vault is empty</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "No entries match your search criteria"
                : "Start by adding your first memory, document, or note"
              }
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-entry">
              Add Your First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <span className="truncate">{entry.title}</span>
                      {entry.is_encrypted && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          <Lock className="w-3 h-3 mr-1" />
                          Encrypted
                        </Badge>
                      )}
                    </CardTitle>
                    {entry.content && (
                      <CardDescription className="line-clamp-2">
                        {entry.content}
                      </CardDescription>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={getTypeColor(entry.entry_type)}>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(entry.entry_type)}
                        <span className="capitalize">{entry.entry_type}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 5).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.tags.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`button-view-entry-${entry.id}`}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`button-edit-entry-${entry.id}`}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id, entry.title)}
                        disabled={deleteEntry.isPending}
                        data-testid={`button-delete-entry-${entry.id}`}
                      >
                        {deleteEntry.isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuthGuard(UserVault, { 
  requireAuth: true,
  requireOnboarding: true 
});