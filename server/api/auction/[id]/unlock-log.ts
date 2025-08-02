import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { wallet, timestamp, userId } = req.body;

  if (!id || !wallet || !timestamp) {
    return res.status(400).json({ 
      error: 'Missing required fields: auction_id, wallet, timestamp' 
    });
  }

  try {
    console.log('🔓 Logging auction unlock:', { auction_id: id, wallet, userId });

    // Check if unlock already exists for this user/auction combo
    const { data: existingUnlock } = await supabase
      .from('auction_unlocks')
      .select('id')
      .eq('auction_id', id)
      .eq('wallet_address', wallet)
      .single();

    if (existingUnlock) {
      return res.status(409).json({ 
        error: 'Unlock already logged for this auction and wallet' 
      });
    }

    // Insert new unlock event
    const { data, error } = await supabase
      .from('auction_unlocks')
      .insert({
        auction_id: id,
        wallet_address: wallet,
        user_id: userId || null,
        unlocked_at: new Date(timestamp),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to log unlock event:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Unlock event logged successfully:', data.id);
    return res.status(200).json({ 
      success: true, 
      unlock_id: data.id,
      message: 'Unlock event logged successfully'
    });

  } catch (error) {
    console.error('❌ Unlock logging error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}