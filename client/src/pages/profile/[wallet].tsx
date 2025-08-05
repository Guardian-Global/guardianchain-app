import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import VoiceRecall from '@/components/VoiceRecall';
import CapsuleEmbed from '@/components/CapsuleEmbed';
import { apiRequest } from '@/lib/queryClient';
import { Wallet, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaItem {
  id: string;
  name: string;
  description: string;
  image_url: string;
  ipfs_url: string;
  creator?: string;
  timestamp?: string;
  yieldAmount?: number;
}

export default function ProfilePage() {
  const [location, setLocation] = useLocation();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Extract wallet from URL path
  const wallet = location.split('/profile/')[1];

  const loadMedia = async () => {
    if (!wallet) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest('GET', `/api/user-media?wallet=${wallet}`);
      setMedia(response);
    } catch (err) {
      console.error('Failed to load user media:', err);
      setError('Failed to load capsule gallery');
      // Use mock data for demo
      setMedia([
        {
          id: 'demo-1',
          name: 'Family Memory',
          description: 'A precious family moment captured forever',
          image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
          ipfs_url: 'https://ipfs.io/ipfs/QmDemo1',
          creator: wallet,
          timestamp: new Date().toISOString(),
          yieldAmount: 2.5
        },
        {
          id: 'demo-2',
          name: 'Life Milestone',
          description: 'An important achievement worth preserving',
          image_url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400',
          ipfs_url: 'https://ipfs.io/ipfs/QmDemo2',
          creator: wallet,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          yieldAmount: 3.2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearch = async (phrase: string) => {
    try {
      // In production, this would call the voice matching API
      const response = await apiRequest('POST', '/api/voice-search', {
        query: phrase,
        wallet
      });
      setMedia(response);
    } catch (err) {
      console.error('Voice search failed:', err);
      // Filter existing media based on search phrase
      const filtered = media.filter(item => 
        item.name.toLowerCase().includes(phrase.toLowerCase()) ||
        item.description.toLowerCase().includes(phrase.toLowerCase())
      );
      setMedia(filtered);
    }
  };

  useEffect(() => {
    if (wallet) loadMedia();
  }, [wallet]);

  if (!wallet) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Invalid Profile</h1>
          <p className="text-gray-300">Wallet address not found in URL</p>
          <Button 
            onClick={() => setLocation('/')}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-600"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-6">
        <Button
          onClick={() => setLocation('/')}
          className="mb-4 bg-slate-800 hover:bg-slate-700 text-white"
          data-testid="button-back-home"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold text-white" data-testid="text-profile-title">
              Capsule Gallery
            </h1>
            <p className="text-gray-300 font-mono text-sm" data-testid="text-wallet-address">
              {wallet}
            </p>
          </div>
        </div>
      </div>

      <VoiceRecall onSearch={handleVoiceSearch} />

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-cyan-400">Loading capsule gallery...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mt-6">
          <p className="text-red-300">{error}</p>
          <p className="text-sm text-red-400 mt-2">Showing demo data instead</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {media.length > 0 ? (
          media.map((item) => (
            <CapsuleEmbed
              key={item.id}
              name={item.name}
              description={item.description}
              image={item.image_url}
              ipfsUrl={item.ipfs_url}
              creator={item.creator}
              timestamp={item.timestamp}
              yieldAmount={item.yieldAmount}
            />
          ))
        ) : (
          !loading && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Capsules Found</h3>
              <p className="text-gray-400">This wallet hasn't created any capsules yet</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}