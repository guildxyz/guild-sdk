import { LeaderboardItem, RoleReward, UserPointsItem } from "@guildxyz/types";
import { Wallet } from "ethers";
import { describe, expect, test } from "vitest";
import { createGuildClient, createSigner } from "../src";

const TEST_WALLET = new Wallet(process.env.PRIVATE_KEY!);
const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(TEST_WALLET);
const TEST_USER_ID = 4069666;

// https://guild.xyz/guild-for-sdk-points-test
const TEST_GUILD_DATA = {
  urlName: "guild-for-sdk-points-test",
  guildId: 58167,
  roleId1: 98849,
  roleId2: 98850,
};

const { guild, user } = createGuildClient("vitest");

describe("points", () => {
  test("initially has no guildPlatform", async () => {
    const guildPlatforms = await guild.reward.getAll(
      TEST_GUILD_DATA.guildId,
      TEST_WALLET_SIGNER
    );

    expect(guildPlatforms).toHaveLength(0);
  });

  let createdRolePlatform: RoleReward;

  test("can create a points reward", async () => {
    createdRolePlatform = await guild.role.reward.create(
      TEST_GUILD_DATA.guildId,
      TEST_GUILD_DATA.roleId1,
      {
        guildPlatform: {
          platformGuildId: "my-points",
          platformName: "POINTS",
          platformGuildData: { name: "coins" },
        },
        platformRoleData: { score: 5 },
      },
      TEST_WALLET_SIGNER
    );

    expect(createdRolePlatform.platformRoleData).toEqual({ score: "5" });
  });

  test("can create a points reward for other role", async () => {
    createdRolePlatform = await guild.role.reward.create(
      TEST_GUILD_DATA.guildId,
      TEST_GUILD_DATA.roleId2,
      {
        guildPlatformId: createdRolePlatform.guildPlatformId,
        platformRoleData: { score: 10 },
      },
      TEST_WALLET_SIGNER
    );

    expect(createdRolePlatform.platformRoleData).toEqual({ score: "10" });
  });

  test("get leaderboard - not signed", async () => {
    const { leaderboard, aroundUser } = await guild.getLeaderboard(
      TEST_GUILD_DATA.guildId,
      createdRolePlatform.guildPlatformId
    );

    expect(leaderboard).toBeTruthy();
    expect(aroundUser).toBeFalsy();
    expect(leaderboard).toHaveLength(1);
    expect(leaderboard[0]).toMatchObject(<LeaderboardItem>{
      roleIds: [TEST_GUILD_DATA.roleId1, TEST_GUILD_DATA.roleId2],
      userId: TEST_USER_ID,
      totalPoints: 15,
      // rank: 1,
    });
  });

  test("get leaderboard - signed", async () => {
    const { leaderboard, aroundUser } = await guild.getLeaderboard(
      TEST_GUILD_DATA.guildId,
      createdRolePlatform.guildPlatformId,
      TEST_WALLET_SIGNER
    );

    expect(leaderboard).toBeTruthy();
    expect(aroundUser).toBeTruthy();
    expect(aroundUser).toHaveLength(1);
    expect(leaderboard).toHaveLength(1);
    expect(leaderboard[0]).toMatchObject(<LeaderboardItem>{
      roleIds: [TEST_GUILD_DATA.roleId1, TEST_GUILD_DATA.roleId2],
      userId: TEST_USER_ID,
      totalPoints: 15,
      // rank: 1,
    });
    expect(aroundUser![0]).toMatchObject(<LeaderboardItem>{
      roleIds: [TEST_GUILD_DATA.roleId1, TEST_GUILD_DATA.roleId2],
      userId: TEST_USER_ID,
      totalPoints: 15,
      // rank: 1,
    });
  });

  test("get user points", async () => {
    const response = await user.getPoints(TEST_USER_ID, TEST_WALLET_SIGNER);

    expect(response).toHaveLength(1);
    expect(response[0]).toEqual(<UserPointsItem>{
      guildId: TEST_GUILD_DATA.guildId,
      guildPlatformId: createdRolePlatform.guildPlatformId,
      roleIds: [TEST_GUILD_DATA.roleId1, TEST_GUILD_DATA.roleId2],
      totalPoints: 15,
    });
  });

  test("get user rank", async () => {
    const response = await user.getRankInGuild(
      TEST_USER_ID,
      TEST_GUILD_DATA.guildId,
      createdRolePlatform.guildPlatformId
    );

    expect(response).toMatchObject({
      userId: TEST_USER_ID,
      roleIds: [TEST_GUILD_DATA.roleId1, TEST_GUILD_DATA.roleId2],
      totalPoints: 15,
      rank: 1,
      address: TEST_WALLET.address.toLowerCase(),
    });
  });

  test("can delete guildPlatform", async () => {
    await guild.reward.delete(
      TEST_GUILD_DATA.guildId,
      createdRolePlatform.guildPlatformId,
      TEST_WALLET_SIGNER
    );
  });
});
