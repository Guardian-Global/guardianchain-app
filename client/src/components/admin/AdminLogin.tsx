import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Crown, Key } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async () => {
    if (!adminKey.trim()) {
      toast({
        title: "Admin Key Required",
        description: "Please enter your admin access key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminKey }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Admin Access Granted",
          description: "You now have full admin privileges. Please refresh the page.",
        });
        
        // Refresh the page to reload with admin permissions
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: "Access Denied",
          description: data.message || "Invalid admin key",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Login Failed",
        description: "Unable to process admin login request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassOnboarding = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/force-complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Onboarding Completed",
          description: "Welcome to GuardianChain! Redirecting to dashboard...",
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        toast({
          title: "Failed to Complete Onboarding",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Onboarding bypass error:', error);
      toast({
        title: "Error",
        description: "Unable to complete onboarding",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-hsl(218,54%,9%) border-cyan-500/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-cyan-500/10">
              <ShieldCheck className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            Admin Access
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter admin credentials for full GuardianChain access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Admin Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Enter admin access key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="pl-10 bg-hsl(218,54%,12%) border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleAdminLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-hsl(218,54%,9%) px-2 text-gray-400">Or</span>
              </div>
            </div>
            
            <Button
              onClick={handleBypassOnboarding}
              disabled={isLoading}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Skip Onboarding & Continue
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-4">
            <p>Admin Key: <code className="bg-gray-800 px-1 rounded">GUARDIAN_ADMIN_2025</code></p>
            <p className="mt-1">Full admin privileges include unlimited capsule creation and minting</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}