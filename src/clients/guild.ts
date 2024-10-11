import {
  GetGuildMembersResponse,
  GetLeaderboardResponse,
  Guild,
  GuildCreationResponse,
  Schemas,
} from "@guildxyz/types";
import {
  SignerFunction,
  callGuildAPI,
  castDateInLeaderboardItem,
} from "../utils";
import guildAdmin from "./guildAdmin";
import guildReward from "./guildReward";
import role from "./role";

const guild = {
  role,

  reward: guildReward,

  admin: guildAdmin,

  get: (guildIdOrUrlName: number | string) =>
    callGuildAPI<Guild>({ url: `/guilds/${guildIdOrUrlName}`, method: "GET" }),

  getMany: (guildIds: number[]) =>
    callGuildAPI<Guild[]>({
      url: `/guilds`,
      method: "GET",
      queryParams: {
        guildIds: guildIds.join(","),
      },
      queryParamsSchema: "GuildGetManyQueryParamsSchema",
    }),

  search: (params: Schemas["GuildSearchQueryParams"]) =>
    callGuildAPI<Guild[]>({
      url: `/guilds`,
      method: "GET",
      queryParams: params,
      queryParamsSchema: "GuildSearchQueryParamsSchema",
    }),

  /**
   * If a signer is provided, the response will include an aroundUser field, which holds leaderboard items from around the signer user
   */
  getLeaderboard: (
    guildIdOrUrlName: number | string,
    guildPlatformId: number,
    signer?: SignerFunction,
    isAllUser: boolean = false,
    forceRecalculate: boolean = false
  ) =>
    callGuildAPI<GetLeaderboardResponse>({
      url: `/guilds/${guildIdOrUrlName}/points/${guildPlatformId}/leaderboard?isAllUser=${isAllUser}&forceRecalculate=${forceRecalculate}`,
      method: "GET",
      signer,
    }).then(
      (result) =>
        <GetLeaderboardResponse>{
          aroundUser: result.aroundUser?.map(castDateInLeaderboardItem),
          leaderboard: result.leaderboard.map(castDateInLeaderboardItem),
          isRevalidating: !!result.isRevalidating,
        }
    ),

  getMembers: (guildId: number, signer?: SignerFunction) =>
    callGuildAPI<GetGuildMembersResponse>({
      url: `/guilds/${guildId}/members`,
      method: "GET",
      signer,
    }),

  getUserMemberships: (
    guildId: number,
    userId: number,
    signer?: SignerFunction
  ) =>
    callGuildAPI<Array<{ roleId: number; access: boolean }>>({
      url: `/guilds/${guildId}/members/${userId}`,
      method: "GET",
      signer,
    }),

  create: (
    guildCreationParams: Schemas["GuildCreationPayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<GuildCreationResponse>({
      url: `/guilds`,
      method: "POST",
      signer,
      body: {
        data: guildCreationParams,
        schema: "GuildCreationPayloadSchema",
      },
    }),

  update: (
    guildId: number,
    guildUpdateParams: Schemas["GuildUpdatePayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<Guild>({
      url: `/guilds/${guildId}`,
      method: "PUT",
      body: {
        data: guildUpdateParams,
        schema: "GuildUpdatePayloadSchema",
      },
      signer,
    }),

  delete: (guildId: number, signer: SignerFunction) =>
    callGuildAPI<void>({
      url: `/guilds/${guildId}`,
      method: "DELETE",
      signer,
    }),

  join: (guildId: number, signer: SignerFunction) =>
    callGuildAPI<{ success: boolean; accessedRoleIds: number[] }>({
      url: `/v1/user/join`,
      method: "POST",
      body: {
        schema: "JoinActionPayloadSchema",
        data: {
          guildId,
        },
      },
      signer,
    }),

  // join: (
  //   guildId: number,
  //   signer: SignerFunction,
  //   pollOptions?: PollOptions<JoinJob>
  // ) =>
  //   createAndAwaitJob<JoinJob>(
  //     "/actions/join",
  //     {
  //       schema: "JoinActionPayloadSchema",
  //       data: { guildId },
  //     },
  //     { guildId },
  //     signer,
  //     pollOptions
  //   ),

  accessCheck: (guildId: number, signer: SignerFunction) =>
    callGuildAPI<
      Array<{
        roleId: number;
        access: boolean | null;
        requirements: Array<{ requirementId: number; access: boolean | null }>;
        errors: Array<{
          requirementId: number;
          msg: string;
          errorType: string;
          subType: string;
        }>;
      }>
    >({
      url: `/v1/guild/access/${guildId}/0x0000000000000000000000000000000000000000`,
      method: "GET",
      signer,
    }),

  // accessCheck: (
  //   guildId: number,
  //   signer: SignerFunction,
  //   pollOptions?: PollOptions<AccessCheckJob>
  // ) =>
  //   createAndAwaitJob<AccessCheckJob>(
  //     "/actions/access-check",
  //     {
  //       schema: "JoinActionPayloadSchema",
  //       data: { guildId },
  //     },
  //     { guildId },
  //     signer,
  //     pollOptions
  //   ),

  // statusUpdate: async (
  //   guildId: number,
  //   signer: SignerFunction,
  //   pollOptions?: PollOptions<StatusUpdateJob>
  // ) => {
  //   const roles = await guild.role.getAll(guildId, signer);
  //   return createAndAwaitJob<StatusUpdateJob>(
  //     "/actions/status-update",
  //     {
  //       schema: "StatusUpdateActionPayloadSchema",
  //       data: {
  //         roleIds: (roles ?? []).map(({ id }) => id),
  //       },
  //     },
  //     { guildId },
  //     signer,
  //     pollOptions
  //   );
  // },
};

export default guild;
