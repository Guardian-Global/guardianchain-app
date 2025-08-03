import React from "react";
import { Helmet } from "react-helmet-async";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | GuardianChain</title>
        <meta name="description" content="GuardianChain Terms of Service - Understand your rights and responsibilities when using our sovereign truth capsule platform." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
          <h1 className="text-3xl font-bold text-yellow-300">Terms of Service</h1>

          <p className="text-slate-400 leading-relaxed">
            By accessing and using GuardianChain, you agree to be bound by these Terms of Service. GuardianChain is a decentralized platform and protocol for sovereign digital capsule creation, storage, and yield accrual.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-3">1. Capsule Ownership</h2>
              <p className="text-slate-400 leading-relaxed">
                You retain full ownership and responsibility for all content minted into Capsules. GuardianChain does not claim any rights to user data and does not retain user files unless explicitly chosen for public display.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-3">2. Content Permanence</h2>
              <p className="text-slate-400 leading-relaxed">
                Once minted, Capsules may be permanently recorded on-chain or to decentralized storage. It is your responsibility to review content prior to minting. GuardianChain is not liable for immutable content uploaded by users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-3">3. Yield + Rewards</h2>
              <p className="text-slate-400 leading-relaxed">
                GTT yield is based on staking, sharing, and protocol incentives. Yield rates are variable and not guaranteed. Estimates shown in the UI are advisory and non-binding.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-3">4. AI Use + Limitations</h2>
              <p className="text-slate-400 leading-relaxed">
                Sovereign AI scores are ephemeral and do not constitute legal or financial advice. The AI does not retain or surveil capsule content, and all analysis happens client-side or within secure ephemeral compute memory.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-3">5. Termination</h2>
              <p className="text-slate-400 leading-relaxed">
                You may stop using GuardianChain at any time. Due to the nature of blockchain and decentralized storage, previously minted Capsules may remain permanently accessible and immutable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-3">6. Disclaimer of Liability</h2>
              <p className="text-slate-400 leading-relaxed">
                GuardianChain is provided as-is. We make no guarantees regarding availability, uptime, or data retrieval. Use at your own discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-3">7. Updates</h2>
              <p className="text-slate-400 leading-relaxed">
                These terms may be updated as the protocol evolves. You will be notified of major changes via the app.
              </p>
            </section>
          </div>

          <div className="text-slate-500 text-sm pt-8 border-t border-slate-700/50">
            <p>
              © {new Date().getFullYear()} GuardianChain Protocol. All rights reserved.
            </p>
          </div>

          {/* Legal Disclaimer */}
          <DisclaimerBlock />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}