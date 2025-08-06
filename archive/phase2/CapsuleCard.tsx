import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  GitBranch, 
  Shield, 
  Award, 
  Clock, 
  Coins,
  Lock,
  Users
} from 'lucide-react';

interface CapsuleData {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  verified: boolean;
  daoCertified: boolean;
  tier?: string;
  isTimeSealed?: boolean;
  unlockDate?: string;
  gttEarned?: number;
  viewCount?: number;
  hasLineage?: boolean;
}

interface CapsuleCardProps {
  capsule: CapsuleData;
  onViewDetails: (capsuleId: string) => void;
  onViewLineage: (capsuleId: string) => void;
}

export default function CapsuleCard({ 
  capsule, 
  onViewDetails, 
  onViewLineage 
}: CapsuleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'sovereign': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'creator': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'seeker': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'explorer': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-semibold text-white truncate pr-2">
            {capsule.title}
          </CardTitle>
          <div className="flex gap-1 flex-shrink-0">
            {capsule.verified && (
              <Badge variant="outline" className="text-green-400 border-green-600 px-1 py-0">
                <Shield className="w-3 h-3" />
              </Badge>
            )}
            {capsule.daoCertified && (
              <Badge variant="outline" className="text-purple-400 border-purple-600 px-1 py-0">
                <Award className="w-3 h-3" />
              </Badge>
            )}
            {capsule.isTimeSealed && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-600 px-1 py-0">
                <Lock className="w-3 h-3" />
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>by {capsule.author}</span>
          {capsule.tier && (
            <Badge variant="outline" className={`${getTierColor(capsule.tier)} text-xs px-2 py-0`}>
              {capsule.tier}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Eye className="w-3 h-3" />
            <span>{capsule.viewCount || 0} views</span>
          </div>
          {capsule.gttEarned && capsule.gttEarned > 0 && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Coins className="w-3 h-3" />
              <span>{capsule.gttEarned} GTT</span>
            </div>
          )}
        </div>

        {/* Time Info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Created {formatDate(capsule.createdAt)}</span>
          </div>
          {capsule.isTimeSealed && capsule.unlockDate && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Lock className="w-3 h-3" />
              <span>Unlocks {formatDate(capsule.unlockDate)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(capsule.id)}
            className="text-cyan-400 border-cyan-600 hover:bg-cyan-600/20"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewLineage(capsule.id)}
            className="text-purple-400 border-purple-600 hover:bg-purple-600/20"
            disabled={!capsule.hasLineage}
          >
            <GitBranch className="w-3 h-3 mr-1" />
            Lineage
          </Button>
        </div>

        {/* Certification Status Bar */}
        <div className="flex gap-1 pt-1">
          {capsule.verified && (
            <div className="flex-1 h-1 bg-green-500/50 rounded-full"></div>
          )}
          {capsule.daoCertified && (
            <div className="flex-1 h-1 bg-purple-500/50 rounded-full"></div>
          )}
          {!capsule.verified && !capsule.daoCertified && (
            <div className="flex-1 h-1 bg-slate-600 rounded-full"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}