import { Shield, Heart, Globe, Twitter, Github, Linkedin, Mail, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuardianMascotFooter() {
  return (
    <footer className="bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#21262d] border-t border-[#30363d] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Guardian Mascot Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Animated Guardian Shield */}
            <div className="relative">
              <Shield className="w-24 h-24 text-[#00ffe1] mx-auto animate-pulse drop-shadow-[0_0_20px_rgba(0,255,225,0.5)]" />
              <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#00ffe1]/20 to-[#ff00d4]/20 animate-spin-slow" />
            </div>
            <h3 className="text-2xl font-bold text-[#00ffe1] mt-4 font-[Orbitron]">
              Guardian Sentinel
            </h3>
            <p className="text-[#8b949e] max-w-md mx-auto mt-2">
              Your digital truth protector, safeguarding memories and validating authenticity across the blockchain.
            </p>
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