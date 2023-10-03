import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { user } from "../../src/client";
import { createSigner } from "../../src/utils";

const TEST_WALLET_ADDRESS = new Wallet(process.env.PRIVATE_KEY!).address;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

const WALLET_OF_CREATED_USER = new Wallet(randomBytes(32).toString("hex"));
const SIGNER_OF_CREATED_USER = createSigner.fromEthersWallet(
  WALLET_OF_CREATED_USER
);

describe.concurrent("User client", () => {
  it("Can fetch user", async () => {
    const fetchedUser = await user.get(TEST_WALLET_ADDRESS);

    expect(fetchedUser.id).toBeGreaterThan(0);
  });

  it("Can fetch user public user profile", async () => {
    const fetchedUserProfile = await user.getProfile(TEST_WALLET_ADDRESS);

    expect(fetchedUserProfile.id).toBeGreaterThan(0);
    expect("publicKey" in fetchedUserProfile).toBeTruthy();
  });

  it("Can fetch user private user profile", async () => {
    const fetchedUserProfile = await user.getProfile(
      TEST_WALLET_ADDRESS,
      TEST_WALLET_SIGNER
    );

    expect(fetchedUserProfile.id).toBeGreaterThan(0);
    expect(fetchedUserProfile.addresses).toHaveLength(1);
    expect("publicKey" in fetchedUserProfile).toBeTruthy();
  });

  it("Can fetch memberships", async () => {
    const memberships = await user.getMemberships(TEST_WALLET_ADDRESS);
    expect(memberships.length).toBeGreaterThan(0);
  });

  describe("user crete - delete", () => {
    it("can create a user", async () => {
      const profile = await user.getProfile(
        WALLET_OF_CREATED_USER.address,
        SIGNER_OF_CREATED_USER
      );
      expect(profile.addresses.length).toBeGreaterThan(0);
    });

    it("can delete user", async () => {
      await user.delete(WALLET_OF_CREATED_USER.address, SIGNER_OF_CREATED_USER);
    });
  });
});
