import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.NFT_CONTRACT;
const ABI = [
  "function mintCapsule(address to, string memory uri, uint256 griefScore, string memory origin) public"
];

export default async function handler(req, res) {
  const { address, uri, griefScore, origin } = req.body;

  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  const tx = await contract.mintCapsule(address, uri, griefScore, origin);
  await tx.wait();

  res.status(200).json({ success: true, tx: tx.hash });
}
