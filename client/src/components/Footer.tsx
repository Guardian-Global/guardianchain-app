import React from "react";
import { Link } from "wouter";
import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 px-6 text-sm text-slate-400 text-center border-t border-slate-700 bg-secondary/30">
      <div className="flex flex-col gap-4 items-center max-w-4xl mx-auto">
        {/* Guardian Mascot */}
        <img 
          src="/guardian-mascot.png" 
          alt="Guardian Mascot" 
          className="h-12 w-12 rounded-full object-cover border border-primary/30 shadow-glow"
        />
        
        {/* GitHub Sponsors Badge */}
        <a 
          href="https://github.com/sponsors/Guardian-Global" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:text-highlight transition-colors bg-black/40 px-4 py-2 rounded-xl border border-primary/20 hover:border-primary/40"
        >
          <Heart className="h-4 w-4 text-red-400" />
          <span>Sponsor us on GitHub</span>
        </a>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <Link href="/terms">
            <span className="text-accent hover:text-primary transition-colors cursor-pointer underline">
              Terms of Service
            </span>
          </Link>
          <Link href="/privacy">
            <span className="text-accent hover:text-primary transition-colors cursor-pointer underline">
              Privacy Policy
            </span>
          </Link>
          <Link href="/start">
            <span className="text-primary hover:text-highlight transition-colors cursor-pointer underline">
              Learn More
            </span>
          </Link>
          <a
            href="https://guardian-global.github.io/guardianchain_app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent hover:text-primary transition-colors underline"
          >
            <Github className="w-3 h-3" />
            <span>Partner Portal</span>
          </a>
          <Link href="/dao">
            <span className="text-highlight hover:text-primary transition-colors cursor-pointer underline">
              DAO Governance
            </span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} GuardianChain. Sovereign Memory Infrastructure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}