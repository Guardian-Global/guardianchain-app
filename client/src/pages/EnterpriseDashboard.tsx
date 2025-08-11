import React from "react";

const organizations = [
  { id: "org1", name: "Acme Corp" },
  { id: "org2", name: "Truth Labs" }
];

export default function EnterpriseDashboard() {
  // Placeholder: Replace with real org/user context
  const [selectedOrg, setSelectedOrg] = React.useState(organizations[0].id);

  return (
    <div className="max-w-5xl mx-auto p-8 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Enterprise Dashboard</h1>
      <div className="mb-6 flex gap-4 items-center">
        <label className="font-semibold">Organization:</label>
        <select
          className="border rounded px-4 py-2"
          value={selectedOrg}
          onChange={e => setSelectedOrg(e.target.value)}
        >
          {organizations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/90 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Capsule Analytics</h2>
          <ul className="text-gray-700">
            <li>Total Capsules: <span className="font-bold">128</span></li>
            <li>Private Capsules: <span className="font-bold">34</span></li>
            <li>Active Users: <span className="font-bold">17</span></li>
            <li>Last 30d Growth: <span className="font-bold text-green-600">+12%</span></li>
          </ul>
        </div>
        <div className="bg-white/90 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Compliance & Audit</h2>
          <ul className="text-gray-700">
            <li>Verified Capsules: <span className="font-bold text-green-600">97%</span></li>
            <li>Pending Reviews: <span className="font-bold text-yellow-600">3</span></li>
            <li>Flagged Content: <span className="font-bold text-red-600">1</span></li>
          </ul>
        </div>
      </div>
      <div className="bg-white/90 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Organization Management</h2>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition mr-4">Invite User</button>
        <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">Export Report</button>
      </div>
    </div>
  );
}
