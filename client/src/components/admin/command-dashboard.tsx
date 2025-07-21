import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Terminal, 
  Shield, 
  Settings, 
  Users, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  Database,
  Network,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CommandDashboardProps {
  className?: string;
}

interface SystemHealth {
  api: "healthy" | "warning" | "error";
  database: "healthy" | "warning" | "error";
  blockchain: "healthy" | "warning" | "error";
  storage: "healthy" | "warning" | "error";
}

interface AdminCommand {
  id: string;
  command: string;
  result: string;
  status: "success" | "error" | "pending";
  timestamp: Date;
}

export function CommandDashboard({ className }: CommandDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<AdminCommand[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    api: "healthy",
    database: "healthy", 
    blockchain: "warning",
    storage: "healthy"
  });
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with some sample commands
    setCommandHistory([
      {
        id: "1",
        command: "system:health-check",
        result: "All systems operational. GTT balance: 247,500 tokens",
        status: "success",
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: "2", 
        command: "capsule:verify --id=caps_001",
        result: "Capsule verified successfully. Yield assigned: 150 GTT",
        status: "success",
        timestamp: new Date(Date.now() - 180000)
      },
      {
        id: "3",
        command: "contracts:deploy --network=mumbai",
        result: "Warning: Insufficient MATIC balance for deployment",
        status: "error",
        timestamp: new Date(Date.now() - 120000)
      }
    ]);
  }, []);

  const executeCommand = async () => {
    if (!commandInput.trim()) return;

    const newCommand: AdminCommand = {
      id: Date.now().toString(),
      command: commandInput,
      result: "",
      status: "pending",
      timestamp: new Date()
    };

    setCommandHistory(prev => [newCommand, ...prev]);
    setIsExecuting(true);

    try {
      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let result = "";
      let status: "success" | "error" = "success";

      // Handle different command types
      if (commandInput.startsWith("system:")) {
        result = "System check completed. All services operational.";
      } else if (commandInput.startsWith("user:")) {
        result = "User operation completed successfully.";
      } else if (commandInput.startsWith("capsule:")) {
        result = "Capsule operation executed. Yield updated.";
      } else if (commandInput.startsWith("deploy:")) {
        result = "Deployment initiated. Check network status.";
      } else {
        result = "Command executed successfully.";
      }

      // Update command result
      setCommandHistory(prev => 
        prev.map(cmd => 
          cmd.id === newCommand.id 
            ? { ...cmd, result, status }
            : cmd
        )
      );

      toast({
        title: "Command Executed",
        description: result,
        variant: status === "success" ? "default" : "destructive"
      });

    } catch (error) {
      setCommandHistory(prev => 
        prev.map(cmd => 
          cmd.id === newCommand.id 
            ? { 
                ...cmd, 
                result: "Command execution failed", 
                status: "error" as const 
              }
            : cmd
        )
      );
    } finally {
      setIsExecuting(false);
      setCommandInput("");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const quickCommands = [
    { label: "Health Check", command: "system:health-check" },
    { label: "User Stats", command: "user:stats --all" },
    { label: "Sync Blockchain", command: "blockchain:sync" },
    { label: "Backup Database", command: "database:backup" },
    { label: "Clear Cache", command: "cache:clear" },
    { label: "Verify Capsules", command: "capsule:verify-batch" }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Terminal className="h-8 w-8 text-purple-500" />
          <h2 className="text-3xl font-bold gradient-text">
            Admin Command Center
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Master admin controls for GUARDIANCHAIN protocol management, 
          system monitoring, and emergency operations.
        </p>
      </motion.div>

      {/* System Health Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(systemHealth).map(([system, status]) => (
                <motion.div
                  key={system}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 p-3 rounded-lg border bg-muted/50"
                >
                  {getStatusIcon(status)}
                  <div>
                    <div className="font-medium capitalize">{system}</div>
                    <div className={`text-sm ${getStatusColor(status)}`}>
                      {status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Command Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="terminal" className="flex items-center space-x-2">
            <Terminal className="h-4 w-4" />
            <span>Terminal</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">3,892</div>
                <div className="text-sm text-muted-foreground">Capsules Created</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">247.5K</div>
                <div className="text-sm text-muted-foreground">GTT Balance</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="terminal" className="space-y-4">
          {/* Command Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="h-5 w-5" />
                <span>Command Terminal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter admin command (e.g., system:health-check)"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isExecuting) {
                      executeCommand();
                    }
                  }}
                  className="font-mono"
                />
                <Button 
                  onClick={executeCommand}
                  disabled={isExecuting || !commandInput.trim()}
                >
                  {isExecuting ? "Executing..." : "Execute"}
                </Button>
              </div>

              {/* Quick Commands */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Quick Commands:</div>
                <div className="flex flex-wrap gap-2">
                  {quickCommands.map((cmd) => (
                    <Button
                      key={cmd.command}
                      size="sm"
                      variant="outline"
                      onClick={() => setCommandInput(cmd.command)}
                    >
                      {cmd.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Command History */}
          <Card>
            <CardHeader>
              <CardTitle>Command History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {commandHistory.map((cmd) => (
                    <motion.div
                      key={cmd.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {cmd.command}
                        </code>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              cmd.status === "success" ? "default" :
                              cmd.status === "error" ? "destructive" : "secondary"
                            }
                          >
                            {cmd.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {cmd.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      {cmd.result && (
                        <div className="text-sm text-muted-foreground">
                          {cmd.result}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                User management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                System configuration interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CommandDashboard;