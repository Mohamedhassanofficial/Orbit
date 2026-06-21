// Minimal human-readable ABIs (ethers v6 accepts this format).
export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
];

export const STAKING_ABI = [
  "function stake(uint256 amount)",
  "function unstake(uint256 amount)",
  "function claim()",
  "function pendingRewards(address) view returns (uint256)",
  "function stakes(address) view returns (uint256 amount, uint256 rewardDebt, uint256 lastUpdate)",
  "function totalStaked() view returns (uint256)",
  "function aprBps() view returns (uint256)",
  "event Staked(address indexed user, uint256 amount)",
  "event Claimed(address indexed user, uint256 reward)",
];

export const REFERRAL_ABI = [
  "function setReferrer(address referrer)",
  "function referrerOf(address) view returns (address)",
  "function referralCount(address) view returns (uint256)",
  "function earned(address) view returns (uint256)",
  "function bonusBps() view returns (uint256)",
];

export const PRESALE_ABI = [
  "function buy() payable",
  "function claim()",
  "function rate() view returns (uint256)",
  "function tokensOwed(address) view returns (uint256)",
  "function totalRaised() view returns (uint256)",
  "function hardCap() view returns (uint256)",
];
