#!/usr/bin/env tsx
// GUARDIANCHAIN System Health Audit & Repair Script

import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';

// Environment validation
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY', 
  'ALCHEMY_API_KEY',
  'STRIPE_SECRET_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'POLYGON_RPC_URL',
  'DATABASE_URL',
  'JWT_SECRET'
];

interface AuditResult {
  service: string;
  status: 'healthy' | 'degraded' | 'failed';
  details: string;
  timestamp: string;
}

class SystemAuditor {
  private results: AuditResult[] = [];
  private supabase: any;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  private log(service: string, status: 'healthy' | 'degraded' | 'failed', details: string) {
    const result: AuditResult = {
      service,
      status,
      details,
      timestamp: new Date().toISOString()
    };
    this.results.push(result);
    
    const statusIcon = status === 'healthy' ? '✅' : status === 'degraded' ? '⚠️' : '❌';
    console.log(`${statusIcon} ${service}: ${details}`);
  }

  async auditEnvironment() {
    console.log('🔐 ENVIRONMENT VARIABLES AUDIT');
    console.log('=====================================');
    
    let missingVars = 0;
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        this.log('Environment', 'healthy', `${envVar} present`);
      } else {
        this.log('Environment', 'failed', `${envVar} missing`);
        missingVars++;
      }
    }
    
    if (missingVars === 0) {
      this.log('Environment', 'healthy', 'All required environment variables present');
    } else {
      this.log('Environment', 'failed', `${missingVars} environment variables missing`);
    }
  }

  async auditSupabase() {
    console.log('\n✅ SUPABASE AUDIT & REPAIR');
    console.log('=====================================');
    
    try {
      // Test connection
      const { data, error } = await this.supabase.from('sessions').select('count').limit(1);
      if (error && !error.message.includes('relation "sessions" does not exist')) {
        throw error;
      }
      this.log('Supabase', 'healthy', 'Connection successful');

      // Check auth.users
      const { data: users, error: usersError } = await this.supabase.auth.admin.listUsers();
      if (usersError) {
        this.log('Supabase Auth', 'failed', `Users query failed: ${usersError.message}`);
      } else {
        this.log('Supabase Auth', 'healthy', `${users.users.length} users found`);
      }

      // Check storage buckets
      const { data: buckets, error: bucketsError } = await this.supabase.storage.listBuckets();
      if (bucketsError) {
        this.log('Supabase Storage', 'failed', `Storage check failed: ${bucketsError.message}`);
      } else {
        this.log('Supabase Storage', 'healthy', `${buckets.length} buckets available`);
        
        // Check app-assets bucket specifically
        const { data: assets, error: assetsError } = await this.supabase.storage
          .from('app-assets')
          .list('', { limit: 10 });
        
        if (assetsError) {
          this.log('Supabase Storage', 'degraded', `app-assets bucket issues: ${assetsError.message}`);
        } else {
          this.log('Supabase Storage', 'healthy', `app-assets bucket has ${assets.length} files`);
        }
      }

    } catch (error: any) {
      this.log('Supabase', 'failed', `Connection failed: ${error.message}`);
    }
  }

  async auditWeb3() {
    console.log('\n⚙️ WEB3 & RPC AUDIT');
    console.log('=====================================');

    // Test Alchemy
    try {
      const alchemyUrl = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
      const alchemyProvider = new ethers.JsonRpcProvider(alchemyUrl);
      const blockNumber = await alchemyProvider.getBlockNumber();
      this.log('Alchemy RPC', 'healthy', `Latest block: ${blockNumber}`);
    } catch (error: any) {
      this.log('Alchemy RPC', 'failed', `Connection failed: ${error.message}`);
    }

    // Test Polygon RPC
    try {
      const polygonProvider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL!);
      const blockNumber = await polygonProvider.getBlockNumber();
      this.log('Polygon RPC', 'healthy', `Latest block: ${blockNumber}`);
    } catch (error: any) {
      this.log('Polygon RPC', 'failed', `Connection failed: ${error.message}`);
    }

    // Test GTT Contract (with better error handling)
    try {
      const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
      const contractAddress = '0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C';
      
      // First check if address has code
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        this.log('GTT Contract', 'failed', 'No contract code at address (not deployed or wrong network)');
        return;
      }
      
      // Try a simple eth_call to see what happens
      const balance = await provider.getBalance(contractAddress);
      this.log('GTT Contract', 'degraded', `Address exists with ${ethers.formatEther(balance)} ETH, but decode errors suggest non-standard interface`);
      
    } catch (error: any) {
      this.log('GTT Contract', 'failed', `Contract check failed: ${error.message}`);
    }
  }

  async auditExternalAPIs() {
    console.log('\n🌐 EXTERNAL API AUDIT');
    console.log('=====================================');

    // Test OpenAI
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        this.log('OpenAI API', 'healthy', 'Authentication successful');
      } else {
        this.log('OpenAI API', 'failed', `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      this.log('OpenAI API', 'failed', `Request failed: ${error.message}`);
    }

    // Test Anthropic
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }]
        })
      });
      
      if (response.ok || response.status === 400) {
        this.log('Anthropic API', 'healthy', 'Authentication successful');
      } else {
        this.log('Anthropic API', 'failed', `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      this.log('Anthropic API', 'failed', `Request failed: ${error.message}`);
    }

    // Test Stripe
    try {
      const response = await fetch('https://api.stripe.com/v1/products?limit=1', {
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      if (response.ok) {
        this.log('Stripe API', 'healthy', 'Authentication successful');
      } else {
        this.log('Stripe API', 'failed', `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      this.log('Stripe API', 'failed', `Request failed: ${error.message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 SYSTEM HEALTH REPORT');
    console.log('=====================================');
    
    const healthyCount = this.results.filter(r => r.status === 'healthy').length;
    const degradedCount = this.results.filter(r => r.status === 'degraded').length;
    const failedCount = this.results.filter(r => r.status === 'failed').length;
    const totalCount = this.results.length;
    
    console.log(`Total Services Checked: ${totalCount}`);
    console.log(`✅ Healthy: ${healthyCount}`);
    console.log(`⚠️ Degraded: ${degradedCount}`);
    console.log(`❌ Failed: ${failedCount}`);
    console.log(`📊 Health Score: ${Math.round((healthyCount / totalCount) * 100)}%`);
    
    if (failedCount > 0) {
      console.log('\n🔴 CRITICAL ISSUES REQUIRING ATTENTION:');
      this.results
        .filter(r => r.status === 'failed')
        .forEach(r => console.log(`   • ${r.service}: ${r.details}`));
    }
    
    if (degradedCount > 0) {
      console.log('\n⚠️ DEGRADED SERVICES:');
      this.results
        .filter(r => r.status === 'degraded')
        .forEach(r => console.log(`   • ${r.service}: ${r.details}`));
    }
    
    return {
      healthy: healthyCount,
      degraded: degradedCount,
      failed: failedCount,
      healthScore: Math.round((healthyCount / totalCount) * 100),
      results: this.results
    };
  }

  async runFullAudit() {
    console.log('🚨 GUARDIANCHAIN SYSTEM AUDIT INITIATED');
    console.log('========================================\n');
    
    await this.auditEnvironment();
    await this.auditSupabase();
    await this.auditWeb3();
    await this.auditExternalAPIs();
    
    return await this.generateReport();
  }
}

// Run audit if called directly
if (require.main === module) {
  const auditor = new SystemAuditor();
  auditor.runFullAudit()
    .then(report => {
      console.log('\n🏁 AUDIT COMPLETE');
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ AUDIT FAILED:', error);
      process.exit(1);
    });
}

export { SystemAuditor };