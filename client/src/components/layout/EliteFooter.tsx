import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Twitter, Github, MessageCircle, Globe } from 'lucide-react';

const footerLinks = {
  product: [
    { href: '/vault', label: 'Truth Vault' },
    { href: '/mint', label: 'Mint Capsules' },
    { href: '/governance', label: 'DAO' },
    { href: '/stats', label: 'Analytics' },
  ],
  developers: [
    { href: '/veritas-node', label: 'Veritas Node' },
    { href: '/api-docs', label: 'API Docs' },
    { href: '/github', label: 'GitHub' },
    { href: '/whitepaper', label: 'Whitepaper' },
  ],
  community: [
    { href: '/discord', label: 'Discord' },
    { href: '/twitter', label: 'Twitter' },
    { href: '/telegram', label: 'Telegram' },
    { href: '/forum', label: 'Forum' },
  ],
  legal: [
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/security', label: 'Security' },
    { href: '/compliance', label: 'Compliance' },
  ],
};

const socialLinks = [
  { href: 'https://twitter.com/guardianchain', icon: Twitter, label: 'Twitter' },
  { href: 'https://github.com/Guardian-Global/guardianchain_app', icon: Github, label: 'GitHub' },
  { href: 'https://discord.gg/guardianchain', icon: MessageCircle, label: 'Discord' },
  { href: 'https://guardianchain.global', icon: Globe, label: 'Website' },
];

export function EliteFooter() {
  return (
    <footer className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center space-x-2 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/guardian-mascot.png" 
                alt="Guardian Mascot" 
                className="h-8 w-8 rounded-full object-cover border border-yellow-400/30"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                GuardianChain
              </span>
            </motion.div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Sovereign memory infrastructure for truth preservation and creator sovereignty. 
              Protect your legacy with blockchain-powered verification.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Developers</h3>
            <ul className="space-y-2">
              {footerLinks.developers.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            © 2025 GuardianChain. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Powered by</span>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400 text-sm font-semibold">Polygon</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-400 text-sm font-semibold">IPFS</span>
              <span className="text-gray-400">•</span>
              <span className="text-green-400 text-sm font-semibold">Lit Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}