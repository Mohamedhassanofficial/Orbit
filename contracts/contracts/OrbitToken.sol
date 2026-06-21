// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ORBIT ($ORB) — BEP-20 token on BNB Smart Chain
/// @notice Fixed-cap utility token for the ORBIT staking + referral dApp.
contract OrbitToken is ERC20, Ownable {
    /// @dev Fixed supply: 100,000,000 ORB (18 decimals) — ~90M treasury / ~10M float.
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18;

    constructor(address initialOwner)
        ERC20("ORBIT", "ORB")
        Ownable(initialOwner)
    {
        // Mint the full supply to the owner, who distributes to the
        // presale / staking-rewards / referral contracts and treasury.
        _mint(initialOwner, MAX_SUPPLY);
    }
}
