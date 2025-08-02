import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Phone,
  PhoneCall,
  Video,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Settings,
  Bell,
  Circle,
  CheckCheck,
  Mic,
  MicOff,
  PhoneOff,
  VideoOff,
  User,
  Shield,
  Star,
  Archive,
  Trash2,
  Image,
  File,
  Calendar,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file" | "audio" | "video";
  status: "sent" | "delivered" | "read";
  attachments?: {
    type: string;
    url: string;
    name: string;
    size: number;
  }[];
}

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  status: "online" | "away" | "busy" | "offline";
  lastSeen?: Date;
  isVerified: boolean;
  role: "user" | "creator" | "sovereign" | "enterprise";
  lastMessage?: Message;
  unreadCount: number;
}

interface CallState {
  isActive: boolean;
  isIncoming: boolean;
  contactId?: string;
  contactName?: string;
  type: "voice" | "video";
  duration: number;
  status: "ringing" | "connecting" | "connected" | "ended";
}

export function MessagingCenter() {
  const [activeTab, setActiveTab] = useState<
    "chats" | "contacts" | "calls" | "settings"
  >("chats");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isIncoming: false,
    type: "voice",
    duration: 0,
    status: "ended",
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Goldman Sachs Institutional",
      username: "@goldman_institutional",
      avatar: "/avatars/goldman.png",
      status: "online",
      isVerified: true,
      role: "enterprise",
      unreadCount: 2,
      lastMessage: {
        id: "m1",
        senderId: "1",
        senderName: "Goldman Sachs Institutional",
        content: "Ready to finalize the $75M institutional legacy vault?",
        timestamp: new Date(Date.now() - 300000),
        type: "text",
        status: "delivered",
      },
    },
    {
      id: "2",
      name: "Dr. Sarah Chen",
      username: "@sarah_climate_expert",
      avatar: "/avatars/sarah.png",
      status: "online",
      isVerified: true,
      role: "creator",
      unreadCount: 0,
      lastMessage: {
        id: "m2",
        senderId: "2",
        senderName: "Dr. Sarah Chen",
        content: "The coral reef restoration project shows promising results",
        timestamp: new Date(Date.now() - 900000),
        type: "text",
        status: "read",
      },
    },
    {
      id: "3",
      name: "U.S. Treasury Department",
      username: "@us_treasury_official",
      avatar: "/avatars/treasury.png",
      status: "away",
      isVerified: true,
      role: "sovereign",
      unreadCount: 5,
      lastMessage: {
        id: "m3",
        senderId: "3",
        senderName: "U.S. Treasury Department",
        content:
          "Constitutional archive requires additional security clearance",
        timestamp: new Date(Date.now() - 1800000),
        type: "text",
        status: "sent",
      },
    },
    {
      id: "4",
      name: "OpenAI Research Team",
      username: "@openai_research",
      avatar: "/avatars/openai.png",
      status: "busy",
      isVerified: true,
      role: "enterprise",
      unreadCount: 1,
      lastMessage: {
        id: "m4",
        senderId: "4",
        senderName: "OpenAI Research Team",
        content: "AI superintelligence archive ready for $8.5B staking",
        timestamp: new Date(Date.now() - 3600000),
        type: "text",
        status: "delivered",
      },
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      senderId: "1",
      senderName: "Goldman Sachs Institutional",
      content:
        "We're interested in setting up a comprehensive institutional legacy vault for our C-suite executives.",
      timestamp: new Date(Date.now() - 3600000),
      type: "text",
      status: "read",
    },
    {
      id: "m2",
      senderId: "current",
      senderName: "You",
      content:
        "Perfect! Our institutional legacy capsules offer enterprise-grade preservation with 847% ROI over 100-year periods. Would you like to start with our CEO Legacy Vault template?",
      timestamp: new Date(Date.now() - 3000000),
      type: "text",
      status: "delivered",
    },
    {
      id: "m3",
      senderId: "1",
      senderName: "Goldman Sachs Institutional",
      content:
        "Yes, we're looking at a $75M staking commitment. Can we schedule a call to discuss the governance structure and trustee arrangements?",
      timestamp: new Date(Date.now() - 1800000),
      type: "text",
      status: "read",
    },
    {
      id: "m4",
      senderId: "current",
      senderName: "You",
      content:
        "Absolutely. I'll set up a secure video call for tomorrow at 2 PM EST. I'll also prepare the institutional compliance documentation.",
      timestamp: new Date(Date.now() - 900000),
      type: "text",
      status: "delivered",
    },
    {
      id: "m5",
      senderId: "1",
      senderName: "Goldman Sachs Institutional",
      content: "Ready to finalize the $75M institutional legacy vault?",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
      status: "delivered",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "enterprise":
        return "bg-purple-600/20 text-purple-400";
      case "sovereign":
        return "bg-yellow-600/20 text-yellow-400";
      case "creator":
        return "bg-blue-600/20 text-blue-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "current",
      senderName: "You",
      content: messageInput,
      timestamp: new Date(),
      type: "text",
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");

    // Simulate message delivery with Twilio
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "delivered" as const }
            : msg,
        ),
      );
    }, 1000);
  };

  const startCall = async (contactId: string, type: "voice" | "video") => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    setCallState({
      isActive: true,
      isIncoming: false,
      contactId,
      contactName: contact.name,
      type,
      duration: 0,
      status: "connecting",
    });

    // Simulate call connection
    setTimeout(() => {
      setCallState((prev) => ({ ...prev, status: "connected" }));

      // Start duration counter
      const interval = setInterval(() => {
        setCallState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      // Store interval for cleanup
      (window as any).callInterval = interval;
    }, 2000);
  };

  const endCall = () => {
    if ((window as any).callInterval) {
      clearInterval((window as any).callInterval);
    }

    setCallState({
      isActive: false,
      isIncoming: false,
      type: "voice",
      duration: 0,
      status: "ended",
    });
  };

  const selectedContactData = contacts.find((c) => c.id === selectedContact);
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Communications</h2>
            <Button size="sm" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-700 p-1 rounded-lg">
            <Button
              size="sm"
              variant={activeTab === "chats" ? "default" : "ghost"}
              onClick={() => setActiveTab("chats")}
              className="flex-1 text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Chats
            </Button>
            <Button
              size="sm"
              variant={activeTab === "contacts" ? "default" : "ghost"}
              onClick={() => setActiveTab("contacts")}
              className="flex-1 text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              Contacts
            </Button>
            <Button
              size="sm"
              variant={activeTab === "calls" ? "default" : "ghost"}
              onClick={() => setActiveTab("calls")}
              className="flex-1 text-xs"
            >
              <Phone className="h-3 w-3 mr-1" />
              Calls
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10 bg-slate-700 border-slate-600"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`p-4 border-b border-slate-700 cursor-pointer transition-colors ${
                selectedContact === contact.id
                  ? "bg-slate-700"
                  : "hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(contact.status)}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      {contact.isVerified && (
                        <Shield className="h-3 w-3 text-blue-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {contact.lastMessage && (
                        <span className="text-xs text-slate-400">
                          {formatTime(contact.lastMessage.timestamp)}
                        </span>
                      )}
                      {contact.unreadCount > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-slate-400 truncate">
                      {contact.lastMessage?.content || "No messages yet"}
                    </p>
                    <Badge className={`text-xs ${getRoleColor(contact.role)}`}>
                      {contact.role.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContactData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContactData.avatar} />
                      <AvatarFallback>
                        {selectedContactData.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(selectedContactData.status)}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">
                        {selectedContactData.name}
                      </h3>
                      {selectedContactData.isVerified && (
                        <Shield className="h-4 w-4 text-blue-400" />
                      )}
                      <Badge
                        className={`text-xs ${getRoleColor(selectedContactData.role)}`}
                      >
                        {selectedContactData.role.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {selectedContactData.status === "online"
                        ? "Active now"
                        : `Last seen ${formatTime(selectedContactData.lastSeen || new Date())}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startCall(selectedContactData.id, "voice")}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startCall(selectedContactData.id, "video")}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isTyping && (
                <div className="mt-2 text-sm text-slate-400">
                  {selectedContactData.name} is typing...
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === "current" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      message.senderId === "current"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-white"
                    } rounded-lg p-3`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-75">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.senderId === "current" && (
                        <div className="flex items-center space-x-1">
                          {message.status === "sent" && (
                            <Circle className="h-3 w-3" />
                          )}
                          {message.status === "delivered" && (
                            <CheckCheck className="h-3 w-3" />
                          )}
                          {message.status === "read" && (
                            <CheckCheck className="h-3 w-3 text-blue-300" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-800">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="bg-slate-700 border-slate-600"
                  />
                  <Button size="sm" variant="ghost">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                Select a conversation
              </h3>
              <p className="text-slate-400">
                Choose a contact to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Call Overlay */}
      {callState.isActive && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-96">
            <CardContent className="p-6 text-center">
              <div className="mb-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={selectedContactData?.avatar} />
                  <AvatarFallback>
                    {callState.contactName?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium text-white">
                  {callState.contactName}
                </h3>
                <p className="text-slate-400 capitalize">
                  {callState.status === "connected"
                    ? formatCallDuration(callState.duration)
                    : callState.status}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-4">
                {callState.type === "video" && (
                  <Button size="lg" variant="ghost" className="rounded-full">
                    <VideoOff className="h-6 w-6" />
                  </Button>
                )}
                <Button size="lg" variant="ghost" className="rounded-full">
                  <MicOff className="h-6 w-6" />
                </Button>
                <Button
                  size="lg"
                  onClick={endCall}
                  className="rounded-full bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
