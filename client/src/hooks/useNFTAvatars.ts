import { useState, useEffect } from 'react';

export interface NFTAvatar {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl: string;
  traits: string[];
  unlocked: boolean;
  requirement?: string;
}

export function useNFTAvatars() {
  const [avatars, setAvatars] = useState<NFTAvatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading NFT avatar data
    const loadAvatars = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nftAvatars: NFTAvatar[] = [
        {
          id: '1',
          name: 'Truth Guardian',
          rarity: 'common',
          imageUrl: '/assets/nfts/capsule-nft-1.svg',
          traits: ['Basic', 'Starter'],
          unlocked: true
        },
        {
          id: '2',
          name: 'Verified Seeker',
          rarity: 'rare',
          imageUrl: '/assets/nfts/capsule-nft-2.svg',
          traits: ['Verified', 'Explorer'],
          unlocked: true,
          requirement: 'Complete 5 verifications'
        },
        {
          id: '3',
          name: 'Veritas Keeper',
          rarity: 'epic',
          imageUrl: '/assets/nfts/capsule-nft-3.svg',
          traits: ['Elite', 'Sealed'],
          unlocked: false,
          requirement: 'Reach SOVEREIGN tier'
        }
      ];
      
      setAvatars(nftAvatars);
      setSelectedAvatar(nftAvatars[0].id);
      setIsLoading(false);
    };

    loadAvatars();
  }, []);

  const selectAvatar = (avatarId: string) => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (avatar && avatar.unlocked) {
      setSelectedAvatar(avatarId);
    }
  };

  const getSelectedAvatar = () => {
    return avatars.find(a => a.id === selectedAvatar);
  };

  const getUnlockedAvatars = () => {
    return avatars.filter(a => a.unlocked);
  };

  const getLockedAvatars = () => {
    return avatars.filter(a => !a.unlocked);
  };

  return {
    avatars,
    selectedAvatar,
    isLoading,
    selectAvatar,
    getSelectedAvatar,
    getUnlockedAvatars,
    getLockedAvatars
  };
}
