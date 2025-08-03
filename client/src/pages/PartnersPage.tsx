import { Helmet } from "react-helmet-async";

export default function PartnersPage() {
  return (
    <>
      <Helmet>
        <title>Partners & Grants | GuardianChain</title>
        <meta name="description" content="Information for investors, partners, and grant organizations." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-16 text-gray-100">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">Partners & Grants</h1>

        <p className="text-lg mb-6">
          GuardianChain is committed to transparency, sovereign innovation, and long-term sustainability. Below you'll find our official partner explainer deck, revenue model, and contact for collaboration.
        </p>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
          <h2 className="text-xl font-semibold text-purple-300 mb-2">📘 Revenue & Compliance Explainer Deck</h2>
          <p className="mb-4 text-sm text-gray-300">View our full 6-page PDF describing GTT tokenomics, DAO structure, and compliant yield logic.</p>
          <div className="flex gap-4">
            <a
              href="/GuardianChain_Revenue_Explainer_Deck.pdf"
              className="text-blue-400 underline hover:text-blue-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF Deck
            </a>
            <a
              href="/GuardianChain_Revenue_Share_Summary.pdf"
              className="text-green-400 underline hover:text-green-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Quick Summary
            </a>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold text-purple-300 mb-2">💎 GTT Token Overview</h2>
          <p className="mb-4 text-sm text-gray-300">Key tokenomics metrics for investors and partners.</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400 mb-1">$GTT</div>
              <div className="text-xs text-gray-400">Governance Token</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">DAO</div>
              <div className="text-xs text-gray-400">Community Gov</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">DeFi</div>
              <div className="text-xs text-gray-400">Yield Generation</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-purple-300 mb-4">🤝 Contact Us</h2>
          <div className="space-y-2">
            <p>Email: <a className="underline text-blue-400 hover:text-blue-300 transition-colors" href="mailto:compliance@guardianchain.app">compliance@guardianchain.app</a></p>
            <p>Site: <a className="underline text-blue-400 hover:text-blue-300 transition-colors" href="https://guardianchain.app" target="_blank" rel="noopener noreferrer">guardianchain.app</a></p>
          </div>
          
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-medium text-white mb-2">Partnership Areas</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div>• Strategic Investment</div>
              <div>• Technology Integration</div>
              <div>• Grant Funding</div>
              <div>• Validator Networks</div>
              <div>• Enterprise Adoption</div>
              <div>• Academic Research</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}