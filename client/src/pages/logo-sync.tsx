import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Monitor, Globe, Settings } from "lucide-react";
import LogoSyncManager from "@/components/assets/LogoSyncManager";

const LogoSyncPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Cross-Platform Logo Synchronization
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Manage and synchronize GUARDIANCHAIN logos across all platforms with
            real-time monitoring, version control, and automated distribution.
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="sync-manager" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger
              value="sync-manager"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Manager
            </TabsTrigger>
            <TabsTrigger
              value="platform-status"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Monitor className="h-4 w-4" />
              Platform Status
            </TabsTrigger>
            <TabsTrigger
              value="global-distribution"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Globe className="h-4 w-4" />
              Global Distribution
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sync-manager">
            <LogoSyncManager />
          </TabsContent>

          <TabsContent value="platform-status">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Desktop Platform Status */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-purple-400" />
                    Desktop Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Chrome/Edge</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Firefox</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Safari</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3">
                    <div className="text-sm text-slate-400">Last Update</div>
                    <div className="text-white">2 minutes ago</div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Platform Status */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-green-400" />
                    Mobile Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">iOS Safari</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Android Chrome</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mobile Edge</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3">
                    <div className="text-sm text-slate-400">Last Update</div>
                    <div className="text-white">2 minutes ago</div>
                  </div>
                </CardContent>
              </Card>

              {/* Global CDN Status */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    Global CDN
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">North America</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Europe</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Asia Pacific</span>
                      <span className="text-green-400">✓ Synced</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3">
                    <div className="text-sm text-slate-400">Edge Locations</div>
                    <div className="text-white">147 Active</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="global-distribution">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Global Logo Distribution Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      147
                    </div>
                    <div className="text-slate-400">CDN Edge Locations</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      99.9%
                    </div>
                    <div className="text-slate-400">Global Availability</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      50ms
                    </div>
                    <div className="text-slate-400">Avg Load Time</div>
                  </div>
                </div>

                <div className="bg-slate-900/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Regional Distribution
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">North America</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-400 h-2 rounded-full w-full"></div>
                        </div>
                        <span className="text-green-400 text-sm">100%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Europe</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-400 h-2 rounded-full w-full"></div>
                        </div>
                        <span className="text-green-400 text-sm">100%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Asia Pacific</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-400 h-2 rounded-full w-11/12"></div>
                        </div>
                        <span className="text-green-400 text-sm">98%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">South America</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-400 h-2 rounded-full w-5/6"></div>
                        </div>
                        <span className="text-green-400 text-sm">95%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Sync Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Auto-Sync Interval
                    </label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                      <option>Every 5 minutes</option>
                      <option>Every 15 minutes</option>
                      <option>Every hour</option>
                      <option>Manual only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Retry Attempts
                    </label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                      <option>3 attempts</option>
                      <option>5 attempts</option>
                      <option>10 attempts</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Performance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Cache Duration
                    </label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                      <option>1 hour</option>
                      <option>24 hours</option>
                      <option>7 days</option>
                      <option>30 days</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Compression Level
                    </label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                      <option>Balanced</option>
                      <option>Maximum Quality</option>
                      <option>Maximum Compression</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LogoSyncPage;
