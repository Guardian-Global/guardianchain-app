import { useState } from 'react';
import { ExternalLink, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CapsuleEmbedProps {
  name: string;
  description: string;
  image: string;
  ipfsUrl: string;
  creator?: string;
  timestamp?: string;
  yieldAmount?: number;
}

export default function CapsuleEmbed({
  name,
  description,
  image,
  ipfsUrl,
  creator,
  timestamp,
  yieldAmount
}: CapsuleEmbedProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleViewCapsule = () => {
    window.open(ipfsUrl, '_blank');
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 group">
      <div className="relative aspect-video overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            data-testid={`img-capsule-${name.replace(/\s+/g, '-').toLowerCase()}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
            <div className="text-4xl">📦</div>
          </div>
        )}
        
        {!imageLoaded && image && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
            <div className="text-cyan-400">Loading...</div>
          </div>
        )}
        
        {yieldAmount && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-cyan-500 to-purple-600 px-2 py-1 rounded-lg text-xs font-semibold text-white">
            +{yieldAmount} GTT
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1" data-testid={`text-capsule-title-${name.replace(/\s+/g, '-').toLowerCase()}`}>
          {name}
        </h3>
        
        <p className="text-gray-300 text-sm mb-3 line-clamp-2" data-testid={`text-capsule-description-${name.replace(/\s+/g, '-').toLowerCase()}`}>
          {description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          {creator && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{creator}</span>
            </div>
          )}
          
          {timestamp && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(timestamp).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleViewCapsule}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          data-testid={`button-view-capsule-${name.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <span>View on IPFS</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}