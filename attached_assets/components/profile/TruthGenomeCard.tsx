export function TruthGenomeCard({ traits }: { traits: string[] }) {
  return (
    <div className="rounded-xl border p-4 shadow bg-white text-sm">
      <h3 className="font-semibold mb-1">🧬 Your Truth Genome</h3>
      <ul className="list-disc list-inside text-gray-700">
        {traits.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
