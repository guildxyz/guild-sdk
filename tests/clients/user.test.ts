import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { assert, describe, expect, it } from "vitest";
import { GuildAPICallFailed } from "../../src";
import { createSigner } from "../../src/utils";
import { CLIENT } from "../common";

const NEW_WALLET = new Wallet(randomBytes(32).toString("hex"));
const NEW_ADDRESS = NEW_WALLET.address.toLowerCase();
const NEW_SIGNER = createSigner.fromEthersWallet(NEW_WALLET);

describe("User client", () => {
  it("user initially doesn't exist", async () => {
    try {
      await CLIENT.user.get(NEW_ADDRESS);
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect((error as GuildAPICallFailed).statusCode).toEqual(404);
    }
  });

  it("created user with a signed request", async () => {
    const profile = await CLIENT.user.getProfile(NEW_ADDRESS, NEW_SIGNER);

    expect(profile.addresses).toMatchObject([{ address: NEW_ADDRESS }]);
  });

  it("can fetch user", async () => {
    const fetchedUser = await CLIENT.user.get(NEW_ADDRESS);

    expect(fetchedUser.id).toBeGreaterThan(0);
  });

  it("can fetch user public user profile", async () => {
    const fetchedUserProfile = await CLIENT.user.getProfile(NEW_ADDRESS);

    expect(fetchedUserProfile.id).toBeGreaterThan(0);
  });

  it("Can fetch user private user profile", async () => {
    const fetchedUserProfile = await CLIENT.user.getProfile(
      NEW_ADDRESS,
      NEW_SIGNER
    );

    expect(fetchedUserProfile.id).toBeGreaterThan(0);
    expect(fetchedUserProfile.addresses).toMatchObject([
      { address: NEW_ADDRESS },
    ]);
  });

  it("Can fetch memberships", async () => {
    const memberships = await CLIENT.user.getMemberships(NEW_ADDRESS);
    expect(memberships.length).toBe(0);
  });

  it("can delete user", async () => {
    await CLIENT.user.delete(NEW_ADDRESS, NEW_SIGNER);
  });
});
