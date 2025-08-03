import { create } from "ipfs-http-client";

export async function notarizeCertificate(fileBuffer, metadata) {
  const ipfs = create({ url: "https://ipfs.infura.io:5001" });
  const metadataCID = await ipfs.add(JSON.stringify(metadata));
  const fileCID = await ipfs.add(fileBuffer);
  return {
    metadataCID: metadataCID.cid.toString(),
    fileCID: fileCID.cid.toString()
  };
}
