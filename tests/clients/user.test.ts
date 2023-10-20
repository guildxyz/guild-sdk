import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { setProjectName } from "../../src";
import userClient from "../../src/clients/user";
import { createSigner } from "../../src/utils";

setProjectName("vitest");

const TEST_WALLET_ADDRESS = new Wallet(process.env.PRIVATE_KEY!).address;
const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);

const WALLET_OF_CREATED_USER = new Wallet(randomBytes(32).toString("hex"));
const SIGNER_OF_CREATED_USER = createSigner.fromEthersWallet(
  WALLET_OF_CREATED_USER
);

describe.concurrent("User client", () => {
  it("Can fetch user", async () => {
    const fetchedUser = await userClient.get(TEST_WALLET_ADDRESS);

    expect(fetchedUser.id).toBeGreaterThan(0);
  });

  it("Can fetch user public user profile", async () => {
    const fetchedUserProfile = await userClient.getProfile(TEST_WALLET_ADDRESS);

    expect(fetchedUserProfile.id).toBeGreaterThan(0);
    expect("publicKey" in fetchedUserProfile).toBeTruthy();
  });

  it("Can fetch user private user profile", async () => {
    const fetchedUserProfile = await userClient.getProfile(
      TEST_WALLET_ADDRESS,
      TEST_WALLET_SIGNER
    );

    expect(fetchedUserProfile.id).toBeGreaterThan(0);
    expect(fetchedUserProfile.addresses).toHaveLength(1);
    expect("publicKey" in fetchedUserProfile).toBeTruthy();
  });

  it("Can fetch memberships", async () => {
    const memberships = await userClient.getMemberships(TEST_WALLET_ADDRESS);
    expect(memberships.length).toBeGreaterThan(0);
  });

  describe("user crete - delete", () => {
    it("can create a user", async () => {
      const profile = await userClient.getProfile(
        WALLET_OF_CREATED_USER.address,
        SIGNER_OF_CREATED_USER
      );
      expect(profile.addresses.length).toBeGreaterThan(0);
    });

    it("can delete user", async () => {
      await userClient.delete(
        WALLET_OF_CREATED_USER.address,
        SIGNER_OF_CREATED_USER
      );
    });
  });
});
