#!/usr/bin/env node

/**
 * GuardianChain First Admin Account Creator
 * Creates the foundational admin user with full access privileges
 */

const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

async function createFirstAdminUser() {
  console.log('🚀 GuardianChain: Creating first admin account...\n');
  
  // Admin user configuration
  const adminConfig = {
    id: `admin_${Date.now()}`,
    email: 'admin@guardianchain.app',
    displayName: 'GuardianChain Administrator',
    bio: 'Founding administrator of the GuardianChain platform. Responsible for platform governance, security, and strategic development.',
    location: 'Global',
    website: 'https://guardianchain.app',
    company: 'GuardianChain Foundation',
    occupation: 'Platform Administrator',
    pronouns: 'they/them',
    timezone: 'UTC',
    profileImage: '',
    coverImage: '',
    profileVideo: '',
    portfolioImages: [],
    portfolioVideos: [],
    profileMusic: '',
    customCSS: '',
    socialLinks: {
      twitter: 'https://twitter.com/guardianchain',
      linkedin: 'https://linkedin.com/company/guardianchain',
      github: 'https://github.com/guardianchain',
      instagram: '',
      youtube: '',
      discord: 'https://discord.gg/guardianchain'
    },
    customBadges: [
      { id: 'founder', name: 'Founder', color: '#ff00d4' },
      { id: 'admin', name: 'Administrator', color: '#00ffe1' },
      { id: 'security', name: 'Security Lead', color: '#7c3aed' }
    ],
    skillTags: ['blockchain', 'web3', 'governance', 'security', 'platform-management'],
    interests: ['decentralization', 'truth-verification', 'community-building', 'digital-sovereignty'],
    achievements: ['platform-founder', 'first-capsule-creator', 'governance-initiator'],
    languages: ['english', 'spanish', 'mandarin'],
    musicPreferences: ['ambient', 'electronic', 'classical'],
    customization: {
      theme: 'cyberpunk',
      accentColor: '#00ffe1',
      backgroundPattern: 'matrix',
      profileLayout: 'professional',
      showActivityFeed: true,
      showStatsPublic: true,
      allowDirectMessages: true,
      statusMessage: 'Building the future of decentralized truth',
      availabilityStatus: 'online',
      favoriteQuote: 'Truth is the foundation of all human progress',
      animationsEnabled: true,
      particleEffects: true,
      displayMode: 'professional'
    },
    tier: 'ADMIN',
    subscriptionStatus: 'active',
    onboardingCompleted: true,
    emailVerified: true,
    isActive: true,
    needsOnboarding: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Create password hash
  const passwordHash = await bcrypt.hash('GuardianAdmin2025!', 10);
  adminConfig.passwordHash = passwordHash;

  console.log('✅ Admin user configuration prepared');
  console.log(`📧 Email: ${adminConfig.email}`);
  console.log(`🔑 Password: GuardianAdmin2025!`);
  console.log(`👤 Display Name: ${adminConfig.displayName}`);
  console.log(`🏆 Tier: ${adminConfig.tier}`);
  console.log(`🌟 Subscription: ${adminConfig.subscriptionStatus}\n`);

  // Create user stats
  const adminStats = {
    userId: adminConfig.id,
    capsulesCreated: 0,
    capsulesVerified: 0,
    gttEarned: 1000000, // Starting GTT balance for admin
    gttStaked: 0,
    truthScore: 100,
    communityRank: 1,
    verificationAccuracy: 100,
    totalViews: 0,
    totalShares: 0,
    streakDays: 1,
    lastActive: new Date(),
    joinedAt: new Date(),
    updatedAt: new Date()
  };

  console.log('✅ Admin user statistics prepared');
  console.log(`💰 Starting GTT Balance: ${adminStats.gttEarned.toLocaleString()}`);
  console.log(`🎯 Truth Score: ${adminStats.truthScore}/100`);
  console.log(`🏅 Community Rank: #${adminStats.communityRank}\n`);

  // Create initial activity log
  const adminActivity = {
    userId: adminConfig.id,
    activityType: 'account_creation',
    activityData: {
      type: 'admin_initialization',
      message: 'First admin account created',
      privileges: ['full_access', 'platform_management', 'user_administration']
    },
    ipAddress: '127.0.0.1',
    userAgent: 'GuardianChain Admin Setup Script',
    createdAt: new Date()
  };

  console.log('✅ Admin activity log prepared\n');

  // Success message
  console.log('🎉 FIRST ADMIN ACCOUNT READY FOR CREATION');
  console.log('==========================================');
  console.log('This admin account provides:');
  console.log('• Complete platform access and control');
  console.log('• All enhanced profile customization features');
  console.log('• Portfolio gallery with media management');
  console.log('• Social media integration');
  console.log('• Advanced theme and appearance customization');
  console.log('• Custom badges, skills, and achievement system');
  console.log('• Professional occupation and company details');
  console.log('• Multi-language and timezone support');
  console.log('• Full GTT token access and management');
  console.log('• Platform governance and administration rights\n');
  
  console.log('🔐 LOGIN CREDENTIALS:');
  console.log(`Email: ${adminConfig.email}`);
  console.log(`Password: GuardianAdmin2025!`);
  console.log(`Direct Profile URL: /profile\n`);
  
  console.log('⚡ NEXT STEPS:');
  console.log('1. Use the /register endpoint to create this admin account');
  console.log('2. Login with the provided credentials');
  console.log('3. Access /profile to test all enhanced customization features');
  console.log('4. Begin platform administration and user management');
  console.log('5. Create additional user accounts as needed\n');

  return {
    user: adminConfig,
    stats: adminStats,
    activity: adminActivity
  };
}

// Run the script
if (require.main === module) {
  createFirstAdminUser()
    .then(() => {
      console.log('✅ First admin account configuration complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error creating first admin account:', error);
      process.exit(1);
    });
}

module.exports = { createFirstAdminUser };