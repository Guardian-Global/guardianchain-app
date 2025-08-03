import React from "react";
import { Link } from "wouter";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-center text-sm text-slate-500 p-6 border-t border-slate-700/50 bg-slate-900/50">
      <p className="space-x-2">
        <span>© {new Date().getFullYear()} GuardianChain Protocol</span>
        <span>•</span>
        <Link href="/terms">
          <span className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer underline">
            Terms of Service
          </span>
        </Link>
        <span>•</span>
        <Link href="/start">
          <span className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer underline">
            Learn More
          </span>
        </Link>
        <span>•</span>
        <a
          href="https://guardian-global.github.io/guardianchain_app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-blue-400 hover:text-blue-200 transition-colors underline"
          style={{ display: 'inline-flex' }}
        >
          <Github className="w-4 h-4" />
          <span>📊 Partner Portal</span>
        </a>
      </p>
    </footer>
  );
}