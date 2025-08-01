// Test script for Replit Auth configuration
import * as client from "openid-client";

async function testAuthConfig() {
  try {
    console.log("🔧 Testing Replit Auth Configuration");
    console.log("ISSUER_URL:", process.env.ISSUER_URL);
    console.log("REPL_ID:", process.env.REPL_ID ? "✓ Set" : "❌ Missing");
    console.log("SESSION_SECRET:", process.env.SESSION_SECRET ? "✓ Set" : "❌ Missing");
    console.log("REPLIT_DOMAINS:", process.env.REPLIT_DOMAINS ? "✓ Set" : "❌ Missing");

    // Test OIDC discovery
    const config = await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
    
    console.log("✅ OIDC Discovery successful");
    console.log("Auth endpoint:", config.authorization_endpoint);
    console.log("Token endpoint:", config.token_endpoint);
    
  } catch (error) {
    console.error("❌ Auth config test failed:", error);
  }
}

testAuthConfig();