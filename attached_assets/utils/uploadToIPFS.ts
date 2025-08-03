import { Web3Storage, File } from 'web3.storage';

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

export async function uploadToIPFS({ metadata, imageBuffer, pdfBuffer }) {
  const files = [
    new File([JSON.stringify(metadata)], "metadata.json", { type: "application/json" }),
    new File([imageBuffer], "thumbnail.jpg", { type: "image/jpeg" }),
    new File([pdfBuffer], "certificate.pdf", { type: "application/pdf" })
  ];

  const cid = await client.put(files);
  return cid;
}
