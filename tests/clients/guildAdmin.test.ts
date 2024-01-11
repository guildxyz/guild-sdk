import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { GuildAPICallFailed } from "../../src";
import { CLIENT, TEST_SIGNER, TEST_USER } from "../common";
import { createTestGuild } from "../utils";

const adminAddress = Wallet.createRandom().address.toLowerCase();

const guild = await createTestGuild();

describe("Guild admins", () => {
  it("get all", async () => {
    const admins = await CLIENT.guild.admin.getAll(guild.id);
    expect(admins.length).toBeGreaterThan(0);
  });

  it("get", async () => {
    const admin = await CLIENT.guild.admin.get(guild.id, TEST_USER.id);
    expect(admin).toMatchObject({ userId: TEST_USER.id });
  });

  let adminUserId: number;

  it("create", async () => {
    const newAdmin = await CLIENT.guild.admin.create(
      guild.id,
      {
        address: adminAddress,
        isOwner: false,
      },
      TEST_SIGNER
    );

    adminUserId = newAdmin.userId;

    expect(newAdmin).toMatchObject({ isOwner: false });
  });

  it("get created admin", async () => {
    const admin = await CLIENT.guild.admin.get(guild.id, adminUserId);
    expect(admin).toMatchObject({ userId: adminUserId, isOwner: false });
  });

  it("delete", async () => {
    await CLIENT.guild.admin.delete(
      guild.id,
      adminUserId,

      TEST_SIGNER
    );
  });

  it("can't get created admin", async () => {
    try {
      await CLIENT.guild.admin.get(guild.id, adminUserId);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
