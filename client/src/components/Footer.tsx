import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Mail, 
  FileText, 
  Database, 
  Coins, 
  Users,
  Shield,
  Github,
  Twitter,
  Globe
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { href: "/terms", label: "Terms of Use", icon: FileText },
        { href: "/veritas-ledger", label: "Veritas Ledger", icon: Database },
        { href: "/gtt-token", label: "GTT Token", icon: Coins },
        { href: "/dao", label: "DAO", icon: Users }
      ]
    },
    {
      title: "Resources",
      links: [
        { href: "/docs", label: "Documentation", icon: FileText },
        { href: "/whitepaper", label: "Whitepaper", icon: FileText },
        { href: "/api", label: "API", icon: Globe },
        { href: "/security", label: "Security", icon: Shield }
      ]
    }
  ];

  return (
    <footer className="relative bg-gradient-to-t from-black via-slate-950 to-slate-900 border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 left-1/4 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-4 right-1/4 w-80 h-80 bg-[#003366]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-2">
                GuardianChain
              </h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                The sovereign Web3 infrastructure for time-locked proof, grief-score yield, 
                and capsule monetization. Preserve truth, unlock value.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <a 
                href="mailto:founder@guardianchain.io"
                className="flex items-center text-white/60 hover:text-[#FFD700] transition-colors duration-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                founder@guardianchain.io
              </a>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { href: "https://twitter.com/guardianchain", icon: Twitter },
                { href: "https://github.com/guardianchain", icon: Github },
                { href: "https://guardianchain.io", icon: Globe }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-[#FFD700]/10 text-white/60 hover:text-[#FFD700] transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  const Icon = link.icon;
                  return (
                    <li key={linkIndex}>
                      <Link href={link.href}>
                        <div className="flex items-center text-white/60 hover:text-[#FFD700] transition-colors duration-200 cursor-pointer">
                          <Icon className="w-4 h-4 mr-2" />
                          {link.label}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm mb-4 md:mb-0">
              © {currentYear} GuardianChain. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 text-xs text-white/40">
              <span>Built on Polygon</span>
              <span>•</span>
              <span>Secured by IPFS</span>
              <span>•</span>
              <span>Encrypted with Lit Protocol</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}