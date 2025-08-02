import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthTest() {
  const [authStatus, setAuthStatus] = useState('Testing...');
  const [user, setUser] = useState<any>(null);

  const testAuth = async () => {
    try {
      setAuthStatus('Checking authentication...');
      const response = await fetch('/api/auth/user');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setAuthStatus('✓ Authenticated successfully!');
      } else {
        setAuthStatus('❌ Not authenticated');
        setUser(null);
      }
    } catch (error) {
      setAuthStatus('❌ Error checking authentication');
      setUser(null);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  useEffect(() => {
    testAuth();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Status:</strong> {authStatus}
        </div>
        
        {user && (
          <div>
            <strong>User:</strong>
            <pre className="text-sm bg-gray-100 p-2 rounded mt-1">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button onClick={handleLogin} variant="default">
            Login
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
          <Button onClick={testAuth} variant="secondary">
            Test Auth
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}