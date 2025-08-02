// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
  function transfer(address to, uint256 amount) external returns (bool);
  function balanceOf(address account) external view returns (uint256);
}

contract GTTYieldVault {
  address public admin;
  address public GTTToken;
  
  // Track user claim history to prevent abuse
  mapping(address => mapping(uint256 => uint256)) public lastClaimTime;
  uint256 public constant CLAIM_COOLDOWN = 24 hours;

  event YieldDistributed(address indexed author, uint256 amount, uint256 griefTier);
  event AdminUpdated(address indexed oldAdmin, address indexed newAdmin);
  event EmergencyWithdraw(address indexed token, uint256 amount);

  constructor(address _GTTToken) {
    admin = msg.sender;
    GTTToken = _GTTToken;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, "Not authorized");
    _;
  }

  modifier validGriefTier(uint256 griefTier) {
    require(griefTier > 0 && griefTier <= 5, "Invalid grief tier (1-5)");
    _;
  }

  function distributeYield(address author, uint256 griefTier) external onlyAdmin validGriefTier(griefTier) {
    uint256 yieldAmount = griefTier * 10 * 1e18; // 10 GTT per tier
    require(IERC20(GTTToken).balanceOf(address(this)) >= yieldAmount, "Insufficient vault balance");
    
    bool sent = IERC20(GTTToken).transfer(author, yieldAmount);
    require(sent, "Transfer failed");
    
    emit YieldDistributed(author, yieldAmount, griefTier);
  }

  function claimYield(uint256 griefTier) external validGriefTier(griefTier) {
    require(
      block.timestamp >= lastClaimTime[msg.sender][griefTier] + CLAIM_COOLDOWN,
      "Claim cooldown not met"
    );
    
    uint256 yieldAmount = griefTier * 10 * 1e18; // 10 GTT per tier
    require(IERC20(GTTToken).balanceOf(address(this)) >= yieldAmount, "Insufficient vault balance");
    
    lastClaimTime[msg.sender][griefTier] = block.timestamp;
    
    bool sent = IERC20(GTTToken).transfer(msg.sender, yieldAmount);
    require(sent, "Transfer failed");
    
    emit YieldDistributed(msg.sender, yieldAmount, griefTier);
  }

  function updateAdmin(address newAdmin) external onlyAdmin {
    require(newAdmin != address(0), "Invalid admin address");
    address oldAdmin = admin;
    admin = newAdmin;
    emit AdminUpdated(oldAdmin, newAdmin);
  }

  // Emergency function to withdraw tokens if needed
  function emergencyWithdraw(address token, uint256 amount) external onlyAdmin {
    bool sent = IERC20(token).transfer(admin, amount);
    require(sent, "Emergency withdraw failed");
    emit EmergencyWithdraw(token, amount);
  }

  // View function to check vault balance
  function getVaultBalance() external view returns (uint256) {
    return IERC20(GTTToken).balanceOf(address(this));
  }

  // View function to check user's next claim time
  function getNextClaimTime(address user, uint256 griefTier) external view returns (uint256) {
    return lastClaimTime[user][griefTier] + CLAIM_COOLDOWN;
  }

  // View function to check if user can claim
  function canClaim(address user, uint256 griefTier) external view returns (bool) {
    return block.timestamp >= lastClaimTime[user][griefTier] + CLAIM_COOLDOWN;
  }
}