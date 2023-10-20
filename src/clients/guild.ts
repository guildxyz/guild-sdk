import type {
  GetGuildMembersResponse,
  Guild,
  GuildCreationResponse,
  Schemas,
} from "@guildxyz/types";
import { JoinActionPayloadSchema } from "@guildxyz/types/schemas/actions";
import {
  GuildCreationPayloadSchema,
  GuildGetManyQueryParamsSchema,
  GuildSearchQueryParamsSchema,
  GuildUpdatePayloadSchema,
} from "@guildxyz/types/schemas/guild";
import { callGuildAPI, type SignerFunction } from "../utils";

const guild = {
  get: (guildIdOrUrlName: number | string): Promise<Guild> =>
    callGuildAPI({ url: `/guilds/${guildIdOrUrlName}`, method: "GET" }),

  getMany: (guildIds: number[]): Promise<Guild[]> =>
    callGuildAPI({
      url: `/guilds`,
      method: "GET",
      queryParams: {
        guildIds: guildIds.join(","),
      },
      queryParamsSchema: GuildGetManyQueryParamsSchema,
    }),

  search: (params: Schemas["GuildSearchQueryParams"]): Promise<Guild[]> =>
    callGuildAPI({
      url: `/guilds`,
      method: "GET",
      queryParams: params,
      queryParamsSchema: GuildSearchQueryParamsSchema,
    }),

  getMembers: (
    guildId: number,
    signer?: SignerFunction
  ): Promise<GetGuildMembersResponse> =>
    callGuildAPI({
      url: `/guilds/${guildId}/members`,
      method: "GET",
      signer,
    }),

  getUserMemberships: (
    guildId: number,
    userId: number,
    signer?: SignerFunction
  ): Promise<Array<{ roleId: number; access: boolean }>> =>
    callGuildAPI({
      url: `/guilds/${guildId}/members/${userId}`,
      method: "GET",
      signer,
    }),

  create: (
    guildCreationParams: Schemas["GuildCreationPayload"],
    signer: SignerFunction
  ): Promise<GuildCreationResponse> =>
    callGuildAPI({
      url: `/guilds`,
      method: "POST",
      signer,
      body: {
        data: guildCreationParams,
        schema: GuildCreationPayloadSchema,
      },
    }),

  update: (
    guildId: number,
    guildUpdateParams: Schemas["GuildUpdatePayload"],
    signer: SignerFunction
  ): Promise<Guild> =>
    callGuildAPI({
      url: `/guilds/${guildId}`,
      method: "PUT",
      body: {
        data: guildUpdateParams,
        schema: GuildUpdatePayloadSchema,
      },
      signer,
    }),

  delete: (guildId: number, signer: SignerFunction): Promise<void> =>
    callGuildAPI({
      url: `/guilds/${guildId}`,
      method: "DELETE",
      signer,
    }),

  join: (
    guildId: number,
    signer: SignerFunction
  ): Promise<{ success: boolean; accessedRoleIds: number[] }> =>
    callGuildAPI({
      url: `/v1/user/join`,
      method: "POST",
      body: {
        schema: JoinActionPayloadSchema,
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

  accessCheck: (
    guildId: number,
    signer: SignerFunction
  ): Promise<{
    roleId: number;
    access: boolean | null;
    requirements: Array<{ requirementId: number; access: boolean | null }>;
    errors: Array<{
      requirementId: number;
      msg: string;
      errorType: string;
      subType: string;
    }>;
  }> =>
    callGuildAPI({
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
