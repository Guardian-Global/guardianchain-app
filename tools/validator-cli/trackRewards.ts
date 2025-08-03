#!/usr/bin/env node

/**
 * Validator Rewards Tracking CLI Tool
 * Advanced command-line interface for tracking and managing validator rewards
 */

import { Command } from 'commander';
import { validatorRewards, type ValidatorEvent } from '../../lib/validatorRewards';
import { daoVault } from '../../lib/daoVaultDisbursement';
import { writeFileSync } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const program = new Command();

program
  .name('validator-rewards')
  .description('GuardianChain Validator Rewards Tracking System')
  .version('2.1.0');

// Record validator event command
program
  .command('record')
  .description('Record a new validator event')
  .requiredOption('-v, --validator <address>', 'Validator address')
  .requiredOption('-t, --type <type>', 'Event type (capsule_validation, truth_verification, zk_proof, consensus_participation, uptime_bonus)')
  .option('-c, --capsule <id>', 'Capsule ID (if applicable)')
  .option('-g, --grief <score>', 'Grief score (0-10)', parseFloat)
  .option('-f, --confidence <score>', 'Confidence score (0-100)', parseFloat)
  .option('-q, --quality <level>', 'Quality level (high, medium, low)')
  .option('--gas <amount>', 'Gas used', parseInt)
  .option('--difficulty <level>', 'Validation difficulty', parseFloat)
  .action(async (options) => {
    try {
      const eventData: Omit<ValidatorEvent, 'id' | 'timestamp'> = {
        validator: options.validator,
        eventType: options.type,
        capsuleId: options.capsule,
        griefScore: options.grief,
        confidence: options.confidence,
        gasUsed: options.gas,
        difficulty: options.difficulty,
        metadata: {
          quality: options.quality,
          verificationTime: Date.now() // Mock verification time
        }
      };

      const event = validatorRewards.recordValidatorEvent(eventData);
      
      console.log('✅ Validator event recorded successfully');
      console.log(`📊 Event ID: ${event.id}`);
      console.log(`🏷️  Type: ${event.eventType}`);
      console.log(`⏰ Timestamp: ${new Date(event.timestamp).toLocaleString()}`);
      
      if (event.griefScore) {
        console.log(`😢 Grief Score: ${event.griefScore}/10`);
      }
      
      if (event.confidence) {
        console.log(`🎯 Confidence: ${event.confidence}%`);
      }

    } catch (error) {
      console.error('❌ Failed to record validator event:', error);
      process.exit(1);
    }
  });

// Get validator stats command
program
  .command('stats')
  .description('Get validator statistics')
  .requiredOption('-v, --validator <address>', 'Validator address')
  .option('-o, --output <file>', 'Output file for detailed stats')
  .option('--format <type>', 'Output format (json, csv)', 'json')
  .action(async (options) => {
    try {
      const stats = validatorRewards.getValidatorStats(options.validator);
      const projections = validatorRewards.calculateValidatorProjections(options.validator, 30);

      console.log(`\n🏆 Validator Statistics: ${options.validator}`);
      console.log('━'.repeat(60));
      console.log(`📊 Total Events: ${stats.totalEvents}`);
      console.log(`💰 Total Rewards: ${stats.totalRewardsEarned} GTT`);
      console.log(`📈 Average Grief Score: ${stats.averageGriefScore.toFixed(2)}/10`);
      console.log(`✅ Success Rate: ${stats.successRate.toFixed(1)}%`);
      console.log(`⚡ Uptime: ${stats.uptime.toFixed(1)}%`);
      console.log(`🥇 Rank: #${stats.rank}`);
      console.log(`🏅 Tier: ${stats.tier.toUpperCase()}`);
      console.log(`⏰ Last Active: ${new Date(stats.lastActive).toLocaleString()}`);
      
      if (stats.specializations.length > 0) {
        console.log(`🎯 Specializations: ${stats.specializations.join(', ')}`);
      }

      console.log('\n📊 Performance Metrics:');
      console.log(`   Daily: ${stats.performance.daily} events`);
      console.log(`   Weekly: ${stats.performance.weekly} events`);
      console.log(`   Monthly: ${stats.performance.monthly} events`);
      console.log(`   All Time: ${stats.performance.allTime} events`);

      console.log('\n🔮 30-Day Projections:');
      console.log(`   Daily Average: ${projections.dailyAverage.toFixed(2)} GTT`);
      console.log(`   Weekly Projection: ${projections.projectedWeekly.toFixed(2)} GTT`);
      console.log(`   Monthly Projection: ${projections.projectedMonthly.toFixed(2)} GTT`);
      console.log(`   Estimated APY: ${projections.estimatedAPY.toFixed(2)} GTT`);

      // Output to file if requested
      if (options.output) {
        const outputData = {
          validator: options.validator,
          stats,
          projections,
          generated: new Date().toISOString()
        };

        if (options.format === 'csv') {
          const csvWriter = createObjectCsvWriter({
            path: options.output,
            header: [
              { id: 'validator', title: 'Validator' },
              { id: 'totalEvents', title: 'Total Events' },
              { id: 'totalRewards', title: 'Total Rewards' },
              { id: 'averageGriefScore', title: 'Avg Grief Score' },
              { id: 'successRate', title: 'Success Rate' },
              { id: 'uptime', title: 'Uptime' },
              { id: 'tier', title: 'Tier' },
              { id: 'rank', title: 'Rank' }
            ]
          });

          await csvWriter.writeRecords([{
            validator: options.validator,
            totalEvents: stats.totalEvents,
            totalRewards: stats.totalRewardsEarned,
            averageGriefScore: stats.averageGriefScore,
            successRate: stats.successRate,
            uptime: stats.uptime,
            tier: stats.tier,
            rank: stats.rank
          }]);
        } else {
          writeFileSync(options.output, JSON.stringify(outputData, null, 2));
        }

        console.log(`\n💾 Stats exported to: ${options.output}`);
      }

    } catch (error) {
      console.error('❌ Failed to get validator stats:', error);
      process.exit(1);
    }
  });

// Leaderboard command
program
  .command('leaderboard')
  .description('Show validator leaderboard')
  .option('-l, --limit <number>', 'Number of validators to show', parseInt, 10)
  .option('-o, --output <file>', 'Output file for leaderboard')
  .option('--tier <tier>', 'Filter by tier (bronze, silver, gold, platinum, diamond)')
  .action(async (options) => {
    try {
      const topValidators = validatorRewards.getTopValidators(options.limit);
      const summary = validatorRewards.getValidatorSummary();

      // Filter by tier if specified
      const filteredValidators = options.tier 
        ? topValidators.filter(v => v.tier === options.tier)
        : topValidators;

      console.log('\n🏆 Validator Leaderboard');
      console.log('━'.repeat(80));
      console.log('Rank | Validator Address                          | Tier      | Events | Rewards');
      console.log('━'.repeat(80));

      filteredValidators.forEach((validator, index) => {
        const address = validator.validator.slice(0, 42).padEnd(42);
        const tier = validator.tier.padEnd(9);
        const events = validator.totalEvents.toString().padStart(6);
        const rewards = validator.totalRewardsEarned.toFixed(2).padStart(7);
        
        console.log(`${(index + 1).toString().padStart(4)} | ${address} | ${tier} | ${events} | ${rewards}`);
      });

      console.log('━'.repeat(80));
      console.log('\n📊 Network Summary:');
      console.log(`Total Validators: ${summary.totalValidators}`);
      console.log(`Active Validators: ${summary.activeValidators}`);
      console.log(`Total Events: ${summary.totalEvents}`);
      console.log(`Total Rewards Distributed: ${summary.totalRewardsDistributed.toFixed(2)} GTT`);
      console.log(`Average Reward per Event: ${summary.averageRewardPerEvent.toFixed(4)} GTT`);

      console.log('\n🏅 Tier Distribution:');
      Object.entries(summary.tierDistribution).forEach(([tier, count]) => {
        console.log(`   ${tier.charAt(0).toUpperCase() + tier.slice(1)}: ${count} validators`);
      });

      // Output to file if requested
      if (options.output) {
        const leaderboardData = {
          leaderboard: filteredValidators,
          summary,
          filters: { tier: options.tier, limit: options.limit },
          generated: new Date().toISOString()
        };

        writeFileSync(options.output, JSON.stringify(leaderboardData, null, 2));
        console.log(`\n💾 Leaderboard exported to: ${options.output}`);
      }

    } catch (error) {
      console.error('❌ Failed to generate leaderboard:', error);
      process.exit(1);
    }
  });

// Calculate rewards command
program
  .command('calculate')
  .description('Calculate rewards for recent validator events')
  .option('-d, --days <number>', 'Number of days to look back', parseInt, 7)
  .option('-v, --validator <address>', 'Specific validator address')
  .option('-r, --rate <number>', 'Reward rate multiplier', parseFloat, 1.0)
  .option('-o, --output <file>', 'Output file for reward calculations')
  .action(async (options) => {
    try {
      // Mock recent events - in production, this would query the database
      const mockEvents: ValidatorEvent[] = [
        {
          id: 'evt_001',
          validator: options.validator || 'validator_001',
          eventType: 'capsule_validation',
          timestamp: Date.now() - 3600000,
          griefScore: 8,
          confidence: 92
        },
        {
          id: 'evt_002',
          validator: options.validator || 'validator_001',
          eventType: 'truth_verification',
          timestamp: Date.now() - 7200000,
          griefScore: 9,
          confidence: 95
        }
      ];

      const rewardCalculations = validatorRewards.calculateValidatorRewards(
        mockEvents,
        options.rate
      );

      console.log(`\n💰 Reward Calculations (${options.days} days, rate: ${options.rate}x)`);
      console.log('━'.repeat(70));

      let totalRewards = 0;
      
      rewardCalculations.forEach((calc, index) => {
        console.log(`\n🏆 Validator #${index + 1}: ${calc.validator}`);
        console.log(`   Base Reward: ${calc.baseReward.toFixed(2)} GTT`);
        console.log(`   Performance Bonus: ${calc.performanceBonus.toFixed(2)} GTT`);
        console.log(`   Quality Bonus: ${calc.qualityBonus.toFixed(2)} GTT`);
        console.log(`   Uptime Bonus: ${calc.uptimeBonus.toFixed(2)} GTT`);
        console.log(`   Tier Multiplier: ${calc.tierMultiplier}x`);
        console.log(`   ➤ Total Reward: ${calc.totalReward.toFixed(2)} GTT`);
        
        console.log('   Event Breakdown:');
        calc.breakdown.forEach(item => {
          console.log(`     ${item.eventType}: ${item.count} events → ${item.reward.toFixed(2)} GTT`);
        });

        totalRewards += calc.totalReward;
      });

      console.log('━'.repeat(70));
      console.log(`💎 Total Rewards: ${totalRewards.toFixed(2)} GTT`);

      // Output to file if requested
      if (options.output) {
        const rewardData = {
          calculations: rewardCalculations,
          totalRewards,
          options: {
            days: options.days,
            validator: options.validator,
            rate: options.rate
          },
          generated: new Date().toISOString()
        };

        writeFileSync(options.output, JSON.stringify(rewardData, null, 2));
        console.log(`\n💾 Calculations exported to: ${options.output}`);
      }

    } catch (error) {
      console.error('❌ Failed to calculate rewards:', error);
      process.exit(1);
    }
  });

// DAO vault integration command
program
  .command('vault')
  .description('Show DAO vault status and validator allocations')
  .option('-o, --output <file>', 'Output file for vault data')
  .action(async (options) => {
    try {
      const vaultStats = daoVault.getVaultStats();
      const healthScore = daoVault.getVaultHealthScore();

      console.log('\n🏛️  DAO Vault Status');
      console.log('━'.repeat(50));
      console.log(`💰 Total Balance: ${vaultStats.totalBalance.toFixed(2)} GTT`);
      console.log(`🛡️  Reserve Balance: ${vaultStats.reserveBalance.toFixed(2)} GTT`);
      console.log(`📊 Health Score: ${healthScore}/100`);
      console.log(`🎯 Active Validators: ${vaultStats.activeValidators}`);
      console.log(`⏳ Pending Rewards: ${vaultStats.pendingRewards.toFixed(2)} GTT`);

      console.log('\n📈 Distribution Status:');
      console.log(`   Today: ${vaultStats.distributedToday.toFixed(2)} GTT`);
      console.log(`   This Week: ${vaultStats.distributedThisWeek.toFixed(2)} GTT`);
      console.log(`   This Month: ${vaultStats.distributedThisMonth.toFixed(2)} GTT`);
      console.log(`   All Time: ${vaultStats.totalDistributed.toFixed(2)} GTT`);

      console.log('\n⏰ Distribution Schedule:');
      console.log(`   Last Distribution: ${new Date(vaultStats.lastDistribution).toLocaleString()}`);
      console.log(`   Next Distribution: ${new Date(vaultStats.nextDistribution).toLocaleString()}`);

      // Show distribution progress
      const dailyProgress = vaultStats.distributionProgress.daily.percentage;
      const weeklyProgress = vaultStats.distributionProgress.weekly.percentage;
      const monthlyProgress = vaultStats.distributionProgress.monthly.percentage;

      console.log('\n📊 Distribution Limits:');
      console.log(`   Daily: ${dailyProgress.toFixed(1)}% used`);
      console.log(`   Weekly: ${weeklyProgress.toFixed(1)}% used`);
      console.log(`   Monthly: ${monthlyProgress.toFixed(1)}% used`);

      // Show recent transactions
      if (vaultStats.recentTransactions.length > 0) {
        console.log('\n📋 Recent Transactions:');
        vaultStats.recentTransactions.slice(0, 5).forEach(tx => {
          const date = new Date(tx.timestamp).toLocaleDateString();
          const type = tx.type.toUpperCase();
          const amount = tx.amount.toFixed(2);
          console.log(`   ${date} | ${type} | ${amount} GTT`);
        });
      }

      // Output to file if requested
      if (options.output) {
        const vaultData = {
          stats: vaultStats,
          healthScore,
          generated: new Date().toISOString()
        };

        writeFileSync(options.output, JSON.stringify(vaultData, null, 2));
        console.log(`\n💾 Vault data exported to: ${options.output}`);
      }

    } catch (error) {
      console.error('❌ Failed to get vault status:', error);
      process.exit(1);
    }
  });

// Export command for batch processing
program
  .command('export')
  .description('Export comprehensive validator data')
  .requiredOption('-o, --output <directory>', 'Output directory for exports')
  .option('--format <type>', 'Export format (json, csv)', 'json')
  .option('--include-events', 'Include individual events in export')
  .action(async (options) => {
    try {
      console.log('📊 Exporting comprehensive validator data...');
      
      const summary = validatorRewards.getValidatorSummary();
      const leaderboard = validatorRewards.getTopValidators(50);
      const vaultStats = daoVault.getVaultStats();

      // Create output directory
      const fs = require('fs');
      if (!fs.existsSync(options.output)) {
        fs.mkdirSync(options.output, { recursive: true });
      }

      // Export summary
      const summaryPath = `${options.output}/validator-summary.${options.format}`;
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

      // Export leaderboard
      const leaderboardPath = `${options.output}/validator-leaderboard.${options.format}`;
      fs.writeFileSync(leaderboardPath, JSON.stringify(leaderboard, null, 2));

      // Export vault stats
      const vaultPath = `${options.output}/dao-vault-stats.${options.format}`;
      fs.writeFileSync(vaultPath, JSON.stringify(vaultStats, null, 2));

      console.log('✅ Export completed successfully');
      console.log(`📁 Files exported to: ${options.output}`);
      console.log(`   • ${summaryPath}`);
      console.log(`   • ${leaderboardPath}`);
      console.log(`   • ${vaultPath}`);

    } catch (error) {
      console.error('❌ Export failed:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}