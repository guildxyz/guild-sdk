import {
  AvailableTextsResponse,
  GuildReward,
  GuildRewardCreationPayload,
  GuildRewardUpdatePayload,
} from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";

const guildReward = {
  get: (
    guildIdOrUrlName: string | number,
    guildPlatformId: number,
    signer?: SignerFunction
  ) =>
    callGuildAPI<GuildReward>({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms/${guildPlatformId}`,
      method: "GET",
      signer,
    }),

  getAll: (guildIdOrUrlName: string | number, signer?: SignerFunction) =>
    callGuildAPI<GuildReward[]>({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms`,
      method: "GET",
      signer,
    }),

  getAvailableTexts: (
    guildIdOrUrlName: string | number,
    guildPlatformId: number
  ) =>
    callGuildAPI<AvailableTextsResponse>({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms/${guildPlatformId}/available-texts`,
      method: "GET",
    }),

  create: (
    guildIdOrUrlName: string | number,
    guildPlatformCreationParams: GuildRewardCreationPayload,
    signer: SignerFunction
  ) =>
    callGuildAPI<GuildReward>({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms`,
      method: "POST",
      body: {
        schema: "GuildRewardCreationSchema",
        data: guildPlatformCreationParams,
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: string | number,
    guildPlatformId: number,
    guildPlatformUpdateParams: GuildRewardUpdatePayload,
    signer: SignerFunction
  ) =>
    callGuildAPI<GuildReward>({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms/${guildPlatformId}`,
      method: "PUT",
      body: {
        schema: "GuildRewardUpdateSchema",
        data: guildPlatformUpdateParams,
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: string | number,
    guildPlatformId: number,
    signer: SignerFunction
  ) =>
    callGuildAPI<void>({
      url: `/guilds/${guildIdOrUrlName}/guild-platforms/${guildPlatformId}`,
      method: "DELETE",
      signer,
    }),
};

export default guildReward;
