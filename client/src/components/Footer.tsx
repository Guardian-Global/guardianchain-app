import React from "react";
import { Link } from "wouter";

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
      </p>
    </footer>
  );
}