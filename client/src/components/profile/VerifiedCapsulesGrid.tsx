import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Star, 
  Eye, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { getUserCapsules } from "@/lib/profile-api";

interface VerifiedCapsulesGridProps {
  userId: string;
}

export default function VerifiedCapsulesGrid({ userId }: VerifiedCapsulesGridProps) {
  const { data: capsules = [], isLoading } = useQuery({
    queryKey: [`/api/profile/${userId}/verified-capsules`],
    queryFn: () => getUserCapsules(userId),
  });

  const verifiedCapsules = capsules.filter(capsule => capsule.verified);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCapsuleTypeColor = (type: string) => {
    switch (type) {
      case "family":
        return "text-blue-400 border-blue-500";
      case "milestone":
        return "text-green-400 border-green-500";
      case "future":
        return "text-purple-400 border-purple-500";
      default:
        return "text-brand-accent border-brand-accent";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-brand-light/60">Loading verified capsules...</p>
        </CardContent>
      </Card>
    );
  }

  if (verifiedCapsules.length === 0) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
          <p className="text-brand-light/60">No verified capsules yet</p>
          <p className="text-xs text-brand-light/40 mt-2">
            Create and verify capsules to see them here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-light flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Verified Capsules
        </h3>
        <Badge variant="secondary" className="text-green-400">
          {verifiedCapsules.length} Verified
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verifiedCapsules.map((capsule, index) => (
          <Card
            key={capsule.id}
            className="bg-brand-secondary border-brand-surface hover:border-brand-accent/50 transition-all duration-200"
            data-testid={`verified-capsule-${index}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-brand-light text-base line-clamp-2">
                  {capsule.title}
                </CardTitle>
                <div className="flex items-center gap-1 ml-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-brand-light/70 line-clamp-2">
                {capsule.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={getCapsuleTypeColor(capsule.type)}
                >
                  {capsule.type}
                </Badge>

                {capsule.truthScore && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-brand-warning" />
                    <span className="text-xs text-brand-light/70">
                      {capsule.truthScore}%
                    </span>
                  </div>
                )}

                {capsule.isTimeSealed && (
                  <Badge variant="outline" className="text-purple-400 border-purple-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Sealed
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-xs text-brand-light/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {formatDate(capsule.createdAt)}</span>
                </div>
                
                {capsule.verificationDate && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>Verified: {formatDate(capsule.verificationDate)}</span>
                  </div>
                )}

                {capsule.verifiedBy && (
                  <div className="text-green-400">
                    Verified by: {capsule.verifiedBy}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-brand-light/20 hover:bg-brand-light/10 text-brand-light flex-1"
                  data-testid={`button-view-capsule-${capsule.id}`}
                >
                  <Link href={`/capsule/${capsule.id}`}>
                    <Eye className="w-3 h-3 mr-2" />
                    {capsule.isTimeSealed ? "Preview" : "View"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {verifiedCapsules.length > 4 && (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4 text-center">
            <Button
              variant="outline"
              size="sm"
              className="border-brand-light/20 hover:bg-brand-light/10 text-brand-light"
              data-testid="button-view-all-verified"
            >
              <Eye className="w-3 h-3 mr-2" />
              View All Verified Capsules
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}