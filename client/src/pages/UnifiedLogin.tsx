import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useCompleteAuth } from "@/hooks/useCompleteAuth";
import { Shield, Crown, Zap, User, Lock, Mail } from "lucide-react";
import LogoDisplay from "@/components/assets/LogoDisplay";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
});

const masterLoginSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  password: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  masterKey: z.string().min(1, "Master key is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type MasterLoginForm = z.infer<typeof masterLoginSchema>;

export default function UnifiedLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, register, masterLogin, isLoading } = useCompleteAuth();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "", username: "" },
  });

  const masterForm = useForm<MasterLoginForm>({
    resolver: zodResolver(masterLoginSchema),
    defaultValues: { email: "", password: "", role: "", masterKey: "" },
  });

  const handleLogin = async (data: LoginForm) => {
    const result = await login(data.email, data.password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: result.message || "Welcome back!",
      });
      setLocation(result.redirectTo || "/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: result.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    const result = await register(data);
    
    if (result.success) {
      toast({
        title: "Registration Successful",
        description: result.message || "Welcome to GUARDIANCHAIN!",
      });
      setLocation(result.redirectTo || "/dashboard");
    } else {
      toast({
        title: "Registration Failed",
        description: result.message || "Registration failed",
        variant: "destructive",
      });
    }
  };

  const handleMasterLogin = async (data: MasterLoginForm) => {
    const result = await masterLogin(
      data.email || "",
      data.password || "",
      data.role,
      data.masterKey
    );
    
    if (result.success) {
      toast({
        title: "Master Access Granted",
        description: `Welcome, ${data.role.toUpperCase()}`,
      });
      setLocation(result.redirectTo || "/commander");
    } else {
      toast({
        title: "Master Access Denied",
        description: result.message || "Invalid master credentials",
        variant: "destructive",
      });
    }
  };

  const roles = [
    { id: "commander", title: "Commander", icon: Crown, description: "Full protocol control" },
    { id: "founder", title: "Founder", icon: Shield, description: "Strategic oversight" },
    { id: "architect", title: "Architect", icon: Zap, description: "Technical leadership" },
    { id: "admin", title: "Admin", icon: User, description: "System administration" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <LogoDisplay size="xl" variant="full" className="justify-center" />
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome to GUARDIANCHAIN</h1>
            <p className="text-slate-300">Access your truth verification platform</p>
          </div>
        </div>

        {/* Login Tabs */}
        <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-white">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="login" className="text-white">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-white">Register</TabsTrigger>
                <TabsTrigger value="master" className="text-white">Master</TabsTrigger>
              </TabsList>

              {/* Regular Login */}
              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="your@email.com"
                                className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Registration */}
              <TabsContent value="register" className="space-y-4">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="John"
                                className="bg-slate-900/50 border-slate-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Doe"
                                className="bg-slate-900/50 border-slate-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="your@email.com"
                                className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Username (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="johndoe"
                              className="bg-slate-900/50 border-slate-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Master Login */}
              <TabsContent value="master" className="space-y-4">
                <Form {...masterForm}>
                  <form onSubmit={masterForm.handleSubmit(handleMasterLogin)} className="space-y-4">
                    <FormField
                      control={masterForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id} className="text-white">
                                  <div className="flex items-center space-x-2">
                                    <role.icon className="h-4 w-4" />
                                    <span>{role.title}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={masterForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Email (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="admin@guardianchain.org"
                                className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={masterForm.control}
                      name="masterKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Master Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="GUARDIAN_MASTER_2025"
                                className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Authenticating..." : "Master Access"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="text-center space-y-2">
          <p className="text-slate-400 text-sm">
            Demo credentials: master@guardianchain.org / masterkey123
          </p>
          <p className="text-slate-400 text-sm">
            Master Key: GUARDIAN_MASTER_2025
          </p>
        </div>
      </div>
    </div>
  );
}