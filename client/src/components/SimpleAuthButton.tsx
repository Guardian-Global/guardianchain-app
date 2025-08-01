import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SimpleAuthButtonProps {
  text?: string;
  className?: string;
}

export function SimpleAuthButton({ text = "Login with Replit", className }: SimpleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Direct redirect to login endpoint
      window.location.href = '/api/login';
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogin}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Redirecting...' : text}
    </Button>
  );
}