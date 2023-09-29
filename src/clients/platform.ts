import {
  GuildByPlatformResponse,
  PlatformName,
  UserGuildAccessesByPlatformResponse,
} from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";

const platform = {
  getGuildByPlatform: (
    platformName: PlatformName,
    platformGuildId: string,
    signer?: SignerFunction
  ) =>
    callGuildAPI<GuildByPlatformResponse>({
      url: `/platforms/${platformName}/guilds/${platformGuildId}`,
      method: "GET",
      signer,
    }),

  getUserGuildAccessByPlatform: (
    platformName: PlatformName,
    platformGuildId: string,
    platformUserId: string,
    signer?: SignerFunction
  ) =>
    callGuildAPI<UserGuildAccessesByPlatformResponse>({
      url: `/platforms/${platformName}/guilds/${platformGuildId}/users/${platformUserId}/access`,
      method: "GET",
      signer,
    }),

  withPlatformName: (platformName: PlatformName) => ({
    getGuildByPlatform: (platformGuildId: string, signer?: SignerFunction) =>
      platform.getGuildByPlatform(platformName, platformGuildId, signer),

    getUserGuildAccessByPlatform: (
      platformGuildId: string,
      platformUserId: string,
      signer?: SignerFunction
    ) =>
      platform.getUserGuildAccessByPlatform(
        platformName,
        platformGuildId,
        platformUserId,
        signer
      ),
  }),
};

export default platform;
