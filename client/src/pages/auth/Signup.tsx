import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Eye, EyeOff, Mail, User, Lock, Shield } from "lucide-react";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.name || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Signup failed');
      }
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to GUARDIANCHAIN. You can now access all features.",
      });
      window.location.href = '/auth/login';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-hsl(218,54%,9%)/80 backdrop-blur-xl border-hsl(180,100%,90%)/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-hsl(180,100%,90%)">
              Join GuardianChain
            </CardTitle>
            <CardDescription className="text-hsl(180,100%,90%)/70">
              Create your account to access truth vault capsules and earn GTT rewards
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-500/20 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-hsl(180,100%,90%)">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-hsl(180,100%,90%)/50" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-hsl(220,39%,11%) border-hsl(180,100%,90%)/20 text-hsl(180,100%,90%) focus:border-cyan-500"
                    placeholder="your@email.com"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-hsl(180,100%,90%)">
                  Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-hsl(180,100%,90%)/50" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 bg-hsl(220,39%,11%) border-hsl(180,100%,90%)/20 text-hsl(180,100%,90%) focus:border-cyan-500"
                    placeholder="Your Name"
                    data-testid="input-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-hsl(180,100%,90%)">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-hsl(180,100%,90%)/50" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-hsl(220,39%,11%) border-hsl(180,100%,90%)/20 text-hsl(180,100%,90%) focus:border-cyan-500"
                    placeholder="••••••••"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-hsl(180,100%,90%)/50 hover:text-hsl(180,100%,90%)"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-sm text-hsl(180,100%,90%)/60">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-hsl(180,100%,90%)">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-hsl(180,100%,90%)/50" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-hsl(220,39%,11%) border-hsl(180,100%,90%)/20 text-hsl(180,100%,90%) focus:border-cyan-500"
                    placeholder="••••••••"
                    data-testid="input-confirmPassword"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-hsl(180,100%,90%)/50 hover:text-hsl(180,100%,90%)"
                    data-testid="button-toggle-confirmPassword"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-2"
                data-testid="button-signup"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-hsl(180,100%,90%)/70">
                Already have an account?{" "}
                <Link href="/auth/login">
                  <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-semibold">
                    Sign In
                  </span>
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-hsl(180,100%,90%)/50">
                By creating an account, you agree to our{" "}
                <Link href="/terms">
                  <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    Terms of Service
                  </span>
                </Link>{" "}
                and{" "}
                <Link href="/privacy">
                  <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;