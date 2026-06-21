// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title ORBIT Staking
/// @notice Stake $ORB and accrue linear rewards from a funded reward pool.
contract Staking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    /// @notice Reward rate in basis points (per year) — e.g. 1200 = 12% APR.
    uint256 public aprBps = 1200;
    uint256 public constant YEAR = 365 days;

    struct Stake {
        uint256 amount;
        uint256 rewardDebt;   // accrued-but-unclaimed snapshot
        uint256 lastUpdate;   // timestamp of last accrual
    }

    mapping(address => Stake) public stakes;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 reward);
    event AprUpdated(uint256 aprBps);

    constructor(address tokenAddr, address initialOwner) Ownable(initialOwner) {
        token = IERC20(tokenAddr);
    }

    function _pending(address user) internal view returns (uint256) {
        Stake memory s = stakes[user];
        if (s.amount == 0) return s.rewardDebt;
        uint256 elapsed = block.timestamp - s.lastUpdate;
        uint256 accrued = (s.amount * aprBps * elapsed) / (10_000 * YEAR);
        return s.rewardDebt + accrued;
    }

    /// @notice View total claimable rewards for a user right now.
    function pendingRewards(address user) external view returns (uint256) {
        return _pending(user);
    }

    function _update(address user) internal {
        stakes[user].rewardDebt = _pending(user);
        stakes[user].lastUpdate = block.timestamp;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "amount=0");
        _update(msg.sender);
        stakes[msg.sender].amount += amount;
        totalStaked += amount;
        token.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        Stake storage s = stakes[msg.sender];
        require(amount > 0 && amount <= s.amount, "bad amount");
        _update(msg.sender);
        s.amount -= amount;
        totalStaked -= amount;
        token.safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function claim() external nonReentrant {
        _update(msg.sender);
        uint256 reward = stakes[msg.sender].rewardDebt;
        require(reward > 0, "no reward");
        stakes[msg.sender].rewardDebt = 0;
        token.safeTransfer(msg.sender, reward);
        emit Claimed(msg.sender, reward);
    }

    // --- admin ---
    function setApr(uint256 newAprBps) external onlyOwner {
        require(newAprBps <= 10_000, "apr too high");
        aprBps = newAprBps;
        emit AprUpdated(newAprBps);
    }

    /// @notice Owner funds the reward pool by sending tokens to this contract.
    function fund(uint256 amount) external onlyOwner {
        token.safeTransferFrom(msg.sender, address(this), amount);
    }
}
