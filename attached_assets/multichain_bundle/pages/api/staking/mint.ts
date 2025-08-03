export default function handler(req, res) {
  const { wallet, staked } = req.body;
  console.log("Minted staking NFT to", wallet, "for", staked, "GTT");
  res.status(200).json({ message: `Staking capsule minted for ${staked} GTT to ${wallet}` });
}
