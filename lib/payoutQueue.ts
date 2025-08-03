/**
 * Enhanced Payout Queue Management System
 * Manages automated reward distributions, validator payouts, and treasury operations
 */

export interface PayoutRequest {
  id: string;
  type: 'validator_reward' | 'creator_royalty' | 'referral_bonus' | 'dao_distribution' | 'emergency_payout';
  recipient: string;
  amount: number;
  currency: 'GTT' | 'ETH' | 'MATIC';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  requestedAt: number;
  scheduledFor?: number;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed' | 'cancelled';
  metadata: {
    capsuleId?: string;
    validatorAddress?: string;
    reasonCode?: string;
    batchId?: string;
    gasEstimate?: number;
  };
  approvals: Array<{
    approver: string;
    approvedAt: number;
    signature?: string;
  }>;
  executionAttempts: number;
  lastError?: string;
  completedAt?: number;
  txHash?: string;
}

export interface PayoutBatch {
  id: string;
  type: 'daily_rewards' | 'weekly_distribution' | 'monthly_summary' | 'emergency_batch';
  totalAmount: number;
  currency: 'GTT' | 'ETH' | 'MATIC';
  requestIds: string[];
  createdAt: number;
  scheduledFor: number;
  status: 'created' | 'approved' | 'processing' | 'completed' | 'failed';
  batchHash: string;
  multisigTxHash?: string;
  gasUsed?: number;
  fees?: number;
}

export interface QueueStats {
  totalRequests: number;
  pendingAmount: number;
  processedToday: number;
  processingErrors: number;
  averageProcessingTime: number;
  queuesByType: Record<string, number>;
  queuesByPriority: Record<string, number>;
  dailyVolume: number;
  weeklyVolume: number;
  successRate: number;
}

export class PayoutQueueManager {
  private requests: Map<string, PayoutRequest> = new Map();
  private batches: Map<string, PayoutBatch> = new Map();
  private processingLock: boolean = false;

  // Configuration
  private readonly MAX_DAILY_AMOUNT = 10000; // GTT
  private readonly BATCH_SIZE = 50;
  private readonly REQUIRED_APPROVALS = 2;
  private readonly RETRY_ATTEMPTS = 3;

  /**
   * Add payout request to queue with validation
   */
  addPayoutRequest(requestData: {
    type: PayoutRequest['type'];
    recipient: string;
    amount: number;
    currency?: 'GTT' | 'ETH' | 'MATIC';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    requestedBy: string;
    scheduledFor?: number;
    metadata?: PayoutRequest['metadata'];
  }): PayoutRequest {
    
    const requestId = `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request: PayoutRequest = {
      id: requestId,
      type: requestData.type,
      recipient: requestData.recipient,
      amount: requestData.amount,
      currency: requestData.currency || 'GTT',
      priority: requestData.priority || 'medium',
      requestedBy: requestData.requestedBy,
      requestedAt: Date.now(),
      scheduledFor: requestData.scheduledFor,
      status: 'pending',
      metadata: requestData.metadata || {},
      approvals: [],
      executionAttempts: 0
    };

    // Validate request
    const validation = this.validatePayoutRequest(request);
    if (!validation.valid) {
      throw new Error(`Invalid payout request: ${validation.errors?.join(', ')}`);
    }

    this.requests.set(requestId, request);
    
    console.log(`💳 Payout request created: ${requestId} for ${request.amount} ${request.currency} to ${request.recipient}`);
    return request;
  }

  /**
   * Process payout queue with sophisticated logic
   */
  async processPayoutQueue(vaultBalance: number): Promise<{
    processed: number;
    approved: number;
    rejected: number;
    totalPaid: number;
    remainingBalance: number;
    errors: string[];
  }> {
    if (this.processingLock) {
      throw new Error('Payout queue is already being processed');
    }

    this.processingLock = true;
    
    try {
      console.log(`🔄 Processing payout queue with vault balance: ${vaultBalance} GTT`);
      
      const pendingRequests = Array.from(this.requests.values())
        .filter(req => req.status === 'pending')
        .sort(this.sortByPriority.bind(this));

      let remainingBalance = vaultBalance;
      let processed = 0;
      let approved = 0;
      let rejected = 0;
      let totalPaid = 0;
      const errors: string[] = [];

      // Daily limit check
      const todaysPaid = this.getTodaysPayoutTotal();
      const availableToday = Math.max(0, this.MAX_DAILY_AMOUNT - todaysPaid);
      remainingBalance = Math.min(remainingBalance, availableToday);

      for (const request of pendingRequests) {
        try {
          const result = await this.processIndividualRequest(request, remainingBalance);
          
          if (result.approved) {
            approved++;
            totalPaid += request.amount;
            remainingBalance -= request.amount;
          } else {
            rejected++;
            if (result.reason) {
              errors.push(`${request.id}: ${result.reason}`);
            }
          }
          
          processed++;
          
          // Stop if we've exhausted the balance
          if (remainingBalance <= 0) {
            console.log('💰 Vault balance exhausted, stopping queue processing');
            break;
          }
          
        } catch (error) {
          errors.push(`${request.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          rejected++;
        }
      }

      console.log(`✅ Queue processing completed: ${processed} processed, ${approved} approved, ${rejected} rejected`);
      
      return {
        processed,
        approved,
        rejected,
        totalPaid,
        remainingBalance: vaultBalance - totalPaid,
        errors
      };
      
    } finally {
      this.processingLock = false;
    }
  }

  /**
   * Create batch payout for multiple requests
   */
  createPayoutBatch(
    requestIds: string[],
    batchType: PayoutBatch['type'] = 'daily_rewards'
  ): PayoutBatch {
    
    const validRequests = requestIds
      .map(id => this.requests.get(id))
      .filter((req): req is PayoutRequest => req !== undefined && req.status === 'approved');

    if (validRequests.length !== requestIds.length) {
      throw new Error('Some requests are invalid or not approved');
    }

    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const totalAmount = validRequests.reduce((sum, req) => sum + req.amount, 0);
    const currency = validRequests[0].currency; // Assume same currency for batch
    
    // Validate all requests use same currency
    if (validRequests.some(req => req.currency !== currency)) {
      throw new Error('All requests in batch must use the same currency');
    }

    const batch: PayoutBatch = {
      id: batchId,
      type: batchType,
      totalAmount,
      currency,
      requestIds,
      createdAt: Date.now(),
      scheduledFor: Date.now() + (5 * 60 * 1000), // 5 minutes from now
      status: 'created',
      batchHash: this.generateBatchHash(requestIds, totalAmount)
    };

    // Mark requests as processing
    validRequests.forEach(request => {
      request.status = 'processing';
      request.metadata.batchId = batchId;
    });

    this.batches.set(batchId, batch);
    
    console.log(`📦 Created payout batch ${batchId} with ${validRequests.length} requests totaling ${totalAmount} ${currency}`);
    return batch;
  }

  /**
   * Execute batch payout with multisig requirements
   */
  async executeBatch(batchId: string, signerAddress: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
    gasUsed?: number;
  }> {
    const batch = this.batches.get(batchId);
    
    if (!batch) {
      return { success: false, error: 'Batch not found' };
    }

    if (batch.status !== 'approved') {
      return { success: false, error: 'Batch not approved for execution' };
    }

    try {
      batch.status = 'processing';
      
      // Simulate blockchain transaction
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const gasUsed = Math.floor(21000 + (batch.requestIds.length * 5000)); // Estimated gas
      
      // Mark requests as completed
      batch.requestIds.forEach(requestId => {
        const request = this.requests.get(requestId);
        if (request) {
          request.status = 'completed';
          request.completedAt = Date.now();
          request.txHash = txHash;
        }
      });

      batch.status = 'completed';
      batch.multisigTxHash = txHash;
      batch.gasUsed = gasUsed;
      batch.fees = gasUsed * 0.00000002; // Mock gas price calculation

      console.log(`✅ Batch ${batchId} executed successfully: ${txHash}`);
      
      return {
        success: true,
        txHash,
        gasUsed
      };
      
    } catch (error) {
      batch.status = 'failed';
      
      // Mark requests as failed
      batch.requestIds.forEach(requestId => {
        const request = this.requests.get(requestId);
        if (request) {
          request.status = 'failed';
          request.lastError = error instanceof Error ? error.message : 'Batch execution failed';
        }
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown execution error'
      };
    }
  }

  /**
   * Approve payout request (requires multiple approvals)
   */
  approvePayoutRequest(
    requestId: string,
    approverAddress: string,
    signature?: string
  ): { approved: boolean; requiredApprovals: number; currentApprovals: number } {
    
    const request = this.requests.get(requestId);
    
    if (!request) {
      throw new Error('Payout request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request is not in pending status');
    }

    // Check if already approved by this address
    const existingApproval = request.approvals.find(approval => approval.approver === approverAddress);
    if (existingApproval) {
      throw new Error('Already approved by this address');
    }

    // Add approval
    request.approvals.push({
      approver: approverAddress,
      approvedAt: Date.now(),
      signature
    });

    // Check if we have enough approvals
    const requiredApprovals = this.getRequiredApprovals(request);
    const approved = request.approvals.length >= requiredApprovals;

    if (approved) {
      request.status = 'approved';
      console.log(`✅ Payout request ${requestId} fully approved`);
    }

    return {
      approved,
      requiredApprovals,
      currentApprovals: request.approvals.length
    };
  }

  /**
   * Get comprehensive queue statistics
   */
  getQueueStats(): QueueStats {
    const allRequests = Array.from(this.requests.values());
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const pendingAmount = allRequests
      .filter(req => req.status === 'pending')
      .reduce((sum, req) => sum + req.amount, 0);

    const processedToday = allRequests
      .filter(req => req.completedAt && req.completedAt > oneDayAgo)
      .length;

    const processingErrors = allRequests
      .filter(req => req.status === 'failed')
      .length;

    const completedRequests = allRequests.filter(req => req.status === 'completed');
    const averageProcessingTime = completedRequests.length > 0
      ? completedRequests.reduce((sum, req) => {
          return sum + ((req.completedAt || 0) - req.requestedAt);
        }, 0) / completedRequests.length
      : 0;

    const queuesByType = allRequests.reduce((counts, req) => {
      counts[req.type] = (counts[req.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const queuesByPriority = allRequests.reduce((counts, req) => {
      counts[req.priority] = (counts[req.priority] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const dailyVolume = allRequests
      .filter(req => req.completedAt && req.completedAt > oneDayAgo)
      .reduce((sum, req) => sum + req.amount, 0);

    const weeklyVolume = allRequests
      .filter(req => req.completedAt && req.completedAt > oneWeekAgo)
      .reduce((sum, req) => sum + req.amount, 0);

    const totalProcessed = allRequests.filter(req => 
      req.status === 'completed' || req.status === 'failed'
    ).length;
    
    const successfulRequests = allRequests.filter(req => req.status === 'completed').length;
    const successRate = totalProcessed > 0 ? (successfulRequests / totalProcessed) * 100 : 0;

    return {
      totalRequests: allRequests.length,
      pendingAmount,
      processedToday,
      processingErrors,
      averageProcessingTime,
      queuesByType,
      queuesByPriority,
      dailyVolume,
      weeklyVolume,
      successRate
    };
  }

  /**
   * Get requests by status with pagination
   */
  getRequestsByStatus(
    status: PayoutRequest['status'], 
    limit: number = 50, 
    offset: number = 0
  ): PayoutRequest[] {
    return Array.from(this.requests.values())
      .filter(req => req.status === status)
      .sort((a, b) => b.requestedAt - a.requestedAt)
      .slice(offset, offset + limit);
  }

  /**
   * Cancel pending payout request
   */
  cancelPayoutRequest(requestId: string, cancelledBy: string): boolean {
    const request = this.requests.get(requestId);
    
    if (!request) {
      return false;
    }

    if (request.status !== 'pending') {
      throw new Error('Can only cancel pending requests');
    }

    request.status = 'cancelled';
    request.metadata.reasonCode = `Cancelled by ${cancelledBy}`;
    
    console.log(`❌ Payout request ${requestId} cancelled by ${cancelledBy}`);
    return true;
  }

  // Private helper methods

  private validatePayoutRequest(request: PayoutRequest): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (request.amount <= 0) {
      errors.push('Amount must be positive');
    }

    if (request.amount > 1000) { // Max single request limit
      errors.push('Amount exceeds maximum single request limit');
    }

    if (!request.recipient || !request.recipient.startsWith('0x')) {
      errors.push('Invalid recipient address');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async processIndividualRequest(
    request: PayoutRequest, 
    availableBalance: number
  ): Promise<{ approved: boolean; reason?: string }> {
    
    // Check balance
    if (request.amount > availableBalance) {
      return { approved: false, reason: 'Insufficient vault balance' };
    }

    // Check if requires approvals
    const requiredApprovals = this.getRequiredApprovals(request);
    if (request.approvals.length < requiredApprovals) {
      return { approved: false, reason: 'Insufficient approvals' };
    }

    // Approve the request
    request.status = 'approved';
    return { approved: true };
  }

  private sortByPriority(a: PayoutRequest, b: PayoutRequest): number {
    const priorityValues = { critical: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityValues[a.priority];
    const bPriority = priorityValues[b.priority];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Same priority, sort by request time
    return a.requestedAt - b.requestedAt;
  }

  private getTodaysPayoutTotal(): number {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    return Array.from(this.requests.values())
      .filter(req => req.status === 'completed' && (req.completedAt || 0) > oneDayAgo)
      .reduce((sum, req) => sum + req.amount, 0);
  }

  private getRequiredApprovals(request: PayoutRequest): number {
    // Higher amounts or critical priority require more approvals
    if (request.priority === 'critical' || request.amount > 500) {
      return 3;
    }
    
    if (request.amount > 100) {
      return 2;
    }
    
    return 1;
  }

  private generateBatchHash(requestIds: string[], totalAmount: number): string {
    const input = requestIds.sort().join('') + totalAmount.toString();
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}

// Export singleton instance
export const payoutQueueManager = new PayoutQueueManager();

// Export convenience function for simple payout requests
export function managePayoutQueue(
  requests: Array<{ amount: number; recipient: string; type: string }>, 
  vaultGTT: number
): { queue: Array<{ approved: boolean; amount: number; recipient: string }>; vaultRemaining: number } {
  
  let remaining = vaultGTT;
  const queue: Array<{ approved: boolean; amount: number; recipient: string }> = [];

  for (const r of requests) {
    if (remaining >= r.amount) {
      queue.push({ ...r, approved: true });
      remaining -= r.amount;
    } else {
      queue.push({ ...r, approved: false });
    }
  }

  return { queue, vaultRemaining: remaining };
}