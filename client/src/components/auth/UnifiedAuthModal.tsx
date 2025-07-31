import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Crown, LogIn, UserPlus } from "lucide-react";

interface UnifiedAuthModalProps {
  trigger?: React.ReactNode;
  defaultTab?: "login" | "signup" | "master";
}

export default function UnifiedAuthModal({ 
  trigger, 
  defaultTab = "login" 
}: UnifiedAuthModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { login, register, masterLogin, isLoading } = useUnifiedAuth();
  const { toast } = useToast();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [masterKey, setMasterKey] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to GUARDIANCHAIN.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        firstName: username,
        agreedToTerms: true,
      });
      toast({
        title: "Account Created!",
        description: "Welcome to GUARDIANCHAIN. You can now access your dashboard.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleMasterAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await masterLogin({ email, password, masterKey });
      toast({
        title: "Master Access Granted",
        description: "Welcome to GUARDIANCHAIN Command Center.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Master Access Denied",
        description: error instanceof Error ? error.message : "Invalid master credentials",
        variant: "destructive",
      });
    }
  };

  const defaultTrigger = (
    <Button 
      variant="default" 
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      <User className="w-4 h-4 mr-2" />
      Login / Sign Up
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogTitle className="sr-only">GUARDIANCHAIN Authentication</DialogTitle>
        
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">GUARDIANCHAIN</h2>
          <p className="text-slate-400">Secure Authentication Portal</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-green-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="master" className="data-[state=active]:bg-red-600">
              <Crown className="w-4 h-4 mr-2" />
              Master
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Sign In</CardTitle>
                <CardDescription>Access your GUARDIANCHAIN account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription>Join the GUARDIANCHAIN ecosystem</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-username" className="text-slate-300">Username</Label>
                    <Input
                      id="signup-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Explorer Tier
                    </Badge>
                    <span className="text-sm text-slate-400">Free access included</span>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="master" className="mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-red-400" />
                  Master Admin Access
                </CardTitle>
                <CardDescription>Founder & Enterprise Command Center</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMasterAccess} className="space-y-4">
                  <div>
                    <Label htmlFor="master-email" className="text-slate-300">Master Email</Label>
                    <Input
                      id="master-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="master@guardianchain.org"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="master-password" className="text-slate-300">Master Password</Label>
                    <Input
                      id="master-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="master-key" className="text-slate-300">Master Key</Label>
                    <Input
                      id="master-key"
                      type="password"
                      value={masterKey}
                      onChange={(e) => setMasterKey(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="GUARDIAN_MASTER_2025"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      Master Admin
                    </Badge>
                    <span className="text-sm text-slate-400">Full platform control</span>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Access Command Center"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}