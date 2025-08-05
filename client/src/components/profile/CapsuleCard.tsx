import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Award, 
  Calendar, 
  User, 
  Eye, 
  GitBranch,
  ExternalLink,
  Lock,
  Unlock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CapsuleCardProps {
  capsule: {
    id: string;
    title: string;
    author: string;
    createdAt: string;
    verified: boolean;
    daoCertified: boolean;
    tier: string;
    isTimeSealed?: boolean;
    unlockDate?: string;
    gttEarned?: number;
    viewCount?: number;
    hasLineage?: boolean;
  };
  showActions?: boolean;
  onViewDetails?: (capsuleId: string) => void;
  onViewLineage?: (capsuleId: string) => void;
}

export default function CapsuleCard({ 
  capsule, 
  showActions = true,
  onViewDetails,
  onViewLineage 
}: CapsuleCardProps) {
  const isLocked = capsule.isTimeSealed && capsule.unlockDate && new Date(capsule.unlockDate) > new Date();

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate mb-1">
              {capsule.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <User className="w-3 h-3" />
              <span>{capsule.author}</span>
              <Calendar className="w-3 h-3 ml-2" />
              <span>{formatDistanceToNow(new Date(capsule.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 ml-2">
            {capsule.verified && (
              <Badge 
                variant="outline" 
                className="text-green-400 border-green-600 bg-green-900/20 text-xs"
              >
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {capsule.daoCertified && (
              <Badge 
                variant="outline" 
                className="text-purple-400 border-purple-600 bg-purple-900/20 text-xs"
              >
                <Award className="w-3 h-3 mr-1" />
                DAO Certified ✅
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Status and Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-slate-400">
                <Eye className="w-3 h-3" />
                <span>{capsule.viewCount || 0}</span>
              </div>
              {capsule.gttEarned && (
                <div className="text-cyan-400 font-medium">
                  +{capsule.gttEarned} GTT
                </div>
              )}
              {capsule.hasLineage && (
                <div className="flex items-center gap-1 text-purple-400">
                  <GitBranch className="w-3 h-3" />
                  <span>Lineage</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {isLocked ? (
                <div className="flex items-center gap-1 text-amber-400">
                  <Lock className="w-3 h-3" />
                  <span className="text-xs">Sealed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-400">
                  <Unlock className="w-3 h-3" />
                  <span className="text-xs">Unlocked</span>
                </div>
              )}
            </div>
          </div>

          {/* Time Lock Info */}
          {isLocked && capsule.unlockDate && (
            <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-2">
              <div className="text-xs text-amber-400">
                Unlocks {formatDistanceToNow(new Date(capsule.unlockDate), { addSuffix: true })}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-cyan-400 border-cyan-600 hover:bg-cyan-900/20"
                onClick={() => onViewDetails?.(capsule.id)}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Details
              </Button>
              {capsule.hasLineage && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-purple-400 border-purple-600 hover:bg-purple-900/20"
                  onClick={() => onViewLineage?.(capsule.id)}
                >
                  <GitBranch className="w-3 h-3 mr-1" />
                  Lineage
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}