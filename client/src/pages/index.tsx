import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VideoDisplay from "@/components/assets/VideoDisplay";
import LogoDisplay from "@/components/assets/LogoDisplay";
import { Shield, Zap, Users, Lock } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section with Video Logos */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-green-900/20">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-white">The Future of</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                    Truth Verification
                  </span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  GUARDIANCHAIN revolutionizes truth verification through blockchain technology, 
                  immutable proof, and community-driven validation. Secure your digital truth today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  Start Verifying Truth
                </Button>
                <Button variant="outline" size="lg" className="border-green-500 text-green-400 hover:bg-green-500/10 px-8 py-3">
                  Explore GTT Token
                </Button>
              </div>

              {/* Responsive Live Logo Display */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                <LogoDisplay size="lg" variant="full" type="guardianchain" />
                <div className="hidden sm:block h-8 w-px bg-slate-600"></div>
                <div className="block sm:hidden h-px w-8 bg-slate-600"></div>
                <LogoDisplay size="lg" variant="full" type="gtt" />
              </div>
            </div>

            {/* Right Video Showcase */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-6">Watch Our Brand Come to Life</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* GUARDIANCHAIN Video Logo */}
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <VideoDisplay 
                        type="guardianchain" 
                        size="lg" 
                        className="mx-auto mb-4 rounded-lg shadow-2xl shadow-purple-500/20"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />
                      <h4 className="text-lg font-semibold text-white">GUARDIANCHAIN</h4>
                      <p className="text-sm text-slate-400">Truth Verification Protocol</p>
                    </CardContent>
                  </Card>

                  {/* GTT Video Logo */}
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <VideoDisplay 
                        type="gtt" 
                        size="lg" 
                        className="mx-auto mb-4 rounded-lg shadow-2xl shadow-green-500/20"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />
                      <h4 className="text-lg font-semibold text-white">GTT TOKEN</h4>
                      <p className="text-sm text-slate-400">Guardian Truth Token</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose GUARDIANCHAIN?</h2>
            <p className="text-xl text-slate-300">Built for enterprise-grade truth verification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Immutable Proof",
                description: "Blockchain-secured evidence that cannot be altered or deleted"
              },
              {
                icon: Zap,
                title: "Instant Verification",
                description: "Real-time truth validation through community consensus"
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Decentralized validation by verified truth guardians"
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Military-grade encryption and compliance protocols"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-slate-800/70 border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-green-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Ready to Secure Your Digital Truth?
            </h2>
            <p className="text-xl text-slate-300">
              Join thousands of users already protecting their content with GUARDIANCHAIN's 
              revolutionary truth verification system.
            </p>
            
            {/* Responsive Video Logos */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 py-8">
              <VideoDisplay 
                type="guardianchain" 
                size="md" 
                className="rounded-lg shadow-xl shadow-purple-500/30 transition-all duration-300 hover:scale-105"
              />
              <VideoDisplay 
                type="gtt" 
                size="md" 
                className="rounded-lg shadow-xl shadow-green-500/30 transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Launch Your Truth Capsule
              </Button>
              <Button variant="outline" size="lg" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3">
                Learn More About GTT
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}