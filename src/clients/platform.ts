import {
  GuildByPlatformResponse,
  PlatformName,
  User,
  UserGuildAccessesByPlatformResponse,
} from "@guildxyz/types";
import { SignerFunction, callGuildAPI, createSigner } from "../utils";

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

  getUserByPlatformUserId: (
    platformName: PlatformName,
    platformUserId: string
  ) =>
    callGuildAPI<User>({
      url: `/platforms/${platformName}/users/${platformUserId}`,
      method: "GET",
      signer: createSigner.apiKeySigner(),
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

    getUserByPlatformUserId: (platformUserId: string) =>
      platform.getUserByPlatformUserId(platformName, platformUserId),
  }),
};

export default platform;
