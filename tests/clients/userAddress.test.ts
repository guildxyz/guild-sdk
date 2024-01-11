import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { createSigner } from "../../src/utils";
import { CLIENT, TEST_ADDRESS, TEST_SIGNER } from "../common";

const NEW_WALLET = new Wallet(randomBytes(32).toString("hex"));
const NEW_ADDRESS = NEW_WALLET.address.toLowerCase();
const NEW_SIGNER = createSigner.fromEthersWallet(NEW_WALLET);

describe("userAddress client", () => {
  it("Can create userAddress", async () => {
    const created = await CLIENT.user.address.create(
      TEST_ADDRESS,
      NEW_SIGNER,
      TEST_SIGNER
    );

    expect(created).toMatchObject({
      address: NEW_ADDRESS,
      isPrimary: false,
    });
  });

  it("Can get linked address", async () => {
    const address = await CLIENT.user.address.get(
      TEST_ADDRESS,
      NEW_ADDRESS,
      TEST_SIGNER
    );

    expect(address.address).toEqual(NEW_ADDRESS);
  });

  it("Can get linked addresses", async () => {
    const addresses = await CLIENT.user.address.getAll(
      TEST_ADDRESS,
      TEST_SIGNER
    );

    expect(addresses.length).toEqual(2);
  });

  it("Can delete userAddress", async () => {
    await CLIENT.user.address.delete(TEST_ADDRESS, NEW_ADDRESS, TEST_SIGNER);
  });
});
