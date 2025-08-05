import { useState } from "react";
import axios from "axios";

export function MintCapsuleButton({ file }: { file: File }) {
  const [loading, setLoading] = useState(false);
  const [successLink, setSuccessLink] = useState("");

  const handleMint = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/mint", formData);
    setSuccessLink(res.data.txHash);
    setLoading(false);
  };

  return (
    <div className="mt-2">
      <button onClick={handleMint} disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded">
        {loading ? "Minting..." : "Mint as Capsule NFT"}
      </button>
      {successLink && (
        <p className="text-sm mt-2">
          ✅ Minted! View on{" "}
          <a href={"https://polygonscan.com/tx/" + successLink} target="_blank" className="underline text-blue-600">
            PolygonScan
          </a>
        </p>
      )}
    </div>
  );
}
