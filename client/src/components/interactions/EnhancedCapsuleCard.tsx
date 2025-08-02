import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  BookOpen,
  ExternalLink,
  Eye,
  Star,
  Sparkles,
} from "lucide-react";
import { TiltCard } from "./InteractiveCards";
import {
  LikeAnimation,
  FloatingTooltip,
  BouncyIcon,
} from "./MicroInteractions";

interface EnhancedCapsuleCardProps {
  capsule: {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    status: "verified" | "pending" | "disputed";
    likes: number;
    views: number;
    createdAt: string;
    ipfsHash?: string;
  };
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  onView?: (id: string) => void;
}

export const EnhancedCapsuleCard: React.FC<EnhancedCapsuleCardProps> = ({
  capsule,
  onLike,
  onShare,
  onView,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(capsule.likes);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.(capsule.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return "✅";
      case "pending":
        return "⏳";
      case "disputed":
        return "⚠️";
      default:
        return "📝";
    }
  };

  return (
    <TiltCard className="w-full max-w-md">
      <motion.div
        className="relative group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden relative">
          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Status Badge with Animation */}
          <motion.div
            className="absolute top-3 right-3 z-10"
            animate={
              isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.2 }}
          >
            <Badge
              className={`${getStatusColor(capsule.status)} border text-xs`}
            >
              <span className="mr-1">{getStatusIcon(capsule.status)}</span>
              {capsule.status}
            </Badge>
          </motion.div>

          {/* Floating Sparkles */}
          <motion.div
            className="absolute top-2 left-2 z-10"
            animate={
              isHovered
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.6, 1, 0.6],
                  }
                : { scale: 1, rotate: 0, opacity: 0.4 }
            }
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-yellow-400" />
          </motion.div>

          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-white text-lg leading-tight pr-16">
              {capsule.title}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>by {capsule.author}</span>
              <span>•</span>
              <span>{capsule.category}</span>
              <span>•</span>
              <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <p className="text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed">
              {capsule.content}
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{capsule.views.toLocaleString()}</span>
                </div>
                {capsule.ipfsHash && (
                  <FloatingTooltip content="Stored on IPFS">
                    <div className="flex items-center space-x-1 text-green-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-xs">Decentralized</span>
                    </div>
                  </FloatingTooltip>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.8</span>
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FloatingTooltip
                  content={`${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
                >
                  <div className="flex items-center space-x-1">
                    <LikeAnimation
                      isLiked={isLiked}
                      onToggle={handleLike}
                      size={20}
                    />
                    <motion.span
                      className="text-slate-400 text-sm"
                      animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {likeCount}
                    </motion.span>
                  </div>
                </FloatingTooltip>

                <FloatingTooltip content="Share capsule">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onShare?.(capsule.id)}
                    className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </FloatingTooltip>

                <FloatingTooltip content="Read full content">
                  <BouncyIcon
                    icon={BookOpen}
                    className="h-5 w-5 text-slate-400 hover:text-purple-400 transition-colors cursor-pointer p-1"
                  />
                </FloatingTooltip>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView?.(capsule.id)}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </motion.div>
            </div>
          </CardContent>

          {/* Bottom Gradient Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Card>
      </motion.div>
    </TiltCard>
  );
};

export default EnhancedCapsuleCard;
