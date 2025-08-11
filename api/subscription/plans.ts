const plans = [
  { id: 'explorer', name: 'Explorer', price: 0, features: ['5 capsules / mo', 'Community access'] },
  { id: 'seeker', name: 'Seeker', price: 19, features: ['50 capsules / mo', 'AI analysis', 'Priority verification'] },
  { id: 'creator', name: 'Creator', price: 49, features: ['Unlimited capsules', 'NFT minting', 'Revenue sharing'] },
];

export default function handler(_req: any, res: any) {
  return res.status(200).json({ plans });
}
