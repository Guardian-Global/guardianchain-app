import React from "react";

const badges = [
  { name: "Genesis Member", description: "Joined GuardianChain in the first 1000 users.", icon: "🌟" },
  { name: "Capsule Creator", description: "Minted your first memory capsule.", icon: "📝" },
  { name: "Staking Pioneer", description: "Staked GTT tokens for the first time.", icon: "💎" },
  { name: "Referral Champion", description: "Referred 5+ users.", icon: "🤝" }
];

const leaderboard = [
  { rank: 1, name: "Alice", points: 1200 },
  { rank: 2, name: "Bob", points: 950 },
  { rank: 3, name: "Charlie", points: 800 }
];

export default function GamificationDashboard() {
  return (
    <div className="max-w-3xl mx-auto p-8 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Gamification & Rewards</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, idx) => (
            <div key={idx} className="bg-white/90 rounded-xl shadow-lg p-4 flex flex-col items-center">
              <span className="text-4xl mb-2">{badge.icon}</span>
              <div className="font-bold text-indigo-700 mb-1">{badge.name}</div>
              <div className="text-gray-600 text-sm text-center">{badge.description}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <table className="w-full text-left bg-white/90 rounded-xl shadow-lg">
          <thead>
            <tr>
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(user => (
              <tr key={user.rank}>
                <td className="py-2 px-4 font-bold">{user.rank}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          View All Badges
        </button>
        <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
          How to Earn Points
        </button>
      </div>
    </div>
  );
}
