import { BrandedText } from "@/components/BrandEnforcement";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
          <p className="text-slate-300 mb-6">
            Last Updated: January 19, 2025
          </p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">1. Platform Overview</h2>
              <p className="mb-4">
                GUARDIANCHAIN is a decentralized truth verification protocol that enables users to create immutable truth capsules, verify content through community governance, and earn GTT tokens through the yield system.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">2. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and truthful content in capsules</li>
                <li>Respect intellectual property rights</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Maintain the security of your wallet and private keys</li>
                <li>Use the platform for legitimate truth verification purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">3. GTT Token Economics</h2>
              <p className="mb-4">
                Guardian Truth Tokens (GTT) are utility tokens used within the GUARDIANCHAIN ecosystem:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Earned through verified truth capsule creation</li>
                <li>Used for platform fees and governance voting</li>
                <li>Subject to yield distribution based on verification quality</li>
                <li>May fluctuate in value based on platform adoption</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">4. Truth Verification Process</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Community-driven verification through DAO governance</li>
                <li>AI-assisted content analysis for initial screening</li>
                <li>Immutable storage on blockchain and IPFS</li>
                <li>Reputation-weighted scoring system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">5. Platform Fees</h2>
              <p className="mb-4">
                Standard platform fees apply:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Capsule Creation: 50 GTT</li>
                <li>Premium Sealing: 100 GTT</li>
                <li>Governance Proposals: 500 GTT</li>
                <li>Verification Participation: 25 GTT</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">6. Prohibited Content</h2>
              <p className="mb-4">
                The following content is strictly prohibited:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Illegal, harmful, or fraudulent content</li>
                <li>Harassment, hate speech, or discrimination</li>
                <li>Copyright infringement or plagiarism</li>
                <li>Spam, phishing, or malicious content</li>
                <li>Private information without consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">7. Disclaimers</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Platform provided "as is" without warranties</li>
                <li>Users responsible for their own financial decisions</li>
                <li>Blockchain transactions are irreversible</li>
                <li>GTT token value may fluctuate</li>
                <li>Technical issues may affect platform availability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">8. Contact Information</h2>
              <p>
                For terms-related questions:
                <br />
                Email: legal@guardianchain.org
                <br />
                Support: capsule@axiomdag.org
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              By using GUARDIANCHAIN, you agree to these terms. Updates will be communicated via platform notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}