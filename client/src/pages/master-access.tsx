import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function MasterAccess() {
  const [location, setLocation] = useLocation();

  const handleLoginSuccess = (role: string, credentials: any) => {
    // Store session data
    localStorage.setItem(
      "masterSession",
      JSON.stringify({
        role,
        email: credentials.email,
        timestamp: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }),
    );

    // Redirect based on role
    switch (role) {
      case "commander":
        setLocation("/dashboard");
        break;
      case "founder":
        setLocation("/profile-customization");
        break;
      case "architect":
        setLocation("/config");
        break;
      default:
        setLocation("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-8 rounded-lg border bg-card">
        <h2 className="text-2xl font-bold mb-4">Master Access</h2>
        <p className="mb-4">Access restricted to authenticated users.</p>
        <Button onClick={() => setLocation("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
