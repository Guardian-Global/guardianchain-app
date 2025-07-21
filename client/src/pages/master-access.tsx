import React, { useState } from 'react';
import { MasterLogin } from '@/components/MasterLogin';
import { useLocation } from 'wouter';

export default function MasterAccess() {
  const [location, setLocation] = useLocation();
  
  const handleLoginSuccess = (role: string, credentials: any) => {
    // Store session data
    localStorage.setItem('masterSession', JSON.stringify({
      role,
      email: credentials.email,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    
    // Redirect based on role
    switch (role) {
      case 'commander':
        setLocation('/dashboard');
        break;
      case 'founder':
        setLocation('/profile-customization');
        break;
      case 'architect':
        setLocation('/config');
        break;
      default:
        setLocation('/');
    }
  };

  return <MasterLogin onLoginSuccess={handleLoginSuccess} />;
}