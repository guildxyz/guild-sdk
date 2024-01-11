import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { createGuildClient, createSigner } from "../../../src";

const GUILD_ID = 1984;
const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);

const { guild } = createGuildClient("vitest");

describe.skip("Access check action", () => {
  it("can check access", async () => {
    // const onPoll = vi.fn();

    const result = await guild.accessCheck(
      GUILD_ID,
      TEST_WALLET_SIGNER
      //   {
      //   onPoll,
      // }
    );

    // expect(result!.done).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    // expect(onPoll).toHaveBeenCalled();
  });
});
