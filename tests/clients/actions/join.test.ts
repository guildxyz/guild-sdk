import { describe, expect, it, vi } from "vitest";
import { createSigner, guild } from "../../../src";

const GUILD_ID = 4486;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

describe("Join action", () => {
  it("can join", async () => {
    const onPoll = vi.fn();
    const result = await guild.join(GUILD_ID, TEST_WALLET_SIGNER, { onPoll });

    expect(result!.done).toBeTruthy();
    expect(onPoll).toHaveBeenCalled();
  });
});
