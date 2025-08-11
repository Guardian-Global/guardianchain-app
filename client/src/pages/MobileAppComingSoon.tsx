import React from "react";

export default function MobileAppComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="max-w-lg w-full p-8 bg-white/10 rounded-xl shadow-lg text-center">
        <img src="/assets/logo.png" alt="GuardianChain Logo" className="mx-auto mb-6 w-24 h-24" />
        <h1 className="text-3xl font-bold mb-4">GuardianChain Mobile</h1>
        <p className="mb-6 text-lg">A next-gen mobile app for iOS & Android is coming soon.<br/>
        Get ready for on-the-go truth capsules, wallet, and notifications.</p>
        <div className="flex flex-col gap-4">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Join Waitlist
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
