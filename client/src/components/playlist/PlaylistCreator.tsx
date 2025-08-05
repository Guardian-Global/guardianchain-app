import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Music, Users, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PlaylistCreatorProps {
  className?: string;
}

export default function PlaylistCreator({ className }: PlaylistCreatorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const createPlaylistMutation = useMutation({
    mutationFn: async (playlistName: string) => {
      const response = await fetch('/api/playlist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          userId: user?.id || 'dev-user-123',
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Playlist Created",
        description: `"${name}" playlist has been created successfully.`,
      });
      setName('');
      setIsCreating(false);
      queryClient.invalidateQueries({ queryKey: ['/api/playlists'] });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed", 
        description: "Failed to create playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a playlist name.",
        variant: "destructive",
      });
      return;
    }
    createPlaylistMutation.mutate(name.trim());
  };

  if (!isCreating) {
    return (
      <Card className={`bg-[#0d1117] border-[#30363d] ${className}`}>
        <CardContent className="p-6">
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] text-black hover:opacity-90 transition-opacity"
            data-testid="create-playlist-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Playlist
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-[#0d1117] border-[#30363d] ${className}`}>
      <CardHeader>
        <CardTitle className="text-[#00ffe1] flex items-center gap-2">
          <Music className="h-5 w-5" />
          Create Capsule Playlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="playlist-name" className="text-sm text-[#8b949e]">
            Playlist Name
          </label>
          <Input
            id="playlist-name"
            placeholder="My Truth Collection"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            className="bg-[#161b22] border-[#30363d] text-[#f0f6fc] focus:border-[#00ffe1]"
            data-testid="playlist-name-input"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8b949e]">
          <Users className="h-3 w-3" />
          <span>Shareable with the community</span>
          <Share2 className="h-3 w-3" />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            disabled={createPlaylistMutation.isPending || !name.trim()}
            className="flex-1 bg-[#00ffe1] text-black hover:bg-[#00ffe1]/90"
            data-testid="confirm-create-button"
          >
            {createPlaylistMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create
              </>
            )}
          </Button>
          
          <Button
            onClick={() => {
              setIsCreating(false);
              setName('');
            }}
            variant="outline"
            className="border-[#30363d] text-[#8b949e] hover:bg-[#161b22]"
            data-testid="cancel-create-button"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}