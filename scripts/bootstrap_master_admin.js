#!/usr/bin/env node

/**
 * GUARDIANCHAIN Master Admin Bootstrap Script
 * 
 * Creates the initial Master Admin account with enterprise-grade security.
 * This script should only be run once during initial setup.
 */

import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "../server/db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";

// Configuration
const SALT_ROUNDS = 12;
const DEFAULT_MASTER_EMAIL = process.env.MASTER_ADMIN_EMAIL || "admin@guardianchain.app";
const DEFAULT_MASTER_PASSWORD = process.env.MASTER_ADMIN_INIT_PASSWORD || generateSecurePassword();

function generateSecurePassword() {
  // Generate a 16-character secure password
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < 16; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

async function bootstrapMasterAdmin() {
  console.log('🔐 GUARDIANCHAIN Master Admin Bootstrap');
  console.log('=====================================');
  
  try {
    // Check if Master Admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, DEFAULT_MASTER_EMAIL))
      .limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Master Admin already exists!');
      console.log(`   Email: ${DEFAULT_MASTER_EMAIL}`);
      console.log('   Use different email or reset existing account.');
      return;
    }
    
    // Generate password pepper if not set
    const pepper = process.env.PASSWORD_PEPPER || crypto.randomBytes(32).toString('hex');
    
    if (!process.env.PASSWORD_PEPPER) {
      console.log('🧂 Generated password pepper:');
      console.log(`   Add to .env.local: PASSWORD_PEPPER=${pepper}`);
    }
    
    // Hash password with salt + pepper
    const saltedPassword = DEFAULT_MASTER_PASSWORD + pepper;
    const hashedPassword = await bcrypt.hash(saltedPassword, SALT_ROUNDS);
    
    // Create Master Admin user
    const masterAdmin = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email: DEFAULT_MASTER_EMAIL,
        firstName: "Master",
        lastName: "Admin",
        profileImageUrl: "https://avatar.vercel.sh/master-admin",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    console.log('✅ Master Admin account created successfully!');
    console.log('');
    console.log('📧 Login Credentials:');
    console.log(`   Email: ${DEFAULT_MASTER_EMAIL}`);
    console.log(`   Password: ${DEFAULT_MASTER_PASSWORD}`);
    console.log('');
    console.log('🔐 Security Information:');
    console.log(`   User ID: ${masterAdmin[0].id}`);
    console.log(`   Password Hash: ${hashedPassword.substring(0, 20)}...`);
    console.log(`   Salt Rounds: ${SALT_ROUNDS}`);
    console.log('');
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   1. Save these credentials in a secure password manager');
    console.log('   2. Change the default password after first login');
    console.log('   3. Enable 2FA for additional security');
    console.log('   4. Store the password pepper securely');
    console.log('   5. Restrict access to this bootstrap script');
    console.log('');
    console.log('🌐 Access URL:');
    console.log('   https://your-domain.com/admin/login');
    console.log('');
    console.log('✨ Setup Complete! Master Admin is ready for use.');
    
  } catch (error) {
    console.error('💥 Bootstrap failed:', error);
    throw error;
  }
}

// Execute bootstrap if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrapMasterAdmin()
    .then(() => {
      console.log('\n🏆 Master Admin bootstrap completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Master Admin bootstrap failed:', error);
      process.exit(1);
    });
}

export { bootstrapMasterAdmin, generateSecurePassword };