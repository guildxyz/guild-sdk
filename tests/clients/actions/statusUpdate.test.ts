import { describe, expect, it, vi } from "vitest";
import { createSigner, guild } from "../../../src";

const GUILD_ID = 54045;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

describe.skip("Status update action", () => {
  it("can update status", async () => {
    const onPoll = vi.fn();
    const result = await guild.statusUpdate(GUILD_ID, TEST_WALLET_SIGNER, {
      onPoll,
    });

    expect(result!.done).toBeTruthy();
    expect(onPoll).toHaveBeenCalled();
  });
});
