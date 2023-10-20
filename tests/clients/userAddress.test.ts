import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { setProjectName } from "../../src";
import userAddressClient from "../../src/clients/userAddress";
import { createSigner } from "../../src/utils";

setProjectName("vitest");

const TEST_WALLET_ADDRESS = new Wallet(process.env.PRIVATE_KEY!).address;
const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);

const ADDRESS_TO_LINK = new Wallet(
  process.env.PRIVATE_KEY_FOR_ADDRESS_LINK!
).address.toLowerCase();
const WALLET_TO_LINK_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY_FOR_ADDRESS_LINK!)
);

describe("userAddress client", () => {
  it("Can create userAddress", async () => {
    const created = await userAddressClient.create(
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
    const address = await userAddressClient.get(
      TEST_WALLET_ADDRESS,
      ADDRESS_TO_LINK,
      TEST_WALLET_SIGNER
    );

    expect(address.address).toEqual(ADDRESS_TO_LINK);
  });

  it("Can get linked addresses", async () => {
    const addresses = await userAddressClient.getAll(
      TEST_WALLET_ADDRESS,
      TEST_WALLET_SIGNER
    );

    expect(addresses.length).toEqual(2);
  });

  it("Can delete userAddress", async () => {
    await userAddressClient.delete(
      TEST_WALLET_ADDRESS,
      ADDRESS_TO_LINK,
      TEST_WALLET_SIGNER
    );
  });
});
