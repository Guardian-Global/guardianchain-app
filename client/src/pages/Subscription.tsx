import React from "react";

export default function Subscription() {
  // Placeholder: Replace with real subscription status from user context
  const isPremium = false;

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white/90 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Premium Subscription</h1>
      {isPremium ? (
        <div className="p-4 bg-green-100 rounded mb-4 text-green-800 font-semibold">
          You are a <span className="font-bold">Premium Member</span>! Enjoy all features.
        </div>
      ) : (
        <div className="p-4 bg-yellow-100 rounded mb-4 text-yellow-800 font-semibold">
          Upgrade to <span className="font-bold">Premium</span> to unlock advanced analytics, private capsules, and more!
        </div>
      )}
      <div className="space-y-6">
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Benefits</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Advanced analytics and reporting</li>
            <li>Private and encrypted capsules</li>
            <li>Early access to new features</li>
            <li>Priority support</li>
            <li>Exclusive NFT drops</li>
          </ul>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition" disabled={isPremium}>
            {isPremium ? "Premium Active" : "Upgrade to Premium"}
          </button>
          {isPremium && (
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
              Manage Subscription
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
