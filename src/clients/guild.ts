import {
  GetGuildMembersResponse,
  Guild,
  GuildCreationPayload,
  GuildCreationResponse,
  GuildSearchQueryParams,
  GuildUpdatePayload,
} from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";
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

  search: (params: GuildSearchQueryParams) =>
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

  create: (guildCreationParams: GuildCreationPayload, signer: SignerFunction) =>
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
    guildUpdateParams: GuildUpdatePayload,
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
};

export default guild;
