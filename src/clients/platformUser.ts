import { PlatformUserCreationSchema, type types } from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const platformUser = {
  get: (
    userIdOrAddress: string | number,
    platformId: number,
    signer: SignerFunction
  ): Promise<types.PlatformUser> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/platform-users/${platformId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    userIdOrAddress: string | number,
    signer: SignerFunction
  ): Promise<types.PlatformUser[]> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/platform-users`,
      method: "GET",
      signer,
    }),

  create: (
    userIdOrAddress: string | number,
    platformUserCreationParams: types.Schemas["PlatformUserCreation"],
    signer: SignerFunction
  ): Promise<types.PlatformUser> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/platform-users`,
      method: "POST",
      body: {
        schema: PlatformUserCreationSchema,
        data: platformUserCreationParams,
      },
      signer,
    }),

  delete: (
    userIdOrAddress: string | number,
    platformId: number,
    signer: SignerFunction
  ): Promise<void> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/platform-users/${platformId}`,
      method: "DELETE",
      signer,
    }),
};

export type PlatformUserClient = typeof platformUser;
export default platformUser;
