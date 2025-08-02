import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  DollarSign
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
  onOpenChange 
}: CapsuleDrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = isOpen || internalOpen;
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="fixed bottom-20 right-6 z-40 bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
          <FileText className="h-4 w-4 mr-2" />
          View Sample Capsule
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg bg-slate-900 border-slate-700 text-white">
        <ScrollArea className="h-full">
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
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Star className="h-4 w-4 mr-2" />
              Access Full Content
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CapsuleDrawer;