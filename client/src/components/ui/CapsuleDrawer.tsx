import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Calendar, 
  User, 
  Shield, 
  TrendingUp, 
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Download,
  Flag,
  Star,
  DollarSign,
  Plus,
  CreditCard,
  Coins,
  Play,
  Lock,
  Unlock
} from "lucide-react";

interface CapsuleData {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  verificationStatus: 'pending' | 'verified' | 'disputed';
  truthScore: number;
  views: number;
  likes: number;
  comments: number;
  capsuleType: string;
  isSealed: boolean;
  accessCost?: number;
  tags: string[];
}

interface CapsuleDrawerProps {
  capsule?: CapsuleData;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: 'view' | 'create';
}

const mockCapsule: CapsuleData = {
  id: 'cap_001',
  title: 'Whistleblower Report: Corporate Misconduct',
  content: 'This capsule contains evidence of systematic financial irregularities within a major corporation. The documentation includes internal emails, financial records, and witness testimonies that reveal a coordinated effort to manipulate earnings reports...',
  author: 'Anonymous Whistleblower',
  createdAt: '2025-01-15T10:30:00Z',
  verificationStatus: 'verified',
  truthScore: 92,
  views: 1247,
  likes: 89,
  comments: 23,
  capsuleType: 'whistleblower_protection',
  isSealed: true,
  accessCost: 2.50,
  tags: ['corporate', 'financial', 'whistleblower', 'verified']
};

const CapsuleDrawer = ({ 
  capsule = mockCapsule, 
  isOpen = false, 
  onOpenChange,
  mode = 'view'
}: CapsuleDrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    capsuleType: 'personal_memory',
    accessCost: 0,
    tags: '',
    isSealed: false
  });
  const [loading, setLoading] = useState(false);
  const [replayLoading, setReplayLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const open = isOpen || internalOpen || createMode;
  const setOpen = onOpenChange || setInternalOpen;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'disputed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <Shield className="h-4 w-4" />;
      case 'pending': return <Calendar className="h-4 w-4" />;
      case 'disputed': return <Flag className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const submitCapsule = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/capsules", {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        authorId: user?.id
      });

      if (response.ok) {
        toast({
          title: "Capsule Created",
          description: "Your truth capsule has been submitted and sealed. GTT rewards will be distributed upon verification.",
        });
        
        // Trigger Stripe + GTT payout
        await apiRequest("POST", "/api/trigger-stripe", {
          capsuleId: (await response.json()).id,
          amount: formData.accessCost || 2.50
        });
        
        setCreateMode(false);
        setFormData({
          title: '',
          content: '',
          capsuleType: 'personal_memory',
          accessCost: 0,
          tags: '',
          isSealed: false
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create capsule. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleReplay = async () => {
    setReplayLoading(true);
    try {
      console.log('🔄 Triggering advanced capsule replay for:', capsule.id);
      
      // Mock wallet addresses for development - in production these would come from wallet connection
      const authorWalletAddress = '0x1234567890123456789012345678901234567890';
      const viewerWalletAddress = '0x0987654321098765432109876543210987654321';
      
      const response = await apiRequest("POST", `/api/replay-capsule`, {
        capsuleId: capsule.id,
        authorId: capsule.author,
        authorWalletAddress,
        viewerWalletAddress,
        truthScore: capsule.truthScore || 75,
        verificationCount: 1,
        capsuleAge: Date.now() - new Date(capsule.createdAt).getTime()
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Advanced capsule replay successful:', result);
        
        const isWeb3 = result.replay.isWeb3Verified;
        const yieldDetails = result.replay.yieldCalculation;
        
        toast({
          title: isWeb3 ? "Web3 Replay Successful!" : "Capsule Replayed Successfully!",
          description: `GTT yield of ${yieldDetails.totalYield} calculated with grief score. ${isWeb3 ? 'Blockchain verified!' : 'Development mode.'}`
        });
      }
    } catch (error) {
      console.error('❌ Replay failed:', error);
      toast({
        title: "Replay Failed",
        description: "Unable to replay capsule. Please try again.",
        variant: "destructive",
      });
    }
    setReplayLoading(false);
  };

  const handlePurchaseAccess = async () => {
    try {
      const response = await apiRequest("POST", "/api/purchase-capsule-access", {
        capsuleId: capsule.id,
        amount: capsule.accessCost
      });

      if (response.ok) {
        const { sessionUrl } = await response.json();
        window.location.href = sessionUrl;
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="fixed bottom-20 right-6 z-40 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            onClick={() => setCreateMode(false)}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Sample Capsule
          </Button>
        </SheetTrigger>
      
        <SheetContent className="w-full sm:max-w-lg bg-slate-900 border-slate-700 text-white">
          <ScrollArea className="h-full">
            {createMode || mode === 'create' ? (
              // Create Mode
              <>
                <SheetHeader className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Plus className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <SheetTitle className="text-white text-lg leading-tight">
                        Create Truth Capsule
                      </SheetTitle>
                      <SheetDescription className="text-slate-400 mt-1">
                        Submit and seal your memory for verification
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter capsule title..."
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Content
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Your memory, sealed for posterity..."
                      rows={6}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Capsule Type
                    </label>
                    <select
                      value={formData.capsuleType}
                      onChange={(e) => setFormData(prev => ({ ...prev, capsuleType: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="personal_memory">Personal Memory</option>
                      <option value="whistleblower_protection">Whistleblower Report</option>
                      <option value="historical_record">Historical Record</option>
                      <option value="legal_testimony">Legal Testimony</option>
                      <option value="family_legacy">Family Legacy</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Access Cost (GTT)
                    </label>
                    <Input
                      type="number"
                      value={formData.accessCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, accessCost: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Tags (comma-separated)
                    </label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="truth, memory, sealed"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sealed"
                      checked={formData.isSealed}
                      onChange={(e) => setFormData(prev => ({ ...prev, isSealed: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="sealed" className="text-sm text-slate-300">
                      Seal with Veritas protection
                    </label>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      onClick={submitCapsule}
                      disabled={loading || !formData.title || !formData.content}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        "Sealing..."
                      ) : (
                        <>
                          <Coins className="h-4 w-4 mr-2" />
                          Submit + Earn GTT
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setCreateMode(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // View Mode
              <>
                <SheetHeader className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <SheetTitle className="text-white text-lg leading-tight">
                        {capsule.title}
                      </SheetTitle>
                      <SheetDescription className="text-slate-400 mt-1">
                        Capsule ID: {capsule.id}
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

          {/* Verification Status */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(capsule.verificationStatus)} text-white`}>
              {getStatusIcon(capsule.verificationStatus)}
              {capsule.verificationStatus.charAt(0).toUpperCase() + capsule.verificationStatus.slice(1)}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <TrendingUp className="h-4 w-4" />
                Truth Score
              </div>
              <div className="text-xl font-bold text-green-400">{capsule.truthScore}%</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Eye className="h-4 w-4" />
                Views
              </div>
              <div className="text-xl font-bold">{capsule.views.toLocaleString()}</div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Heart className="h-4 w-4" />
                Likes
              </div>
              <div className="text-xl font-bold">{capsule.likes}</div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <MessageSquare className="h-4 w-4" />
                Comments
              </div>
              <div className="text-xl font-bold">{capsule.comments}</div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="text-sm text-slate-400 mb-1">Author</div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span>{capsule.author}</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400 mb-1">Created</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400 mb-1">Type</div>
              <Badge variant="secondary">{capsule.capsuleType.replace('_', ' ')}</Badge>
            </div>

            {capsule.accessCost && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Access Cost</div>
                <div className="flex items-center gap-2 text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span>{capsule.accessCost} GTT</span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="text-sm text-slate-400 mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {capsule.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-6 bg-slate-700" />

          {/* Content Preview */}
          <div className="mb-6">
            <div className="text-sm text-slate-400 mb-2">Content Preview</div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-sm">
              <p className="leading-relaxed">{capsule.content}</p>
              {capsule.isSealed && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    Sealed Content
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Full content requires verification access
                  </p>
                </div>
              )}
            </div>
          </div>

                {/* Actions */}
                <div className="space-y-3">
                  {capsule.accessCost && capsule.accessCost > 0 ? (
                    <Button 
                      onClick={handlePurchaseAccess}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Purchase Access ({capsule.accessCost} GTT)
                    </Button>
                  ) : (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Star className="h-4 w-4 mr-2" />
                      Access Full Content
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleReplay}
                    disabled={replayLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {replayLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Replay + Release Yield
                      </>
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Create Capsule Floating Button */}
      <Button
        onClick={() => setCreateMode(true)}
        className="fixed bottom-4 left-4 bg-green-600 hover:bg-green-700 text-white shadow-lg z-40"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Capsule
      </Button>
    </>
  );
};

export default CapsuleDrawer;