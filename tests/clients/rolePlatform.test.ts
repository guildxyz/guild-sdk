import { GuildReward, RoleReward } from "@guildxyz/types";
import { randomBytes } from "crypto";
import { assert, describe, expect, it } from "vitest";
import { GuildAPICallFailed } from "../../src/error";
import { CLIENT, TEST_SIGNER } from "../common";
import { createTestGuild } from "../utils";

const guild = await createTestGuild();

const guildPlatformToCreate = {
  platformGuildId: `my-point-system-${randomBytes(4).toString("hex")}`,
  platformName: "POINTS",
  platformGuildData: { name: "xp" },
} as const;

let createdGuildPlatform: GuildReward;
let createdRolePlatform: RoleReward;

describe("rolePlatform client", () => {
  it("Can create guildPlatform", async () => {
    createdGuildPlatform = await CLIENT.guild.reward.create(
      guild.id,
      guildPlatformToCreate,
      TEST_SIGNER
    );

    expect(createdGuildPlatform.platformGuildId).toEqual(
      guildPlatformToCreate.platformGuildId
    );
  });

  it("Can create rolePlatform", async () => {
    createdRolePlatform = await CLIENT.guild.role.reward.create(
      guild.id,
      guild.roles[0].id,
      {
        guildPlatformId: createdGuildPlatform.id,
        platformRoleData: { score: "5" },
      },
      TEST_SIGNER
    );

    expect(createdRolePlatform).toMatchObject({
      guildPlatformId: createdGuildPlatform.id,
      platformRoleData: { score: "5" },
    });
  });

  it("Can update rolePlatform", async () => {
    const updated = await CLIENT.guild.role.reward.update(
      guild.id,
      guild.roles[0].id,
      createdRolePlatform.id,
      { platformRoleData: { score: "15" } },
      TEST_SIGNER
    );

    expect(updated.platformRoleData!.score).toEqual("15");
  });

  it("Returns updated data", async () => {
    const created = await CLIENT.guild.role.reward.get(
      guild.id,
      guild.roles[0].id,
      createdRolePlatform.id
    );

    expect(created.platformRoleData!.score).toEqual("15");
  });

  it("Returns updated data by role", async () => {
    const created = await CLIENT.guild.role.reward.getAll(
      guild.id,
      guild.roles[0].id
    );

    expect(created).toMatchObject([{ platformRoleData: { score: "15" } }]);
  });

  it("Can delete rolePlatform", async () => {
    await CLIENT.guild.role.reward.delete(
      guild.id,
      guild.roles[0].id,
      createdRolePlatform.id,
      TEST_SIGNER
    );
  });

  it("404 after delete", async () => {
    try {
      await CLIENT.guild.role.reward.get(
        guild.id,
        guild.roles[0].id,
        createdRolePlatform.id
      );
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
