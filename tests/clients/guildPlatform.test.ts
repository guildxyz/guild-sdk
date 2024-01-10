import { GuildReward } from "@guildxyz/types";
import { describe } from "node:test";
import { assert, expect, it } from "vitest";
import { GuildAPICallFailed } from "../../src/error";
import { CLIENT, TEST_SIGNER } from "../common";
import { createTestGuild, omit } from "../utils";

const guildPlatformToCreate = {
  platformGuildId: "my-point-system",
  platformName: "POINTS",
  platformGuildData: { name: "xp" },
} as const;

const guildPlatformUpdate = {
  platformGuildData: { name: "coins" },
} as const;

let createdGuildPlatform: GuildReward;

const guild = await createTestGuild();

describe("guildPlatform client", () => {
  it("Can create guildPlatform", async () => {
    createdGuildPlatform = await CLIENT.guild.reward.create(
      guild.id,
      guildPlatformToCreate,
      TEST_SIGNER
    );

    expect(createdGuildPlatform).toMatchObject(
      omit(guildPlatformToCreate, ["platformName"])
    );
  });

  it("Can update guildPlatform", async () => {
    const updated = await CLIENT.guild.reward.update(
      guild.id,
      createdGuildPlatform.id,
      guildPlatformUpdate,
      TEST_SIGNER
    );

    expect(updated).toMatchObject({
      ...omit(guildPlatformToCreate, ["platformName"]),
      ...guildPlatformUpdate,
    });
  });

  it("Can fetch updated guildPlatform", async () => {
    const fetched = await CLIENT.guild.reward.get(
      guild.id,
      createdGuildPlatform.id,
      TEST_SIGNER
    );

    expect(fetched).toMatchObject({
      ...omit(guildPlatformToCreate, ["platformName"]),
      ...guildPlatformUpdate,
    });
  });

  it("Can fetch updated guildPlatform by guildId", async () => {
    const fetched = await CLIENT.guild.reward.getAll(guild.id, TEST_SIGNER);

    expect(
      fetched.some(
        ({ platformGuildData }) =>
          platformGuildData.name === guildPlatformUpdate.platformGuildData.name
      )
    ).toBeTruthy();
  });

  it("Can delete guildPlatform", async () => {
    await CLIENT.guild.reward.delete(
      guild.id,
      createdGuildPlatform.id,
      TEST_SIGNER
    );
  });

  it("Returns 404 after delete", async () => {
    try {
      await CLIENT.guild.reward.get(
        guild.id,
        createdGuildPlatform.id,
        TEST_SIGNER
      );
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
