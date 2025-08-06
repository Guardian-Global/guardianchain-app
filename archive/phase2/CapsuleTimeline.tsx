import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CapsuleWithSMRI } from './CapsuleWithSMRI';
import { useAuth } from '@/hooks/useAuth';
import { Clock, TrendingUp, Users, Award } from 'lucide-react';

interface Capsule {
  id: string;
  title: string;
  content: string;
  author: string;
  grief_tier: number;
  category: string;
  created_at: string;
  replays: number;
  yield_earned: number;
}

export function CapsuleTimeline() {
  const { user } = useAuth();
  
  // Try FastAPI first, fallback to main API
  const { data: capsules, isLoading, error } = useQuery({
    queryKey: ['/api/capsules'],
    queryFn: async () => {
      // Try FastAPI Veritas Node first
      try {
        const fastApiResponse = await fetch('http://localhost:5000/fastapi/capsules');
        if (fastApiResponse.ok) {
          return await fastApiResponse.json();
        }
      } catch (fastApiError) {
        console.log('FastAPI not available, using main API');
      }
      
      // Fallback to main API
      const mainApiResponse = await fetch('/api/capsules');
      if (!mainApiResponse.ok) {
        throw new Error('Failed to fetch capsules');
      }
      return await mainApiResponse.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Truth Vault Timeline</h2>
          <p className="text-muted-foreground">Loading capsules from Veritas network...</p>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Failed to load capsules. Please try again.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatCapsuleForDisplay = (capsule: any) => ({
    id: capsule.id,
    title: capsule.title,
    content: capsule.content,
    author: capsule.author,
    createdAt: capsule.created_at || capsule.createdAt
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Truth Vault Timeline
        </h2>
        <p className="text-muted-foreground">
          Recent capsules from the Veritas network • Generate SMRI badges from any capsule
        </p>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
            <div className="text-2xl font-bold">{capsules?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Active Capsules</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">
              {capsules?.reduce((sum: number, c: any) => sum + (c.yield_earned || 0), 0) || 0}
            </div>
            <p className="text-sm text-muted-foreground">GTT Earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">
              {capsules?.reduce((sum: number, c: any) => sum + (c.replays || 0), 0) || 0}
            </div>
            <p className="text-sm text-muted-foreground">Total Replays</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">∞</div>
            <p className="text-sm text-muted-foreground">SMRI Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Capsule List */}
      <div className="space-y-4">
        {capsules?.map((capsule: any) => (
          <CapsuleWithSMRI
            key={capsule.id}
            capsule={formatCapsuleForDisplay(capsule)}
            userWallet={user?.walletAddress}
          />
        ))}
      </div>

      {(!capsules || capsules.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Capsules Found</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to create a truth capsule in the Veritas network
            </p>
            <Button>Create First Capsule</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}