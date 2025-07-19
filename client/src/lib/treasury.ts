// Mock treasury system for development - replace with actual Supabase when ready
const mockSupabaseClient = {
  from: (table: string) => ({
    select: (columns: string) => ({
      order: (column: string, options: any) => ({
        limit: (count: number) => ({
          then: (callback: (result: any) => void) => {
            if (table === 'gtt_treasury') {
              callback({
                data: [{
                  id: 1,
                  timestamp: new Date().toISOString(),
                  gttTotalSupply: 1000000000,
                  gttTreasury: 135000000,
                  gttYieldPool: 75000000,
                  platformRevenueUSD: 117400,
                  gttBurned: 25000,
                  tradingVolume24h: 220000,
                }],
                error: null
              });
            }
          }
        })
      })
    }),
    insert: (data: any) => ({
      then: (callback: (result: any) => void) => {
        callback({ data, error: null });
      }
    })
  })
};

export type TreasurySnapshot = {
  id?: number;
  timestamp: string;
  gttTotalSupply: number;
  gttTreasury: number;
  gttYieldPool: number;
  platformRevenueUSD: number;
  gttBurned: number;
  tradingVolume24h: number;
};

export async function getLatestTreasurySnapshot(): Promise<TreasurySnapshot> {
  try {
    return new Promise((resolve) => {
      mockSupabaseClient
        .from('gtt_treasury')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .then((result: any) => {
          if (result.error || !result.data?.[0]) {
            // Fallback mock data
            resolve({
              timestamp: new Date().toISOString(),
              gttTotalSupply: 1000000000,
              gttTreasury: 135000000,
              gttYieldPool: 75000000,
              platformRevenueUSD: 117400,
              gttBurned: 25000,
              tradingVolume24h: 220000,
            });
          } else {
            resolve(result.data[0]);
          }
        });
    });
  } catch (error) {
    console.error('Treasury snapshot error:', error);
    throw error;
  }
}

export async function saveTreasurySnapshot(snap: TreasurySnapshot) {
  try {
    return new Promise((resolve) => {
      mockSupabaseClient.from('gtt_treasury').insert([snap]).then((result: any) => {
        resolve(result.data);
      });
    });
  } catch (error) {
    console.error('Save treasury snapshot error:', error);
    throw error;
  }
}