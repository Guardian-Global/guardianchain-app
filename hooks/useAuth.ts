// hooks/useAuth.ts
// Authentication hook for user session management

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  walletAddress?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          walletAddress: session.user.user_metadata?.wallet_address,
          firstName: session.user.user_metadata?.firstName,
          lastName: session.user.user_metadata?.lastName,
          profileImageUrl: session.user.user_metadata?.avatar_url,
          app_metadata: session.user.app_metadata,
          user_metadata: session.user.user_metadata
        };
        setUser(authUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const authUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          walletAddress: session.user.user_metadata?.wallet_address,
          firstName: session.user.user_metadata?.firstName,
          lastName: session.user.user_metadata?.lastName,
          profileImageUrl: session.user.user_metadata?.avatar_url,
          app_metadata: session.user.app_metadata,
          user_metadata: session.user.user_metadata
        };
        setUser(authUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    signOut
  };
}