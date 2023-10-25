import {
  GuildRewardCreationSchema,
  GuildRewardUpdateSchema,
  type types,
} from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const guildReward = {
  get: (
    guildIdOrUrlName: string | number,
    guildPlatformId: number,
    signer?: SignerFunction
  ): Promise<types.GuildReward> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms/${guildPlatformId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    guildIdOrUrlName: string | number,
    signer?: SignerFunction
  ): Promise<types.GuildReward[]> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms`,
      method: "GET",
      signer,
    }),

  create: (
    guildIdOrUrlName: string | number,
    guildPlatformCreationParams: types.Schemas["GuildRewardCreation"],
    signer: SignerFunction
  ): Promise<types.GuildReward> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms`,
      method: "POST",
      body: {
        schema: GuildRewardCreationSchema,
        data: guildPlatformCreationParams,
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: string | number,
    guildPlatformId: number,
    guildPlatformUpdateParams: types.Schemas["GuildRewardUpdate"],
    signer: SignerFunction
  ): Promise<types.GuildReward> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms/${guildPlatformId}`,
      method: "PUT",
      body: {
        schema: GuildRewardUpdateSchema,
        data: guildPlatformUpdateParams,
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: string | number,
    guildPlatformId: number,
    signer: SignerFunction
  ): Promise<void> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms/${guildPlatformId}`,
      method: "DELETE",
      signer,
    }),
};

export type GuildRewardClient = typeof guildReward;
export default guildReward;
