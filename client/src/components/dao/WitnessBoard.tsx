import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Clock, Vote } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Testimony {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  votes: number;
  status: "pending" | "verified" | "disputed";
  category: string;
}

export default function WitnessBoard() {
  const [newTestimony, setNewTestimony] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonies, isLoading } = useQuery({
    queryKey: ["/api/witnesses/testimonies"],
  });

  const submitTestimony = useMutation({
    mutationFn: async (testimony: string) => {
      return apiRequest("POST", "/api/witnesses/testimonies", { message: testimony });
    },
    onSuccess: () => {
      setNewTestimony("");
      queryClient.invalidateQueries({ queryKey: ["/api/witnesses/testimonies"] });
      toast({
        title: "Testimony Submitted",
        description: "Your witness testimony has been recorded on the blockchain.",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit testimony. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (newTestimony.trim()) {
      submitTestimony.mutate(newTestimony);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-light/60">Loading witness testimonies...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-accent" />
          Witness Testimony Board
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Textarea
            value={newTestimony}
            onChange={(e) => setNewTestimony(e.target.value)}
            placeholder="Submit your witness testimony or truth disclosure..."
            className="bg-brand-surface border-brand-light/20 text-brand-light placeholder:text-brand-light/50"
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            disabled={!newTestimony.trim() || submitTestimony.isPending}
            className="w-full bg-brand-primary hover:bg-brand-primary/80"
          >
            {submitTestimony.isPending ? "Submitting..." : "Submit Testimony"}
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          <h4 className="font-medium text-brand-light mb-2">Recent Testimonies</h4>
          {testimonies?.map((testimony: Testimony) => (
            <div key={testimony.id} className="p-4 bg-brand-surface rounded-lg border border-brand-light/10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={
                      testimony.status === "verified" ? "border-green-500 text-green-400" :
                      testimony.status === "disputed" ? "border-red-500 text-red-400" :
                      "border-yellow-500 text-yellow-400"
                    }
                  >
                    {testimony.status}
                  </Badge>
                  <span className="text-xs text-brand-light/60">{testimony.category}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-light/50">
                  <Clock className="w-3 h-3" />
                  {testimony.timestamp}
                </div>
              </div>
              
              <p className="text-sm text-brand-light/80 mb-3">{testimony.message}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-light/60">by {testimony.author}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-brand-accent">
                    <Vote className="w-3 h-3" />
                    {testimony.votes}
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}