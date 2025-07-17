import { useQuery } from "@tanstack/react-query";
import { Shield, Users, Lock, UserCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CapsuleCard from "@/components/capsule/capsule-card";
import { Link } from "wouter";

export default function PrivateFeed() {
  const { data: privateCapsules, isLoading } = useQuery({
    queryKey: ["/api/capsules/private"],
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["/api/friends/requests"],
  });

  const { data: friendsStats } = useQuery({
    queryKey: ["/api/friends/stats"],
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Private Feed
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Exclusive truth capsules from your verified friend network
            </p>
            
            {/* Friend Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {friendsStats?.activeFriends || 0}
                  </div>
                  <div className="text-slate-400 text-sm">Active Friends</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {friendRequests?.pending || 0}
                  </div>
                  <div className="text-slate-400 text-sm">Pending Requests</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {privateCapsules?.length || 0}
                  </div>
                  <div className="text-slate-400 text-sm">Private Capsules</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Friend Requests Section */}
      {friendRequests?.pending > 0 && (
        <section className="py-8 bg-slate-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-blue-900/20 border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <UserCheck className="h-5 w-5" />
                  Pending Friend Requests ({friendRequests.pending})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-slate-300">
                    You have friend requests waiting for approval
                  </p>
                  <Link href="/friends">
                    <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                      Review Requests
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Private Capsules */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Friends-Only Capsules</h2>
              <p className="text-slate-400">
                Truth capsules shared exclusively with your verified network
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Eye className="h-3 w-3 mr-1" />
                Private
              </Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                <Shield className="h-3 w-3 mr-1" />
                Verified Friends Only
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : privateCapsules?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privateCapsules.map((capsule: any) => (
                <CapsuleCard key={capsule.id} capsule={capsule} />
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Private Capsules Yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Start connecting with friends to see their exclusive truth capsules in your private feed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/explore">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Users className="mr-2 h-4 w-4" />
                      Find Friends
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="outline" className="border-slate-600 hover:border-slate-400">
                      Create Private Capsule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="py-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 p-2 rounded-lg flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Privacy Protection</h3>
                  <p className="text-slate-400 text-sm">
                    All private capsules are encrypted and only visible to verified friends. 
                    Your friend network and viewing history remain completely private and 
                    are never shared with third parties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}