import { useRouter } from "next/router";

export default function PublicCertPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">📜 Certificate #{id}</h1>
      <iframe
        src={`/certs/${id}.pdf`}
        className="w-full h-[600px] border"
        title="Certificate Preview"
      />
      <a href={`/certs/${id}.pdf`} download className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">
        ⬇️ Download Certificate
      </a>
    </div>
  );
}
