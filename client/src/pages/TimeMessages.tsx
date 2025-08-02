import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  Calendar, 
  Send, 
  Lock, 
  Heart,
  Gift,
  Timer,
  Mail,
  Star,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TimeMessage {
  id: string;
  title: string;
  message: string;
  unlockDate: Date;
  recipient: string;
  messageType: 'personal' | 'birthday' | 'anniversary' | 'future_self' | 'memorial';
  status: 'sealed' | 'delivered' | 'read';
  createdAt: Date;
}

export default function TimeMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'create' | 'sent' | 'received'>('create');
  const [message, setMessage] = useState({
    title: '',
    content: '',
    recipient: '',
    unlockDate: '',
    messageType: 'personal',
    recurring: false
  });

  const { data: sentMessages } = useQuery({
    queryKey: ['/api/time-messages/sent'],
    enabled: activeTab === 'sent'
  });

  const { data: receivedMessages } = useQuery({
    queryKey: ['/api/time-messages/received'],
    enabled: activeTab === 'received'
  });

  const createMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/time-messages/create', data);
    },
    onSuccess: () => {
      toast({
        title: 'Time Message Sealed',
        description: 'Your message has been locked until the specified date.',
      });
      setMessage({
        title: '',
        content: '',
        recipient: '',
        unlockDate: '',
        messageType: 'personal',
        recurring: false
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to Send',
        description: 'There was an error creating your time message.',
        variant: 'destructive',
      });
    }
  });

  const handleCreateMessage = () => {
    if (!message.title || !message.content || !message.unlockDate) {
      toast({
        title: 'Incomplete Message',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const unlockDate = new Date(message.unlockDate);
    if (unlockDate <= new Date()) {
      toast({
        title: 'Invalid Date',
        description: 'Unlock date must be in the future.',
        variant: 'destructive',
      });
      return;
    }

    createMessageMutation.mutate({
      ...message,
      senderId: user?.id,
      unlockDate: unlockDate.toISOString()
    });
  };

  const messageTypes = [
    {
      type: 'personal',
      title: 'Personal Message',
      description: 'Send a message to someone in the future',
      icon: Mail,
      color: 'blue'
    },
    {
      type: 'birthday',
      title: 'Birthday Surprise',
      description: 'Automatic birthday messages',
      icon: Gift,
      color: 'pink'
    },
    {
      type: 'anniversary',
      title: 'Anniversary Note',
      description: 'Commemorate special dates',
      icon: Heart,
      color: 'red'
    },
    {
      type: 'future_self',
      title: 'Future Self',
      description: 'Write to your future self',
      icon: Star,
      color: 'purple'
    },
    {
      type: 'memorial',
      title: 'Memorial Message',
      description: 'Messages for after you\'re gone',
      icon: Clock,
      color: 'gray'
    }
  ];

  const quickDates = [
    { label: '1 Year', months: 12 },
    { label: '5 Years', months: 60 },
    { label: '10 Years', months: 120 },
    { label: '25 Years', months: 300 }
  ];

  const setQuickDate = (months: number) => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + months);
    setMessage(prev => ({ 
      ...prev, 
      unlockDate: futureDate.toISOString().slice(0, 16) 
    }));
  };

  const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    
    if (years > 0) {
      return `${years} year${years !== 1 ? 's' : ''} from now`;
    } else if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} from now`;
    } else {
      return 'Soon';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Time Messages
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Send messages to the future. Lock communications until the perfect moment.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {['create', 'sent', 'received'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab as any)}
                className="mx-1"
              >
                {tab === 'create' && <Send className="w-4 h-4 mr-2" />}
                {tab === 'sent' && <Mail className="w-4 h-4 mr-2" />}
                {tab === 'received' && <Gift className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Message Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Message Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {messageTypes.map((type) => (
                    <div
                      key={type.type}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        message.messageType === type.type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setMessage(prev => ({ ...prev, messageType: type.type }))}
                    >
                      <div className="flex items-center mb-2">
                        <type.icon className={`w-6 h-6 mr-2 text-${type.color}-500`} />
                        <h3 className="font-semibold">{type.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Form */}
            <Card>
              <CardHeader>
                <CardTitle>Compose Your Time Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message Title
                  </label>
                  <Input
                    value={message.title}
                    onChange={(e) => setMessage(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your message a memorable title"
                  />
                </div>

                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recipient
                  </label>
                  <Input
                    value={message.recipient}
                    onChange={(e) => setMessage(prev => ({ ...prev, recipient: e.target.value }))}
                    placeholder="Email or ENS name (leave blank for yourself)"
                  />
                </div>

                {/* Unlock Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Unlock Date & Time
                  </label>
                  <div className="flex space-x-2 mb-2">
                    {quickDates.map((quick) => (
                      <Button
                        key={quick.label}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDate(quick.months)}
                      >
                        {quick.label}
                      </Button>
                    ))}
                  </div>
                  <Input
                    type="datetime-local"
                    value={message.unlockDate}
                    onChange={(e) => setMessage(prev => ({ ...prev, unlockDate: e.target.value }))}
                  />
                  {message.unlockDate && (
                    <p className="text-sm text-gray-500 mt-1">
                      This message will unlock {formatTimeUntil(new Date(message.unlockDate))}
                    </p>
                  )}
                </div>

                {/* Message Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <Textarea
                    value={message.content}
                    onChange={(e) => setMessage(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your message to the future..."
                    rows={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This message will be encrypted and locked until the unlock date
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleCreateMessage}
                  disabled={createMessageMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {createMessageMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Sealing Message...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Seal Time Message
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'sent' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Sent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sentMessages?.length > 0 ? (
                <div className="space-y-4">
                  {sentMessages.map((msg: TimeMessage) => (
                    <div key={msg.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{msg.title}</h3>
                        <Badge variant={msg.status === 'delivered' ? 'default' : 'secondary'}>
                          {msg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        To: {msg.recipient || 'Yourself'}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        Unlocks {formatTimeUntil(msg.unlockDate)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No time messages sent yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'received' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Received Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {receivedMessages?.length > 0 ? (
                <div className="space-y-4">
                  {receivedMessages.map((msg: TimeMessage) => (
                    <div key={msg.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{msg.title}</h3>
                        <Badge variant={msg.status === 'read' ? 'default' : 'destructive'}>
                          {msg.status === 'read' ? 'Read' : 'New'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        From: {msg.recipient}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Unlocked {formatTimeUntil(msg.unlockDate)}
                      </div>
                      {msg.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="mt-2">
                          Read Message
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No time messages received yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}