import { Guild } from "@guildxyz/types";
import { assert, describe, expect, it } from "vitest";
import { guild } from "../../src/client";
import { GuildSDKValidationError } from "../../src/error";
import { createSigner } from "../../src/utils";

// TODO Create test guilds for these instead of using data like our-guild

const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);

describe.concurrent("Guild client", () => {
  it("Can get a guild by id", async () => {
    const response = await guild.get(1985);

    expect(response).toMatchObject({
      urlName: "our-guild",
      name: "Our Guild",
    } satisfies Partial<Guild>);
  });

  it("Can get multiple guilds by ids", async () => {
    const response = await guild.getMany([1985, 20111]);

    expect(response).toMatchObject([
      {
        urlName: "our-guild",
        name: "Our Guild",
      } satisfies Partial<Guild>,
      {
        urlName: "buildonbase",
        name: "Base Guild",
      } satisfies Partial<Guild>,
    ]);
  });

  it("Can get multiple guilds with pagination", async () => {
    const [
      [firstGuild, , , , fifthGuild],
      [fifthGuildWithPagination],
      [firstGuildWithPagination],
    ] = await Promise.all([
      guild.search({ limit: 5, offset: 0 }),
      guild.search({
        limit: 1,
        offset: 4,
      }),
      guild.search({
        limit: 1,
        offset: 0,
      }),
    ]);

    expect(fifthGuildWithPagination.id).toEqual(fifthGuild.id);
    expect(firstGuildWithPagination.id).toEqual(firstGuild.id);
  });

  it("Can get guild members", async () => {
    const numberOfPublicRoles = 15; // TODO: Get from /guilds/1985/roles once client can do that

    const response = await guild.getMembers(1985);

    expect(response).toHaveLength(numberOfPublicRoles);
  });

  it("Can get guild member access", async () => {
    const numberOfPublicRoles = 15; // TODO: Get from /guilds/1985/roles once client can do that

    const response = await guild.getMemberAccess(1985, 2738981);

    expect(response).toHaveLength(numberOfPublicRoles);
  });

  describe("guild create - update - delete", () => {
    let createdGuildId: number;

    it("Can create guild", async () => {
      const response = await guild.create(
        {
          name: "SDK Test Guild",
          urlName: "sdk-test-guild",
          roles: [
            {
              name: "SDK Test Role",
              requirements: [{ type: "FREE" }],
            },
          ],
        },
        TEST_WALLET_SIGNER
      );

      createdGuildId = response.id;

      expect(response).toMatchObject({
        name: "SDK Test Guild",
        roles: [
          {
            name: "SDK Test Role",
            requirements: [{ type: "FREE" }],
          },
        ],
      });
      expect(response.urlName.startsWith("sdk-test-guild")).toBeTruthy();
    });

    it("Can update guild", async () => {
      try {
        await guild.update(createdGuildId, {}, TEST_WALLET_SIGNER);
        assert(false);
      } catch (error) {
        expect(error).toBeInstanceOf(GuildSDKValidationError);
      }

      const updated = await guild.update(
        createdGuildId,
        { description: "EDITED" },
        TEST_WALLET_SIGNER
      );

      expect(updated.description).toMatchObject("EDITED");
    });

    it("Subsequent GET returns updated data", async () => {
      const fetchedGuild = await guild.get(createdGuildId);
      expect(fetchedGuild.description).toEqual("EDITED");
    });

    it("Can delete guild", async () => {
      await guild.delete(createdGuildId, TEST_WALLET_SIGNER);
    });
  });
});
