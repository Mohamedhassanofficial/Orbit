// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title ORBIT Referral
/// @notice Binds a referee to a referrer once, and pays referral bonuses in $ORB.
contract Referral is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    /// @notice Bonus paid to a referrer, in basis points of the referred amount.
    uint256 public bonusBps = 1000; // 10%

    /// @notice Trusted backend signer allowed to push automated payouts. A
    /// scoped role (not the owner) so a leaked hot key has limited blast radius.
    address public distributor;

    mapping(address => address) public referrerOf;     // referee => referrer
    mapping(address => uint256) public referralCount;   // referrer => count
    mapping(address => uint256) public earned;          // referrer => total bonus

    event Referred(address indexed referrer, address indexed referee);
    event ReferralPaid(address indexed referrer, address indexed referee, uint256 amount);
    event RewardDistributed(address indexed referrer, address indexed referee, uint256 amount);
    event BonusUpdated(uint256 bonusBps);
    event DistributorUpdated(address distributor);

    modifier onlyDistributor() {
        require(msg.sender == distributor || msg.sender == owner(), "not distributor");
        _;
    }

    constructor(address tokenAddr, address initialOwner) Ownable(initialOwner) {
        token = IERC20(tokenAddr);
    }

    function setDistributor(address newDistributor) external onlyOwner {
        distributor = newDistributor;
        emit DistributorUpdated(newDistributor);
    }

    /// @notice Push an automated referral reward. The backend computes `amount`
    /// (10% of the referee's verified purchase) off-chain and calls this after the
    /// 30-hour delay. No on-chain referrer binding required (referrer submits the
    /// referee's address to the system, per spec).
    function distribute(address referrer, address referee, uint256 amount)
        external
        onlyDistributor
        nonReentrant
    {
        require(referrer != address(0), "bad referrer");
        require(amount > 0, "no amount");
        earned[referrer] += amount;
        token.safeTransfer(referrer, amount);
        emit RewardDistributed(referrer, referee, amount);
    }

    /// @notice Register the referrer that invited `msg.sender`. One-time, immutable.
    function setReferrer(address referrer) external {
        require(referrer != address(0) && referrer != msg.sender, "bad referrer");
        require(referrerOf[msg.sender] == address(0), "already set");
        referrerOf[msg.sender] = referrer;
        referralCount[referrer] += 1;
        emit Referred(referrer, msg.sender);
    }

    /// @notice Pay the bonus tied to a referee's action (called by owner/backend).
    /// @param referee The user whose action triggers the bonus.
    /// @param baseAmount The amount the bonus is computed from.
    function payBonus(address referee, uint256 baseAmount)
        external
        onlyOwner
        nonReentrant
    {
        address referrer = referrerOf[referee];
        require(referrer != address(0), "no referrer");
        uint256 bonus = (baseAmount * bonusBps) / 10_000;
        require(bonus > 0, "no bonus");
        earned[referrer] += bonus;
        token.safeTransfer(referrer, bonus);
        emit ReferralPaid(referrer, referee, bonus);
    }

    function setBonus(uint256 newBonusBps) external onlyOwner {
        require(newBonusBps <= 5_000, "bonus too high");
        bonusBps = newBonusBps;
        emit BonusUpdated(newBonusBps);
    }

    function fund(uint256 amount) external onlyOwner {
        token.safeTransferFrom(msg.sender, address(this), amount);
    }
}
