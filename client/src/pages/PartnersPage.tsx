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

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold text-purple-300 mb-2">📘 Revenue & Compliance Explainer Deck</h2>
          <p className="mb-2 text-sm text-gray-300">View our full 6-page PDF describing GTT tokenomics, DAO structure, and compliant yield logic.</p>
          <a
            href="/GuardianChain_Revenue_Explainer_Deck.pdf"
            className="text-blue-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF Deck
          </a>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-purple-300 mb-2">🤝 Contact Us</h2>
          <p>Email: <a className="underline text-blue-400" href="mailto:compliance@guardianchain.app">compliance@guardianchain.app</a></p>
          <p>Site: <a className="underline text-blue-400" href="https://guardianchain.app">guardianchain.app</a></p>
        </div>
      </div>
    </>
  );
}