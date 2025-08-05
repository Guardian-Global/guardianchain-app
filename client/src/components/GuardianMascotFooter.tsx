import { Shield, Heart, Globe, Twitter, Github, Linkedin, Mail, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuardianMascotFooter() {
  return (
    <footer className="bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#21262d] border-t border-[#30363d] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Enhanced Guardian Mascot Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Enhanced SVG Guardian */}
            <div className="relative flex justify-center">
              <svg
                width="120"
                height="120"
                viewBox="0 0 100 100"
                className="drop-shadow-[0_0_30px_rgba(0,255,225,0.6)]"
              >
                {/* Outer Energy Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="url(#footerGlowGradient)"
                  strokeWidth="1"
                  opacity="0.4"
                  className="animate-spin-slow"
                />
                
                {/* Main Guardian Shield */}
                <path
                  d="M50 5 L20 20 L20 50 Q20 80 50 95 Q80 80 80 50 L80 20 Z"
                  fill="url(#footerMainGradient)"
                  stroke="url(#footerBorderGradient)"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                
                {/* Circuit Patterns */}
                <g opacity="0.8">
                  <path d="M30 25 L50 30 L70 25" stroke="#00ffe1" strokeWidth="2" fill="none" />
                  <path d="M25 45 L50 50 L75 45" stroke="#ff00d4" strokeWidth="2" fill="none" />
                  <path d="M30 65 L50 70 L70 65" stroke="#7c3aed" strokeWidth="2" fill="none" />
                </g>
                
                {/* Central Core */}
                <circle
                  cx="50"
                  cy="45"
                  r="12"
                  fill="url(#footerCoreGradient)"
                  className="animate-pulse"
                />
                
                {/* Power Streams */}
                <g>
                  {[...Array(8)].map((_, i) => (
                    <circle
                      key={i}
                      cx={30 + (i * 5)}
                      cy={15 + Math.sin(i) * 3}
                      r="0.8"
                      fill="#00ffe1"
                      opacity="0.6"
                      className="animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </g>
                
                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="footerMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d1117" />
                    <stop offset="50%" stopColor="#161b22" />
                    <stop offset="100%" stopColor="#21262d" />
                  </linearGradient>
                  <linearGradient id="footerBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffe1" />
                    <stop offset="50%" stopColor="#ff00d4" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                  <radialGradient id="footerCoreGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00ffe1" />
                    <stop offset="100%" stopColor="#059669" />
                  </radialGradient>
                  <linearGradient id="footerGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffe1" opacity="0.3" />
                    <stop offset="50%" stopColor="#ff00d4" opacity="0.5" />
                    <stop offset="100%" stopColor="#7c3aed" opacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Floating Power Indicators */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <h3 className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text mt-6 font-[Orbitron] tracking-wider">
              GUARDIAN SENTINEL AI
            </h3>
            <div className="text-xs text-[#00ffe1] font-mono tracking-[0.2em] mt-2 opacity-70">
              QUANTUM-ENHANCED • TRUTH VERIFICATION • BLOCKCHAIN SECURED
            </div>
            <p className="text-[#8b949e] max-w-2xl mx-auto mt-4 text-lg leading-relaxed">
              Your advanced digital truth protector, wielding quantum-enhanced verification protocols and neural network intelligence to safeguard memories, validate authenticity, and secure the future of truth across the blockchain multiverse.
            </p>
            
            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">ONLINE</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400 font-medium">SECURING</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-400 font-medium">VALIDATING</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#f0f6fc] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00ffe1]" />
              Platform
            </h4>
            <ul className="space-y-2">
              <li><a href="/capsules" className="text-[#8b949e] hover:text-[#00ffe1] transition-colors">Truth Capsules</a></li>
              <li><a href="/dao" className="text-[#8b949e] hover:text-[#ff00d4] transition-colors">DAO Governance</a></li>
              <li><a href="/validators" className="text-[#8b949e] hover:text-[#7c3aed] transition-colors">Validators</a></li>
              <li><a href="/truth-auctions" className="text-[#8b949e] hover:text-[#10b981] transition-colors">Truth Auctions</a></li>
              <li><a href="/nft-gallery" className="text-[#8b949e] hover:text-[#f79009] transition-colors">NFT Gallery</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#f0f6fc] flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#ff00d4]" />
              Community
            </h4>
            <ul className="space-y-2">
              <li><a href="/social" className="text-[#8b949e] hover:text-[#00ffe1] transition-colors">Social Hub</a></li>
              <li><a href="/leaderboards" className="text-[#8b949e] hover:text-[#ff00d4] transition-colors">Leaderboards</a></li>
              <li><a href="/guardian-map" className="text-[#8b949e] hover:text-[#7c3aed] transition-colors">Guardian Map</a></li>
              <li><a href="/forums" className="text-[#8b949e] hover:text-[#10b981] transition-colors">Forums</a></li>
              <li><a href="/events" className="text-[#8b949e] hover:text-[#f79009] transition-colors">Events</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#f0f6fc] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#7c3aed]" />
              Resources
            </h4>
            <ul className="space-y-2">
              <li><a href="/docs" className="text-[#8b949e] hover:text-[#00ffe1] transition-colors">Documentation</a></li>
              <li><a href="/api" className="text-[#8b949e] hover:text-[#ff00d4] transition-colors">API Reference</a></li>
              <li><a href="/whitepaper" className="text-[#8b949e] hover:text-[#7c3aed] transition-colors">Whitepaper</a></li>
              <li><a href="/security" className="text-[#8b949e] hover:text-[#10b981] transition-colors">Security</a></li>
              <li><a href="/support" className="text-[#8b949e] hover:text-[#f79009] transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#f0f6fc] flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#10b981]" />
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" variant="outline" className="border-[#1da1f2] text-[#1da1f2] hover:bg-[#1da1f2]/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-[#333] text-[#f0f6fc] hover:bg-[#333]/10">
                <Github className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-[#0077b5] text-[#0077b5] hover:bg-[#0077b5]/10">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-[#ea4335] text-[#ea4335] hover:bg-[#ea4335]/10">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-[#8b949e] mt-4">
              Join our community of truth guardians protecting digital heritage.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#30363d] pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#8b949e] text-sm">
            © 2025 GuardianChain. Protecting truth, one capsule at a time.
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-[#8b949e] hover:text-[#00ffe1] text-sm transition-colors">Privacy</a>
            <a href="/terms" className="text-[#8b949e] hover:text-[#ff00d4] text-sm transition-colors">Terms</a>
            <a href="/cookies" className="text-[#8b949e] hover:text-[#7c3aed] text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}