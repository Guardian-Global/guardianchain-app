import { BrandedText } from "@/components/BrandEnforcement";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
          <p className="text-slate-300 mb-6">GuardianChain does not sell or share your memory capsules. All authorship and metadata are sovereign by design.</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Data Protection Principles
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No ad tracking or third-party behavioral collection</li>
                <li>Encrypted storage via IPFS + SealChain</li>
                <li>Veritas Capsule access is opt-in</li>
                <li>User-controlled data sovereignty at all times</li>
                <li>Zero-knowledge verification protocols</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Information Collection
              </h2>
              <p className="mb-4">
                We collect only essential data required for blockchain verification:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Wallet addresses for blockchain interactions</li>
                <li>Capsule content metadata (encrypted on IPFS)</li>
                <li>Verification timestamps and signatures</li>
                <li>Anonymized usage analytics for platform improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Data Usage & Rights
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process truth verification and GTT token transactions</li>
                <li>Maintain blockchain integrity and consensus</li>
                <li>Enable DAO governance and community features</li>
                <li>Provide technical support and platform improvements</li>
                <li>Full user control over data deletion and export</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                3. Data Security
              </h2>
              <p className="mb-4">
                Your data is protected by enterprise-grade security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>End-to-end encryption for all communications</li>
                <li>Blockchain immutability for truth capsules</li>
                <li>ProtonMail encrypted email system</li>
                <li>Multi-signature wallet security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                4. Your Rights
              </h2>
              <p className="mb-4">You have complete control over your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and export your data at any time</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of all email notifications</li>
                <li>Transfer truth capsules to other platforms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                5. Contact Us
              </h2>
              <p>
                For privacy-related questions, contact us at:
                <br />
                Email: privacy@guardianchain.org
                <br />
                Encrypted: capsule@axiomdag.org (ProtonMail)
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              This privacy policy is effective as of January 19, 2025. Changes
              will be communicated via encrypted email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
