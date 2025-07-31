import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Shield,
  AlertTriangle,
  Gavel
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface JuryVotePanelProps {
  capsuleId: string;
  currentVotes?: {
    yes: number;
    no: number;
    abstain: number;
  };
  userVote?: 'yes' | 'no' | 'abstain' | null;
  votingDeadline?: string;
  requiredConsensus?: number;
  jurySize?: number;
}

export default function JuryVotePanel({ 
  capsuleId, 
  currentVotes = { yes: 0, no: 0, abstain: 0 },
  userVote = null,
  votingDeadline,
  requiredConsensus = 3,
  jurySize = 5
}: JuryVotePanelProps) {
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | 'abstain' | null>(userVote);
  const [submitted, setSubmitted] = useState(!!userVote);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (vote: 'yes' | 'no' | 'abstain') => 
      apiRequest('POST', `/api/capsules/${capsuleId}/vote`, { vote }),
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Vote Submitted",
        description: "Your jury vote has been recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/capsules/${capsuleId}/votes`] });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to submit vote",
        variant: "destructive",
      });
    },
  });

  const submitVote = () => {
    if (selectedVote) {
      voteMutation.mutate(selectedVote);
    }
  };

  const totalVotes = currentVotes.yes + currentVotes.no + currentVotes.abstain;
  const yesPercentage = totalVotes > 0 ? (currentVotes.yes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (currentVotes.no / totalVotes) * 100 : 0;
  const consensusReached = currentVotes.yes >= requiredConsensus || currentVotes.no >= requiredConsensus;
  
  const timeRemaining = votingDeadline ? 
    Math.max(0, new Date(votingDeadline).getTime() - Date.now()) : null;
  
  const hoursRemaining = timeRemaining ? Math.floor(timeRemaining / (1000 * 60 * 60)) : null;

  if (submitted && userVote) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Vote Submitted</h3>
          <p className="text-slate-400">
            Your vote has been recorded. Thank you for participating in Veritas jury duty.
          </p>
          <Badge className="mt-3 bg-green-600">
            Your Vote: {userVote.toUpperCase()}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Scale className="w-5 h-5 mr-2 text-blue-400" />
          Veritas Jury Voting
        </CardTitle>
        <div className="flex items-center justify-between">
          <Badge className="bg-purple-600 text-white">
            <Gavel className="w-3 h-3 mr-1" />
            Jury Duty Active
          </Badge>
          {hoursRemaining !== null && (
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              <Clock className="w-3 h-3 mr-1" />
              {hoursRemaining}h remaining
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Question */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-yellow-400" />
            Jury Question: Is this capsule authentic and truthful?
          </h3>
          <p className="text-slate-400 text-sm">
            As a Veritas jury member, evaluate this capsule's authenticity, accuracy, and adherence to truth preservation standards.
          </p>
        </div>

        {/* Current Voting Status */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Current Consensus</span>
            <span className="text-white">{totalVotes}/{jurySize} votes cast</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-400">Authentic ({currentVotes.yes})</span>
              </div>
              <span className="text-green-400">{yesPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={yesPercentage} className="bg-slate-700" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <XCircle className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-red-400">Not Authentic ({currentVotes.no})</span>
              </div>
              <span className="text-red-400">{noPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={noPercentage} className="bg-slate-700" />
          </div>
        </div>

        {/* Consensus Status */}
        {consensusReached ? (
          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">Consensus Reached</span>
            </div>
            <p className="text-green-300 text-sm mt-1">
              {currentVotes.yes >= requiredConsensus ? 'Capsule verified as authentic' : 'Capsule rejected as inauthentic'}
            </p>
          </div>
        ) : (
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-3">
            <div className="flex items-center text-yellow-400">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="font-medium">Consensus Pending</span>
            </div>
            <p className="text-yellow-300 text-sm mt-1">
              {requiredConsensus - Math.max(currentVotes.yes, currentVotes.no)} more votes needed for consensus
            </p>
          </div>
        )}

        {/* Voting Buttons */}
        {!submitted && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={selectedVote === 'yes' ? 'default' : 'outline'}
                onClick={() => setSelectedVote('yes')}
                className={`${selectedVote === 'yes' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Authentic
              </Button>
              
              <Button
                variant={selectedVote === 'no' ? 'default' : 'outline'}
                onClick={() => setSelectedVote('no')}
                className={`${selectedVote === 'no' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Not Authentic
              </Button>
              
              <Button
                variant={selectedVote === 'abstain' ? 'default' : 'outline'}
                onClick={() => setSelectedVote('abstain')}
                className={`${selectedVote === 'abstain' 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Abstain
              </Button>
            </div>
            
            <Button 
              onClick={submitVote}
              disabled={!selectedVote || voteMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {voteMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Submitting Vote...
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4 mr-2" />
                  Cast Jury Vote
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}