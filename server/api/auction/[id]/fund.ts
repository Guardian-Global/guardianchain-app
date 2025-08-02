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
  const { amount, wallet, transactionHash, blockNumber } = req.body;

  if (!id || !amount || !wallet) {
    return res.status(400).json({ 
      error: 'Missing required fields: auction_id, amount, wallet' 
    });
  }

  try {
    console.log('💰 Logging auction funding:', { auction_id: id, amount, wallet });

    // Check if auction exists
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('id, title')
      .eq('id', id)
      .single();

    if (auctionError || !auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Insert funding record
    const { data, error } = await supabase
      .from('auction_funding')
      .insert({
        auction_id: id,
        amount: parseFloat(amount),
        wallet_address: wallet,
        transaction_hash: transactionHash || null,
        block_number: blockNumber || null,
        funded_at: new Date(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to log funding:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Auction funding logged successfully:', data.id);
    return res.status(200).json({ 
      success: true,
      funding_id: data.id,
      message: 'Funding logged successfully'
    });

  } catch (error) {
    console.error('❌ Funding logging error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}