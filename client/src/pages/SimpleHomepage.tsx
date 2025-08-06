import React from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Vault, TrendingUp, Users, CheckCircle, Coins, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SimpleHomepage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "Secure Truth Capsules",
      description: "Create and store capsules on blockchain",
      action: "Create Capsule",
      href: "/create"
    },
    {
      icon: Coins,
      title: "GTT Token Rewards",
      description: "Earn tokens through engagement",
      action: "View Dashboard",
      href: "/dashboard"
    },
    {
      icon: Users,
      title: "Community Verification",
      description: "Get your capsules verified",
      action: "Explore",
      href: "/explorer"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Welcome to GuardianChain</title>
        <meta name="description" content="Secure Truth. Your Capsule Platform." />
      </Helmet>

      <div className="min-h-screen bg-slate-900 text-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-neon via-electric to-pinkpunk bg-clip-text text-transparent mb-4">
              Welcome to GuardianChain
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Secure Truth. Your Capsule Platform.
            </p>
            
            {isAuthenticated ? (
              <div className="flex justify-center space-x-4">
                <Link href="/create">
                  <Button className="bg-gradient-to-r from-neon to-electric text-black font-bold px-8 py-3 text-lg hover:scale-105 transition-transform">
                    Create Capsule
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-neon text-neon hover:bg-neon hover:text-black px-8 py-3 text-lg">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-neon to-electric text-black font-bold px-8 py-3 text-lg hover:scale-105 transition-transform">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="border-neon text-neon hover:bg-neon hover:text-black px-8 py-3 text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-black/40 backdrop-blur border-neon/20 hover:border-neon/50 transition-all duration-300 group h-full">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-neon/10 w-fit group-hover:bg-neon/20 transition-colors">
                        <Icon className="h-8 w-8 text-neon" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-neon transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-300 mb-6">
                        {feature.description}
                      </p>
                      <Link href={feature.href}>
                        <Button 
                          variant="outline" 
                          className="border-neon/30 text-neon hover:bg-neon hover:text-black transition-colors w-full"
                        >
                          {feature.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-neon">45K+</div>
                <div className="text-gray-300">Capsules Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-electric">12K+</div>
                <div className="text-gray-300">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pinkpunk">$2.4M</div>
                <div className="text-gray-300">Total Value</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neon">99.7%</div>
                <div className="text-gray-300">Verification Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}