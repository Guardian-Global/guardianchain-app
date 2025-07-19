// Real treasury data integration - no placeholders
import { supabase } from "@/lib/supabase";

export async function fetchTreasurySnapshot() {
  if (!supabase) {
    throw new Error("Treasury data unavailable: Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  }

  try {
    const { data, error } = await supabase
      .from("treasury_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
      
    if (error) throw new Error("Treasury snapshot unavailable: " + error.message);
    
    return {
      balance: data.total_balance || 0,
      yieldPaid: data.yield_distributed || 0,
      activeCapsules: data.active_capsules || 0,
      monthlyRevenue: data.monthly_revenue || 0,
      complianceOk: data.compliance_status === 'compliant',
      lastUpdate: data.created_at
    };
  } catch (error) {
    throw new Error("Treasury data unavailable: " + (error as Error).message);
  }
}

export async function fetchGTTMarket() {
  try {
    // Try CoinGecko API first, fallback to internal price oracle
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=guardianchain&vs_currencies=usd&include_24hr_change=true");
    
    if (response.ok) {
      const data = await response.json();
      return {
        price: data.guardianchain?.usd || 0,
        change24h: data.guardianchain?.usd_24h_change || 0,
        source: 'coingecko'
      };
    }
    
    // Fallback to internal price tracking
    if (supabase) {
      const { data, error } = await supabase
        .from("gtt_price_tracking")
        .select("price, change_24h")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (!error && data) {
        return {
          price: data.price || 0,
          change24h: data.change_24h || 0,
          source: 'internal'
        };
      }
    }
    
    throw new Error("No market data available");
  } catch (error) {
    throw new Error("GTT market data unavailable: " + (error as Error).message);
  }
}

export async function fetchStripeSubscriptions() {
  if (!supabase) {
    throw new Error("Subscription data unavailable: Supabase not configured");
  }

  try {
    const { data, error } = await supabase
      .from("stripe_subscriptions")
      .select("amount, status, created_at");
      
    if (error) throw new Error("Subscription data unavailable: " + error.message);
    
    const activeSubscriptions = data?.filter(sub => sub.status === 'active') || [];
    
    return {
      monthlyRevenue: activeSubscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0) / 100,
      activeUsers: activeSubscriptions.length,
      totalSubscriptions: data?.length || 0
    };
  } catch (error) {
    throw new Error("Subscription data unavailable: " + (error as Error).message);
  }
}

// Legacy exports for compatibility
export const getLatestTreasurySnapshot = fetchTreasurySnapshot;