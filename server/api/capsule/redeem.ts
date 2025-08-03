export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { capsuleId, wallet } = req.body;
  
  if (!capsuleId || !wallet) {
    return res.status(400).json({ 
      success: false, 
      reason: 'Missing capsuleId or wallet address' 
    });
  }

  // Mock redemption logic
  const success = Math.random() > 0.3;
  
  if (success) {
    res.json({
      success: true,
      capsuleId,
      redeemedAt: new Date().toISOString(),
      reward: Math.floor(Math.random() * 1000) + 100,
    });
  } else {
    res.json({
      success: false,
      reason: 'Capsule not eligible for redemption or already claimed',
    });
  }
}