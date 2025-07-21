import React from 'react';
import { useAssets } from './AssetProvider';
import { Shield, Crown, Star, Zap } from 'lucide-react';

interface NFTIconDisplayProps {
  type?: 'guardian' | 'capsule' | 'badge' | 'tier' | 'achievement';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}

export const NFTIconDisplay: React.FC<NFTIconDisplayProps> = ({
  type = 'guardian',
  rarity = 'common',
  size = 'md',
  animated = false,
  className = '',
  fallback
}) => {
  const { nftIcons, loading, error } = useAssets();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const rarityGradients = {
    common: 'from-slate-400 to-slate-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600',
    mythic: 'from-pink-400 to-purple-600'
  };

  const fallbackIcons = {
    guardian: Shield,
    capsule: Crown,
    badge: Star,
    tier: Zap,
    achievement: Crown
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} bg-slate-700 animate-pulse rounded-full ${className}`} />
    );
  }

  if (error || nftIcons.length === 0) {
    if (fallback) return <>{fallback}</>;
    
    const FallbackIcon = fallbackIcons[type];
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br ${rarityGradients[rarity]} rounded-full flex items-center justify-center ${animated ? 'animate-pulse' : ''} ${className}`}>
        <FallbackIcon className="w-1/2 h-1/2 text-white" />
      </div>
    );
  }

  // Find the best NFT icon for the type and rarity
  let selectedIcon = nftIcons[0];

  // Try to match by type first
  const typeMatches = nftIcons.filter(icon => 
    icon.name.toLowerCase().includes(type.toLowerCase())
  );

  if (typeMatches.length > 0) {
    // Try to match rarity within type matches
    selectedIcon = typeMatches.find(icon => 
      icon.name.toLowerCase().includes(rarity.toLowerCase())
    ) || typeMatches[0];
  } else {
    // Fallback to rarity match
    selectedIcon = nftIcons.find(icon => 
      icon.name.toLowerCase().includes(rarity.toLowerCase())
    ) || nftIcons[0];
  }

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      {/* Rarity glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rarityGradients[rarity]} rounded-full opacity-20 blur-sm ${animated ? 'animate-pulse' : ''}`} />
      
      {/* NFT Icon */}
      <img
        src={selectedIcon.url}
        alt={`${type} ${rarity} NFT`}
        className={`w-full h-full object-cover rounded-full border-2 border-gradient-to-br ${rarityGradients[rarity]} ${animated ? 'animate-bounce' : ''}`}
        onError={(e) => {
          // Fallback to icon if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const FallbackIcon = fallbackIcons[type];
          if (target.parentElement) {
            target.parentElement.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br ${rarityGradients[rarity]} rounded-full flex items-center justify-center">
                <svg class="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            `;
          }
        }}
      />
      
      {/* Rarity indicator */}
      <div className="absolute -top-1 -right-1">
        <div className={`w-4 h-4 bg-gradient-to-br ${rarityGradients[rarity]} rounded-full border border-white flex items-center justify-center`}>
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};