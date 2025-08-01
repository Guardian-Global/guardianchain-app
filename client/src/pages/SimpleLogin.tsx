import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function SimpleLogin() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [authTest, setAuthTest] = useState<string>("Waiting...");

  useEffect(() => {
    if (isLoading) {
      setAuthTest("Loading authentication...");
    } else if (isAuthenticated) {
      setAuthTest("✓ Authentication successful!");
    } else {
      setAuthTest("❌ Not authenticated");
    }
  }, [isAuthenticated, isLoading]);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Simple Login Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-700 rounded">
              <h3 className="font-semibold mb-2">Auth Status:</h3>
              <p className="text-lg">{authTest}</p>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
                Login with Replit
              </Button>
              <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                Logout
              </Button>
            </div>

            {user && (
              <div className="p-4 bg-green-900/30 border border-green-600 rounded">
                <h3 className="font-semibold mb-2 text-green-400">User Info:</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
                  <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Tier:</strong> {user.tier || 'EXPLORER'}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-700 rounded">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Click "Login with Replit" to start authentication</li>
                <li>You'll be redirected to Replit's login page</li>
                <li>After login, you'll return here with user info</li>
                <li>Then you can access the full dashboard</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}