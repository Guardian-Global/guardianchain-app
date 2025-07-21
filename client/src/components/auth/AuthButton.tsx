import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function AuthButton() {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-300">
          Welcome, {user.firstName}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button 
        variant="outline" 
        size="sm"
        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
      >
        Login
      </Button>
    </Link>
  );
}