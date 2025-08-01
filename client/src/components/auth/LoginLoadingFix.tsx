import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginLoadingFix() {
  const { toast } = useToast();

  useEffect(() => {
    // Check for any redirect loops
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    // If we're in a redirect loop, break it
    if (currentPath.includes('login-success') || searchParams.has('auth')) {
      console.log('Detected auth redirect, clearing and redirecting to home');
      
      // Clear any old auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Replace URL without triggering navigation
      window.history.replaceState({}, '', '/');
      
      toast({
        title: "Authentication Session Reset",
        description: "Please log in again to continue.",
      });
      
      // Force page reload to reset auth state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [toast]);

  return null;
}