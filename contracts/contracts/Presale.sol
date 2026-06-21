// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title ORBIT Presale
/// @notice Sell $ORB for BNB at a fixed rate during a time window.
contract Presale is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    /// @notice ORB tokens (18 dec) per 1 BNB.
    uint256 public rate;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public hardCap;          // max BNB to raise
    uint256 public totalRaised;      // BNB raised so far

    mapping(address => uint256) public contributedBnb;
    mapping(address => uint256) public tokensOwed;

    event Contributed(address indexed buyer, uint256 bnbIn, uint256 tokensOut);
    event Claimed(address indexed buyer, uint256 amount);

    constructor(
        address tokenAddr,
        address initialOwner,
        uint256 _rate,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _hardCap
    ) Ownable(initialOwner) {
        require(_startTime < _endTime, "bad window");
        token = IERC20(tokenAddr);
        rate = _rate;
        startTime = _startTime;
        endTime = _endTime;
        hardCap = _hardCap;
    }

    function buy() public payable nonReentrant {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "closed");
        require(msg.value > 0, "no BNB");
        require(totalRaised + msg.value <= hardCap, "hard cap");

        uint256 tokensOut = (msg.value * rate);
        totalRaised += msg.value;
        contributedBnb[msg.sender] += msg.value;
        tokensOwed[msg.sender] += tokensOut;

        emit Contributed(msg.sender, msg.value, tokensOut);
    }

    receive() external payable {
        buy();
    }

    /// @notice Claim purchased tokens after the presale ends.
    function claim() external nonReentrant {
        require(block.timestamp > endTime, "not ended");
        uint256 amount = tokensOwed[msg.sender];
        require(amount > 0, "nothing to claim");
        tokensOwed[msg.sender] = 0;
        token.safeTransfer(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }

    // --- admin ---
    function withdrawBnb(address payable to) external onlyOwner {
        (bool ok, ) = to.call{value: address(this).balance}("");
        require(ok, "transfer failed");
    }

    /// @notice Recover unsold tokens after the sale.
    function withdrawUnsold(address to) external onlyOwner {
        require(block.timestamp > endTime, "not ended");
        token.safeTransfer(to, token.balanceOf(address(this)));
    }
}
