/**
 * Discord Alert System for GuardianChain Validator
 * Sends notifications to Discord channels for important capsule events
 */

export interface DiscordAlertParams {
  title: string;
  chain: string;
  griefScore: number;
  boostType?: string;
  confidenceScore?: number;
  unlockTimestamp?: number;
  userAddress?: string;
  capsuleId?: string;
}

export interface DiscordWebhookMessage {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordField[];
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
  thumbnail?: {
    url: string;
  };
}

export interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

/**
 * Color scheme for different alert types
 */
const ALERT_COLORS = {
  success: 0x00ff00,    // Green for successful unlocks
  warning: 0xffa500,    // Orange for warnings
  error: 0xff0000,      // Red for errors
  info: 0x0099ff,       // Blue for information
  legendary: 0xffd700,  // Gold for legendary grief scores
  epic: 0x9932cc,       // Purple for epic grief scores
  rare: 0x1e90ff,       // Blue for rare grief scores
  common: 0x808080      // Gray for common grief scores
};

/**
 * Get appropriate color based on grief score and context
 */
function getAlertColor(griefScore: number, unlocked: boolean = true): number {
  if (!unlocked) return ALERT_COLORS.warning;
  
  if (griefScore >= 10) return ALERT_COLORS.legendary;
  if (griefScore >= 9) return ALERT_COLORS.epic;
  if (griefScore >= 7) return ALERT_COLORS.rare;
  if (griefScore >= 5) return ALERT_COLORS.common;
  
  return ALERT_COLORS.info;
}

/**
 * Get emoji based on grief score
 */
function getGriefScoreEmoji(griefScore: number): string {
  if (griefScore >= 10) return '🏆'; // Legendary
  if (griefScore >= 9) return '💎';  // Epic
  if (griefScore >= 8) return '⭐';  // Rare
  if (griefScore >= 7) return '🔥';  // High
  if (griefScore >= 5) return '✨';  // Medium
  return '🔸'; // Low
}

/**
 * Get chain emoji and display name
 */
function getChainInfo(chain: string): { emoji: string; name: string; color: number } {
  const chainLower = chain.toLowerCase();
  
  switch (chainLower) {
    case 'base':
      return { emoji: '🔵', name: 'Base', color: 0x0052ff };
    case 'polygon':
      return { emoji: '🟣', name: 'Polygon', color: 0x8247e5 };
    case 'ethereum':
      return { emoji: '💠', name: 'Ethereum', color: 0x627eea };
    default:
      return { emoji: '⚪', name: chain.charAt(0).toUpperCase() + chain.slice(1), color: ALERT_COLORS.info };
  }
}

/**
 * Format time until unlock in human-readable format
 */
function formatTimeUntilUnlock(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff <= 0) return 'Available now';
  
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Create rich Discord embed for capsule unlock alert
 */
function createUnlockEmbed(params: DiscordAlertParams): DiscordEmbed {
  const { title, chain, griefScore, boostType, confidenceScore, unlockTimestamp, capsuleId } = params;
  const chainInfo = getChainInfo(chain);
  const griefEmoji = getGriefScoreEmoji(griefScore);
  const color = getAlertColor(griefScore, true);
  
  const fields: DiscordField[] = [
    {
      name: `${chainInfo.emoji} Network`,
      value: chainInfo.name,
      inline: true
    },
    {
      name: `${griefEmoji} Grief Score`,
      value: `${griefScore}/10`,
      inline: true
    }
  ];
  
  if (boostType && boostType !== 'None') {
    fields.push({
      name: '⚡ Boost Type',
      value: boostType,
      inline: true
    });
  }
  
  if (typeof confidenceScore === 'number') {
    const confidenceEmoji = confidenceScore >= 95 ? '🔒' : confidenceScore >= 80 ? '✅' : '⚠️';
    fields.push({
      name: `${confidenceEmoji} ZK Confidence`,
      value: `${confidenceScore.toFixed(1)}%`,
      inline: true
    });
  }
  
  if (unlockTimestamp) {
    fields.push({
      name: '⏰ Unlock Time',
      value: formatTimeUntilUnlock(unlockTimestamp),
      inline: true
    });
  }
  
  if (capsuleId) {
    fields.push({
      name: '🆔 Capsule ID',
      value: capsuleId,
      inline: true
    });
  }
  
  return {
    title: `🔓 Capsule Unlocked: ${title}`,
    description: `A capsule has been successfully unlocked on the ${chainInfo.name} network with grief score validation.`,
    color,
    fields,
    footer: {
      text: 'GuardianChain Validator',
      icon_url: 'https://guardianchain.app/favicon.ico'
    },
    timestamp: new Date().toISOString(),
    thumbnail: {
      url: 'https://guardianchain.app/assets/capsule-icon.png'
    }
  };
}

/**
 * Create simple text alert for basic notifications
 */
function createSimpleAlert(params: DiscordAlertParams): string {
  const { title, chain, griefScore, boostType } = params;
  const chainInfo = getChainInfo(chain);
  const griefEmoji = getGriefScoreEmoji(griefScore);
  
  let message = `🔓 **Capsule Unlocked**: ${title}\n`;
  message += `${chainInfo.emoji} **Network**: ${chainInfo.name}\n`;
  message += `${griefEmoji} **Grief Score**: ${griefScore}/10`;
  
  if (boostType && boostType !== 'None') {
    message += `\n⚡ **Boost**: ${boostType}`;
  }
  
  return message;
}

/**
 * Send Discord alert for capsule unlock
 * @param params - Alert parameters
 * @param useRichEmbed - Whether to use rich embed (default: true)
 * @returns Promise<boolean> - Success status
 */
export async function sendDiscordAlert(
  params: DiscordAlertParams, 
  useRichEmbed: boolean = true
): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('⚠️  Discord webhook URL not configured. Set DISCORD_WEBHOOK_URL environment variable.');
    return false;
  }
  
  try {
    let payload: DiscordWebhookMessage;
    
    if (useRichEmbed) {
      payload = {
        username: 'GuardianChain Validator',
        avatar_url: 'https://guardianchain.app/assets/guardian-avatar.png',
        embeds: [createUnlockEmbed(params)]
      };
    } else {
      payload = {
        content: createSimpleAlert(params),
        username: 'GuardianChain Validator'
      };
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GuardianChain-Validator/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Discord API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Check for rate limiting
    const remaining = response.headers.get('x-ratelimit-remaining');
    if (remaining && parseInt(remaining) < 5) {
      console.warn('⚠️  Discord rate limit approaching. Consider reducing alert frequency.');
    }
    
    console.log(`✅ Discord alert sent for capsule: ${params.title}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to send Discord alert: ${error}`);
    return false;
  }
}

/**
 * Send batch Discord alerts with rate limiting
 * @param alertParams - Array of alert parameters
 * @param delayMs - Delay between alerts in milliseconds (default: 1000)
 * @returns Promise<number> - Number of successful alerts sent
 */
export async function sendBatchDiscordAlerts(
  alertParams: DiscordAlertParams[], 
  delayMs: number = 1000
): Promise<number> {
  let successCount = 0;
  
  for (let i = 0; i < alertParams.length; i++) {
    const params = alertParams[i];
    
    try {
      const success = await sendDiscordAlert(params);
      if (success) successCount++;
      
      // Add delay between requests to respect rate limits
      if (i < alertParams.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`❌ Batch alert ${i + 1} failed: ${error}`);
    }
  }
  
  console.log(`📊 Batch Discord alerts completed: ${successCount}/${alertParams.length} successful`);
  return successCount;
}

/**
 * Send error alert to Discord
 * @param error - Error message or object
 * @param context - Additional context information
 * @returns Promise<boolean> - Success status
 */
export async function sendErrorAlert(
  error: string | Error, 
  context?: { [key: string]: any }
): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) return false;
  
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  const embed: DiscordEmbed = {
    title: '🚨 GuardianChain Validator Error',
    description: errorMessage,
    color: ALERT_COLORS.error,
    fields: [],
    footer: {
      text: 'GuardianChain Validator Error System'
    },
    timestamp: new Date().toISOString()
  };
  
  if (context) {
    Object.entries(context).forEach(([key, value]) => {
      embed.fields!.push({
        name: key,
        value: String(value),
        inline: true
      });
    });
  }
  
  if (errorStack && errorStack.length < 1000) {
    embed.fields!.push({
      name: 'Stack Trace',
      value: `\`\`\`\n${errorStack}\`\`\``,
      inline: false
    });
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'GuardianChain Error Reporter',
        embeds: [embed]
      })
    });
    
    return response.ok;
  } catch (alertError) {
    console.error('Failed to send error alert to Discord:', alertError);
    return false;
  }
}

/**
 * Test Discord webhook configuration
 * @returns Promise<boolean> - Success status
 */
export async function testDiscordWebhook(): Promise<boolean> {
  console.log('🧪 Testing Discord webhook configuration...');
  
  const testParams: DiscordAlertParams = {
    title: 'Test Capsule',
    chain: 'base',
    griefScore: 8,
    boostType: 'Test Boost',
    confidenceScore: 95,
    capsuleId: 'test_capsule_001'
  };
  
  const success = await sendDiscordAlert(testParams);
  
  if (success) {
    console.log('✅ Discord webhook test successful!');
  } else {
    console.log('❌ Discord webhook test failed. Check your configuration.');
  }
  
  return success;
}