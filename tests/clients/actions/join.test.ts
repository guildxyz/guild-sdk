import { Wallet } from "ethers";
import { describe, expectTypeOf, it } from "vitest";
import { createGuildClient, createSigner } from "../../../src";

const GUILD_ID = 4486;
const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);

const { guild } = createGuildClient("vitest");

describe.skip("Join action", () => {
  it("can join", async () => {
    // const onPoll = vi.fn();
    const result = await guild.join(
      GUILD_ID,
      TEST_WALLET_SIGNER
      //  { onPoll }
    );

    expectTypeOf(result.success).toBeBoolean();
    // expect(result!.done).toBeTruthy();
    // expect(onPoll).toHaveBeenCalled();
  });
});
