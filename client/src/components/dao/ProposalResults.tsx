import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

interface VoteResults {
  title: string;
  total: number;
  support: number;
  reject: number;
  abstain: number;
  supportPct: string;
  rejectPct: string;
  abstainPct: string;
  result: string;
  status: string;
}

interface ProposalResultsProps {
  proposalId: string;
}

export default function ProposalResults({ proposalId }: ProposalResultsProps) {
  const {
    data: results,
    isLoading,
    error,
  } = useQuery<VoteResults>({
    queryKey: [`/api/dao/results/${proposalId}`],
  });

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface animate-pulse">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="h-6 bg-brand-surface rounded w-3/4"></div>
            <div className="h-4 bg-brand-surface rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-brand-surface rounded"></div>
              <div className="h-3 bg-brand-surface rounded"></div>
              <div className="h-3 bg-brand-surface rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <XCircle className="w-12 h-12 text-brand-danger mx-auto mb-4" />
          <h3 className="text-lg font-medium text-brand-light mb-2">
            Failed to Load Results
          </h3>
          <p className="text-brand-light/60">
            Unable to fetch voting results for this proposal.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <MinusCircle className="w-12 h-12 text-brand-light/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-brand-light mb-2">
            No Results Available
          </h3>
          <p className="text-brand-light/60">
            Voting results are not yet available for this proposal.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Passed":
        return <CheckCircle className="w-6 h-6 text-brand-accent" />;
      case "Accepted":
        return <CheckCircle className="w-6 h-6 text-brand-primary" />;
      case "Rejected":
        return <XCircle className="w-6 h-6 text-brand-danger" />;
      default:
        return <MinusCircle className="w-6 h-6 text-brand-light/60" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Passed":
        return "bg-brand-accent text-white";
      case "Accepted":
        return "bg-brand-primary text-white";
      case "Rejected":
        return "bg-brand-danger text-white";
      default:
        return "bg-brand-surface text-brand-light";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-brand-secondary border-brand-surface shadow-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-brand-light font-brand flex items-center gap-3">
                {getStatusIcon(results.status)}
                <span>{results.title}</span>
              </CardTitle>
              <div className="flex items-center gap-3 mt-3">
                <Badge className={getStatusColor(results.status)}>
                  {results.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-brand-light/60">
                  <Users className="w-4 h-4" />
                  <span>{results.total} total votes</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vote Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand-secondary border-brand-surface shadow-card">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-brand-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-brand-light mb-1">
              {results.support}
            </div>
            <div className="text-sm text-brand-light/60 mb-2">
              Support Votes
            </div>
            <div className="text-lg font-semibold text-brand-accent">
              {results.supportPct}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface shadow-card">
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 text-brand-danger mx-auto mb-3" />
            <div className="text-2xl font-bold text-brand-light mb-1">
              {results.reject}
            </div>
            <div className="text-sm text-brand-light/60 mb-2">Reject Votes</div>
            <div className="text-lg font-semibold text-brand-danger">
              {results.rejectPct}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface shadow-card">
          <CardContent className="p-6 text-center">
            <MinusCircle className="w-8 h-8 text-brand-light/60 mx-auto mb-3" />
            <div className="text-2xl font-bold text-brand-light mb-1">
              {results.abstain}
            </div>
            <div className="text-sm text-brand-light/60 mb-2">
              Abstain Votes
            </div>
            <div className="text-lg font-semibold text-brand-light/60">
              {results.abstainPct}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card className="bg-brand-secondary border-brand-surface shadow-card">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Voting Results Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Support Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-brand-accent">
                <CheckCircle className="w-4 h-4" />
                <span>Support ({results.support} votes)</span>
              </div>
              <span className="text-brand-light/60">{results.supportPct}%</span>
            </div>
            <Progress
              value={parseFloat(results.supportPct)}
              className="h-3 bg-brand-surface"
            >
              <div
                className="h-full bg-brand-accent rounded-full transition-all"
                style={{ width: `${results.supportPct}%` }}
              />
            </Progress>
          </div>

          {/* Reject Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-brand-danger">
                <XCircle className="w-4 h-4" />
                <span>Reject ({results.reject} votes)</span>
              </div>
              <span className="text-brand-light/60">{results.rejectPct}%</span>
            </div>
            <Progress
              value={parseFloat(results.rejectPct)}
              className="h-3 bg-brand-surface"
            >
              <div
                className="h-full bg-brand-danger rounded-full transition-all"
                style={{ width: `${results.rejectPct}%` }}
              />
            </Progress>
          </div>

          {/* Abstain Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-brand-light/60">
                <MinusCircle className="w-4 h-4" />
                <span>Abstain ({results.abstain} votes)</span>
              </div>
              <span className="text-brand-light/60">{results.abstainPct}%</span>
            </div>
            <Progress
              value={parseFloat(results.abstainPct)}
              className="h-3 bg-brand-surface"
            >
              <div
                className="h-full bg-brand-light/40 rounded-full transition-all"
                style={{ width: `${results.abstainPct}%` }}
              />
            </Progress>
          </div>

          {/* Final Result */}
          <div className="pt-4 border-t border-brand-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-brand-warning" />
                <span className="text-brand-light font-medium">
                  Final Result:
                </span>
              </div>
              <Badge
                className={getStatusColor(results.status)}
                variant="secondary"
              >
                {results.result}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
