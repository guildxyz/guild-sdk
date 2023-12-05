import { PlatformUser, Schemas } from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";

const platformUser = {
  get: (
    userIdOrAddress: string | number,
    platformId: number,
    signer: SignerFunction
  ) =>
    callGuildAPI<PlatformUser>({
      url: `/users/${userIdOrAddress}/platform-users/${platformId}`,
      method: "GET",
      signer,
    }),

  getAll: (userIdOrAddress: string | number, signer: SignerFunction) =>
    callGuildAPI<PlatformUser[]>({
      url: `/users/${userIdOrAddress}/platform-users`,
      method: "GET",
      signer,
    }),

  create: (
    userIdOrAddress: string | number,
    platformUserCreationParams: Schemas["PlatformUserCreation"],
    signer: SignerFunction
  ) =>
    callGuildAPI<PlatformUser>({
      url: `/users/${userIdOrAddress}/platform-users`,
      method: "POST",
      body: {
        schema: "PlatformUserCreationSchema",
        data: platformUserCreationParams,
      },
      signer,
    }),

  delete: (
    userIdOrAddress: string | number,
    platformId: number,
    signer: SignerFunction
  ) =>
    callGuildAPI<void>({
      url: `/users/${userIdOrAddress}/platform-users/${platformId}`,
      method: "DELETE",
      signer,
    }),
};

export default platformUser;
