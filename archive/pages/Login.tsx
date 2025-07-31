import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { z } from "zod";

// Simple login schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  tier: z.string().default("EXPLORER")
});

const masterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  masterKey: z.string().min(1)
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, register, masterLogin, isLoading } = useUnifiedAuth();
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    email: "", password: "", firstName: "", lastName: "", agreedToTerms: false 
  });
  const [masterForm, setMasterForm] = useState({ 
    email: "master@guardianchain.org", password: "masterkey123", masterKey: "GUARDIAN_MASTER_2025", role: "MASTER_ADMIN" 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(loginForm);
      if (result.success) {
        toast({ title: "Login successful!", description: "Welcome to GUARDIANCHAIN" });
        setLocation(result.redirectTo || "/dashboard");
      } else {
        toast({ title: "Login failed", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Login failed", variant: "destructive" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await register(registerForm);
      if (result.success) {
        toast({ title: "Registration successful!", description: "Account created successfully" });
        setLocation(result.redirectTo || "/dashboard");
      } else {
        toast({ title: "Registration failed", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Registration failed", variant: "destructive" });
    }
  };

  const handleMasterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await masterLogin(masterForm);
      if (result.success) {
        toast({ title: "Master login successful!", description: "Welcome, Master Admin" });
        setLocation(result.redirectTo || "/master-admin");
      } else {
        toast({ title: "Master login failed", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Master login failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-background to-green-900/20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            GUARDIANCHAIN
          </h1>
          <p className="text-muted-foreground mt-2">Secure Authentication Portal</p>
        </div>

        <Card className="border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-center">Access Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
                <TabsTrigger value="master">Master</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="register-firstName">First Name</Label>
                      <Input
                        id="register-firstName"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-lastName">Last Name</Label>
                      <Input
                        id="register-lastName"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="register-terms"
                      checked={registerForm.agreedToTerms}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                      required
                      className="rounded border-input"
                    />
                    <Label htmlFor="register-terms" className="text-sm">
                      I agree to the Terms of Service and Privacy Policy
                    </Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="master">
                <div className="text-sm text-muted-foreground mb-4">
                  Master Admin Access - Founder Credentials Required
                </div>
                <form onSubmit={handleMasterLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="master-email">Master Email</Label>
                    <Input
                      id="master-email"
                      type="email"
                      value={masterForm.email}
                      onChange={(e) => setMasterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="master-password">Master Password</Label>
                    <Input
                      id="master-password"
                      type="password"
                      value={masterForm.password}
                      onChange={(e) => setMasterForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="master-key">Master Key</Label>
                    <Input
                      id="master-key"
                      type="password"
                      value={masterForm.masterKey}
                      onChange={(e) => setMasterForm(prev => ({ ...prev, masterKey: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? "Authenticating..." : "Master Access"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/" className="text-purple-400 hover:text-purple-300">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}