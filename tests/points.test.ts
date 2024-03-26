import {
  LeaderboardItem,
  RoleCreationResponse,
  RoleReward,
  UserPointsItem,
} from "@guildxyz/types";
import { describe, expect, it, test } from "vitest";
import { CLIENT, TEST_ADDRESS, TEST_SIGNER, TEST_USER } from "./common";
import { createTestGuild } from "./utils";

const guild = await createTestGuild();
const role1 = guild.roles[0];

let createdRolePlatform: RoleReward;
let role2: RoleCreationResponse;

describe("points", () => {
  it("created second role", async () => {
    role2 = await CLIENT.guild.role.create(
      guild.id,
      {
        name: "Role 2",
        requirements: [{ type: "FREE" }],
      },
      TEST_SIGNER
    );

    expect(role2.id).toBeGreaterThan(0);
  });

  test("initially has no guildPlatform", async () => {
    const guildPlatforms = await CLIENT.guild.reward.getAll(
      guild.id,
      TEST_SIGNER
    );

    expect(guildPlatforms).toHaveLength(0);
  });

  test("can create a points reward", async () => {
    createdRolePlatform = await CLIENT.guild.role.reward.create(
      guild.id,
      role1.id,
      {
        guildPlatform: {
          platformGuildId: "my-points",
          platformName: "POINTS",
          platformGuildData: { name: "coins" },
        },
        platformRoleData: { score: "5" },
      },
      TEST_SIGNER
    );

    expect(createdRolePlatform.platformRoleData).toEqual({ score: "5" });
  });

  test("can create a points reward for other role", async () => {
    createdRolePlatform = await CLIENT.guild.role.reward.create(
      guild.id,
      role2.id,
      {
        guildPlatformId: createdRolePlatform.guildPlatformId,
        platformRoleData: { score: "10" },
      },
      TEST_SIGNER
    );

    expect(createdRolePlatform.platformRoleData).toEqual({ score: "10" });
  });

  test("get leaderboard - just for triggering revalidation", async () => {
    await CLIENT.guild.getLeaderboard(
      guild.id,
      createdRolePlatform.guildPlatformId
    );

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  });

  test("get leaderboard - not signed", async () => {
    const { leaderboard, aroundUser } = await CLIENT.guild.getLeaderboard(
      guild.id,
      createdRolePlatform.guildPlatformId
    );

    expect(leaderboard).toBeTruthy();
    expect(aroundUser).toBeFalsy();
    expect(leaderboard).toHaveLength(1);
    expect(leaderboard[0]).toMatchObject(<LeaderboardItem>{
      // roleIds: [role1.id, role2.id],
      userId: TEST_USER.id,
      totalPoints: 15,
      // rank: 1,
    });
  });

  test("get leaderboard - signed", async () => {
    const { leaderboard, aroundUser } = await CLIENT.guild.getLeaderboard(
      guild.id,
      createdRolePlatform.guildPlatformId,
      TEST_SIGNER
    );

    expect(leaderboard).toBeTruthy();
    expect(aroundUser).toBeTruthy();
    expect(aroundUser).toHaveLength(1);
    expect(leaderboard).toHaveLength(1);
    expect(leaderboard[0]).toMatchObject(<LeaderboardItem>{
      // roleIds: [role1.id, role2.id],
      userId: TEST_USER.id,
      totalPoints: 15,
      // rank: 1,
    });
    expect(aroundUser![0]).toMatchObject(<LeaderboardItem>{
      // roleIds: [role1.id, role2.id],
      userId: TEST_USER.id,
      totalPoints: 15,
      // rank: 1,
    });
  });

  test("get user points", async () => {
    const response = await CLIENT.user.getPoints(TEST_USER.id, TEST_SIGNER);

    expect(response).toHaveLength(1);
    expect(response[0]).toMatchObject(<UserPointsItem>{
      guildId: guild.id,
      guildPlatformId: createdRolePlatform.guildPlatformId,
      // roleIds: [role1.id, role2.id],
      totalPoints: 15,
    });
  });

  test("get user rank", async () => {
    const response = await CLIENT.user.getRankInGuild(
      TEST_USER.id,
      guild.id,
      createdRolePlatform.guildPlatformId
    );

    expect(response).toMatchObject({
      userId: TEST_USER.id,
      // roleIds: [role1.id, role2.id],
      totalPoints: 15,
      rank: 1,
      address: TEST_ADDRESS,
    });
  });

  test("can delete guildPlatform", async () => {
    await CLIENT.guild.reward.delete(
      guild.id,
      createdRolePlatform.guildPlatformId,
      TEST_SIGNER
    );
  });
});
