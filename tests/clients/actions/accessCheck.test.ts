import { describe, expect, it, vi } from "vitest";
import { createSigner, guild } from "../../../src";

const GUILD_ID = 1984;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

describe("Access check action", () => {
  it("can check access", async () => {
    const onPoll = vi.fn();

    const result = await guild.accessCheck(GUILD_ID, TEST_WALLET_SIGNER, {
      onPoll,
    });

    expect(result!.done).toBeTruthy();
    expect(onPoll).toHaveBeenCalled();
  });
});
