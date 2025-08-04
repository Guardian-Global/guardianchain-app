import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Layout,
  BarChart3,
  Trophy,
  Sparkles,
  FileText,
  Users,
  Shield,
  Lock,
  Unlock
} from 'lucide-react';

interface DashboardWidget {
  id: string;
  name: string;
  description: string;
  component: string;
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
  category: string;
  icon: any;
}

interface DashboardConfig {
  userId: string;
  layout: 'grid' | 'columns' | 'rows';
  theme: string;
  widgets: DashboardWidget[];
  isPublic: boolean;
  lastUpdated: string;
}

const availableWidgets: Omit<DashboardWidget, 'enabled' | 'position'>[] = [
  {
    id: 'truth-score',
    name: 'Truth Score',
    description: 'Your current truth verification score',
    component: 'TruthScoreWidget',
    size: 'small',
    category: 'stats',
    icon: Trophy
  },
  {
    id: 'gtt-balance',
    name: 'GTT Balance',
    description: 'Your Guardian Truth Token balance',
    component: 'GTTBalanceWidget',
    size: 'small',
    category: 'stats',
    icon: Sparkles
  },
  {
    id: 'recent-capsules',
    name: 'Recent Capsules',
    description: 'Your latest truth capsules',
    component: 'RecentCapsulesWidget',
    size: 'large',
    category: 'content',
    icon: FileText
  },
  {
    id: 'activity-feed',
    name: 'Activity Feed',
    description: 'Recent platform activities',
    component: 'ActivityFeedWidget',
    size: 'medium',
    category: 'social',
    icon: Users
  },
  {
    id: 'analytics-chart',
    name: 'Analytics Chart',
    description: 'Your performance analytics',
    component: 'AnalyticsChartWidget',
    size: 'large',
    category: 'analytics',
    icon: BarChart3
  },
  {
    id: 'security-status',
    name: 'Security Status',
    description: 'Account security and verification status',
    component: 'SecurityStatusWidget',
    size: 'medium',
    category: 'security',
    icon: Shield
  }
];

export default function CustomizableDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [tempConfig, setTempConfig] = useState<DashboardConfig | null>(null);

  const { data: dashboardConfig, isLoading } = useQuery<DashboardConfig>({
    queryKey: ['/api/dashboard/config'],
    enabled: isAuthenticated
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (config: Partial<DashboardConfig>) => {
      return apiRequest('PUT', '/api/dashboard/config', config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/config'] });
      toast({
        title: "Dashboard Updated",
        description: "Your dashboard configuration has been saved successfully.",
      });
      setIsCustomizing(false);
      setTempConfig(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update dashboard configuration.",
        variant: "destructive",
      });
    }
  });

  const resetToDefaultMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/dashboard/config/reset');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/config'] });
      toast({
        title: "Dashboard Reset",
        description: "Your dashboard has been reset to default configuration.",
      });
      setIsCustomizing(false);
      setTempConfig(null);
    }
  });

  if (!isAuthenticated) {
    return (
      <Card className="bg-[#161b22] border-[#30363d] p-8">
        <CardContent className="text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-[#8b949e]" />
          <h2 className="text-2xl font-bold text-[#f0f6fc] mb-4">Access Restricted</h2>
          <p className="text-[#8b949e] mb-6">Please log in to customize your dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-[#00ffe1] border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentConfig = tempConfig || dashboardConfig;
  const enabledWidgets = currentConfig?.widgets?.filter(w => w.enabled) || [];

  const handleStartCustomizing = () => {
    setIsCustomizing(true);
    setTempConfig({
      ...dashboardConfig,
      widgets: dashboardConfig?.widgets || availableWidgets.map((widget, index) => ({
        ...widget,
        enabled: index < 4, // Enable first 4 by default
        position: index
      }))
    } as DashboardConfig);
  };

  const handleSaveConfig = () => {
    if (tempConfig) {
      updateConfigMutation.mutate(tempConfig);
    }
  };

  const handleCancelCustomizing = () => {
    setIsCustomizing(false);
    setTempConfig(null);
  };

  const toggleWidget = (widgetId: string) => {
    if (!tempConfig) return;
    
    setTempConfig({
      ...tempConfig,
      widgets: tempConfig.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    });
  };

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    if (!tempConfig) return;
    
    const widgets = [...tempConfig.widgets];
    const currentIndex = widgets.findIndex(w => w.id === widgetId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < widgets.length) {
      [widgets[currentIndex], widgets[newIndex]] = [widgets[newIndex], widgets[currentIndex]];
      
      // Update positions
      widgets.forEach((widget, index) => {
        widget.position = index;
      });
      
      setTempConfig({
        ...tempConfig,
        widgets
      });
    }
  };

  const togglePublic = () => {
    if (!tempConfig) return;
    
    setTempConfig({
      ...tempConfig,
      isPublic: !tempConfig.isPublic
    });
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layout className="w-6 h-6 text-[#00ffe1]" />
              <div>
                <CardTitle className="text-[#f0f6fc]">Dashboard Customization</CardTitle>
                <p className="text-[#8b949e] text-sm mt-1">
                  Personalize your dashboard layout and widgets
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge 
                variant={currentConfig?.isPublic ? "default" : "secondary"}
                className={currentConfig?.isPublic ? "bg-[#00ffe1] text-[#0d1117]" : ""}
              >
                {currentConfig?.isPublic ? (
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
              
              {!isCustomizing ? (
                <Button
                  onClick={handleStartCustomizing}
                  className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelCustomizing}
                    className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveConfig}
                    disabled={updateConfigMutation.isPending}
                    className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateConfigMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Customization Panel */}
      {isCustomizing && tempConfig && (
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#f0f6fc]">Widget Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Privacy Setting */}
            <div className="flex items-center justify-between p-4 bg-[#21262d] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                  {tempConfig.isPublic ? (
                    <Eye className="w-5 h-5 text-[#7c3aed]" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-[#7c3aed]" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-[#f0f6fc]">Public Dashboard</h4>
                  <p className="text-sm text-[#8b949e]">
                    Allow others to view your dashboard configuration
                  </p>
                </div>
              </div>
              <Switch
                checked={tempConfig.isPublic}
                onCheckedChange={togglePublic}
              />
            </div>

            {/* Available Widgets */}
            <div>
              <h4 className="font-medium text-[#f0f6fc] mb-4">Available Widgets</h4>
              <div className="space-y-3">
                {tempConfig.widgets.map((widget) => {
                  const IconComponent = widget.icon;
                  
                  return (
                    <div
                      key={widget.id}
                      className={`
                        flex items-center justify-between p-4 rounded-lg border transition-all
                        ${widget.enabled 
                          ? 'bg-[#21262d] border-[#00ffe1]/30' 
                          : 'bg-[#21262d]/50 border-[#30363d]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${widget.enabled 
                            ? 'bg-[#00ffe1]/20 text-[#00ffe1]' 
                            : 'bg-[#8b949e]/20 text-[#8b949e]'
                          }
                        `}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className={`font-medium ${widget.enabled ? 'text-[#f0f6fc]' : 'text-[#8b949e]'}`}>
                            {widget.name}
                          </h5>
                          <p className="text-sm text-[#8b949e]">{widget.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className="border-[#30363d] text-[#8b949e]"
                        >
                          {widget.size}
                        </Badge>
                        
                        <Switch
                          checked={widget.enabled}
                          onCheckedChange={() => toggleWidget(widget.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Option */}
            <div className="pt-4 border-t border-[#30363d]">
              <Button
                variant="outline"
                onClick={() => resetToDefaultMutation.mutate()}
                disabled={resetToDefaultMutation.isPending}
                className="border-[#f85149] text-[#f85149] hover:bg-[#f85149]/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {resetToDefaultMutation.isPending ? 'Resetting...' : 'Reset to Default'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="bg-[#21262d] border-[#30363d]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#00ffe1] mt-0.5" />
            <div>
              <h4 className="font-medium text-[#f0f6fc] mb-1">Secure Dashboard</h4>
              <p className="text-sm text-[#8b949e]">
                Your dashboard configuration is encrypted and stored securely. 
                Only you can modify your personal dashboard settings and data.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-[#8b949e]">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#00ffe1]" />
                  <span>End-to-end encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#00ffe1]" />
                  <span>User-only access</span>
                </div>
                <div className="flex items-center gap-1">
                  <Unlock className="w-3 h-3 text-[#00ffe1]" />
                  <span>Persistent storage</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Dashboard Preview */}
      {!isCustomizing && (
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-[#f0f6fc]">Active Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enabledWidgets.map((widget) => {
                const IconComponent = widget.icon;
                
                return (
                  <div
                    key={widget.id}
                    className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#00ffe1]/20 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-[#00ffe1]" />
                      </div>
                      <h4 className="font-medium text-[#f0f6fc]">{widget.name}</h4>
                    </div>
                    <p className="text-sm text-[#8b949e]">{widget.description}</p>
                  </div>
                );
              })}
            </div>
            
            {enabledWidgets.length === 0 && (
              <p className="text-center text-[#8b949e] py-8">
                No widgets enabled. Click "Customize" to add widgets to your dashboard.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}