import { describe, expect, it, vi } from "vitest";
import { createGuildClient, createSigner } from "../../../src";

const GUILD_ID = 54045;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

const { guild } = createGuildClient("vitest");

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
