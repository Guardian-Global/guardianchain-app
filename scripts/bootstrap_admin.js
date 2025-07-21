#!/usr/bin/env node

/**
 * GUARDIANCHAIN Master Admin Bootstrap Script
 * 
 * This script initializes the Master Admin account with enterprise-grade security.
 * Run once during deployment to create the initial admin user.
 * 
 * Usage: node scripts/bootstrap_admin.js
 */

import bcrypt from 'bcryptjs';
import { db } from '../server/db.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function bootstrapMasterAdmin() {
  console.log('🚀 GUARDIANCHAIN Master Admin Bootstrap');
  console.log('=====================================');

  // Validate required environment variables
  const requiredEnvVars = [
    'MASTER_ADMIN_EMAIL',
    'MASTER_ADMIN_INIT_PASSWORD',
    'PASSWORD_PEPPER',
    'JWT_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }

  const masterEmail = process.env.MASTER_ADMIN_EMAIL;
  const masterPassword = process.env.MASTER_ADMIN_INIT_PASSWORD;
  const pepper = process.env.PASSWORD_PEPPER;

  try {
    // Check if master admin already exists
    console.log('🔍 Checking for existing master admin...');
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, masterEmail))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('✅ Master admin already exists:');
      console.log(`   Email: ${existingAdmin[0].email}`);
      console.log(`   ID: ${existingAdmin[0].id}`);
      console.log(`   Roles: ${JSON.stringify(existingAdmin[0].roles)}`);
      console.log(`   Status: ${existingAdmin[0].isActive ? 'Active' : 'Inactive'}`);
      return;
    }

    // Generate secure password hash with pepper + salt
    console.log('🔐 Generating secure password hash...');
    const pepperedPassword = masterPassword + pepper;
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(pepperedPassword, saltRounds);

    // Create master admin user
    console.log('👑 Creating Master Admin account...');
    const masterAdminId = `master-admin-${Date.now()}`;
    
    const newMasterAdmin = await db
      .insert(users)
      .values({
        id: masterAdminId,
        email: masterEmail,
        firstName: 'Master',
        lastName: 'Admin',
        roles: ['MASTER_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
        isActive: true,
        isVerified: true,
        passwordHash,
        reputation: 1000,
        gttBalance: '1000000',
        badges: ['FOUNDER', 'MASTER_ADMIN'],
        achievements: [
          {
            type: 'FOUNDER',
            title: 'GUARDIANCHAIN Founder',
            description: 'Founding member of the GUARDIANCHAIN protocol',
            iconUrl: 'https://guardianchain.app/badges/founder.svg',
            unlockedAt: new Date().toISOString()
          }
        ]
      })
      .returning();

    console.log('✅ Master Admin account created successfully!');
    console.log('==========================================');
    console.log(`   Email: ${masterEmail}`);
    console.log(`   ID: ${masterAdminId}`);
    console.log(`   Roles: MASTER_ADMIN, SUPER_ADMIN, ADMIN, MODERATOR`);
    console.log(`   GTT Balance: 1,000,000 GTT`);
    console.log(`   Status: Active & Verified`);
    console.log('');
    console.log('🔒 SECURITY REMINDER:');
    console.log('   1. Change your password immediately after first login');
    console.log('   2. Enable 2FA if available');
    console.log('   3. Review admin access logs regularly');
    console.log('   4. Rotate MASTER_ADMIN_INIT_PASSWORD secret');
    console.log('');
    console.log('🌐 Access your admin panel at: /admin/login');

  } catch (error) {
    console.error('❌ Failed to create Master Admin:', error);
    process.exit(1);
  }
}

// Run bootstrap if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrapMasterAdmin()
    .then(() => {
      console.log('🎉 Bootstrap complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Bootstrap failed:', error);
      process.exit(1);
    });
}

export { bootstrapMasterAdmin };