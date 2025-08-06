import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Send, Dot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Friend {
  id: string;
  wallet: string;
  username: string;
  displayName: string;
  avatar: string;
  truthScore: number;
  isOnline: boolean;
  lastSeen: string;
}

interface FriendInviteCardProps {
  friends: Friend[];
  userId: string;
}

export default function FriendInviteCard({ friends, userId }: FriendInviteCardProps) {
  const [inviteWallet, setInviteWallet] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const inviteMutation = useMutation({
    mutationFn: async (wallet: string) => {
      return apiRequest("POST", `/api/profile/${userId}/friends`, { wallet });
    },
    onSuccess: () => {
      toast({
        title: "Invitation Sent",
        description: "Friend invitation has been sent successfully.",
      });
      setInviteWallet("");
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${userId}/friends`] });
    },
    onError: () => {
      toast({
        title: "Invitation Failed",
        description: "Failed to send friend invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInvite = () => {
    if (!inviteWallet.trim()) return;
    inviteMutation.mutate(inviteWallet);
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "text-green-400" : "text-gray-400";
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Invite New Friend */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-accent" />
            Invite Guardian Friend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={inviteWallet}
              onChange={(e) => setInviteWallet(e.target.value)}
              placeholder="Enter wallet address or username"
              className="bg-brand-surface border-brand-light/20 text-brand-light"
              data-testid="input-friend-invite"
            />
            <Button
              onClick={handleInvite}
              disabled={!inviteWallet.trim() || inviteMutation.isPending}
              className="bg-brand-primary hover:bg-brand-primary/80"
              data-testid="button-send-invite"
            >
              {inviteMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-brand-light/60">
            Connect with other guardians to share truth and build your network
          </p>
        </CardContent>
      </Card>

      {/* Friends List */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-accent" />
            Guardian Friends ({friends.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
              <p className="text-brand-light/60">No friends yet</p>
              <p className="text-xs text-brand-light/40 mt-2">
                Start building your guardian network
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 bg-brand-surface rounded border border-brand-light/10 hover:border-brand-light/20 transition-colors"
                  data-testid={`friend-${friend.id}`}
                >
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-brand-surface ${friend.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-brand-light truncate">
                        {friend.displayName}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs text-brand-warning border-brand-warning"
                      >
                        {friend.truthScore}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-brand-light/60">
                      <Dot className={`w-3 h-3 ${getStatusColor(friend.isOnline)}`} />
                      <span>
                        {friend.isOnline ? "Online" : formatLastSeen(friend.lastSeen)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-brand-light/20 text-brand-light hover:bg-brand-light/10"
                    data-testid={`button-view-friend-${friend.id}`}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}