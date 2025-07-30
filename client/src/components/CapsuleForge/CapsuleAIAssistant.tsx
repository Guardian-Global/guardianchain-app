import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  Target,
  Zap,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface CapsuleData {
  title: string;
  blocks: Array<{ id: number; type: string; content: string }>;
  metadata: {
    category: string;
    tags: string[];
    griefScore: number;
    credibilityScore: number;
  };
}

interface AIMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  analysis?: {
    sentiment: "positive" | "neutral" | "negative";
    credibility: number;
    completeness: number;
    impact: number;
  };
}

interface CapsuleAIAssistantProps {
  capsuleData: CapsuleData;
  onSuggestionApply: (suggestion: any) => void;
}

export default function CapsuleAIAssistant({
  capsuleData,
  onSuggestionApply,
}: CapsuleAIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Welcome to GUARDIANCHAIN AI Assistant! I'll help you create powerful truth capsules with maximum impact and credibility. How can I enhance your capsule today?",
      timestamp: new Date(),
      suggestions: [
        "Analyze my content for credibility",
        "Suggest improvements for impact",
        "Help with categorization",
        "Optimize for verification",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Real-time analysis of capsule data changes
  useEffect(() => {
    if (capsuleData.title || capsuleData.blocks.length > 0) {
      analyzeContent();
    }
  }, [capsuleData]);

  const analyzeContent = async () => {
    if (!capsuleData.title && capsuleData.blocks.length === 0) return;

    try {
      const response = await apiRequest("POST", "/api/ai/analyze-capsule", {
        title: capsuleData.title,
        content: capsuleData.blocks
          .map((block) => block.content)
          .join(" ")
          .substring(0, 2000),
        category: capsuleData.metadata.category,
        tags: capsuleData.metadata.tags,
      });

      if (response.ok) {
        const analysis = await response.json();
        
        // Add AI analysis message if significant insights found
        if (analysis.insights && analysis.insights.length > 0) {
          const analysisMessage: AIMessage = {
            id: `analysis-${Date.now()}`,
            type: "assistant",
            content: `📊 **Real-time Analysis Complete**\n\n${analysis.summary}`,
            timestamp: new Date(),
            suggestions: analysis.suggestions || [],
            analysis: {
              sentiment: analysis.sentiment || "neutral",
              credibility: analysis.credibilityScore || 75,
              completeness: analysis.completenessScore || 80,
              impact: analysis.impactScore || 70,
            },
          };
          
          setMessages((prev) => [...prev.slice(-5), analysisMessage]); // Keep last 5 + new
        }
      }
    } catch (error) {
      console.warn("AI analysis unavailable:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/ai/capsule-assistant", {
        message: inputMessage,
        capsuleData: {
          title: capsuleData.title,
          content: capsuleData.blocks
            .map((block) => `${block.type}: ${block.content}`)
            .join("\n"),
          metadata: capsuleData.metadata,
        },
        conversationHistory: messages.slice(-3), // Last 3 messages for context
      });

      if (response.ok) {
        const aiResponse = await response.json();
        
        const assistantMessage: AIMessage = {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: aiResponse.response,
          timestamp: new Date(),
          suggestions: aiResponse.suggestions || [],
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Apply any automated improvements
        if (aiResponse.autoImprovements) {
          onSuggestionApply(aiResponse.autoImprovements);
          toast({
            title: "AI Enhancement Applied",
            description: "Your capsule has been automatically improved",
          });
        }
      } else {
        throw new Error("AI assistant unavailable");
      }
    } catch (error) {
      // Fallback intelligent responses
      const fallbackResponse = generateFallbackResponse(inputMessage, capsuleData);
      
      const assistantMessage: AIMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: fallbackResponse.content,
        timestamp: new Date(),
        suggestions: fallbackResponse.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (message: string, data: CapsuleData) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes("credibility") || lowerMsg.includes("trust")) {
      return {
        content: `**Credibility Enhancement Tips:**\n\n✅ **Current Analysis:** Your capsule shows ${data.metadata.credibilityScore || 75}% credibility potential\n\n**Recommendations:**\n• Add specific dates, locations, or verifiable facts\n• Include source references or documentation\n• Use clear, objective language\n• Provide context and background information`,
        suggestions: [
          "Add source citations",
          "Include timestamps",
          "Add verification evidence",
          "Use objective language",
        ],
      };
    }
    
    if (lowerMsg.includes("impact") || lowerMsg.includes("improve")) {
      return {
        content: `**Impact Optimization Strategy:**\n\n🎯 **Current Impact Score:** ${calculateImpactScore(data)}%\n\n**Enhancement Suggestions:**\n• Strengthen your opening statement\n• Add compelling evidence or examples\n• Include call-to-action elements\n• Optimize for viral potential with engaging headlines`,
        suggestions: [
          "Enhance opening hook",
          "Add compelling evidence",
          "Include call-to-action",
          "Optimize for sharing",
        ],
      };
    }
    
    if (lowerMsg.includes("category") || lowerMsg.includes("tag")) {
      return {
        content: `**Categorization Recommendations:**\n\n📁 **Current Category:** ${data.metadata.category || "Not set"}\n\n**Optimal Categories for Your Content:**\n• Based on your content, consider: Truth Oracle, Knowledge Archive, or Civic Truth\n• Tags should include: verification, transparency, accountability\n• Consider adding location-based or time-sensitive tags`,
        suggestions: [
          "Update category",
          "Add verification tags",
          "Include location tags",
          "Add time-sensitive tags",
        ],
      };
    }
    
    return {
      content: `**GUARDIANCHAIN AI Assistant Ready**\n\n🤖 I'm here to help optimize your truth capsule for maximum impact and verification success.\n\n**Current Capsule Status:**\n• Title: ${data.title ? "✅ Set" : "❌ Needs attention"}\n• Content Blocks: ${data.blocks.length} blocks\n• Category: ${data.metadata.category || "Not set"}\n• Tags: ${data.metadata.tags.length} tags\n\n**What would you like to improve?**`,
      suggestions: [
        "Analyze content credibility",
        "Optimize for viral impact",
        "Improve categorization",
        "Enhance verification potential",
      ],
    };
  };

  const calculateImpactScore = (data: CapsuleData): number => {
    let score = 50; // Base score
    
    if (data.title.length > 10) score += 10;
    if (data.blocks.length > 2) score += 15;
    if (data.metadata.tags.length > 2) score += 10;
    if (data.metadata.category) score += 15;
    
    return Math.min(score, 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  const getAnalysisColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-purple-50 to-green-50 dark:from-purple-950/20 dark:to-green-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <Bot className="h-5 w-5" />
          GUARDIANCHAIN AI Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-slate-800 border shadow-sm"
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">
                    {message.content}
                  </div>
                  
                  {message.analysis && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className={`font-semibold ${getAnalysisColor(message.analysis.credibility)}`}>
                            {message.analysis.credibility}%
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Credibility</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${getAnalysisColor(message.analysis.completeness)}`}>
                            {message.analysis.completeness}%
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Complete</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${getAnalysisColor(message.analysis.impact)}`}>
                            {message.analysis.impact}%
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Impact</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Bot className="h-4 w-4 animate-pulse" />
                    AI is analyzing...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI to improve your capsule..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6"
            onClick={() => handleSuggestionClick("Analyze content credibility")}
          >
            <Target className="h-3 w-3 mr-1" />
            Credibility
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6"
            onClick={() => handleSuggestionClick("Optimize for maximum impact")}
          >
            <Zap className="h-3 w-3 mr-1" />
            Impact
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6"
            onClick={() => handleSuggestionClick("Help with verification strategy")}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Verify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}