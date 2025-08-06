// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GTTDistributor
 * @dev Vesting contract for GTT founder tokens with 4-year vesting and 6-month cliff
 */
contract GTTDistributor is Ownable {
    IERC20 public gtt;
    address public beneficiary;
    uint256 public cliff;
    uint256 public start;
    uint256 public duration;
    uint256 public released;

    event TokensReleased(address beneficiary, uint256 amount);

    constructor(
        address _token,
        address _beneficiary,
        uint256 _start,
        uint256 _cliffDuration,
        uint256 _duration
    ) Ownable(_beneficiary) {
        require(_token != address(0), "Token address cannot be zero");
        require(_beneficiary != address(0), "Beneficiary cannot be zero");
        require(_duration > 0, "Duration must be positive");
        require(_cliffDuration <= _duration, "Cliff cannot exceed duration");

        gtt = IERC20(_token);
        beneficiary = _beneficiary;
        start = _start;
        cliff = _start + _cliffDuration;
        duration = _duration;
    }

    /**
     * @dev Calculate total vested amount based on current time
     */
    function vestedAmount() public view returns (uint256) {
        uint256 total = gtt.balanceOf(address(this)) + released;

        if (block.timestamp < cliff) return 0;
        if (block.timestamp >= start + duration) return total;

        return (total * (block.timestamp - start)) / duration;
    }

    /**
     * @dev Calculate releasable amount (vested - already released)
     */
    function releasable() public view returns (uint256) {
        return vestedAmount() - released;
    }

    /**
     * @dev Release vested tokens to beneficiary
     */
    function release() external {
        require(msg.sender == beneficiary, "Only beneficiary can release");
        uint256 amount = releasable();
        require(amount > 0, "Nothing to release");

        released += amount;
        gtt.transfer(beneficiary, amount);
        
        emit TokensReleased(beneficiary, amount);
    }

    /**
     * @dev Get vesting information
     */
    function getVestingInfo() external view returns (
        uint256 _start,
        uint256 _cliff,
        uint256 _duration,
        uint256 _released,
        uint256 _vested,
        uint256 _releasable
    ) {
        return (start, cliff, duration, released, vestedAmount(), releasable());
    }
}