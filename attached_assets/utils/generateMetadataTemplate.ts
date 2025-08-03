export function generateMetadata({ title, description, griefScore, creator, chain, veritasCID }) {
  return {
    name: title,
    description,
    grief_score: griefScore,
    creator,
    chain,
    image: `ipfs://${veritasCID}/thumbnail.jpg`,
    veritas_certificate: `ipfs://${veritasCID}/certificate.pdf`,
    attributes: [
      { trait_type: "GriefScore", value: griefScore },
      { trait_type: "Chain", value: chain },
      { trait_type: "Author", value: creator }
    ]
  };
}
