import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VideoDisplay from "@/components/assets/VideoDisplay";
import HeroSection from "@/components/HeroSection";
import CoreFeatures from "@/components/CoreFeatures";
import Sidebar from "@/components/layout/Sidebar";
import { ArrowRight } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-cyber-dark to-black text-foreground flex">
      <Sidebar />
      
      <main className="flex-1 p-12 max-w-6xl mx-auto">
        <HeroSection />
        <CoreFeatures />
        
        {/* Visual Brand Showcase */}
        <section className="mt-24 text-center">
          <Card className="bg-secondary/30 border-primary/20 p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <VideoDisplay
                type="guardianchain"
                size="lg"
                className="mx-auto rounded-lg shadow-xl shadow-primary/30"
                autoPlay={true}
                loop={true}
                muted={true}
              />
              <VideoDisplay
                type="gtt"
                size="lg"
                className="mx-auto rounded-lg shadow-xl shadow-accent/30"
                autoPlay={true}
                loop={true}
                muted={true}
              />
            </div>
          </Card>
        </section>

        {/* Enterprise Statistics */}
        <section className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Enterprise Clients", value: "500+" },
            { label: "Truth Capsules", value: "2.5M+" },
            { label: "Verified Claims", value: "$100B+" },
            { label: "Global Reach", value: "150+" },
          ].map((stat, index) => (
            <Card key={index} className="bg-secondary/50 p-6">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </section>

        {/* Interactive Call to Action */}
        <section className="mt-32 text-center space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-lg"
            >
              Start Enterprise Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent/10 px-8 py-4 text-lg"
            >
              View Live Demo
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}