import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Inbox, Eye, CheckCircle, Clock, User, Star } from 'lucide-react';
import { Link } from 'wouter';

interface PendingCapsule {
  id: string;
  title: string;
  description: string;
  griefScore: number;
  user: string;
  category: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'needs_verification';
  priority: 'low' | 'medium' | 'high';
}

export default function CapsuleInbox() {
  const { data: capsules, isLoading } = useQuery({
    queryKey: ['/api/capsules/pending'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const pendingCapsules = capsules || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-600';
      case 'under_review': return 'bg-orange-600';
      case 'needs_verification': return 'bg-purple-600';
      default: return 'bg-slate-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Inbox className="w-5 h-5 mr-2 text-blue-400" />
            Capsule Inbox
          </div>
          <Badge className="bg-blue-600 text-white">
            {pendingCapsules.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {pendingCapsules.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No pending capsules</p>
            <p className="text-sm">New submissions will appear here for review</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
            {pendingCapsules.map((capsule: PendingCapsule) => (
              <div key={capsule.id} className="border border-slate-600 p-4 rounded-lg hover:border-slate-500 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">
                      {capsule.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {capsule.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={`${getPriorityColor(capsule.priority)} text-white text-xs`}>
                      {capsule.priority}
                    </Badge>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-3 h-3 mr-1" />
                      <span className="text-xs">{capsule.griefScore}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {capsule.user}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(capsule.submittedAt).toLocaleDateString()}
                    </div>
                    <Badge 
                      className={`${getStatusColor(capsule.status)} text-white text-xs`}
                    >
                      {capsule.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/capsule/${capsule.id}`}>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </Link>
                    <Link href={`/verify/${capsule.id}`}>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Certify
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}