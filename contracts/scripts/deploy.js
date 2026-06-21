// Deploy ORBIT contracts to BNB Smart Chain.
// Usage: npm run deploy:testnet  (or deploy:mainnet)
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const owner = deployer.address;
  console.log("Deployer / owner:", owner);

  // 1) Token
  const Token = await hre.ethers.getContractFactory("OrbitToken");
  const token = await Token.deploy(owner);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("OrbitToken:", tokenAddr);

  // 2) Staking
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(tokenAddr, owner);
  await staking.waitForDeployment();
  console.log("Staking:   ", await staking.getAddress());

  // 3) Referral — pays referrers 10% of their referral's purchase.
  const Referral = await hre.ethers.getContractFactory("Referral");
  const referral = await Referral.deploy(tokenAddr, owner);
  await referral.waitForDeployment();
  const referralAddr = await referral.getAddress();
  console.log("Referral:  ", referralAddr);

  // Authorize the backend distributor (the address of DISTRIBUTOR_PRIVATE_KEY in
  // backend/.env). It can call distribute() to push automated rewards after 30h.
  const distributor = process.env.DISTRIBUTOR_ADDRESS || owner;
  await (await referral.setDistributor(distributor)).wait();
  console.log("  distributor set to:", distributor);

  // 4) Presale — rate, window and hard cap, sized to the ~10M public float.
  //   rate 100,000 ORB/BNB × hardCap 100 BNB = 10,000,000 ORB max sold (= float).
  const rate = 100_000n;                       // 100,000 ORB per 1 BNB
  const now = Math.floor(Date.now() / 1000);
  const start = now + 60;                       // starts in 1 min
  const end = now + 30 * 24 * 60 * 60;          // 30-day sale
  const hardCap = hre.ethers.parseEther("100"); // 100 BNB → 10,000,000 ORB (10% float)
  const Presale = await hre.ethers.getContractFactory("Presale");
  const presale = await Presale.deploy(tokenAddr, owner, rate, start, end, hardCap);
  await presale.waitForDeployment();
  console.log("Presale:   ", await presale.getAddress());

  // Token economics (Zhang): 100,000,000 total — ~90M treasury / ~10M public float.
  // The owner now holds all 100M; fund Presale (≤10M for the public float),
  // Referral (reward pool) and Staking (reward pool) from the owner balance, e.g.:
  //   await token.transfer(presaleAddr,  parseUnits("10000000", 18))
  //   await token.transfer(referralAddr, parseUnits("1000000", 18))
  //   await token.transfer(stakingAddr,  parseUnits("1000000", 18))
  // The remaining ~88-90M stays in the treasury (owner) per the spec.

  console.log("\nDone. Copy these addresses into backend/.env and src/web3/config.js");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
