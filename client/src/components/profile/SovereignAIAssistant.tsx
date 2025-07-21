import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bot, Send, Sparkles, Brain, Crown, Shield, 
  MessageSquare, Zap, Settings, Save, Trash2,
  Star, Lock, Globe, Heart
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  importance?: 'critical' | 'high' | 'medium' | 'low';
  saved?: boolean;
  gttCost?: number;
}

interface AIAssistantProps {
  userId: string;
  userTier: string;
  gttBalance: number;
}

const TIER_FEATURES = {
  EXPLORER: {
    maxMemories: 10,
    dailyMessages: 50,
    importanceThreshold: 'high',
    features: ['Basic Assistance', 'Content Help']
  },
  SEEKER: {
    maxMemories: 25,
    dailyMessages: 100,
    importanceThreshold: 'medium',
    features: ['Advanced Assistance', 'Yield Optimization', 'Market Insights']
  },
  CREATOR: {
    maxMemories: 100,
    dailyMessages: 250,
    importanceThreshold: 'medium',
    features: ['Professional AI', 'Content Strategy', 'Performance Analytics']
  },
  SOVEREIGN: {
    maxMemories: 1000,
    dailyMessages: 1000,
    importanceThreshold: 'low',
    features: ['Unlimited Access', 'Strategic Insights', 'Personal Assistant', 'Predictive Analytics']
  },
  FOUNDER: {
    maxMemories: 10000,
    dailyMessages: 10000,
    importanceThreshold: 'low',
    features: ['Founder AI', 'Strategic Planning', 'Business Intelligence', 'Operations Management']
  }
};

export default function SovereignAIAssistant({ userId, userTier, gttBalance }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [savedMemories, setSavedMemories] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const tierConfig = TIER_FEATURES[userTier as keyof typeof TIER_FEATURES] || TIER_FEATURES.EXPLORER;

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, context }: { message: string; context: any }) => {
      return apiRequest('POST', '/api/ai/chat', {
        userId,
        message,
        context: {
          ...context,
          userTier,
          gttBalance,
          recentActivity: messages.slice(-5)
        }
      });
    },
    onSuccess: (response: any) => {
      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        importance: response.importance,
        gttCost: response.gttCost
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Auto-save important messages based on tier threshold
      if (shouldAutoSave(response.importance)) {
        saveMemoryMutation.mutate(assistantMessage);
      }

      // Deduct GTT if cost applies
      if (response.gttCost > 0) {
        toast({
          title: "GTT Used",
          description: `${response.gttCost} GTT used for enhanced AI processing`,
        });
      }
    },
    onError: (error: any) => {
      setIsTyping(false);
      toast({
        title: "AI Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Save memory mutation
  const saveMemoryMutation = useMutation({
    mutationFn: async (message: Message) => {
      return apiRequest('POST', '/api/ai/save-memory', {
        userId,
        messageId: message.id,
        content: message.content,
        importance: message.importance,
        gttCost: 10 // Memory storage costs 10 GTT
      });
    },
    onSuccess: (_, savedMessage) => {
      setSavedMemories(prev => [...prev, { ...savedMessage, saved: true }]);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === savedMessage.id ? { ...msg, saved: true } : msg
        )
      );
      toast({
        title: "Memory Saved",
        description: "Important conversation saved to your AI memory bank",
      });
    },
  });

  const shouldAutoSave = (importance: string) => {
    const thresholds = {
      critical: ['critical'],
      high: ['critical', 'high'],
      medium: ['critical', 'high', 'medium'],
      low: ['critical', 'high', 'medium', 'low']
    };
    return thresholds[tierConfig.importanceThreshold as keyof typeof thresholds]?.includes(importance);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    sendMessageMutation.mutate({
      message: inputMessage,
      context: {
        capsuleCount: 0,
        totalYield: 0,
        recentMemories: savedMemories.slice(-3)
      }
    });

    setInputMessage("");
  };

  const handleSaveMemory = (message: Message) => {
    if (savedMemories.length >= tierConfig.maxMemories) {
      toast({
        title: "Memory Limit Reached",
        description: `Your ${userTier} tier allows ${tierConfig.maxMemories} saved memories`,
        variant: "destructive",
      });
      return;
    }
    saveMemoryMutation.mutate(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome! I'm your Sovereign AI Assistant. I'm here to help you maximize your GUARDIANCHAIN experience with personalized insights and strategic guidance.\n\nAs a ${userTier} member, you have access to ${tierConfig.features.join(', ')}.\n\nHow can I assist you today?`,
      timestamp: new Date(),
      importance: 'medium'
    };
    setMessages([welcomeMessage]);
  }, [userTier]);

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="flex items-center gap-2">
                Sovereign AI Assistant
                {userTier === 'SOVEREIGN' && <Crown className="w-5 h-5 text-yellow-500" />}
                {userTier === 'FOUNDER' && <Crown className="w-5 h-5 text-gold-500" />}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{userTier} Tier</Badge>
                <span>•</span>
                <span>{gttBalance} GTT Available</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>{tierConfig.dailyMessages} daily messages</span>
            </div>
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4 text-green-500" />
              <span>{tierConfig.maxMemories} memory slots</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{tierConfig.features.length} features</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-100 dark:bg-purple-900">
                            <Bot className="w-4 h-4 text-purple-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-md p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-12'
                            : 'bg-muted mr-12'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        
                        {message.role === 'assistant' && (
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {message.importance && (
                                <Badge variant="outline" className="text-xs py-0">
                                  {message.importance}
                                </Badge>
                              )}
                              {message.gttCost && (
                                <span className="flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  {message.gttCost} GTT
                                </span>
                              )}
                            </div>
                            
                            {!message.saved && message.importance !== 'low' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSaveMemory(message)}
                                className="h-6 px-2 text-xs"
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                            )}
                            
                            {message.saved && (
                              <Heart className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900">
                          <Bot className="w-4 h-4 text-purple-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask your AI assistant anything..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Memory Bank */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                AI Memory Bank
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {savedMemories.length} / {tierConfig.maxMemories} memories saved
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {savedMemories.length > 0 ? (
                    savedMemories.map((memory) => (
                      <div key={memory.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground truncate">
                              {memory.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {memory.importance}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {memory.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Save className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No memories saved yet</p>
                      <p className="text-xs">Important conversations will be automatically saved</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {userTier} Tier Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tierConfig.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}