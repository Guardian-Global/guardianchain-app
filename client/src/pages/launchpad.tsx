import { useState } from 'react';
import { Rocket, Star, Vote, Clock, Trophy, Users, Zap, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BRAND_NAME, BRAND_COLORS, LAUNCHPAD_CONFIG } from '@/lib/constants';

export default function LaunchpadPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { toast } = useToast();

  const featuredProjects = [
    {
      id: 'climate-truth',
      title: 'Climate Data Verification Network',
      creator: 'Dr. Sarah Chen',
      description: 'A decentralized system for verifying climate research data and environmental claims.',
      category: 'Environment',
      votes: 247,
      timeLeft: '3 days',
      reward: 2000,
      image: '/api/placeholder/400/200',
      progress: 82,
      backers: 156
    },
    {
      id: 'medical-research',
      title: 'Peer-Reviewed Medical Truth Archive',
      creator: 'Prof. Michael Rodriguez',
      description: 'Building a blockchain-based archive of peer-reviewed medical research.',
      category: 'Health',
      votes: 189,
      timeLeft: '5 days',
      reward: 2000,
      image: '/api/placeholder/400/200',
      progress: 67,
      backers: 123
    },
    {
      id: 'legal-evidence',
      title: 'Legal Evidence Verification System',
      creator: 'Attorney Lisa Wang',
      description: 'Immutable verification system for legal evidence and court documents.',
      category: 'Legal',
      votes: 134,
      timeLeft: '2 days',
      reward: 2000,
      image: '/api/placeholder/400/200',
      progress: 45,
      backers: 89
    }
  ];

  const upcomingProjects = [
    {
      id: 'news-verification',
      title: 'Real-Time News Verification',
      creator: 'NewsGuard Team',
      description: 'AI-powered system for real-time news verification and fact-checking.',
      category: 'Technology',
      launchDate: '2025-07-25',
      preVotes: 67
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Truth Tracking',
      creator: 'TraceChain Inc.',
      description: 'End-to-end supply chain verification for consumer transparency.',
      category: 'Business',
      launchDate: '2025-07-28',
      preVotes: 45
    }
  ];

  const handleVote = (projectId: string) => {
    toast({
      title: "Vote Submitted",
      description: `Your vote for ${projectId} has been recorded`,
    });
  };

  const handleBack = (projectId: string) => {
    toast({
      title: "Project Backed",
      description: `You've successfully backed this project with GTT tokens`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-green-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Rocket className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">
                  <span style={{ color: BRAND_COLORS.GUARDIAN }}>GUARDIAN</span>
                  <span style={{ color: BRAND_COLORS.CHAIN }}>CHAIN</span>
                  {' '}Launchpad
                </span>
                <p className="text-slate-400 text-sm font-normal">
                  Discover and support the next generation of truth verification projects
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Featured Projects</p>
                  <p className="text-2xl font-bold text-white">{featuredProjects.length}</p>
                </div>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Votes</p>
                  <p className="text-2xl font-bold text-white">570</p>
                </div>
                <Vote className="h-5 w-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Backers</p>
                  <p className="text-2xl font-bold text-white">368</p>
                </div>
                <Users className="h-5 w-5 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">GTT Distributed</p>
                  <p className="text-2xl font-bold text-white">12.5K</p>
                </div>
                <Trophy className="h-5 w-5 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-white">Featured Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="bg-slate-700/30 border-slate-600 hover:border-slate-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge className="bg-purple-600 text-white">
                          {project.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          {project.timeLeft}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-2">by {project.creator}</p>
                        <p className="text-slate-300 text-sm">{project.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-green-400 font-semibold">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Vote className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-slate-300">{project.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-slate-300">{project.backers}</span>
                          </div>
                        </div>
                        <div className="text-sm text-yellow-400 font-semibold">
                          {project.reward} GTT
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVote(project.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Vote
                        </Button>
                        <Button
                          onClick={() => handleBack(project.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          Back Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Projects */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-white">Upcoming Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingProjects.map((project) => (
                <Card key={project.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge className="bg-slate-600 text-white">
                          {project.category}
                        </Badge>
                        <div className="text-sm text-slate-400">
                          Launches {project.launchDate}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-2">by {project.creator}</p>
                        <p className="text-slate-300 text-sm">{project.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-slate-300">{project.preVotes} pre-votes</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300"
                        >
                          Get Notified
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}