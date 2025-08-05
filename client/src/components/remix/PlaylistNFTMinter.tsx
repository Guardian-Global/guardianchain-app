import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Music, Coins, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PlaylistNFTMinterProps {
  playlistId: string;
  playlistName: string;
  capsuleCount: number;
  className?: string;
}

export default function PlaylistNFTMinter({ 
  playlistId, 
  playlistName, 
  capsuleCount,
  className 
}: PlaylistNFTMinterProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: `${playlistName} Collection`,
    description: 'A curated collection of truth capsules',
    walletAddress: '',
  });
  const queryClient = useQueryClient();

  const mintMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/playlist/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistId,
          userWallet: data.walletAddress,
          metadata: {
            name: data.name,
            description: data.description,
            capsules: capsuleCount,
          },
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "NFT Minted Successfully",
        description: `Token ID #${data.tokenId} has been created for your playlist.`,
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/playlists'] });
    },
    onError: (error) => {
      toast({
        title: "Minting Failed",
        description: "Failed to mint playlist NFT. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please enter your wallet address.",
        variant: "destructive",
      });
      return;
    }
    mintMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`bg-gradient-to-r from-purple-700 to-pink-500 text-white hover:opacity-90 ${className}`}
          data-testid="mint-playlist-nft-button"
        >
          <Music className="h-4 w-4 mr-2" />
          Mint as NFT
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]">
        <DialogHeader>
          <DialogTitle className="text-[#00ffe1] flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Mint Playlist NFT
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nft-name" className="text-sm text-[#8b949e]">
              NFT Name
            </label>
            <Input
              id="nft-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-[#161b22] border-[#30363d] text-[#f0f6fc] focus:border-[#00ffe1]"
              data-testid="nft-name-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nft-description" className="text-sm text-[#8b949e]">
              Description
            </label>
            <Textarea
              id="nft-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-[#161b22] border-[#30363d] text-[#f0f6fc] focus:border-[#00ffe1] resize-none"
              rows={3}
              data-testid="nft-description-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="wallet-address" className="text-sm text-[#8b949e]">
              Wallet Address *
            </label>
            <Input
              id="wallet-address"
              placeholder="0x..."
              value={formData.walletAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
              className="bg-[#161b22] border-[#30363d] text-[#f0f6fc] focus:border-[#00ffe1]"
              data-testid="wallet-address-input"
            />
          </div>

          <Card className="bg-[#161b22] border-[#30363d]">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8b949e]">Capsules in playlist:</span>
                <span className="text-[#00ffe1]">{capsuleCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-[#8b949e]">Estimated mint cost:</span>
                <span className="text-[#00ffe1] flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  0.01 ETH
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={mintMutation.isPending || !formData.walletAddress}
              className="flex-1 bg-gradient-to-r from-purple-700 to-pink-500 text-white hover:opacity-90"
              data-testid="confirm-mint-button"
            >
              {mintMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Minting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Mint NFT
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-[#30363d] text-[#8b949e] hover:bg-[#161b22]"
              data-testid="cancel-mint-button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}