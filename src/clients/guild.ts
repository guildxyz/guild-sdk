import {
  AccessCheckJob,
  GetGuildMembersResponse,
  Guild,
  GuildCreationResponse,
  JoinJob,
  Schemas,
} from "@guildxyz/types";
import {
  PollOptions,
  SignerFunction,
  callGuildAPI,
  createAndAwaitJob,
} from "../utils";
import guildReward from "./guildReward";
import role from "./role";

const guild = {
  role,

  reward: guildReward,

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

  getMembers: (guildId: number, signer?: SignerFunction) =>
    callGuildAPI<GetGuildMembersResponse>({
      url: `/guilds/${guildId}/members`,
      method: "GET",
      signer,
    }),

  getMemberAccess: (guildId: number, userId: number, signer?: SignerFunction) =>
    callGuildAPI<GetGuildMembersResponse>({
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

  join: (
    guildId: number,
    signer: SignerFunction,
    pollOptions?: PollOptions<JoinJob>
  ) =>
    createAndAwaitJob<JoinJob>(
      "/actions/join",
      {
        schema: "JoinActionPayloadSchema",
        data: { guildId },
      },
      { guildId },
      signer,
      pollOptions
    ),

  accessCheck: (
    guildId: number,
    signer: SignerFunction,
    pollOptions?: PollOptions<AccessCheckJob>
  ) =>
    createAndAwaitJob<AccessCheckJob>(
      "/actions/access-check",
      {
        schema: "JoinActionPayloadSchema",
        data: { guildId },
      },
      { guildId },
      signer,
      pollOptions
    ),

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
