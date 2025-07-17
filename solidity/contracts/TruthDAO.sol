// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGTTToken {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract TruthDAO {
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        uint256 createdAt;
    }

    IGTTToken public gttToken;
    uint256 public proposalCount;
    uint256 public votingDuration = 3 days;
    uint256 public minProposalBalance = 1000 * 10**18; // 1000 GTT to create proposal

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public voteWeight;

    event ProposalCreated(uint256 indexed id, address indexed proposer, string title, string description);
    event Voted(uint256 indexed id, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id, bool passed);

    constructor(address _gttToken) {
        gttToken = IGTTToken(_gttToken);
    }

    function createProposal(string memory _title, string memory _description) external {
        require(gttToken.balanceOf(msg.sender) >= minProposalBalance, "Insufficient GTT balance");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            title: _title,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + votingDuration,
            executed: false,
            createdAt: block.timestamp
        });

        emit ProposalCreated(proposalCount, msg.sender, _title, _description);
    }

    function vote(uint256 _id, bool _support) external {
        Proposal storage p = proposals[_id];
        require(_id > 0 && _id <= proposalCount, "Invalid proposal ID");
        require(block.timestamp < p.deadline, "Voting period ended");
        require(!hasVoted[_id][msg.sender], "Already voted");

        uint256 weight = gttToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        if (_support) {
            p.votesFor += weight;
        } else {
            p.votesAgainst += weight;
        }

        hasVoted[_id][msg.sender] = true;
        voteWeight[_id][msg.sender] = weight;

        emit Voted(_id, msg.sender, _support, weight);
    }

    function executeProposal(uint256 _id) external {
        Proposal storage p = proposals[_id];
        require(_id > 0 && _id <= proposalCount, "Invalid proposal ID");
        require(block.timestamp >= p.deadline, "Voting period not ended");
        require(!p.executed, "Already executed");

        p.executed = true;
        bool passed = p.votesFor > p.votesAgainst;

        emit ProposalExecuted(_id, passed);
    }

    function getProposal(uint256 _id) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 deadline,
        bool executed,
        uint256 createdAt
    ) {
        Proposal storage p = proposals[_id];
        return (
            p.id,
            p.proposer,
            p.title,
            p.description,
            p.votesFor,
            p.votesAgainst,
            p.deadline,
            p.executed,
            p.createdAt
        );
    }

    function getProposalStatus(uint256 _id) external view returns (
        bool active,
        bool passed,
        uint256 totalVotes,
        uint256 timeRemaining
    ) {
        Proposal storage p = proposals[_id];
        active = block.timestamp < p.deadline && !p.executed;
        passed = p.votesFor > p.votesAgainst;
        totalVotes = p.votesFor + p.votesAgainst;
        timeRemaining = active ? p.deadline - block.timestamp : 0;
        
        return (active, passed, totalVotes, timeRemaining);
    }

    function hasUserVoted(uint256 _id, address _user) external view returns (bool) {
        return hasVoted[_id][_user];
    }

    function getUserVoteWeight(uint256 _id, address _user) external view returns (uint256) {
        return voteWeight[_id][_user];
    }
}