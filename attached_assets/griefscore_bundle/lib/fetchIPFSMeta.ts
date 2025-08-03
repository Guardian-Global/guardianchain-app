export async function fetchIPFSMeta(cid) {
  try {
    const res = await fetch(\`https://ipfs.io/ipfs/\${cid}\`);
    const json = await res.json();
    return {
      title: json.title || "Untitled Capsule",
      griefScore: json.griefScore || 0,
      author: json.author || "Anonymous",
      description: json.description || "No description provided.",
    };
  } catch (err) {
    console.error("IPFS Fetch Error:", err);
    return null;
  }
}
