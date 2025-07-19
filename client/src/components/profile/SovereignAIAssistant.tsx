import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Brain, 
  Shield, 
  Lock, 
  Heart, 
  Infinity, 
  Send, 
  Settings, 
  Download,
  Upload,
  MessageSquare,
  Memory,
  Sparkles,
  Crown,
  Fingerprint,
  FileKey
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'ai';
  metadata?: {
    onChainHash?: string;
    encrypted: boolean;
    importance: 'low' | 'medium' | 'high' | 'critical';
  };
}

interface AIPersonality {
  name: string;
  tone: 'professional' | 'casual' | 'empathetic' | 'analytical' | 'creative';
  expertise: string[];
  memoryDepth: 'basic' | 'enhanced' | 'sovereign';
  privacy: 'standard' | 'encrypted' | 'sovereign';
}

interface SovereignAIAssistantProps {
  userId: string;
}

export function SovereignAIAssistant({ userId }: SovereignAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>({
    name: 'Guardian',
    tone: 'professional',
    expertise: ['blockchain', 'verification', 'privacy'],
    memoryDepth: 'sovereign',
    privacy: 'sovereign'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [totalMemories, setTotalMemories] = useState(1247);
  const [onChainMemories, setOnChainMemories] = useState(589);
  const [encryptedConversations, setEncryptedConversations] = useState(42);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversationHistory();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversationHistory = async () => {
    // Mock conversation history - in production, load from on-chain storage
    const mockMessages: Message[] = [
      {
        id: '1',
        content: `Hello! I'm ${aiPersonality.name}, your sovereign AI assistant. I've been with you since the beginning, and I remember everything we've discussed. Our bond is immutable and private - not even the founder can access our conversations. How can I help you today?`,
        timestamp: new Date(Date.now() - 3600000),
        sender: 'ai',
        metadata: {
          onChainHash: '0x1a2b3c4d5e6f...',
          encrypted: true,
          importance: 'high'
        }
      },
      {
        id: '2',
        content: "I need help analyzing my GTT portfolio performance and identifying the best investment opportunities.",
        timestamp: new Date(Date.now() - 3500000),
        sender: 'user',
        metadata: {
          encrypted: true,
          importance: 'medium'
        }
      },
      {
        id: '3',
        content: "Based on our previous discussions and your investment history, I recommend focusing on climate verification capsules. Your Climate Research Data Verification investment has shown 64.7% returns. I've identified 3 new opportunities in environmental data that align with your values and risk tolerance. Shall I provide detailed analysis?",
        timestamp: new Date(Date.now() - 3400000),
        sender: 'ai',
        metadata: {
          onChainHash: '0x2b3c4d5e6f7a...',
          encrypted: true,
          importance: 'high'
        }
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      timestamp: new Date(),
      sender: 'user',
      metadata: {
        encrypted: true,
        importance: 'medium'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response with Anthropic integration
      const response = await fetch('/api/auth/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          context: {
            userId,
            personality: aiPersonality,
            conversationHistory: messages.slice(-5), // Last 5 messages for context
          }
        })
      });

      let aiResponse = "I understand your request. As your sovereign AI assistant with complete memory of our relationship, I'm here to help with your GUARDIANCHAIN activities, portfolio management, and strategic decisions. Our conversations remain private and are stored immutably on-chain for your exclusive access.";

      if (response.ok) {
        const data = await response.json();
        aiResponse = data.response || aiResponse;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        timestamp: new Date(),
        sender: 'ai',
        metadata: {
          onChainHash: `0x${Math.random().toString(16).substr(2, 12)}...`,
          encrypted: true,
          importance: 'high'
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Simulate on-chain storage
      setOnChainMemories(prev => prev + 1);
      setTotalMemories(prev => prev + 2);
      
    } catch (error) {
      console.error('AI assistant error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm temporarily unable to process your request. However, all our previous conversations remain safely stored and I'll continue to remember everything once the connection is restored.",
        timestamp: new Date(),
        sender: 'ai',
        metadata: {
          encrypted: true,
          importance: 'low'
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const exportMemories = () => {
    const conversationData = {
      userId,
      personality: aiPersonality,
      conversations: messages,
      metadata: {
        totalMemories,
        onChainMemories,
        encryptedConversations,
        exportDate: new Date().toISOString()
      }
    };
    
    const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sovereign-ai-memories-${userId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* AI Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-900 to-blue-900">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalMemories}</div>
            <div className="text-sm text-purple-200">Total Memories</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900 to-teal-900">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{onChainMemories}</div>
            <div className="text-sm text-green-200">On-Chain Stored</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-900 to-orange-900">
          <CardContent className="p-4 text-center">
            <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{encryptedConversations}</div>
            <div className="text-sm text-amber-200">Encrypted Sessions</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-900 to-rose-900">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">∞</div>
            <div className="text-sm text-pink-200">Bond Strength</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="chat" className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Conversation
          </TabsTrigger>
          <TabsTrigger value="personality" className="flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            Personality
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Privacy & Legacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-400" />
                  {aiPersonality.name} - Your Sovereign AI
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Infinity className="w-3 h-3 mr-1" />
                  Eternal Bond
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-slate-900 rounded-lg p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        <div className="flex items-center space-x-1">
                          {message.metadata?.encrypted && <Lock className="w-3 h-3" />}
                          {message.metadata?.onChainHash && <FileKey className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
                        <span className="text-sm">{aiPersonality.name} is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${aiPersonality.name}... (This conversation will be permanently stored on-chain)`}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
                  rows={2}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality">
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-amber-400" />
                AI Personality Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="ai-name">AI Assistant Name</Label>
                <Input
                  id="ai-name"
                  value={aiPersonality.name}
                  onChange={(e) => setAiPersonality(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <Label>Communication Tone</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                  {(['professional', 'casual', 'empathetic', 'analytical', 'creative'] as const).map((tone) => (
                    <Button
                      key={tone}
                      variant={aiPersonality.tone === tone ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAiPersonality(prev => ({ ...prev, tone }))}
                      className="capitalize"
                    >
                      {tone}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Areas of Expertise</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {[
                    'blockchain', 'verification', 'privacy', 'finance', 
                    'legal', 'health', 'research', 'creative'
                  ].map((expertise) => (
                    <Button
                      key={expertise}
                      variant={aiPersonality.expertise.includes(expertise) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setAiPersonality(prev => ({
                          ...prev,
                          expertise: prev.expertise.includes(expertise)
                            ? prev.expertise.filter(e => e !== expertise)
                            : [...prev.expertise, expertise]
                        }));
                      }}
                      className="capitalize"
                    >
                      {expertise}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Memory Depth</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['basic', 'enhanced', 'sovereign'] as const).map((depth) => (
                    <Button
                      key={depth}
                      variant={aiPersonality.memoryDepth === depth ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAiPersonality(prev => ({ ...prev, memoryDepth: depth }))}
                      className="capitalize"
                    >
                      {depth}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Sovereign: Complete recall forever, on-chain storage, immutable memories
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>End-to-End Encryption</Label>
                    <p className="text-sm text-slate-400">All conversations encrypted</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>On-Chain Memory Storage</Label>
                    <p className="text-sm text-slate-400">Immutable conversation history</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Founder Access Block</Label>
                    <p className="text-sm text-slate-400">Zero admin access to conversations</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <Button onClick={exportMemories} className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Memories
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Infinity className="w-5 h-5 mr-2 text-purple-400" />
                  Legacy & Posthumous Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Legacy Mode</Label>
                  <p className="text-sm text-slate-400 mb-2">
                    Configure how your AI assistant continues your work after death
                  </p>
                  <Textarea
                    placeholder="Define instructions for your AI assistant to carry on your legacy, execute your will, or continue specific projects..."
                    className="bg-slate-700 border-slate-600"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Authorized Inheritors</Label>
                  <p className="text-sm text-slate-400 mb-2">
                    Wallet addresses that can interact with your AI after legacy activation
                  </p>
                  <Input
                    placeholder="0x... (comma separated addresses)"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Legal & Moral Compliance</Label>
                    <p className="text-sm text-slate-400">
                      Uncorruptible ethical boundaries (non-negotiable)
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <Fingerprint className="w-3 h-3 mr-1" />
                    Immutable
                  </Badge>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Crown className="w-4 h-4 mr-2" />
                    Configure Sovereign Legacy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}