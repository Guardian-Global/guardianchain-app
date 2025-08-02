// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GTTYieldVault {
    address public admin;
    address public GTTToken; // ERC-20 token contract

    event YieldDistributed(address indexed author, uint256 amount, uint256 griefTier);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor(address _GTTToken) {
        admin = msg.sender;
        GTTToken = _GTTToken;
    }

    function distributeYield(address author, uint256 griefTier) external onlyAdmin {
        require(griefTier > 0 && griefTier <= 5, "Invalid tier");
        uint256 yieldAmount = griefTier * 10 * 1e18;

        bool sent = IERC20(GTTToken).transfer(author, yieldAmount);
        require(sent, "Transfer failed");

        emit YieldDistributed(author, yieldAmount, griefTier);
    }

    function updateAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}