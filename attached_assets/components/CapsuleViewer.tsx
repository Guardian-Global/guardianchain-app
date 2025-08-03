import Image from "next/image";

export default function CapsuleViewer({ capsule }) {
  return (
    <div className="p-6 border rounded shadow max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold">📦 {capsule.name}</h2>
      <Image
        src={`https://ipfs.io/ipfs/${capsule.image.split("ipfs://")[1]}`}
        alt="Capsule"
        width={500}
        height={300}
        className="rounded"
      />
      <p>{capsule.description}</p>
      <div className="text-sm text-gray-700">
        <p><strong>GriefScore:</strong> {capsule.grief_score}</p>
        <p><strong>Creator:</strong> {capsule.creator}</p>
        <p><strong>Chain:</strong> {capsule.chain}</p>
      </div>
      <a
        href={`https://ipfs.io/ipfs/${capsule.veritas_certificate.split("ipfs://")[1]}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded"
      >
        View Veritas Certificate 📜
      </a>
    </div>
  );
}
