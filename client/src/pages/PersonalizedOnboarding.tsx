import React from "react";

export default function PersonalizedOnboarding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="max-w-lg w-full p-8 bg-white/10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to GuardianChain</h1>
        <p className="mb-6 text-lg">Let's personalize your experience and get you started in minutes.</p>
        <form className="space-y-4">
          <input className="w-full px-4 py-2 rounded bg-white/80 text-gray-900" placeholder="Your Name" />
          <input className="w-full px-4 py-2 rounded bg-white/80 text-gray-900" placeholder="Organization (optional)" />
          <select className="w-full px-4 py-2 rounded bg-white/80 text-gray-900">
            <option>How did you hear about us?</option>
            <option>Referral</option>
            <option>Social Media</option>
            <option>Search Engine</option>
            <option>Other</option>
          </select>
          <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-bold">
            Complete Onboarding
          </button>
        </form>
        <div className="mt-8 text-sm text-gray-300">
          Need help? <a href="/support" className="underline text-indigo-200">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
