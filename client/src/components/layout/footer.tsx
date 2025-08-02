import { Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BrandedText } from "@/components/BrandEnforcement";
import { PROTOCOL_CONFIG } from "@/lib/constants";

const footerSections = [
  {
    title: "Memory Vault System",
    links: [
      { name: "Memory Capsule Creator", href: "/memory-vault", badge: "NEW" },
      { name: "100-Year Staking", href: "/eternal-staking", badge: "YIELD" },
      { name: "Family Legacy Hub", href: "/family-legacy" },
      { name: "Time-Lock Messages", href: "/time-messages" },
      { name: "Infinite Recovery", href: "/infinite-recovery" },
      { name: "Cross-Trading", href: "/cross-trading", badge: "ZERO FEES" },
    ],
  },
  {
    title: "Platform",
    links: [
      { name: "Create Capsule", href: "/create-capsule" },
      { name: "Explore", href: "/explore" },
      { name: "Analytics", href: "/capsule-analytics" },
      { name: "Viral Tools", href: "/viral-tools" },
      { name: "Profile", href: "/profile" },
      { name: "Asset Integration", href: "/asset-integration" },
    ],
  },
  {
    title: "Enterprise",
    links: [
      { name: "Login / Sign Up", href: "/login" },
      { name: "Notifications", href: "/notifications", authRequired: true },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Whitepapers", href: "/whitepapers" },
      { name: "Protocol Strategy", href: "/protocol-strategy" },
      { name: "Blockchain Demo", href: "/blockchain-demo" },
      { name: "AI Recommendations", href: "/recommendations" },
      { name: "Compliance", href: "/compliance" },
      { name: "Documentation", href: "/protocol-strategy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-800/50 border-t border-slate-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white h-5 w-5" />
              </div>
              <BrandedText size="xl" className="gradient-text" />
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              {PROTOCOL_CONFIG.TAGLINE} - The revolutionary Web3 platform for
              immutable truth verification, enterprise digital sovereignty, and
              billion-dollar protocol infrastructure.
            </p>
            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/${PROTOCOL_CONFIG.SOCIAL.TWITTER.replace(
                  "@",
                  "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Button>
              </a>
              <a
                href={`https://${PROTOCOL_CONFIG.SOCIAL.DISCORD.replace(
                  "discord.gg/",
                  "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </Button>
              </a>
              <a
                href="https://github.com/guardianchain"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </a>
              <a
                href={`https://${PROTOCOL_CONFIG.SOCIAL.TELEGRAM}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </Button>
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-slate-400">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 text-slate-400 hover:text-white transition-colors justify-start"
                      >
                        {link.name}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-slate-400 text-sm">
            © 2025 {PROTOCOL_CONFIG.NAME}. All rights reserved. Digital
            Sovereignty Secured.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-slate-400">
            <Link href="/legal/privacy">
              <Button
                variant="ghost"
                className="h-auto p-0 text-slate-400 hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </Button>
            </Link>
            <Link href="/legal/terms">
              <Button
                variant="ghost"
                className="h-auto p-0 text-slate-400 hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </Button>
            </Link>
            <Link href="/legal/security">
              <Button
                variant="ghost"
                className="h-auto p-0 text-slate-400 hover:text-purple-400 transition-colors"
              >
                Security
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                className="h-auto p-0 text-slate-400 hover:text-green-400 transition-colors"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
