import { BrandedText } from "@/components/BrandEnforcement";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function DisclosurePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <BrandedText size="3xl" />
        </div>

        <div className="prose prose-invert max-w-none bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Transparency Disclosure
          </h1>
          <p className="text-slate-300 mb-6">All system logic, validator rewards, capsule claims, and tokenomics are disclosed under Veritas Certificate ID: VCW–00000.</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                DAO Transparency
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>DAO votes are publicly logged and signed</li>
                <li>All protocol emissions are on-chain auditable</li>
                <li>Revenue share flows visible in DAO config</li>
                <li>Smart contract source code is open and verified</li>
                <li>Governance decisions are immutably recorded</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Financial Transparency
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>GTT token distribution mechanisms are public</li>
                <li>Validator reward calculations are algorithmic</li>
                <li>Treasury operations are community-controlled</li>
                <li>Platform fees are transparently allocated</li>
                <li>Revenue sharing follows predefined protocols</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Technical Disclosure
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All smart contracts are audited and verified</li>
                <li>Blockchain operations are publicly verifiable</li>
                <li>IPFS storage mechanisms are decentralized</li>
                <li>Verification algorithms are open source</li>
                <li>System architecture is fully documented</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Compliance & Auditing
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Regular third-party security audits</li>
                <li>Compliance with applicable regulations</li>
                <li>Community oversight and governance</li>
                <li>Transparent dispute resolution processes</li>
                <li>Open bug bounty and reporting systems</li>
              </ul>
            </section>

            <p className="mt-8 text-sm text-slate-400">
              Last Updated: {new Date().toLocaleDateString()} | 
              Veritas Certificate: VCW–00000 | 
              All disclosures are cryptographically sealed and immutable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}