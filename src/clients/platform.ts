import type {
  GuildByPlatformResponse,
  PlatformName,
  User,
  UserGuildAccessesByPlatformResponse,
} from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const platform = {
  getGuildByPlatform: (
    platformName: PlatformName,
    platformGuildId: string,
    signer?: SignerFunction
  ): Promise<GuildByPlatformResponse> =>
    callGuildAPI({
      url: `/platforms/${platformName}/guilds/${platformGuildId}`,
      method: "GET",
      signer,
    }),

  getUserGuildAccessByPlatform: (
    platformName: PlatformName,
    platformGuildId: string,
    platformUserId: string,
    signer?: SignerFunction
  ): Promise<UserGuildAccessesByPlatformResponse> =>
    callGuildAPI({
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

    getUserByPlatformUserId: (
      platformUserId: string,
      signer: SignerFunction
    ): Promise<User> =>
      callGuildAPI({
        url: `/platforms/${platformName}/users/${platformUserId}`,
        method: "GET",
        signer,
      }),
  }),
};

export default platform;
