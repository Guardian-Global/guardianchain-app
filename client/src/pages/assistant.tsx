import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import { Brain, Send, Bot, User, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function GuardianAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'ai', 
      text: 'Welcome to GuardianChain. Ask me anything about capsules, memory sovereignty, truth verification, DAO governance, or how to get started with the platform.', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      sender: 'user', 
      text: input.trim(), 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the AI assistant API
      const response = await apiRequest('POST', '/api/assistant', {
        message: userMessage.text
      });
      
      const aiMessage: Message = { 
        sender: 'ai', 
        text: response.reply || 'I apologize, but I encountered an error processing your request. Please try again.', 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Fallback response for development
      const fallbackResponse = generateFallbackResponse(userMessage.text);
      const aiMessage: Message = { 
        sender: 'ai', 
        text: fallbackResponse, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "AI Assistant",
        description: "Using fallback responses. Configure OpenAI API key for full functionality.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('capsule') || lowerText.includes('create')) {
      return `You asked: "${userText}"\n\n→ Truth capsules are the core of GuardianChain. They allow you to permanently seal memories, testimonies, or important information on the blockchain. Would you like to create your first capsule? Visit the Create section to get started.`;
    }
    
    if (lowerText.includes('gtt') || lowerText.includes('token') || lowerText.includes('reward')) {
      return `You asked: "${userText}"\n\n→ GTT (Guardian Truth Tokens) are earned by creating verified truth capsules and participating in the verification process. Your earnings are based on the quality and community validation of your submissions.`;
    }
    
    if (lowerText.includes('dao') || lowerText.includes('governance') || lowerText.includes('vote')) {
      return `You asked: "${userText}"\n\n→ The GuardianChain DAO enables community governance through GTT token voting. Participate in proposals, validator selection, and platform improvements. Visit the DAO section to engage with governance.`;
    }
    
    if (lowerText.includes('verify') || lowerText.includes('truth') || lowerText.includes('validation')) {
      return `You asked: "${userText}"\n\n→ Truth verification uses community consensus and AI analysis to validate capsule authenticity. Verified content earns higher GTT rewards and gains immutable status on the blockchain.`;
    }
    
    if (lowerText.includes('start') || lowerText.includes('begin') || lowerText.includes('how')) {
      return `You asked: "${userText}"\n\n→ Start by connecting your Web3 wallet, then create your first truth capsule. The platform guides you through verification, earning GTT tokens, and participating in the guardian community.`;
    }
    
    return `You asked: "${userText}"\n\n→ I'm here to help with GuardianChain questions about capsules, GTT tokens, DAO governance, truth verification, and platform features. What specific aspect would you like to explore?`;
  };

  const quickQuestions = [
    "How do I create my first capsule?",
    "What are GTT tokens?",
    "How does truth verification work?",
    "How can I participate in the DAO?",
    "What makes GuardianChain secure?"
  ];

  return (
    <Layout>
      <PageHeader
        title="🧠 Guardian AI Assistant"
        subtitle="Get instant help with capsules, governance, and platform features"
        icon={Brain}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Chat Messages */}
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Chat Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 p-6 rounded-xl space-y-4 h-[400px] overflow-y-auto">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 ${message.sender === 'ai' ? 'text-cyan-400' : 'text-white'}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {message.sender === 'ai' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 text-cyan-400">
                  <Loader2 className="h-4 w-4 animate-spin mt-1" />
                  <div className="text-sm">Guardian AI is thinking...</div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the Guardian AI about capsules, governance, or platform features..."
                className="flex-1 bg-slate-800 text-white border-slate-700"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-primary hover:bg-primary/80 text-primary-foreground"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Popular Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto p-3 text-sm border-slate-600 hover:border-primary hover:text-primary"
                  onClick={() => setInput(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>AI Assistant Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-primary font-semibold mb-2">Platform Guidance</div>
                <div className="text-slate-300">
                  Get help with capsule creation, verification processes, and platform navigation.
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-primary font-semibold mb-2">Token Economics</div>
                <div className="text-slate-300">
                  Learn about GTT tokens, rewards, staking, and DAO participation.
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-primary font-semibold mb-2">Technical Support</div>
                <div className="text-slate-300">
                  Troubleshoot issues, understand features, and optimize your experience.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}