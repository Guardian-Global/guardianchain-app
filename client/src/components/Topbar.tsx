import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Zap, 
  Archive, 
  Vault, 
  Handshake,
  Menu
} from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-black/80 backdrop-blur-sm text-white shadow-lg border-b border-gray-800 z-50 sticky top-0">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
        GuardianChain
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6 text-sm">
        <Link href="/start" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
          <Home className="h-4 w-4" />
          Start Here
        </Link>
        <Link href="/create" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
          <Zap className="h-4 w-4" />
          Create
        </Link>
        <Link href="/explorer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
          <Archive className="h-4 w-4" />
          Explorer
        </Link>
        <Link href="/redeem" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
          <Vault className="h-4 w-4" />
          Vault
        </Link>
        <Link href="/partners" className="flex items-center gap-2 hover:text-yellow-400 transition-colors font-semibold bg-purple-900/30 px-3 py-1 rounded-lg border border-purple-500/20">
          <Handshake className="h-4 w-4" />
          Partners
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-yellow-400"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 md:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <Link 
              href="/start" 
              className="flex items-center gap-2 hover:text-yellow-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Start Here
            </Link>
            <Link 
              href="/create" 
              className="flex items-center gap-2 hover:text-yellow-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Zap className="h-4 w-4" />
              Create
            </Link>
            <Link 
              href="/explorer" 
              className="flex items-center gap-2 hover:text-yellow-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Archive className="h-4 w-4" />
              Explorer
            </Link>
            <Link 
              href="/redeem" 
              className="flex items-center gap-2 hover:text-yellow-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Vault className="h-4 w-4" />
              Vault
            </Link>
            <Link 
              href="/partners" 
              className="flex items-center gap-2 hover:text-yellow-400 transition-colors py-2 font-semibold bg-purple-900/30 px-3 rounded-lg border border-purple-500/20"
              onClick={() => setIsMenuOpen(false)}
            >
              <Handshake className="h-4 w-4" />
              Partners
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}