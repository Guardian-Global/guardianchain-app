import React from "react";

const partners = [
  { name: "Polygon Labs", logo: "/assets/logo.png", description: "Scaling GuardianChain on Polygon for global reach." },
  { name: "OpenAI", logo: "/assets/logo.png", description: "AI-powered capsule analytics and moderation." },
  { name: "Replit", logo: "/assets/logo.png", description: "Cloud-native deployment and developer tools." }
];

export default function BrandPartnerships() {
  return (
    <div className="max-w-3xl mx-auto p-8 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Brand Partnerships & Sponsorships</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {partners.map((partner, idx) => (
          <div key={idx} className="bg-white/90 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <img src={partner.logo} alt={partner.name} className="w-16 h-16 mb-4" />
            <div className="font-bold text-indigo-700 mb-1">{partner.name}</div>
            <div className="text-gray-600 text-sm text-center">{partner.description}</div>
          </div>
        ))}
      </div>
      <div className="bg-white/90 rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Become a Partner</h2>
        <p className="mb-4 text-gray-700">Interested in co-branded capsules, campaigns, or sponsorships?</p>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Contact Partnerships
        </button>
      </div>
    </div>
  );
}
