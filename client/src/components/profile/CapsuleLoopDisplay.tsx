import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Sparkles,
  Zap,
  Eye,
  Heart,
} from "lucide-react";

interface Capsule {
  id: string;
  title: string;
  content: string;
  type: string;
  timestamp: string;
  verificationStatus: "verified" | "pending" | "disputed";
  aiScore: number;
}

interface CapsuleLoopDisplayProps {
  capsules: Capsule[];
  displayMode: string;
  loopSpeed: number;
  aiFilterIntensity: number;
}

export default function CapsuleLoopDisplay({
  capsules,
  displayMode,
  loopSpeed,
  aiFilterIntensity,
}: CapsuleLoopDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  // Mock capsules if none provided
  const mockCapsules: Capsule[] = [
    {
      id: "1",
      title: "Quantum Truth Discovery",
      content: "Breakthrough in quantum verification protocols...",
      type: "scientific",
      timestamp: "2025-01-01T00:00:00Z",
      verificationStatus: "verified",
      aiScore: 95,
    },
    {
      id: "2",
      title: "Digital Identity Revolution",
      content: "New paradigm for secure identity management...",
      type: "technology",
      timestamp: "2025-01-02T00:00:00Z",
      verificationStatus: "verified",
      aiScore: 88,
    },
    {
      id: "3",
      title: "Neural Network Insights",
      content: "Advanced pattern recognition in human behavior...",
      type: "research",
      timestamp: "2025-01-03T00:00:00Z",
      verificationStatus: "pending",
      aiScore: 92,
    },
  ];

  const displayCapsules = capsules.length > 0 ? capsules : mockCapsules;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (isShuffled) {
          return Math.floor(Math.random() * displayCapsules.length);
        }
        const next = prev + 1;
        if (next >= displayCapsules.length) {
          return isRepeating ? 0 : prev;
        }
        return next;
      });
    }, 1000 / loopSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, loopSpeed, isShuffled, isRepeating, displayCapsules.length]);

  const currentCapsule = displayCapsules[currentIndex];

  const getDisplayModeClass = () => {
    switch (displayMode) {
      case "neural-cascade":
        return "animate-pulse bg-gradient-to-br from-cyan-900/20 to-purple-900/20";
      case "quantum-spiral":
        return "animate-spin-slow bg-gradient-to-r from-blue-900/20 to-green-900/20";
      case "holographic-grid":
        return "bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm";
      case "plasma-wave":
        return "animate-bounce bg-gradient-to-r from-pink-900/20 to-orange-900/20";
      default:
        return "bg-gradient-to-br from-slate-900/20 to-black/20";
    }
  };

  const getAIFilterStyle = () => {
    const intensity = aiFilterIntensity / 100;
    return {
      filter: `
        brightness(${1 + intensity * 0.3}) 
        contrast(${1 + intensity * 0.2}) 
        saturate(${1 + intensity * 0.5})
        hue-rotate(${intensity * 30}deg)
      `,
      boxShadow: `0 0 ${20 * intensity}px rgba(139, 92, 246, ${0.3 * intensity})`,
    };
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : displayCapsules.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayCapsules.length);
  };

  return (
    <div className="space-y-4">
      {/* Loop Controls */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={handlePrevious}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleNext}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {currentIndex + 1} / {displayCapsules.length}
            </Badge>

            <Button
              onClick={() => setIsShuffled(!isShuffled)}
              variant="ghost"
              size="sm"
              className={`${isShuffled ? "text-green-400" : "text-slate-400"} hover:text-green-300`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => setIsRepeating(!isRepeating)}
              variant="ghost"
              size="sm"
              className={`${isRepeating ? "text-blue-400" : "text-slate-400"} hover:text-blue-300`}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Speed: {loopSpeed}x</span>
            <span>•</span>
            <span>Mode: {displayMode.replace("-", " ")}</span>
            <span>•</span>
            <span>AI Filter: {aiFilterIntensity}%</span>
          </div>
        </div>
      </Card>

      {/* Capsule Display */}
      <Card
        className={`${getDisplayModeClass()} border-2 border-purple-500/30 transition-all duration-500`}
        style={getAIFilterStyle()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {currentCapsule.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {new Date(currentCapsule.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                className={`
                  ${
                    currentCapsule.verificationStatus === "verified"
                      ? "bg-green-600/20 text-green-400"
                      : currentCapsule.verificationStatus === "pending"
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "bg-red-600/20 text-red-400"
                  }
                `}
              >
                {currentCapsule.verificationStatus}
              </Badge>

              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">
                  {currentCapsule.aiScore}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-4">
            {currentCapsule.content}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {currentCapsule.type}
            </Badge>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-red-400"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-blue-400"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Loop Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {displayCapsules.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-purple-400 scale-125"
                  : "bg-slate-600 hover:bg-slate-500"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
