import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function SimpleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store session data
        localStorage.setItem('auth_token', data.session.token);
        localStorage.setItem('auth_user', JSON.stringify(data.session.user));
        
        toast({
          title: "Login Successful",
          description: "Welcome to GuardianChain!",
        });
        
        // Force page reload to update auth state
        window.location.href = "/";
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          firstName: email.split('@')[0],
          lastName: "User"
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store session data
        localStorage.setItem('auth_token', data.session.token);
        localStorage.setItem('auth_user', JSON.stringify(data.session.user));
        
        toast({
          title: "Account Created",
          description: "Welcome to GuardianChain!",
        });
        
        // Force page reload to update auth state
        window.location.href = "/";
      } else {
        toast({
          title: "Signup Failed",
          description: data.message || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-center text-white">
            GuardianChain Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter any email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Enter any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <Button 
                type="button"
                onClick={handleSignup}
                disabled={isLoading}
                variant="outline"
                className="flex-1 border-slate-600 text-white hover:bg-slate-700"
              >
                {isLoading ? "Creating..." : "Sign Up"}
              </Button>
            </div>
          </form>
          <p className="text-sm text-slate-400 text-center">
            Demo mode: Any email/password works
          </p>
        </CardContent>
      </Card>
    </div>
  );
}