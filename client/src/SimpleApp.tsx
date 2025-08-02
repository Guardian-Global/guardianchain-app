import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useEffect, useRef } from "react";

// Create minimal Button component to avoid UI dependency issues
function Button({ children, size, variant, className, ...props }: any) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const sizeClasses = size === "lg" ? "px-6 py-3 text-lg" : "";
  const variantClasses = variant === "outline" 
    ? "border border-white text-white hover:bg-white hover:text-black" 
    : "bg-white text-black hover:bg-gray-100";
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Enhanced homepage component
function HomePage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {
        // Video autoplay failed, which is expected in some browsers
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-indigo-600 py-20 px-6 text-center">
        <video
          ref={heroVideoRef}
          src="https://mpjgcleldijxkvbuxiqg.supabase.co/storage/v1/object/public/media-assets//GUARDIANCHAIN_PROTOCOL_VIDEO_MAIN.mp4"
          className="w-full max-h-[80vh] object-cover rounded-2xl shadow-xl border border-indigo-700"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black/40 rounded-2xl" />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-6">
          <img
            src="/assets/GUARDIANCHAIN_logo.png"
            alt="GuardianChain Logo"
            className="w-40 h-auto mb-4"
          />
          <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-xl tracking-tight">
            GuardianChain
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            The world's first sovereign memory infrastructure. Own your truth. Seal your story. Yield from your lived experiences.
          </p>
          <div className="mt-6 flex gap-4">
            <Button size="lg">Explore Capsules</Button>
            <Button size="lg" variant="outline">Launch App</Button>
          </div>
        </div>
      </section>

      {/* About GTT */}
      <section className="grid md:grid-cols-2 gap-12 p-10">
        <div>
          <video
            src="/assets/video/GTT_logo_video.mp4"
            className="w-full rounded-xl shadow-lg"
            controls
          />
          <h2 className="text-3xl font-bold mt-6">Guardian Truth Token (GTT)</h2>
          <p className="text-slate-300 mt-3">
            GTT is more than a token — it's a reward for verified memory. Users mint capsules, contribute to truth audits, and earn GTT for their participation in the sovereign memory economy.
          </p>
        </div>

        <div>
          <video
            src="/assets/video/GUARDIANCHAIN_logo_video.mp4"
            className="w-full rounded-xl shadow-lg"
            controls
          />
          <h2 className="text-3xl font-bold mt-6">What is GuardianChain?</h2>
          <p className="text-slate-300 mt-3">
            GuardianChain is a memory blockchain that verifies human-authored truth capsules, locks authorship through cryptographic proofs, and monetizes emotional legacy via yield generation.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-800 py-16 px-8">
        <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">🧠 Capture</h3>
            <p className="text-slate-300">Upload moments, media, and messages into secure capsules — with optional griefScore or truth tags.</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">🔐 Seal & Mint</h3>
            <p className="text-slate-300">Mint your capsule on-chain, seal it with a Veritas Certificate, and lock your authorship forever.</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">💸 Unlock & Earn</h3>
            <p className="text-slate-300">Receive GTT yield when others verify, unlock, or vote on your capsule. The truth has value — literally.</p>
          </div>
        </div>
      </section>

      {/* Engagement CTA */}
      <section className="bg-indigo-700 py-20 px-8 text-center text-white">
        <h2 className="text-4xl font-bold">Ready to Take Ownership of Your Truth?</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg">
          Join thousands of users minting, sealing, and sharing their sovereign truth capsules. Your legacy is your power.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg" className="bg-white text-indigo-700 hover:bg-slate-100">Get Started</Button>
          <Button size="lg" variant="outline">View Whitepaper</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-10 text-center text-slate-400">
        <p>© {new Date().getFullYear()} GuardianChain. All rights reserved.</p>
      </footer>
    </main>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}