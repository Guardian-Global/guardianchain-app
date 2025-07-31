import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogIn, Crown, Zap, Shield } from 'lucide-react';
import { handleLoginRedirect } from '@/auth/routeGuard';

// This would be replaced with actual Replit Auth imports
// import { useReplit } from '@replit/extensions-react';
// import { auth } from '@replit/auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Mock Replit Auth integration - replace with actual implementation
  useEffect(() => {
    // Check if user is already authenticated
    // const currentUser = auth.getCurrentUser();
    // setUser(currentUser);
    
    // If authenticated, redirect to appropriate dashboard
    if (user) {
      const redirectRoute = handleLoginRedirect(user);
      window.location.href = redirectRoute;
    }
  }, [user]);
  
  const handleReplitLogin = async () => {
    setIsLoading(true);
    try {
      // Actual Replit Auth implementation would go here
      // const result = await auth.signIn();
      // setUser(result.user);
      
      // Mock implementation for demonstration
      console.log('Initiating Replit Auth login...');
      
      // For now, redirect to existing auth system
      window.location.href = '/api/login';
      
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            GUARDIANCHAIN Authentication
          </h1>
          <p className="text-xl text-slate-300">
            Secure access to truth verification ecosystem
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-blue-400" />
                Sign In with Replit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Access your GUARDIANCHAIN account using your Replit credentials. 
                Secure, seamless, and integrated with your development workflow.
              </p>
              
              <Button 
                onClick={handleReplitLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Authenticating...' : 'Continue with Replit'}
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  Powered by Replit Authentication
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Tier Benefits */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Access Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="font-medium">Guest</span>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Free
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="font-medium">Pro</span>
                  </div>
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    Premium
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">Admin</span>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    Enterprise
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400">
                  Your access level will be determined automatically based on your 
                  Replit account metadata and subscription status.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            New to GUARDIANCHAIN? Your account will be created automatically upon first login.
          </p>
        </div>
      </div>
    </div>
  );
}