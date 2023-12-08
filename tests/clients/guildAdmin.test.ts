import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { GuildAPICallFailed, createGuildClient, createSigner } from "../../src";

const client = createGuildClient("vitest");

const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);
const GUILD_ID = "sdk-test-guild-62011a";
const adminAddress = Wallet.createRandom().address.toLowerCase();

describe("Guild admins", () => {
  it("get all", async () => {
    const admins = await client.guild.admin.getAll(1985);
    expect(admins.length).toBeGreaterThan(0);
  });

  it("get", async () => {
    const admin = await client.guild.admin.get(1985, 45);
    expect(admin).toMatchObject({ userId: 45 });
  });

  let adminUserId: number;

  it("create", async () => {
    const newAdmin = await client.guild.admin.create(
      GUILD_ID,
      {
        address: adminAddress,
        isOwner: false,
      },
      TEST_WALLET_SIGNER
    );

    adminUserId = newAdmin.userId;

    expect(newAdmin).toMatchObject({ isOwner: false });
  });

  it("get created admin", async () => {
    const admin = await client.guild.admin.get(GUILD_ID, adminUserId);
    expect(admin).toMatchObject({ userId: adminUserId, isOwner: false });
  });

  it("delete", async () => {
    await client.guild.admin.delete(
      GUILD_ID,
      adminUserId,

      TEST_WALLET_SIGNER
    );
  });

  it("can't get created admin", async () => {
    try {
      await client.guild.admin.get(GUILD_ID, adminUserId);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
