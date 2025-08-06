import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Eye, Lock, Calendar, Star } from "lucide-react";
import { Link } from "wouter";

interface Capsule {
  id: string;
  title: string;
  description: string;
  type: string;
  verified: boolean;
  truthScore?: number;
  createdAt: string;
  isTimeSealed?: boolean;
  unlockDate?: string;
}

interface CapsuleReelsProps {
  capsules: Capsule[];
}

export default function CapsuleReels({ capsules }: CapsuleReelsProps) {
  if (capsules.length === 0) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <Play className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
          <p className="text-brand-light/60">No capsules created yet</p>
          <p className="text-xs text-brand-light/40 mt-2">
            Start preserving your truth with your first capsule
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "memory":
        return "text-blue-400 border-blue-500";
      case "legacy":
        return "text-purple-400 border-purple-500";
      case "testimony":
        return "text-green-400 border-green-500";
      case "truth":
        return "text-yellow-400 border-yellow-500";
      default:
        return "text-brand-accent border-brand-accent";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-light">Truth Capsules</h3>
        <Badge variant="outline" className="text-brand-light border-brand-light/20">
          {capsules.length} Total
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capsules.slice(0, 6).map((capsule) => (
          <Card
            key={capsule.id}
            className="bg-brand-secondary border-brand-surface hover:border-brand-accent/50 transition-all duration-200 group"
            data-testid={`reel-${capsule.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge
                  variant="outline"
                  className={getTypeColor(capsule.type)}
                >
                  {capsule.type}
                </Badge>
                
                <div className="flex items-center gap-1">
                  {capsule.verified && (
                    <div className="w-2 h-2 bg-green-400 rounded-full" title="Verified" />
                  )}
                  {capsule.isTimeSealed && (
                    <Lock className="w-3 h-3 text-brand-warning" title="Time Sealed" />
                  )}
                </div>
              </div>
              
              <CardTitle className="text-brand-light group-hover:text-brand-accent transition-colors line-clamp-2">
                {capsule.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-brand-light/70 line-clamp-3">
                {capsule.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-brand-light/50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
                </div>
                
                {capsule.truthScore && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-brand-warning" />
                    <span>{capsule.truthScore}%</span>
                  </div>
                )}
              </div>

              {/* Time Sealed Info */}
              {capsule.isTimeSealed && capsule.unlockDate && (
                <div className="p-2 bg-brand-warning/10 border border-brand-warning/20 rounded text-xs">
                  <div className="flex items-center gap-1 text-brand-warning">
                    <Lock className="w-3 h-3" />
                    <span>Unlocks {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {/* Action */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full border-brand-light/20 hover:bg-brand-light/10 text-brand-light"
                data-testid={`button-view-reel-${capsule.id}`}
              >
                <Link href={`/capsule/${capsule.id}`}>
                  <Eye className="w-3 h-3 mr-2" />
                  {capsule.isTimeSealed ? "Preview" : "View"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {capsules.length > 6 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            className="border-brand-light/20 text-brand-light hover:bg-brand-light/10"
            data-testid="button-view-all-capsules"
          >
            View All {capsules.length} Capsules
          </Button>
        </div>
      )}
    </div>
  );
}