import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';

export default function Sidebar() {
  const [sections, setSections] = useState<number[]>([]);

  useEffect(() => {
    // Generate section IDs (simulating API call from your attached file)
    const sectionIds = Array.from({ length: 200 }, (_, i) => i + 1);
    setSections(sectionIds.slice(0, 20)); // Show first 20 sections
  }, []);

  return (
    <aside className="w-72 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-slate-100 p-6 border-r border-slate-800 hidden lg:block">
      <h2 className="text-xl font-bold text-primary mb-4">🧭 Navigation</h2>
      <ul className="space-y-2 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {sections.map(id => (
          <li key={id}>
            <Link href={`/section/${id}`}>
              <div className="block py-2 px-4 rounded-lg hover:bg-primary/20 hover:text-white transition cursor-pointer">
                📘 Section {id}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}