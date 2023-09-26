import { describe } from "node:test";
import { assert, expect, it } from "vitest";
import { guild } from "../../src/client";
import { GuildAPICallFailed } from "../../src/error";
import { createSigner } from "../../src/utils";

const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);
const GUILD_ID = "sdk-test-guild-62011a";
const PLATFORM_GUILD_ID = "TEST_PLATFORM_GUILD_ID";

let createdGuildPlatformId: number;

describe("guildPlatform client", () => {
  it("Can create guildPlatform", async () => {
    const created = await guild.reward.create(
      GUILD_ID,
      {
        platformGuildId: PLATFORM_GUILD_ID,
        platformName: "TELEGRAM",
      },
      TEST_WALLET_SIGNER
    );

    createdGuildPlatformId = created.id;

    expect(created).toMatchObject({
      platformGuildId: PLATFORM_GUILD_ID,
    });
  });

  it("Can update guildPlatform", async () => {
    const updated = await guild.reward.update(
      GUILD_ID,
      createdGuildPlatformId,
      { platformGuildData: { invite: "testInvite" } },
      TEST_WALLET_SIGNER
    );

    expect(updated).toMatchObject({
      platformGuildId: PLATFORM_GUILD_ID,
      platformGuildData: { invite: "testInvite" },
    });
  });

  it("Can fetch updated guildPlatform", async () => {
    const fetched = await guild.reward.get(
      GUILD_ID,
      createdGuildPlatformId,
      TEST_WALLET_SIGNER
    );

    expect(fetched).toMatchObject({
      platformGuildId: PLATFORM_GUILD_ID,
      platformGuildData: { invite: "testInvite" },
    });
  });

  it("Can fetch updated guildPlatform by guildId", async () => {
    const fetched = await guild.reward.getAll(GUILD_ID, TEST_WALLET_SIGNER);

    expect(
      fetched.some(
        ({ platformGuildData }) => platformGuildData.invite === "testInvite"
      )
    ).toBeTruthy();
  });

  it("Can delete guildPlatform", async () => {
    await guild.reward.delete(
      GUILD_ID,
      createdGuildPlatformId,
      TEST_WALLET_SIGNER
    );
  });

  it("Returns 404 after delete", async () => {
    try {
      await guild.reward.get(
        GUILD_ID,
        createdGuildPlatformId,
        TEST_WALLET_SIGNER
      );
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
