import { afterAll, assert, beforeAll, describe, expect, it } from "vitest";
import { createGuildClient } from "../../src";
import { GuildAPICallFailed } from "../../src/error";
import { createSigner } from "../../src/utils";

const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);
const GUILD_ID = "sdk-test-guild-62011a";
const ROLE_ID = 88123;

let guildPlatformId: number;
let createdRolePlatformId: number;

const { guild } = createGuildClient("vitest");

beforeAll(async () => {
  const created = await guild.reward.create(
    GUILD_ID,
    {
      platformGuildId: "FOR_ROLE_PLATFORM_TEST",
      platformName: "TELEGRAM",
    },
    TEST_WALLET_SIGNER
  );

  guildPlatformId = created.id;
});

afterAll(async () => {
  await guild.reward.delete(GUILD_ID, guildPlatformId, TEST_WALLET_SIGNER);
});

describe("rolePlatform client", () => {
  it("Can create rolePlatform", async () => {
    const created = await guild.role.reward.create(
      GUILD_ID,
      ROLE_ID,
      {
        guildPlatformId,
        visibility: "HIDDEN",
      },
      TEST_WALLET_SIGNER
    );

    createdRolePlatformId = created.id;

    expect(created.visibility).toEqual("HIDDEN");
  });

  it("Can update rolePlatform", async () => {
    const created = await guild.role.reward.update(
      GUILD_ID,
      ROLE_ID,
      createdRolePlatformId,
      {
        visibility: "PUBLIC",
      },
      TEST_WALLET_SIGNER
    );

    expect(created.visibility).toEqual("PUBLIC");
  });

  it("Returns updated data", async () => {
    const created = await guild.role.reward.get(
      GUILD_ID,
      ROLE_ID,
      createdRolePlatformId
    );

    expect(created.visibility).toEqual("PUBLIC");
  });

  it("Returns updated data by role", async () => {
    const created = await guild.role.reward.getAll(GUILD_ID, ROLE_ID);

    expect(created).toMatchObject([{ visibility: "PUBLIC" }]);
  });

  it("Can delete rolePlatform", async () => {
    await guild.role.reward.delete(
      GUILD_ID,
      ROLE_ID,
      createdRolePlatformId,
      TEST_WALLET_SIGNER
    );
  });

  it("404 after delete", async () => {
    try {
      await guild.role.reward.get(GUILD_ID, ROLE_ID, createdRolePlatformId);
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
