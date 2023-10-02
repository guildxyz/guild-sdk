import { describe, expect, it } from "vitest";
import { actions, createSigner } from "../../../src";

const GUILD_ID = 4486;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

describe("Join action", () => {
  it("can start a join flow", async () => {
    const result = await actions.join.start(GUILD_ID, TEST_WALLET_SIGNER);
    expect(result.jobId).toBeTruthy();
  });

  it("can poll flow state", async () => {
    const job = await actions.join.poll(GUILD_ID, TEST_WALLET_SIGNER);
    expect(job?.guildId).toEqual(GUILD_ID);
  });
});
