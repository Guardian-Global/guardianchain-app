import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Shield, TrendingUp, Activity } from "lucide-react";

interface Validator {
  name: string;
  capsules: number;
  reputation: number;
  active: boolean;
  gttEarned: number;
  joinedDate: string;
  specialization: string;
}

export default function ValidatorRegistry() {
  const { data: validators, isLoading } = useQuery({
    queryKey: ["/api/validators/registry"],
  });

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-light/60">Loading validator registry...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-brand-accent" />
          Validator Registry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {validators?.map((validator: Validator, index: number) => (
            <div key={index} className="p-4 bg-brand-surface rounded-lg border border-brand-light/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-brand-light">{validator.name}</h4>
                    <p className="text-xs text-brand-light/60">{validator.specialization}</p>
                  </div>
                </div>
                <Badge 
                  variant={validator.active ? "default" : "secondary"}
                  className={validator.active ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                >
                  {validator.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-2 bg-brand-dark/30 rounded">
                  <div className="font-bold text-brand-accent">{validator.capsules}</div>
                  <div className="text-xs text-brand-light/60">Verified</div>
                </div>
                <div className="text-center p-2 bg-brand-dark/30 rounded">
                  <div className="font-bold text-brand-warning">{validator.reputation}</div>
                  <div className="text-xs text-brand-light/60">Reputation</div>
                </div>
                <div className="text-center p-2 bg-brand-dark/30 rounded">
                  <div className="font-bold text-brand-success">{validator.gttEarned}</div>
                  <div className="text-xs text-brand-light/60">GTT Earned</div>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-brand-light/50">
                Member since: {validator.joinedDate}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}