import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { createGuildClient } from "../../src";
import { createSigner } from "../../src/utils";

const TEST_WALLET_ADDRESS = new Wallet(process.env.PRIVATE_KEY!).address;
const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);

const { user } = createGuildClient("vitest");

describe.skip.concurrent("platformUser client", () => {
  it("can get a platformUser", async () => {
    const result = await user.platform.get(
      TEST_WALLET_ADDRESS,
      2,
      TEST_WALLET_SIGNER
    );

    expect(result).toMatchObject({ platformId: 2 });
  });

  it("can get all platformUsers of user", async () => {
    const results = await user.platform.getAll(
      TEST_WALLET_ADDRESS,
      TEST_WALLET_SIGNER
    );

    expect(results).toMatchObject([{ platformId: 2 }]);
  });
});
