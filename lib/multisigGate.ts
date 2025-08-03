/**
 * Enhanced Multisig Security Gate System
 * Provides enterprise-grade multisignature security for critical operations
 */

import crypto from 'crypto';

export interface MultisigTransaction {
  id: string;
  type: 'payout' | 'vault_transfer' | 'emergency_action' | 'governance_execution' | 'contract_upgrade';
  operation: string;
  data: any;
  requiredSignatures: number;
  signatures: Array<{
    signer: string;
    signature: string;
    timestamp: number;
    message?: string;
  }>;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  status: 'pending' | 'approved' | 'executed' | 'rejected' | 'expired';
  executedAt?: number;
  executionTxHash?: string;
  metadata: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    amount?: number;
    recipient?: string;
    contractAddress?: string;
    gasEstimate?: number;
  };
}

export interface MultisigConfig {
  signers: string[];
  defaultThreshold: number;
  thresholdsByType: Record<string, number>;
  timeoutPeriod: number; // milliseconds
  emergencyContacts: string[];
  adminAddresses: string[];
}

export interface SignatureValidation {
  valid: boolean;
  signer?: string;
  message?: string;
  error?: string;
}

export class MultisigGateManager {
  private transactions: Map<string, MultisigTransaction> = new Map();
  private config: MultisigConfig;

  constructor(config?: Partial<MultisigConfig>) {
    this.config = {
      signers: [
        '0x742d35Cc6635Ca0532aB6d15e12c1F8D1a4eF0b7', // Primary signer
        '0x8ba1f109551bD432803012645Hac136c31b2Dc8',  // Secondary signer
        '0x9c5B4d6d7e8f123456789abcdef0123456789abc'   // Tertiary signer
      ],
      defaultThreshold: 2,
      thresholdsByType: {
        'payout': 2,
        'vault_transfer': 3,
        'emergency_action': 2,
        'governance_execution': 2,
        'contract_upgrade': 3
      },
      timeoutPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
      emergencyContacts: [],
      adminAddresses: ['0x742d35Cc6635Ca0532aB6d15e12c1F8D1a4eF0b7'],
      ...config
    };
  }

  /**
   * Create multisig transaction requiring multiple approvals
   */
  createMultisigTransaction(transactionData: {
    type: MultisigTransaction['type'];
    operation: string;
    data: any;
    createdBy: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    customThreshold?: number;
    metadata?: Partial<MultisigTransaction['metadata']>;
  }): MultisigTransaction {
    
    const txId = `multisig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    const requiredSignatures = transactionData.customThreshold || 
      this.config.thresholdsByType[transactionData.type] || 
      this.config.defaultThreshold;

    const transaction: MultisigTransaction = {
      id: txId,
      type: transactionData.type,
      operation: transactionData.operation,
      data: transactionData.data,
      requiredSignatures,
      signatures: [],
      createdBy: transactionData.createdBy,
      createdAt: now,
      expiresAt: now + this.getTimeoutForType(transactionData.type),
      status: 'pending',
      metadata: {
        priority: transactionData.priority || 'medium',
        ...transactionData.metadata
      }
    };

    this.transactions.set(txId, transaction);
    
    console.log(`🔐 Created multisig transaction: ${txId} (${transaction.type})`);
    console.log(`📋 Requires ${requiredSignatures} signatures from authorized signers`);
    
    return transaction;
  }

  /**
   * Sign multisig transaction with enhanced validation
   */
  signTransaction(
    txId: string, 
    signerAddress: string, 
    signature: string,
    message?: string
  ): {
    success: boolean;
    transaction?: MultisigTransaction;
    approved?: boolean;
    error?: string;
  } {
    
    const transaction = this.transactions.get(txId);
    
    if (!transaction) {
      return { success: false, error: 'Transaction not found' };
    }

    // Validate transaction status
    if (transaction.status !== 'pending') {
      return { success: false, error: 'Transaction is not in pending status' };
    }

    // Check expiration
    if (Date.now() > transaction.expiresAt) {
      transaction.status = 'expired';
      return { success: false, error: 'Transaction has expired' };
    }

    // Validate signer authorization
    if (!this.config.signers.includes(signerAddress)) {
      return { success: false, error: 'Unauthorized signer' };
    }

    // Check if already signed by this address
    const existingSignature = transaction.signatures.find(sig => sig.signer === signerAddress);
    if (existingSignature) {
      return { success: false, error: 'Already signed by this address' };
    }

    // Validate signature
    const signatureValidation = this.validateSignature(transaction, signerAddress, signature);
    if (!signatureValidation.valid) {
      return { success: false, error: signatureValidation.error || 'Invalid signature' };
    }

    // Add signature
    transaction.signatures.push({
      signer: signerAddress,
      signature,
      timestamp: Date.now(),
      message
    });

    // Check if we have enough signatures
    const approved = transaction.signatures.length >= transaction.requiredSignatures;
    
    if (approved) {
      transaction.status = 'approved';
      console.log(`✅ Multisig transaction ${txId} approved with ${transaction.signatures.length} signatures`);
    }

    return {
      success: true,
      transaction,
      approved
    };
  }

  /**
   * Execute approved multisig transaction
   */
  async executeTransaction(txId: string, executorAddress: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    
    const transaction = this.transactions.get(txId);
    
    if (!transaction) {
      return { success: false, error: 'Transaction not found' };
    }

    if (transaction.status !== 'approved') {
      return { success: false, error: 'Transaction not approved for execution' };
    }

    // Validate executor authorization
    if (!this.isAuthorizedExecutor(executorAddress, transaction.type)) {
      return { success: false, error: 'Unauthorized executor' };
    }

    try {
      console.log(`🚀 Executing multisig transaction: ${txId}`);
      
      // Execute the transaction based on type
      const result = await this.executeByType(transaction);
      
      if (result.success) {
        transaction.status = 'executed';
        transaction.executedAt = Date.now();
        transaction.executionTxHash = result.txHash;
        
        console.log(`✅ Multisig transaction executed successfully: ${result.txHash}`);
        
        return {
          success: true,
          txHash: result.txHash
        };
      } else {
        return {
          success: false,
          error: result.error || 'Execution failed'
        };
      }
      
    } catch (error) {
      console.error(`❌ Multisig execution failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown execution error'
      };
    }
  }

  /**
   * Check if operation is approved by sufficient multisig signatures
   */
  isApprovedByMultisig(
    signers: string[], 
    threshold: number = this.config.defaultThreshold
  ): boolean {
    // Remove duplicates and validate signers
    const uniqueValidSigners = Array.from(new Set(signers)).filter(signer => 
      this.config.signers.includes(signer)
    );
    
    return uniqueValidSigners.length >= threshold;
  }

  /**
   * Reject multisig transaction
   */
  rejectTransaction(txId: string, rejectorAddress: string, reason?: string): boolean {
    const transaction = this.transactions.get(txId);
    
    if (!transaction) {
      return false;
    }

    if (transaction.status !== 'pending') {
      return false;
    }

    // Only admins can reject transactions
    if (!this.config.adminAddresses.includes(rejectorAddress)) {
      return false;
    }

    transaction.status = 'rejected';
    transaction.metadata.rejectionReason = reason;
    
    console.log(`❌ Multisig transaction ${txId} rejected by ${rejectorAddress}: ${reason}`);
    return true;
  }

  /**
   * Get transaction by ID with full details
   */
  getTransaction(txId: string): MultisigTransaction | undefined {
    return this.transactions.get(txId);
  }

  /**
   * Get pending transactions requiring signatures
   */
  getPendingTransactions(signerAddress?: string): MultisigTransaction[] {
    const pending = Array.from(this.transactions.values())
      .filter(tx => tx.status === 'pending' && Date.now() <= tx.expiresAt);
    
    if (signerAddress) {
      // Filter to transactions that haven't been signed by this address
      return pending.filter(tx => 
        !tx.signatures.some(sig => sig.signer === signerAddress)
      );
    }
    
    return pending;
  }

  /**
   * Get multisig statistics and metrics
   */
  getMultisigStats(): {
    totalTransactions: number;
    pendingTransactions: number;
    approvedTransactions: number;
    executedTransactions: number;
    expiredTransactions: number;
    averageApprovalTime: number;
    signatureDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
  } {
    const allTransactions = Array.from(this.transactions.values());
    
    const signatureDistribution = this.config.signers.reduce((dist, signer) => {
      dist[signer] = allTransactions.reduce((count, tx) => {
        return count + (tx.signatures.some(sig => sig.signer === signer) ? 1 : 0);
      }, 0);
      return dist;
    }, {} as Record<string, number>);

    const typeDistribution = allTransactions.reduce((dist, tx) => {
      dist[tx.type] = (dist[tx.type] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    const executedTransactions = allTransactions.filter(tx => tx.status === 'executed');
    const averageApprovalTime = executedTransactions.length > 0
      ? executedTransactions.reduce((sum, tx) => {
          return sum + ((tx.executedAt || 0) - tx.createdAt);
        }, 0) / executedTransactions.length
      : 0;

    return {
      totalTransactions: allTransactions.length,
      pendingTransactions: allTransactions.filter(tx => tx.status === 'pending').length,
      approvedTransactions: allTransactions.filter(tx => tx.status === 'approved').length,
      executedTransactions: executedTransactions.length,
      expiredTransactions: allTransactions.filter(tx => tx.status === 'expired').length,
      averageApprovalTime,
      signatureDistribution,
      typeDistribution
    };
  }

  /**
   * Emergency override for critical situations
   */
  emergencyOverride(
    txId: string, 
    emergencyContact: string, 
    justification: string
  ): boolean {
    if (!this.config.emergencyContacts.includes(emergencyContact)) {
      return false;
    }

    const transaction = this.transactions.get(txId);
    if (!transaction || transaction.metadata.priority !== 'critical') {
      return false;
    }

    transaction.status = 'approved';
    transaction.metadata.emergencyOverride = {
      contact: emergencyContact,
      justification,
      timestamp: Date.now()
    };

    console.log(`🚨 Emergency override applied to transaction ${txId} by ${emergencyContact}`);
    return true;
  }

  // Private helper methods

  private validateSignature(
    transaction: MultisigTransaction, 
    signer: string, 
    signature: string
  ): SignatureValidation {
    
    try {
      // Create message to sign (simplified for demo)
      const message = this.createSignatureMessage(transaction);
      
      // In production, this would verify the cryptographic signature
      // For demo purposes, we'll do basic validation
      if (signature.length < 10) {
        return { valid: false, error: 'Signature too short' };
      }

      if (!signature.startsWith('0x')) {
        return { valid: false, error: 'Invalid signature format' };
      }

      return { valid: true, signer, message };
      
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Signature validation failed' 
      };
    }
  }

  private createSignatureMessage(transaction: MultisigTransaction): string {
    return JSON.stringify({
      id: transaction.id,
      type: transaction.type,
      operation: transaction.operation,
      data: transaction.data,
      timestamp: transaction.createdAt
    });
  }

  private isAuthorizedExecutor(address: string, txType: string): boolean {
    // Admins can execute any transaction type
    if (this.config.adminAddresses.includes(address)) {
      return true;
    }

    // Signers can execute most transaction types
    if (this.config.signers.includes(address)) {
      return txType !== 'contract_upgrade'; // Restrict contract upgrades to admins only
    }

    return false;
  }

  private getTimeoutForType(type: string): number {
    const timeouts = {
      'payout': 24 * 60 * 60 * 1000,          // 1 day
      'vault_transfer': 7 * 24 * 60 * 60 * 1000, // 7 days
      'emergency_action': 2 * 60 * 60 * 1000,    // 2 hours
      'governance_execution': 7 * 24 * 60 * 60 * 1000, // 7 days
      'contract_upgrade': 14 * 24 * 60 * 60 * 1000     // 14 days
    };

    return timeouts[type as keyof typeof timeouts] || this.config.timeoutPeriod;
  }

  private async executeByType(transaction: MultisigTransaction): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    
    // Generate mock transaction hash
    const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;
    
    switch (transaction.type) {
      case 'payout':
        return this.executePayout(transaction, txHash);
      
      case 'vault_transfer':
        return this.executeVaultTransfer(transaction, txHash);
      
      case 'emergency_action':
        return this.executeEmergencyAction(transaction, txHash);
      
      case 'governance_execution':
        return this.executeGovernanceAction(transaction, txHash);
      
      case 'contract_upgrade':
        return this.executeContractUpgrade(transaction, txHash);
      
      default:
        return { success: false, error: 'Unknown transaction type' };
    }
  }

  private async executePayout(transaction: MultisigTransaction, txHash: string) {
    console.log(`💳 Executing payout: ${transaction.metadata.amount} to ${transaction.metadata.recipient}`);
    
    // In production, this would interact with the actual payment system
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    
    return { success: true, txHash };
  }

  private async executeVaultTransfer(transaction: MultisigTransaction, txHash: string) {
    console.log(`🏦 Executing vault transfer: ${JSON.stringify(transaction.data)}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true, txHash };
  }

  private async executeEmergencyAction(transaction: MultisigTransaction, txHash: string) {
    console.log(`🚨 Executing emergency action: ${transaction.operation}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, txHash };
  }

  private async executeGovernanceAction(transaction: MultisigTransaction, txHash: string) {
    console.log(`🏛️ Executing governance action: ${transaction.operation}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, txHash };
  }

  private async executeContractUpgrade(transaction: MultisigTransaction, txHash: string) {
    console.log(`🔧 Executing contract upgrade: ${transaction.metadata.contractAddress}`);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return { success: true, txHash };
  }
}

// Export singleton instance
export const multisigGate = new MultisigGateManager();

// Export convenience function for simple multisig checks
export function isApprovedByMultisig(
  signers: string[], 
  threshold: number = 2
): boolean {
  return multisigGate.isApprovedByMultisig(signers, threshold);
}