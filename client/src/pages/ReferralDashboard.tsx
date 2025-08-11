import React, { useState } from "react";

const sampleReferrals = [
  { id: 1, email: "alice@example.com", status: "Joined", reward: "5 GTT" },
  { id: 2, email: "bob@example.com", status: "Pending", reward: "-" }
];

export default function ReferralDashboard() {
  const [referralLink] = useState("https://guardianchain.app/signup?ref=yourcode");

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white/90 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Referral & Affiliate Program</h1>
      <div className="mb-6 p-4 bg-indigo-50 rounded">
        <div className="flex items-center gap-4 mb-2">
          <span className="font-semibold">Your Referral Link:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded select-all">{referralLink}</span>
          <button className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs" onClick={() => navigator.clipboard.writeText(referralLink)}>
            Copy
          </button>
        </div>
        <div className="text-gray-700 text-sm">Share this link to invite friends and earn GTT rewards.</div>
      </div>
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Your Referrals</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Email</th>
              <th className="py-2">Status</th>
              <th className="py-2">Reward</th>
            </tr>
          </thead>
          <tbody>
            {sampleReferrals.map(ref => (
              <tr key={ref.id}>
                <td className="py-2">{ref.email}</td>
                <td className="py-2">{ref.status}</td>
                <td className="py-2">{ref.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          View Affiliate Terms
        </button>
        <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
          Contact Support
        </button>
      </div>
    </div>
  );
}
