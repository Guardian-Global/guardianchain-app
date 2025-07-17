# GuardianChain Smart Contract Testing Instructions

## Testing the Local Deployment

The smart contracts are currently deployed on the local Hardhat network. Here's how to test them:

### 1. Connect to Local Network

**MetaMask Setup:**
1. Open MetaMask
2. Click network dropdown → Add Network → Add a network manually
3. Network details:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

**Import Test Account:**
1. Copy private key from Hardhat test accounts
2. MetaMask → Import Account → paste private key
3. You should see ~10,000 ETH balance

### 2. Test Contract Functions

Visit the following pages to test different aspects:

#### A. Web3 Demo Page (`/web3-demo`)
- Connect wallet
- View GTT token information
- Test basic contract reading functions
- Check balance and contract status

#### B. Smart Contract Demo (`/smart-contract-demo`)
- **Register Capsule**: Create new truth capsule
- **Update Yield**: Set yield amount for capsule
- **Claim Yield**: Convert yield to GTT tokens
- **Verify Capsule**: Mark capsule as verified
- **Mint GTT**: Direct token minting (admin only)

#### C. Governance Page (`/governance`)
- View GTT balance
- Create governance proposals
- Vote on proposals (if any exist)
- Monitor DAO treasury

### 3. Test Scenarios

**Scenario 1: Complete Capsule Lifecycle**
```
1. Register capsule with ID 1
2. Update yield to 50 ETH
3. Verify the capsule
4. Claim yield → should mint GTT tokens
5. Check GTT balance increase
```

**Scenario 2: Yield Calculation**
```
1. Register capsule with ID 2
2. Set yield to 100 ETH (premium tier)
3. Claim yield → should get 1.5x multiplier
4. Verify GTT amount matches calculation
```

**Scenario 3: Error Handling**
```
1. Try to claim yield for non-existent capsule
2. Try to mint GTT directly (should fail)
3. Try to update yield without permissions
4. Verify error messages are user-friendly
```

### 4. Expected Results

**Successful Operations:**
- Transactions show "Transaction submitted" toast
- MetaMask prompts for confirmation
- Balance updates after confirmation
- Contract state changes are reflected

**Error Scenarios:**
- Clear error messages in toast notifications
- Failed transactions don't break the UI
- Proper fallback for unsupported networks

### 5. Contract Addresses (Local)

```
GTT Token: 0x5FbDB2315678afecb367f032d93F642f64180aa3
TruthVault: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Network: Hardhat Local (31337)
```

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] Contract addresses resolve correctly
- [ ] GTT token info displays properly
- [ ] Capsule registration works
- [ ] Yield updates succeed
- [ ] Yield claiming mints GTT
- [ ] Balance updates in real-time
- [ ] Error handling works properly
- [ ] Transaction confirmations work
- [ ] Network switching detection works

## Advanced Testing

### Test with Multiple Accounts
1. Import multiple Hardhat accounts
2. Test capsule ownership restrictions
3. Verify only creators can claim yield
4. Test governance voting with different accounts

### Test Edge Cases
1. Zero yield amounts
2. Maximum yield amounts
3. Rapid successive transactions
4. Network disconnection scenarios

### Performance Testing
1. Multiple concurrent transactions
2. Large yield amounts
3. Many capsules registered
4. Contract state persistence

## Troubleshooting

**Common Issues:**
- **"Please switch to supported network"**: Connect to Hardhat local (31337)
- **"Transaction failed"**: Check if you have enough ETH for gas
- **"Contract not found"**: Verify contract addresses in constants.ts
- **"Insufficient funds"**: Use test account with ETH balance

**Debug Tips:**
- Check browser console for detailed errors
- Verify MetaMask is connected to correct network
- Ensure contracts are deployed (check /web3-demo status)
- Test with small amounts first

## Success Criteria

✅ All basic contract functions work
✅ Error handling is user-friendly
✅ UI updates reflect contract state
✅ Transaction flow is intuitive
✅ Network switching works properly
✅ Multiple account testing passes
✅ Edge cases handled gracefully

## Next Steps After Testing

1. Fix any discovered issues
2. Optimize gas usage
3. Add more comprehensive error handling
4. Implement transaction confirmations
5. Add loading states for better UX
6. Deploy to testnet for broader testing