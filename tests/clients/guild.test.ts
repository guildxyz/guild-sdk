import { assert, describe, expect, it } from "vitest";
import { GuildSDKValidationError } from "../../src/error";
import { CLIENT, TEST_SIGNER, TEST_USER } from "../common";
import { createTestGuild, pick } from "../utils";

const createdGuild = await createTestGuild();
const createdGuild2 = await createTestGuild();

describe("Guild client", () => {
  it("Can get a guild by id", async () => {
    const response = await CLIENT.guild.get(createdGuild.id);

    expect(response).toMatchObject(pick(createdGuild, ["id", "urlName"]));
  });

  it("Can get multiple guilds by ids", async () => {
    const response = await CLIENT.guild.getMany([
      createdGuild.id,
      createdGuild2.id,
    ]);

    expect(response).toMatchObject([
      pick(createdGuild, ["id", "urlName"]),
      pick(createdGuild2, ["id", "urlName"]),
    ]);
  });

  it("Can get guild members", async () => {
    const response = await CLIENT.guild.getMembers(createdGuild.id);

    expect(response).toHaveLength(1);
  });

  it("Can get user membership for guild", async () => {
    const response = await CLIENT.guild.getUserMemberships(
      createdGuild.id,
      TEST_USER.id
    );

    expect(response).toHaveLength(1);
  });

  it("Can update guild", async () => {
    try {
      await CLIENT.guild.update(createdGuild.id, {}, TEST_SIGNER);
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildSDKValidationError);
    }

    const updated = await CLIENT.guild.update(
      createdGuild.id,
      { description: "EDITED" },
      TEST_SIGNER
    );

    expect(updated.description).toMatchObject("EDITED");
  });

  it("Subsequent GET returns updated data", async () => {
    const fetchedGuild = await CLIENT.guild.get(createdGuild.id);
    expect(fetchedGuild.description).toEqual("EDITED");
  });
});
