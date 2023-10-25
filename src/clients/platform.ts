import { type types } from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const platform = {
  getGuildByPlatform: (
    platformName: types.PlatformName,
    platformGuildId: string,
    signer?: SignerFunction
  ): Promise<types.GuildByPlatformResponse> =>
    callGuildAPI({
      url: `/platforms/${platformName}/guilds/${platformGuildId}`,
      method: "GET",
      signer,
    }),

  getUserGuildAccessByPlatform: (
    platformName: types.PlatformName,
    platformGuildId: string,
    platformUserId: string,
    signer?: SignerFunction
  ): Promise<types.UserGuildAccessesByPlatformResponse> =>
    callGuildAPI({
      url: `/platforms/${platformName}/guilds/${platformGuildId}/users/${platformUserId}/access`,
      method: "GET",
      signer,
    }),

  withPlatformName: (platformName: types.PlatformName) => ({
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

    getUserByPlatformUserId: (
      platformUserId: string,
      signer: SignerFunction
    ): Promise<types.User> =>
      callGuildAPI({
        url: `/platforms/${platformName}/users/${platformUserId}`,
        method: "GET",
        signer,
      }),
  }),
};

export type PlatformClient = typeof platform;
export default platform;
