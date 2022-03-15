import { ethers } from "ethers";
import clinet from "../src/clinet";

const testWallet = ethers.Wallet.fromMnemonic(process.env.TEST_WALLET_MNEMONIC);

describe("Check client sdk function", () => {
  test("/user/membership/:address - interacted with guild", async () => {
    const membership = await clinet.user.getMemberships(testWallet.address);
    expect(
      membership.some((x) => x.guildId === 1985 && x.roleids.includes(1904))
    ).toBe(true);
  });

  test("/user/membership/:address - hasn't interacted with guild", async () => {
    const membership = await clinet.user.getMemberships(
      "0x0000000000000000000000000000000000000000"
    );
    expect(membership).toStrictEqual([]);
  });

  test("/user/join", async () => {
    const joinResponse = await clinet.user.join(testWallet, 2158);
    expect(joinResponse.alreadyJoined).toBe(false);
    expect(joinResponse.inviteLink).toMatch(/^https:\/\/discord.gg\/.+$/);
  });
});
