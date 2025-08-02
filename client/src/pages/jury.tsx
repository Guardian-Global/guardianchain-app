import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JuryVotePanel from '@/components/JuryVotePanel';
import AncestryTree from '@/components/AncestryTree';
import InstitutionAccess from '@/components/InstitutionAccess';
import { Scale, Users, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  email: string;
  tier: string;
  firstName?: string;
  lastName?: string;
}

function JuryPage() {
  const { user } = useAuth();
  const typedUser = user as User | null;

  // Mock data for demonstration
  const mockCapsule = {
    id: "caps_123",
    title: "Evidence of Environmental Cover-up in Manufacturing District",
    author: "WhistleblowerX",
    description: "Documentation showing deliberate pollution data manipulation by industrial corporation",
    category: "environmental"
  };

  const mockVotes = {
    yes: 2,
    no: 1,
    abstain: 0
  };

  const mockLineage = [
    {
      id: "caps_100",
      title: "Initial Environmental Concerns Raised",
      author: "CommunityActivist",
      date: "2024-01-15",
      generation: 0,
      relationship: 'root' as const,
      verificationStatus: 'verified' as const,
      griefScore: 8.2
    },
    {
      id: "caps_110", 
      title: "Corporate Response and Denial",
      author: "CompanyPR",
      date: "2024-01-22",
      generation: 1,
      relationship: 'child' as const,
      verificationStatus: 'verified' as const,
      griefScore: 3.1
    },
    {
      id: "caps_123",
      title: "Evidence of Environmental Cover-up in Manufacturing District",
      author: "WhistleblowerX", 
      date: "2024-02-01",
      generation: 2,
      relationship: 'child' as const,
      verificationStatus: 'pending' as const,
      griefScore: 9.7
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center">
          <Scale className="w-10 h-10 mr-3 text-blue-500" />
          Veritas Jury Portal
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Participate in decentralized truth validation as a qualified jury member. 
          Your expertise helps determine the authenticity of critical truth capsules.
        </p>
      </div>

      {/* Jury Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Scale className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">47</div>
            <div className="text-sm text-slate-400">Cases Voted</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">94%</div>
            <div className="text-sm text-slate-400">Accuracy Rate</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">8.9</div>
            <div className="text-sm text-slate-400">Reputation Score</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-slate-400">Pending Cases</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Case */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Current Case Under Review</CardTitle>
          <div className="flex space-x-2">
            <Badge className="bg-red-600">High Priority</Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-300">Environmental</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{mockCapsule.title}</h3>
              <p className="text-slate-400 mb-2">Submitted by: {mockCapsule.author}</p>
              <p className="text-slate-300">{mockCapsule.description}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <JuryVotePanel 
                capsuleId={mockCapsule.id}
                currentVotes={mockVotes}
                votingDeadline={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
                requiredConsensus={3}
                jurySize={5}
              />
              
              <AncestryTree 
                lineage={mockLineage}
                currentCapsuleId={mockCapsule.id}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Institutional Access */}
      {typedUser && typedUser.id && typedUser.email && typedUser.tier && (
        <InstitutionAccess user={{
          id: typedUser.id,
          email: typedUser.email,
          tier: typedUser.tier
        }} />
      )}

      {/* Jury Guidelines */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Jury Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-400" />
                Authenticity
              </h3>
              <p className="text-slate-400 text-sm">
                Evaluate if the capsule contains genuine, unmanipulated evidence and truthful claims.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                Impact
              </h3>
              <p className="text-slate-400 text-sm">
                Consider the potential social, legal, or historical significance of the submitted evidence.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-purple-400" />
                Standards
              </h3>
              <p className="text-slate-400 text-sm">
                Apply consistent verification standards while respecting the grief and courage of truth-tellers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default JuryPage;

// Protect this route - only Seekers and above can access jury duty
