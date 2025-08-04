import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return apiRequest('POST', '/api/auth/login', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful!",
        description: "Welcome back to GuardianChain.",
      });
      setLocation('/profile');
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate(formData);
  };

  const updateFormData = (updates: Partial<LoginData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ffe1]/20 to-[#7c3aed]/20 rounded-full border border-[#00ffe1]/30 mb-6">
            <Shield className="w-5 h-5 text-[#00ffe1]" />
            <span className="text-[#00ffe1] font-medium">Secure Login</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent">
            Welcome Back
          </h1>
          
          <p className="text-[#8b949e]">
            Sign in to access your GuardianChain account
          </p>
        </div>

        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-center text-[#f0f6fc]">Member Login</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder="Enter your email address"
                    className="bg-[#21262d] border-[#30363d] text-[#f0f6fc] pl-12"
                    data-testid="input-email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateFormData({ password: e.target.value })}
                    placeholder="Enter your password"
                    className="bg-[#21262d] border-[#30363d] text-[#f0f6fc] pl-12 pr-12"
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#8b949e]" />
                    ) : (
                      <Eye className="w-4 h-4 text-[#8b949e]" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => updateFormData({ rememberMe: e.target.checked })}
                    className="rounded border-[#30363d] bg-[#21262d] text-[#00ffe1] focus:ring-[#00ffe1] focus:ring-offset-0"
                    data-testid="checkbox-remember-me"
                  />
                  <span className="text-sm text-[#8b949e]">Remember me</span>
                </label>
                
                <Link href="/forgot-password">
                  <Button variant="link" className="text-[#00ffe1] hover:text-[#00e5cb] p-0">
                    Forgot password?
                  </Button>
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb] h-12"
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-[#0d1117] border-t-transparent rounded-full mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-[#30363d]"></div>
              <span className="px-4 text-sm text-[#8b949e]">or</span>
              <div className="flex-1 border-t border-[#30363d]"></div>
            </div>

            {/* Demo Login */}
            <Card className="bg-[#21262d] border-[#30363d] p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#f59e0b] mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#f0f6fc] mb-1">Demo Mode Available</h4>
                  <p className="text-sm text-[#8b949e] mb-3">
                    For testing purposes, you can use the debug authentication system.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                    <CheckCircle className="w-4 h-4 text-[#00ffe1]" />
                    <span>Debug user: debug@guardianchain.app</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-[#8b949e]">
                Don't have an account?{' '}
                <Link href="/onboarding">
                  <Button variant="link" className="text-[#00ffe1] hover:text-[#00e5cb] p-0">
                    Create one now
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/">
            <Button variant="link" className="text-[#8b949e] hover:text-[#f0f6fc]">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}