import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  X,
  Shield,
  Sparkles,
  Clock,
  Globe,
  Lock,
  Users,
  Eye,
  Star,
  Coins,
  TrendingUp,
  Heart,
  BarChart3,
  Zap,
  CheckCircle,
  Share2,
  Download,
  Copy
} from 'lucide-react';

interface CapsulePreview {
  title: string;
  content: string;
  type: string;
  visibility: string;
  priority: string;
  tags: string[];
  attachments: File[];
  voiceNote?: Blob;
  enableNFT: boolean;
  timeLock?: number;
  blockchainSealed: boolean;
  aiEnhanced: boolean;
  estimatedGTT: number;
  truthScore: number;
  impactScore: number;
  completionScore: number;
}

interface CapsulePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsuleData: CapsulePreview;
  onConfirm: () => void;
  onEdit: () => void;
  isCreating?: boolean;
}

const typeIcons: { [key: string]: any } = {
  truth: Shield,
  memory: Heart,
  testimony: Users,
  evidence: Lock,
  legacy: Star,
  witness: Eye
};

const typeColors: { [key: string]: string } = {
  truth: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  memory: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  testimony: 'text-green-400 border-green-500/30 bg-green-500/10',
  evidence: 'text-red-400 border-red-500/30 bg-red-500/10',
  legacy: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  witness: 'text-orange-400 border-orange-500/30 bg-orange-500/10'
};

const visibilityIcons: { [key: string]: any } = {
  public: Globe,
  private: Lock,
  friends: Users
};

const priorityColors: { [key: string]: string } = {
  normal: 'bg-gray-500',
  high: 'bg-yellow-500',
  urgent: 'bg-red-500'
};

export default function CapsulePreviewModal({
  isOpen,
  onClose,
  capsuleData,
  onConfirm,
  onEdit,
  isCreating = false
}: CapsulePreviewModalProps) {
  if (!isOpen) return null;

  const TypeIcon = typeIcons[capsuleData.type] || Shield;
  const VisibilityIcon = visibilityIcons[capsuleData.visibility] || Globe;
  const typeColorClass = typeColors[capsuleData.type] || typeColors.truth;
  const priorityColorClass = priorityColors[capsuleData.priority] || priorityColors.normal;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(capsuleData.content);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: capsuleData.title,
        text: capsuleData.content.substring(0, 100) + '...',
        url: window.location.href
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-black/90 backdrop-blur-lg border-gray-600">
            <CardHeader className="border-b border-gray-600">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-cyan-400" />
                  Capsule Preview
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                  data-testid="close-preview"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      {capsuleData.title || 'Untitled Capsule'}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`border ${typeColorClass}`}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {capsuleData.type}
                      </Badge>
                      <Badge variant="outline" className="text-gray-300">
                        <VisibilityIcon className="w-3 h-3 mr-1" />
                        {capsuleData.visibility}
                      </Badge>
                      {capsuleData.priority !== 'normal' && (
                        <Badge className={`${priorityColorClass} text-white`}>
                          {capsuleData.priority}
                        </Badge>
                      )}
                      {capsuleData.aiEnhanced && (
                        <Badge className="bg-purple-600 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Enhanced
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyContent}
                      data-testid="copy-content"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      data-testid="share-preview"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Completion Score */}
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Completion Score</span>
                      <span className="text-cyan-300 font-mono text-lg">
                        {capsuleData.completionScore}%
                      </span>
                    </div>
                    <Progress value={capsuleData.completionScore} className="h-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Content Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Content</h3>
                <Card className={`border ${typeColorClass}`}>
                  <CardContent className="p-4">
                    <div className="text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                      {capsuleData.content || 'No content provided'}
                    </div>
                    <div className="mt-3 text-sm text-gray-500 border-t border-gray-600 pt-3">
                      {capsuleData.content.length} characters • {Math.ceil(capsuleData.content.length / 250)} min read
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tags */}
              {capsuleData.tags && capsuleData.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {capsuleData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
                    <div className="text-lg font-bold text-cyan-300">
                      {capsuleData.truthScore}%
                    </div>
                    <div className="text-xs text-gray-400">Truth Score</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                    <div className="text-lg font-bold text-purple-300">
                      {capsuleData.impactScore}%
                    </div>
                    <div className="text-xs text-gray-400">Impact Score</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4 text-center">
                    <Coins className="w-6 h-6 mx-auto text-yellow-400 mb-2" />
                    <div className="text-lg font-bold text-yellow-300">
                      {capsuleData.estimatedGTT}
                    </div>
                    <div className="text-xs text-gray-400">Est. GTT</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-lg font-bold text-gray-300">
                      {capsuleData.timeLock || 0}d
                    </div>
                    <div className="text-xs text-gray-400">Time Lock</div>
                  </CardContent>
                </Card>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { 
                      enabled: capsuleData.attachments.length > 0, 
                      label: `${capsuleData.attachments.length} Files`, 
                      icon: Download 
                    },
                    { 
                      enabled: !!capsuleData.voiceNote, 
                      label: 'Voice Note', 
                      icon: Zap 
                    },
                    { 
                      enabled: capsuleData.enableNFT, 
                      label: 'NFT Minting', 
                      icon: Star 
                    },
                    { 
                      enabled: capsuleData.blockchainSealed, 
                      label: 'Blockchain Seal', 
                      icon: Shield 
                    },
                    { 
                      enabled: capsuleData.aiEnhanced, 
                      label: 'AI Enhanced', 
                      icon: Sparkles 
                    },
                    { 
                      enabled: !!capsuleData.timeLock, 
                      label: 'Time Locked', 
                      icon: Clock 
                    }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-3 rounded border ${
                        feature.enabled 
                          ? 'border-green-500/30 bg-green-500/10 text-green-300' 
                          : 'border-gray-600 bg-gray-800/30 text-gray-500'
                      }`}
                    >
                      <feature.icon className="w-4 h-4" />
                      <span className="text-sm">{feature.label}</span>
                      {feature.enabled && <CheckCircle className="w-4 h-4 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-600">
                <Button
                  variant="outline"
                  onClick={onEdit}
                  disabled={isCreating}
                  data-testid="edit-capsule"
                >
                  Edit Capsule
                </Button>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isCreating}
                    data-testid="cancel-creation"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={onConfirm}
                    disabled={isCreating || capsuleData.completionScore < 50}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    data-testid="confirm-creation"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Create Capsule
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}