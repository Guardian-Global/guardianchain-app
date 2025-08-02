import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Shield, 
  Clock, 
  Trophy, 
  Coins, 
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface EnhancedHomepageProps {
  user?: any;
}

export default function EnhancedHomepage({ user }: EnhancedHomepageProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Preload video
    const video = document.createElement('video');
    video.src = '/assets/video/GUARDIANCHAIN_PROTOCOL_VIDEO.mp4';
    video.oncanplaythrough = () => setVideoLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-slate-900 to-brand-surface">
      {/* Hero Section with Background Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {videoLoaded && (
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            src="/assets/video/GUARDIANCHAIN_PROTOCOL_VIDEO.mp4"
          />
        )}
        
        {/* Background Image Fallback */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/image/global-communication-bg.jpg)' }}
        />

        {/* Aurora Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-transparent to-brand-accent/20 animate-pulse" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/assets/logo/GTT_LOGO_PRIMARY.png" 
              alt="GuardianChain"
              className="h-24 mx-auto mb-4"
            />
          </div>

          {/* Hero Text */}
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Veritas Sealed.{' '}
            <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Truth Tokenized.
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Sovereign memory meets unstoppable infrastructure. GuardianChain vaults truth for eternity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/create-capsule">
              <Button 
                size="lg" 
                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 text-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Capsule
              </Button>
            </Link>
            <Link href="/vault">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-brand-accent text-brand-accent hover:bg-brand-accent/10 px-8 py-4 text-lg"
              >
                <Shield className="mr-2 h-5 w-5" />
                Explore Truth Vault
              </Button>
            </Link>
          </div>

          {/* Hero Icons */}
          <div className="flex justify-center gap-8 opacity-80">
            <img 
              src="/assets/icon/_icon NFT Truth Time capsule (2).png" 
              alt="Truth Capsule"
              className="h-16 w-16 animate-bounce"
            />
            <img 
              src="/assets/icon/_icon NFT time capsule (1).png" 
              alt="Time Capsule"
              className="h-16 w-16 animate-bounce delay-100"
            />
          </div>
        </div>

        {/* Floating Video Overlay */}
        <div className="absolute bottom-8 right-8 w-64 h-36 rounded-2xl overflow-hidden shadow-2xl border border-brand-primary/30">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            src="/assets/video/FIRST_TIME_UNLOCK_TRUTH.mp4"
          />
        </div>
      </section>

      {/* User Dashboard Section */}
      {user && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Your Truth Vault Dashboard</h2>
              <p className="text-slate-300 text-lg">Manage your capsules, track yields, and explore the truth ecosystem</p>
            </div>

            {/* User Profile Card */}
            <Card className="bg-slate-800/50 border-brand-primary/20 backdrop-blur-sm mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Avatar with NFT Options */}
                  <div className="relative">
                    <img 
                      src="/assets/icon/NFT Capsule Icon_1751151138.png"
                      alt="Profile Avatar"
                      className="w-20 h-20 rounded-full border-2 border-brand-primary"
                    />
                    <Badge className="absolute -top-2 -right-2 bg-brand-accent">
                      {user.tier?.toUpperCase()}
                    </Badge>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-slate-300 mb-2">{user.email}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>Capsules Created: {user.usage?.capsulesCreated || 0}</span>
                      <span>•</span>
                      <span>Wallet Connected: {user.walletAddress ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-brand-primary">12</div>
                      <div className="text-xs text-slate-400">Truth Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-brand-accent">5.2k</div>
                      <div className="text-xs text-slate-400">GTT Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-brand-green">3</div>
                      <div className="text-xs text-slate-400">Verified</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <Link href="/create-capsule">
                <Card className="bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-6 w-6 text-brand-primary" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Mint Capsule</h3>
                    <p className="text-xs text-slate-400">Create new truth</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/gtt-yield">
                <Card className="bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-brand-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Coins className="h-6 w-6 text-brand-accent" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">My Yield</h3>
                    <p className="text-xs text-slate-400">Claim rewards</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/vault">
                <Card className="bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Clock className="h-6 w-6 text-brand-green" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Time-Lock Panel</h3>
                    <p className="text-xs text-slate-400">Manage locks</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/referral">
                <Card className="bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Invite</h3>
                    <p className="text-xs text-slate-400">Earn rewards</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Dashboard Video Banner */}
            <Card className="bg-slate-800/30 border-brand-primary/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-64">
                  <video
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                    src="/assets/video/GUARDIANCHAIN_DASHBOARD_VIDEO.mp4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-2">Master the Truth Ecosystem</h3>
                      <p className="text-slate-300 mb-4">Learn advanced features and maximize your yields</p>
                      <Button className="bg-brand-primary hover:bg-brand-primary/90">
                        Watch Tutorial
                        <Play className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* NFT Gallery Preview */}
      <section className="py-16 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Truth Capsule NFT Gallery</h2>
          <p className="text-slate-300 text-lg mb-12">Explore verified truth capsules on the blockchain</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-slate-800/50 border-brand-primary/20 overflow-hidden group hover:scale-105 transition-transform">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 flex items-center justify-center">
                    <img 
                      src={`/assets/icon/NFT Truth Time capsule_1751149906.png`}
                      alt={`Truth Capsule ${i}`}
                      className="w-24 h-24 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-white mb-2">Truth Capsule #{1000 + i}</h3>
                    <p className="text-slate-400 text-sm mb-3">Verified • Grief Tier {3 + i}</p>
                    <Badge className="bg-brand-green/20 text-brand-green">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Link href="/capsules/gallery">
            <Button variant="outline" className="border-brand-accent text-brand-accent hover:bg-brand-accent/10">
              View Full Gallery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Media Gallery & Logo Strip */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Explore GuardianChain</h2>
            <p className="text-slate-300 text-lg">Learn how truth preservation works on the blockchain</p>
          </div>

          {/* Video Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-brand-primary/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    poster="/assets/video/GUARDIANCHAIN_CAPSULE_VIDEO.mp4"
                    src="/assets/video/GUARDIANCHAIN_CAPSULE_VIDEO.mp4"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-white mb-2">Capsule Creation Guide</h3>
                  <p className="text-slate-400 text-sm">Learn how to create and mint truth capsules</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-brand-primary/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    poster="/assets/video/BLOCKCHAIN_BACKGROUND_VIDEO.mp4"
                    src="/assets/video/BLOCKCHAIN_BACKGROUND_VIDEO.mp4"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-white mb-2">Blockchain Technology</h3>
                  <p className="text-slate-400 text-sm">Understanding decentralized truth storage</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logo Strip */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-8">Powered by Cutting-Edge Technology</h3>
            <div className="flex justify-center items-center gap-12 opacity-70">
              <img src="/assets/logo/GTT_LOGO_PRIMARY.png" alt="GTT" className="h-12" />
              <img src="/assets/logo/GUARDIANCHAIN_logo.png" alt="GuardianChain" className="h-12" />
              <img src="/assets/logo/BLOCK_ICON.png" alt="Blockchain" className="h-12" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}