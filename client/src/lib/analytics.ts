import { supabase } from "@/lib/supabase";

// Real analytics functions - no mock data
export async function getCapsuleYieldSummary() {
  if (!supabase) {
    throw new Error("Analytics unavailable: Supabase not configured");
  }

  try {
    const { data, error } = await supabase
      .from("capsule_yield_ledger")
      .select("date, sum(gtt_delta) as total_yield")
      .group("date")
      .order("date", { ascending: false });

    if (error) throw new Error("Analytics unavailable: " + error.message);
    return data || [];
  } catch (error) {
    throw new Error("Analytics unavailable: Database connection failed");
  }
}

export async function getCapsuleYieldData(capsuleId: number) {
  if (!supabase) {
    throw new Error("Yield analytics unavailable: Supabase not configured");
  }

  try {
    const { data, error } = await supabase
      .from("capsule_yield_tracking")
      .select("*")
      .eq("capsule_id", capsuleId)
      .order("created_at", { ascending: true });

    if (error) throw new Error("Yield data unavailable: " + error.message);
    return data || [];
  } catch (error) {
    throw new Error("Yield analytics unavailable: Database connection failed");
  }
}

export async function getTreasuryMetrics() {
  if (!supabase) {
    throw new Error("Treasury metrics unavailable: Supabase not configured");
  }

  try {
    const { data, error } = await supabase
      .from("treasury_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error)
      throw new Error("Treasury metrics unavailable: " + error.message);
    return data?.[0] || null;
  } catch (error) {
    throw new Error("Treasury metrics unavailable: Database connection failed");
  }
}
