import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Star, Calendar, Eye, Lock } from "lucide-react";
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
  verificationDate?: string;
  verifiedBy?: string;
}

interface VerifiedCapsulesGridProps {
  capsules: Capsule[];
}

export default function VerifiedCapsulesGrid({ capsules }: VerifiedCapsulesGridProps) {
  if (capsules.length === 0) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
          <p className="text-brand-light/60">No verified capsules yet</p>
          <p className="text-xs text-brand-light/40 mt-2">
            Submit capsules for community verification to earn truth scores
          </p>
        </CardContent>
      </Card>
    );
  }

  const getVerificationLevel = (truthScore: number) => {
    if (truthScore >= 95) return { level: "SUPREME", color: "text-yellow-400 border-yellow-500" };
    if (truthScore >= 85) return { level: "HIGH", color: "text-green-400 border-green-500" };
    if (truthScore >= 70) return { level: "MEDIUM", color: "text-blue-400 border-blue-500" };
    return { level: "BASIC", color: "text-purple-400 border-purple-500" };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {capsules.map((capsule) => {
        const verification = capsule.truthScore ? getVerificationLevel(capsule.truthScore) : null;
        
        return (
          <Card
            key={capsule.id}
            className="bg-brand-secondary border-brand-surface hover:border-brand-accent/50 transition-all duration-200 group"
            data-testid={`verified-capsule-${capsule.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-500"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
                
                {capsule.isTimeSealed && (
                  <Lock className="w-4 h-4 text-brand-warning" title="Time Sealed" />
                )}
              </div>
              
              <CardTitle className="text-brand-light group-hover:text-brand-accent transition-colors line-clamp-2">
                {capsule.title}
              </CardTitle>
              
              <div className="text-xs text-brand-light/50">
                Type: {capsule.type}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-brand-light/70 line-clamp-3">
                {capsule.description}
              </p>

              {/* Truth Score */}
              {capsule.truthScore && verification && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-brand-warning" />
                    <span className="text-sm font-medium text-brand-light">
                      Truth Score: {capsule.truthScore}%
                    </span>
                  </div>
                  
                  <Badge
                    variant="outline"
                    className={verification.color}
                  >
                    {verification.level}
                  </Badge>
                </div>
              )}

              {/* Verification Details */}
              <div className="space-y-2 text-xs text-brand-light/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {new Date(capsule.createdAt).toLocaleDateString()}</span>
                </div>
                
                {capsule.verificationDate && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>Verified: {new Date(capsule.verificationDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {capsule.verifiedBy && (
                  <div className="text-xs text-brand-light/50">
                    Verified by: {capsule.verifiedBy}
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

              {/* Action Button */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full border-brand-light/20 hover:bg-brand-light/10 text-brand-light"
                data-testid={`button-view-verified-${capsule.id}`}
              >
                <Link href={`/capsule/${capsule.id}`}>
                  <Eye className="w-3 h-3 mr-2" />
                  {capsule.isTimeSealed ? "Preview Verified" : "View Verified"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}