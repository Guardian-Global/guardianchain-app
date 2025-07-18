// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TruthAuctionEngine is ReentrancyGuard, Ownable {
    struct Auction {
        address creator;
        string capsuleHash;
        uint256 reservePrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool isSealed;
        bool complete;
        bool cancelled;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingReturns;
    mapping(string => uint256) public capsuleToAuction; // Track capsule hash to auction ID
    
    uint256 public auctionCounter;
    uint256 public constant AUCTION_DURATION = 7 days;
    uint256 public platformFee = 250; // 2.5% in basis points
    
    event AuctionCreated(uint256 indexed id, string capsuleHash, uint256 reservePrice, uint256 endTime);
    event BidPlaced(uint256 indexed id, address bidder, uint256 amount);
    event AuctionSealed(uint256 indexed id, address winner, uint256 finalPrice);
    event AuctionCancelled(uint256 indexed id);
    event Withdrawn(address bidder, uint256 amount);
    event PlatformFeeUpdated(uint256 newFee);

    constructor() Ownable(msg.sender) {}

    function createAuction(string memory capsuleHash, uint256 reservePrice) external {
        require(bytes(capsuleHash).length > 0, "Invalid capsule hash");
        require(reservePrice > 0, "Reserve price must be > 0");
        require(capsuleToAuction[capsuleHash] == 0, "Capsule already auctioned");

        auctionCounter++;
        uint256 endTime = block.timestamp + AUCTION_DURATION;
        
        auctions[auctionCounter] = Auction({
            creator: msg.sender,
            capsuleHash: capsuleHash,
            reservePrice: reservePrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: endTime,
            isSealed: false,
            complete: false,
            cancelled: false
        });

        capsuleToAuction[capsuleHash] = auctionCounter;

        emit AuctionCreated(auctionCounter, capsuleHash, reservePrice, endTime);
    }

    function placeBid(uint256 id) external payable nonReentrant {
        Auction storage auction = auctions[id];
        require(auction.creator != address(0), "Auction doesn't exist");
        require(!auction.complete, "Auction complete");
        require(!auction.isSealed, "Auction sealed");
        require(!auction.cancelled, "Auction cancelled");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid, "Bid too low");
        require(msg.value >= auction.reservePrice, "Below reserve price");

        if (auction.highestBid > 0) {
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(id, msg.sender, msg.value);
    }

    function sealAuction(uint256 id) external nonReentrant {
        Auction storage auction = auctions[id];
        require(msg.sender == auction.creator, "Only creator can seal");
        require(!auction.isSealed, "Already sealed");
        require(!auction.cancelled, "Auction cancelled");
        require(auction.highestBid >= auction.reservePrice, "Reserve not met");
        require(block.timestamp >= auction.endTime || auction.highestBid > 0, "Auction still active");

        auction.isSealed = true;
        auction.complete = true;
        
        // Calculate platform fee
        uint256 fee = (auction.highestBid * platformFee) / 10000;
        uint256 creatorAmount = auction.highestBid - fee;
        
        // Transfer to creator and platform
        payable(auction.creator).transfer(creatorAmount);
        if (fee > 0) {
            payable(owner()).transfer(fee);
        }

        emit AuctionSealed(id, auction.highestBidder, auction.highestBid);
    }

    function cancelAuction(uint256 id) external {
        Auction storage auction = auctions[id];
        require(msg.sender == auction.creator, "Only creator can cancel");
        require(!auction.complete, "Auction complete");
        require(!auction.isSealed, "Auction sealed");
        require(auction.highestBid == 0, "Cannot cancel with bids");

        auction.cancelled = true;
        capsuleToAuction[auction.capsuleHash] = 0; // Free up capsule for new auction

        emit AuctionCancelled(id);
    }

    function withdraw() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        
        pendingReturns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    function getAuction(uint256 id) external view returns (Auction memory) {
        return auctions[id];
    }

    function getAuctionByCapsule(string memory capsuleHash) external view returns (uint256, Auction memory) {
        uint256 auctionId = capsuleToAuction[capsuleHash];
        return (auctionId, auctions[auctionId]);
    }

    function isAuctionActive(uint256 id) external view returns (bool) {
        Auction memory auction = auctions[id];
        return !auction.complete && !auction.isSealed && !auction.cancelled && block.timestamp < auction.endTime;
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}