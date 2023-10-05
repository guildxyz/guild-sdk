import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { createGuildClient } from "../src";
import { createSigner } from "../src/utils";

const guildClient = createGuildClient("vitest");

const TEST_WALLET_ADDRESS = new Wallet(process.env.PRIVATE_KEY!).address;

describe("api key privileged request", () => {
  it("Can make a privileged request", async () => {
    const addresses = await guildClient.user.address.getAll(
      TEST_WALLET_ADDRESS,
      createSigner.apiKeySigner()
    );

    expect(addresses.length).toBeGreaterThan(0);
  });
});
