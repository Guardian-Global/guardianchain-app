import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Crown, Zap, User } from "lucide-react";
import { LogoDisplay } from "./assets/LogoDisplay";

interface MasterLoginProps {
  onLoginSuccess: (role: string, credentials: any) => void;
}

export const MasterLogin: React.FC<MasterLoginProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    masterKey: "",
  });
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "commander",
      title: "Commander",
      description: "Full protocol control and system operations",
      icon: Crown,
      color: "from-purple-600 to-purple-800",
      permissions: [
        "GTT Minting",
        "Capsule Sealing",
        "Treasury Management",
        "System Administration",
      ],
    },
    {
      id: "founder",
      title: "Founder",
      description: "Strategic oversight and governance control",
      icon: Shield,
      color: "from-green-600 to-green-800",
      permissions: [
        "Financial Overview",
        "Strategic Planning",
        "Team Management",
        "Compliance Monitoring",
      ],
    },
    {
      id: "architect",
      title: "Architect",
      description: "Technical infrastructure and development lead",
      icon: Zap,
      color: "from-blue-600 to-blue-800",
      permissions: [
        "System Architecture",
        "Smart Contracts",
        "API Management",
        "Security Protocols",
      ],
    },
  ];

  const handleLogin = async () => {
    setLoading(true);

    // Simulate authentication - replace with real auth
    setTimeout(() => {
      onLoginSuccess(selectedRole, credentials);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-slate-800/80 border-slate-700 backdrop-blur-lg">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <LogoDisplay
              size="xl"
              variant="main"
              className="h-16"
              fallback={
                <div className="h-16 w-auto bg-gradient-to-r from-purple-600 to-green-500 rounded-lg flex items-center justify-center px-6">
                  <span className="text-white font-bold text-2xl">
                    GUARDIANCHAIN
                  </span>
                </div>
              }
            />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Master Access Portal
          </CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            Select your access level and authenticate to enter the GUARDIANCHAIN
            protocol
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Role Selection */}
          <div>
            <Label className="text-white text-lg font-semibold mb-4 block">
              Access Level
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Card
                    key={role.id}
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      selectedRole === role.id
                        ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                        : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-2">
                        {role.title}
                      </h3>
                      <p className="text-slate-300 text-sm mb-4">
                        {role.description}
                      </p>
                      <div className="space-y-1">
                        {role.permissions.slice(0, 2).map((perm, i) => (
                          <div key={i} className="text-xs text-green-400">
                            ✓ {perm}
                          </div>
                        ))}
                        {role.permissions.length > 2 && (
                          <div className="text-xs text-slate-400">
                            +{role.permissions.length - 2} more
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Authentication Form */}
          {selectedRole && (
            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
              <h3 className="text-white text-xl font-semibold mb-6">
                {roles.find((r) => r.id === selectedRole)?.title} Authentication
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white mb-2 block">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="founder@guardianchain.org"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block">
                    Master Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-white mb-2 block">
                    Master Access Key
                  </Label>
                  <Input
                    type="password"
                    placeholder="Protocol Master Key"
                    value={credentials.masterKey}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        masterKey: e.target.value,
                      }))
                    }
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    This is your protocol-level access key for {selectedRole}{" "}
                    privileges
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Button */}
          {selectedRole && (
            <div className="flex justify-center">
              <Button
                onClick={handleLogin}
                disabled={
                  !credentials.email ||
                  !credentials.password ||
                  !credentials.masterKey ||
                  loading
                }
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>
                      Access Protocol as{" "}
                      {roles.find((r) => r.id === selectedRole)?.title}
                    </span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
