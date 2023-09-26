import { assert, describe, expect, it } from "vitest";
import { guild } from "../../src/client";
import { GuildAPICallFailed } from "../../src/error";
import { createSigner } from "../../src/utils";

const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);
const GUILD_ID = "sdk-test-guild-62011a";

describe.concurrent("Role client", () => {
  it("Can get role", async () => {
    const role = await guild.role.get(GUILD_ID, 88123);
    expect(role.name).toEqual("SDK Test Role");
  });

  it("Can get roles of guild", async () => {
    const roles = await guild.role.getAll(GUILD_ID);

    expect(roles).toMatchObject([{ name: "SDK Test Role" }]);
  });

  describe("role create - update - delete", () => {
    let createdRoleId: number;

    it("Can create role", async () => {
      const created = await guild.role.create(
        GUILD_ID,
        { name: "SDK Role Creation test", requirements: [{ type: "FREE" }] },
        TEST_WALLET_SIGNER
      );

      createdRoleId = created.id;
      expect(created).toMatchObject({
        name: "SDK Role Creation test",
        requirements: [{ type: "FREE" }],
      });
    });

    it("Can update role", async () => {
      const created = await guild.role.update(
        GUILD_ID,
        createdRoleId,
        { description: "EDITED" },
        TEST_WALLET_SIGNER
      );
      expect(created.description).toEqual("EDITED");
    });

    it("Returns edited role", async () => {
      const role = await guild.role.get(GUILD_ID, createdRoleId);
      expect(role.description).toEqual("EDITED");
    });

    it("Can delete role", async () => {
      await guild.role.delete(GUILD_ID, createdRoleId, TEST_WALLET_SIGNER);
    });

    it("Doesn't return after delete", async () => {
      try {
        await guild.role.get(GUILD_ID, createdRoleId);
        assert(false);
      } catch (error) {
        expect(error).toBeInstanceOf(GuildAPICallFailed);
        expect(error.statusCode).toEqual(404);
      }
    });
  });
});
