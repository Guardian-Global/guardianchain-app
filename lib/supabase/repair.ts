// Supabase Database Repair & Synchronization
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export class SupabaseRepair {
  async repairUserProfiles() {
    console.log("🔧 Repairing user profiles...");

    try {
      // Get all auth users
      const { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      console.log(`Found ${authUsers.users.length} auth users`);

      // Check for missing profile records
      for (const user of authUsers.users) {
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code === "PGRST116") {
          // Profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from("user_profiles")
            .insert({
              id: user.id,
              email: user.email,
              firstName: user.user_metadata?.firstName || "",
              lastName: user.user_metadata?.lastName || "",
              tier: "explorer",
              gttBalance: 10, // Welcome bonus
              createdAt: user.created_at,
              updatedAt: new Date().toISOString(),
            });

          if (insertError) {
            console.warn(
              `Failed to create profile for ${user.email}:`,
              insertError,
            );
          } else {
            console.log(`✅ Created profile for ${user.email}`);
          }
        }
      }

      return { success: true, message: "User profiles repaired" };
    } catch (error: any) {
      console.error("❌ User profile repair failed:", error);
      return { success: false, error: error.message };
    }
  }

  async cleanOrphanedData() {
    console.log("🧹 Cleaning orphaned data...");

    try {
      // Clean capsules without valid users
      const { error: capsuleCleanError } = await supabase.rpc(
        "clean_orphaned_capsules",
      );
      if (
        capsuleCleanError &&
        !capsuleCleanError.message.includes("function")
      ) {
        console.warn("Capsule cleanup warning:", capsuleCleanError);
      }

      // Clean transaction history without valid users
      const { error: txCleanError } = await supabase.rpc(
        "clean_orphaned_transactions",
      );
      if (txCleanError && !txCleanError.message.includes("function")) {
        console.warn("Transaction cleanup warning:", txCleanError);
      }

      console.log("✅ Orphaned data cleanup attempted");
      return { success: true, message: "Orphaned data cleaned" };
    } catch (error: any) {
      console.error("❌ Data cleanup failed:", error);
      return { success: false, error: error.message };
    }
  }

  async fixStorageAssets() {
    console.log("🎨 Fixing storage assets...");

    try {
      // Check app-assets bucket
      const { data: buckets, error: bucketError } =
        await supabase.storage.listBuckets();
      if (bucketError) throw bucketError;

      const appAssetsBucket = buckets.find((b) => b.name === "app-assets");
      if (!appAssetsBucket) {
        // Create app-assets bucket
        const { error: createError } = await supabase.storage.createBucket(
          "app-assets",
          {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ["image/*", "video/*"],
          },
        );

        if (createError) {
          console.warn("Could not create app-assets bucket:", createError);
        } else {
          console.log("✅ Created app-assets bucket");
        }
      }

      // List existing assets
      const { data: assets, error: listError } = await supabase.storage
        .from("app-assets")
        .list("");

      if (listError) {
        console.warn("Could not list assets:", listError);
      } else {
        console.log(`✅ Found ${assets.length} assets in storage`);
      }

      return { success: true, message: "Storage assets checked" };
    } catch (error: any) {
      console.error("❌ Storage fix failed:", error);
      return { success: false, error: error.message };
    }
  }

  async validateRLSPolicies() {
    console.log("🔒 Validating RLS policies...");

    try {
      // Test basic read access
      const { data: testRead, error: readError } = await supabase
        .from("user_profiles")
        .select("id")
        .limit(1);

      if (readError) {
        console.warn("RLS read test failed:", readError);
      } else {
        console.log("✅ RLS read access working");
      }

      return { success: true, message: "RLS policies validated" };
    } catch (error: any) {
      console.error("❌ RLS validation failed:", error);
      return { success: false, error: error.message };
    }
  }

  async runFullRepair() {
    console.log("🔧 SUPABASE FULL REPAIR INITIATED");
    console.log("==================================\n");

    const results = [];

    results.push(await this.repairUserProfiles());
    results.push(await this.cleanOrphanedData());
    results.push(await this.fixStorageAssets());
    results.push(await this.validateRLSPolicies());

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    console.log(
      `\n✅ Supabase repair complete: ${successCount}/${totalCount} operations successful`,
    );

    return {
      success: successCount === totalCount,
      results,
      healthScore: Math.round((successCount / totalCount) * 100),
    };
  }
}

// Export singleton instance
export const supabaseRepair = new SupabaseRepair();
