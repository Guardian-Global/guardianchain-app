import React, { useState } from "react";
import { useLocation } from "wouter";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, Crown, Mail, Github, Chrome } from "lucide-react";
import { BrandedText } from "@/components/BrandEnforcement";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { loginSchema, registerSchema, masterLoginSchema } from "@shared/schema";

export default function UnifiedLogin() {
  const [, setLocation] = useLocation();
  const { login, register, masterLogin, isLoading } = useUnifiedAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    agreedToTerms: false
  });

  const [masterForm, setMasterForm] = useState({
    email: "",
    password: "",
    role: "",
    masterKey: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = loginSchema.parse(loginForm);
      const result = await login(validatedData);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to GUARDIANCHAIN",
        });
        
        // Redirect based on user role/tier
        setLocation(result.redirectTo || "/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = registerSchema.parse(registerForm);
      const result = await register(validatedData);
      
      if (result.success) {
        toast({
          title: "Registration Successful",
          description: "Welcome to GUARDIANCHAIN! Please complete onboarding.",
        });
        
        setLocation(result.redirectTo || "/onboarding");
      } else {
        toast({
          title: "Registration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleMasterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = masterLoginSchema.parse(masterForm);
      const result = await masterLogin(validatedData);
      
      if (result.success) {
        toast({
          title: "Master Access Granted",
          description: "Welcome, Master Administrator",
        });
        
        setLocation(result.redirectTo || "/master-admin");
      } else {
        toast({
          title: "Access Denied",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleSocialLogin = async (provider: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `${provider} authentication will be available soon`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="text-white h-5 w-5" />
            </div>
            <BrandedText size="lg" className="gradient-text" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Access GUARDIANCHAIN
          </CardTitle>
          <p className="text-slate-400">
            Single entry point for all services
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="login" className="text-xs">
                <Lock className="w-4 h-4 mr-1" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="text-xs">
                <Mail className="w-4 h-4 mr-1" />
                Sign Up
              </TabsTrigger>
              <TabsTrigger value="master" className="text-xs">
                <Crown className="w-4 h-4 mr-1" />
                Master
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={registerForm.agreedToTerms}
                    onCheckedChange={(checked) => 
                      setRegisterForm(prev => ({ ...prev, agreedToTerms: !!checked }))
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  disabled={isLoading || !registerForm.agreedToTerms}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="master">
              <form onSubmit={handleMasterLogin} className="space-y-4">
                <div>
                  <Label htmlFor="masterEmail">Master Email</Label>
                  <Input
                    id="masterEmail"
                    type="email"
                    value={masterForm.email}
                    onChange={(e) => setMasterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="master@guardianchain.org"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="masterPassword">Master Password</Label>
                  <Input
                    id="masterPassword"
                    type="password"
                    value={masterForm.password}
                    onChange={(e) => setMasterForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Master password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={masterForm.role}
                    onChange={(e) => setMasterForm(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="MASTER_ADMIN"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="masterKey">Master Key</Label>
                  <Input
                    id="masterKey"
                    type="password"
                    value={masterForm.masterKey}
                    onChange={(e) => setMasterForm(prev => ({ ...prev, masterKey: e.target.value }))}
                    placeholder="Master authentication key"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Master Access"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Social Login Options */}
          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialLogin("Google")}
                className="border-slate-600 hover:bg-slate-700"
              >
                <Chrome className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialLogin("GitHub")}
                className="border-slate-600 hover:bg-slate-700"
              >
                <Github className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialLogin("Web3")}
                className="border-slate-600 hover:bg-slate-700"
              >
                <Shield className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-6 pt-4 border-t border-slate-600">
            <p className="text-xs text-slate-400 text-center">
              By signing in, you agree to our enterprise security standards and access controls.
              Features available based on your subscription tier.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}