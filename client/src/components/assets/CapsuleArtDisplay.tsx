import React from 'react';
import { useAssets } from './AssetProvider';
import { FileText, Image, Video, File } from 'lucide-react';

interface CapsuleArtDisplayProps {
  variant?: 'cover' | 'thumbnail' | 'background' | 'icon';
  category?: 'truth' | 'legal' | 'news' | 'science' | 'creative' | 'civic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: React.ReactNode;
}

export const CapsuleArtDisplay: React.FC<CapsuleArtDisplayProps> = ({
  variant = 'cover',
  category = 'truth',
  size = 'md',
  className = '',
  fallback
}) => {
  const { capsuleArt, loading, error } = useAssets();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const categoryGradients = {
    truth: 'from-blue-500 to-purple-600',
    legal: 'from-slate-500 to-slate-700',
    news: 'from-red-500 to-orange-600',
    science: 'from-green-500 to-teal-600',
    creative: 'from-pink-500 to-purple-600',
    civic: 'from-indigo-500 to-blue-600'
  };

  const fallbackIcons = {
    truth: FileText,
    legal: File,
    news: FileText,
    science: File,
    creative: Image,
    civic: FileText
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} bg-slate-700 animate-pulse rounded-lg ${className}`} />
    );
  }

  if (error || capsuleArt.length === 0) {
    if (fallback) return <>{fallback}</>;
    
    const FallbackIcon = fallbackIcons[category];
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br ${categoryGradients[category]} rounded-lg flex items-center justify-center ${className}`}>
        <FallbackIcon className="w-1/2 h-1/2 text-white" />
      </div>
    );
  }

  // Find the best capsule art for the variant and category
  let selectedArt = capsuleArt[0];

  // Try to match by variant first
  const variantMatches = capsuleArt.filter(art => 
    art.name.toLowerCase().includes(variant.toLowerCase())
  );

  if (variantMatches.length > 0) {
    // Try to match category within variant matches
    selectedArt = variantMatches.find(art => 
      art.name.toLowerCase().includes(category.toLowerCase())
    ) || variantMatches[0];
  } else {
    // Try to match by category
    selectedArt = capsuleArt.find(art => 
      art.name.toLowerCase().includes(category.toLowerCase())
    ) || capsuleArt[0];
  }

  return (
    <div className={`${sizeClasses[size]} relative overflow-hidden rounded-lg ${className}`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[category]} opacity-20`} />
      
      {/* Capsule Art */}
      <img
        src={selectedArt.url}
        alt={`${category} capsule ${variant}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to gradient with icon if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const FallbackIcon = fallbackIcons[category];
          if (target.parentElement) {
            const gradientDiv = target.parentElement.querySelector('div');
            if (gradientDiv) {
              gradientDiv.className = `absolute inset-0 bg-gradient-to-br ${categoryGradients[category]} flex items-center justify-center`;
              gradientDiv.innerHTML = `
                <svg class="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                </svg>
              `;
            }
          }
        }}
      />
      
      {/* Category indicator */}
      <div className="absolute top-2 right-2">
        <div className={`px-2 py-1 bg-black/50 rounded text-white text-xs capitalize`}>
          {category}
        </div>
      </div>
      
      {/* Variant indicator for covers */}
      {variant === 'cover' && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="text-white text-sm font-medium capitalize">
            {variant} Art
          </div>
        </div>
      )}
    </div>
  );
};