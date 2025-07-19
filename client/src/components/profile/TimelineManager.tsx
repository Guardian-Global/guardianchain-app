import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  EyeOff, 
  Globe, 
  Lock, 
  Calendar, 
  Activity, 
  TrendingUp, 
  MessageSquare,
  Share,
  Heart,
  Bookmark,
  User,
  Users
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'capsule' | 'verification' | 'yield' | 'social' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  isPublic: boolean;
  metadata?: {
    value?: number;
    participants?: string[];
    reactions?: number;
    shares?: number;
  };
}

interface TimelineManagerProps {
  isPublic: boolean;
}

export function TimelineManager({ isPublic }: TimelineManagerProps) {
  const [timelinePrivacy, setTimelinePrivacy] = useState(isPublic);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Mock timeline events
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'capsule',
      title: 'Created Climate Research Data Verification',
      description: 'Published a comprehensive climate data verification capsule with 247 data points',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isPublic: true,
      metadata: {
        value: 2847.50,
        reactions: 23,
        shares: 7
      }
    },
    {
      id: '2',
      type: 'yield',
      title: 'Received GTT Yield Distribution',
      description: 'Earned 127.5 GTT from Legal Document Authentication capsule performance',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isPublic: false,
      metadata: {
        value: 127.5
      }
    },
    {
      id: '3',
      type: 'verification',
      title: 'Verified 5 Community Capsules',
      description: 'Contributed to community verification of AI training data integrity capsules',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isPublic: true,
      metadata: {
        participants: ['user1', 'user2', 'user3'],
        reactions: 15
      }
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Reached Truth Guardian Status',
      description: 'Achieved 1000+ successful verifications and unlocked Truth Guardian badge',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isPublic: true,
      metadata: {
        reactions: 89,
        shares: 12
      }
    },
    {
      id: '5',
      type: 'social',
      title: 'Followed by Environmental Research Institute',
      description: 'Gained recognition from @EnviroResearch for climate data verification work',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isPublic: true,
      metadata: {
        reactions: 34,
        shares: 8
      }
    },
    {
      id: '6',
      type: 'capsule',
      title: 'Updated Legal Document Authentication',
      description: 'Enhanced legal document verification with new blockchain attestation features',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      isPublic: false,
      metadata: {
        value: 1523.75,
        reactions: 19,
        shares: 4
      }
    }
  ];

  const getEventIcon = (type: string) => {
    const icons = {
      capsule: '📄',
      verification: '✅',
      yield: '💰',
      social: '👥',
      achievement: '🏆'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getEventColor = (type: string) => {
    const colors = {
      capsule: 'border-blue-500',
      verification: 'border-green-500',
      yield: 'border-amber-500',
      social: 'border-purple-500',
      achievement: 'border-pink-500'
    };
    return colors[type as keyof typeof colors] || 'border-gray-500';
  };

  const filteredEvents = timelineEvents.filter(event => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'public') return event.isPublic;
    if (selectedFilter === 'private') return !event.isPublic;
    return event.type === selectedFilter;
  });

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Privacy Controls */}
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Timeline Manager
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Timeline Privacy</span>
                <Switch
                  checked={timelinePrivacy}
                  onCheckedChange={setTimelinePrivacy}
                />
                <Globe className="w-4 h-4 text-slate-400" />
              </div>
              <Badge variant={timelinePrivacy ? "default" : "secondary"}>
                {timelinePrivacy ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            {timelinePrivacy 
              ? "Your timeline is visible to all users. You can still mark individual events as private."
              : "Your timeline is private. Only you can see your activity and events."
            }
          </p>
        </CardContent>
      </Card>

      {/* Timeline Filters */}
      <Card className="bg-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Events', icon: Activity },
              { key: 'public', label: 'Public', icon: Globe },
              { key: 'private', label: 'Private', icon: Lock },
              { key: 'capsule', label: 'Capsules', icon: null },
              { key: 'verification', label: 'Verifications', icon: null },
              { key: 'yield', label: 'Yield', icon: null },
              { key: 'social', label: 'Social', icon: Users },
              { key: 'achievement', label: 'Achievements', icon: null }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.key)}
                className="flex items-center"
              >
                {filter.icon && <filter.icon className="w-3 h-3 mr-1" />}
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="analytics">Timeline Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card className="bg-slate-800">
            <CardContent className="p-6">
              <div className="space-y-6">
                {filteredEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline connector */}
                    {index < filteredEvents.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-600"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {/* Event icon */}
                      <div className={`w-12 h-12 rounded-full border-2 ${getEventColor(event.type)} bg-slate-700 flex items-center justify-center text-xl`}>
                        {getEventIcon(event.type)}
                      </div>
                      
                      {/* Event content */}
                      <div className="flex-1 bg-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-white mb-1">{event.title}</h3>
                            <p className="text-sm text-slate-300">{event.description}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={event.isPublic ? "default" : "secondary"} className="text-xs">
                              {event.isPublic ? (
                                <>
                                  <Globe className="w-2 h-2 mr-1" />
                                  Public
                                </>
                              ) : (
                                <>
                                  <Lock className="w-2 h-2 mr-1" />
                                  Private
                                </>
                              )}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {formatTimeAgo(event.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Event metadata */}
                        {event.metadata && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm">
                              {event.metadata.value && (
                                <span className="text-amber-400">
                                  {event.metadata.value.toLocaleString()} GTT
                                </span>
                              )}
                              {event.metadata.participants && (
                                <span className="text-blue-400">
                                  {event.metadata.participants.length} participants
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3 text-slate-400">
                              {event.metadata.reactions && (
                                <div className="flex items-center">
                                  <Heart className="w-3 h-3 mr-1" />
                                  {event.metadata.reactions}
                                </div>
                              )}
                              {event.metadata.shares && (
                                <div className="flex items-center">
                                  <Share className="w-3 h-3 mr-1" />
                                  {event.metadata.shares}
                                </div>
                              )}
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                <MessageSquare className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-300 mb-2">No events found</h3>
                    <p className="text-slate-400">Try adjusting your filter selection</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Events</span>
                    <span className="font-bold">{timelineEvents.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Public Events</span>
                    <span className="font-bold text-green-400">
                      {timelineEvents.filter(e => e.isPublic).length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Private Events</span>
                    <span className="font-bold text-amber-400">
                      {timelineEvents.filter(e => !e.isPublic).length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Total Reactions</span>
                    <span className="font-bold text-pink-400">
                      {timelineEvents.reduce((sum, e) => sum + (e.metadata?.reactions || 0), 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Total Shares</span>
                    <span className="font-bold text-blue-400">
                      {timelineEvents.reduce((sum, e) => sum + (e.metadata?.shares || 0), 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-400" />
                  Event Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['capsule', 'verification', 'yield', 'social', 'achievement'].map((type) => {
                    const count = timelineEvents.filter(e => e.type === type).length;
                    const percentage = (count / timelineEvents.length) * 100;
                    
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize flex items-center">
                            <span className="mr-2">{getEventIcon(type)}</span>
                            {type}
                          </span>
                          <span>{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getEventColor(type).replace('border', 'bg')}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}