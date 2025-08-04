import FuturisticButton from "@/components/enhanced/FuturisticButton";
import FuturisticCard from "@/components/enhanced/FuturisticCard";
import { Sparkles, Zap, Rocket, Star } from "lucide-react";

export default function ViralShowcase() {
  return (
    <div className="min-h-screen bg-gradient-cosmic p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-display text-gradient-quantum mb-4">
            2026 Futuristic Color System
          </h1>
          <p className="text-xl text-neon-cyan/80 mb-8">
            Ultra High-Contrast • Viral-Ready • Maximum Picture Quality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Color Palette Showcase */}
          <FuturisticCard title="Neon Palette" variant="neon" glow>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="w-full h-12 bg-neon-cyan rounded neon-glow"></div>
                <div className="w-full h-12 bg-neon-purple rounded purple-glow"></div>
                <div className="w-full h-12 bg-neon-green rounded"></div>
                <div className="w-full h-12 bg-neon-pink rounded"></div>
              </div>
              <p className="text-sm text-white/70">
                Ultra-bright neon colors for maximum viral impact
              </p>
            </div>
          </FuturisticCard>

          {/* Button Showcase */}
          <FuturisticCard title="Interactive Elements" variant="quantum" glow>
            <div className="space-y-4">
              <FuturisticButton variant="primary" icon={Zap} glow>
                Primary Action
              </FuturisticButton>
              <FuturisticButton variant="secondary" icon={Sparkles} glow>
                Secondary
              </FuturisticButton>
              <FuturisticButton variant="success" icon={Star} glow>
                Success
              </FuturisticButton>
              <FuturisticButton variant="danger" icon={Rocket} glow>
                Danger
              </FuturisticButton>
            </div>
          </FuturisticCard>

          {/* Typography Showcase */}
          <FuturisticCard title="Typography System" variant="glass" glow>
            <div className="space-y-3">
              <h2 className="text-gradient-electric font-display text-2xl">
                Electric Gradient
              </h2>
              <h3 className="text-gradient-cyber font-quantum text-xl">
                Cyber Theme
              </h3>
              <p className="text-neon-cyan font-web3">
                Web3 Text Style
              </p>
              <p className="text-white/70 font-code text-sm">
                Monospace Code Font
              </p>
            </div>
          </FuturisticCard>

          {/* Glass Morphism */}
          <FuturisticCard title="Glass Morphism" variant="cosmic" glow>
            <div className="glass-morphism p-4 rounded-lg">
              <h4 className="text-gradient-quantum font-display mb-2">
                Backdrop Blur Effect
              </h4>
              <p className="text-white/80 text-sm">
                Advanced glass morphism with high-contrast borders and glowing effects.
              </p>
            </div>
          </FuturisticCard>

          {/* Gradient Backgrounds */}
          <FuturisticCard title="Background Gradients" variant="neon" glow>
            <div className="space-y-3">
              <div className="w-full h-8 bg-gradient-viral rounded border-glow"></div>
              <div className="w-full h-8 bg-gradient-cosmic rounded border-glow-purple"></div>
              <p className="text-sm text-white/70">
                Multi-color viral gradients for maximum engagement
              </p>
            </div>
          </FuturisticCard>

          {/* Accessibility & Contrast */}
          <FuturisticCard title="High Contrast" variant="quantum" glow>
            <div className="space-y-3">
              <div className="bg-cosmic-void p-3 rounded border border-neon-cyan">
                <p className="text-white font-semibold">
                  Perfect Readability
                </p>
              </div>
              <div className="bg-cosmic-surface p-3 rounded border border-neon-purple">
                <p className="text-neon-cyan">
                  Maximum Contrast
                </p>
              </div>
              <p className="text-sm text-white/70">
                WCAG AAA compliant color combinations
              </p>
            </div>
          </FuturisticCard>
        </div>

        {/* Live Demo Section */}
        <div className="mt-16">
          <FuturisticCard title="Live Interactive Demo" variant="cosmic" glow className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-gradient-quantum font-display text-2xl">
                  2026 Color Features
                </h3>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-cyan rounded-full neon-glow"></span>
                    Ultra high-contrast ratios (7:1+)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-purple rounded-full purple-glow"></span>
                    Viral-optimized color combinations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                    Holographic glow effects
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
                    Glass morphism with backdrop blur
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-viral p-6 rounded-lg text-center">
                  <h4 className="text-black font-display text-xl mb-2">
                    Maximum Impact
                  </h4>
                  <p className="text-black/80">
                    Designed for viral social media content
                  </p>
                </div>
                <FuturisticButton 
                  variant="primary" 
                  size="lg" 
                  icon={Rocket} 
                  glow 
                  className="w-full"
                >
                  Experience the Future
                </FuturisticButton>
              </div>
            </div>
          </FuturisticCard>
        </div>
      </div>
    </div>
  );
}