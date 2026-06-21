const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ORBIT contracts", function () {
  let token, staking, referral, owner, alice, bob;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    token = await (await ethers.getContractFactory("OrbitToken")).deploy(owner.address);
    staking = await (await ethers.getContractFactory("Staking")).deploy(
      await token.getAddress(),
      owner.address
    );
    referral = await (await ethers.getContractFactory("Referral")).deploy(
      await token.getAddress(),
      owner.address
    );
  });

  it("mints the full supply to the owner", async () => {
    expect(await token.totalSupply()).to.equal(await token.balanceOf(owner.address));
  });

  it("lets a user stake and accrue rewards", async () => {
    const amount = ethers.parseEther("1000");
    await token.transfer(alice.address, amount);
    await token.connect(alice).approve(await staking.getAddress(), amount);
    await staking.connect(alice).stake(amount);

    const s = await staking.stakes(alice.address);
    expect(s.amount).to.equal(amount);

    // advance ~30 days and expect non-zero pending rewards
    await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    expect(await staking.pendingRewards(alice.address)).to.be.gt(0n);
  });

  it("binds a referrer once and rejects re-binding", async () => {
    await referral.connect(bob).setReferrer(alice.address);
    expect(await referral.referrerOf(bob.address)).to.equal(alice.address);
    await expect(referral.connect(bob).setReferrer(owner.address)).to.be.revertedWith(
      "already set"
    );
  });
});
