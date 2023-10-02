import { describe, expect, it } from "vitest";
import { actions, createSigner } from "../../../src";

const GUILD_ID = 1984;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

describe("Access check action", () => {
  it("can start a flow", async () => {
    const result = await actions.accessCheck.start(
      GUILD_ID,
      TEST_WALLET_SIGNER
    );
    expect(result.jobId).toBeTruthy();
  });

  it("can poll flow state", async () => {
    const job = await actions.accessCheck.poll(GUILD_ID, TEST_WALLET_SIGNER);
    expect(job?.guildId).toEqual(GUILD_ID);
  });

  it("can await flow state", async () => {
    const job = await actions.accessCheck.await(
      GUILD_ID,
      TEST_WALLET_SIGNER
      // console.log
    );
    expect(job?.guildId).toEqual(GUILD_ID);
  });
});
