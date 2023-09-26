import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { user } from "../../src/client";
import { createSigner } from "../../src/utils";

const TEST_WALLET_ADDRESS = new Wallet(process.env.PRIVATE_KEY!).address;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

const ADDRESS_TO_LINK = new Wallet(
  process.env.PRIVATE_KEY_FOR_ADDRESS_LINK!
).address.toLowerCase();
const WALLET_TO_LINK_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY_FOR_ADDRESS_LINK!
);

describe("userAddress client", () => {
  it("Can create userAddress", async () => {
    const created = await user.address.create(
      TEST_WALLET_ADDRESS,
      WALLET_TO_LINK_SIGNER,
      TEST_WALLET_SIGNER
    );

    expect(created).toMatchObject({
      address: ADDRESS_TO_LINK,
      isPrimary: false,
    });
  });

  it("Can get linked address", async () => {
    const address = await user.address.get(
      TEST_WALLET_ADDRESS,
      ADDRESS_TO_LINK,
      TEST_WALLET_SIGNER
    );

    expect(address.address).toEqual(ADDRESS_TO_LINK);
  });

  it("Can get linked addresses", async () => {
    const addresses = await user.address.getAll(
      TEST_WALLET_ADDRESS,
      TEST_WALLET_SIGNER
    );

    expect(addresses.length).toEqual(2);
  });

  it("Can delete userAddress", async () => {
    await user.address.delete(
      TEST_WALLET_ADDRESS,
      ADDRESS_TO_LINK,
      TEST_WALLET_SIGNER
    );
  });
});
