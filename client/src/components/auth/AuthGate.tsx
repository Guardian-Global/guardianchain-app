import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Zap } from 'lucide-react';
import { checkAccess, getUserTierFromMetadata, getUpgradeMessage, type UserTier } from '@/utils/roleCheck';

interface AuthGateProps {
  children: ReactNode;
  requiredRoute: string;
  user?: any;
  fallbackComponent?: ReactNode;
}

export default function AuthGate({ 
  children, 
  requiredRoute, 
  user, 
  fallbackComponent 
}: AuthGateProps) {
  const userTier: UserTier = getUserTierFromMetadata(user);
  const hasAccess = checkAccess(requiredRoute, userTier);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-300">
            {getUpgradeMessage(userTier, 'veritas')}
          </p>
          
          <div className="grid gap-3">
            {userTier === 'guest' && (
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.location.href = '/upgrade'}
              >
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
            
            {userTier === 'pro' && (
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => window.location.href = '/admin-upgrade'}
              >
                <Crown className="w-4 h-4 mr-2" />
                Request Admin Access
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full border-slate-600 text-slate-300"
              onClick={() => window.location.href = '/vault'}
            >
              Return to Vault
            </Button>
          </div>
          
          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              Current Tier: <span className="font-semibold text-slate-300 capitalize">{userTier}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}