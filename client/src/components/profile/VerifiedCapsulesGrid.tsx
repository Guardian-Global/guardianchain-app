import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Calendar, User } from "lucide-react";
import { Link } from "wouter";

interface Capsule {
  id: string;
  title: string;
  description: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  truthScore?: number;
  createdAt: string;
  isTimeSealed?: boolean;
  unlockDate?: string;
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
            Capsules become verified through community validation
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {capsules.map((capsule) => (
        <Card
          key={capsule.id}
          className="bg-brand-secondary border-brand-surface hover:border-brand-accent/50 transition-all duration-200 group"
          data-testid={`capsule-${capsule.id}`}
        >
          <CardContent className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-500"
                >
                  Verified
                </Badge>
              </div>
              {capsule.truthScore && (
                <Badge
                  variant="outline"
                  className="text-brand-warning border-brand-warning"
                >
                  {capsule.truthScore}%
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h4 className="font-semibold text-brand-light group-hover:text-brand-accent transition-colors line-clamp-2">
                {capsule.title}
              </h4>
              <p className="text-sm text-brand-light/70 line-clamp-3">
                {capsule.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-xs text-brand-light/50">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Created {new Date(capsule.createdAt).toLocaleDateString()}</span>
              </div>
              
              {capsule.verifiedAt && (
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>Verified {new Date(capsule.verifiedAt).toLocaleDateString()}</span>
                </div>
              )}
              
              {capsule.verifiedBy && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>By {capsule.verifiedBy}</span>
                </div>
              )}

              {capsule.isTimeSealed && capsule.unlockDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-warning" />
                  <span>Unlocks {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full border-brand-light/20 hover:bg-brand-light/10 text-brand-light"
                data-testid={`button-view-capsule-${capsule.id}`}
              >
                <Link href={`/capsule/${capsule.id}`}>
                  <Eye className="w-3 h-3 mr-2" />
                  View Capsule
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}