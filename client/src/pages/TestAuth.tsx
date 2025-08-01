import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAuth() {
  const [authStatus, setAuthStatus] = useState<string>("Not tested");
  const [userInfo, setUserInfo] = useState<any>(null);

  const testLogin = async () => {
    try {
      setAuthStatus("Testing login...");
      window.location.href = "/api/login";
    } catch (error) {
      setAuthStatus("Login failed: " + error);
    }
  };

  const testUserInfo = async () => {
    try {
      setAuthStatus("Fetching user info...");
      const response = await fetch("/api/auth/user", {
        credentials: "include"
      });
      
      if (response.ok) {
        const user = await response.json();
        setUserInfo(user);
        setAuthStatus("User info retrieved successfully");
      } else {
        setAuthStatus(`User info failed: ${response.status} ${response.statusText}`);
        setUserInfo(null);
      }
    } catch (error) {
      setAuthStatus("User info error: " + error);
      setUserInfo(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testLogin} className="bg-blue-600 hover:bg-blue-700">
                Test Login Flow
              </Button>
              <Button onClick={testUserInfo} className="bg-green-600 hover:bg-green-700">
                Test User Info
              </Button>
            </div>
            
            <div className="p-4 bg-slate-700 rounded">
              <h3 className="font-semibold mb-2">Status:</h3>
              <p>{authStatus}</p>
            </div>

            {userInfo && (
              <div className="p-4 bg-slate-700 rounded">
                <h3 className="font-semibold mb-2">User Info:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(userInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}