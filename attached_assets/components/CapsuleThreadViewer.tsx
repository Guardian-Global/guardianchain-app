export default function CapsuleThreadViewer({ capsules }) {
  return (
    <div className="border rounded p-4 space-y-3">
      <h3 className="text-lg font-semibold">🧵 Capsule Thread</h3>
      {capsules.map((cap, i) => (
        <div key={i} className="border-l-4 border-blue-500 pl-4">
          <p className="text-sm font-semibold">{cap.title}</p>
          <p className="text-xs text-gray-600">{cap.text}</p>
        </div>
      ))}
    </div>
  );
}
