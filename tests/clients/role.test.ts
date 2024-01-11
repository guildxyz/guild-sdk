import { assert, describe, expect, it } from "vitest";
import { GuildAPICallFailed } from "../../src/error";
import { CLIENT, TEST_SIGNER } from "../common";
import { createTestGuild } from "../utils";

const guild = await createTestGuild();

describe("role create - update - delete", () => {
  let createdRoleId: number;

  it("Can create role", async () => {
    const created = await CLIENT.guild.role.create(
      guild.id,
      { name: "SDK Role Creation test", requirements: [{ type: "FREE" }] },
      TEST_SIGNER
    );

    createdRoleId = created.id;
    expect(created).toMatchObject({
      name: "SDK Role Creation test",
      requirements: [{ type: "FREE" }],
    });
  });

  it("Can get created role", async () => {
    const role = await CLIENT.guild.role.get(guild.id, createdRoleId);
    expect(role.name).toEqual("SDK Role Creation test");
  });

  it("Can update role", async () => {
    const created = await CLIENT.guild.role.update(
      guild.id,
      createdRoleId,
      { description: "EDITED" },
      TEST_SIGNER
    );
    expect(created.description).toEqual("EDITED");
  });

  it("Returns edited role", async () => {
    const role = await CLIENT.guild.role.get(guild.id, createdRoleId);
    expect(role.description).toEqual("EDITED");
  });

  it("Can delete role", async () => {
    await CLIENT.guild.role.delete(guild.id, createdRoleId, TEST_SIGNER);
  });

  it("Doesn't return after delete", async () => {
    try {
      await CLIENT.guild.role.get(guild.id, createdRoleId);
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
