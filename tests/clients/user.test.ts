import { webcrypto } from "crypto";
import { Wallet } from "ethers";
import { assert, describe, expect, it } from "vitest";
import { user } from "../../src/client";
import { GuildAPICallFailed } from "../../src/error";
import { createSigner } from "../../src/utils";

const TEST_WALLET_ADDRESS = new Wallet(process.env.PRIVATE_KEY!).address;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

const getKeys = () =>
  webcrypto.subtle
    .generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, [
      "sign",
      "verify",
    ])
    .then(async (keyPair) => ({
      keyPair,
      pubKey: await webcrypto.subtle
        .exportKey("raw", keyPair.publicKey)
        .then((buf) => Buffer.from(buf).toString("hex")),
    }));

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

  describe.only("Key verification flow", async () => {
    const {
      pubKey,
      keyPair: { privateKey },
    } = await getKeys();

    it("Can register a new key", async () => {
      const userProfile = await user.verifyKey(
        TEST_WALLET_ADDRESS,
        { pubKey },
        TEST_WALLET_SIGNER
      );

      expect(userProfile).toBeTruthy();
      expect(userProfile.publicKey).toEqual(pubKey);
    });

    it("User profile returns new key", async () => {
      const userProfile = await user.getProfile(TEST_WALLET_ADDRESS);

      expect(userProfile).toBeTruthy();
      expect(userProfile.publicKey).toEqual(pubKey);
    });

    it("Can sign with verified key", async () => {
      const keySigner = createSigner.fromWebcryptoEdcsaPrivateKey(
        privateKey,
        TEST_WALLET_ADDRESS
      );

      const userProfile = await user.getProfile(TEST_WALLET_ADDRESS, keySigner);

      expect(userProfile.addresses).toHaveLength(1);
    });

    it("Can revoke key", async () => {
      await user.revokeKey(TEST_WALLET_ADDRESS, TEST_WALLET_SIGNER);
    });

    it("Can sign with verified key", async () => {
      const keySigner = createSigner.fromWebcryptoEdcsaPrivateKey(
        privateKey,
        TEST_WALLET_ADDRESS
      );

      try {
        await user.getProfile(TEST_WALLET_ADDRESS, keySigner);
        assert(false);
      } catch (error) {
        expect(error).toBeInstanceOf(GuildAPICallFailed);
        expect(error.statusCode).toEqual(401);
      }
    });
  });
});
