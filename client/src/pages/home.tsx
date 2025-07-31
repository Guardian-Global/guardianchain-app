// Redirect authenticated users to their dashboard based on tier
// This home component now redirects to /vault for public landing
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Always redirect to vault for public users
    window.location.href = '/vault';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}
