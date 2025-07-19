import { BrandedText } from "@/components/BrandEnforcement";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Key, Server } from "lucide-react";

export default function SecurityPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <BrandedText size="3xl" />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
          <h1 className="text-3xl font-bold mb-6 text-white flex items-center">
            <Shield className="mr-3 h-8 w-8 text-green-400" />
            Security Policy
          </h1>
          <p className="text-slate-300 mb-6">
            Last Updated: January 19, 2025
          </p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
                <Lock className="mr-2 h-6 w-6" />
                1. Enterprise-Grade Security
              </h2>
              <p className="mb-4">
                GUARDIANCHAIN implements institutional-level security measures to protect your digital sovereignty:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>End-to-end encryption for all data transmission</li>
                <li>ProtonMail encrypted email communication system</li>
                <li>Multi-signature wallet architecture</li>
                <li>Immutable blockchain storage with IPFS redundancy</li>
                <li>Regular third-party security audits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
                <Key className="mr-2 h-6 w-6" />
                2. Wallet Security
              </h2>
              <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-4 mb-4">
                <p className="text-amber-200 font-semibold">
                  ⚠️ Important: You are responsible for securing your private keys
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Never share your private keys or seed phrases</li>
                <li>Use hardware wallets for large GTT holdings</li>
                <li>Enable two-factor authentication where available</li>
                <li>Verify all transaction details before signing</li>
                <li>Keep your wallet software updated</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
                <Server className="mr-2 h-6 w-6" />
                3. Infrastructure Security
              </h2>
              <p className="mb-4">
                Our platform infrastructure is designed for maximum security and uptime:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Distributed architecture across multiple regions</li>
                <li>DDoS protection and rate limiting</li>
                <li>Automated security monitoring and alerts</li>
                <li>Regular backups and disaster recovery procedures</li>
                <li>SOC 2 Type II compliance preparation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">4. Smart Contract Security</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Multiple independent security audits</li>
                <li>Open-source code for community verification</li>
                <li>Time-locked upgrades with community governance</li>
                <li>Emergency pause mechanisms for critical issues</li>
                <li>Bug bounty program for responsible disclosure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">5. Data Protection</h2>
              <p className="mb-4">
                Your truth capsules and personal data are protected by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IPFS distributed storage for content permanence</li>
                <li>Blockchain immutability for verification records</li>
                <li>Encrypted metadata storage</li>
                <li>Zero-knowledge proof systems where applicable</li>
                <li>GDPR and CCPA compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">6. Incident Response</h2>
              <p className="mb-4">
                In case of security incidents:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>24/7 monitoring for security threats</li>
                <li>Immediate notification via encrypted channels</li>
                <li>Transparent incident reporting</li>
                <li>Coordinated response with security experts</li>
                <li>Post-incident analysis and improvements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">7. Reporting Security Issues</h2>
              <p className="mb-4">
                Help us maintain platform security by reporting issues:
              </p>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="font-semibold mb-2">Security Contact:</p>
                <p>Email: security@guardianchain.org</p>
                <p>Encrypted: capsule@axiomdag.org (ProtonMail)</p>
                <p>Bug Bounty: Up to $50,000 for critical vulnerabilities</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">8. Best Practices for Users</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use strong, unique passwords for all accounts</li>
                <li>Enable email notifications for all transactions</li>
                <li>Regularly review your capsule activity</li>
                <li>Be cautious of phishing attempts</li>
                <li>Keep your browser and extensions updated</li>
                <li>Never click suspicious links in emails</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <p className="text-green-200 font-semibold">
                🛡️ Digital Sovereignty Secured: Your truth, your control, your protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}