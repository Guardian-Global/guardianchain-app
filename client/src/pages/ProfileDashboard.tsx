import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  Wallet, 
  Trophy, 
  Activity, 
  BarChart3, 
  Coins,
  Settings,
  CheckCircle,
  Clock,
  Share2,
  Eye
} from "lucide-react";
import CapsuleYieldManager from "@/components/web3/CapsuleYieldManager";
import { getAccount, getBalance, getNetwork } from "@/lib/web3";
import { formatGTT, getGTTTokenContract, getSigner, getChainName } from "@/lib/contracts";

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  tier: string;
  gttBalance: string;
  totalYieldEarned: string;
  capsulesCreated: number;
  capsulesVerified: number;
  reputationScore: number;
  joinedAt: string;
}

interface CapsuleStats {
  totalViews: number;
  totalShares: number;
  totalVerifications: number;
  averageYield: number;
  topPerforming: string;
}

export default function ProfileDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [gttBalance, setGttBalance] = useState<string>("0");
  const [networkName, setNetworkName] = useState<string>("");
  const [connecting, setConnecting] = useState(false);

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/users/profile"],
    enabled: isAuthenticated,
  });

  // Fetch capsule statistics
  const { data: capsuleStats, isLoading: statsLoading } = useQuery<CapsuleStats>({
    queryKey: ["/api/users/capsule-stats"],
    enabled: isAuthenticated,
  });

  // Fetch user's capsules for yield management
  const { data: userCapsules = [], isLoading: capsulesLoading, refetch: refetchCapsules } = useQuery({
    queryKey: ["/api/users/capsules"],
    enabled: isAuthenticated,
  });

  // Load wallet information
  useEffect(() => {
    async function loadWalletInfo() {
      try {
        const account = await getAccount();
        if (account) {
          setWalletAddress(account);
          
          // Get MATIC balance
          const balance = await getBalance(account);
          setWalletBalance(balance);
          
          // Get network name
          const network = await getNetwork();
          setNetworkName(network);
          
          // Get GTT balance
          const signer = await getSigner();
          if (signer) {
            const gttContract = getGTTTokenContract(signer);
            const gttBal = await gttContract.balanceOf(account);
            setGttBalance(formatGTT(gttBal));
          }
        }
      } catch (error) {
        console.error("Error loading wallet info:", error);
      }
    }

    loadWalletInfo();
  }, []);

  const handleYieldClaimed = (capsuleId: string, amount: string) => {
    toast({
      title: "Yield Claimed Successfully!",
      description: `Claimed ${amount} GTT tokens`,
    });
    
    // Refresh data
    refetchCapsules();
    
    // Update GTT balance
    const newBalance = parseFloat(gttBalance) + parseFloat(amount);
    setGttBalance(newBalance.toString());
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to access your profile dashboard
              </p>
              <Button onClick={() => window.location.href = "/api/login"}>
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.profileImageUrl} />
            <AvatarFallback className="text-lg">
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="text-muted-foreground">{profile?.email}</p>
            <Badge variant="outline" className="mt-1">
              {profile?.tier} Tier
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {walletAddress && (
            <Badge variant="secondary" className="font-mono text-xs">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Coins className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{parseFloat(profile?.gttBalance || "0").toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">GTT Balance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile?.capsulesVerified || 0}</div>
                <div className="text-sm text-muted-foreground">Verified Capsules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{profile?.reputationScore || 0}</div>
                <div className="text-sm text-muted-foreground">Reputation Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{parseFloat(profile?.totalYieldEarned || "0").toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Yield Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capsules">My Capsules</TabsTrigger>
          <TabsTrigger value="yield">Yield Management</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest GUARDIANCHAIN activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "capsule", title: "Created new truth capsule", time: "2 hours ago", status: "pending" },
                    { type: "yield", title: "Claimed 125 GTT yield", time: "1 day ago", status: "completed" },
                    { type: "verification", title: "Verified public document", time: "3 days ago", status: "completed" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      {activity.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
                <CardDescription>Your truth capsule performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Total Views
                      </span>
                      <span className="font-bold">{capsuleStats?.totalViews?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Total Shares
                      </span>
                      <span className="font-bold">{capsuleStats?.totalShares?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Verifications
                      </span>
                      <span className="font-bold">{capsuleStats?.totalVerifications || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        Average Yield
                      </span>
                      <span className="font-bold">{capsuleStats?.averageYield?.toFixed(2) || "0.00"} GTT</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="capsules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Truth Capsules</CardTitle>
              <CardDescription>
                Manage and monitor your truth verification capsules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {capsulesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : userCapsules.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No capsules created yet</p>
                  <Button className="mt-4" onClick={() => window.location.href = "/create-capsule"}>
                    Create Your First Capsule
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userCapsules.map((capsule: any) => (
                    <div key={capsule.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{capsule.title}</h4>
                          <p className="text-sm text-muted-foreground">{capsule.summary}</p>
                        </div>
                        <Badge variant={capsule.verified ? "default" : "secondary"}>
                          {capsule.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield" className="space-y-6">
          <CapsuleYieldManager
            userAddress={walletAddress}
            capsules={userCapsules}
            onYieldClaimed={handleYieldClaimed}
          />
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Connection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Connection
                </CardTitle>
                <CardDescription>Connect your Web3 wallet to claim GTT rewards</CardDescription>
              </CardHeader>
              <CardContent>
                {walletAddress ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Wallet Connected</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Address: {walletAddress}</div>
                        <div>Network: {networkName}</div>
                        <div>MATIC Balance: {parseFloat(walletBalance).toFixed(4)} MATIC</div>
                        <div>GTT Balance: {parseFloat(gttBalance).toFixed(2)} GTT</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to claim GTT rewards and interact with the blockchain
                    </p>
                    <Button onClick={() => window.location.reload()}>
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your GUARDIANCHAIN account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">User ID</div>
                      <div className="font-mono">{profile?.id}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Member Since</div>
                      <div>{new Date(profile?.joinedAt || "").toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Current Tier</div>
                      <div className="font-medium">{profile?.tier}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Capsules Created</div>
                      <div className="font-medium">{profile?.capsulesCreated || 0}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}